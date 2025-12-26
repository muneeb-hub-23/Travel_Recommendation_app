import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
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
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
        <Route 
          path="/admin/*" 
          element={<AdminDashboard admin={admin} onLogout={handleAdminLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
