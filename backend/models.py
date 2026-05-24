from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    crop_name_en = Column(String, index=True)
    crop_name_mr = Column(String, index=True)
    suitable_soils = Column(String)
    suitable_seasons = Column(String)
    water_requirement = Column(String)
    min_temp = Column(Float)
    max_temp = Column(Float)
    min_rainfall = Column(Float)
    max_rainfall = Column(Float)
    profit_per_acre = Column(Integer)
    reason_en = Column(String)
    reason_mr = Column(String)

class RecommendationLog(Base):
    __tablename__ = "recommendations_log"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True)
    soil_type = Column(String)
    season = Column(String)
    water_availability = Column(String)
    land_size = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
