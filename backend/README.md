# Smart Crop Recommendation Backend

## Tech Stack
* Python 3
* FastAPI
* PostgreSQL
* SQLAlchemy
* Uvicorn

## Database Setup
1. Download and install PostgreSQL.
2. Open pgAdmin or `psql` shell, and create a database named `cropdb`:
   ```sql
   CREATE DATABASE cropdb;
   ```

## Setup & Run Instructions

1. Install Dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Environment Variables (`.env`):
   Ensure you have a `.env` file in the `backend/` directory:
   ```env
   WEATHERAPI_KEY=your_weatherapi_key
   DATABASE_URL=postgresql://user:password@localhost/cropdb
   ```

3. Seed Initial Data:
   This populates the database with 15 crops tailored for Maharashtra.
   ```bash
   python seed.py
   ```

4. Start the Application:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

## API Endpoints

### 1. `GET /health`
Returns the status of the API.
**Response**:
```json
{
  "status": "ok"
}
```

### 2. `GET /crops`
Returns all rows from the `crops` table.

### 3. `POST /recommend`
Recommends crops based on inputs.
**Request**:
```json
{
  "location": "Pune",
  "soil_type": "Black",
  "season": "Rabi",
  "water_availability": "Medium",
  "land_size": 2.5
}
```
**Response**:
```json
{
  "weather": {
    "temp": 22.5,
    "rainfall": 50.0,
    "location": "Pune"
  },
  "recommendations": [
    {
      "crop_name_en": "Wheat",
      "crop_name_mr": "गहू",
      "reason_en": "Good winter crop with stable demand.",
      "reason_mr": "चांगले हिवाळी पीक, मागणी स्थिर.",
      "water_req": "Medium",
      "profit_per_acre": 25000,
      "match_score": 2,
      "weather_tag": "Good"
    }
  ]
}
```
