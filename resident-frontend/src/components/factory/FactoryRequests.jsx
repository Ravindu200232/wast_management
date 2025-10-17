// src/components/factory/FactoryRequests.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, Filter, ArrowLeft, DollarSign, Package, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FactoryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests`);
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
      case 'approved': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'pending': return <Clock className="text-amber-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
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

  const getMaterialColor = (type) => {
    const colors = {
      plastic: 'from-blue-500 to-cyan-500',
      glass: 'from-emerald-500 to-green-500',
      metal: 'from-amber-500 to-orange-500',
      paper: 'from-yellow-500 to-amber-500',
      electronic: 'from-purple-500 to-pink-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(req => req.status === 'pending').length,
    approved: requests.filter(req => req.status === 'approved').length,
    rejected: requests.filter(req => req.status === 'rejected').length,
    completed: requests.filter(req => req.status === 'completed').length
  };

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
            <h1 className="text-2xl font-bold text-white">My Requests</h1>
            <p className="text-blue-100 text-sm">Track your waste material requests</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Total Requests</p>
              <p className="text-white text-sm font-bold mt-1">
                {requests.length}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Pending</p>
              <p className="text-white text-sm font-bold mt-1">
                {statusCounts.pending}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Filter Requests</h2>
            <Filter size={20} className="text-gray-400" />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  filter === status
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="capitalize">{status}</span>
                  <span className={`mt-1 px-1.5 py-0.5 rounded-full text-xs ${
                    filter === status ? 'bg-white/20' : 'bg-white'
                  }`}>
                    {statusCounts[status]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Request History ({filteredRequests.length})
          </h2>

          {filteredRequests.length > 0 ? (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <div
                  key={request.request_id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 active:scale-95 transition-transform"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm capitalize">
                          {request.waste_type} - {request.quantity_requested} kg
                        </h3>
                        <p className="text-gray-600 text-xs">
                          <Calendar size={12} className="inline mr-1" />
                          {new Date(request.request_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <p className="text-blue-600 font-bold text-sm mt-1">
                        ${getTotalValue(request)}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Package size={12} className="mr-1" />
                        Material Type
                      </span>
                      <span className="font-medium capitalize">{request.waste_type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        Quantity
                      </span>
                      <span className="font-medium">{request.quantity_requested} kg</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        Estimated Value
                      </span>
                      <span className="font-medium">${getTotalValue(request)}</span>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {request.special_instructions && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-gray-600 text-xs">
                        <span className="font-medium">Instructions:</span> {request.special_instructions}
                      </p>
                    </div>
                  )}

                  {request.admin_notes && (
                    <div className="pt-2">
                      <p className="text-gray-600 text-xs">
                        <span className="font-medium">Admin Notes:</span> {request.admin_notes}
                      </p>
                    </div>
                  )}

                  {request.approval_date && (
                    <div className="pt-2">
                      <p className="text-emerald-600 text-xs">
                        <span className="font-medium">Approved on:</span> {new Date(request.approval_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {request.status === 'approved' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 font-medium text-xs shadow-lg shadow-emerald-200">
                        Proceed to Payment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ShoppingCart size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No requests found</p>
              <p className="text-gray-400 text-xs mt-1">
                {requests.length === 0 
                  ? "You haven't made any requests yet."
                  : "No requests match your current filter."}
              </p>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm">Requests Summary</h4>
              <p className="text-blue-600 text-xs">Your request activity overview</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-emerald-600 font-bold text-sm">{statusCounts.approved}</p>
              <p className="text-emerald-600 text-xs">Approved</p>
            </div>
            <div>
              <p className="text-amber-600 font-bold text-sm">{statusCounts.pending}</p>
              <p className="text-amber-600 text-xs">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryRequests;