import { useState, useEffect } from 'react';
import useVoiceInput from '../hooks/useVoiceInput';
import { motion } from 'framer-motion';
import config from '../config';
import Swal from 'sweetalert2';
import { 
  Send, Sparkles, Mountain, Palmtree, Snowflake, Waves, 
  Building2, Star, Plane, Bus, Bike, UtensilsCrossed, 
  Cloud, Sun, CloudRain, Search, TrendingUp, MapPin,
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
  Heart, Eye, Share2, Compass, Zap, ThumbsUp, Mic, MicOff, Languages, Navigation,
  ChevronDown, ChevronUp, DollarSign, Hotel, Car, X, Info, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSummary, setSearchSummary] = useState('');
  const [weatherLoading, setWeatherLoading] = useState({});
  const [myTrips, setMyTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [showAllTrips, setShowAllTrips] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [reviewTrip, setReviewTrip] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [destinationReviews, setDestinationReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Voice input hook
  const { isListening, isSupported, toggleListening, changeLanguage } = useVoiceInput(
    (transcript, isFinal) => {
      setQuery(transcript);
    },
    voiceLanguage
  );

  const handleLanguageChange = (lang) => {
    setVoiceLanguage(lang);
    changeLanguage(lang);
    setShowLanguageMenu(false);
  };

  const fetchWeatherForDestination = async (destination, index) => {
    // Mark this destination's weather as loading
    setWeatherLoading(prev => ({ ...prev, [destination.id]: true }));

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/weather/?lat=${destination.latitude}&lon=${destination.longitude}`
      );
      
      if (response.ok) {
        const weatherData = await response.json();
        
        // Update the specific destination with weather data
        setSearchResults(prevResults => {
          const newResults = [...prevResults];
          newResults[index] = {
            ...newResults[index],
            current_weather: {
              temperature: weatherData.temperature,
              description: weatherData.description
            }
          };
          return newResults;
        });
      }
    } catch (error) {
      console.error(`Weather fetch failed for ${destination.name}:`, error);
    } finally {
      setWeatherLoading(prev => ({ ...prev, [destination.id]: false }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchLoading(true);
    setWeatherLoading({});
    try {
      const response = await fetch(
        `${config.API_BASE_URL}/api/destinations/smart_search/?q=${encodeURIComponent(query)}&limit=20`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        
        // Build enhanced summary with budget and duration info
        let summary = data.summary || `Found ${data.count || 0} destinations`;
        if (data.room_type) {
          summary += ` • ${data.room_type.charAt(0).toUpperCase() + data.room_type.slice(1)} room`;
        }
        if (data.budget_min && data.budget_max) {
          summary += ` • PKR ${data.budget_min.toLocaleString()} - ${data.budget_max.toLocaleString()}`;
        } else if (data.budget_max) {
          summary += ` • Under PKR ${data.budget_max.toLocaleString()}`;
        } else if (data.budget_min) {
          summary += ` • Above PKR ${data.budget_min.toLocaleString()}`;
        }
        if (data.days && data.days > 1) {
          summary += ` • ${data.days} days`;
        }
        
        setSearchSummary(summary);

        // Fetch weather for each destination asynchronously
        if (data.results && data.results.length > 0) {
          data.results.forEach((dest, index) => {
            if (dest.latitude && dest.longitude) {
              fetchWeatherForDestination(dest, index);
            }
          });
        }

        // Scroll to search results
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        console.error('Search failed');
        setSearchResults([]);
        setSearchSummary('No results found');
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]);
      setSearchSummary('Error performing search');
    } finally {
      setSearchLoading(false);
    }
  };

  const destinationCategories = [
    { id: 1, name: 'Mountains', icon: Mountain, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', color: 'from-green-500 to-emerald-600' },
    { id: 2, name: 'Beaches', icon: Palmtree, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', color: 'from-cyan-500 to-blue-600' },
    { id: 3, name: 'Snow', icon: Snowflake, image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400', color: 'from-blue-400 to-indigo-600' },
    { id: 4, name: 'Rivers', icon: Waves, image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400', color: 'from-teal-500 to-cyan-600' },
    { id: 5, name: 'Cities', icon: Building2, image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400', color: 'from-purple-500 to-pink-600' },
    { id: 6, name: 'Desert', icon: Sun, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400', color: 'from-orange-500 to-red-600' },
  ];

  const hotelCategories = [
    { id: 1, name: '5 Star Luxury', icon: Star, stars: 5, price: '₨ 25,000+', color: 'from-yellow-400 to-amber-600' },
    { id: 2, name: 'Luxury Hotels', icon: Building2, stars: 4, price: '₨ 15,000-25,000', color: 'from-purple-400 to-pink-600' },
    { id: 3, name: 'Standard Hotels', icon: Building2, stars: 3, price: '₨ 8,000-15,000', color: 'from-blue-400 to-cyan-600' },
    { id: 4, name: 'Budget Rooms', icon: Building2, stars: 2, price: '₨ 3,000-8,000', color: 'from-green-400 to-emerald-600' },
    { id: 5, name: 'Villas', icon: Building2, stars: 5, price: '₨ 30,000+', color: 'from-red-400 to-orange-600' },
    { id: 6, name: 'Guest Houses', icon: Building2, stars: 2, price: '₨ 2,000-5,000', color: 'from-slate-400 to-gray-600' },
  ];

  const travelOptions = [
    { id: 1, name: 'By Air', icon: Plane, desc: 'Fast & Comfortable', color: 'from-sky-400 to-blue-600' },
    { id: 2, name: 'By Bus', icon: Bus, desc: 'Budget Friendly', color: 'from-green-400 to-emerald-600' },
    { id: 3, name: 'By Bike', icon: Bike, desc: 'Adventure', color: 'from-orange-400 to-red-600' },
    { id: 4, name: 'Local Travel', icon: Bus, desc: 'Explore Locally', color: 'from-purple-400 to-pink-600' },
  ];

  const foodOptions = [
    { id: 1, name: 'Fine Dining', icon: UtensilsCrossed, price: '₨ 2,000+', color: 'from-red-400 to-pink-600' },
    { id: 2, name: 'Casual Dining', icon: UtensilsCrossed, price: '₨ 800-2,000', color: 'from-orange-400 to-amber-600' },
    { id: 3, name: 'Street Food', icon: UtensilsCrossed, price: '₨ 200-800', color: 'from-yellow-400 to-orange-600' },
    { id: 4, name: 'Local Cuisine', icon: UtensilsCrossed, price: '₨ 500-1,500', color: 'from-green-400 to-emerald-600' },
  ];

  const weatherOptions = [
    { id: 1, name: 'Sunny', icon: Sun, temp: '25-35°C', color: 'from-yellow-400 to-orange-500' },
    { id: 2, name: 'Cloudy', icon: Cloud, temp: '20-28°C', color: 'from-slate-400 to-gray-500' },
    { id: 3, name: 'Rainy', icon: CloudRain, temp: '18-25°C', color: 'from-blue-400 to-indigo-500' },
    { id: 4, name: 'Cold', icon: Snowflake, temp: '0-15°C', color: 'from-cyan-400 to-blue-600' },
  ];

  // Fetch destinations from API on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_BASE_URL}/api/destinations/`);
        if (response.ok) {
          const data = await response.json();
          // Handle both paginated and non-paginated responses
          setDestinations(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Get trending destinations (top rated)
  const trendingDestinations = destinations.slice(0, 3);

  // Fetch user's trips
  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!user || !user.id) return;
      
      setTripsLoading(true);
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/trips/user/?user_id=${user.id}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          // Transform backend data to frontend format
          const formattedTrips = data.map(trip => {
            // Calculate number of days
            const startDate = new Date(trip.departure_date);
            const endDate = trip.return_date ? new Date(trip.return_date) : startDate;
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
            
            // Determine status dynamically based on dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tripStart = new Date(trip.departure_date);
            tripStart.setHours(0, 0, 0, 0);
            const tripEnd = new Date(trip.return_date);
            tripEnd.setHours(0, 0, 0, 0);
            
            let status;
            if (trip.status === 'cancelled') {
              status = 'cancelled';
            } else if (today >= tripStart && today <= tripEnd) {
              status = 'ongoing';
            } else if (today < tripStart) {
              status = 'upcoming';
            } else {
              status = 'completed';
            }
            
            // Get the actual destination image URL
            let imageUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
            
            // Backend returns 'image' field in destination_details
            if (trip.destination_details?.image) {
              // Check if it's a relative URL and prepend API_BASE_URL
              imageUrl = trip.destination_details.image.startsWith('http') 
                ? trip.destination_details.image 
                : `${config.API_BASE_URL}${trip.destination_details.image}`;
            }
            
            return {
              id: trip.id,
              destination: trip.destination_details?.name || 'Unknown Destination',
              location: trip.destination_details?.location || '',
              image: imageUrl,
              startDate: trip.departure_date,
              endDate: trip.return_date,
              status: status,
              days: days,
              category: trip.destination_details?.category || 'Travel',
              budget: `₨ ${trip.total_cost ? parseFloat(trip.total_cost).toLocaleString() : '0'}`,
              travel_mode: trip.travel_mode_display || trip.travel_mode,
              // Store full trip data for modal
              fullData: trip
            };
          });
          
          setMyTrips(formattedTrips);
        } else {
          console.error('Failed to fetch trips:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user trips:', error);
      } finally {
        setTripsLoading(false);
      }
    };
    
    fetchUserTrips();
  }, [user]);

  // Explore destinations - all available destinations
  const exploreDestinations = destinations;

  // Fetch personalized recommendations based on user trip history
  useEffect(() => {
    const fetchPersonalizedRecommendations = async () => {
      if (!user || !user.id) return;
      
      setRecommendationsLoading(true);
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/destinations/personalized_for_user/?user_id=${user.id}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setPersonalizedRecommendations(data);
        } else {
          console.error('Failed to fetch personalized recommendations');
          setPersonalizedRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching personalized recommendations:', error);
        setPersonalizedRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };
    
    fetchPersonalizedRecommendations();
  }, [user]);

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        {/* Hero Section with AI Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Your AI Travel Companion
            </h1>
          </div>
          <p className="text-slate-600 text-lg mb-8">
            {user ? `Welcome back, ${user.name}! Ready for your next adventure?` : 'Plan your perfect trip with AI-powered recommendations'}
          </p>

          {/* AI Prompt Bar */}
          <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="flex items-center bg-white rounded-xl shadow-md border border-slate-200 p-2">
                <Search className="h-5 w-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Plan a 3-day trip to northern Pakistan under 25,000 PKR..."
                  className="flex-1 px-4 py-3 text-base font-normal outline-none bg-transparent"
                />
                
                <button
                  type="submit"
                  className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  <span>Plan Trip</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

        </motion.div>

        {/* AI Search Loader - Shows immediately when searching starts */}
        {searchLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
              <div className="text-center py-8">
                {/* Animated loader */}
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                
                {/* Animated text */}
                <div className="mb-4">
                  <p className="text-xl font-semibold text-slate-900 animate-pulse">
                    AI is searching destinations...
                  </p>
                </div>
                
                {/* Progress steps */}
                <div className="max-w-md mx-auto space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Analyzing your query</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span>Finding matching destinations</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span>Fetching live weather data ☁️</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Search Results */}
        {searchResults && !searchLoading && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="bg-slate-50 p-6 mb-6 border border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Sparkles className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">AI Search Results</h2>
                    <p className="text-slate-600 text-sm mt-1">{searchSummary}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSearchResults(null);
                    setQuery('');
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors shadow-sm"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear Search</span>
                </button>
              </div>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white shadow-sm border border-slate-200">
                <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No results found</h3>
                <p className="text-slate-600 mb-4">Try different keywords or check spelling</p>
                <button
                  onClick={() => setSearchResults(null)}
                  className="btn-primary"
                >
                  Try Another Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {searchResults.map((dest, index) => (
                  <TrendingCard 
                    key={dest.id} 
                    destination={dest} 
                    weatherLoading={weatherLoading} 
                    delay={index * 0.05}
                    onCardClick={setSelectedDestination}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* My Trips Section - Only for logged-in users */}
        {user && (
          <Section title="My Trips" icon={MapPin}>
            {tripsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : myTrips.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(showAllTrips ? myTrips : myTrips.slice(0, 4)).map((trip, index) => (
                    <MyTripCard 
                      key={trip.id} 
                      trip={trip} 
                      delay={index * 0.1} 
                      onViewDetails={() => setSelectedTrip(trip)}
                      onReview={() => setReviewTrip(trip)}
                    />
                  ))}
                </div>
                {myTrips.length > 4 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setShowAllTrips(!showAllTrips)}
                      className="px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <span>{showAllTrips ? 'Show Less' : `See All ${myTrips.length} Trips`}</span>
                      {showAllTrips ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No trips yet</p>
                <p className="text-slate-500 text-sm">Start planning your next adventure!</p>
              </div>
            )}
          </Section>
        )}

        {/* Personalized Recommendations - Only for logged-in users */}
        {user && (
          <Section title="Recommended For You" icon={Zap}>
            <p className="text-slate-600 mb-6 -mt-3">Based on your previous trips and preferences</p>
            {recommendationsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : personalizedRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {personalizedRecommendations.map((dest, index) => (
                  <PersonalizedCard key={dest.id} destination={dest} delay={index * 0.1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No personalized recommendations yet</p>
                <p className="text-slate-500 text-sm">Start planning trips to get AI-powered recommendations!</p>
              </div>
            )}
          </Section>
        )}

        {/* Explore Destinations - Only for logged-in users */}
        {user && (
          <Section title="Explore New Destinations" icon={Compass}>
            {loading ? (
              <div className="text-center py-12">
                {/* Gemini-style animated loader */}
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-accent-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-slate-600 font-medium">Loading destinations...</p>
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-12">
                <Compass className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No destinations to explore yet</p>
                <p className="text-sm text-slate-500">Admin can add destinations from the dashboard</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exploreDestinations.map((dest, index) => (
                  <ExploreCard key={dest.id} destination={dest} delay={index * 0.1} />
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Destination Categories - Only for logged-in users */}
        {user && (
          <Section title="Choose Your Destination Type" icon={Mountain}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {destinationCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Trending Destinations */}
        <Section title="Trending Destinations" icon={TrendingUp}>
          {loading ? (
            <div className="text-center py-12">
              {/* Gemini-style animated loader */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-accent-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-slate-600 font-medium">Loading destinations...</p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No destinations available yet</p>
              <p className="text-sm text-slate-500">Add destinations from the admin dashboard to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingDestinations.map((dest, index) => (
                <TrendingCard key={dest.id} destination={dest} delay={index * 0.1} />
              ))}
            </div>
          )}
        </Section>

        {/* Hotel Categories - Only for logged-in users */}
        {user && (
          <Section title="Select Accommodation" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotelCategories.map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  isSelected={selectedHotel === hotel.id}
                  onClick={() => setSelectedHotel(hotel.id === selectedHotel ? null : hotel.id)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Travel Options - Only for logged-in users */}
        {user && (
          <Section title="Choose Travel Mode" icon={Plane}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {travelOptions.map((option, index) => (
                <TravelCard
                  key={option.id}
                  option={option}
                  isSelected={selectedTravel === option.id}
                  onClick={() => setSelectedTravel(option.id === selectedTravel ? null : option.id)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Food Options - Only for logged-in users */}
        {user && (
          <Section title="Food Preferences" icon={UtensilsCrossed}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {foodOptions.map((food, index) => (
                <FoodCard key={food.id} food={food} delay={index * 0.1} />
              ))}
            </div>
          </Section>
        )}

        {/* Weather Preferences - Only for logged-in users */}
        {user && (
          <Section title="Preferred Weather" icon={Cloud}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {weatherOptions.map((weather, index) => (
                <WeatherCard key={weather.id} weather={weather} delay={index * 0.1} />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}

      {/* Review Modal */}
      {reviewTrip && (
        <ReviewModal trip={reviewTrip} onClose={() => setReviewTrip(null)} user={user} />
      )}

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <DestinationDetailModal 
          destination={selectedDestination} 
          onClose={() => {
            setSelectedDestination(null);
            setDestinationReviews([]);
            setReviewsLoading(false);
          }}
          reviews={destinationReviews}
          reviewsLoading={reviewsLoading}
          onLoadReviews={async (destId) => {
            setReviewsLoading(true);
            try {
              const response = await fetch(`${config.API_BASE_URL}/api/reviews/?destination=${destId}`);
              if (response.ok) {
                const data = await response.json();
                setDestinationReviews(Array.isArray(data) ? data : (data.results || []));
              } else {
                setDestinationReviews([]);
              }
            } catch (error) {
              console.error('Error fetching reviews:', error);
              setDestinationReviews([]);
            } finally {
              setReviewsLoading(false);
            }
          }}
        />
      )}
    </div>
  );
};

// Section Component
const Section = ({ title, icon: Icon, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-16"
  >
    <div className="flex items-center mb-6">
      <Icon className="h-6 w-6 text-primary-600 mr-2" />
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h2>
    </div>
    {children}
  </motion.section>
);

// Category Card Component
const CategoryCard = ({ category, isSelected, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative cursor-pointer rounded-2xl overflow-hidden aspect-square group ${
      isSelected ? 'ring-4 ring-primary-500' : ''
    }`}
  >
    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
      <category.icon className="h-8 w-8 mb-2" />
      <span className="font-semibold text-lg">{category.name}</span>
    </div>
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-2 right-2 bg-white rounded-full p-1"
      >
        <div className="h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      </motion.div>
    )}
  </motion.div>
);

// Trending Card Component
const TrendingCard = ({ destination, weatherLoading = {}, delay, onCardClick }) => {
  const navigate = useNavigate();

  const handlePlanTrip = (e) => {
    e.stopPropagation();
    navigate(`/plan-trip/${destination.id}`, { 
      state: { 
        destination: destination
      } 
    });
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(destination);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="bg-white border border-slate-200 overflow-hidden cursor-pointer"
    >
    <div className="relative h-48 overflow-hidden">
      {destination.image ? (
        <img 
          src={destination.image.startsWith('http') ? destination.image : `${config.API_BASE_URL}${destination.image}`} 
          alt={destination.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-gray-400 opacity-50" />
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white px-2 py-1 flex items-center space-x-1">
        <Star className="h-4 w-4 text-black fill-black" />
        <span className="text-sm font-semibold text-black">{destination.rating || destination.average_rating || '0.0'}</span>
        <span className="text-xs text-gray-600">({destination.review_count || 0})</span>
      </div>
      {destination.category && (
        <div className="absolute top-3 left-3 bg-black px-3 py-1">
          <span className="text-xs font-medium text-white capitalize">{destination.category}</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg text-slate-800 mb-1">{destination.name}</h3>
      <p className="text-slate-600 text-sm mb-3 flex items-center">
        <MapPin className="h-3 w-3 mr-1" />
        {destination.country || destination.location}
      </p>
      
      {/* Hotel Information - Only show for multi-day trips */}
      {destination.hotel && !destination.is_day_trip && (
        <div className="bg-gray-100 p-3 mb-3 border border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black">🏨 {destination.hotel.name}</span>
            <span className="text-xs bg-white text-black border border-gray-300 px-2 py-0.5">
              ⭐ {destination.hotel.rating}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700">Room Type:</span>
              <span className="font-semibold text-black capitalize">{destination.hotel.room_type}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700">Per Night:</span>
              <span className="font-semibold text-black">PKR {Number(destination.hotel.price_per_night || 0).toLocaleString()}</span>
            </div>
            {destination.hotel.days > 1 && (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">Duration:</span>
                  <span className="font-semibold text-black">{destination.hotel.days} days</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-300">
                  <span className="text-gray-700 font-bold">Total Price:</span>
                  <span className="font-bold text-lg text-black">PKR {Number(destination.hotel.total_price || 0).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
          {destination.hotel.amenities && destination.hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {destination.hotel.amenities.map((amenity, idx) => (
                <span key={idx} className="text-xs bg-white text-black border border-gray-300 px-2 py-0.5">
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Weather (Live) */}
      {destination.current_weather && (
        <div className="flex items-center space-x-2 mb-2 text-xs">
          <div className="flex items-center bg-gray-100 text-black border border-gray-300 px-2 py-1">
            <Cloud className="h-3 w-3 mr-1" />
            <span className="font-medium">
              Now: {destination.current_weather.description}
              {destination.current_weather.temperature && ` • ${Math.round(destination.current_weather.temperature)}°C`}
            </span>
          </div>
        </div>
      )}
      
      {/* Weather Loading Indicator */}
      {!destination.current_weather && weatherLoading[destination.id] && (
        <div className="flex items-center space-x-2 mb-2 text-xs">
          <div className="flex items-center bg-gray-100 text-gray-600 border border-gray-300 px-2 py-1 animate-pulse">
            <Cloud className="h-3 w-3 mr-1 animate-spin" />
            <span>Loading weather...</span>
          </div>
        </div>
      )}
      
      {/* Stored Weather (Fallback) */}
      {!destination.current_weather && !weatherLoading[destination.id] && destination.general_weather && (
        <div className="flex items-center space-x-2 mb-2 text-xs">
          <div className="flex items-center bg-gray-100 text-black border border-gray-300 px-2 py-1">
            <Cloud className="h-3 w-3 mr-1" />
            <span>{destination.general_weather}</span>
          </div>
        </div>
      )}
      
      {/* Best Season */}
      {destination.best_season && (
        <div className="flex items-center space-x-2 text-xs mb-3">
          <div className="flex items-center bg-white text-black border border-gray-300 px-2 py-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Best: {destination.best_season}</span>
          </div>
        </div>
      )}

      {/* Plan Trip Button */}
      <button
        onClick={handlePlanTrip}
        className="w-full bg-black text-white py-2 px-4 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
      >
        <Navigation className="h-4 w-4" />
        <span>Plan Trip</span>
      </button>
    </div>
  </motion.div>
  );
};

// Hotel Card Component
const HotelCard = ({ hotel, isSelected, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`card p-6 cursor-pointer ${isSelected ? 'ring-4 ring-primary-500' : ''}`}
  >
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${hotel.color} mb-4`}>
      <hotel.icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="font-bold text-lg text-slate-800 mb-2">{hotel.name}</h3>
    <div className="flex mb-2">
      {[...Array(hotel.stars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-primary-600 font-semibold">{hotel.price}</p>
    {isSelected && (
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3">
        <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm inline-flex items-center">
          <span>✓ Selected</span>
        </div>
      </motion.div>
    )}
  </motion.div>
);

// Travel Card Component
const TravelCard = ({ option, isSelected, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`card p-6 cursor-pointer text-center ${isSelected ? 'ring-4 ring-primary-500' : ''}`}
  >
    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${option.color} mb-3`}>
      <option.icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="font-bold text-slate-800">{option.name}</h3>
    <p className="text-sm text-slate-600 mt-1">{option.desc}</p>
  </motion.div>
);

// Food Card Component
const FoodCard = ({ food, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.05 }}
    className="card p-6 text-center cursor-pointer"
  >
    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${food.color} mb-3`}>
      <food.icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="font-bold text-slate-800">{food.name}</h3>
    <p className="text-sm text-primary-600 font-semibold mt-1">{food.price}</p>
  </motion.div>
);

// Weather Card Component
const WeatherCard = ({ weather, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.05 }}
    className="card p-6 text-center cursor-pointer"
  >
    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${weather.color} mb-3`}>
      <weather.icon className="h-8 w-8 text-white" />
    </div>
    <h3 className="font-bold text-slate-800">{weather.name}</h3>
    <p className="text-sm text-slate-600 mt-1">{weather.temp}</p>
  </motion.div>
);

// My Trip Card Component
const MyTripCard = ({ trip, delay, onViewDetails, onReview }) => {
  const statusConfig = {
    upcoming: { icon: Clock, label: 'Upcoming' },
    planned: { icon: Clock, label: 'Planned' },
    ongoing: { icon: AlertCircle, label: 'Ongoing' },
    completed: { icon: CheckCircle2, label: 'Completed' },
    cancelled: { icon: XCircle, label: 'Cancelled' },
  };
  
  const config = statusConfig[trip.status];
  const StatusIcon = config?.icon || Clock;
  // Allow all users to review completed/ongoing trips
  const canReview = (trip.status === 'completed' || trip.status === 'ongoing') && onReview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className="card overflow-hidden cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="relative h-40 overflow-hidden">
        <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
        {/* Status Badge - Black and White */}
        <div className="absolute top-3 left-3 bg-black px-3 py-1 flex items-center space-x-1">
          <StatusIcon className="h-3 w-3 text-white" />
          <span className="text-xs font-medium text-white">{config?.label}</span>
        </div>
        {/* Days Badge */}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 flex items-center space-x-1">
          <Clock className="h-3 w-3 text-black" />
          <span className="text-xs font-semibold text-black">{trip.days} days</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-1">{trip.destination}</h3>
        <p className="text-slate-600 text-sm mb-3 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {trip.location}
        </p>
        
        {/* Trip Details Box */}
        <div className="bg-gray-100 p-3 mb-3 border border-gray-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-700">Start Date:</span>
            <span className="text-xs font-semibold text-black">{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-700">Category:</span>
            <span className="text-xs font-semibold text-black">{trip.category}</span>
          </div>
          {/* Hotel Contact - Show if night stay is included */}
          {trip.fullData?.hotel_details && trip.fullData.hotel_details.phone && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-300">
              <span className="text-xs text-gray-700 flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                Hotel Contact:
              </span>
              <span className="text-xs font-semibold text-black">{trip.fullData.hotel_details.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
          <span className="text-sm font-bold text-black">Total Budget:</span>
          <span className="text-sm font-bold text-black">{trip.budget}</span>
        </div>
        
        {/* Action Buttons */}
        <div className={`flex items-center justify-center mt-3 pt-3 border-t border-gray-300 ${canReview ? 'space-x-2' : ''}`}>
          <button 
            className="text-black text-sm font-medium flex items-center hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            <span>View Details</span>
            <Info className="h-4 w-4 ml-1" />
          </button>
          
          {canReview && (
            <button 
              className="bg-black text-white text-sm font-medium px-3 py-1 hover:bg-gray-800 transition-colors flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onReview();
              }}
            >
              <Star className="h-4 w-4 mr-1" />
              <span>Review</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Trip Detail Modal Component
const TripDetailModal = ({ trip, onClose }) => {
  if (!trip) return null;

  const statusConfig = {
    upcoming: { icon: Clock, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-700', label: 'Upcoming' },
    planned: { icon: Clock, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-700', label: 'Planned' },
    ongoing: { icon: AlertCircle, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-100', text: 'text-orange-700', label: 'Ongoing' },
    completed: { icon: CheckCircle2, color: 'from-green-500 to-emerald-500', bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'from-red-500 to-pink-500', bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  };

  const travelModeIcons = {
    'Car': Car,
    'car': Car,
    'Bus': Bus,
    'bus': Bus,
    'Motorbike': Bike,
    'motorbike': Bike,
    'Walking': Navigation,
    'walking': Navigation,
  };

  const config = statusConfig[trip.status];
  const StatusIcon = config?.icon || Clock;
  const TravelIcon = travelModeIcons[trip.travel_mode] || Car;
  
  const fullData = trip.fullData || {};
  const destination = fullData.destination_details || {};
  const hotel = fullData.hotel_details || {};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image */}
        <div className="relative h-64 overflow-hidden">
          <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5 text-slate-800" />
          </button>
          <div className="absolute bottom-4 left-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{trip.destination}</h2>
            <p className="flex items-center text-white/90">
              <MapPin className="h-4 w-4 mr-2" />
              {trip.location}
            </p>
          </div>
          <div className="absolute top-4 left-4 bg-black px-4 py-2 flex items-center space-x-2">
            <StatusIcon className="h-5 w-5 text-white" />
            <span className="font-semibold text-white">{config?.label}</span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-16rem)] p-6">
          {/* Trip Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 border border-gray-300">
              <Calendar className="h-8 w-8 text-black mb-2" />
              <p className="text-sm text-gray-700 mb-1">Start Date</p>
              <p className="font-semibold text-black">
                {new Date(trip.startDate).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="bg-gray-100 p-4 border border-gray-300">
              <Clock className="h-8 w-8 text-black mb-2" />
              <p className="text-sm text-gray-700 mb-1">Duration</p>
              <p className="font-semibold text-black">{trip.days} day{trip.days !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-gray-100 p-4 border border-gray-300">
              <p className="text-sm text-gray-700 mb-1">Total Budget</p>
              <p className="font-bold text-black text-lg">{trip.budget}</p>
            </div>
          </div>

          {/* Destination Details */}
          {destination.name && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                <Mountain className="h-6 w-6 mr-2 text-black" />
                Destination Details
              </h3>
              <div className="bg-gray-100 p-4 border border-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Name</span>
                  <span className="font-semibold text-black">{destination.name}</span>
                </div>
                {destination.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Category</span>
                    <span className="font-semibold text-black">{destination.category}</span>
                  </div>
                )}
                {destination.description && (
                  <div className="pt-2 border-t border-gray-300">
                    <p className="text-sm text-gray-700">{destination.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hotel Details */}
          {(hotel.name || fullData.hotel || fullData.hotel_cost > 0) && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-3 flex items-center">
                <Hotel className="h-6 w-6 mr-2 text-black" />
                Hotel Details
              </h3>
              <div className="bg-gray-100 p-4 border border-gray-300 space-y-2">
                {hotel.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Name</span>
                    <span className="font-semibold text-black">{hotel.name}</span>
                  </div>
                )}
                {!hotel.name && fullData.hotel && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Hotel ID</span>
                    <span className="font-semibold text-black">{fullData.hotel}</span>
                  </div>
                )}
                {hotel.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Address</span>
                    <span className="font-semibold text-black">{hotel.address}</span>
                  </div>
                )}
                {hotel.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </span>
                    <span className="font-semibold text-black">{hotel.phone}</span>
                  </div>
                )}
                {hotel.room_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Room Type</span>
                    <span className="font-semibold text-black">{hotel.room_type}</span>
                  </div>
                )}
                {fullData.hotel_cost && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Cost</span>
                    <span className="font-semibold text-black">₨ {parseFloat(fullData.hotel_cost).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Travel Details */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-black mb-3 flex items-center">
              <TravelIcon className="h-6 w-6 mr-2 text-black" />
              Travel Details
            </h3>
            <div className="bg-gray-100 p-4 border border-gray-300 space-y-2">
              {trip.travel_mode && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Travel Mode</span>
                  <span className="font-semibold text-black">{trip.travel_mode}</span>
                </div>
              )}
              {fullData.start_location && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Starting Point</span>
                  <span className="font-semibold text-black">{fullData.start_location}</span>
                </div>
              )}
              {fullData.distance && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Distance</span>
                  <span className="font-semibold text-black">{parseFloat(fullData.distance).toFixed(2)} km</span>
                </div>
              )}
              {fullData.travel_cost && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Travel Cost</span>
                  <span className="font-semibold text-black">₨ {parseFloat(fullData.travel_cost).toLocaleString()}</span>
                </div>
              )}
              {fullData.departure_time && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Departure Time</span>
                  <span className="font-semibold text-black">{fullData.departure_time}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Button */}
          {fullData.start_latitude && fullData.start_longitude && destination.latitude && destination.longitude && (
            <div className="mb-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${fullData.start_latitude},${fullData.start_longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white w-full py-3 px-4 hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Open in Google Maps
              </a>
            </div>
          )}

          {/* Return Date */}
          {trip.endDate && (
            <div className="bg-gray-100 p-4 border border-gray-300">
              <p className="text-sm text-gray-700 mb-1">Return Date</p>
              <p className="font-semibold text-black">
                {new Date(trip.endDate).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Review Modal Component
const ReviewModal = ({ trip, onClose, user }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!trip) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Rating Required',
        text: 'Please select a rating before submitting your review',
        confirmButtonColor: '#000000'
      });
      return;
    }

    setSubmitting(true);
    try {
      
      const response = await fetch(`${config.API_BASE_URL}/api/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: trip.fullData.destination,
          user: user.id,
          rating: rating,
          comment: comment
        })
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Review Submitted!',
          text: 'Thank you for sharing your experience',
          timer: 2000,
          showConfirmButton: false
        });
        onClose();
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: error.user || error.detail || 'Unable to submit review. Please try again.',
          confirmButtonColor: '#000000'
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit review. Please check your connection and try again.',
        confirmButtonColor: '#000000'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black">Review Your Trip</h2>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg text-black">{trip.destination}</h3>
          <p className="text-sm text-gray-600">{trip.location}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-black fill-black'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-black hover:bg-gray-100 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Personalized Recommendation Card Component
const PersonalizedCard = ({ destination, delay }) => {
  const imageUrl = destination.image 
    ? (destination.image.startsWith('http') ? destination.image : `${config.API_BASE_URL}${destination.image}`)
    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className="card overflow-hidden cursor-pointer relative"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={destination.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
          }}
        />
        {/* AI Match Badge - Black and White */}
        <div className="absolute top-3 left-3 bg-black px-3 py-1 flex items-center space-x-1">
          <Zap className="h-3 w-3 text-white fill-white" />
          <span className="text-xs font-medium text-white">{destination.matchScore}% Match</span>
        </div>
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 text-black fill-black" />
          <span className="text-sm font-semibold text-black">{destination.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-1">{destination.name}</h3>
        <p className="text-slate-600 text-sm mb-3 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {destination.location}
        </p>
        
        {/* Reason Box - Black and White */}
        <div className="bg-gray-100 border border-gray-300 p-3 mb-3">
          <p className="text-xs text-black flex items-center">
            <ThumbsUp className="h-3 w-3 mr-2 text-black" />
            {destination.reason}
          </p>
        </div>
        
        {/* Budget Breakdown */}
        {destination.estimated_budget && (
          <div className="bg-slate-50 border border-slate-200 p-3 mb-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center">
                <Hotel className="h-3 w-3 mr-1" />
                Hotel ({destination.estimated_budget.days} days)
              </span>
              <span className="font-semibold text-slate-800">₨ {destination.estimated_budget.hotel.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center">
                <Car className="h-3 w-3 mr-1" />
                Travel
              </span>
              <span className="font-semibold text-slate-800">₨ {destination.estimated_budget.travel.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-300">
              <span className="text-slate-700 font-semibold">Total Budget</span>
              <span className="font-bold text-slate-900">₨ {destination.estimated_budget.total.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
          <span className="text-xs bg-white text-black border border-gray-300 px-2 py-1">{destination.category}</span>
          <span className="text-sm font-bold text-black">{destination.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Explore Destination Card Component
const ExploreCard = ({ destination, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
    className="card overflow-hidden cursor-pointer group"
  >
    <div className="relative h-48 overflow-hidden">
      {destination.image ? (
        <img 
          src={destination.image.startsWith('http') ? destination.image : `${config.API_BASE_URL}${destination.image}`} 
          alt={destination.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-gray-400 opacity-50" />
        </div>
      )}
      
      {/* Category Badge - Black */}
      {destination.category && (
        <div className="absolute top-3 left-3 bg-black px-3 py-1">
          <span className="text-xs font-medium text-white capitalize">{destination.category}</span>
        </div>
      )}
      
      {/* Rating Badge - White */}
      <div className="absolute top-3 right-3 bg-white px-3 py-1 flex items-center space-x-1">
        <Star className="h-4 w-4 text-black fill-black" />
        <span className="text-sm font-semibold text-black">{destination.rating || destination.average_rating || '0.0'}</span>
        <span className="text-xs text-gray-600">({destination.review_count || 0})</span>
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="font-bold text-lg text-slate-800 mb-1">{destination.name}</h3>
      <p className="text-slate-600 text-sm mb-3 flex items-center">
        <MapPin className="h-3 w-3 mr-1" />
        {destination.country || destination.location}
      </p>
      
      {destination.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{destination.description}</p>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-300">
        <span className="text-xs bg-white text-black border border-gray-300 px-2 py-1 capitalize">{destination.category}</span>
        <span className="text-xs font-semibold text-black">{destination.best_season || 'All year'}</span>
      </div>
      
      <button className="w-full mt-3 bg-black text-white text-sm py-2 px-4 hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
        <Eye className="h-4 w-4" />
        <span>View Details</span>
      </button>
    </div>
  </motion.div>
);

// Destination Detail Modal Component
const DestinationDetailModal = ({ destination, onClose, reviews, reviewsLoading, onLoadReviews }) => {
  const navigate = useNavigate();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    // Fetch reviews when modal opens
    if (destination && onLoadReviews) {
      onLoadReviews(destination.id);
    }

    // Fetch current weather
    const fetchWeather = async () => {
      if (!destination.latitude || !destination.longitude) return;
      
      setWeatherLoading(true);
      try {
        const response = await fetch(
          `${config.API_BASE_URL}/api/weather/?lat=${destination.latitude}&lon=${destination.longitude}`
        );
        
        if (response.ok) {
          const weatherData = await response.json();
          setCurrentWeather(weatherData);
        }
      } catch (error) {
        console.error('Weather fetch failed:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination?.id]);

  const handlePlanTrip = () => {
    navigate(`/plan-trip/${destination.id}`, { 
      state: { destination } 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden my-8"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-800">Destination Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Hero Image */}
          {destination.image && (
            <div className="relative h-80">
              <img 
                src={destination.image.startsWith('http') ? destination.image : `${config.API_BASE_URL}${destination.image}`}
                alt={destination.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">{destination.country}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{destination.rating || destination.average_rating || '0.0'}</span>
                    <span className="text-sm">({destination.review_count || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Description */}
            {destination.description && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary-600" />
                  About This Destination
                </h3>
                <p className="text-slate-700 leading-relaxed">{destination.description}</p>
              </div>
            )}

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destination.category && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Category</p>
                  <p className="font-semibold text-slate-800 capitalize">{destination.category}</p>
                </div>
              )}
              {destination.price_range && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Price Range</p>
                  <p className="font-semibold text-slate-800 capitalize">{destination.price_range}</p>
                </div>
              )}
              {destination.best_season && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Best Season</p>
                  <p className="font-semibold text-slate-800">{destination.best_season}</p>
                </div>
              )}
              {destination.travel_options && destination.travel_options.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 mb-1">Travel Options</p>
                  <p className="font-semibold text-slate-800 capitalize">
                    {Array.isArray(destination.travel_options) 
                      ? destination.travel_options.join(', ') 
                      : destination.travel_options}
                  </p>
                </div>
              )}
            </div>

            {/* Current Weather */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <Cloud className="h-5 w-5 mr-2 text-primary-600" />
                Current Weather
              </h3>
              {weatherLoading ? (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-6 w-6 text-slate-400 animate-pulse" />
                    <span className="text-slate-600">Loading weather data...</span>
                  </div>
                </div>
              ) : currentWeather ? (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-slate-800 mb-1">
                        {Math.round(currentWeather.temperature)}°C
                      </p>
                      <p className="text-lg text-slate-700 capitalize">{currentWeather.description}</p>
                      {currentWeather.feels_like && (
                        <p className="text-sm text-slate-600 mt-1">
                          Feels like {Math.round(currentWeather.feels_like)}°C
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {currentWeather.humidity && (
                        <p className="text-sm text-slate-600">Humidity: {currentWeather.humidity}%</p>
                      )}
                      {currentWeather.wind_speed && (
                        <p className="text-sm text-slate-600">Wind: {currentWeather.wind_speed} m/s</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : destination.general_weather ? (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-700">{destination.general_weather}</p>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-600">Weather information not available</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary-600" />
                Reviews ({reviews.length})
              </h3>
              {reviewsLoading ? (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <span className="text-slate-600">Loading reviews...</span>
                  </div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-slate-800">{review.user_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-slate-800">{review.rating}</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                      )}
                      {review.created_at && (
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
                  <Star className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-600">No reviews yet</p>
                  <p className="text-sm text-slate-500 mt-1">Be the first to review this destination!</p>
                </div>
              )}
            </div>

            {/* Activities */}
            {destination.activities && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                  <Compass className="h-5 w-5 mr-2 text-primary-600" />
                  Activities
                </h3>
                <p className="text-slate-700 leading-relaxed">{destination.activities}</p>
              </div>
            )}

            {/* Accommodation Info */}
            {destination.accommodation_info && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                  <Hotel className="h-5 w-5 mr-2 text-primary-600" />
                  Accommodation
                </h3>
                <p className="text-slate-700 leading-relaxed">{destination.accommodation_info}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Action Button */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
          <button
            onClick={handlePlanTrip}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Navigation className="h-5 w-5" />
            <span>Plan Trip to {destination.name}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
