from django.test import TestCase
from django.contrib.auth.models import User
from .models import Destination, UserPreference, Review


class DestinationModelTest(TestCase):
    def setUp(self):
        self.destination = Destination.objects.create(
            name='Paris',
            country='France',
            description='City of lights',
            category='city',
            price_range='luxury',
            best_season='Spring',
            rating=4.5
        )

    def test_destination_creation(self):
        self.assertEqual(self.destination.name, 'Paris')
        self.assertEqual(str(self.destination), 'Paris, France')


class ReviewModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.destination = Destination.objects.create(
            name='Paris',
            country='France',
            description='City of lights',
            category='city',
            price_range='luxury',
            best_season='Spring'
        )

    def test_review_creation(self):
        review = Review.objects.create(
            destination=self.destination,
            user=self.user,
            rating=5,
            comment='Amazing place!'
        )
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.user, self.user)
