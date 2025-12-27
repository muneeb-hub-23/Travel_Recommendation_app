from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_travel_rates, name='list_travel_rates'),
    path('update/', views.create_or_update_travel_rate, name='create_or_update_travel_rate'),
    path('<int:pk>/', views.update_travel_rate, name='update_travel_rate'),
    path('<int:pk>/delete/', views.delete_travel_rate, name='delete_travel_rate'),
]
