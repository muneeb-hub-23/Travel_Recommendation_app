# Migration Guide for Destination Updates

## Overview
This guide explains how to apply the new database migrations for the updated Destination model with travel options and weather fields.

## New Fields Added
- `travel_options` (JSONField) - Available travel methods (bus, car, bike, plane, train)
- `general_weather` (CharField) - General weather description
- `weather_area` (CharField) - City/area name for weather API lookups

## Migration Steps

### 1. Create Migrations
```bash
python manage.py makemigrations
```

### 2. Review Migrations
Check the generated migration file to ensure it includes:
- Adding `travel_options` field with default=list
- Adding `general_weather` field (nullable/blank)
- Adding `weather_area` field (nullable/blank)

### 3. Apply Migrations
```bash
python manage.py migrate
```

### 4. Verify Changes
```bash
python manage.py shell
```

Then run:
```python
from recommendations.models import Destination
# Check if new fields exist
dest = Destination.objects.first()
if dest:
    print(f"Travel Options: {dest.travel_options}")
    print(f"General Weather: {dest.general_weather}")
    print(f"Weather Area: {dest.weather_area}")
```

## API Configuration

### Weather API Setup
1. Sign up at https://openweathermap.org/api
2. Get your free API key
3. Add to `.env` file:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

## Testing

### Test Weather Endpoint
```bash
# By city name
curl "http://localhost:8000/api/weather/?city=Gilgit"

# By coordinates
curl "http://localhost:8000/api/weather/?lat=35.9208&lon=74.3143"
```

### Test Destination Creation
```bash
curl -X POST http://localhost:8000/api/destinations/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Destination",
    "country": "Pakistan",
    "description": "Test description",
    "category": "mountain",
    "price_range": "moderate",
    "best_season": "All year",
    "latitude": 35.9208,
    "longitude": 74.3143,
    "travel_options": ["bus", "car", "plane"],
    "general_weather": "Clear sky",
    "weather_area": "Gilgit"
  }'
```

## Troubleshooting

### Migration Issues
If you encounter migration conflicts:
```bash
python manage.py migrate recommendations zero
python manage.py migrate recommendations
```

### Database Reset (Development Only)
```bash
# WARNING: This will delete all data
python manage.py flush
python manage.py migrate
python manage.py createsuperuser
```

## Rollback
To rollback these changes:
```bash
# Find the migration number before these changes
python manage.py showmigrations

# Rollback to previous migration
python manage.py migrate recommendations <previous_migration_number>
```
