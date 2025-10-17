// src/components/factory/FactoryOrders.jsx
import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle, ArrowLeft, DollarSign, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FactoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'in_transit': return <Truck className="text-blue-500" size={16} />;
      case 'pending': return <Clock className="text-amber-500" size={16} />;
      case 'cancelled': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(order => order.delivery_status !== 'delivered');
  const deliveredOrders = orders.filter(order => order.delivery_status === 'delivered');

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
            <h1 className="text-2xl font-bold text-white">Order Tracking</h1>
            <p className="text-blue-100 text-sm">Monitor your waste material deliveries</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Active Orders</p>
              <p className="text-white text-sm font-bold mt-1">
                {activeOrders.length}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Delivered</p>
              <p className="text-white text-sm font-bold mt-1">
                {deliveredOrders.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Active Orders */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Active Orders ({activeOrders.length})
          </h2>

          {activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <OrderCard 
                  key={order.order_id} 
                  order={order} 
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Truck size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No active orders</p>
              <p className="text-gray-400 text-xs mt-1">Approved requests will appear here</p>
            </div>
          )}
        </div>

        {/* Delivered Orders */}
        {deliveredOrders.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Delivered Orders ({deliveredOrders.length})
            </h2>
            <div className="space-y-3">
              {deliveredOrders.map((order) => (
                <OrderCard 
                  key={order.order_id} 
                  order={order} 
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm">Order Summary</h4>
              <p className="text-blue-600 text-xs">Total orders overview</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-blue-800 font-bold text-sm">{orders.length}</p>
              <p className="text-blue-600 text-xs">Total</p>
            </div>
            <div>
              <p className="text-emerald-600 font-bold text-sm">{deliveredOrders.length}</p>
              <p className="text-emerald-600 text-xs">Delivered</p>
            </div>
            <div>
              <p className="text-amber-600 font-bold text-sm">{activeOrders.length}</p>
              <p className="text-amber-600 text-xs">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, getStatusColor, getStatusIcon }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 active:scale-95 transition-transform">
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        {getStatusIcon(order.delivery_status)}
        <div>
          <p className="font-semibold text-gray-800 text-sm">
            Order #{order.order_id?.slice(-8)}
          </p>
          <p className="text-gray-600 text-xs">
            <Calendar size={12} className="inline mr-1" />
            {new Date(order.order_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="text-right">
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
          {order.delivery_status.replace('_', ' ')}
        </span>
        <p className="text-blue-600 font-bold text-sm mt-1">
          ${order.total_amount?.toFixed(2)}
        </p>
      </div>
    </div>

    {/* Details */}
    <div className="space-y-2 text-xs text-gray-600 mb-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center">
          <DollarSign size={12} className="mr-1" />
          Payment
        </span>
        <span className={order.payment_status === 'completed' ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
          {order.payment_status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center">
          <Clock size={12} className="mr-1" />
          Delivery Slot
        </span>
        <span className="font-medium">{order.delivery_time_slot}</span>
      </div>

      {order.delivery_date && (
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Calendar size={12} className="mr-1" />
            Delivery Date
          </span>
          <span className="font-medium">{new Date(order.delivery_date).toLocaleDateString()}</span>
        </div>
      )}
    </div>

    {/* Delivery Address */}
    {order.delivery_address && (
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <MapPin size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-xs">
            {order.delivery_address}
          </p>
        </div>
      </div>
    )}

    {/* Status Message */}
    {order.delivery_status === 'in_transit' && (
      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
        <div className="flex items-center space-x-2">
          <Truck className="text-blue-500" size={14} />
          <span className="text-blue-700 text-xs">
            Your order is out for delivery
          </span>
        </div>
      </div>
    )}
  </div>
);

export default FactoryOrders;