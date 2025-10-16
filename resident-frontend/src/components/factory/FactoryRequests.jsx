// src/components/factory/FactoryRequests.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import axios from 'axios';

const FactoryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/factory/requests');
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={20} />;
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'rejected': return <XCircle className="text-red-500" size={20} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
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

  const getTotalValue = (request) => {
    // This would typically come from the backend
    const unitPrices = {
      plastic: 50,
      glass: 30,
      metal: 100,
      paper: 20,
      electronic: 200
    };
    return (request.quantity_requested * (unitPrices[request.waste_type] || 50)).toFixed(2);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Requests</h1>
            <p className="text-gray-600">Track your waste material requests and their status</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <ShoppingCart className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Filter Requests</h2>
          <Filter size={20} className="text-gray-400" />
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                {requests.filter(req => status === 'all' ? true : req.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Request History ({filteredRequests.length})
        </h2>

        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.request_id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {request.waste_type} - {request.quantity_requested} kg
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Requested on {new Date(request.request_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-gray-800 mt-1">
                      ${getTotalValue(request)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Material Type:</span>{' '}
                    <span className="capitalize">{request.waste_type}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Quantity:</span>{' '}
                    {request.quantity_requested} kg
                  </div>

                  <div>
                    <span className="font-medium">Estimated Value:</span>{' '}
                    ${getTotalValue(request)}
                  </div>

                  {request.special_instructions && (
                    <div className="md:col-span-3">
                      <span className="font-medium">Instructions:</span>{' '}
                      {request.special_instructions}
                    </div>
                  )}

                  {request.admin_notes && (
                    <div className="md:col-span-3">
                      <span className="font-medium">Admin Notes:</span>{' '}
                      {request.admin_notes}
                    </div>
                  )}

                  {request.approval_date && (
                    <div className="md:col-span-3">
                      <span className="font-medium">Approved on:</span>{' '}
                      {new Date(request.approval_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {request.status === 'approved' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {requests.length === 0 
                ? "You haven't made any requests yet."
                : "No requests match your current filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactoryRequests;