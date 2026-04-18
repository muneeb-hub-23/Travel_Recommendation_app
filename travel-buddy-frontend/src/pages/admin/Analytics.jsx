import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, MapPin, Activity } from 'lucide-react';
import config from '../../config';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_BASE_URL}/api/accounts/analytics/`);
        
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          setError('Failed to fetch analytics data');
        }
      } catch (err) {
        setError('Error loading analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">{error || 'No data available'}</p>
      </div>
    );
  }

  const metrics = [
    { 
      label: 'Total Revenue', 
      value: `PKR ${(analyticsData.metrics.total_revenue / 1000000).toFixed(1)}M`, 
      change: analyticsData.metrics.revenue_growth, 
      icon: TrendingUp 
    },
    { 
      label: 'Conversion Rate', 
      value: `${analyticsData.metrics.conversion_rate}%`, 
      change: analyticsData.metrics.conversion_growth, 
      icon: Activity 
    },
    { 
      label: 'Avg. Booking Value', 
      value: `PKR ${(analyticsData.metrics.avg_booking_value / 1000).toFixed(0)}K`, 
      change: analyticsData.metrics.booking_growth, 
      icon: BarChart3 
    },
    { 
      label: 'Active Users', 
      value: analyticsData.metrics.active_users.toLocaleString(), 
      change: analyticsData.metrics.user_growth, 
      icon: Users 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
        <p className="text-sm text-slate-600 mt-1">Track your business performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black p-6 text-white border-2 border-gray-800 hover:border-gray-600 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="h-8 w-8" />
              <span className="text-sm font-semibold bg-white text-black px-2 py-1 rounded">{metric.change}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-300">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Users Chart */}
        <div className="card p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Monthly User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthly_users.map((users, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-black hover:bg-gray-700 transition-all cursor-pointer"
                  style={{ height: `${(users / Math.max(...analyticsData.monthly_users)) * 100}%` }}
                  title={`${users} users`}
                />
                <span className="text-xs text-gray-600 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Top Categories</h3>
          <div className="space-y-4">
            {analyticsData.top_categories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-black" />
                    <span className="font-medium text-black">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{category.count} destinations</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-black h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="card p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">User Activity by Hour</h3>
          <div className="h-64 flex items-end justify-between space-x-3">
            {analyticsData.user_activity.map((activity, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gray-800 hover:bg-gray-600 transition-all cursor-pointer"
                  style={{ height: `${(activity.users / Math.max(...analyticsData.user_activity.map(a => a.users))) * 100}%` }}
                  title={`${activity.users} users`}
                />
                <span className="text-xs text-gray-600 mt-2">{activity.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trips */}
        <div className="card p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-black mb-6">Monthly Trips Booked</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthly_trips.map((trips, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-black hover:bg-gray-700 transition-all cursor-pointer"
                  style={{ height: `${(trips / Math.max(...analyticsData.monthly_trips)) * 100}%` }}
                  title={`${trips} trips`}
                />
                <span className="text-xs text-gray-600 mt-2">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
