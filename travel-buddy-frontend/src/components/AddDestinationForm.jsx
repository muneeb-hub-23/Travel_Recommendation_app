import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Cloud, Plane, Bus, Car, Bike, Train, Upload, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import config from '../config';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddDestinationForm = ({ onClose, onSubmit, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    country: initialData?.country || '',
    description: initialData?.description || '',
    category: initialData?.category || 'mountain',
    price_range: initialData?.price_range || 'moderate',
    best_season: initialData?.best_season || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    travel_options: initialData?.travel_options ? (Array.isArray(initialData.travel_options) ? initialData.travel_options : initialData.travel_options.split(',').map(t => t.trim())) : [],
    general_weather: initialData?.general_weather || '',
    weather_area: initialData?.weather_area || '',
    image: null,
    activities: initialData?.activities || '',
    accommodation_info: initialData?.accommodation_info || ''
  });

  const [mapCenter, setMapCenter] = useState(() => {
    if (initialData?.latitude && initialData?.longitude) {
      return { lat: parseFloat(initialData.latitude), lng: parseFloat(initialData.longitude) };
    }
    return { lat: 30.3753, lng: 69.3451 }; // Pakistan center
  });
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [imagePreview, setImagePreview] = useState(() => {
    if (initialData?.image) {
      return initialData.image.startsWith('http') ? initialData.image : `${config.API_BASE_URL}${initialData.image}`;
    }
    return null;
  });
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionTimeoutRef = useRef(null);

  const categories = [
    { value: 'beach', label: 'Beach' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'city', label: 'City' },
    { value: 'historical', label: 'Historical' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' }
  ];

  const priceRanges = [
    { value: 'budget', label: 'Budget' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'luxury', label: 'Luxury' }
  ];

  const travelOptions = [
    { value: 'plane', label: 'Plane', icon: Plane },
    { value: 'bus', label: 'Bus', icon: Bus },
    { value: 'car', label: 'Car', icon: Car },
    { value: 'bike', label: 'Bike', icon: Bike },
    { value: 'train', label: 'Train', icon: Train }
  ];

  const fetchCitySuggestions = async (query) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results) {
        setCitySuggestions(data.results);
        setShowSuggestions(true);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setCitySuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.weather-area-input')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle clipboard paste for images
  useEffect(() => {
    const handlePaste = async (e) => {
      // Get clipboard items
      const items = e.clipboardData?.items;
      if (!items) return;

      // Look for an image in clipboard
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Check if item is an image
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          
          // Get the blob from clipboard
          const blob = item.getAsFile();
          if (!blob) continue;

          // Create a File object with a proper name
          const timestamp = new Date().getTime();
          const file = new File([blob], `pasted-image-${timestamp}.png`, { type: blob.type });
          
          // Set the image in form data
          setFormData(prev => ({ ...prev, image: file }));
          
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
          
          // Show success notification
          await Swal.fire({
            icon: 'success',
            title: 'Image Pasted!',
            text: 'Image from clipboard has been added',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          
          break;
        }
      }
    };

    // Add paste event listener
    document.addEventListener('paste', handlePaste);
    
    // Cleanup
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Handle autocomplete for weather_area
    if (name === 'weather_area') {
      // Clear existing timeout
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      
      // Debounce the API call
      suggestionTimeoutRef.current = setTimeout(() => {
        fetchCitySuggestions(value);
      }, 300);
    }
  };

  const handleCitySelect = (city) => {
    const cityName = city.name;
    setFormData(prev => ({ 
      ...prev, 
      weather_area: cityName,
      latitude: city.latitude.toString(),
      longitude: city.longitude.toString()
    }));
    setMapCenter({ lat: city.latitude, lng: city.longitude });
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  const handleTravelOptionToggle = (option) => {
    setFormData(prev => ({
      ...prev,
      travel_options: prev.travel_options.includes(option)
        ? prev.travel_options.filter(o => o !== option)
        : [...prev.travel_options, option]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }));
    setMapCenter({ lat, lng });
  };

  const fetchWeather = async () => {
    if (!formData.weather_area && (!formData.latitude || !formData.longitude)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter a weather area or select location on map',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setLoadingWeather(true);
    try {
      const params = new URLSearchParams();
      if (formData.weather_area) {
        params.append('city', formData.weather_area);
      } else {
        params.append('lat', formData.latitude);
        params.append('lon', formData.longitude);
      }

      const response = await fetch(`${config.API_BASE_URL}/api/weather/?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeather(data);
        setFormData(prev => ({
          ...prev,
          general_weather: `${data.weather} - ${data.description}`,
          weather_area: data.location
        }));
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Weather Fetch Failed',
          text: data.error || 'Failed to fetch weather',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching weather: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'travel_options') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (key === 'image' && formData[key]) {
        submitData.append(key, formData[key]);
      } else if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto pt-8 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{isEdit ? 'Edit Destination' : 'Add New Destination'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Destination Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Hunza Valley"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Pakistan"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Describe the destination..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range *
                </label>
                <select
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Best Season */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Best Season
                </label>
                <input
                  type="text"
                  name="best_season"
                  value={formData.best_season}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., March to November"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <Upload className="h-5 w-5 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600">
                      {formData.image ? formData.image.name : 'Choose image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  💡 Tip: Press <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">Ctrl+V</kbd> to paste image from clipboard
                </p>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-3 w-full h-40 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Right Column - Location & Travel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Location & Travel</h3>
              
              {/* Map Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Select Location on Map
                </label>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <SimpleMap
                    center={mapCenter}
                    onMapClick={handleMapClick}
                    marker={formData.latitude && formData.longitude ? {
                      lat: parseFloat(formData.latitude),
                      lng: parseFloat(formData.longitude)
                    } : null}
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="0.000001"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 36.3167"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="0.000001"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 74.5833"
                  />
                </div>
              </div>

              {/* Travel Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Travel Options
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {travelOptions.map(option => {
                    const Icon = option.icon;
                    const isSelected = formData.travel_options.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleTravelOptionToggle(option.value)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weather Section */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                  <Cloud className="h-4 w-4 mr-2" />
                  Weather Information
                </h4>
                
                <div className="space-y-3">
                  <div className="relative weather-area-input">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Weather Area/City
                    </label>
                    <input
                      type="text"
                      name="weather_area"
                      value={formData.weather_area}
                      onChange={handleChange}
                      onFocus={() => formData.weather_area.length >= 2 && citySuggestions.length > 0 && setShowSuggestions(true)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Gilgit, Murree, Islamabad"
                      autoComplete="off"
                    />
                    {loadingSuggestions && (
                      <div className="absolute right-3 top-11">
                        <Loader className="h-4 w-4 animate-spin text-primary-500" />
                      </div>
                    )}
                    
                    {/* Autocomplete Dropdown */}
                    {showSuggestions && citySuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {citySuggestions.map((city, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium text-slate-800">{city.name}</div>
                            <div className="text-xs text-slate-500">
                              {city.admin1 && `${city.admin1}, `}
                              {city.country}
                              <span className="ml-2 text-slate-400">
                                ({city.latitude.toFixed(4)}, {city.longitude.toFixed(4)})
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={fetchWeather}
                    disabled={loadingWeather}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    {loadingWeather ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Fetching Weather...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="h-4 w-4" />
                        <span>Fetch Real-Time Weather</span>
                      </>
                    )}
                  </button>

                  {weather && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-800">{weather.location}</span>
                        <span className="text-2xl font-bold text-primary-600">
                          {Math.round(weather.temperature)}°C
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 capitalize">{weather.description}</p>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-slate-600">
                        <div>Humidity: {weather.humidity}%</div>
                        <div>Wind: {weather.wind_speed} m/s</div>
                        <div>Clouds: {weather.clouds}%</div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      General Weather
                    </label>
                    <input
                      type="text"
                      name="general_weather"
                      value={formData.general_weather}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Sunny - Clear sky"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-8 py-2"
            >
              {isEdit ? 'Update Destination' : 'Add Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Map Click Handler Component
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Interactive Leaflet Map Component
const SimpleMap = ({ center, onMapClick, marker }) => {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        key={`${center.lat}-${center.lng}`}
      >
        {/* OpenStreetMap Tiles - Shows location names like Google Maps */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        {marker && (
          <Marker position={[marker.lat, marker.lng]} />
        )}
      </MapContainer>
    </div>
  );
};

export default AddDestinationForm;
