from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import random
import string


class User(AbstractUser):
    """Extended user model with additional fields"""
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email or self.username


class OTP(models.Model):
    """OTP model for email verification"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=[
        ('signup', 'Signup'),
        ('login', 'Login'),
        ('reset', 'Password Reset'),
    ])
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP for {self.user.email} - {self.code}"

    @staticmethod
    def generate_code():
        """Generate a 6-digit OTP code"""
        return ''.join(random.choices(string.digits, k=6))

    def is_valid(self):
        """Check if OTP is still valid"""
        return not self.is_used and timezone.now() < self.expires_at

    @classmethod
    def create_otp(cls, user, purpose='signup'):
        """Create a new OTP for user"""
        code = cls.generate_code()
        expires_at = timezone.now() + timezone.timedelta(minutes=10)
        return cls.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=expires_at
        )
