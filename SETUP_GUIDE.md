# Travel Recommendation App - Complete Setup Guide

## 🚀 Features Implemented

### Backend (Django REST API)
- ✅ Destination management with full CRUD operations
- ✅ Map location selection (latitude/longitude)
- ✅ Real-time weather API integration (OpenWeatherMap)
- ✅ Travel options (Bus, Car, Bike, Plane, Train)
- ✅ Destination categories and pricing
- ✅ Image upload support
- ✅ ML-powered recommendations
- ✅ Review system with sentiment analysis

### Frontend (React)
- ✅ Voice input (English & Urdu) for search
- ✅ Admin dashboard with destination management
- ✅ Interactive map for location selection
- ✅ Real-time weather display
- ✅ Modern UI with Tailwind CSS
- ✅ Responsive design

---

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL (or use SQLite for development)
- OpenWeatherMap API key (free tier available)

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```powershell
cd E:\Projects\Travel_Recommendation_app\travel-buddy-backend
```

### 2. Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\activate
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Install ML Models (Optional but Recommended)
```powershell
python -m spacy download en_core_web_sm
```

### 5. Configure Environment Variables

Edit `.env` file and add your OpenWeather API key:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

**Get free API key:** https://openweathermap.org/api

### 6. Run Database Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Admin User
```powershell
python manage.py createsuperuser
```

### 8. Start Development Server
```powershell
python manage.py runserver
```

**Backend will be available at:** `http://localhost:8000`
**Admin panel:** `http://localhost:8000/admin`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```powershell
cd E:\Projects\Travel_Recommendation_app\travel-buddy-frontend
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start Development Server
```powershell
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

---

## 📍 How to Use the Destination Management System

### Adding a New Destination

1. **Access Admin Dashboard**
   - Navigate to the frontend
   - Login as admin
   - Go to "Destinations" tab

2. **Click "Add Destination" Button**

3. **Fill in Basic Information**
   - Name (e.g., "Hunza Valley")
   - Country (e.g., "Pakistan")
   - Description
   - Category (Mountain, Beach, City, etc.)
   - Price Range (Budget, Moderate, Luxury)
   - Best Season
   - Upload Image

4. **Select Location on Map**
   - Click on the interactive map to set coordinates
   - OR manually enter latitude/longitude
   - Coordinates are automatically updated

5. **Choose Travel Options**
   - Select available transport methods:
     - ✈️ Plane
     - 🚌 Bus
     - 🚗 Car
     - 🚲 Bike
     - 🚂 Train

6. **Get Real-Time Weather**
   - Enter weather area/city name (e.g., "Gilgit")
   - Click "Fetch Real-Time Weather"
   - Weather data is automatically populated
   - Shows:
     - Temperature
     - Weather conditions
     - Humidity
     - Wind speed
     - Cloud coverage

7. **Submit Form**
   - Click "Add Destination"
   - Data is saved to the backend
   - Destination appears in the list

---

## 🌤️ Weather API Integration

### Backend Endpoint
```
GET /api/weather/
```

### Query Parameters
- By city: `?city=Gilgit`
- By coordinates: `?lat=35.9208&lon=74.3143`

### Example Response
```json
{
  "location": "Gilgit",
  "temperature": 15.5,
  "feels_like": 14.2,
  "temp_min": 12.0,
  "temp_max": 18.0,
  "humidity": 65,
  "pressure": 1013,
  "weather": "Clear",
  "description": "clear sky",
  "icon": "01d",
  "wind_speed": 2.5,
  "clouds": 10,
  "coordinates": {
    "lat": 35.9208,
    "lon": 74.3143
  }
}
```

---

## 🎤 Voice Input Feature

### How to Use
1. Click the **language icon** (🌐) to select language
   - English (en-US)
   - اردو - Urdu (ur-PK)

2. Click the **microphone button** (🎤)
3. Speak your travel query
4. Text appears automatically in the search field
5. Click microphone again to stop

### Browser Support
- ✅ Chrome/Edge (full support)
- ✅ Safari (macOS/iOS)
- ⚠️ Firefox (limited support)

---

## 🗺️ Map Integration

The destination form includes an interactive map:
- **Click anywhere** to set destination location
- **Coordinates update automatically**
- **Visual marker** shows selected location
- Coordinates can also be entered manually

---

## 🔌 API Endpoints

### Destinations
```
GET    /api/destinations/                 - List all destinations
POST   /api/destinations/                 - Create destination
GET    /api/destinations/{id}/            - Get destination details
PUT    /api/destinations/{id}/            - Update destination
DELETE /api/destinations/{id}/            - Delete destination
GET    /api/destinations/ml_recommended/  - ML recommendations
GET    /api/destinations/{id}/similar/    - Similar destinations
```

### Weather
```
GET    /api/weather/                      - Get real-time weather
```

### Reviews
```
GET    /api/reviews/                      - List all reviews
POST   /api/reviews/                      - Create review
GET    /api/reviews/?destination={id}     - Get destination reviews
```

---

## 🗄️ Database Schema

### Destination Model
```python
- id (AutoField)
- name (CharField)
- country (CharField)
- description (TextField)
- image (ImageField)
- category (CharField) - beach, mountain, city, historical, adventure, cultural
- price_range (CharField) - budget, moderate, luxury
- best_season (CharField)
- rating (DecimalField)
- latitude (DecimalField)
- longitude (DecimalField)
- travel_options (JSONField) - ["bus", "car", "bike", "plane", "train"]
- general_weather (CharField)
- weather_area (CharField)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

---

## 🧪 Testing

### Test Weather API
```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/weather/?city=Gilgit"
```

### Test Destination Creation
```powershell
# Use the admin dashboard or make API calls
curl -X POST http://localhost:8000/api/destinations/ -H "Content-Type: application/json" -d "{...}"
```

---

## 🎯 Quick Start Commands

### Backend
```powershell
cd travel-buddy-backend
.\venv\Scripts\activate
python manage.py runserver
```

### Frontend
```powershell
cd travel-buddy-frontend
npm run dev
```

---

## 🐛 Troubleshooting

### Issue: Weather API Returns Error
**Solution:** 
- Check if `OPENWEATHER_API_KEY` is set in `.env`
- Verify API key is valid at https://openweathermap.org
- Wait a few hours after signing up (API activation delay)

### Issue: Voice Input Not Working
**Solution:**
- Use Chrome or Edge browser
- Allow microphone permissions
- Check if site is served over HTTPS or localhost

### Issue: Map Not Interactive
**Solution:**
- Click anywhere on the map area
- Check browser console for errors
- Ensure JavaScript is enabled

### Issue: CORS Errors
**Solution:**
- Verify `CORS_ALLOWED_ORIGINS` in backend `.env`
- Should include: `http://localhost:5173`
- Restart backend server after changes

### Issue: Image Upload Fails
**Solution:**
- Check `MEDIA_ROOT` and `MEDIA_URL` in Django settings
- Ensure media folder exists
- Check file size limits

---

## 📚 Additional Resources

- **Django Documentation:** https://docs.djangoproject.com/
- **React Documentation:** https://react.dev/
- **OpenWeather API:** https://openweathermap.org/api
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 🎉 Success!

Your Travel Recommendation App is now fully functional with:
- ✅ Complete destination management
- ✅ Real-time weather integration
- ✅ Voice input in multiple languages
- ✅ Interactive map selection
- ✅ ML-powered recommendations

**Admin Dashboard:** Navigate to frontend → Login → Destinations → Add Destination

Enjoy building your travel platform! 🌍✈️
