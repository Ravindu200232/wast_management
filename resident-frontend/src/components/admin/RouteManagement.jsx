// src/components/admin/RouteManagement.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Clock, AlertCircle, Navigation, Play, Pause, X } from 'lucide-react';
import axios from 'axios';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    route_name: '',
    area_covered: '',
    start_point: '',
    end_point: '',
    estimated_duration: '',
    active: true
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/routes`);
      setRoutes(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to load routes. Please check if the server is running.');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingRoute) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/routes/${editingRoute.route_id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/routes`, formData);
      }
      await fetchRoutes();
      setShowAddForm(false);
      setEditingRoute(null);
      setFormData({
        route_name: '',
        area_covered: '',
        start_point: '',
        end_point: '',
        estimated_duration: '',
        active: true
      });
    } catch (error) {
      console.error('Error saving route:', error);
      setError('Failed to save route. Please check your connection and try again.');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      route_name: route.route_name,
      area_covered: route.area_covered || '',
      start_point: route.start_point || '',
      end_point: route.end_point || '',
      estimated_duration: route.estimated_duration || '',
      active: route.active
    });
    setShowAddForm(true);
  };

  const handleToggleActive = async (routeId, currentStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/routes/${routeId}`, {
        active: !currentStatus
      });
      await fetchRoutes();
    } catch (error) {
      console.error('Error updating route status:', error);
      setError('Failed to update route status.');
    }
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/routes/${routeId}`);
        await fetchRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
        setError('Failed to delete route.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Route Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage collection routes and schedules</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center font-medium"
              >
                <Plus size={20} className="mr-2" />
                Add Route
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-4 mb-4 animate-fade-in">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingRoute ? 'Edit Route' : 'Add New Route'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingRoute(null);
                    setFormData({
                      route_name: '',
                      area_covered: '',
                      start_point: '',
                      end_point: '',
                      estimated_duration: '',
                      active: true
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Route Name *</label>
                  <input
                    type="text"
                    value={formData.route_name}
                    onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                    placeholder="Enter route name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area Covered *</label>
                  <input
                    type="text"
                    value={formData.area_covered}
                    onChange={(e) => setFormData({ ...formData, area_covered: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                    placeholder="Enter area covered"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Point *</label>
                    <input
                      type="text"
                      value={formData.start_point}
                      onChange={(e) => setFormData({ ...formData, start_point: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      required
                      placeholder="Start"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Point *</label>
                    <input
                      type="text"
                      value={formData.end_point}
                      onChange={(e) => setFormData({ ...formData, end_point: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      required
                      placeholder="End"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Enter duration"
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded-full border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label className="ml-3 text-sm text-gray-700 font-medium">Active Route</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    {editingRoute ? 'Update Route' : 'Add Route'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Collection Routes <span className="text-emerald-600">({routes.length})</span>
          </h2>
        </div>

        {routes.length > 0 ? (
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.route_id} className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-3 rounded-2xl mr-4">
                      <Navigation className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{route.route_name}</h3>
                      <p className="text-gray-600 text-sm">{route.area_covered}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    route.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {route.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center bg-gray-50 rounded-2xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Start Point</p>
                    <p className="text-sm font-medium text-gray-800">{route.start_point}</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-2xl p-3">
                    <p className="text-xs text-gray-500 mb-1">End Point</p>
                    <p className="text-sm font-medium text-gray-800">{route.end_point}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">
                      {route.estimated_duration ? `${route.estimated_duration} min` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(route)}
                      className="bg-blue-50 text-blue-600 p-2 rounded-xl hover:bg-blue-100 transition-colors"
                      title="Edit Route"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(route.route_id, route.active)}
                      className={`p-2 rounded-xl transition-colors ${
                        route.active 
                          ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                      title={route.active ? 'Deactivate' : 'Activate'}
                    >
                      {route.active ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(route.route_id)}
                      className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-100 transition-colors"
                      title="Delete Route"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-500 mb-6">
              {error ? 'Unable to load routes. Please check your connection.' : 'No routes have been created yet.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus size={20} className="inline mr-2" />
              Create First Route
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteManagement;