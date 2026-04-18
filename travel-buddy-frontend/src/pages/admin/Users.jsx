import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import config from '../../config';
import { Users as UsersIcon, Search, Eye, Trash2, Mail, Phone, Edit, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.phone?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleViewUser = async (user) => {
    await Swal.fire({
      title: 'User Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Name:</strong> ${user.name || user.username || 'N/A'}</p>
          <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
          <p><strong>Joined:</strong> ${user.date_joined ? new Date(user.date_joined).toLocaleDateString() : user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#000000'
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone')
    };

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/users/${selectedUser.id}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        setSelectedUser(null);
        
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User updated successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000
        });
      } else {
        const error = await response.json();
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to update user',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update user: ' + error.message,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `This will permanently delete ${userName}!`,
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/auth/users/${userId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          await fetchUsers();
          
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'User has been deleted.',
            confirmButtonColor: '#10b981',
            timer: 2000
          });
        } else {
          const error = await response.json();
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to delete user',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete user: ' + error.message,
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
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
          <UsersIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
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
                        <span className="text-white font-semibold">{user.name?.charAt(0) || user.username?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name || user.username || 'N/A'}</p>
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
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="p-2 hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-2 hover:bg-slate-100 transition-colors"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name || user.username || 'this user')}
                        className="p-2 hover:bg-slate-100 transition-colors"
                        title="Delete User"
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedUser.name || selectedUser.username}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={selectedUser.email}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={selectedUser.phone}
                  className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To change the password, the user should use the "Forgot Password" feature.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button type="submit" className="flex-1 btn-primary py-3">
                  <Edit className="h-5 w-5 inline mr-2" />
                  Update User
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

export default Users;
