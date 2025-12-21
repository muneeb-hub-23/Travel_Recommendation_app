import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Compass, Map, Calendar, Settings } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-black shadow-sm z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            Travel Buddy
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link to="/" className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
                  <Map className="h-4 w-4" />
                  <span>Explore</span>
                </Link>
                <Link to="/" className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>My Trips</span>
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full">
                  <User className="h-4 w-4 text-black" />
                  <span className="text-sm font-medium text-black">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="bg-white text-black px-3 py-1.5 text-sm font-medium hover:bg-gray-200 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-black text-white border border-white px-3 py-1.5 text-sm font-medium hover:bg-gray-900 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-gray-800 bg-black"
        >
          <div className="px-4 py-4 space-y-3">
            {user && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Map className="h-5 w-5 text-white" />
                  <span className="text-white">Explore</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Calendar className="h-5 w-5 text-white" />
                  <span className="text-white">My Trips</span>
                </Link>
              </>
            )}
            
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg">
                  <User className="h-5 w-5 text-black" />
                  <span className="font-medium text-black">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-white text-black px-3 py-1.5 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-black text-white border border-white px-3 py-1.5 text-sm font-medium hover:bg-gray-900 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
