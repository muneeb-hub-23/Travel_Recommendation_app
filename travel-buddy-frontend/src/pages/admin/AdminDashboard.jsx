import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Users, MapPin, Hotel, TrendingUp, 
  Settings, LogOut, Menu, X, BarChart3,
  PieChart, Activity, Star, MessageSquare, Bell,
  FileText, Database, Shield, Mail, Phone, Edit, Trash2,
  Plus, Search, Filter, Eye, ThumbsUp, ThumbsDown, Cloud
} from 'lucide-react';
import AddDestinationForm from '../../components/AddDestinationForm';

const AdminDashboard = ({ admin, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    // Restore active tab from localStorage on mount
    return localStorage.getItem('adminActiveTab') || 'overview';
  });
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const stats = [
    { id: 1, label: 'Total Users', value: '12,458', change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { id: 2, label: 'Active Trips', value: '3,241', change: '+8.2%', icon: MapPin, color: 'from-green-500 to-emerald-500' },
    { id: 3, label: 'Destinations', value: '487', change: '+5.7%', icon: Hotel, color: 'from-purple-500 to-pink-500' },
    { id: 4, label: 'Total Reviews', value: '8,934', change: '+15.8%', icon: MessageSquare, color: 'from-orange-500 to-red-500' },
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

  // Fetch destinations from API on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/destinations/');
        if (response.ok) {
          const data = await response.json();
          // Handle both paginated and non-paginated responses
          setDestinations(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setDestinations([]); // Set empty array on error
      }
    };

    fetchDestinations();
  }, []);

  const allReviews = [
    { id: 1, user: 'Ahmad Khan', destination: 'Hunza Valley', rating: 5, comment: 'Absolutely stunning! The views were breathtaking and the local hospitality was amazing.', date: '2 hours ago', sentiment: 'positive' },
    { id: 2, user: 'Sara Ali', destination: 'Murree Hills', rating: 4, comment: 'Great place for a family trip. Weather was pleasant and food was delicious.', date: '5 hours ago', sentiment: 'positive' },
    { id: 3, user: 'Hassan Ahmed', destination: 'Swat Valley', rating: 5, comment: 'Paradise on earth! Must visit for nature lovers.', date: '1 day ago', sentiment: 'positive' },
    { id: 4, user: 'Fatima Raza', destination: 'Naran Kaghan', rating: 3, comment: 'Beautiful scenery but roads need improvement.', date: '2 days ago', sentiment: 'neutral' },
    { id: 5, user: 'Zain Malik', destination: 'Fairy Meadows', rating: 5, comment: 'One of the best experiences of my life. Highly recommended!', date: '3 days ago', sentiment: 'positive' },
    { id: 6, user: 'Ayesha Iqbal', destination: 'Skardu', rating: 4, comment: 'Amazing lakes and mountains. Perfect for photography.', date: '4 days ago', sentiment: 'positive' },
    { id: 7, user: 'Usman Khan', destination: 'Neelum Valley', rating: 5, comment: 'Crystal clear river and lush green forests. Simply magical!', date: '5 days ago', sentiment: 'positive' },
    { id: 8, user: 'Maria Ahmed', destination: 'Chitral', rating: 2, comment: 'Expected more facilities. The natural beauty is there but infrastructure is lacking.', date: '6 days ago', sentiment: 'negative' },
  ];

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

  const systemSettings = {
    general: {
      siteName: 'AI Travel Buddy',
      tagline: 'Discover Pakistan with AI',
      contactEmail: 'support@travelbuddy.pk',
      supportPhone: '+92 300 1234567',
    },
    features: {
      aiRecommendations: true,
      userReviews: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    },
  };

  const handleViewDestination = (dest) => {
    setSelectedDestination(dest);
    setShowViewModal(true);
  };

  const handleEditDestination = (dest) => {
    setSelectedDestination(dest);
    setShowEditModal(true);
  };

  const handleUpdateDestination = async (formData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/destinations/${selectedDestination.id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedDestination = await response.json();
        setDestinations(prev => prev.map(dest => 
          dest.id === updatedDestination.id ? updatedDestination : dest
        ));
        setShowEditModal(false);
        setSelectedDestination(null);
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Destination updated successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error updating destination: ' + JSON.stringify(error),
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to update destination: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDeleteDestination = async (destId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8000/api/destinations/${destId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setDestinations(prev => prev.filter(dest => dest.id !== destId));
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Destination has been deleted.',
            confirmButtonColor: '#10b981',
            timer: 2000
          });
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete destination',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleAddDestination = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/destinations/', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (response.ok) {
        const newDestination = await response.json();
        setDestinations(prev => [...prev, newDestination]);
        setShowAddDestination(false);
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Destination added successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error adding destination: ' + JSON.stringify(error),
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to add destination: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
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
              </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add User</span>
                  </button>
                </div>
                
                <div className="mb-4 flex space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Contact</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Trips</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Joined</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{user.name}</p>
                                <p className="text-sm text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <Phone className="h-4 w-4" />
                              <span>{user.phone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {user.trips} trips
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">{user.joined}</td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end space-x-2">
                              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <Eye className="h-4 w-4 text-slate-600" />
                              </button>
                              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <Edit className="h-4 w-4 text-slate-600" />
                              </button>
                              <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Destinations</h2>
                  <button 
                    onClick={() => setShowAddDestination(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Destination</span>
                  </button>
                </div>

                {destinations.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No destinations added yet</p>
                    <button 
                      onClick={() => setShowAddDestination(true)}
                      className="btn-primary"
                    >
                      Add Your First Destination
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest) => (
                      <div key={dest.id} className="card p-4 hover:shadow-lg transition-shadow">
                        {dest.image && (
                          <img 
                            src={dest.image.startsWith('http') ? dest.image : `http://localhost:8000${dest.image}`}
                            alt={dest.name}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">{dest.name}</h3>
                            <p className="text-sm text-slate-600">{dest.country}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">{dest.rating || '0.0'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4 text-accent-600" />
                            <span className="text-sm">{dest.review_count || 0}</span>
                          </div>
                        </div>

                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium mb-3">
                          {dest.category}
                        </span>

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{dest.description}</p>

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDestination(dest)}
                            className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleEditDestination(dest)}
                            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteDestination(dest.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Analytics & Insights</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-2" />
                        <p className="text-slate-600">Monthly User Growth Chart</p>
                        <div className="mt-4 flex justify-around text-center">
                          <div>
                            <p className="text-2xl font-bold text-primary-600">+28%</p>
                            <p className="text-xs text-slate-500">This Month</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">2,458</p>
                            <p className="text-xs text-slate-500">Total Users</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Top Categories</h3>
                    <div className="space-y-4">
                      {analyticsData.topCategories.map((cat) => (
                        <div key={cat.name}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-700">{cat.name}</span>
                            <span className="text-sm text-slate-600">{cat.count} visits ({cat.percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 rounded-full"
                              style={{ width: `${cat.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">User Activity by Time</h3>
                  <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-accent-600 mx-auto mb-2" />
                      <p className="text-slate-600">24-Hour Activity Pattern</p>
                      <p className="text-sm text-slate-400 mt-2">Peak hours: 12:00 PM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Reviews Management</h2>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {allReviews.map((review) => (
                    <div key={review.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{review.user.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{review.user}</p>
                            <p className="text-sm text-slate-500">{review.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.sentiment === 'positive'
                              ? 'bg-green-100 text-green-700'
                              : review.sentiment === 'negative'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {review.sentiment}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{review.date}</span>
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">System Settings</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-primary-600" />
                      <span>General Settings</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                        <input
                          type="text"
                          value={systemSettings.general.siteName}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
                        <input
                          type="text"
                          value={systemSettings.general.tagline}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={systemSettings.general.contactEmail}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Support Phone</label>
                        <input
                          type="tel"
                          value={systemSettings.general.supportPhone}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <span>Security Settings</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">Two-Factor Authentication</p>
                          <p className="text-sm text-slate-500">Add an extra layer of security</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full ${systemSettings.security.twoFactorAuth ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${systemSettings.security.twoFactorAuth ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={systemSettings.security.sessionTimeout}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Max Login Attempts</label>
                        <input
                          type="number"
                          value={systemSettings.security.maxLoginAttempts}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-accent-600" />
                      <span>Feature Toggles</span>
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">AI Recommendations</p>
                          <p className="text-sm text-slate-500">ML-powered travel suggestions</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full ${systemSettings.features.aiRecommendations ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${systemSettings.features.aiRecommendations ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">User Reviews</p>
                          <p className="text-sm text-slate-500">Allow users to post reviews</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full ${systemSettings.features.userReviews ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${systemSettings.features.userReviews ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">Email Notifications</p>
                          <p className="text-sm text-slate-500">Send email updates to users</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full ${systemSettings.features.emailNotifications ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${systemSettings.features.emailNotifications ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">SMS Notifications</p>
                          <p className="text-sm text-slate-500">Send SMS alerts to users</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full ${systemSettings.features.smsNotifications ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${systemSettings.features.smsNotifications ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span>Database Info</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Total Users</span>
                        <span className="font-bold text-slate-800">12,458</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Total Destinations</span>
                        <span className="font-bold text-slate-800">487</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Total Reviews</span>
                        <span className="font-bold text-slate-800">8,934</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm text-slate-600">Active Trips</span>
                        <span className="font-bold text-slate-800">3,241</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Add Destination Modal */}
      {showAddDestination && (
        <AddDestinationForm
          onClose={() => setShowAddDestination(false)}
          onSubmit={handleAddDestination}
        />
      )}

      {/* Edit Destination Modal */}
      {showEditModal && selectedDestination && (
        <AddDestinationForm
          onClose={() => {
            setShowEditModal(false);
            setSelectedDestination(null);
          }}
          onSubmit={handleUpdateDestination}
          initialData={selectedDestination}
          isEdit={true}
        />
      )}

      {/* View Destination Modal */}
      {showViewModal && selectedDestination && (
        <ViewDestinationModal
          destination={selectedDestination}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDestination(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEditDestination(selectedDestination);
          }}
          onDelete={() => {
            setShowViewModal(false);
            handleDeleteDestination(selectedDestination.id);
          }}
        />
      )}
    </div>
  );
};

// View Destination Modal Component
const ViewDestinationModal = ({ destination, onClose, onEdit, onDelete }) => {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{destination.name}</h2>
            <p className="text-slate-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {destination.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          {destination.image && (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={destination.image.startsWith('http') ? destination.image : `http://localhost:8000${destination.image}`}
                alt={destination.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={MapPin} label="Category" value={destination.category || 'N/A'} />
            <InfoItem icon={Star} label="Rating" value={destination.rating || '0.0'} />
            <InfoItem icon={MessageSquare} label="Reviews" value={destination.review_count || 0} />
            <InfoItem icon={Cloud} label="Best Season" value={destination.best_season || 'N/A'} />
            <InfoItem icon={MapPin} label="Latitude" value={destination.latitude || 'N/A'} />
            <InfoItem icon={MapPin} label="Longitude" value={destination.longitude || 'N/A'} />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{destination.description}</p>
          </div>

          {/* Weather Info */}
          {destination.general_weather && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Weather</h3>
              <p className="text-slate-600">{destination.general_weather}</p>
              {destination.weather_area && (
                <p className="text-sm text-slate-500 mt-1">Area: {destination.weather_area}</p>
              )}
            </div>
          )}

          {/* Transportation */}
          {destination.travel_options && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Travel Options</h3>
              <p className="text-slate-600">{destination.travel_options}</p>
            </div>
          )}

          {/* Activities */}
          {destination.activities && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Activities</h3>
              <p className="text-slate-600">{destination.activities}</p>
            </div>
          )}

          {/* Accommodation */}
          {destination.accommodation_info && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Accommodation</h3>
              <p className="text-slate-600">{destination.accommodation_info}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 btn-primary py-3"
          >
            <Edit className="h-4 w-4 mr-2 inline" />
            Edit Destination
          </button>
          <button
            onClick={onDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Info Item Component for View Modal
const InfoItem = ({ icon: Icon, label, value }) => {
  if (!Icon || !label || value === undefined || value === null) return null;
  
  return (
    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
      <div className="p-2 bg-primary-100 rounded-lg">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
