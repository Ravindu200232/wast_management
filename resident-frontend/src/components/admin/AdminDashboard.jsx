// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Gift,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingRequests: 0,
    activeVehicles: 0,
    totalWaste: 0,
    availableInventory: 0,
    activeCoupons: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all necessary data for admin dashboard
      const [
        usersResponse,
        requestsResponse,
        vehiclesResponse,
        inventoryResponse,
        couponsResponse
      ] = await Promise.all([
        axios.get('http://localhost:3000/api/users'),
        axios.get('http://localhost:3000/api/factory/requests/all'),
        axios.get('http://localhost:3000/api/vehicles'),
        axios.get('http://localhost:3000/api/inventory'),
        // axios.get('http://localhost:3000/api/coupons') // You'll need to create this endpoint
      ]);

      const users = usersResponse.data;
      const requests = requestsResponse.data;
      const vehicles = vehiclesResponse.data;
      const inventory = inventoryResponse.data;

      // Calculate stats
      setStats({
        totalUsers: users.length,
        pendingRequests: requests.filter(req => req.status === 'pending').length,
        activeVehicles: vehicles.filter(vehicle => vehicle.status === 'active').length,
        totalWaste: inventory.reduce((sum, item) => sum + item.quantity, 0),
        availableInventory: inventory.filter(item => item.status === 'available').length,
        activeCoupons: 0 // You can calculate this when you have coupon data
      });

      // Get recent pending requests
      setRecentRequests(requests.filter(req => req.status === 'pending').slice(0, 5));

      // Generate system alerts
      const alerts = [];
      if (requests.filter(req => req.status === 'pending').length > 10) {
        alerts.push('High number of pending factory requests need attention');
      }
      if (vehicles.filter(vehicle => vehicle.status === 'maintenance').length > 0) {
        alerts.push('Some vehicles are under maintenance');
      }
      if (inventory.filter(item => item.quantity < 10).length > 0) {
        alerts.push('Low inventory levels for some waste materials');
      }

      setSystemAlerts(alerts);

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage all user accounts',
      icon: Users,
      link: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Factory Requests',
      description: 'Approve or reject waste requests',
      icon: ShoppingCart,
      link: '/admin/requests',
      color: 'bg-green-500'
    },
    {
      title: 'Waste Inventory',
      description: 'Manage available waste materials',
      icon: Package,
      link: '/admin/inventory',
      color: 'bg-yellow-500'
    },
    {
      title: 'Vehicle Fleet',
      description: 'Monitor and manage vehicles',
      icon: Truck,
      link: '/admin/vehicles',
      color: 'bg-purple-500'
    }
  ];

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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of the waste management system</p>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-yellow-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-yellow-800">System Alerts</h3>
          </div>
          <ul className="space-y-2">
            {systemAlerts.map((alert, index) => (
              <li key={index} className="text-yellow-700 text-sm flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {stats.totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {stats.pendingRequests}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Vehicles</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.activeVehicles}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Truck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Waste (kg)</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {stats.totalWaste}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Inventory Items</p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                {stats.availableInventory}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Package className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Coupons</p>
              <p className="text-2xl font-bold text-pink-600 mt-2">
                {stats.activeCoupons}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Gift className="text-pink-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-colors"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mr-4`}>
                  <action.icon className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Pending Requests */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
            <Link to="/admin/requests" className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.request_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 capitalize">
                      {request.waste_type} - {request.quantity_requested} kg
                    </p>
                    <p className="text-gray-600 text-sm">
                      {request.factory_id?.company_name || 'Factory'} • {new Date(request.request_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No pending requests</p>
              <p className="text-sm mt-1">All requests are processed</p>
            </div>
          )}
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <TrendingUp className="text-green-500 mx-auto mb-2" size={24} />
            <p className="font-semibold text-gray-800">System Status</p>
            <p className="text-green-600 text-sm">Operational</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Users className="text-blue-500 mx-auto mb-2" size={24} />
            <p className="font-semibold text-gray-800">Active Today</p>
            <p className="text-blue-600 text-sm">24 Users</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Truck className="text-purple-500 mx-auto mb-2" size={24} />
            <p className="font-semibold text-gray-800">Collections Today</p>
            <p className="text-purple-600 text-sm">18 Routes</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <BarChart3 className="text-orange-500 mx-auto mb-2" size={24} />
            <p className="font-semibold text-gray-800">Performance</p>
            <p className="text-orange-600 text-sm">98.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;