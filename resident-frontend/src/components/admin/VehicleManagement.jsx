// src/components/admin/VehicleManagement.jsx
import React, { useState, useEffect } from 'react';
import { Truck, Plus, Edit, Trash2, MapPin, User, RefreshCw } from 'lucide-react';
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

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicles');
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
      const response = await axios.get('http://localhost:3000/api/users');
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
        await axios.put(`http://localhost:3000/api/vehicles/${editingVehicle.vehicle_id}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/vehicles', formData);
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
        await axios.delete(`http://localhost:3000/api/vehicles/${vehicleId}`);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Fleet Management</h1>
            <p className="text-gray-600">Manage collection vehicles and assign drivers</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchVehicles}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <RefreshCw size={20} className="mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number *
              </label>
              <input
                type="text"
                value={formData.vehicle_number}
                onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ABC-123"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="compactor">Compactor</option>
                <option value="loader">Loader</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (kg)
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Driver
              </label>
              <select
                value={formData.driver_id}
                onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {drivers.map(driver => (
                  <option key={driver.user_id} value={driver.user_id}>
                    {driver.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Grid */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Vehicle Fleet ({vehicles.length})
        </h2>

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.vehicle_id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Truck className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{vehicle.vehicle_number}</h3>
                      <p className="text-gray-600 text-sm capitalize">{vehicle.vehicle_type || 'Not specified'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Capacity</span>
                    <span className="font-semibold">
                      {vehicle.capacity ? `${vehicle.capacity} kg` : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <User size={14} className="mr-2" />
                      Driver
                    </span>
                    <span className="font-semibold">
                      {getDriverName(vehicle.driver_id)}
                    </span>
                  </div>

                  {vehicle.current_location_lat && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        Location
                      </span>
                      <span className="text-xs font-mono">
                        {vehicle.current_location_lat?.toFixed(4)}, {vehicle.current_location_lng?.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {vehicle.last_location_update && (
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(vehicle.last_location_update).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.vehicle_id)}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center justify-center"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Truck size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500">
              Get started by adding your first vehicle to the fleet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;