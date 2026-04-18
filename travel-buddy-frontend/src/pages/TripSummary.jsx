import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { ArrowLeft, MapPin, Calendar, Clock, Car, Bus, Bike, Coins, Save, Hotel as HotelIcon, Image as ImageIcon, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import config from '../config';

const TripSummary = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state;

  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [roomType, setRoomType] = useState('couple'); // single, couple, family
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHotelOptions, setShowHotelOptions] = useState(false);

  // Redirect if no trip data
  useEffect(() => {
    if (!tripData) {
      // Try to retrieve from sessionStorage
      const savedTripData = sessionStorage.getItem('pendingTripData');
      if (savedTripData) {
        // Restore trip data from sessionStorage
        const parsedData = JSON.parse(savedTripData);
        // Navigate with state to reload with trip data
        navigate('/trip-summary', { state: parsedData, replace: true });
        sessionStorage.removeItem('pendingTripData');
      } else {
        navigate('/');
      }
    } else {
      // If search results included hotel data, set it as selected
      if (tripData.destination?.hotel) {
        setSelectedHotel({
          id: tripData.destination.hotel.id, // Include hotel ID from search results
          name: tripData.destination.hotel.name,
          rating: tripData.destination.hotel.rating,
          price_single: tripData.destination.hotel.price_per_night,
          room_type: tripData.destination.hotel.room_type,
          amenities: tripData.destination.hotel.amenities || [],
          fromSearch: true
        });
        setNumberOfNights(tripData.destination.hotel.days || 1);
        // Set room type from search results
        if (tripData.destination.hotel.room_type) {
          setRoomType(tripData.destination.hotel.room_type);
        }
      }
    }
  }, [tripData, navigate]);

  // Fetch hotels for the destination
  useEffect(() => {
    if (tripData?.destination?.id) {
      fetchHotels();
    }
  }, [tripData]);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/hotels/?destination=${tripData.destination.id}`);
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoadingHotels(false);
    }
  };

  const getTravelIcon = (mode) => {
    switch (mode) {
      case 'car': return <Car className="h-5 w-5" />;
      case 'bus': return <Bus className="h-5 w-5" />;
      case 'motorbike': return <Bike className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const calculateTotalCost = () => {
    const travelCost = parseFloat(tripData?.travelCost || 0);
    const hotelCostPerNight = selectedHotel ? parseFloat(selectedHotel.price_single || 0) : 0;
    const totalHotelCost = hotelCostPerNight * numberOfNights;
    return (travelCost + totalHotelCost).toFixed(2);
  };

  // Calculate nights between departure and return dates
  useEffect(() => {
    if (departureDate && returnDate) {
      const departure = new Date(departureDate);
      const returnD = new Date(returnDate);
      const diffTime = Math.abs(returnD - departure);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setNumberOfNights(diffDays);
      }
    }
  }, [departureDate, returnDate]);

  // Room type pricing multipliers
  const getRoomMultiplier = () => {
    switch (roomType) {
      case 'single':
        return 1;
      case 'couple':
        return 1.5;
      case 'family':
        return 2.5;
      default:
        return 1.5;
    }
  };

  const getTotalHotelCost = () => {
    if (!selectedHotel) return 0;
    const pricePerNight = parseFloat(selectedHotel.price_single || selectedHotel.price_couple || 0);
    return (pricePerNight * numberOfNights).toFixed(2);
  };

  const getTotalTripDays = () => {
    if (departureDate && returnDate) {
      const departure = new Date(departureDate);
      const returnD = new Date(returnDate);
      const diffTime = Math.abs(returnD - departure);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handleSaveTrip = async () => {
    // Check if user is logged in
    if (!user) {
      const result = await Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login or signup to save your trip',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3b82f6'
      });

      if (result.isConfirmed) {
        // Store trip data in sessionStorage before redirecting
        sessionStorage.setItem('pendingTripData', JSON.stringify(tripData));
        navigate('/login', { state: { returnTo: '/trip-summary' } });
      }
      return;
    }

    // Validate date and time
    if (!departureDate || !departureTime || !returnDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select departure date, time, and return date',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setSaving(true);
    try {
      // Send hotel_id if a hotel is selected and has a valid id
      const hotelIdToSend = (selectedHotel && selectedHotel.id) ? selectedHotel.id : null;
      
      // Force conversion and round to match backend DecimalField constraints
      const startLat = parseFloat(
        (Array.isArray(tripData.startLocation.lat) ? tripData.startLocation.lat[0] : tripData.startLocation.lat)
      ).toFixed(6); // max_digits=9, decimal_places=6
      
      const startLon = parseFloat(
        (Array.isArray(tripData.startLocation.lon) ? tripData.startLocation.lon[0] : tripData.startLocation.lon)
      ).toFixed(6); // max_digits=9, decimal_places=6
      
      const distanceNum = parseFloat(
        (Array.isArray(tripData.distance) ? tripData.distance[0] : tripData.distance)
      ).toFixed(2); // max_digits=10, decimal_places=2
      
      const travelCostNum = parseFloat(
        (Array.isArray(tripData.travelCost) ? tripData.travelCost[0] : tripData.travelCost)
      ).toFixed(2); // max_digits=10, decimal_places=2
      
      const tripPayload = {
        user_id: user.id,
        destination_id: tripData.destination.id,
        start_location: tripData.startLocation.name,
        start_latitude: parseFloat(startLat),
        start_longitude: parseFloat(startLon),
        travel_mode: tripData.travelMode,
        distance: parseFloat(distanceNum),
        travel_cost: parseFloat(travelCostNum),
        hotel_id: hotelIdToSend,
        hotel_cost: parseFloat(parseFloat(getTotalHotelCost()).toFixed(2)),
        total_cost: parseFloat(parseFloat(calculateTotalCost()).toFixed(2)),
        departure_date: departureDate,
        departure_time: departureTime,
        return_date: returnDate,
        status: 'planned'
      };

      const response = await fetch(`${config.API_BASE_URL}/api/trips/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripPayload)
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Trip Saved!',
          text: 'Your trip has been saved successfully',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
        // Clear sessionStorage after successful save
        sessionStorage.removeItem('pendingTripData');
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to save trip');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save trip. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!tripData) return null;

  const { destination, startLocation, travelMode, distance, duration, travelCost, ratePerKm } = tripData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Route</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destination Card */}
            <div className="bg-white shadow-lg overflow-hidden">
              <div className="relative h-64">
                {destination?.image ? (
                  <img
                    src={destination.image}
                    alt={destination?.name || 'Destination'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{destination?.name || 'Destination'}</h1>
                  <p className="text-white/90 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {destination?.country || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-slate-700 leading-relaxed">{destination?.description || 'No description available'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {destination?.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold">
                      {destination.category}
                    </span>
                  )}
                  {destination?.price_range && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold">
                      {destination.price_range}
                    </span>
                  )}
                  {destination?.rating && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold">
                      ⭐ {destination.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Selected Hotel */}
            {selectedHotel && (
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <HotelIcon className="h-6 w-6 mr-2" />
                  Selected Hotel
                </h2>
                <div className="p-4 border-2 border-green-500 bg-green-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{selectedHotel.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-slate-700">⭐ {selectedHotel.rating}</span>
                        {selectedHotel.room_type && (
                          <span className="text-slate-700 capitalize">{selectedHotel.room_type}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Per Night</p>
                      <p className="text-xl font-bold text-slate-900">PKR {selectedHotel.price_single || selectedHotel.price_couple}</p>
                    </div>
                  </div>
                  {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-green-200">
                      {selectedHotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-white text-slate-700 border border-slate-300 px-2 py-1">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => setShowHotelOptions(!showHotelOptions)}
                      className="py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-semibold"
                    >
                      {showHotelOptions ? 'Hide Options' : 'Change Hotel'}
                    </button>
                    <button
                      onClick={() => setSelectedHotel(null)}
                      className="py-2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-sm font-semibold"
                    >
                      Remove Hotel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Available Hotels */}
            {(!selectedHotel || showHotelOptions) && !loadingHotels && hotels.length > 0 && (
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <HotelIcon className="h-6 w-6 mr-2" />
                  {selectedHotel ? 'Other Available Hotels' : 'Available Hotels'}
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setShowHotelOptions(false);
                      }}
                      className={`p-4 border-2 cursor-pointer transition-all ${
                        selectedHotel?.id === hotel.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900">{hotel.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{hotel.address}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-slate-700">⭐ {hotel.rating}</span>
                            <span className="text-slate-700">📞 {hotel.phone}</span>
                          </div>
                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 3 && (
                                <span className="text-xs text-slate-500">+{hotel.amenities.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-slate-600">Per Night</p>
                          <p className="text-xl font-bold text-slate-900">PKR {hotel.price_couple || hotel.price_single}</p>
                          {selectedHotel?.id === hotel.id && (
                            <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Selected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Hotels Available */}
            {!loadingHotels && hotels.length === 0 && !selectedHotel && (
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <HotelIcon className="h-6 w-6 mr-2" />
                  Hotels
                </h2>
                <p className="text-slate-600 text-center py-8">No hotels available for this destination</p>
              </div>
            )}
            
            {/* Loading Hotels */}
            {loadingHotels && (
              <div className="bg-white shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <HotelIcon className="h-6 w-6 mr-2" />
                  Hotels
                </h2>
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Cost Summary */}
          <div className="space-y-6">
            {/* Travel Details */}
            <div className="bg-white shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Travel Details</h2>
              <div className="space-y-3">
                {getTotalTripDays() > 0 && (
                  <div className="flex items-center justify-between py-2 bg-blue-50 -mx-6 px-6 mb-2">
                    <span className="text-slate-700 font-medium">Total Trip Duration</span>
                    <span className="font-bold text-lg text-blue-900">{getTotalTripDays()} {getTotalTripDays() === 1 ? 'Day' : 'Days'}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">From</span>
                  <span className="font-semibold text-slate-900 text-sm text-right">{startLocation.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Mode</span>
                  <div className="flex items-center space-x-2">
                    {getTravelIcon(travelMode)}
                    <span className="font-semibold text-slate-900">{travelMode.charAt(0).toUpperCase() + travelMode.slice(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Distance</span>
                  <span className="font-semibold text-slate-900">{distance?.toFixed(2)} km</span>
                </div>
                {ratePerKm && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Rate/km</span>
                    <span className="font-semibold text-slate-900">PKR {ratePerKm}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Coins className="h-5 w-5 mr-2" />
                Cost Summary
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Travel Cost (Round Trip)</span>
                  <span className="font-semibold text-slate-900">PKR {travelCost}</span>
                </div>
                {selectedHotel && (
                  <>
                    <div className="py-2 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Accommodation Type</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <button
                          onClick={() => setRoomType('single')}
                          className={`py-2 px-3 text-sm font-medium transition-all ${
                            roomType === 'single'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Single
                        </button>
                        <button
                          onClick={() => setRoomType('couple')}
                          className={`py-2 px-3 text-sm font-medium transition-all ${
                            roomType === 'couple'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Couple
                        </button>
                        <button
                          onClick={() => setRoomType('family')}
                          className={`py-2 px-3 text-sm font-medium transition-all ${
                            roomType === 'family'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Family
                        </button>
                      </div>
                    </div>
                    <div className="py-2 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Hotel ({numberOfNights} {numberOfNights === 1 ? 'Night' : 'Nights'})</span>
                        <span className="font-semibold text-slate-900">PKR {getTotalHotelCost()}</span>
                      </div>
                      <span className="text-xs text-slate-500 block mt-1">
                        Base: PKR {selectedHotel.price_single} × {getRoomMultiplier()}x ({roomType.charAt(0).toUpperCase() + roomType.slice(1)}) × {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}
                      </span>
                    </div>
                  </>
                )}
                {!selectedHotel && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Hotel</span>
                    <span className="font-semibold text-slate-900">PKR 0.00</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3 bg-green-50 -mx-6 px-6 mt-3">
                  <span className="text-lg font-bold text-slate-900">Total Estimated Cost</span>
                  <span className="text-2xl font-bold text-green-900">PKR {calculateTotalCost()}</span>
                </div>
              </div>
            </div>

            {/* Departure Details */}
            <div className="bg-white shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Trip Schedule</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Save Trip Button */}
            <button
              onClick={handleSaveTrip}
              disabled={saving}
              className="w-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg font-semibold"
            >
              <Save className="h-6 w-6" />
              <span>{saving ? 'Saving...' : 'Save Trip'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripSummary;
