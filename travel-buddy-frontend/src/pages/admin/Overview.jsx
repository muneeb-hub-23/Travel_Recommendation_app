import { motion } from 'framer-motion';
import { Users, MapPin, Hotel, MessageSquare, Activity, Star } from 'lucide-react';

const Overview = () => {
  const stats = [
    { id: 1, label: 'Total Users', value: '12,458', change: '+12.5%', icon: Users },
    { id: 2, label: 'Active Trips', value: '3,241', change: '+8.2%', icon: MapPin },
    { id: 3, label: 'Destinations', value: '487', change: '+5.7%', icon: Hotel },
    { id: 4, label: 'Total Reviews', value: '8,934', change: '+15.8%', icon: MessageSquare },
  ];

  const recentUsers = [
    { id: 1, name: 'Ahmad Khan', email: 'ahmad@example.com', phone: '+92 300 1234567', joined: '2 hours ago', status: 'active', trips: 5 },
    { id: 2, name: 'Sara Ali', email: 'sara@example.com', phone: '+92 301 2345678', joined: '5 hours ago', status: 'active', trips: 12 },
    { id: 3, name: 'Hassan Ahmed', email: 'hassan@example.com', phone: '+92 302 3456789', joined: '1 day ago', status: 'inactive', trips: 3 },
    { id: 4, name: 'Fatima Raza', email: 'fatima@example.com', phone: '+92 303 4567890', joined: '2 days ago', status: 'active', trips: 8 },
    { id: 5, name: 'Zain Malik', email: 'zain@example.com', phone: '+92 304 5678901', joined: '3 days ago', status: 'active', trips: 15 },
    { id: 6, name: 'Ayesha Iqbal', email: 'ayesha@example.com', phone: '+92 305 6789012', joined: '4 days ago', status: 'active', trips: 7 },
  ];

  const popularDestinations = [
    { id: 1, name: 'Hunza Valley', visits: 245, rating: 4.9, reviews: 189, category: 'Mountain' },
    { id: 2, name: 'Murree Hills', visits: 198, rating: 4.7, reviews: 156, category: 'Hill Station' },
    { id: 3, name: 'Swat Valley', visits: 187, rating: 4.8, reviews: 174, category: 'Valley' },
    { id: 4, name: 'Naran Kaghan', visits: 176, rating: 4.6, reviews: 142, category: 'Mountain' },
    { id: 5, name: 'Fairy Meadows', visits: 165, rating: 4.9, reviews: 128, category: 'Alpine' },
  ];

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
