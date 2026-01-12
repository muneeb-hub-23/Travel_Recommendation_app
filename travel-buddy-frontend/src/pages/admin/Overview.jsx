import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Hotel, MessageSquare, Activity, Star } from 'lucide-react';
import config from '../../config';

const Overview = () => {
  const [stats, setStats] = useState([
    { id: 1, label: 'Total Users', value: '0', change: '-', icon: Users },
    { id: 2, label: 'Active Trips', value: '0', change: '-', icon: MapPin },
    { id: 3, label: 'Destinations', value: '0', change: '-', icon: Hotel },
    { id: 4, label: 'Total Reviews', value: '0', change: '-', icon: MessageSquare },
  ]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [usersRes, tripsRes, destinationsRes, reviewsRes] = await Promise.all([
        fetch(`${config.API_BASE_URL}/api/auth/users/`),
        fetch(`${config.API_BASE_URL}/api/trips/all/`),
        fetch(`${config.API_BASE_URL}/api/destinations/`),
        fetch(`${config.API_BASE_URL}/api/reviews/`)
      ]);

      const users = await usersRes.json();
      const trips = await tripsRes.json();
      const destinations = await destinationsRes.json();
      const reviews = await reviewsRes.json();

      console.log('Users API response:', users);
      console.log('Trips API response:', trips);
      console.log('Destinations API response:', destinations);
      console.log('Reviews API response:', reviews);

      // Handle array or paginated responses
      const usersArray = Array.isArray(users) ? users : (users.results || []);
      const tripsArray = Array.isArray(trips) ? trips : (trips.results || []);
      const destinationsArray = Array.isArray(destinations) ? destinations : (destinations.results || []);
      const reviewsArray = Array.isArray(reviews) ? reviews : (reviews.results || []);

      console.log('Parsed arrays:', {
        users: usersArray.length,
        trips: tripsArray.length,
        destinations: destinationsArray.length,
        reviews: reviewsArray.length
      });

      // Update stats
      setStats([
        { id: 1, label: 'Total Users', value: usersArray.length.toString(), change: '-', icon: Users },
        { id: 2, label: 'Active Trips', value: tripsArray.length.toString(), change: '-', icon: MapPin },
        { id: 3, label: 'Destinations', value: destinationsArray.length.toString(), change: '-', icon: Hotel },
        { id: 4, label: 'Total Reviews', value: reviewsArray.length.toString(), change: '-', icon: MessageSquare },
      ]);

      // Format recent users (latest 6)
      const formattedUsers = usersArray
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6)
        .map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
          email: user.email,
          phone: user.phone || 'N/A',
          joined: formatDate(user.created_at),
          status: user.is_active ? 'active' : 'inactive',
          trips: tripsArray.filter(trip => trip.user === user.id).length
        }));
      setRecentUsers(formattedUsers);

      // Calculate popular destinations based on ratings and review count
      const destinationsWithStats = destinationsArray.map(dest => {
        const destReviews = reviewsArray.filter(r => r.destination === dest.id);
        const visits = tripsArray.filter(trip => trip.destination === dest.id).length;
        return {
          id: dest.id,
          name: dest.name,
          visits: visits,
          rating: dest.rating || 0,
          reviews: destReviews.length,
          category: dest.category
        };
      });

      // Sort by rating and review count
      const topDestinations = destinationsWithStats
        .sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviews - a.reviews;
        })
        .slice(0, 5);
      
      setPopularDestinations(topDestinations);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-black">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-black text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
            <p className="text-slate-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Users</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-black flex items-center justify-center">
                    <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{user.joined}</p>
                  <span className={`text-xs px-2 py-1 ${
                    user.status === 'active' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-black'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Popular Destinations</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {popularDestinations.map((dest, index) => (
              <div key={dest.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-black flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{dest.name}</p>
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-black fill-black" />
                      <span className="text-xs text-slate-600">{dest.rating}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600">{dest.visits} visits</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-600">{dest.reviews}</p>
                  <p className="text-xs text-slate-500">reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Activity Overview</h2>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl">
          <div className="text-center">
            <Activity className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600">Chart will be displayed here</p>
            <p className="text-sm text-slate-400">Real-time analytics and trends</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
