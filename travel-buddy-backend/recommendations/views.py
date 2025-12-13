from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, Avg
import requests
from django.conf import settings
from .models import Destination, UserPreference, Review
from .serializers import (
    DestinationSerializer, 
    UserPreferenceSerializer, 
    ReviewSerializer
)
from .ml_utils import (
    get_ml_recommendations_for_user,
    get_similar_destinations,
    analyze_review_sentiment_bulk,
    extract_destination_keywords
)


class DestinationViewSet(viewsets.ModelViewSet):
    """ViewSet for Destination model"""
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]  # Allow all operations without authentication

    def get_queryset(self):
        queryset = Destination.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by price range
        price_range = self.request.query_params.get('price_range', None)
        if price_range:
            queryset = queryset.filter(price_range=price_range)
        
        # Search by name or country
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(country__icontains=search)
            )
        
        return queryset

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """Get personalized recommendations based on user preferences"""
        if not request.user.is_authenticated:
            # Return popular destinations for anonymous users
            destinations = Destination.objects.all()[:10]
            serializer = self.get_serializer(destinations, many=True)
            return Response(serializer.data)
        
        try:
            preferences = UserPreference.objects.get(user=request.user)
            queryset = Destination.objects.all()
            
            # Filter by preferred categories
            if preferences.preferred_categories:
                queryset = queryset.filter(category__in=preferences.preferred_categories)
            
            # Filter by budget
            if preferences.budget_range:
                queryset = queryset.filter(price_range=preferences.budget_range)
            
            serializer = self.get_serializer(queryset[:10], many=True)
            return Response(serializer.data)
        except UserPreference.DoesNotExist:
            # Return popular destinations if no preferences set
            destinations = Destination.objects.all()[:10]
            serializer = self.get_serializer(destinations, many=True)
            return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def ml_recommended(self, request):
        """Get ML-powered personalized recommendations"""
        if not request.user.is_authenticated:
            # Return popular destinations for anonymous users
            destinations = Destination.objects.all().order_by('-rating')[:10]
            serializer = self.get_serializer(destinations, many=True)
            return Response(serializer.data)
        
        # Get limit from query params, default to 10
        limit = int(request.query_params.get('limit', 10))
        
        # Get ML-powered recommendations
        recommendations = get_ml_recommendations_for_user(request.user, limit=limit)
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        """Get destinations similar to this one using ML"""
        destination = self.get_object()
        limit = int(request.query_params.get('limit', 5))
        
        similar_destinations = get_similar_destinations(destination, limit=limit)
        serializer = self.get_serializer(similar_destinations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def keywords(self, request, pk=None):
        """Extract keywords from destination description"""
        destination = self.get_object()
        keywords = extract_destination_keywords(destination)
        return Response({'keywords': keywords})
    
    @action(detail=True, methods=['get'])
    def sentiment_analysis(self, request, pk=None):
        """Analyze sentiment of all reviews for this destination"""
        destination = self.get_object()
        sentiment_data = analyze_review_sentiment_bulk(destination.id)
        return Response(sentiment_data)


class UserPreferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for UserPreference model"""
    queryset = UserPreference.objects.all()
    serializer_class = UserPreferenceSerializer
    permission_classes = [AllowAny]  # Allow all operations without authentication

    def get_queryset(self):
        # Return all preferences without user filtering (auth disabled)
        return UserPreference.objects.all()

    def perform_create(self, serializer):
        # Save without user assignment (auth disabled)
        serializer.save()


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]  # Allow all operations without authentication

    def get_queryset(self):
        queryset = Review.objects.all()
        
        # Filter by destination
        destination_id = self.request.query_params.get('destination', None)
        if destination_id:
            queryset = queryset.filter(destination_id=destination_id)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        # Update destination rating
        review = serializer.instance
        destination = review.destination
        avg_rating = destination.reviews.aggregate(Avg('rating'))['rating__avg']
        destination.rating = avg_rating or 0.0
        destination.save()


@api_view(['GET'])
def get_weather(request):
    """Get real-time weather data for a location using Open-Meteo API"""
    city = request.query_params.get('city', None)
    lat = request.query_params.get('lat', None)
    lon = request.query_params.get('lon', None)
    
    if not city and not (lat and lon):
        return Response(
            {'error': 'Please provide either city name or coordinates (lat, lon)'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # If city is provided, use geocoding to get coordinates
        if city:
            geocoding_url = 'https://geocoding-api.open-meteo.com/v1/search'
            geocoding_params = {
                'name': city,
                'count': 1,
                'language': 'en',
                'format': 'json'
            }
            
            geo_response = requests.get(geocoding_url, params=geocoding_params, timeout=10)
            geo_response.raise_for_status()
            geo_data = geo_response.json()
            
            if not geo_data.get('results'):
                return Response(
                    {'error': f'City "{city}" not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            location_info = geo_data['results'][0]
            lat = location_info['latitude']
            lon = location_info['longitude']
            location_name = location_info['name']
            if 'country' in location_info:
                location_name += f", {location_info['country']}"
        else:
            location_name = f"Location ({lat}, {lon})"
        
        # Fetch weather data from Open-Meteo
        weather_url = 'https://api.open-meteo.com/v1/forecast'
        weather_params = {
            'latitude': lat,
            'longitude': lon,
            'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m',
            'timezone': 'auto'
        }
        
        weather_response = requests.get(weather_url, params=weather_params, timeout=10)
        weather_response.raise_for_status()
        weather_data = weather_response.json()
        
        current = weather_data['current']
        
        # Map WMO weather codes to descriptions
        weather_code = current.get('weather_code', 0)
        weather_descriptions = {
            0: ('Clear', 'clear sky'),
            1: ('Mainly Clear', 'mainly clear'),
            2: ('Partly Cloudy', 'partly cloudy'),
            3: ('Overcast', 'overcast'),
            45: ('Foggy', 'fog'),
            48: ('Foggy', 'depositing rime fog'),
            51: ('Drizzle', 'light drizzle'),
            53: ('Drizzle', 'moderate drizzle'),
            55: ('Drizzle', 'dense drizzle'),
            61: ('Rain', 'slight rain'),
            63: ('Rain', 'moderate rain'),
            65: ('Rain', 'heavy rain'),
            71: ('Snow', 'slight snow'),
            73: ('Snow', 'moderate snow'),
            75: ('Snow', 'heavy snow'),
            77: ('Snow', 'snow grains'),
            80: ('Rain Showers', 'slight rain showers'),
            81: ('Rain Showers', 'moderate rain showers'),
            82: ('Rain Showers', 'violent rain showers'),
            85: ('Snow Showers', 'slight snow showers'),
            86: ('Snow Showers', 'heavy snow showers'),
            95: ('Thunderstorm', 'thunderstorm'),
            96: ('Thunderstorm', 'thunderstorm with slight hail'),
            99: ('Thunderstorm', 'thunderstorm with heavy hail'),
        }
        
        weather_main, weather_desc = weather_descriptions.get(weather_code, ('Unknown', 'unknown'))
        
        # Format the response to match the original structure
        formatted_data = {
            'location': location_name,
            'temperature': current['temperature_2m'],
            'feels_like': current['apparent_temperature'],
            'temp_min': current['temperature_2m'],  # Open-Meteo doesn't provide min/max in current, same as current
            'temp_max': current['temperature_2m'],  # Open-Meteo doesn't provide min/max in current, same as current
            'humidity': current['relative_humidity_2m'],
            'pressure': current['pressure_msl'],
            'weather': weather_main,
            'description': weather_desc,
            'icon': str(weather_code).zfill(2) + 'd',  # Use weather code as icon reference
            'wind_speed': current['wind_speed_10m'],
            'clouds': current['cloud_cover'],
            'coordinates': {
                'lat': float(lat),
                'lon': float(lon)
            }
        }
        
        return Response(formatted_data)
        
    except requests.exceptions.RequestException as e:
        return Response(
            {'error': f'Failed to fetch weather data: {str(e)}'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except (KeyError, IndexError) as e:
        return Response(
            {'error': f'Invalid response from weather API: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
