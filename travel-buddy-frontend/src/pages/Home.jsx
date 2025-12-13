import { useState, useEffect } from 'react';
import useVoiceInput from '../hooks/useVoiceInput';
import { motion } from 'framer-motion';
import { 
  Send, Sparkles, Mountain, Palmtree, Snowflake, Waves, 
  Building2, Star, Plane, Bus, Bike, UtensilsCrossed, 
  Cloud, Sun, CloudRain, Search, TrendingUp, MapPin,
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
  Heart, Eye, Share2, Compass, Zap, ThumbsUp, Mic, MicOff, Languages
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = ({ user, onLogout }) => {
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/destinations/smart_search/?q=${encodeURIComponent(query)}&limit=20`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        
        // Build enhanced summary with budget and duration info
        let summary = data.summary || `Found ${data.count || 0} destinations`;
        if (data.room_type) {
          summary += ` • ${data.room_type.charAt(0).toUpperCase() + data.room_type.slice(1)} room`;
        }
        if (data.budget) {
          summary += ` • Under PKR ${data.budget.toLocaleString()}`;
        }
        if (data.days && data.days > 1) {
          summary += ` • ${data.days} days`;
        }
        
        setSearchSummary(summary);

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
        const response = await fetch('http://localhost:8000/api/destinations/');
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

  // User's trips
  const myTrips = [
    { 
      id: 1, 
      destination: 'Hunza Valley', 
      location: 'Gilgit-Baltistan',
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400',
      startDate: '2024-12-20',
      endDate: '2024-12-25',
      status: 'upcoming',
      days: 5,
      category: 'Mountain',
      budget: '₨ 45,000'
    },
    { 
      id: 2, 
      destination: 'Swat Valley', 
      location: 'Khyber Pakhtunkhwa',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      startDate: '2024-11-15',
      endDate: '2024-11-18',
      status: 'completed',
      days: 3,
      category: 'Valley',
      budget: '₨ 32,000'
    },
    { 
      id: 3, 
      destination: 'Murree Hills', 
      location: 'Punjab',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      startDate: '2024-10-10',
      endDate: '2024-10-12',
      status: 'completed',
      days: 2,
      category: 'Hill Station',
      budget: '₨ 18,000'
    },
    { 
      id: 4, 
      destination: 'Naran Kaghan', 
      location: 'Khyber Pakhtunkhwa',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      startDate: '2024-09-05',
      endDate: '2024-09-08',
      status: 'cancelled',
      days: 3,
      category: 'Mountain',
      budget: '₨ 28,000'
    },
  ];

  // Explore destinations - all available destinations
  const exploreDestinations = destinations;

  // Personalized recommendations based on previous trips
  const personalizedRecommendations = [
    { 
      id: 1, 
      name: 'Ratti Gali Lake', 
      location: 'Azad Kashmir',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      rating: 4.8,
      matchScore: 95,
      reason: 'Similar to your Hunza Valley trip',
      category: 'Alpine',
      price: '₨ 32,000'
    },
    { 
      id: 2, 
      name: 'Deosai Plains', 
      location: 'Gilgit-Baltistan',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      rating: 4.9,
      matchScore: 92,
      reason: 'Matches your love for mountain destinations',
      category: 'Highland',
      price: '₨ 48,000'
    },
    { 
      id: 3, 
      name: 'Rama Meadow', 
      location: 'Gilgit-Baltistan',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      rating: 4.7,
      matchScore: 88,
      reason: 'Perfect for your preferred budget range',
      category: 'Alpine',
      price: '₨ 25,000'
    },
    { 
      id: 4, 
      name: 'Shogran', 
      location: 'Khyber Pakhtunkhwa',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      rating: 4.6,
      matchScore: 85,
      reason: 'Similar to your Murree Hills experience',
      category: 'Hill Station',
      price: '₨ 22,000'
    },
  ];

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
            <Sparkles className="h-8 w-8 text-primary-600 mr-2" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600 bg-clip-text text-transparent">
              Your AI Travel Companion
            </h1>
          </div>
          <p className="text-slate-600 text-lg mb-8">
            {user ? `Welcome back, ${user.name}! Ready for your next adventure?` : 'Plan your perfect trip with AI-powered recommendations'}
          </p>

          {/* AI Prompt Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2">
                <Search className="h-6 w-6 text-slate-400 ml-4" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Plan a 3-day trip to northern Pakistan under 25,000 PKR..."
                  className="flex-1 px-4 py-4 text-lg outline-none bg-transparent"
                />
                
                {/* Voice Input Buttons */}
                {isSupported && (
                  <div className="flex items-center gap-2 mr-2">
                    {/* Language Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Select Language"
                      >
                        <Languages className="h-5 w-5 text-slate-500" />
                      </button>
                      
                      {/* Language Dropdown */}
                      {showLanguageMenu && (
                        <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 w-40 z-10">
                          <button
                            type="button"
                            onClick={() => handleLanguageChange('en-US')}
                            className={`w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between ${
                              voiceLanguage === 'en-US' ? 'bg-primary-50 text-primary-600' : 'text-slate-700'
                            }`}
                          >
                            <span>English</span>
                            {voiceLanguage === 'en-US' && <span className="text-xs">✓</span>}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLanguageChange('ur-PK')}
                            className={`w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between ${
                              voiceLanguage === 'ur-PK' ? 'bg-primary-50 text-primary-600' : 'text-slate-700'
                            }`}
                          >
                            <span>اردو (Urdu)</span>
                            {voiceLanguage === 'ur-PK' && <span className="text-xs">✓</span>}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Microphone Button */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg'
                      }`}
                      title={isListening ? 'Stop Recording' : 'Start Voice Input'}
                    >
                      {isListening ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Plan Trip</span>
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* AI Suggestions */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button 
              onClick={() => {
                setQuery('trending mountain places');
                handleSearch({ preventDefault: () => {} });
              }}
              className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200"
            >
              🏔️ Trending mountains
            </button>
            <button 
              onClick={() => {
                setQuery('cultural tourist places');
                handleSearch({ preventDefault: () => {} });
              }}
              className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200"
            >
              🎭 Cultural places
            </button>
            <button 
              onClick={() => {
                setQuery('snowfall tourist places');
                handleSearch({ preventDefault: () => {} });
              }}
              className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200"
            >
              ❄️ Snowy destinations
            </button>
            <button 
              onClick={() => {
                setQuery('beach destinations');
                handleSearch({ preventDefault: () => {} });
              }}
              className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200"
            >
              🏖️ Beaches
            </button>
          </div>
        </motion.div>

        {/* AI Search Loader - Shows immediately when searching starts */}
        {searchLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
              <div className="text-center py-8">
                {/* Gemini-style animated loader */}
                <div className="flex justify-center items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-accent-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                
                {/* Animated gradient text */}
                <div className="mb-4">
                  <p className="text-xl font-semibold bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
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
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 mb-6">
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
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((dest, index) => (
                  <TrendingCard key={dest.id} destination={dest} delay={index * 0.1} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* My Trips Section - Only for logged-in users */}
        {user && (
          <Section title="My Trips" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myTrips.map((trip, index) => (
                <MyTripCard key={trip.id} trip={trip} delay={index * 0.1} />
              ))}
            </div>
          </Section>
        )}

        {/* Personalized Recommendations - Only for logged-in users */}
        {user && (
          <Section title="Recommended For You" icon={Zap}>
            <p className="text-slate-600 mb-6 -mt-3">Based on your previous trips and preferences</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {personalizedRecommendations.map((dest, index) => (
                <PersonalizedCard key={dest.id} destination={dest} delay={index * 0.1} />
              ))}
            </div>
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
const TrendingCard = ({ destination, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
    className="card overflow-hidden cursor-pointer"
  >
    <div className="relative h-48 overflow-hidden">
      {destination.image ? (
        <img 
          src={destination.image.startsWith('http') ? destination.image : `http://localhost:8000${destination.image}`} 
          alt={destination.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-white opacity-50" />
        </div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-semibold">{destination.rating || destination.average_rating || '0.0'}</span>
      </div>
      {destination.category && (
        <div className="absolute top-3 left-3 bg-primary-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
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
      
      {/* Hotel Information */}
      {destination.hotel && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg mb-3 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900">🏨 {destination.hotel.name}</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              ⭐ {destination.hotel.rating}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-700">Room Type:</span>
              <span className="font-semibold text-purple-900 capitalize">{destination.hotel.room_type}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-700">Per Night:</span>
              <span className="font-semibold text-purple-900">PKR {destination.hotel.price_per_night.toLocaleString()}</span>
            </div>
            {destination.hotel.days > 1 && (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-700">Duration:</span>
                  <span className="font-semibold text-purple-900">{destination.hotel.days} days</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-200">
                  <span className="text-purple-700 font-bold">Total Price:</span>
                  <span className="font-bold text-lg text-purple-900">PKR {destination.hotel.total_price.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
          {destination.hotel.amenities && destination.hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {destination.hotel.amenities.map((amenity, idx) => (
                <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
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
          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            <Cloud className="h-3 w-3 mr-1" />
            <span className="font-medium">Now: {destination.current_weather.description}</span>
          </div>
        </div>
      )}
      
      {/* Stored Weather (Fallback) */}
      {!destination.current_weather && destination.general_weather && (
        <div className="flex items-center space-x-2 mb-2 text-xs">
          <div className="flex items-center bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            <Cloud className="h-3 w-3 mr-1" />
            <span>{destination.general_weather}</span>
          </div>
        </div>
      )}
      
      {/* Best Season */}
      {destination.best_season && (
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Best: {destination.best_season}</span>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

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
const MyTripCard = ({ trip, delay }) => {
  const statusConfig = {
    upcoming: { icon: Clock, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-700', label: 'Upcoming' },
    completed: { icon: CheckCircle2, color: 'from-green-500 to-emerald-500', bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'from-red-500 to-pink-500', bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  };
  
  const config = statusConfig[trip.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
      className="card overflow-hidden cursor-pointer"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
        <div className={`absolute top-3 right-3 ${config.bg} backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1`}>
          <StatusIcon className={`h-4 w-4 ${config.text}`} />
          <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-1">{trip.destination}</h3>
        <p className="text-slate-600 text-sm mb-3 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {trip.location}
        </p>
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center text-slate-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <span className="text-slate-500">•</span>
          <div className="flex items-center text-slate-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{trip.days} days</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-sm text-slate-600">{trip.category}</span>
          <span className="text-sm font-semibold text-primary-600">{trip.budget}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Personalized Recommendation Card Component
const PersonalizedCard = ({ destination, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -8 }}
    className="card overflow-hidden cursor-pointer relative"
  >
    {/* AI Match Badge */}
    <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
      <Zap className="h-3 w-3 fill-white" />
      <span className="text-xs font-semibold">{destination.matchScore}% Match</span>
    </div>
    
    <div className="relative h-40 overflow-hidden">
      <img src={destination.image} alt={destination.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
        <span className="text-xs font-semibold">{destination.rating}</span>
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="font-bold text-lg text-slate-800 mb-1">{destination.name}</h3>
      <p className="text-slate-600 text-sm mb-2 flex items-center">
        <MapPin className="h-3 w-3 mr-1" />
        {destination.location}
      </p>
      
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 mb-3">
        <p className="text-xs text-purple-700 flex items-center">
          <ThumbsUp className="h-3 w-3 mr-1" />
          {destination.reason}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full">{destination.category}</span>
        <span className="text-sm font-semibold text-primary-600">{destination.price}</span>
      </div>
    </div>
  </motion.div>
);

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
          src={destination.image.startsWith('http') ? destination.image : `http://localhost:8000${destination.image}`} 
          alt={destination.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-white opacity-50" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-red-500" />
        </button>
        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Share2 className="h-4 w-4 text-slate-600" />
        </button>
      </div>
      
      {/* Rating */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-semibold">{destination.rating || destination.average_rating || '0.0'}</span>
        <span className="text-xs text-slate-600">({destination.review_count || destination.reviews || 0})</span>
      </div>
    </div>
    
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 mb-1">{destination.name}</h3>
          <p className="text-slate-600 text-sm flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {destination.country || destination.location}
          </p>
        </div>
      </div>
      
      {destination.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{destination.description}</p>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <span className="text-xs px-2 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 rounded-full font-medium">
          {destination.category}
        </span>
        <span className="text-xs text-slate-600">{destination.best_season || 'All year'}</span>
      </div>
      
      <button className="w-full mt-3 btn-primary text-sm py-2 flex items-center justify-center space-x-2">
        <Eye className="h-4 w-4" />
        <span>View Details</span>
      </button>
    </div>
  </motion.div>
);

export default Home;
