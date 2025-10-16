// src/components/MyCoupons.jsx
import React, { useState, useEffect } from 'react';
import { Gift, QrCode, Calendar, DollarSign, Copy } from 'lucide-react';
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
      const response = await axios.get('http://localhost:3000/api/coupons/my-coupons');
      setCoupons(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setLoading(false);
    }
  };

  const handleRedeem = async (couponId) => {
    try {
      await axios.post(`http://localhost:3000/api/coupons/${couponId}/redeem`);
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Coupons</h1>
            <p className="text-gray-600">Redeem your reward coupons at partner businesses</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Gift className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Coupons</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {coupons.filter(c => c.status === 'active').length}
              </p>
            </div>
            <Gift className="text-yellow-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${coupons.reduce((sum, coupon) => sum + (coupon.value || 0), 0)}
              </p>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Waste Contributed</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {coupons.reduce((sum, coupon) => sum + (coupon.waste_weight_earned || 0), 0)}kg
              </p>
            </div>
            <Gift className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Coupons List */}
        <div className="mt-6">
          {filteredCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoupons.map((coupon) => (
                <div
                  key={coupon.coupon_id}
                  className={`border rounded-2xl p-6 ${
                    coupon.status === 'active'
                      ? 'border-green-200 bg-green-50'
                      : coupon.status === 'redeemed'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      coupon.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : coupon.status === 'redeemed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                    </span>
                    <div className="text-2xl font-bold text-yellow-600">
                      ${coupon.value}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 mb-3">
                      <QrCode size={48} className="mx-auto text-gray-400" />
                    </div>
                    <p className="font-mono text-lg font-bold text-gray-800">
                      {coupon.coupon_code}
                    </p>
                    <button
                      onClick={() => copyToClipboard(coupon.coupon_code)}
                      className="text-green-600 hover:text-green-700 text-sm flex items-center justify-center mx-auto mt-1"
                    >
                      <Copy size={14} className="mr-1" />
                      Copy Code
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Gift size={14} className="mr-2" />
                      Earned from: {coupon.waste_weight_earned}kg waste
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      Expires: {new Date(coupon.expiry_date).toLocaleDateString()}
                    </div>
                  </div>

                  {coupon.status === 'active' && (
                    <button
                      onClick={() => handleRedeem(coupon.coupon_id)}
                      className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Redeem Now
                    </button>
                  )}

                  {coupon.status === 'redeemed' && coupon.redeemed_at && (
                    <div className="mt-4 text-sm text-blue-600">
                      Redeemed on: {new Date(coupon.redeemed_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
              <p className="text-gray-500">
                {activeTab === 'active'
                  ? "You don't have any active coupons. Contribute more waste to earn rewards!"
                  : `No ${activeTab} coupons found.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCoupons;