// src/components/factory/FactoryOrders.jsx
import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const FactoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'in_transit': return <Truck className="text-blue-500" size={20} />;
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'cancelled': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
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
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Tracking</h1>
            <p className="text-gray-600">Monitor your waste material deliveries</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Truck className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Active Orders ({orders.filter(order => order.delivery_status !== 'delivered').length})
        </h2>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.delivery_status)}
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order #{order.order_id.slice(-8)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.delivery_status)}`}>
                      {order.delivery_status.replace('_', ' ').toUpperCase()}
                    </span>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      ${order.total_amount?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Package size={16} className="mr-2" />
                    <span>Total Amount: <strong>${order.total_amount?.toFixed(2)}</strong></span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    <span>Delivery: {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Scheduled'}</span>
                  </div>

                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>Payment: <strong className={order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                      {order.payment_status}
                    </strong></span>
                  </div>

                  <div className="flex items-center">
                    <Truck size={16} className="mr-2" />
                    <span>Time Slot: {order.delivery_time_slot}</span>
                  </div>
                </div>

                {order.delivery_address && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Delivery Address:</strong> {order.delivery_address}
                    </p>
                    {order.delivery_contact && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Contact:</strong> {order.delivery_contact}
                      </p>
                    )}
                  </div>
                )}

                {order.delivery_status === 'in_transit' && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Truck className="text-blue-500 mr-2" size={16} />
                      <span className="text-blue-700 text-sm">
                        Your order is out for delivery. Expected delivery within the scheduled time slot.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Truck size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              You haven't placed any orders yet. Approved requests will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactoryOrders;