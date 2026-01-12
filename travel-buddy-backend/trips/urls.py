from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_trip, name='create_trip'),
    path('all/', views.list_all_trips, name='list_all_trips'),
    path('user/', views.list_user_trips, name='list_user_trips'),
    path('<int:pk>/', views.get_trip, name='get_trip'),
    path('<int:pk>/update/', views.update_trip, name='update_trip'),
    path('<int:pk>/delete/', views.delete_trip, name='delete_trip'),
]
