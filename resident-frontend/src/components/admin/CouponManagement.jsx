// src/components/admin/CouponManagement.jsx
import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit, Trash2, Users, DollarSign, RefreshCw, Package, Calendar, Award, ArrowUpRight, Download, Filter } from 'lucide-react';
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/coupons`);
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/stats`);
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
      setStats({});
    }
  };

  const getResidentName = (coupon) => {
    if (!coupon) return 'Unknown Resident';
    
    if (coupon.resident_id && typeof coupon.resident_id === 'object') {
      return coupon.resident_id.full_name || 'Unknown Resident';
    }
    
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
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'redeemed': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'expired': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'waste_reward': return 'from-emerald-500 to-green-600';
      case 'referral': return 'from-blue-500 to-cyan-600';
      case 'special': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/issue`, formData);
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
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/${couponId}`);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading coupon data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <Gift size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Coupon Management</h1>
              <p className="text-pink-100 opacity-90">Manage reward coupons and incentives</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={refreshData}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-white text-pink-600 px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Issue Coupon
            </button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="sm:hidden mt-4 flex items-center space-x-2">
          <button
            onClick={refreshData}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-white/30 transition-all duration-200 flex-1 flex items-center justify-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-white text-pink-600 px-4 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center flex-1"
          >
            <Plus size={16} className="mr-2" />
            New Coupon
          </button>
        </div>
      </div>

      {/* Coupon Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Coupons', 
            value: stats.totalCoupons || 0, 
            icon: Gift, 
            color: 'from-blue-500 to-cyan-600',
            change: '+12%'
          },
          { 
            label: 'Active Coupons', 
            value: stats.activeCoupons || 0, 
            icon: Users, 
            color: 'from-emerald-500 to-green-600',
            change: '+8'
          },
          { 
            label: 'Redeemed', 
            value: stats.redeemedCoupons || 0, 
            icon: Award, 
            color: 'from-purple-500 to-pink-600',
            change: '+5'
          },
          { 
            label: 'Total Value', 
            value: (stats.totalValue || 0).toFixed(2), 
            icon: DollarSign, 
            color: 'from-amber-500 to-orange-600',
            change: '+$45'
          }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {stat.label.includes('Value') ? `$${stat.value}` : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Issue Coupon Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Plus className="mr-2 text-emerald-500" size={24} />
              Issue New Coupon
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">Resident *</label>
              <select
                value={formData.resident_id}
                onChange={(e) => setFormData({ ...formData, resident_id: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">Coupon Type</label>
              <select
                value={formData.coupon_type}
                onChange={(e) => setFormData({ ...formData, coupon_type: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              >
                <option value="waste_reward">Waste Reward</option>
                <option value="referral">Referral Bonus</option>
                <option value="special">Special Offer</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">Coupon Value ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="0.00"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">Waste Earned (kg) *</label>
              <input
                type="number"
                min="1"
                value={formData.waste_weight_earned}
                onChange={(e) => setFormData({ ...formData, waste_weight_earned: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                placeholder="0"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-gray-50 rounded-2xl p-5 border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-3">Expiry (Days) *</label>
              <input
                type="number"
                min="1"
                value={formData.expiry_days}
                onChange={(e) => setFormData({ ...formData, expiry_days: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center"
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
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Gift className="mr-2 text-pink-500" size={24} />
              All Coupons
              <span className="ml-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {coupons.length}
              </span>
            </h2>
            <div className="flex items-center space-x-3">
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {coupons.map((coupon) => (
                <div key={coupon.coupon_id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(coupon.coupon_type)} rounded-xl flex items-center justify-center`}>
                      <Gift size={24} className="text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(coupon.status)}`}>
                      {coupon.status || 'unknown'}
                    </span>
                  </div>

                  {/* Coupon Code */}
                  <div className="mb-4">
                    <code className="font-mono text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-2 rounded-lg block text-center">
                      {coupon.coupon_code || 'N/A'}
                    </code>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Resident:</span>
                      <span className="text-sm font-semibold text-gray-800">{getResidentName(coupon)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-semibold text-gray-800 capitalize">{getCouponType(coupon)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Value:</span>
                      <span className="text-lg font-bold text-emerald-600">${coupon.value || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Waste Earned:</span>
                      <span className="text-sm font-semibold text-gray-800 flex items-center">
                        <Package size={14} className="mr-1" />
                        {coupon.waste_weight_earned || '0'} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Issued:</span>
                      <span className="text-sm text-gray-600">
                        {coupon.issue_date ? new Date(coupon.issue_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Expiry:</span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDelete(coupon.coupon_id)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center text-sm"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Coupons Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No coupons have been issued yet. Start by issuing a new coupon to reward your residents.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center mx-auto"
              >
                <Plus size={20} className="mr-2" />
                Issue First Coupon
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponManagement;