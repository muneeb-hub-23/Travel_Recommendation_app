import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import TripPlanner from './pages/TripPlanner';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Overview from './pages/admin/Overview';
import Users from './pages/admin/Users';
import AdminUsers from './pages/admin/AdminUsers';
import Destinations from './pages/admin/Destinations';
import Hotels from './pages/admin/Hotels';
import TravelRates from './pages/admin/TravelRates';
import Analytics from './pages/admin/Analytics';
import Reviews from './pages/admin/Reviews';
import Settings from './pages/admin/Settings';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  // Check for saved auth state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedAdmin = localStorage.getItem('admin');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/plan-trip/:destinationId" element={<TripPlanner user={user} onLogout={handleLogout} />} />
        
        <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute admin={admin}>
              <AdminLayout admin={admin} onLogout={handleAdminLogout} />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="dashboard" element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="admin-users" element={<AdminUsers />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="travel-rates" element={<TravelRates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
