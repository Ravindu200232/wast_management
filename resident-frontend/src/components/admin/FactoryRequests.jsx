// src/components/admin/FactoryRequests.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, XCircle, Clock, Filter, MessageCircle } from 'lucide-react';
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
      const response = await axios.get('http://localhost:3000/api/factory/requests/admin/all');
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
      await axios.put(`http://localhost:3000/api/factory/requests/admin/${requestId}/approve`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`http://localhost:3000/api/factory/requests/admin/${requestId}/reject`, {
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
      await axios.put(`http://localhost:3000/api/factory/requests/admin/${requestId}/complete`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Failed to mark request as completed');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={20} />;
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'rejected': return <XCircle className="text-red-500" size={20} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getTotalValue = (request) => {
    // This would typically come from the backend
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Factory Requests</h1>
            <p className="text-gray-600">Manage and approve factory waste material requests</p>
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
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === status
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
          Factory Requests ({filteredRequests.length})
        </h2>

        {filteredRequests.length > 0 ? (
          <div className="space-y-6">
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
                        Factory ID: {request.factory_id} • {new Date(request.request_date).toLocaleDateString()}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Material Type:</span>{' '}
                    <span className="capitalize">{request.waste_type}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Quantity:</span>{' '}
                    {request.quantity_requested} kg
                  </div>

                  <div>
                    <span className="font-medium">Requested By:</span>{' '}
                    Factory ({request.factory_id})
                  </div>

                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(request.request_date).toLocaleDateString()}
                  </div>

                  {request.special_instructions && (
                    <div className="md:col-span-4">
                      <span className="font-medium">Instructions:</span>{' '}
                      {request.special_instructions}
                    </div>
                  )}

                  {request.admin_notes && (
                    <div className="md:col-span-4">
                      <span className="font-medium">Admin Notes:</span>{' '}
                      {request.admin_notes}
                    </div>
                  )}

                  {request.approval_date && (
                    <div className="md:col-span-4">
                      <span className="font-medium">Approved on:</span>{' '}
                      {new Date(request.approval_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {request.status === 'pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(request.request_id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectModal(request.request_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleComplete(request.request_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {requests.length === 0 
                ? "No factory requests have been submitted yet."
                : "No requests match your current filter."}
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Reject Request
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle size={16} className="inline mr-2" />
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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