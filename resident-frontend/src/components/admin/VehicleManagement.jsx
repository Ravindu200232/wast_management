// src/components/admin/VehicleManagement.jsx
import React, { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, MapPin, User, RefreshCw, Search, Filter } from 'lucide-react';
import axios from 'axios';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_number: '',
    vehicle_type: '',
    capacity: '',
    driver_id: '',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`);
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
      const driverUsers = response.data.filter(user => user.role === 'driver');
      setDrivers(driverUsers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingVehicle) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${editingVehicle.vehicle_id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`, formData);
      }
      await fetchVehicles();
      setShowAddForm(false);
      setEditingVehicle(null);
      resetForm();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setError(error.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicle_number: vehicle.vehicle_number,
      vehicle_type: vehicle.vehicle_type || '',
      capacity: vehicle.capacity || '',
      driver_id: vehicle.driver_id || '',
      status: vehicle.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${vehicleId}`);
        await fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        setError('Failed to delete vehicle');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      vehicle_number: '',
      vehicle_type: '',
      capacity: '',
      driver_id: '',
      status: 'active'
    });
  };

  const getDriverName = (driverId) => {
    if (!driverId) return 'Unassigned';
    const driver = drivers.find(d => d.user_id === driverId);
    return driver ? driver.full_name : 'Unknown Driver';
  };

  // Filter vehicles based on search and status
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getDriverName(vehicle.driver_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-2xl shadow-lg">
                <Truck className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Vehicle Fleet
                </h1>
                <p className="text-gray-600 mt-1">Manage collection vehicles and assign drivers</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={fetchVehicles}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center font-medium"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center font-medium"
              >
                <Plus size={20} className="mr-2" />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by vehicle number or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <Truck className="text-white" size={20} />
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="e.g., ABC-123"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">Select Type</option>
                    <option value="truck">Truck</option>
                    <option value="van">Van</option>
                    <option value="compactor">Compactor</option>
                    <option value="loader">Loader</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="e.g., 5000"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Driver
                  </label>
                  <select
                    value={formData.driver_id}
                    onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map(driver => (
                      <option key={driver.user_id} value={driver.user_id}>
                        {driver.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVehicle(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicles Grid */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Vehicle Fleet ({filteredVehicles.length})
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </div>
          </div>

          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div 
                  key={vehicle.vehicle_id} 
                  className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-100/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-xl shadow-lg">
                        <Truck className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{vehicle.vehicle_number}</h3>
                        <p className="text-gray-600 text-sm capitalize">{vehicle.vehicle_type || 'Not specified'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' :
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-semibold text-gray-800">
                        {vehicle.capacity ? `${vehicle.capacity} kg` : 'Not set'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="flex items-center text-gray-600">
                        <User size={16} className="mr-2" />
                        Driver
                      </span>
                      <span className="font-semibold text-gray-800">
                        {getDriverName(vehicle.driver_id)}
                      </span>
                    </div>

                    {vehicle.current_location_lat && (
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <span className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          Location
                        </span>
                        <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {vehicle.current_location_lat?.toFixed(4)}, {vehicle.current_location_lng?.toFixed(4)}
                        </span>
                      </div>
                    )}

                    {vehicle.last_location_update && (
                      <div className="text-xs text-gray-500 bg-white/30 p-2 rounded-lg text-center">
                        Last updated: {new Date(vehicle.last_location_update).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center font-medium text-sm"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle.vehicle_id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center font-medium text-sm"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No vehicles match your search criteria. Try adjusting your filters.' 
                  : 'Get started by adding your first vehicle to the fleet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Your First Vehicle
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;