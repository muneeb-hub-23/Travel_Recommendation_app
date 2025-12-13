from django.db import models
from django.contrib.auth.models import User


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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
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


class Review(models.Model):
    """Model for destination reviews"""
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['destination', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} for {self.destination.name}"
