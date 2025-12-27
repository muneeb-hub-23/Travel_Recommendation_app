from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import TravelRate
from .serializers import TravelRateSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def list_travel_rates(request):
    """
    List all travel rates
    """
    rates = TravelRate.objects.all().order_by('vehicle_type')
    serializer = TravelRateSerializer(rates, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def create_or_update_travel_rate(request):
    """
    Create or update a travel rate
    """
    vehicle_type = request.data.get('vehicle_type')
    
    if not vehicle_type:
        return Response(
            {'error': 'vehicle_type is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Try to get existing rate
        rate = TravelRate.objects.get(vehicle_type=vehicle_type)
        serializer = TravelRateSerializer(rate, data=request.data, partial=True)
    except TravelRate.DoesNotExist:
        # Create new rate
        serializer = TravelRateSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([AllowAny])
@authentication_classes([])
def update_travel_rate(request, pk):
    """
    Update a specific travel rate
    """
    try:
        rate = TravelRate.objects.get(pk=pk)
    except TravelRate.DoesNotExist:
        return Response(
            {'error': 'Travel rate not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = TravelRateSerializer(rate, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([AllowAny])
@authentication_classes([])
def delete_travel_rate(request, pk):
    """
    Delete a specific travel rate
    """
    try:
        rate = TravelRate.objects.get(pk=pk)
        rate.delete()
        return Response(
            {'message': 'Travel rate deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )
    except TravelRate.DoesNotExist:
        return Response(
            {'error': 'Travel rate not found'},
            status=status.HTTP_404_NOT_FOUND
        )
