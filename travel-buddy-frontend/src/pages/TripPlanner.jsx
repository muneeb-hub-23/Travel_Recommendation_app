import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Search, Navigation, MapPin, ArrowLeft, Loader, Car, Bus, Bike, PersonStanding, Coins, ArrowRight } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import config from '../config';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map view changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const TripPlanner = ({ user, onLogout }) => {
  const { destinationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const destination = location.state?.destination;
  
  // Validate destination coordinates
  const destLat = parseFloat(destination?.latitude);
  const destLon = parseFloat(destination?.longitude);
  const hasValidCoordinates = !isNaN(destLat) && !isNaN(destLon) && destLat >= -90 && destLat <= 90 && destLon >= -180 && destLon <= 180;
  
  const [startLocation, setStartLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null); // Actual route distance
  const [routeDuration, setRouteDuration] = useState(null); // Actual route duration
  const [travelMode, setTravelMode] = useState('car');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [mapCenter, setMapCenter] = useState(hasValidCoordinates ? [destLat, destLon] : [30.3753, 69.3451]); // Pakistan center
  const [mapZoom, setMapZoom] = useState(hasValidCoordinates ? 8 : 6);
  const [travelRates, setTravelRates] = useState({});
  const [loadingRates, setLoadingRates] = useState(true);

  // Travel mode configurations (speed in km/h)
  const travelModes = {
    car: { icon: Car, label: 'Car', speed: 60, color: '#3b82f6' },
    bus: { icon: Bus, label: 'Bus', speed: 40, color: '#f59e0b' },
    motorbike: { icon: Bike, label: 'Motor Bike', speed: 40, color: '#10b981' },
    walking: { icon: PersonStanding, label: 'Walking', speed: 5, color: '#8b5cf6' }
  };

  // Fetch travel rates on component mount
  useEffect(() => {
    const fetchTravelRates = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/travel-rates/`);
        if (response.ok) {
          const data = await response.json();
          const ratesMap = {};
          data.forEach(rate => {
            ratesMap[rate.vehicle_type] = parseFloat(rate.rate_per_km);
          });
          setTravelRates(ratesMap);
        }
      } catch (error) {
        console.error('Error fetching travel rates:', error);
      } finally {
        setLoadingRates(false);
      }
    };
    fetchTravelRates();
  }, []);

  // Calculate round trip cost
  const calculateRoundTripCost = () => {
    if (!routeDistance && !distance) return null;
    const distanceKm = routeDistance || distance;
    const rate = travelRates[travelMode] || 0;
    // Round trip = distance * 2
    return (distanceKm * 2 * rate).toFixed(2);
  };

  // Calculate travel time based on distance and mode
  const calculateTravelTime = (distanceKm, mode) => {
    const speed = travelModes[mode].speed;
    const hours = distanceKm / speed;
    const totalMinutes = Math.round(hours * 60);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    } else {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return m > 0 ? `${h}h ${m}min` : `${h}h`;
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fetch road-based route from OSRM
  const fetchRoadRoute = async (startLat, startLon, endLat, endLon, mode) => {
    setIsLoadingRoute(true);
    setRouteError(null); // Clear previous errors
    console.log('🚀 Fetching route for mode:', mode);
    
    try {
      // OSRM profile mapping
      const osrmProfile = mode === 'car' || mode === 'bus' || mode === 'motorbike' ? 'car' : 'foot';
      
      // OSRM public API endpoint
      const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
      
      console.log('📍 API URL:', url);
      console.log('🎯 Profile being used:', osrmProfile);
      
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();
      console.log('📦 Raw OSRM response:', data);
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Convert GeoJSON coordinates to Leaflet format [lat, lon]
        const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Distance in kilometers
        const distanceKm = route.distance / 1000;
        
        // Duration in seconds from OSRM
        let durationSec = route.duration;
        
        // Adjust duration based on travel mode
        // OSRM often returns similar times for all modes in some regions
        // so we apply realistic multipliers based on average speeds
        if (mode === 'bus') {
          // Buses are typically 30-50% slower than cars due to stops
          durationSec = durationSec * 1.5;
        } else if (mode === 'motorbike') {
          // Motorbikes can be slightly faster in traffic but slower on highways
          // Average ~40 km/h in mixed conditions, similar to bus
          durationSec = durationSec * 1.2; // 20% more time than car
        } else if (mode === 'walking') {
          // Walking averages 5 km/h vs cars at 50-60 km/h
          const walkSpeedKmh = 5;
          const carSpeedKmh = 60;
          const speedRatio = carSpeedKmh / walkSpeedKmh; // ~12x
          durationSec = durationSec * speedRatio;
        }
        
        console.log('OSRM Route:', {
          mode: mode,
          profile: osrmProfile,
          distance: distanceKm,
          originalDuration: route.duration,
          adjustedDuration: durationSec,
          durationFormatted: `${Math.floor(durationSec / 3600)}h ${Math.floor((durationSec % 3600) / 60)}min`,
          coordinateCount: routeCoordinates.length,
          firstCoord: routeCoordinates[0],
          lastCoord: routeCoordinates[routeCoordinates.length - 1]
        });
        
        console.log('✅ Setting route with', routeCoordinates.length, 'points');
        setRoute(routeCoordinates);
        setRouteDistance(distanceKm);
        setRouteDuration(durationSec);
        
        // Calculate straight-line distance for reference
        const straightDist = calculateDistance(startLat, startLon, endLat, endLon);
        setDistance(straightDist);
        
        return true;
      } else {
        // Fallback to straight line if routing fails
        console.error('❌ OSRM routing failed! Response:', data);
        console.error('API returned code:', data.code, 'Message:', data.message);
        setRouteError(`Road routing unavailable: ${data.message || data.code || 'Unknown error'}`);
        setRoute([[startLat, startLon], [endLat, endLon]]);
        const straightDist = calculateDistance(startLat, startLon, endLat, endLon);
        setDistance(straightDist);
        setRouteDistance(straightDist);
        return false;
      }
    } catch (error) {
      console.error('❌ Route fetch error:', error);
      console.error('Error details:', error.message, error.stack);
      setRouteError(`Network error: ${error.message}`);
      // Fallback to straight line
      setRoute([[startLat, startLon], [endLat, endLon]]);
      const straightDist = calculateDistance(startLat, startLon, endLat, endLon);
      setDistance(straightDist);
      setRouteDistance(straightDist);
      return false;
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Search for location using Nominatim (OpenStreetMap)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=pk`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleSelectLocation = async (result) => {
    const start = {
      name: result.display_name,
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon)
    };
    
    setStartLocation(start);
    setSearchResults([]);
    setSearchQuery(result.display_name);
    
    // Fetch road-based route
    if (destination && hasValidCoordinates) {
      await fetchRoadRoute(start.lat, start.lon, destLat, destLon, travelMode);
      
      // Center map to show both points
      const centerLat = (start.lat + destLat) / 2;
      const centerLon = (start.lon + destLon) / 2;
      setMapCenter([centerLat, centerLon]);
      
      // Calculate appropriate zoom level based on distance
      const dist = calculateDistance(start.lat, start.lon, destLat, destLon);
      const zoom = dist > 500 ? 6 : dist > 200 ? 7 : dist > 100 ? 8 : dist > 50 ? 9 : 10;
      setMapZoom(zoom);
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const start = {
            name: 'Your Current Location',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          
          setStartLocation(start);
          setSearchQuery('Your Current Location');
          
          if (destination && hasValidCoordinates) {
            await fetchRoadRoute(start.lat, start.lon, destLat, destLon, travelMode);
            
            const centerLat = (start.lat + destLat) / 2;
            const centerLon = (start.lon + destLon) / 2;
            setMapCenter([centerLat, centerLon]);
            
            const dist = calculateDistance(start.lat, start.lon, destLat, destLon);
            const zoom = dist > 500 ? 6 : dist > 200 ? 7 : dist > 100 ? 8 : dist > 50 ? 9 : 10;
            setMapZoom(zoom);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please search manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Refetch route when travel mode changes
  useEffect(() => {
    if (startLocation && destination && hasValidCoordinates) {
      console.log('=== Travel mode changed to:', travelMode, '===');
      console.log('Current start location:', startLocation);
      console.log('Current destination:', destLat, destLon);
      
      // Clear existing route data to force refresh
      setRoute(null);
      setRouteDuration(null);
      setRouteDistance(null);
      setRouteError(null);
      
      // Small delay to ensure state clears before refetch
      setTimeout(() => {
        fetchRoadRoute(startLocation.lat, startLocation.lon, destLat, destLon, travelMode);
      }, 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelMode]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={onLogout} />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Destination Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Plan Your Trip</h1>
          <p className="text-slate-600">
            Destination: <span className="font-semibold text-slate-900">{destination.name}</span>, {destination.country}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border border-slate-200 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Select Start Location</h2>
              
              {/* Current Location Button */}
              <button
                onClick={handleUseCurrentLocation}
                className="w-full bg-green-600 text-white py-3 px-4 mb-4 hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Navigation className="h-5 w-5" />
                <span>Use Current Location</span>
              </button>

              <div className="relative mb-4">
                <span className="block text-center text-slate-500 text-sm mb-4">OR</span>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a city or location..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="w-full bg-blue-600 text-white py-3 mt-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <span className="flex items-center justify-center">
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    'Search Location'
                  )}
                </button>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border border-slate-200 max-h-64 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectLocation(result)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{result.display_name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Travel Mode Selection */}
              {startLocation && (
                <div className="mt-6">
                  <h3 className="font-bold text-slate-900 mb-3">Travel Mode</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(travelModes).map(([mode, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={mode}
                          onClick={() => setTravelMode(mode)}
                          className={`p-3 border-2 transition-all flex flex-col items-center space-y-1 ${
                            travelMode === mode
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${
                            travelMode === mode ? 'text-blue-600' : 'text-slate-600'
                          }`} />
                          <span className={`text-xs font-medium ${
                            travelMode === mode ? 'text-blue-900' : 'text-slate-700'
                          }`}>
                            {config.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Route Info */}
              {startLocation && distance && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-3">Route Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-2"></div>
                      <div>
                        <p className="font-semibold text-slate-900">Start</p>
                        <p className="text-slate-600 text-xs">{startLocation.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-2"></div>
                      <div>
                        <p className="font-semibold text-slate-900">Destination</p>
                        <p className="text-slate-600 text-xs">{destination.name}, {destination.country}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-blue-300 space-y-2">
                      {isLoadingRoute ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader className="h-6 w-6 text-blue-600 animate-spin mr-2" />
                          <span className="text-slate-600">Calculating route...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Route Distance:</span>
                            <span className="font-bold text-lg text-blue-900">
                              {routeDistance ? routeDistance.toFixed(2) : distance?.toFixed(2) || '0'} km
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-700 font-medium">Travel Time:</span>
                            <span className="font-bold text-lg text-blue-900">
                              {routeDuration 
                                ? (() => {
                                    const hours = Math.floor(routeDuration / 3600);
                                    const minutes = Math.floor((routeDuration % 3600) / 60);
                                    if (hours > 0) {
                                      return `${hours}h ${minutes}min`;
                                    }
                                    return `${minutes} min`;
                                  })()
                                : calculateTravelTime(routeDistance || distance, travelMode)
                              }
                            </span>
                          </div>
                          {routeDistance && distance && (
                            <div className="text-xs text-slate-600 bg-white p-2 rounded">
                              <div className="flex items-center justify-between">
                                <span>Direct distance:</span>
                                <span className="font-semibold">{distance.toFixed(2)} km</span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span>Extra via roads:</span>
                                <span className="font-semibold text-amber-600">+{((routeDistance - distance)).toFixed(2)} km</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 pt-2">
                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ 
                                  width: '100%',
                                  background: `linear-gradient(to right, ${travelModes[travelMode].color}, ${travelModes[travelMode].color}dd)`
                                }}
                              ></div>
                            </div>
                          </div>
                          {/* Estimated Round Trip Cost */}
                          {!loadingRates && travelRates[travelMode] && travelMode !== 'walking' && (
                            <div className="bg-green-50 border-2 border-green-400 rounded p-3 mt-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Coins className="h-5 w-5 text-green-600" />
                                  <span className="text-slate-700 font-medium">Round Trip Cost:</span>
                                </div>
                                <span className="font-bold text-xl text-green-900">
                                  PKR {calculateRoundTripCost()}
                                </span>
                              </div>
                              <p className="text-xs text-green-700 mt-1">
                                Based on {travelRates[travelMode]} PKR/km × {((routeDistance || distance) * 2).toFixed(2)} km
                              </p>
                            </div>
                          )}
                          {routeError ? (
                            <div className="bg-amber-50 border border-amber-300 rounded p-2 mt-2">
                              <p className="text-xs text-amber-800 font-semibold">⚠️ Using straight-line route</p>
                              <p className="text-xs text-amber-700 mt-1">{routeError}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-600 mt-2 italic">
                              {routeDistance && route && route.length > 10 ? '✓ Route follows actual roads' : '* Straight-line estimate'}
                            </p>
                          )}
                          {/* Next Button */}
                          <button
                            onClick={() => {
                              navigate('/trip-summary', {
                                state: {
                                  destination,
                                  startLocation,
                                  travelMode,
                                  distance: routeDistance || distance,
                                  duration: routeDuration,
                                  travelCost: calculateRoundTripCost(),
                                  ratePerKm: travelRates[travelMode]
                                }
                              });
                            }}
                            className="w-full mt-4 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                          >
                            <span>Proceed to Trip Summary</span>
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 overflow-hidden h-[600px] relative z-0">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeView center={mapCenter} zoom={mapZoom} />
                
                {/* Start Location Marker */}
                {startLocation && (
                  <Marker position={[startLocation.lat, startLocation.lon]} icon={startIcon}>
                    <Popup>
                      <strong>Start:</strong><br />
                      {startLocation.name}
                    </Popup>
                  </Marker>
                )}
                
                {/* Destination Marker */}
                {destination && hasValidCoordinates && (
                  <Marker position={[destLat, destLon]} icon={endIcon}>
                    <Popup>
                      <strong>Destination:</strong><br />
                      {destination.name}, {destination.country}
                    </Popup>
                  </Marker>
                )}
                
                {/* Route Line */}
                {route && route.length > 0 && (
                  <>
                    {console.log('🗺️ Rendering route on map:', {
                      pointCount: route.length,
                      isArray: Array.isArray(route),
                      firstPoint: route[0],
                      lastPoint: route[route.length - 1],
                      mode: travelMode
                    })}
                    {/* Shadow/outline for better visibility */}
                    <Polyline
                      positions={route}
                      color="#000000"
                      weight={6}
                      opacity={0.3}
                    />
                    {/* Main route line with travel mode color */}
                    <Polyline
                      positions={route}
                      color={travelModes[travelMode].color}
                      weight={4}
                      opacity={0.8}
                      dashArray={travelMode === 'walking' ? "5, 10" : travelMode === 'motorbike' ? "10, 5" : ""}
                    />
                  </>
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
