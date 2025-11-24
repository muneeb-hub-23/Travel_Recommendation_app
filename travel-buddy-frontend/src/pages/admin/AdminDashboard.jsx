import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MapPin, Hotel, TrendingUp, DollarSign, 
  Calendar, Settings, LogOut, Menu, X, BarChart3,
  PieChart, Activity, Star, MessageSquare, Bell,
  FileText, Database, Shield
} from 'lucide-react';

const AdminDashboard = ({ admin, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { id: 1, label: 'Total Users', value: '12,458', change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 2, label: 'Active Trips', value: '3,241', change: '+8.2%', icon: MapPin, color: 'from-green-500 to-emerald-500' },
    { id: 3, label: 'Destinations', value: '487', change: '+5.7%', icon: Hotel, color: 'from-purple-500 to-pink-500' },
    { id: 4, label: 'Revenue', value: '₨ 2.4M', change: '+18.3%', icon: DollarSign, color: 'from-orange-500 to-red-500' },
  ];

  const recentUsers = [
    { id: 1, name: 'Ahmad Khan', email: 'ahmad@example.com', joined: '2 hours ago', status: 'active' },
    { id: 2, name: 'Sara Ali', email: 'sara@example.com', joined: '5 hours ago', status: 'active' },
    { id: 3, name: 'Hassan Ahmed', email: 'hassan@example.com', joined: '1 day ago', status: 'inactive' },
    { id: 4, name: 'Fatima Raza', email: 'fatima@example.com', joined: '2 days ago', status: 'active' },
  ];

  const popularDestinations = [
    { id: 1, name: 'Hunza Valley', bookings: 245, rating: 4.9, revenue: '₨ 450K' },
    { id: 2, name: 'Murree Hills', bookings: 198, rating: 4.7, revenue: '₨ 320K' },
    { id: 3, name: 'Swat Valley', bookings: 187, rating: 4.8, revenue: '₨ 380K' },
    { id: 4, name: 'Naran Kaghan', bookings: 176, rating: 4.6, revenue: '₨ 290K' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white shadow-sm z-40"
      >
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-xs text-slate-500">AI Travel Buddy</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-100 rounded-full">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-800">{admin?.name}</p>
                <p className="text-xs text-slate-500">{admin?.role}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className="fixed left-0 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-30 overflow-y-auto"
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'overview' && (
              <>
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
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
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
                        <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{user.name}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">{user.joined}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-100 text-slate-700'
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
                        <div key={dest.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{dest.name}</p>
                              <div className="flex items-center space-x-2">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-slate-600">{dest.rating}</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-600">{dest.bookings} bookings</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-green-600">{dest.revenue}</p>
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
              </>
            )}

            {activeTab !== 'overview' && (
              <div className="card p-12">
                <div className="text-center">
                  <div className="inline-flex p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl mb-4">
                    <Settings className="h-12 w-12 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {menuItems.find(item => item.id === activeTab)?.label}
                  </h2>
                  <p className="text-slate-600 mb-6">
                    This section will be fully implemented with the backend
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <Database className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-700 font-medium">Manage Data</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <FileText className="h-8 w-8 text-accent-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-700 font-medium">Generate Reports</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-700 font-medium">Security Settings</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
