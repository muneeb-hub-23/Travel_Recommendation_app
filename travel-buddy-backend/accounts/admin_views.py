from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from .models import User, AdminUser
from .serializers import UserSerializer, AdminUserSerializer, AdminLoginSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def list_users(request):
    """
    List all registered users
    Returns all users from the database
    """
    users = User.objects.filter(is_active=True).order_by('-created_at')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def admin_users(request):
    """
    GET: List all admin users
    POST: Create new admin user
    """
    if request.method == 'GET':
        admins = AdminUser.objects.all().order_by('-created_at')
        serializer = AdminUserSerializer(admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = AdminUserSerializer(data=request.data)
        if serializer.is_valid():
            admin_user = serializer.save()
            return Response(
                AdminUserSerializer(admin_user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def admin_user_detail(request, pk):
    """
    GET: Retrieve admin user details
    PUT: Update admin user
    DELETE: Delete admin user
    """
    try:
        admin_user = AdminUser.objects.get(pk=pk)
    except AdminUser.DoesNotExist:
        return Response(
            {'error': 'Admin user not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = AdminUserSerializer(admin_user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = AdminUserSerializer(admin_user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        admin_user.delete()
        return Response(
            {'message': 'Admin user deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Admin login endpoint
    Authenticates admin user and returns token
    """
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        admin_user = serializer.validated_data['admin_user']
        
        # Update last login
        admin_user.last_login = timezone.now()
        admin_user.save()
        
        # Generate simple token (you can use JWT if needed)
        return Response({
            'message': 'Login successful',
            'admin': AdminUserSerializer(admin_user).data,
            'token': f'admin_token_{admin_user.id}'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
