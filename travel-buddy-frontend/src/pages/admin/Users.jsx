import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import config from '../../config';
import { Users as UsersIcon, Search, Eye, Trash2, Mail, Phone } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

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

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.phone?.toLowerCase().includes(userSearch.toLowerCase())
  );

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
    </motion.div>
  );
};

export default Users;
