import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Sparkles, Mountain, Palmtree, Snowflake, Waves, 
  Building2, Star, Plane, Bus, Bike, UtensilsCrossed, 
  Cloud, Sun, CloudRain, Search, TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = ({ user, onLogout }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTravel, setSelectedTravel] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', query);
    // Will be connected to AI backend later
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

  const trendingDestinations = [
    { id: 1, name: 'Hunza Valley', location: 'Gilgit-Baltistan', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400', rating: 4.9 },
    { id: 2, name: 'Murree', location: 'Punjab', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', rating: 4.7 },
    { id: 3, name: 'Swat Valley', location: 'Khyber Pakhtunkhwa', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', rating: 4.8 },
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
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200">
              🏔️ Weekend getaways
            </button>
            <button className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200">
              💰 Budget trips under 20k
            </button>
            <button className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200">
              🎒 Adventure destinations
            </button>
            <button className="px-4 py-2 bg-white rounded-full text-sm text-slate-600 hover:text-primary-600 hover:shadow-md transition-all duration-300 border border-slate-200">
              🏖️ Relaxing beaches
            </button>
          </div>
        </motion.div>

        {/* Destination Categories */}
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

        {/* Trending Destinations */}
        <Section title="Trending Destinations" icon={TrendingUp}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingDestinations.map((dest, index) => (
              <TrendingCard key={dest.id} destination={dest} delay={index * 0.1} />
            ))}
          </div>
        </Section>

        {/* Hotel Categories */}
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

        {/* Travel Options */}
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

        {/* Food Options */}
        <Section title="Food Preferences" icon={UtensilsCrossed}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {foodOptions.map((food, index) => (
              <FoodCard key={food.id} food={food} delay={index * 0.1} />
            ))}
          </div>
        </Section>

        {/* Weather Preferences */}
        <Section title="Preferred Weather" icon={Cloud}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherOptions.map((weather, index) => (
              <WeatherCard key={weather.id} weather={weather} delay={index * 0.1} />
            ))}
          </div>
        </Section>
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
      <img src={destination.image} alt={destination.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-semibold">{destination.rating}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg text-slate-800">{destination.name}</h3>
      <p className="text-slate-600 text-sm">{destination.location}</p>
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

export default Home;
