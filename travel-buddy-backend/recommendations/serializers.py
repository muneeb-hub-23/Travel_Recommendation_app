from rest_framework import serializers
from .models import Destination, UserPreference, Review, Hotel
from django.contrib.auth.models import User


class DestinationSerializer(serializers.ModelSerializer):
    """Serializer for Destination model"""
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'country', 'description', 'image', 
            'category', 'price_range', 'best_season', 'rating',
            'latitude', 'longitude', 'travel_options', 'general_weather',
            'weather_area', 'average_rating', 'review_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews.exists():
            return sum(review.rating for review in reviews) / reviews.count()
        return 0.0

    def get_review_count(self, obj):
        return obj.reviews.count()


class HotelSerializer(serializers.ModelSerializer):
    """Serializer for Hotel model"""
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    destination_country = serializers.CharField(source='destination.country', read_only=True)
    
    class Meta:
        model = Hotel
        fields = [
            'id', 'destination', 'destination_name', 'destination_country',
            'name', 'description', 'address', 'phone', 'email', 'website',
            'image_main', 'image_gallery',
            'price_single', 'price_couple', 'price_executive', 'price_family',
            'price_entire_hotel', 'price_villa',
            'amenities', 'rating', 'total_rooms',
            'check_in_time', 'check_out_time', 'cancellation_policy',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for UserPreference model"""
    
    class Meta:
        model = UserPreference
        fields = [
            'id', 'user', 'preferred_categories', 'budget_range',
            'preferred_seasons', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    destination_name = serializers.CharField(source='destination.name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'destination', 'destination_name', 'user', 'user_name',
            'rating', 'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']
