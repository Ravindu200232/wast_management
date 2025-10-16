// src/components/admin/RouteManagement.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
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
      const response = await axios.get('http://localhost:3000/api/routes');
      setRoutes(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to load routes. Please check if the server is running.');
      setRoutes([]); // Set empty array to prevent further errors
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingRoute) {
        await axios.put(`http://localhost:3000/api/routes/${editingRoute.route_id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/routes', formData);
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
      await axios.put(`http://localhost:3000/api/routes/${routeId}`, {
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
        await axios.delete(`http://localhost:3000/api/routes/${routeId}`);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Route Management</h1>
            <p className="text-gray-600">Manage collection routes and schedules</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Route
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingRoute ? 'Edit Route' : 'Add New Route'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Route Name *</label>
              <input
                type="text"
                value={formData.route_name}
                onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter route name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Area Covered *</label>
              <input
                type="text"
                value={formData.area_covered}
                onChange={(e) => setFormData({ ...formData, area_covered: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter area covered"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Point *</label>
              <input
                type="text"
                value={formData.start_point}
                onChange={(e) => setFormData({ ...formData, start_point: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter start point"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Point *</label>
              <input
                type="text"
                value={formData.end_point}
                onChange={(e) => setFormData({ ...formData, end_point: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter end point"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
              <input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter duration in minutes"
                min="1"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">Active Route</label>
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingRoute ? 'Update Route' : 'Add Route'}
              </button>
              <button
                type="button"
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
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Routes List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Collection Routes ({routes.length})
          </h2>
        </div>
        
        {routes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start - End</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {routes.map((route) => (
                  <tr key={route.route_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="text-gray-400 mr-3" size={20} />
                        <div className="font-medium text-gray-900">{route.route_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{route.area_covered}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {route.start_point} → {route.end_point}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {route.estimated_duration ? `${route.estimated_duration} min` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        route.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {route.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit Route"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(route.route_id, route.active)}
                          className={`p-1 rounded ${
                            route.active 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={route.active ? 'Deactivate' : 'Activate'}
                        >
                          {route.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(route.route_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Route"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
            <p className="text-gray-500">
              {error ? 'Unable to load routes. Please check your connection.' : 'No routes have been created yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteManagement;