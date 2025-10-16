// src/components/MyCoupons.jsx
import React, { useState, useEffect } from 'react';
import { Gift, QrCode, Calendar, DollarSign, Copy, TrendingUp, Package } from 'lucide-react';
import axios from 'axios';

const MyCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/my-coupons`);
      setCoupons(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const handleRedeem = async (couponId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/coupons/${couponId}/redeem`);
      fetchCoupons(); // Refresh the list
      alert('Coupon redeemed successfully!');
    } catch (error) {
      alert('Failed to redeem coupon. Please try again.');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Coupon code copied to clipboard!');
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'active') {
      return coupon.status === 'active';
    } else if (activeTab === 'redeemed') {
      return coupon.status === 'redeemed';
    } else {
      return coupon.status === 'expired';
    }
  });

  const tabs = [
    { id: 'active', label: 'Active', count: coupons.filter(c => c.status === 'active').length },
    { id: 'redeemed', label: 'Redeemed', count: coupons.filter(c => c.status === 'redeemed').length },
    { id: 'expired', label: 'Expired', count: coupons.filter(c => c.status === 'expired').length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/60">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">My Coupons</h1>
            <p className="text-amber-100 text-sm">Redeem your reward coupons</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Gift className="text-white" size={24} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-amber-100 text-xs font-medium">Active</p>
              <p className="text-white text-lg font-bold mt-1">
                {coupons.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-amber-100 text-xs font-medium">Total Value</p>
              <p className="text-white text-lg font-bold mt-1">
                ${coupons.reduce((sum, coupon) => sum + (coupon.value || 0), 0)}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
            <div className="text-center">
              <p className="text-amber-100 text-xs font-medium">Waste</p>
              <p className="text-white text-lg font-bold mt-1">
                {coupons.reduce((sum, coupon) => sum + (coupon.waste_weight_earned || 0), 0)}kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-1 border border-gray-100">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="px-4">
        {filteredCoupons.length > 0 ? (
          <div className="space-y-3">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.coupon_id}
                className={`bg-white rounded-2xl shadow-lg p-5 border-2 transition-all duration-300 active:scale-95 ${
                  coupon.status === 'active'
                    ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
                    : coupon.status === 'redeemed'
                    ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50'
                    : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    coupon.status === 'active'
                      ? 'bg-amber-100 text-amber-800'
                      : coupon.status === 'redeemed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                  </span>
                  <div className="text-2xl font-bold text-amber-600">
                    ${coupon.value}
                  </div>
                </div>

                {/* QR Code & Code */}
                <div className="text-center mb-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300 mb-3 shadow-inner">
                    <QrCode size={40} className="mx-auto text-gray-400" />
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="font-mono text-base font-bold text-gray-800 bg-white/80 px-3 py-2 rounded-lg border">
                      {coupon.coupon_code}
                    </p>
                    <button
                      onClick={() => copyToClipboard(coupon.coupon_code)}
                      className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Package size={14} className="mr-2 text-amber-500" />
                    <span>Earned from: <strong>{coupon.waste_weight_earned}kg</strong> waste</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-amber-500" />
                    <span>Expires: <strong>{new Date(coupon.expiry_date).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                {/* Action Button */}
                {coupon.status === 'active' && (
                  <button
                    onClick={() => handleRedeem(coupon.coupon_id)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 active:scale-95 font-medium text-sm shadow-lg shadow-amber-200"
                  >
                    Redeem Now
                  </button>
                )}

                {coupon.status === 'redeemed' && coupon.redeemed_at && (
                  <div className="text-center py-2">
                    <div className="text-emerald-600 text-sm font-medium">
                      ✓ Redeemed on {new Date(coupon.redeemed_at).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No coupons found</h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'active'
                ? "You don't have any active coupons. Contribute more waste to earn rewards!"
                : `No ${activeTab} coupons found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoupons;