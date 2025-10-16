// src/components/driver/DriverDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Navigation,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

const DriverDashboard = () => {
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [todayStats, setTodayStats] = useState({
    completed: 0,
    pending: 0,
    total: 0,
    totalWeight: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverData();
  }, []);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      
      // Fetch driver's assigned vehicle
      const vehicleResponse = await axios.get('http://localhost:3000/api/vehicles/driver-vehicle');
      const assignedVehicle = vehicleResponse.data;

      // Fetch today's schedule for driver
      const today = new Date().toISOString().split('T')[0];
      const scheduleResponse = await axios.get(`http://localhost:3000/api/schedules/driver?date=${today}`);
      const schedules = scheduleResponse.data;
      const todaySchedule = schedules.length > 0 ? schedules[0] : null;

      // Fetch today's collections made by this driver
      const collectionsResponse = await axios.get('http://localhost:3000/api/collections/history');
      const todayCollections = collectionsResponse.data.filter(collection => {
        const collectionDate = new Date(collection.collection_date).toISOString().split('T')[0];
        return collectionDate === today && collection.team_id === 'current-driver-id'; // Adjust based on your auth
      });

      setVehicleInfo(assignedVehicle);
      setTodaySchedule(todaySchedule);
      
      // Calculate stats based on schedule and actual collections
      const estimatedStops = todaySchedule?.estimated_stops || 15;
      const completedCollections = todayCollections.length;
      
      setTodayStats({
        completed: completedCollections,
        pending: Math.max(0, estimatedStops - completedCollections),
        total: estimatedStops,
        totalWeight: todayCollections.reduce((sum, collection) => sum + (collection.weight || 0), 0)
      });

    } catch (error) {
      console.error('Error fetching driver data:', error);
      // Set default values if API calls fail
      setTodayStats({
        completed: 0,
        pending: 15,
        total: 15,
        totalWeight: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    if (!vehicleInfo) {
      alert('No vehicle assigned to update location.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await axios.put(`http://localhost:3000/api/vehicles/${vehicleInfo.vehicle_id}/location`, {
            current_location_lat: position.coords.latitude,
            current_location_lng: position.coords.longitude
          });
          alert('Location updated successfully!');
        } catch (error) {
          console.error('Error updating location:', error);
          alert('Failed to update location');
        }
      },
      (error) => {
        alert('Error getting location: ' + error.message);
      }
    );
  };

  const quickActions = [
    {
      title: "Today's Route",
      description: 'View your collection route for today',
      icon: MapPin,
      link: '/driver/today',
      color: 'bg-blue-500'
    },
    {
      title: 'Record Collection',
      description: 'Log waste collection details',
      icon: Package,
      link: '/driver/collections',
      color: 'bg-green-500'
    },
    {
      title: 'Update Location',
      description: 'Share your current GPS location',
      icon: Navigation,
      action: updateLocation,
      color: 'bg-purple-500'
    },
    {
      title: 'Report Issue',
      description: 'Report delays or problems',
      icon: AlertTriangle,
      link: '/driver/issues',
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your waste collection activities</p>
      </div>

      {/* Vehicle Status */}
      {vehicleInfo ? (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Truck className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{vehicleInfo.vehicle_number}</h3>
                <p className="text-gray-600 text-sm">
                  {vehicleInfo.vehicle_type} • Capacity: {vehicleInfo.capacity} kg
                </p>
                <p className={`text-sm ${
                  vehicleInfo.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  Status: {vehicleInfo.status}
                </p>
              </div>
            </div>
            <button
              onClick={updateLocation}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
            >
              <Navigation size={16} className="mr-2" />
              Update Location
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 mr-2" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800">No Vehicle Assigned</h3>
              <p className="text-yellow-700 text-sm">
                Please contact administration to get a vehicle assigned to you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed Stops</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {todayStats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Stops</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {todayStats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Collected</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {todayStats.totalWeight} kg
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Progress</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          action.link ? (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                <action.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {action.description}
              </p>
            </Link>
          ) : (
            <button
              key={index}
              onClick={action.action}
              disabled={!vehicleInfo}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                <action.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {action.description}
              </p>
            </button>
          )
        ))}
      </div>

      {/* Today's Schedule */}
      {todaySchedule ? (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
            <Clock className="text-gray-400" size={20} />
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  {todaySchedule.route_id?.route_name || 'Collection Route'}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {todaySchedule.start_time} - {todaySchedule.end_time}
                </p>
                <p className="text-gray-500 text-sm">
                  Estimated stops: {todayStats.total}
                </p>
              </div>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                In Progress
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule for Today</h3>
            <p className="text-gray-500">
              You don't have any scheduled collections for today.
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {todayStats.completed > 0 ? (
            <>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Collection Completed</p>
                    <p className="text-gray-600 text-sm">{todayStats.completed} stops today</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Navigation className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Location Updated</p>
                    <p className="text-gray-600 text-sm">GPS coordinates shared</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No activity recorded today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;