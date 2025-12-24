from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from .models import User, OTP
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    VerifyOTPSerializer, GoogleAuthSerializer
)


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    User signup endpoint
    Creates user and sends OTP for verification
    """
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Create OTP for email verification
        otp = OTP.create_otp(user, purpose='signup')
        
        # Return user data and OTP (frontend will send via EmailJS)
        return Response({
            'message': 'Signup successful. Please verify your email.',
            'user': UserSerializer(user).data,
            'otp_code': otp.code,  # Send to frontend to use with EmailJS
            'email': user.email
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verify OTP endpoint
    Verifies user email with OTP code
    """
    serializer = VerifyOTPSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        
        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.filter(
                user=user,
                code=code,
                is_used=False
            ).first()
            
            if not otp:
                return Response({
                    'error': 'Invalid OTP code'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not otp.is_valid():
                return Response({
                    'error': 'OTP has expired'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Mark OTP as used and verify user
            otp.is_used = True
            otp.save()
            
            user.is_verified = True
            user.save()
            
            # Generate tokens
            tokens = get_tokens_for_user(user)
            
            return Response({
                'message': 'Email verified successfully',
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login endpoint
    Authenticates user and returns JWT tokens
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        if not user.is_verified:
            # Send new OTP for unverified users
            otp = OTP.create_otp(user, purpose='login')
            return Response({
                'message': 'Please verify your email first',
                'requires_verification': True,
                'otp_code': otp.code,
                'email': user.email
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generate tokens
        tokens = get_tokens_for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    """
    Resend OTP endpoint
    Generates and sends new OTP to user email
    """
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        # Create new OTP
        otp = OTP.create_otp(user, purpose='signup')
        
        return Response({
            'message': 'OTP sent successfully',
            'otp_code': otp.code,
            'email': user.email
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Google OAuth authentication endpoint
    Authenticates user with Google token
    """
    token = request.data.get('token')
    
    if not token:
        return Response({
            'error': 'Token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Verify Google token
        GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )
        
        # Get user info from Google
        email = idinfo['email']
        google_id = idinfo['sub']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture', '')
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
                'google_id': google_id,
                'is_verified': True,
                'is_active': True
            }
        )
        
        # Update Google ID if not set
        if not user.google_id:
            user.google_id = google_id
            user.is_verified = True
            user.save()
        
        # Generate tokens
        tokens = get_tokens_for_user(user)
        
        return Response({
            'message': 'Google authentication successful',
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'is_new_user': created
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response({
            'error': f'Invalid Google token: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Authentication failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Get user profile endpoint
    Returns authenticated user's profile
    """
    return Response({
        'user': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile endpoint
    Updates authenticated user's profile
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
