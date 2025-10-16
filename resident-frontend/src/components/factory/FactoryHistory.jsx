// src/components/factory/FactoryHistory.jsx
import React, { useState, useEffect } from 'react';
import { History, Download, Filter, DollarSign, Package } from 'lucide-react';
import axios from 'axios';

const FactoryHistory = () => {
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [ordersResponse, requestsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/orders'),
        axios.get('http://localhost:3000/api/factory/requests')
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order History</h1>
            <p className="text-gray-600">Complete history of your requests and orders</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <History className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {orders.length}
              </p>
            </div>
            <Package className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${getTotalSpent().toLocaleString()}
              </p>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Materials Requested</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {getTotalMaterials()} kg
              </p>
            </div>
            <Package className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {orders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Requests
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {requests.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'orders' ? (
            <OrdersHistory orders={orders} />
          ) : (
            <RequestsHistory requests={requests} />
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersHistory = ({ orders }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Orders</h3>
    {orders.length > 0 ? (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.order_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Order #{order.order_id.slice(-8)}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.order_date).toLocaleDateString()} • ${order.total_amount?.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.delivery_status === 'delivered' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.delivery_status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  Payment: <span className={order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                    {order.payment_status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Package size={32} className="mx-auto mb-3 text-gray-300" />
        <p>No order history available</p>
      </div>
    )}
  </div>
);

const RequestsHistory = ({ requests }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">All Requests</h3>
    {requests.length > 0 ? (
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.request_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {request.waste_type} - {request.quantity_requested} kg
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(request.request_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  request.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {request.total_amount ? `$${request.total_amount}` : 'Pending valuation'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Package size={32} className="mx-auto mb-3 text-gray-300" />
        <p>No request history available</p>
      </div>
    )}
  </div>
);

export default FactoryHistory;