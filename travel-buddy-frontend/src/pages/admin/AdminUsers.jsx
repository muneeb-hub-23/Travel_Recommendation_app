import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
import { Shield, Search, Edit, Trash2, Plus, Mail, X, Activity, Star } from 'lucide-react';

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

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
        await fetchAdminUsers();
        setShowAddModal(false);
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
    setShowEditModal(true);
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
        await fetchAdminUsers();
        setShowEditModal(false);
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
          await fetchAdminUsers();
          
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Users Management</h2>
            <p className="text-sm text-slate-600 mt-1">Manage admin accounts and permissions</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
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
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
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

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Add New Admin User</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded">
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
                  onClick={() => setShowAddModal(false)}
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
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Edit Admin User</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded">
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
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminUsers;
