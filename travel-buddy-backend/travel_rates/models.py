from django.db import models


class TravelRate(models.Model):
    """
    Model to store travel rates per kilometer for different vehicle types
    """
    VEHICLE_CHOICES = [
        ('motorbike', 'Motorbike'),
        ('car', 'Car'),
        ('bus', 'Bus'),
    ]
    
    vehicle_type = models.CharField(
        max_length=20,
        choices=VEHICLE_CHOICES,
        unique=True,
        help_text="Type of vehicle"
    )
    rate_per_km = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Rate per kilometer in currency units"
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Travel Rate"
        verbose_name_plural = "Travel Rates"
        ordering = ['vehicle_type']
    
    def __str__(self):
        return f"{self.get_vehicle_type_display()} - {self.rate_per_km} per km"
