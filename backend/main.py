from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
import time

from database import engine, Base, get_db
from models import Crop, RecommendationLog
from weather import get_weather, LocationNotFoundError, WeatherFetchError
from recommender import get_recommendations
from soil_data import get_soil_info

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Crop Recommendation API")

# ──────────────────────────────────────────────────────────────────────
# MIDDLEWARE ORDER IS CRITICAL
# Starlette middleware is a stack: LAST added = OUTERMOST (runs first).
# CORS must be added AFTER the rate limiter so it wraps ALL responses,
# ensuring even 429 errors carry the correct Access-Control headers.
# Without this, the browser sees an opaque network error ("Failed to fetch").
# ──────────────────────────────────────────────────────────────────────

# Simple in-memory rate limiter: max 60 requests per minute per IP
rate_limit_records = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Allow health check without rate limiting
    if request.url.path == "/health":
        return await call_next(request)
        
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Filter out timestamps older than 60 seconds
    ip_records = rate_limit_records.get(client_ip, [])
    ip_records = [t for t in ip_records if now - t < 60]
    rate_limit_records[client_ip] = ip_records
    
    if len(ip_records) >= 60:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again after some time."}
        )
        
    rate_limit_records[client_ip].append(now)
    return await call_next(request)

# CORS — MUST be added last so it wraps the rate limiter
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",   # Vite preview mode
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class RecommendRequest(BaseModel):
    location: str
    soil_type: str
    season: str
    water_availability: str
    land_size: Optional[float] = None

class RecommendationResponseItem(BaseModel):
    crop_name_en: str
    crop_name_mr: str
    reason_en: str
    reason_mr: str
    water_req: str
    profit_per_acre: int
    match_score: int
    weather_tag: str
    breakdown: Dict[str, str]

class CropResponse(BaseModel):
    crop_name_en: str
    crop_name_mr: str
    soil_type: str
    season: str
    water_req: str
    profit_per_acre: int

    class Config:
        from_attributes = True

class WeatherData(BaseModel):
    temp: float
    rainfall: float
    location: str
    condition: Optional[str] = "Clear"
    cloud: Optional[int] = 0

class NutrientInfo(BaseModel):
    level: str
    pct: int

class SoilInfoResponse(BaseModel):
    name_en: str
    name_mr: str
    color_hex: str
    color_name_en: str
    color_name_mr: str
    ph_min: float
    ph_max: float
    ph_avg: float
    description_en: str
    description_mr: str
    nutrients: Dict[str, NutrientInfo]
    properties: Dict[str, str]
    tips_en: str
    tips_mr: str

class AnalysisSummary(BaseModel):
    total_crops_in_db: int
    crops_evaluated: int
    crops_returned: int
    top_match_score: int
    avg_match_score: float
    query_soil: str
    query_season: str
    query_water: str

class RecommendResponse(BaseModel):
    weather: WeatherData
    soil_info: SoilInfoResponse
    recommendations: List[RecommendationResponseItem]
    analysis: AnalysisSummary

def sanitize_location(loc: str) -> str:
    cleaned = loc.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail="Location name cannot be empty.")
    if len(cleaned) > 80:
        raise HTTPException(status_code=400, detail="Location name is too long (maximum 80 characters).")
    # Allow alphanumeric characters, spaces, commas, dots, dashes, and single quotes (for coordinate lookups and standard names)
    if not all(c.isalnum() or c in " ,.-'" for c in cleaned):
        raise HTTPException(status_code=400, detail="Location name contains invalid characters.")
    return cleaned

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/crops", response_model=List[CropResponse])
def get_all_crops(db: Session = Depends(get_db)):
    crops = db.query(Crop).all()
    return crops

@app.get("/weather", response_model=WeatherData)
def get_live_weather(q: str):
    cleaned_q = sanitize_location(q)
    try:
        weather_data = get_weather(cleaned_q)
        return weather_data
    except LocationNotFoundError as e:
        raise HTTPException(status_code=404, detail="Location not found. Please enter a valid city or district name.")
    except WeatherFetchError as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/recommend", response_model=RecommendResponse)
def recommend_crops(req: RecommendRequest, db: Session = Depends(get_db)):
    # Sanitize input location
    req.location = sanitize_location(req.location)
    
    # 1. Get weather
    try:
        weather_data = get_weather(req.location)
    except LocationNotFoundError as e:
        raise HTTPException(status_code=404, detail="Location not found. Please enter a valid city or district name.")
    except WeatherFetchError as e:
        raise HTTPException(status_code=503, detail="Weather service unavailable. Please try again later.")
        
    temp = weather_data["temp"]
    rainfall = weather_data["rainfall"]
    
    # 2. Get soil info
    soil_info = get_soil_info(req.soil_type)
    
    # 3. Get recommendations
    recs = get_recommendations(
        db_session=db,
        soil_type=req.soil_type,
        season=req.season,
        water_availability=req.water_availability,
        temp=temp,
        rainfall=rainfall
    )
    
    # 4. Build analysis summary
    total_crops = db.query(Crop).count()
    top_score = recs[0]["match_score"] if recs else 0
    avg_score = round(sum(r["match_score"] for r in recs) / len(recs), 1) if recs else 0
    
    analysis = {
        "total_crops_in_db": total_crops,
        "crops_evaluated": total_crops,
        "crops_returned": len(recs),
        "top_match_score": top_score,
        "avg_match_score": avg_score,
        "query_soil": req.soil_type,
        "query_season": req.season,
        "query_water": req.water_availability
    }
    
    # 5. Log query
    log_entry = RecommendationLog(
        location=req.location,
        soil_type=req.soil_type,
        season=req.season,
        water_availability=req.water_availability,
        land_size=req.land_size
    )
    db.add(log_entry)
    db.commit()
    
    # 6. Return response
    return {
        "weather": weather_data,
        "soil_info": soil_info,
        "recommendations": recs,
        "analysis": analysis
    }
