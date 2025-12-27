from django.db import models
from django.conf import settings
from recommendations.models import Destination, Hotel


class Trip(models.Model):
    """
    Model to store user's saved trips
    """
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TRAVEL_MODE_CHOICES = [
        ('car', 'Car'),
        ('bus', 'Bus'),
        ('motorbike', 'Motorbike'),
        ('walking', 'Walking'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='trips'
    )
    destination = models.ForeignKey(
        Destination,
        on_delete=models.CASCADE,
        related_name='trips'
    )
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='trips'
    )
    
    # Start location details
    start_location = models.CharField(max_length=500)
    start_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    start_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    # Travel details
    travel_mode = models.CharField(max_length=20, choices=TRAVEL_MODE_CHOICES)
    distance = models.DecimalField(max_digits=10, decimal_places=2, help_text="Distance in kilometers")
    
    # Cost details
    travel_cost = models.DecimalField(max_digits=10, decimal_places=2, help_text="Travel cost in PKR")
    hotel_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Hotel cost in PKR")
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total trip cost in PKR")
    
    # Schedule
    departure_date = models.DateField()
    departure_time = models.TimeField()
    return_date = models.DateField(null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Trip"
        verbose_name_plural = "Trips"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.destination.name} ({self.departure_date})"
