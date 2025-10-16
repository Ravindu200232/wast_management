// src/components/admin/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit, Trash2, Users, DollarSign, RefreshCw } from 'lucide-react';
import axios from 'axios';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [residents, setResidents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    resident_id: '',
    coupon_type: 'waste_reward',
    value: '',
    waste_weight_earned: '',
    expiry_days: 90
  });

  useEffect(() => {
    fetchCoupons();
    fetchResidents();
    fetchStats();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/coupons');
      setCoupons(response.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      const activeResidents = (response.data || []).filter(user => 
        user.role === 'resident' && user.is_active === true
      );
      setResidents(activeResidents);
    } catch (error) {
      console.error('Error fetching residents:', error);
      setResidents([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/coupons/stats');
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
      setStats({});
    }
  };

  // Safe data accessor functions
  const getResidentName = (coupon) => {
    if (!coupon) return 'Unknown Resident';
    
    // Handle different possible structures
    if (coupon.resident_id && typeof coupon.resident_id === 'object') {
      return coupon.resident_id.full_name || 'Unknown Resident';
    }
    
    // If resident_id is just an ID, find the resident name from residents list
    const resident = residents.find(r => 
      r.resident_details?.resident_id === coupon.resident_id || 
      r.user_id === coupon.resident_id
    );
    return resident?.full_name || 'Unknown Resident';
  };

  const getCouponType = (coupon) => {
    if (!coupon?.coupon_type) return 'Unknown';
    return coupon.coupon_type.replace('_', ' ').toLowerCase();
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'redeemed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/coupons/issue', formData);
      await fetchCoupons();
      await fetchStats();
      setShowAddForm(false);
      setFormData({
        resident_id: '',
        coupon_type: 'waste_reward',
        value: '',
        waste_weight_earned: '',
        expiry_days: 90
      });
      alert('Coupon issued successfully!');
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDelete = async (couponId) => {
    if (!couponId) {
      alert('Invalid coupon ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await axios.delete(`http://localhost:3000/api/coupons/${couponId}`);
        await fetchCoupons();
        await fetchStats();
        alert('Coupon deleted successfully!');
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Failed to delete coupon: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const refreshData = () => {
    setLoading(true);
    Promise.all([fetchCoupons(), fetchStats()]);
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
      {/* Header and Stats sections remain the same */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Coupon Management</h1>
            <p className="text-gray-600">Manage reward coupons and incentives</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Issue Coupon
            </button>
          </div>
        </div>
      </div>

      {/* Coupon Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Coupons</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {stats.totalCoupons || 0}
              </p>
            </div>
            <Gift className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Coupons</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {stats.activeCoupons || 0}
              </p>
            </div>
            <Users className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Redeemed</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {stats.redeemedCoupons || 0}
              </p>
            </div>
            <Gift className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                ${(stats.totalValue || 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-orange-400" size={24} />
          </div>
        </div>
      </div>

      {/* Issue Coupon Form - remains the same */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Issue New Coupon</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resident *</label>
              <select
                value={formData.resident_id}
                onChange={(e) => setFormData({ ...formData, resident_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Resident</option>
                {residents.map(resident => (
                  <option key={resident.user_id} value={resident.resident_details?.resident_id || resident.user_id}>
                    {resident.full_name} ({resident.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Type</label>
              <select
                value={formData.coupon_type}
                onChange={(e) => setFormData({ ...formData, coupon_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="waste_reward">Waste Reward</option>
                <option value="referral">Referral Bonus</option>
                <option value="special">Special Offer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Value ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Earned (kg) *</label>
              <input
                type="number"
                min="1"
                value={formData.waste_weight_earned}
                onChange={(e) => setFormData({ ...formData, waste_weight_earned: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry (Days) *</label>
              <input
                type="number"
                min="1"
                value={formData.expiry_days}
                onChange={(e) => setFormData({ ...formData, expiry_days: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2 flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Issue Coupon
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({
                    resident_id: '',
                    coupon_type: 'waste_reward',
                    value: '',
                    waste_weight_earned: '',
                    expiry_days: 90
                  });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List with safe data access */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            All Coupons ({coupons.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resident</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waste</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.coupon_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Gift className="text-gray-400 mr-3" size={16} />
                      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {coupon.coupon_code || 'N/A'}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getResidentName(coupon)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {getCouponType(coupon)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    ${coupon.value || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {coupon.waste_weight_earned || '0'} kg
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.issue_date ? new Date(coupon.issue_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(coupon.status)}`}>
                      {coupon.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(coupon.coupon_id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <Gift size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
            <p className="text-gray-500">
              No coupons have been issued yet. Start by issuing a new coupon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;