from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP, AdminUser


@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'name', 'email', 'role', 'is_active', 'last_login', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['username', 'name', 'email']
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    fieldsets = (
        ('Account Info', {'fields': ('username', 'name', 'email')}),
        ('Permissions', {'fields': ('role', 'is_active')}),
        ('Timestamps', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_verified', 'is_staff']
    list_filter = ['is_verified', 'is_staff', 'is_superuser', 'is_active']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'profile_picture', 'is_verified', 'google_id')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('email', 'phone', 'is_verified')}),
    )


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['user', 'code', 'purpose', 'is_used', 'created_at', 'expires_at']
    list_filter = ['purpose', 'is_used', 'created_at']
    search_fields = ['user__email', 'user__username', 'code']
    readonly_fields = ['created_at']
