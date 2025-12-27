from django.contrib import admin
from .models import TravelRate


@admin.register(TravelRate)
class TravelRateAdmin(admin.ModelAdmin):
    list_display = ['vehicle_type', 'rate_per_km', 'updated_at']
    list_filter = ['vehicle_type']
    search_fields = ['vehicle_type']
    ordering = ['vehicle_type']
