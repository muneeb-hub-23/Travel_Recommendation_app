import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
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
  const [hotels, setHotels] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [destinationSearch, setDestinationSearch] = useState('');
  const [hotelSearch, setHotelSearch] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showViewHotelModal, setShowViewHotelModal] = useState(false);
  const [showEditHotelModal, setShowEditHotelModal] = useState(false);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

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

  // Fetch destinations from API on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/destinations/`);
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

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/hotels/`);
        if (response.ok) {
          const data = await response.json();
          setHotels(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
      }
    };

    fetchHotels();
  }, []);

  // Fetch registered users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/users/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Fetch admin users from API
  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/admin-users/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAdminUsers(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (error) {
        console.error('Error fetching admin users:', error);
        setAdminUsers([]);
      }
    };

    fetchAdminUsers();
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
      const response = await fetch(`${config.API_BASE_URL}/api/destinations/${selectedDestination.id}/`, {
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
        const response = await fetch(`${config.API_BASE_URL}/api/destinations/${destId}/`, {
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
      const response = await fetch(`${config.API_BASE_URL}/api/destinations/`, {
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

  // Hotel handlers
  const handleViewHotel = (hotel) => {
    setSelectedHotel(hotel);
    setShowViewHotelModal(true);
  };

  const handleEditHotel = (hotel) => {
    setSelectedHotel(hotel);
    setShowEditHotelModal(true);
  };

  const handleDeleteHotel = async (hotelId) => {
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
        const response = await fetch(`${config.API_BASE_URL}/api/hotels/${hotelId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Hotel has been deleted.',
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
          text: 'Failed to delete hotel',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleHotelAdded = (newHotel) => {
    setHotels(prev => [...prev, newHotel]);
    setShowAddHotelModal(false);
  };

  const handleHotelUpdated = (updatedHotel) => {
    setHotels(prev => prev.map(h => h.id === updatedHotel.id ? updatedHotel : h));
    setShowEditHotelModal(false);
  };

  // Admin User Handlers
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const adminData = {
      name: formData.get('name'),
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
      role: formData.get('role')
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/admin-users/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(adminData)
      });

      if (response.ok) {
        const newAdmin = await response.json();
        setAdminUsers(prev => [...prev, newAdmin]);
        setShowAddAdminModal(false);
        
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Admin user created successfully and can now login!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to create admin user',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create admin user: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowEditAdminModal(true);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role')
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/admin-users/${selectedAdmin.id}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updatedAdmin = await response.json();
        setAdminUsers(prev => prev.map(admin => 
          admin.id === updatedAdmin.id ? updatedAdmin : admin
        ));
        setShowEditAdminModal(false);
        setSelectedAdmin(null);
        
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Admin user updated successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to update admin user',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update admin user: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This will permanently delete this admin user!',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/admin-users/${adminId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          setAdminUsers(prev => prev.filter(admin => admin.id !== adminId));
          
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Admin user has been deleted.',
            confirmButtonColor: '#10b981',
            timer: 2000
          });
        } else {
          const error = await response.json();
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to delete admin user',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete admin user: ' + error.message,
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'adminUsers', label: 'Admin Users', icon: Shield },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Filter destinations based on search
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    dest.country.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    dest.category.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  // Filter hotels based on search
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    hotel.destination_name?.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    hotel.address.toLowerCase().includes(hotelSearch.toLowerCase())
  );

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.phone?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-black shadow-sm z-40"
      >
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">Travel Buddy</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className="fixed left-0 w-64 h-[calc(100vh-4rem)] bg-black shadow-lg z-30 overflow-y-auto"
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-gray-800'
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
              </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Registered Users</h2>
                    <p className="text-sm text-slate-600 mt-1">Total: <span className="font-bold text-primary-600">{users.length}</span> users</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or phone..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No registered users yet</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No users found matching your search</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Phone</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Joined</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-black flex items-center justify-center">
                                  <span className="text-white font-semibold">{user.name?.charAt(0) || 'U'}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{user.name || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <Mail className="h-4 w-4" />
                                <span>{user.email || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-3 py-1 text-sm font-medium bg-black text-white">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end space-x-2">
                                <button className="p-2 hover:bg-slate-100 transition-colors">
                                  <Eye className="h-4 w-4 text-slate-600" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 transition-colors">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Admin Users Tab */}
            {activeTab === 'adminUsers' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Users Management</h2>
                    <p className="text-sm text-slate-600 mt-1">Manage admin accounts and permissions</p>
                  </div>
                  <button 
                    onClick={() => setShowAddAdminModal(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Admin</span>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search admin users..."
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {adminUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No admin users yet</p>
                    <button className="btn-primary">
                      Add Your First Admin
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Admin</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Last Login</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {adminUsers.map((adminUser) => (
                          <tr key={adminUser.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gradient-to-br from-black to-gray-700 flex items-center justify-center">
                                  <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{adminUser.name || adminUser.username}</p>
                                  <p className="text-xs text-slate-500 flex items-center">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Admin Access
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <Mail className="h-4 w-4" />
                                <span>{adminUser.email || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-black to-gray-700 text-white">
                                {adminUser.role || 'Admin'}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {adminUser.last_login ? new Date(adminUser.last_login).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleEditAdmin(adminUser)}
                                  className="p-2 hover:bg-slate-100 transition-colors" 
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4 text-slate-600" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteAdmin(adminUser.id)}
                                  className="p-2 hover:bg-slate-100 transition-colors" 
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Admin Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-black to-gray-700 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Total Admins</p>
                        <p className="text-2xl font-bold mt-1">{adminUsers.length}</p>
                      </div>
                      <Shield className="h-8 w-8 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Active</p>
                        <p className="text-2xl font-bold mt-1">{adminUsers.length}</p>
                      </div>
                      <Activity className="h-8 w-8 opacity-50" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Super Admins</p>
                        <p className="text-2xl font-bold mt-1">{adminUsers.filter(a => a.role === 'Super Admin').length}</p>
                      </div>
                      <Star className="h-8 w-8 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Destinations</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600">
                      Total: <span className="font-bold text-primary-600">{destinations.length}</span> destinations
                    </div>
                    <button 
                      onClick={() => setShowAddDestination(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Destination</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search destinations by name, country, or category..."
                      value={destinationSearch}
                      onChange={(e) => setDestinationSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
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
                ) : filteredDestinations.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No destinations found matching your search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDestinations.map((dest) => (
                      <div key={dest.id} className="card p-4 hover:shadow-lg transition-shadow">
                        {dest.image && (
                          <img 
                            src={dest.image.startsWith('http') ? dest.image : `${config.API_BASE_URL}${dest.image}`}
                            alt={dest.name}
                            className="w-full h-48 object-cover mb-3"
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
                            <Star className="h-4 w-4 text-black fill-black" />
                            <span className="text-sm font-medium">{dest.rating || '0.0'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4 text-accent-600" />
                            <span className="text-sm">{dest.review_count || 0}</span>
                          </div>
                        </div>

                        <span className="inline-block px-2 py-1 bg-gray-200 text-black text-xs font-medium mb-3">
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
                            className="px-3 py-2 bg-black text-white  hover:bg-gray-900 transition-colors flex items-center justify-center"
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

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Hotels</h2>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600">
                      Total: <span className="font-bold text-primary-600">{hotels.length}</span> hotels
                    </div>
                    <button 
                      onClick={() => setShowAddHotelModal(true)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Hotel</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search hotels by name, destination, or location..."
                      value={hotelSearch}
                      onChange={(e) => setHotelSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {hotels.length === 0 ? (
                  <div className="text-center py-12">
                    <Hotel className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No hotels added yet</p>
                  </div>
                ) : filteredHotels.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No hotels found matching your search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHotels.map((hotel) => (
                      <div key={hotel.id} className="card p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">{hotel.name}</h3>
                            <p className="text-sm text-slate-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {hotel.destination_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{hotel.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-black fill-black" />
                            <span className="text-sm font-medium">{hotel.rating || '0.0'}</span>
                          </div>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{hotel.total_rooms} rooms</span>
                        </div>

                        {/* Pricing Grid */}
                        <div className="bg-slate-50  p-3 mb-3">
                          <p className="text-xs font-semibold text-slate-700 mb-2">Pricing (per night)</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-500">Single:</span>
                              <span className="font-semibold text-slate-800 ml-1">PKR {hotel.price_single}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Couple:</span>
                              <span className="font-semibold text-slate-800 ml-1">PKR {hotel.price_couple}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Executive:</span>
                              <span className="font-semibold text-slate-800 ml-1">PKR {hotel.price_executive}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Family:</span>
                              <span className="font-semibold text-slate-800 ml-1">PKR {hotel.price_family}</span>
                            </div>
                            {hotel.price_villa && (
                              <div className="col-span-2">
                                <span className="text-slate-500">Villa:</span>
                                <span className="font-semibold text-primary-600 ml-1">PKR {hotel.price_villa}</span>
                              </div>
                            )}
                            {hotel.price_entire_hotel && (
                              <div className="col-span-2">
                                <span className="text-slate-500">Entire Hotel:</span>
                                <span className="font-semibold text-accent-600 ml-1">PKR {hotel.price_entire_hotel}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Amenities */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Amenities</p>
                            <div className="flex flex-wrap gap-1">
                              {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                                <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 4 && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                  +{hotel.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{hotel.description}</p>

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewHotel(hotel)}
                            className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button 
                            onClick={() => handleEditHotel(hotel)}
                            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="px-3 py-2 bg-black text-white  hover:bg-gray-900 transition-colors flex items-center justify-center"
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
                          <div className="w-full bg-slate-200  h-2">
                            <div
                              className="bg-gradient-to-r from-primary-600 to-accent-600 h-2 "
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
                    <button className="px-4 py-2 border border-slate-300  hover:bg-slate-50 flex items-center space-x-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {allReviews.map((review) => (
                    <div key={review.id} className="p-4 border border-slate-200  hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500  flex items-center justify-center">
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
                          <span className={`px-2 py-1  text-xs font-medium ${
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
                          <button className="p-2 hover:bg-green-50  transition-colors">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50  transition-colors">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100  transition-colors">
                            <Eye className="h-4 w-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50  transition-colors">
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
                          className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
                        <input
                          type="text"
                          value={systemSettings.general.tagline}
                          className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                        <input
                          type="email"
                          value={systemSettings.general.contactEmail}
                          className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Support Phone</label>
                        <input
                          type="tel"
                          value={systemSettings.general.supportPhone}
                          className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500"
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
                        <div className={`w-12 h-6  ${systemSettings.security.twoFactorAuth ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white  transition-transform ${systemSettings.security.twoFactorAuth ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={systemSettings.security.sessionTimeout}
                          className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Max Login Attempts</label>
                        <input
                          type="number"
                          value={systemSettings.security.maxLoginAttempts}
                          className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500"
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
                        <div className={`w-12 h-6  ${systemSettings.features.aiRecommendations ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white  transition-transform ${systemSettings.features.aiRecommendations ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">User Reviews</p>
                          <p className="text-sm text-slate-500">Allow users to post reviews</p>
                        </div>
                        <div className={`w-12 h-6  ${systemSettings.features.userReviews ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white  transition-transform ${systemSettings.features.userReviews ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">Email Notifications</p>
                          <p className="text-sm text-slate-500">Send email updates to users</p>
                        </div>
                        <div className={`w-12 h-6  ${systemSettings.features.emailNotifications ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white  transition-transform ${systemSettings.features.emailNotifications ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">SMS Notifications</p>
                          <p className="text-sm text-slate-500">Send SMS alerts to users</p>
                        </div>
                        <div className={`w-12 h-6  ${systemSettings.features.smsNotifications ? 'bg-green-500' : 'bg-slate-300'} relative cursor-pointer`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white  transition-transform ${systemSettings.features.smsNotifications ? 'transform translate-x-6' : ''}`}></div>
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
                      <div className="flex justify-between items-center p-3 bg-slate-50 ">
                        <span className="text-sm text-slate-600">Total Users</span>
                        <span className="font-bold text-slate-800">12,458</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 ">
                        <span className="text-sm text-slate-600">Total Destinations</span>
                        <span className="font-bold text-slate-800">487</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 ">
                        <span className="text-sm text-slate-600">Total Reviews</span>
                        <span className="font-bold text-slate-800">8,934</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 ">
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

      {/* View Hotel Modal */}
      {showViewHotelModal && selectedHotel && (
        <ViewHotelModal
          hotel={selectedHotel}
          onClose={() => {
            setShowViewHotelModal(false);
            setSelectedHotel(null);
          }}
          onEdit={() => {
            setShowViewHotelModal(false);
            handleEditHotel(selectedHotel);
          }}
          onDelete={() => {
            setShowViewHotelModal(false);
            handleDeleteHotel(selectedHotel.id);
          }}
        />
      )}

      {/* Add Hotel Modal */}
      {showAddHotelModal && (
        <AddHotelModal
          destinations={destinations}
          onClose={() => setShowAddHotelModal(false)}
          onHotelAdded={handleHotelAdded}
        />
      )}

      {/* Edit Hotel Modal */}
      {showEditHotelModal && selectedHotel && (
        <AddHotelModal
          destinations={destinations}
          hotel={selectedHotel}
          onClose={() => {
            setShowEditHotelModal(false);
            setSelectedHotel(null);
          }}
          onHotelAdded={handleHotelUpdated}
        />
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Add New Admin User</h2>
              <button onClick={() => setShowAddAdminModal(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username *</label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength="8"
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                <select
                  name="role"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="submit" className="flex-1 btn-primary py-3">
                  <Shield className="h-5 w-5 inline mr-2" />
                  Create Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditAdminModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Edit Admin User</h2>
              <button onClick={() => setShowEditAdminModal(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={selectedAdmin.name}
                    className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    defaultValue={selectedAdmin.username}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded bg-slate-100 text-slate-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Username cannot be changed</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={selectedAdmin.email}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                <select
                  name="role"
                  required
                  defaultValue={selectedAdmin.role}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To change the password, the admin user should use the "Change Password" feature or reset it via email.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="submit" className="flex-1 btn-primary py-3">
                  <Edit className="h-5 w-5 inline mr-2" />
                  Update Admin
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditAdminModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
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
            className="p-2 hover:bg-slate-100  transition-colors"
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
                src={destination.image.startsWith('http') ? destination.image : `${config.API_BASE_URL}${destination.image}`}
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
            className="px-6 py-3 bg-black text-white  hover:bg-gray-900 transition-colors"
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
    <div className="flex items-center space-x-3 p-3 bg-slate-50 ">
      <div className="p-2 bg-primary-100 ">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

// View Hotel Modal Component
const ViewHotelModal = ({ hotel, onClose, onEdit, onDelete }) => {
  if (!hotel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{hotel.name}</h2>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hotel.destination_name}, {hotel.destination_country}
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-300 text-yellow-300" />
                  {hotel.rating || '0.0'}
                </span>
                <span className="flex items-center">
                  <Hotel className="h-4 w-4 mr-1" />
                  {hotel.total_rooms} rooms
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20  transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={MapPin} label="Address" value={hotel.address} />
            <InfoItem icon={Phone} label="Phone" value={hotel.phone} />
            <InfoItem icon={Mail} label="Email" value={hotel.email} />
            {hotel.website && <InfoItem icon={FileText} label="Website" value={hotel.website} />}
          </div>

          {/* Pricing Section */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pricing (per night)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 ">
                <p className="text-sm text-blue-600 font-medium">Single</p>
                <p className="text-2xl font-bold text-blue-900">PKR {hotel.price_single}</p>
              </div>
              <div className="bg-green-50 p-4 ">
                <p className="text-sm text-green-600 font-medium">Couple</p>
                <p className="text-2xl font-bold text-green-900">PKR {hotel.price_couple}</p>
              </div>
              <div className="bg-purple-50 p-4 ">
                <p className="text-sm text-purple-600 font-medium">Executive</p>
                <p className="text-2xl font-bold text-purple-900">PKR {hotel.price_executive}</p>
              </div>
              <div className="bg-orange-50 p-4 ">
                <p className="text-sm text-orange-600 font-medium">Family</p>
                <p className="text-2xl font-bold text-orange-900">PKR {hotel.price_family}</p>
              </div>
              {hotel.price_villa && (
                <div className="bg-pink-50 p-4 ">
                  <p className="text-sm text-pink-600 font-medium">Villa</p>
                  <p className="text-2xl font-bold text-pink-900">PKR {hotel.price_villa}</p>
                </div>
              )}
              {hotel.price_entire_hotel && (
                <div className="bg-indigo-50 p-4 ">
                  <p className="text-sm text-indigo-600 font-medium">Entire Hotel</p>
                  <p className="text-2xl font-bold text-indigo-900">PKR {hotel.price_entire_hotel}</p>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-3 py-2 bg-accent-100 text-accent-700  text-sm font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Check-in/out & Cancellation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 ">
              <p className="text-sm text-slate-600 mb-1">Check-in Time</p>
              <p className="text-lg font-bold text-slate-800">{hotel.check_in_time}</p>
            </div>
            <div className="bg-slate-50 p-4 ">
              <p className="text-sm text-slate-600 mb-1">Check-out Time</p>
              <p className="text-lg font-bold text-slate-800">{hotel.check_out_time}</p>
            </div>
          </div>

          {hotel.cancellation_policy && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 ">
              <h4 className="font-bold text-yellow-800 mb-2">Cancellation Policy</h4>
              <p className="text-sm text-yellow-700">{hotel.cancellation_policy}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
          <button onClick={onEdit} className="flex-1 btn-primary py-3">
            <Edit className="h-4 w-4 mr-2 inline" />
            Edit Hotel
          </button>
          <button onClick={onDelete} className="px-6 py-3 bg-black text-white  hover:bg-gray-900 transition-colors font-medium">
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete
          </button>
          <button onClick={onClose} className="px-6 py-3 bg-slate-200 text-slate-700  hover:bg-slate-300 transition-colors font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add/Edit Hotel Modal Component
const AddHotelModal = ({ destinations, hotel, onClose, onHotelAdded }) => {
  const [formData, setFormData] = useState({
    destination: hotel?.destination || '',
    name: hotel?.name || '',
    description: hotel?.description || '',
    address: hotel?.address || '',
    phone: hotel?.phone || '',
    email: hotel?.email || '',
    website: hotel?.website || '',
    price_single: hotel?.price_single || '',
    price_couple: hotel?.price_couple || '',
    price_executive: hotel?.price_executive || '',
    price_family: hotel?.price_family || '',
    price_villa: hotel?.price_villa || '',
    price_entire_hotel: hotel?.price_entire_hotel || '',
    amenities: hotel?.amenities || [],
    rating: hotel?.rating || '',
    total_rooms: hotel?.total_rooms || '',
    check_in_time: hotel?.check_in_time || '2:00 PM',
    check_out_time: hotel?.check_out_time || '12:00 PM',
    cancellation_policy: hotel?.cancellation_policy || ''
  });
  const [amenityInput, setAmenityInput] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  
  // Filter destinations based on search
  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    dest.country.toLowerCase().includes(destinationSearch.toLowerCase())
  );
  
  // Get selected destination name for display
  const selectedDestination = destinations.find(d => d.id === formData.destination);
  const destinationDisplayName = selectedDestination 
    ? `${selectedDestination.name}, ${selectedDestination.country}`
    : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDestinationDropdown && !e.target.closest('.destination-search-container')) {
        setShowDestinationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDestinationDropdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = hotel 
        ? `${config.API_BASE_URL}/api/hotels/${hotel.id}/`
        : `${config.API_BASE_URL}/api/hotels/`;
      
      const method = hotel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onHotelAdded(data);
        await Swal.fire({
          icon: 'success',
          title: hotel ? 'Updated!' : 'Added!',
          text: hotel ? 'Hotel has been updated.' : 'Hotel has been added.',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        throw new Error('Failed to save hotel');
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save hotel: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">{hotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20  transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
          {/* Destination Selection with Search */}
          <div className="relative destination-search-container">
            <label className="block text-sm font-medium text-slate-700 mb-2">Destination *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.destination ? destinationDisplayName : destinationSearch}
                onChange={(e) => {
                  setDestinationSearch(e.target.value);
                  setFormData(prev => ({ ...prev, destination: '' }));
                  setShowDestinationDropdown(true);
                }}
                onFocus={() => setShowDestinationDropdown(true)}
                placeholder="Search destinations..."
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
            
            {/* Dropdown List */}
            {showDestinationDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300  shadow-lg max-h-60 overflow-y-auto">
                {filteredDestinations.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    No destinations found
                  </div>
                ) : (
                  filteredDestinations.map(dest => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, destination: dest.id }));
                        setDestinationSearch('');
                        setShowDestinationDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium text-slate-800">{dest.name}</div>
                      <div className="text-sm text-slate-500">{dest.country}</div>
                    </button>
                  ))
                )}
              </div>
            )}
            
            {formData.destination && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, destination: '' }));
                  setDestinationSearch('');
                }}
                className="absolute right-10 top-10 text-slate-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hotel Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows="2"
              className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the hotel, its features, and what makes it special..."
            />
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Pricing (PKR per night) *</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Single</label>
                <input
                  type="number"
                  required
                  value={formData.price_single}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_single: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Couple</label>
                <input
                  type="number"
                  required
                  value={formData.price_couple}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_couple: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Executive</label>
                <input
                  type="number"
                  required
                  value={formData.price_executive}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_executive: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Family</label>
                <input
                  type="number"
                  required
                  value={formData.price_family}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_family: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Villa (optional)</label>
                <input
                  type="number"
                  value={formData.price_villa}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_villa: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Entire Hotel (optional)</label>
                <input
                  type="number"
                  value={formData.price_entire_hotel}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_entire_hotel: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="Type amenity and press Enter"
                className="flex-1 px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-primary-600 text-white  hover:bg-primary-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, idx) => (
                <span key={idx} className="px-3 py-1 bg-accent-100 text-accent-700  text-sm flex items-center">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 text-accent-900 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Total Rooms</label>
              <input
                type="number"
                value={formData.total_rooms}
                onChange={(e) => setFormData(prev => ({ ...prev, total_rooms: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Time</label>
              <input
                type="text"
                value={formData.check_in_time}
                onChange={(e) => setFormData(prev => ({ ...prev, check_in_time: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Time</label>
              <input
                type="text"
                value={formData.check_out_time}
                onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cancellation Policy</label>
            <textarea
              value={formData.cancellation_policy}
              onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
              rows="3"
              className="w-full px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button type="submit" className="flex-1 btn-primary py-3">
              {hotel ? 'Update Hotel' : 'Add Hotel'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 text-slate-700  hover:bg-slate-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
