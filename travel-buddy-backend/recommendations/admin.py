from django.contrib import admin
from .models import Destination, UserPreference, Review


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'category', 'price_range', 'rating', 'created_at']
    list_filter = ['category', 'price_range', 'country']
    search_fields = ['name', 'country', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'budget_range', 'created_at']
    list_filter = ['budget_range']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'destination__name', 'comment']
    readonly_fields = ['created_at', 'updated_at']
