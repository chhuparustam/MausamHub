from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv()  # load .env
API_KEY = os.getenv("OPENWEATHER_API_KEY")
CURRENT_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"

app = Flask(__name__)

def get_weather_data(city):
    """Fetch current weather data for a city"""
    try:
        url = f"{CURRENT_WEATHER_URL}?q={city}&appid={API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None

def get_forecast_data(city):
    """Fetch 5-day forecast data (3-hour intervals)"""
    try:
        url = f"{FORECAST_URL}?q={city}&appid={API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json()
        return None
    except:
        return None

def process_hourly_forecast(forecast_data):
    """Extract next 8 hours of forecast"""
    if not forecast_data or 'list' not in forecast_data:
        return []
    
    hourly = []
    for i, item in enumerate(forecast_data['list'][:8]):  # Next 24 hours (8 x 3hr intervals)
        hourly.append({
            'time': datetime.fromtimestamp(item['dt']).strftime('%H:%M'),
            'temp': round(item['main']['temp']),
            'icon': item['weather'][0]['icon'],
            'desc': item['weather'][0]['description']
        })
    return hourly

def process_weekly_forecast(forecast_data):
    """Extract daily forecast for next 5 days"""
    if not forecast_data or 'list' not in forecast_data:
        return []
    
    daily_data = {}
    for item in forecast_data['list']:
        date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
        if date not in daily_data:
            daily_data[date] = {
                'temps': [],
                'icon': item['weather'][0]['icon'],
                'desc': item['weather'][0]['description'],
                'date': datetime.fromtimestamp(item['dt'])
            }
        daily_data[date]['temps'].append(item['main']['temp'])
    
    weekly = []
    for date, data in list(daily_data.items())[:5]:
        weekly.append({
            'day': data['date'].strftime('%a'),
            'date': data['date'].strftime('%b %d'),
            'icon': data['icon'],
            'desc': data['desc'],
            'max_temp': round(max(data['temps'])),
            'min_temp': round(min(data['temps']))
        })
    return weekly

@app.route("/", methods=["GET", "POST"])
def index():
    # Default city
    city = "London"
    
    if request.method == "POST":
        city = request.form.get("city", "London")
    
    # Get current weather
    current_data = get_weather_data(city)
    
    if not current_data:
        return render_template("index.html", error="City not found. Please try again.")
    
    # Get forecast data
    forecast_data = get_forecast_data(city)
    
    # Process data
    weather_data = {
        "city": current_data['name'],
        "country": current_data['sys']['country'],
        "temp": round(current_data['main']['temp']),
        "feels": round(current_data['main']['feels_like']),
        "desc": current_data['weather'][0]['description'].title(),
        "humidity": current_data['main']['humidity'],
        "wind": round(current_data['wind']['speed'] * 3.6),  # Convert m/s to km/h
        "icon": current_data['weather'][0]['icon'],
        "pressure": current_data['main']['pressure'],
        "precipitation": 0  # OpenWeather free tier doesn't provide this directly
    }
    
    hourly_forecast = process_hourly_forecast(forecast_data)
    weekly_forecast = process_weekly_forecast(forecast_data)
    
    # Other cities (pre-defined)
    other_cities = []
    for other_city in ["New York", "Tokyo", "Paris"]:
        other_data = get_weather_data(other_city)
        if other_data:
            other_cities.append({
                "name": other_data['name'],
                "temp": round(other_data['main']['temp']),
                "icon": other_data['weather'][0]['icon'],
                "desc": other_data['weather'][0]['description'].title()
            })
    
    return render_template("index.html", 
                         weather=weather_data,
                         hourly=hourly_forecast,
                         weekly=weekly_forecast,
                         other_cities=other_cities)

if __name__ == "__main__":
    app.run(debug=True)
