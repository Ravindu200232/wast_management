// src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Edit, Trash2, Eye, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }

    setFilteredUsers(filtered);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
        is_active: !currentStatus
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'factory': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'resident': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'driver': return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-3 rounded-2xl mr-4">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage all user accounts in the system</p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl px-4 py-2">
            <p className="text-emerald-700 font-semibold">
              Total Users: <span className="text-2xl">{users.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
          
          {/* Role Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="resident">Resident</option>
                <option value="factory">Factory</option>
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Users <span className="text-emerald-600">({filteredUsers.length})</span>
          </h2>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.user_id} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-center flex-1">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-4 rounded-2xl mr-4">
                      <Users className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 sm:mb-0">{user.full_name}</h3>
                        <div className="flex space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.is_active)}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail size={16} className="mr-2" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone size={16} className="mr-2" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Registered: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center lg:justify-end space-x-2">
                    <button
                      onClick={() => handleStatusToggle(user.user_id, user.is_active)}
                      className={`p-3 rounded-2xl transition-all duration-200 ${
                        user.is_active 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105'
                      }`}
                      title={user.is_active ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.is_active ? <UserX size={20} /> : <UserCheck size={20} />}
                    </button>
                    
                    <button
                      className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                      title="Edit User"
                    >
                      <Edit size={20} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 hover:scale-105 transition-all duration-200"
                      title="Delete User"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {users.length === 0 
                ? "No users registered in the system."
                : "No users match your current filters."}
            </p>
            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{users.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'resident').length}
            </div>
            <div className="text-sm text-gray-500">Residents</div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.role === 'driver').length}
            </div>
            <div className="text-sm text-gray-500">Drivers</div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-500">Admins</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;