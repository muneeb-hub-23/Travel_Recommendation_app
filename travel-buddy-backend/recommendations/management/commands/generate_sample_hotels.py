from django.core.management.base import BaseCommand
from recommendations.models import Hotel, Destination
import random


class Command(BaseCommand):
    help = 'Generate sample hotels with realistic prices and descriptions'

    def handle(self, *args, **kwargs):
        # Get all destinations
        destinations = Destination.objects.all()
        
        if not destinations.exists():
            self.stdout.write(self.style.ERROR('No destinations found. Please add destinations first.'))
            return
        
        # Hotel templates with rich descriptions for NLP
        hotel_templates = [
            {
                'suffix': 'Grand Hotel',
                'description': 'Experience luxury and comfort at our premium hotel featuring spacious rooms with mountain views, modern amenities, fine dining restaurant, spa and wellness center, outdoor swimming pool, and 24/7 room service. Perfect for families and couples seeking a memorable stay.',
                'amenities': ['WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Room Service', 'Gym', 'Parking', 'Conference Hall'],
                'rating_range': (4.0, 5.0),
                'price_multiplier': 1.5
            },
            {
                'suffix': 'Pearl Resort',
                'description': 'A serene retreat nestled in nature offering cozy accommodation with breathtaking scenic views. Our resort features comfortable rooms, traditional cuisine restaurant, outdoor activities, bonfire evenings, and warm hospitality. Ideal for adventure seekers and nature lovers.',
                'amenities': ['WiFi', 'Restaurant', 'Bonfire', 'Outdoor Activities', 'Parking', 'Garden'],
                'rating_range': (3.8, 4.5),
                'price_multiplier': 1.2
            },
            {
                'suffix': 'Budget Inn',
                'description': 'Affordable and clean accommodation perfect for budget travelers. Our inn provides basic amenities including comfortable beds, hot water, WiFi, and friendly staff. Located conveniently near local attractions and markets. Great value for money.',
                'amenities': ['WiFi', 'Hot Water', 'Parking', 'Basic Breakfast'],
                'rating_range': (3.5, 4.2),
                'price_multiplier': 0.7
            },
            {
                'suffix': 'Mountain View Hotel',
                'description': 'Wake up to stunning mountain vistas from our hilltop hotel. Features include panoramic windows, balcony rooms, rooftop restaurant with local and international cuisine, trekking arrangements, and photography spots. Perfect for mountain enthusiasts and photographers.',
                'amenities': ['WiFi', 'Restaurant', 'Rooftop Dining', 'Mountain View', 'Trekking Guide', 'Parking'],
                'rating_range': (4.2, 4.8),
                'price_multiplier': 1.3
            },
            {
                'suffix': 'Lake View Resort',
                'description': 'Tranquil lakeside resort offering peaceful accommodation with water views. Enjoy boating, fishing, lakeside dining, campfire nights, and water sports. Our resort features comfortable cottages, private beach area, and outdoor seating. Perfect for romantic getaways and family vacations.',
                'amenities': ['WiFi', 'Lake View', 'Boating', 'Restaurant', 'Beach Access', 'Campfire', 'Parking'],
                'rating_range': (4.0, 4.7),
                'price_multiplier': 1.4
            },
            {
                'suffix': 'Executive Suites',
                'description': 'Premium business hotel with executive rooms, high-speed internet, work desks, conference facilities, and business center. Features include meeting rooms, catering services, airport transfers, and professional staff. Ideal for business travelers and corporate events.',
                'amenities': ['High-Speed WiFi', 'Conference Room', 'Business Center', 'Airport Transfer', 'Restaurant', 'Gym', 'Laundry'],
                'rating_range': (4.3, 4.9),
                'price_multiplier': 1.6
            }
        ]
        
        created_count = 0
        
        for destination in destinations:
            # Check if hotel already exists for this destination
            if Hotel.objects.filter(destination=destination).exists():
                self.stdout.write(f'Hotel already exists for {destination.name}, skipping...')
                continue
            
            # Select random template
            template = random.choice(hotel_templates)
            
            # Base prices (in PKR)
            base_single = random.randint(2000, 4000)
            base_couple = random.randint(3500, 6000)
            base_executive = random.randint(5000, 8000)
            base_family = random.randint(7000, 12000)
            
            # Apply multiplier based on template
            multiplier = template['price_multiplier']
            
            # Determine if luxury options available
            is_luxury = random.choice([True, False])
            
            hotel = Hotel.objects.create(
                destination=destination,
                name=f"{destination.name} {template['suffix']}",
                description=template['description'],
                address=f"Main Road, {destination.name}, {destination.country}",
                phone=f"+92-{random.randint(300, 399)}-{random.randint(1000000, 9999999)}",
                email=f"info@{destination.name.lower().replace(' ', '')}{template['suffix'].lower().replace(' ', '')}.com",
                website=f"https://www.{destination.name.lower().replace(' ', '')}{template['suffix'].lower().replace(' ', '')}.com",
                
                # Pricing with multiplier
                price_single=round(base_single * multiplier, 2),
                price_couple=round(base_couple * multiplier, 2),
                price_executive=round(base_executive * multiplier, 2),
                price_family=round(base_family * multiplier, 2),
                price_entire_hotel=round(random.randint(50000, 150000) * multiplier, 2) if is_luxury else None,
                price_villa=round(random.randint(15000, 35000) * multiplier, 2) if is_luxury else None,
                
                # Amenities and details
                amenities=template['amenities'],
                rating=round(random.uniform(*template['rating_range']), 2),
                total_rooms=random.randint(10, 50),
                
                check_in_time=random.choice(['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']),
                check_out_time=random.choice(['10:00 AM', '11:00 AM', '12:00 PM']),
                cancellation_policy='Free cancellation up to 24 hours before check-in. 50% refund for cancellations within 24 hours. No refund for no-shows.'
            )
            
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'Created hotel: {hotel.name}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nTotal hotels created: {created_count}'))
        self.stdout.write(self.style.SUCCESS('Sample hotels generated successfully!'))
