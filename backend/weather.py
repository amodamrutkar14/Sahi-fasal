import os
import requests
from dotenv import load_dotenv

load_dotenv()

class LocationNotFoundError(Exception):
    pass

class WeatherFetchError(Exception):
    pass

def get_weather(location: str):
    api_key = os.getenv("WEATHERAPI_KEY")
    if not api_key:
        raise WeatherFetchError("WeatherAPI key not configured in environment variables.")

    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}"
    
    try:
        response = requests.get(url, timeout=10)
    except requests.RequestException:
        raise WeatherFetchError("Failed to connect to WeatherAPI.")

    data = response.json()

    # 1006 is the specific error code from WeatherAPI when location is not found
    if response.status_code == 400 and data.get("error", {}).get("code") == 1006:
        raise LocationNotFoundError(f"Location not found: {location}")

    if response.status_code != 200:
        raise WeatherFetchError(f"WeatherAPI error: {data.get('error', {}).get('message', 'Unknown error')}")

    try:
        temp_c = data["current"]["temp_c"]
        precip_mm = data["current"]["precip_mm"]
        extracted_location = data["location"]["name"]
        condition = data["current"].get("condition", {}).get("text", "Clear")
        cloud = data["current"].get("cloud", 0)
        return {
            "temp": temp_c,
            "rainfall": precip_mm,
            "location": extracted_location,
            "condition": condition,
            "cloud": cloud
        }
    except KeyError:
        raise WeatherFetchError("Unexpected data format returned from WeatherAPI.")
