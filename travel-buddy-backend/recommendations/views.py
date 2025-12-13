from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q, Avg
import requests
from django.conf import settings
from .models import Destination, UserPreference, Review, Hotel
from .serializers import (
    DestinationSerializer, 
    UserPreferenceSerializer, 
    ReviewSerializer,
    HotelSerializer
)
from .ml_utils import (
    get_ml_recommendations_for_user,
    get_similar_destinations,
    analyze_review_sentiment_bulk,
    extract_destination_keywords
)
from .ai_search import SmartSearch


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
    
    @action(detail=False, methods=['get'])
    def smart_search(self, request):
        """
        AI-powered natural language search with real-time weather
        Query params:
        - q: The natural language query (e.g., "show me cultural places", "snowy mountains")
        - limit: Maximum number of results (default: 20)
        - fetch_weather: Whether to fetch current weather (default: true)
        """
        query = request.query_params.get('q', '')
        limit = int(request.query_params.get('limit', 20))
        fetch_weather = request.query_params.get('fetch_weather', 'true').lower() == 'true'
        
        if not query:
            return Response(
                {'error': 'Query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Perform smart search
        search_results = SmartSearch.search_destinations(query, limit=limit)
        
        # Get NLP results for filtering
        from .nlp_processor import NLPProcessor
        nlp_result = NLPProcessor.process_query(query)
        
        # Add hotel information and filter destinations
        room_type = nlp_result.get('room_type', 'couple')
        budget_min = nlp_result.get('budget_min')
        budget_max = nlp_result.get('budget_max')
        days = nlp_result.get('days') or 1
        location = nlp_result.get('location')
        
        # For single-day trips (picnics, day trips), waive accommodation requirement
        require_accommodation = days > 1
        
        # Filter by location if specified
        destinations_to_process = search_results['destinations']
        if location:
            destinations_to_process = [
                dest for dest in destinations_to_process
                if (location.lower() in dest.name.lower() or 
                    location.lower() in dest.country.lower() or
                    (dest.description and location.lower() in dest.description.lower()))
            ]
        
        # Process destinations and build results with hotels
        filtered_destinations = []
        results_data = []
        
        for dest in destinations_to_process:
            # For single-day trips, skip hotel requirement
            if not require_accommodation:
                filtered_destinations.append(dest)
                dest_data = self.get_serializer(dest).data
                dest_data['is_day_trip'] = True  # Mark as day trip
                results_data.append(dest_data)
                continue
            
            # For multi-day trips, check for hotels
            hotels = Hotel.objects.filter(destination=dest).order_by('-rating')
            
            # Filter by budget if specified
            if (budget_min or budget_max) and room_type:
                price_field = f'price_{room_type}'
                
                # Filter by maximum budget
                if budget_max:
                    max_price_per_night = budget_max / days
                    hotels = hotels.filter(**{f'{price_field}__lte': max_price_per_night})
                
                # Filter by minimum budget
                if budget_min:
                    min_price_per_night = budget_min / days
                    hotels = hotels.filter(**{f'{price_field}__gte': min_price_per_night})
            
            # Only include destination if it has at least one hotel meeting criteria
            if hotels.exists():
                best_hotel = hotels.first()
                price_per_night = getattr(best_hotel, f'price_{room_type}', best_hotel.price_couple)
                total_price = float(price_per_night * days)
                
                # Check if total price is within budget range
                in_budget = True
                if budget_max and total_price > budget_max:
                    in_budget = False
                if budget_min and total_price < budget_min:
                    in_budget = False
                
                if in_budget:
                    filtered_destinations.append(dest)
                    
                    # Serialize this destination
                    dest_data = self.get_serializer(dest).data
                    dest_data['hotel'] = {
                        'name': best_hotel.name,
                        'rating': float(best_hotel.rating),
                        'room_type': room_type,
                        'price_per_night': float(price_per_night),
                        'days': days,
                        'total_price': total_price,
                        'amenities': best_hotel.amenities[:4] if best_hotel.amenities else []
                    }
                    results_data.append(dest_data)
            elif not (budget_min or budget_max):
                # If no budget specified, include all destinations (even without hotels)
                filtered_destinations.append(dest)
                dest_data = self.get_serializer(dest).data
                results_data.append(dest_data)
        
        # Don't fetch weather here - it blocks the response
        # Weather will be loaded separately on the frontend
        
        # Generate search summary
        summary = SmartSearch.generate_search_summary(search_results['keywords'])
        
        return Response({
            'query': search_results['query'],
            'summary': summary,
            'keywords': search_results['keywords'],
            'room_type': nlp_result.get('room_type'),
            'budget_min': nlp_result.get('budget_min'),
            'budget_max': nlp_result.get('budget_max'),
            'days': nlp_result.get('days'),
            'location': nlp_result.get('location'),
            'is_day_trip': not require_accommodation,
            'count': len(results_data),
            'results': results_data
        })


class HotelViewSet(viewsets.ModelViewSet):
    """ViewSet for Hotel model"""
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [AllowAny]  # Allow all operations without authentication

    def get_queryset(self):
        queryset = Hotel.objects.all()
        
        # Filter by destination
        destination_id = self.request.query_params.get('destination', None)
        if destination_id:
            queryset = queryset.filter(destination_id=destination_id)
        
        # Basic search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(address__icontains=search) |
                Q(destination__name__icontains=search) |
                Q(destination__country__icontains=search) |
                Q(amenities__icontains=search)
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def smart_search(self, request):
        """
        AI-powered natural language search for hotels
        Query params:
        - q: Natural language query (e.g., "luxury hotels with pool", "budget mountain hotels")
        - limit: Maximum results (default: 20)
        """
        query = request.query_params.get('q', '')
        limit = int(request.query_params.get('limit', 20))
        
        if not query:
            return Response(
                {'error': 'Query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use NLP to understand the query
        from .nlp_processor import NLPProcessor
        nlp_result = NLPProcessor.process_query(query)
        
        # Start with all hotels
        queryset = Hotel.objects.all()
        
        # Search in name, description, amenities, and destination
        search_query = Q()
        keywords = nlp_result.get('keywords', [])
        if keywords:
            for keyword in keywords:
                search_query |= Q(name__icontains=keyword)
                search_query |= Q(description__icontains=keyword)
                search_query |= Q(address__icontains=keyword)
                search_query |= Q(amenities__icontains=keyword)
                search_query |= Q(destination__name__icontains=keyword)
                search_query |= Q(destination__description__icontains=keyword)
            queryset = queryset.filter(search_query)
        
        # Filter by price range if detected
        if 'luxury' in query.lower():
            queryset = queryset.filter(price_couple__gte=8000)
        elif 'budget' in query.lower() or 'cheap' in query.lower():
            queryset = queryset.filter(price_couple__lte=5000)
        
        # Limit results
        queryset = queryset[:limit]
        
        # Serialize results
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'query': query,
            'count': len(serializer.data),
            'keywords': nlp_result,
            'results': serializer.data
        })


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
