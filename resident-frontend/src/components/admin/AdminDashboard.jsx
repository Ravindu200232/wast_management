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
  Clock,
  ArrowUpRight,
  Activity,
  Cpu,
  Shield,
  Zap
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
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests/all`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inventory`),
        // axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/coupons`) // You'll need to create this endpoint
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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Factory Requests',
      description: 'Approve or reject waste requests',
      icon: ShoppingCart,
      link: '/admin/requests',
      color: 'from-emerald-500 to-green-500'
    },
    {
      title: 'Waste Inventory',
      description: 'Manage available waste materials',
      icon: Package,
      link: '/admin/inventory',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Vehicle Fleet',
      description: 'Monitor and manage vehicles',
      icon: Truck,
      link: '/admin/vehicles',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const systemOverview = [
    {
      title: 'System Status',
      value: 'Operational',
      status: 'success',
      icon: Activity,
      color: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Active Today',
      value: '24 Users',
      status: 'info',
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Collections Today',
      value: '18 Routes',
      status: 'warning',
      icon: Truck,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Performance',
      value: '98.2%',
      status: 'success',
      icon: BarChart3,
      color: 'from-orange-500 to-amber-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-gray-300 opacity-90">Smart Waste Management System Overview</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl shadow-lg p-6 mb-8 border border-amber-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">System Alerts</h3>
              <p className="text-amber-600 text-sm">Attention required for these items</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-xl border border-amber-300/50">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                <span className="text-amber-700 text-sm font-medium">{alert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {[
          { 
            label: 'Total Users', 
            value: stats.totalUsers, 
            icon: Users, 
            color: 'from-blue-500 to-cyan-600',
            change: '+12%'
          },
          { 
            label: 'Pending Requests', 
            value: stats.pendingRequests, 
            icon: Clock, 
            color: 'from-amber-500 to-orange-600',
            change: '+5'
          },
          { 
            label: 'Active Vehicles', 
            value: stats.activeVehicles, 
            icon: Truck, 
            color: 'from-emerald-500 to-green-600',
            change: '100%'
          },
          { 
            label: 'Total Waste', 
            value: stats.totalWaste, 
            icon: Package, 
            color: 'from-purple-500 to-pink-600',
            change: `${stats.totalWaste > 0 ? '+' : ''}${stats.totalWaste}kg`
          },
          { 
            label: 'Inventory Items', 
            value: stats.availableInventory, 
            icon: Package, 
            color: 'from-indigo-500 to-blue-600',
            change: 'Stable'
          },
          { 
            label: 'Active Coupons', 
            value: stats.activeCoupons, 
            icon: Gift, 
            color: 'from-pink-500 to-rose-600',
            change: 'New'
          }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Zap className="mr-2 text-amber-500" size={24} />
                Quick Actions
              </h2>
              <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
                View All <ArrowUpRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                      <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Pending Requests */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Clock className="mr-2 text-amber-500" size={24} />
                Pending Requests
              </h2>
              <Link to="/admin/requests" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
                View All <ArrowUpRight size={16} className="ml-1" />
              </Link>
            </div>

            {recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div key={request.request_id} className="group bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800 capitalize text-sm">
                          {request.waste_type} Waste
                        </p>
                        <p className="text-amber-700 font-semibold text-lg">
                          {request.quantity_requested} kg
                        </p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-amber-600 space-y-1">
                      <p className="font-medium">{request.factory_id?.company_name || 'Factory'}</p>
                      <p>{new Date(request.request_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <p className="text-gray-600 font-medium">No pending requests</p>
                <p className="text-gray-500 text-sm mt-1">All requests are processed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-8">
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Cpu className="mr-2 text-blue-500" size={24} />
            System Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemOverview.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800 text-lg mb-1">{item.title}</p>
                  <p className={`text-xl font-bold ${
                    item.status === 'success' ? 'text-emerald-600' :
                    item.status === 'info' ? 'text-blue-600' :
                    item.status === 'warning' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;