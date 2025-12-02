from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import Q, Avg
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
    permission_classes = [IsAuthenticatedOrReadOnly]

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPreference.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
