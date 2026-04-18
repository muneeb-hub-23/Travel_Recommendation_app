from rest_framework import serializers
from .models import Trip
from recommendations.serializers import DestinationSerializer, HotelSerializer
from accounts.serializers import UserSerializer


class TripSerializer(serializers.ModelSerializer):
    destination_details = DestinationSerializer(source='destination', read_only=True)
    hotel_details = HotelSerializer(source='hotel', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    travel_mode_display = serializers.CharField(source='get_travel_mode_display', read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'user', 'user_details', 'destination', 'destination_details',
            'hotel', 'hotel_details', 'start_location', 'start_latitude', 'start_longitude',
            'travel_mode', 'travel_mode_display', 'distance', 'travel_cost', 'hotel_cost',
            'total_cost', 'departure_date', 'departure_time', 'return_date', 'status',
            'status_display', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TripCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    destination_id = serializers.IntegerField(write_only=True)
    hotel_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Trip
        fields = [
            'user_id', 'destination_id', 'hotel_id', 'start_location',
            'start_latitude', 'start_longitude', 'travel_mode', 'distance',
            'travel_cost', 'hotel_cost', 'total_cost', 'departure_date',
            'departure_time', 'return_date', 'status'
        ]
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        destination_id = validated_data.pop('destination_id')
        hotel_id = validated_data.pop('hotel_id', None)
        
        from accounts.models import User
        from recommendations.models import Destination, Hotel
        from rest_framework.exceptions import ValidationError
        
        # Validate user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise ValidationError({'user_id': f'User with id {user_id} does not exist'})
        
        # Validate destination exists
        try:
            destination = Destination.objects.get(id=destination_id)
        except Destination.DoesNotExist:
            raise ValidationError({'destination_id': f'Destination with id {destination_id} does not exist'})
        
        # Validate hotel exists if provided
        if hotel_id:
            try:
                hotel = Hotel.objects.get(id=hotel_id)
            except Hotel.DoesNotExist:
                raise ValidationError({'hotel_id': f'Hotel with id {hotel_id} does not exist'})
        
        validated_data['user_id'] = user_id
        validated_data['destination_id'] = destination_id
        if hotel_id:
            validated_data['hotel_id'] = hotel_id
        
        return Trip.objects.create(**validated_data)
