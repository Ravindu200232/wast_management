// src/components/admin/FactoryRequests.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, XCircle, Clock, Filter, MessageCircle, Package, DollarSign, Building, Calendar, ArrowUpRight, RefreshCw } from 'lucide-react';
import axios from 'axios';

const FactoryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, statusFilter]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests/admin/all`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    setFilteredRequests(filtered);
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests/admin/${requestId}/approve`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests/admin/${requestId}/reject`, {
        admin_notes: rejectNote || 'Request rejected by administrator'
      });
      setShowRejectModal(null);
      setRejectNote('');
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests/admin/${requestId}/complete`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Failed to mark request as completed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'from-emerald-500 to-green-600';
      case 'pending': return 'from-amber-500 to-orange-600';
      case 'rejected': return 'from-red-500 to-rose-600';
      case 'completed': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-white" size={20} />;
      case 'pending': return <Clock className="text-white" size={20} />;
      case 'rejected': return <XCircle className="text-white" size={20} />;
      case 'completed': return <CheckCircle className="text-white" size={20} />;
      default: return <Clock className="text-white" size={20} />;
    }
  };

  const getWasteTypeColor = (type) => {
    switch (type) {
      case 'plastic': return 'from-blue-500 to-cyan-500';
      case 'glass': return 'from-emerald-500 to-green-500';
      case 'metal': return 'from-amber-500 to-orange-500';
      case 'paper': return 'from-purple-500 to-pink-500';
      case 'electronic': return 'from-red-500 to-rose-500';
      case 'general': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTotalValue = (request) => {
    const unitPrices = {
      plastic: 50,
      glass: 30,
      metal: 100,
      paper: 20,
      electronic: 200,
      general: 40
    };
    return (request.quantity_requested * (unitPrices[request.waste_type] || 50)).toFixed(2);
  };

  const getStatusCount = (status) => {
    return requests.filter(req => status === 'all' ? true : req.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading factory requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <ShoppingCart size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Factory Requests</h1>
              <p className="text-purple-100 opacity-90">Manage and approve factory waste material requests</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={fetchRequests}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
              <p className="font-semibold">{requests.length} Total</p>
              <p className="text-purple-100 text-sm">Requests</p>
            </div>
          </div>
        </div>

        {/* Mobile Refresh */}
        <div className="sm:hidden mt-4 flex justify-center">
          <button
            onClick={fetchRequests}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Filter className="mr-2 text-purple-500" size={24} />
            Filter Requests
          </h2>
          <span className="text-sm text-gray-500">
            Showing {filteredRequests.length} of {requests.length}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { status: 'all', label: 'All Requests', icon: ShoppingCart },
            { status: 'pending', label: 'Pending', icon: Clock },
            { status: 'approved', label: 'Approved', icon: CheckCircle },
            { status: 'rejected', label: 'Rejected', icon: XCircle },
            { status: 'completed', label: 'Completed', icon: CheckCircle }
          ].map((filter) => {
            const IconComponent = filter.icon;
            const count = getStatusCount(filter.status);
            const isActive = statusFilter === filter.status;
            
            return (
              <button
                key={filter.status}
                onClick={() => setStatusFilter(filter.status)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? `border-purple-500 bg-gradient-to-r ${getStatusColor(filter.status)} text-white shadow-lg`
                    : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent size={20} className={isActive ? 'text-white' : 'text-gray-600'} />
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
                <p className={`text-sm font-semibold text-left ${
                  isActive ? 'text-white' : 'text-gray-700'
                }`}>
                  {filter.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Building className="mr-2 text-purple-500" size={24} />
              Factory Requests
              <span className="ml-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {filteredRequests.length}
              </span>
            </h2>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.request_id}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getWasteTypeColor(request.waste_type)} rounded-xl flex items-center justify-center`}>
                      <Package size={24} className="text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusColor(request.status)} text-white`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </div>

                  {/* Waste Type and Quantity */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 capitalize mb-2">
                      {request.waste_type} Waste
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">
                        {request.quantity_requested} kg
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        ${getTotalValue(request)}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building size={16} className="mr-2 text-gray-400" />
                      <span>Factory ID: {request.factory_id}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>{new Date(request.request_date).toLocaleDateString()}</span>
                    </div>
                    
                    {request.special_instructions && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-sm text-blue-700 font-medium">Instructions:</p>
                        <p className="text-sm text-blue-600 mt-1">{request.special_instructions}</p>
                      </div>
                    )}

                    {request.admin_notes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-sm text-amber-700 font-medium">Admin Notes:</p>
                        <p className="text-sm text-amber-600 mt-1">{request.admin_notes}</p>
                      </div>
                    )}

                    {request.approval_date && (
                      <div className="text-xs text-gray-500">
                        Approved: {new Date(request.approval_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200">
                    {request.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleApprove(request.request_id)}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center text-sm"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => setShowRejectModal(request.request_id)}
                          className="bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center text-sm"
                        >
                          <XCircle size={16} className="mr-2" />
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status === 'approved' && (
                      <button
                        onClick={() => handleComplete(request.request_id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Mark as Completed
                      </button>
                    )}

                    {(request.status === 'rejected' || request.status === 'completed') && (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-500">
                          Request {request.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {requests.length === 0 ? "No Requests Found" : "No Matching Requests"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {requests.length === 0 
                  ? "No factory requests have been submitted yet. Check back later for new requests."
                  : "No requests match your current filter. Try selecting a different status."}
              </p>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                >
                  Show All Requests
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <XCircle className="mr-2 text-red-500" size={24} />
                Reject Request
              </h3>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectNote('');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <MessageCircle size={16} className="mr-2 text-red-500" />
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                  placeholder="Provide a reason for rejecting this request..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectNote('');
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryRequests;