// src/components/factory/FactoryDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Building2
} from 'lucide-react';
import axios from 'axios';

const FactoryDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingRequests: 0,
    activeDeliveries: 0,
    totalSpent: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch factory requests
      const requestsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests`);
      const requests = requestsResponse.data;
      
      // Fetch orders
      const ordersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`);
      const orders = ordersResponse.data;

      // Calculate stats
      setStats({
        totalOrders: orders.length,
        pendingRequests: requests.filter(req => req.status === 'pending').length,
        activeDeliveries: orders.filter(order => order.delivery_status === 'in_transit').length,
        totalSpent: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      });

      // Get recent requests
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching factory dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'pending': return <Clock size={14} className="text-amber-500" />;
      case 'rejected': return <AlertCircle size={14} className="text-red-500" />;
      case 'completed': return <CheckCircle size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Factory Dashboard</h1>
            <p className="text-blue-100 text-sm">Manage waste material requests & track orders</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Building2 className="text-white" size={24} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Total Orders</p>
              <p className="text-white text-lg font-bold mt-1">
                {stats.totalOrders}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Pending</p>
              <p className="text-white text-lg font-bold mt-1">
                {stats.pendingRequests}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Active Deliveries</p>
                <p className="text-emerald-600 text-lg font-bold mt-1">
                  {stats.activeDeliveries}
                </p>
              </div>
              <Truck className="text-emerald-400" size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Total Spent</p>
                <p className="text-purple-600 text-lg font-bold mt-1">
                  ${stats.totalSpent.toLocaleString()}
                </p>
              </div>
              <DollarSign className="text-purple-400" size={20} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/factory/inventory"
              className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors active:scale-95"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Package className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Browse Inventory</h3>
                  <p className="text-gray-600 text-xs">Find available waste materials</p>
                </div>
              </div>
              <ArrowRight className="text-blue-500" size={18} />
            </Link>

            <Link
              to="/factory/requests"
              className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition-colors active:scale-95"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">New Request</h3>
                  <p className="text-gray-600 text-xs">Request waste materials</p>
                </div>
              </div>
              <ArrowRight className="text-emerald-500" size={18} />
            </Link>

            <Link
              to="/factory/orders"
              className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors active:scale-95"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Truck className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Track Orders</h3>
                  <p className="text-gray-600 text-xs">Monitor your deliveries</p>
                </div>
              </div>
              <ArrowRight className="text-amber-500" size={18} />
            </Link>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Requests</h2>
            <Link to="/factory/requests" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request.request_id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-gray-800 text-sm capitalize">
                        {request.waste_type}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {request.quantity_requested} kg • {new Date(request.request_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Package size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No requests yet</p>
              <p className="text-gray-400 text-xs mt-1">Start by browsing available inventory</p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm">Performance Summary</h4>
              <p className="text-blue-600 text-xs">Your factory activity overview</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-blue-800 font-bold text-sm">{stats.totalOrders}</p>
              <p className="text-blue-600 text-xs">Orders</p>
            </div>
            <div>
              <p className="text-emerald-600 font-bold text-sm">{stats.activeDeliveries}</p>
              <p className="text-emerald-600 text-xs">Active</p>
            </div>
            <div>
              <p className="text-purple-600 font-bold text-sm">${(stats.totalSpent/1000).toFixed(0)}K</p>
              <p className="text-purple-600 text-xs">Spent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryDashboard;