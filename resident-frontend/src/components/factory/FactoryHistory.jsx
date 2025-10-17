// src/components/factory/FactoryHistory.jsx
import React, { useState, useEffect } from 'react';
import { History, Download, Filter, DollarSign, Package, ArrowLeft, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FactoryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [ordersResponse, requestsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests`)
      ]);
      
      setOrders(ordersResponse.data);
      setRequests(requestsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
    }
  };

  const getTotalSpent = () => {
    return orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  };

  const getTotalMaterials = () => {
    return requests.reduce((sum, req) => sum + (req.quantity_requested || 0), 0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'delivered':
      case 'completed':
        return <CheckCircle size={14} className="text-emerald-500" />;
      case 'pending':
      case 'in_transit':
        return <Clock size={14} className="text-amber-500" />;
      case 'rejected':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <Clock size={14} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Order History</h1>
            <p className="text-blue-100 text-sm">Complete history of requests & orders</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Total Orders</p>
              <p className="text-white text-sm font-bold mt-1">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Total Spent</p>
              <p className="text-white text-sm font-bold mt-1">
                ${(getTotalSpent()/1000).toFixed(0)}K
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Materials</p>
              <p className="text-white text-sm font-bold mt-1">
                {getTotalMaterials()}kg
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-1 border border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Orders</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {orders.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Requests</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {requests.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          {activeTab === 'orders' ? (
            <OrdersHistory orders={orders} getStatusIcon={getStatusIcon} />
          ) : (
            <RequestsHistory requests={requests} getStatusIcon={getStatusIcon} />
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersHistory = ({ orders, getStatusIcon }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-800 mb-4">Completed Orders</h3>
    {orders.length > 0 ? (
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 active:scale-95 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.delivery_status)}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Order #{order.order_id?.slice(-8)}</p>
                  <p className="text-gray-600 text-xs">
                    <Calendar size={12} className="inline mr-1" />
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  order.delivery_status === 'delivered' 
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.delivery_status}
                </span>
                <p className="text-blue-600 font-bold text-sm mt-1">
                  ${order.total_amount?.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Payment: 
                <span className={order.payment_status === 'completed' ? 'text-emerald-600 font-medium ml-1' : 'text-amber-600 font-medium ml-1'}>
                  {order.payment_status}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Package size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No order history available</p>
      </div>
    )}
  </div>
);

const RequestsHistory = ({ requests, getStatusIcon }) => (
  <div>
    <h3 className="text-lg font-bold text-gray-800 mb-4">All Requests</h3>
    {requests.length > 0 ? (
      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.request_id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 active:scale-95 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(request.status)}
                <div>
                  <p className="font-semibold text-gray-800 text-sm capitalize">
                    {request.waste_type} - {request.quantity_requested} kg
                  </p>
                  <p className="text-gray-600 text-xs">
                    <Calendar size={12} className="inline mr-1" />
                    {new Date(request.request_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  request.status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-800'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {request.status}
                </span>
                <p className="text-blue-600 font-bold text-sm mt-1">
                  {request.total_amount ? `$${request.total_amount}` : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Package size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No request history available</p>
      </div>
    )}
  </div>
);

export default FactoryHistory;