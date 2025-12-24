from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, OTP


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 
                  'profile_picture', 'is_verified', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']


class SignupSerializer(serializers.ModelSerializer):
    """Serializer for user signup"""
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'confirm_password', 'first_name', 'last_name', 'phone']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists")
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            is_active=True,
            is_verified=False
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                user = authenticate(username=user.username, password=password)
                if not user:
                    raise serializers.ValidationError("Invalid credentials")
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Must include email and password")

        data['user'] = user
        return data


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for OTP verification"""
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)


class GoogleAuthSerializer(serializers.Serializer):
    """Serializer for Google OAuth"""
    token = serializers.CharField()
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
