from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer, TripCreateSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def list_all_trips(request):
    """
    List all trips (for admin dashboard)
    """
    trips = Trip.objects.all().select_related(
        'destination', 'hotel', 'user'
    ).order_by('-created_at')
    
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def list_user_trips(request):
    """
    List all trips for a specific user
    """
    user_id = request.query_params.get('user_id')
    
    if not user_id:
        return Response(
            {'error': 'user_id parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    trips = Trip.objects.filter(user_id=user_id).select_related(
        'destination', 'hotel', 'user'
    ).order_by('-created_at')
    
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def create_trip(request):
    """
    Create a new trip
    """
    # Debug: Log received data
    print("=" * 50)
    print("Received request.data:", request.data)
    print("Type of start_longitude:", type(request.data.get('start_longitude')))
    print("Value of start_longitude:", request.data.get('start_longitude'))
    print("Type of distance:", type(request.data.get('distance')))
    print("Value of distance:", request.data.get('distance'))
    print("=" * 50)
    
    serializer = TripCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        trip = serializer.save()
        response_serializer = TripSerializer(trip)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_trip(request, pk):
    """
    Get a specific trip by ID
    """
    try:
        trip = Trip.objects.select_related('destination', 'hotel', 'user').get(pk=pk)
        serializer = TripSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Trip.DoesNotExist:
        return Response(
            {'error': 'Trip not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
@authentication_classes([])
def update_trip(request, pk):
    """
    Update a trip
    """
    try:
        trip = Trip.objects.get(pk=pk)
    except Trip.DoesNotExist:
        return Response(
            {'error': 'Trip not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = TripSerializer(trip, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([AllowAny])
@authentication_classes([])
def delete_trip(request, pk):
    """
    Delete a trip
    """
    try:
        trip = Trip.objects.get(pk=pk)
        trip.delete()
        return Response(
            {'message': 'Trip deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )
    except Trip.DoesNotExist:
        return Response(
            {'error': 'Trip not found'},
            status=status.HTTP_404_NOT_FOUND
        )
