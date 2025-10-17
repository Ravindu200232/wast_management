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
  TrendingUp,
  ArrowRight,
  User
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
      const vehicleResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/driver-vehicle`);
      const assignedVehicle = vehicleResponse.data;

      // Fetch today's schedule for driver
      const today = new Date().toISOString().split('T')[0];
      const scheduleResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/schedules/driver?date=${today}`);
      const schedules = scheduleResponse.data;
      const todaySchedule = schedules.length > 0 ? schedules[0] : null;

      // Fetch today's collections made by this driver
      const collectionsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/collections/history`);
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
          await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${vehicleInfo.vehicle_id}/location`, {
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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Record Collection',
      description: 'Log waste collection details',
      icon: Package,
      link: '/driver/collections',
      color: 'from-emerald-500 to-green-500'
    },
    {
      title: 'Update Location',
      description: 'Share your current GPS location',
      icon: Navigation,
      action: updateLocation,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Report Issue',
      description: 'Report delays or problems',
      icon: AlertTriangle,
      link: '/driver/issues',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Driver Dashboard</h1>
            <p className="text-orange-100 text-sm">Manage your waste collection activities</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Truck className="text-white" size={24} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-orange-100 text-xs font-medium">Completed</p>
              <p className="text-white text-sm font-bold mt-1">
                {todayStats.completed}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-orange-100 text-xs font-medium">Pending</p>
              <p className="text-white text-sm font-bold mt-1">
                {todayStats.pending}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Vehicle Status */}
        {vehicleInfo ? (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Truck className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{vehicleInfo.vehicle_number}</h3>
                  <p className="text-gray-600 text-xs">
                    {vehicleInfo.vehicle_type} • {vehicleInfo.capacity} kg capacity
                  </p>
                  <p className={`text-xs font-medium ${
                    vehicleInfo.status === 'active' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    Status: {vehicleInfo.status}
                  </p>
                </div>
              </div>
              <button
                onClick={updateLocation}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 font-medium text-sm shadow-lg shadow-purple-200 flex items-center"
              >
                <Navigation size={16} className="mr-2" />
                Update Location
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 text-sm">No Vehicle Assigned</h3>
                <p className="text-amber-700 text-xs">
                  Contact administration to get a vehicle assigned
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Collected</p>
                <p className="text-blue-600 text-lg font-bold mt-1">
                  {todayStats.totalWeight} kg
                </p>
              </div>
              <Package className="text-blue-400" size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Progress</p>
                <p className="text-purple-600 text-lg font-bold mt-1">
                  {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="text-purple-400" size={20} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              action.link ? (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl hover:shadow-md transition-all active:scale-95"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                      <action.icon className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{action.title}</h3>
                      <p className="text-gray-600 text-xs">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-gray-400" size={16} />
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={action.action}
                  disabled={!vehicleInfo}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                      <action.icon className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{action.title}</h3>
                      <p className="text-gray-600 text-xs">{action.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-gray-400" size={16} />
                </button>
              )
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        {todaySchedule ? (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Today's Schedule</h2>
              <Clock className="text-gray-400" size={20} />
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {todaySchedule.route_id?.route_name || 'Collection Route'}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    {todaySchedule.start_time} - {todaySchedule.end_time}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {todayStats.total} estimated stops
                  </p>
                </div>
                <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  In Progress
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No Schedule for Today</p>
              <p className="text-gray-400 text-xs mt-1">No scheduled collections for today</p>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {todayStats.completed > 0 ? (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-emerald-600" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Collection Completed</p>
                      <p className="text-gray-600 text-xs">{todayStats.completed} stops today</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">Today</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Navigation className="text-blue-600" size={14} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Location Updated</p>
                      <p className="text-gray-600 text-xs">GPS coordinates shared</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">Today</span>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">No activity recorded today</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-orange-800 text-sm">Driver Performance</h4>
              <p className="text-orange-600 text-xs">Today's collection overview</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-orange-800 font-bold text-sm">{todayStats.completed}</p>
              <p className="text-orange-600 text-xs">Completed</p>
            </div>
            <div>
              <p className="text-emerald-600 font-bold text-sm">{todayStats.totalWeight}kg</p>
              <p className="text-emerald-600 text-xs">Collected</p>
            </div>
            <div>
              <p className="text-blue-600 font-bold text-sm">
                {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
              </p>
              <p className="text-blue-600 text-xs">Progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;