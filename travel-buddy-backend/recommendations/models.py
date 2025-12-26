from django.db import models
from django.conf import settings


class Destination(models.Model):
    """Model for travel destinations"""
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='destinations/', null=True, blank=True)
    category = models.CharField(max_length=100, choices=[
        ('beach', 'Beach'),
        ('mountain', 'Mountain'),
        ('city', 'City'),
        ('historical', 'Historical'),
        ('adventure', 'Adventure'),
        ('cultural', 'Cultural'),
    ])
    price_range = models.CharField(max_length=20, choices=[
        ('budget', 'Budget'),
        ('moderate', 'Moderate'),
        ('luxury', 'Luxury'),
    ])
    best_season = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # New fields for travel options and weather
    travel_options = models.JSONField(default=list, help_text="Available travel options: bus, car, bike, plane, etc.")
    general_weather = models.CharField(max_length=100, blank=True, help_text="General weather description")
    weather_area = models.CharField(max_length=200, blank=True, help_text="City/area name for weather API")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name}, {self.country}"


class UserPreference(models.Model):
    """Model for user travel preferences"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='preferences')
    preferred_categories = models.JSONField(default=list)
    budget_range = models.CharField(max_length=20, choices=[
        ('budget', 'Budget'),
        ('moderate', 'Moderate'),
        ('luxury', 'Luxury'),
    ], default='moderate')
    preferred_seasons = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user.username}"


class Hotel(models.Model):
    """Model for hotels linked to destinations"""
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='hotels')
    name = models.CharField(max_length=200)
    description = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    
    # Images
    image_main = models.ImageField(upload_to='hotels/', null=True, blank=True)
    image_gallery = models.JSONField(default=list, help_text="List of additional image URLs")
    
    # Pricing tiers (in PKR)
    price_single = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per night for single person")
    price_couple = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per night for couple")
    price_executive = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per night for executive room")
    price_family = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price per night for family room")
    price_entire_hotel = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Price for entire hotel (optional)")
    price_villa = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Price for villa (optional)")
    
    # Amenities and features
    amenities = models.JSONField(default=list, help_text="List of amenities: WiFi, Pool, Spa, Restaurant, etc.")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_rooms = models.IntegerField(default=10)
    
    # Additional info
    check_in_time = models.CharField(max_length=20, default="2:00 PM")
    check_out_time = models.CharField(max_length=20, default="12:00 PM")
    cancellation_policy = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} - {self.destination.name}"


class Review(models.Model):
    """Model for destination reviews"""
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['destination', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} for {self.destination.name}"
