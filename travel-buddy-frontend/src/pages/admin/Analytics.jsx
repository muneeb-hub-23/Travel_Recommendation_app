import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, MapPin, Activity, PieChart as PieChartIcon } from 'lucide-react';

const Analytics = () => {
  const analyticsData = {
    monthlyUsers: [850, 920, 1050, 1200, 1350, 1450, 1580, 1720, 1890, 2100, 2340, 2458],
    monthlyTrips: [180, 220, 260, 310, 380, 420, 490, 560, 650, 740, 850, 950],
    topCategories: [
      { name: 'Mountain', count: 156, percentage: 32 },
      { name: 'Valley', count: 132, percentage: 27 },
      { name: 'Hill Station', count: 98, percentage: 20 },
      { name: 'Alpine', count: 65, percentage: 13 },
      { name: 'Beach', count: 36, percentage: 8 },
    ],
    userActivity: [
      { hour: '00:00', users: 45 },
      { hour: '04:00', users: 23 },
      { hour: '08:00', users: 234 },
      { hour: '12:00', users: 567 },
      { hour: '16:00', users: 432 },
      { hour: '20:00', users: 345 },
    ],
  };

  const metrics = [
    { label: 'Total Revenue', value: 'PKR 2.4M', change: '+18.5%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Conversion Rate', value: '24.8%', change: '+4.2%', icon: Activity, color: 'from-blue-500 to-blue-600' },
    { label: 'Avg. Booking Value', value: 'PKR 45K', change: '+12.1%', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Users', value: '12,458', change: '+8.3%', icon: Users, color: 'from-orange-500 to-orange-600' },
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
            className={`bg-gradient-to-br ${metric.color} p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="h-8 w-8 opacity-80" />
              <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">{metric.change}</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm opacity-90">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Users Chart */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Monthly User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyUsers.map((users, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-black to-gray-700 hover:from-gray-700 transition-all cursor-pointer"
                  style={{ height: `${(users / Math.max(...analyticsData.monthlyUsers)) * 100}%` }}
                  title={`${users} users`}
                />
                <span className="text-xs text-slate-500 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Top Categories</h3>
          <div className="space-y-4">
            {analyticsData.topCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    <span className="font-medium text-slate-800">{category.name}</span>
                  </div>
                  <span className="text-sm text-slate-600">{category.count} destinations</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-black to-gray-700 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">User Activity by Hour</h3>
          <div className="h-64 flex items-end justify-between space-x-3">
            {analyticsData.userActivity.map((activity, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 hover:from-blue-600 transition-all cursor-pointer"
                  style={{ height: `${(activity.users / Math.max(...analyticsData.userActivity.map(a => a.users))) * 100}%` }}
                  title={`${activity.users} users`}
                />
                <span className="text-xs text-slate-500 mt-2">{activity.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trips */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Monthly Trips Booked</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyTrips.map((trips, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-green-600 hover:from-green-600 transition-all cursor-pointer"
                  style={{ height: `${(trips / Math.max(...analyticsData.monthlyTrips)) * 100}%` }}
                  title={`${trips} trips`}
                />
                <span className="text-xs text-slate-500 mt-2">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Export Analytics</h3>
            <p className="text-sm text-slate-600 mt-1">Download detailed reports in various formats</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors">
              Export PDF
            </button>
            <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
