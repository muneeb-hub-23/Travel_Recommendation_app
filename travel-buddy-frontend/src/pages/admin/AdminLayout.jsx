import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, MapPin, Hotel, Settings, LogOut, Menu, X, BarChart3,
  PieChart, MessageSquare, Shield, Coins
} from 'lucide-react';

const AdminLayout = ({ admin, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication on mount and route changes
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('admin');
    
    if (!adminToken || !savedAdmin) {
      // No token or admin data, redirect to login
      navigate('/admin/login', { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('adminToken');
    // Call parent logout handler
    onLogout();
    // Redirect to admin login
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'adminUsers', label: 'Admin Users', icon: Shield, path: '/admin/admin-users' },
    { id: 'destinations', label: 'Destinations', icon: MapPin, path: '/admin/destinations' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, path: '/admin/hotels' },
    { id: 'travelRates', label: 'Travel Rates', icon: Coins, path: '/admin/travel-rates' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, path: '/admin/analytics' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

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
              onClick={handleLogout}
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
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                  location.pathname === item.path
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
