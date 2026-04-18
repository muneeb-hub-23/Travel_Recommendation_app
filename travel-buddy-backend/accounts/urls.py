from django.urls import path
from . import views, admin_views

urlpatterns = [
    # Regular user endpoints
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('verify-otp/', views.verify_otp, name='verify_otp'),
    path('resend-otp/', views.resend_otp, name='resend_otp'),
    path('google-auth/', views.google_auth, name='google_auth'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    
    # Admin endpoints
    path('users/', admin_views.list_users, name='list_users'),
    path('users/<int:pk>/', admin_views.user_detail, name='user_detail'),
    path('admin-users/', admin_views.admin_users, name='admin_users'),
    path('admin-users/<int:pk>/', admin_views.admin_user_detail, name='admin_user_detail'),
    path('admin-login/', admin_views.admin_login, name='admin_login'),
]
