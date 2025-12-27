from django.contrib import admin
from .models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'departure_date', 'travel_mode', 'status', 'total_cost', 'created_at']
    list_filter = ['status', 'travel_mode', 'departure_date']
    search_fields = ['user__username', 'destination__name', 'start_location']
    ordering = ['-created_at']
    date_hierarchy = 'departure_date'
