from models import Crop

WATER_LEVELS = {"low": 0, "medium": 1, "high": 2}

def get_recommendations(db_session, soil_type: str, season: str, water_availability: str, temp: float, rainfall: float):
    all_crops = db_session.query(Crop).all()
    scored_crops = []

    for crop in all_crops:
        score = 0
        breakdown = {}

        # --- Soil match (0 or 30) ---
        soils = [s.strip().lower() for s in crop.suitable_soils.split(',')]
        soil_match = soil_type.lower() in soils
        if soil_match:
            score += 30
            breakdown["soil"] = "match"
        else:
            breakdown["soil"] = "mismatch"

        # --- Season match (0 or 25) ---
        seasons = [s.strip().lower() for s in crop.suitable_seasons.split(',')]
        season_match = season.lower() in seasons
        if season_match:
            score += 25
            breakdown["season"] = "match"
        else:
            breakdown["season"] = "mismatch"

        # --- Water match (0, 10, or 20) ---
        crop_water = crop.water_requirement.lower()
        user_water = water_availability.lower()
        if crop_water == user_water:
            score += 20
            breakdown["water"] = "exact"
        else:
            crop_level = WATER_LEVELS.get(crop_water, 1)
            user_level = WATER_LEVELS.get(user_water, 1)
            if abs(crop_level - user_level) == 1:
                score += 10
                breakdown["water"] = "close"
            else:
                breakdown["water"] = "mismatch"

        # --- Temperature fit (0, 5, 10, or 15) ---
        if crop.min_temp <= temp <= crop.max_temp:
            score += 15
            breakdown["temp"] = "ideal"
        elif (crop.min_temp - 5) <= temp <= (crop.max_temp + 5):
            score += 8
            breakdown["temp"] = "acceptable"
        elif (crop.min_temp - 10) <= temp <= (crop.max_temp + 10):
            score += 3
            breakdown["temp"] = "marginal"
        else:
            breakdown["temp"] = "poor"

        # --- Rainfall fit (0, 5, or 10) ---
        if crop.min_rainfall <= rainfall <= crop.max_rainfall:
            score += 10
            breakdown["rainfall"] = "ideal"
        elif (crop.min_rainfall - 20) <= rainfall <= (crop.max_rainfall + 30):
            score += 5
            breakdown["rainfall"] = "acceptable"
        else:
            breakdown["rainfall"] = "poor"

        # Determine weather tag based on temp+rainfall sub-scores
        weather_sub = 0
        if breakdown["temp"] in ("ideal",):
            weather_sub += 2
        elif breakdown["temp"] in ("acceptable",):
            weather_sub += 1
        if breakdown["rainfall"] in ("ideal",):
            weather_sub += 2
        elif breakdown["rainfall"] in ("acceptable",):
            weather_sub += 1

        if weather_sub >= 3:
            weather_tag = "Good"
        elif weather_sub >= 1:
            weather_tag = "Moderate"
        else:
            weather_tag = "Poor"

        # Only include crops that match at least soil OR season
        if soil_match or season_match:
            scored_crops.append({
                "crop_name_en": crop.crop_name_en,
                "crop_name_mr": crop.crop_name_mr,
                "reason_en": crop.reason_en,
                "reason_mr": crop.reason_mr,
                "water_req": crop.water_requirement,
                "profit_per_acre": crop.profit_per_acre,
                "match_score": score,
                "weather_tag": weather_tag,
                "breakdown": breakdown
            })

    # Sort by score descending
    scored_crops.sort(key=lambda x: x["match_score"], reverse=True)

    # Return top 8
    return scored_crops[:8]
