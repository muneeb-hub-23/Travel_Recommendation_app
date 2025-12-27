import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children, admin }) => {
  const adminToken = localStorage.getItem('adminToken');
  const savedAdmin = localStorage.getItem('admin');

  // If no token or admin data, redirect to login
  if (!adminToken || !savedAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
