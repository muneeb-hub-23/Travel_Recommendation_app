from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet, UserPreferenceViewSet, ReviewViewSet, get_weather

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'preferences', UserPreferenceViewSet, basename='preference')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('weather/', get_weather, name='weather'),
]
