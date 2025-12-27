from rest_framework import serializers
from .models import TravelRate


class TravelRateSerializer(serializers.ModelSerializer):
    vehicle_type_display = serializers.CharField(source='get_vehicle_type_display', read_only=True)
    
    class Meta:
        model = TravelRate
        fields = ['id', 'vehicle_type', 'vehicle_type_display', 'rate_per_km', 'updated_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
