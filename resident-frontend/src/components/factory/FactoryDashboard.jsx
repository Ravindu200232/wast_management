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
  AlertCircle
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
      const requestsResponse = await axios.get('http://localhost:3000/api/factory/requests');
      const requests = requestsResponse.data;
      
      // Fetch orders
      const ordersResponse = await axios.get('http://localhost:3000/api/orders');
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
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Factory Dashboard</h1>
        <p className="text-gray-600">Manage your waste material requests and track orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
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
              <p className="text-gray-600 text-sm">Active Deliveries</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.activeDeliveries}
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
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                ${stats.totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              to="/factory/inventory"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Browse Inventory</h3>
                <p className="text-gray-600 text-sm">Find available waste materials</p>
              </div>
            </Link>

            <Link
              to="/factory/requests"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ShoppingCart className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">New Request</h3>
                <p className="text-gray-600 text-sm">Request waste materials</p>
              </div>
            </Link>

            <Link
              to="/factory/orders"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Truck className="text-yellow-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Track Orders</h3>
                <p className="text-gray-600 text-sm">Monitor your deliveries</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Requests</h2>
            <Link to="/factory/requests" className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.request_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 capitalize">
                      {request.waste_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.quantity_requested} kg • {new Date(request.request_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No requests yet</p>
              <p className="text-sm mt-1">Start by browsing available inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactoryDashboard;