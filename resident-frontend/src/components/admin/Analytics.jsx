// src/components/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, Truck, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    userStats: {},
    wasteStats: {},
    revenueStats: {},
    systemStats: {},
    userGrowth: [],
    wasteByType: [],
    monthlyRevenue: []
  });
  const [timeRange, setTimeRange] = useState('yearly');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/analytics/system?range=${timeRange}`);
      setAnalytics(response.data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatMonth = (monthData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[monthData._id.month - 1]} ${monthData._id.year}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">System Analytics</h1>
            <p className="text-gray-600">Real-time system performance and metrics</p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
              <option value="yearly">Last 12 Months</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {formatNumber(analytics.userStats.totalUsers || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.userStats.activeUsers || 0} active
              </p>
            </div>
            <Users className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Waste Collected</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {formatNumber(analytics.wasteStats.totalWeight || 0)} kg
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.wasteStats.collectionCount || 0} collections
              </p>
            </div>
            <Package className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {formatCurrency(analytics.revenueStats.totalRevenue || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.revenueStats.orderCount || 0} orders
              </p>
            </div>
            <DollarSign className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Collection Efficiency</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {analytics.systemStats.collectionEfficiency || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.systemStats.completedCollections || 0}/{analytics.systemStats.totalScheduled || 0} completed
              </p>
            </div>
            <TrendingUp className="text-orange-400" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h3>
          {analytics.userGrowth.length > 0 ? (
            <div className="space-y-3">
              {analytics.userGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-16">{formatMonth(data)}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex space-x-1">
                      <div 
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${(data.residents / Math.max(...analytics.userGrowth.map(d => d.residents))) * 100}%` }}
                        title={`Residents: ${data.residents}`}
                      ></div>
                      <div 
                        className="h-2 bg-green-500 rounded"
                        style={{ width: `${(data.factories / Math.max(...analytics.userGrowth.map(d => d.factories))) * 100}%` }}
                        title={`Factories: ${data.factories}`}
                      ></div>
                      <div 
                        className="h-2 bg-purple-500 rounded"
                        style={{ width: `${(data.drivers / Math.max(...analytics.userGrowth.map(d => d.drivers || 1))) * 100}%` }}
                        title={`Drivers: ${data.drivers || 0}`}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right text-xs w-20">
                    <div className="text-blue-600">{data.residents} R</div>
                    <div className="text-green-600">{data.factories} F</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No user growth data available</p>
            </div>
          )}
        </div>

        {/* Waste by Type */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste by Type</h3>
          {analytics.wasteByType.length > 0 ? (
            <div className="space-y-4">
              {analytics.wasteByType.map((data, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {data._id}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatNumber(data.totalWeight)} kg
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ 
                        width: `${(data.totalWeight / analytics.wasteStats.totalWeight) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.collectionCount} collections
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No waste collection data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
        {analytics.monthlyRevenue.length > 0 ? (
          <div className="space-y-3">
            {analytics.monthlyRevenue.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-16">{formatMonth(data)}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ 
                        width: `${(data.revenue / Math.max(...analytics.monthlyRevenue.map(d => d.revenue))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-right text-xs w-24">
                  <div className="font-semibold text-gray-800">{formatCurrency(data.revenue)}</div>
                  <div className="text-gray-500">{data.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={32} className="mx-auto mb-3 text-gray-300" />
            <p>No revenue data available</p>
          </div>
        )}
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <Truck className="text-blue-500 mx-auto mb-2" size={24} />
          <p className="font-semibold text-gray-800">Active Vehicles</p>
          <p className="text-blue-600 text-2xl font-bold">
            {analytics.systemStats.activeVehicles || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <BarChart3 className="text-green-500 mx-auto mb-2" size={24} />
          <p className="font-semibold text-gray-800">Pending Requests</p>
          <p className="text-green-600 text-2xl font-bold">
            {analytics.systemStats.pendingRequests || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <Package className="text-purple-500 mx-auto mb-2" size={24} />
          <p className="font-semibold text-gray-800">Active Coupons</p>
          <p className="text-purple-600 text-2xl font-bold">
            {analytics.systemStats.activeCoupons || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <Calendar className="text-orange-500 mx-auto mb-2" size={24} />
          <p className="font-semibold text-gray-800">Avg Collection</p>
          <p className="text-orange-600 text-2xl font-bold">
            {formatNumber(analytics.wasteStats.averageWeight || 0)} kg
          </p>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.userStats.usersByRole || {}).map(([role, count]) => (
            <div key={role} className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-800 capitalize">{role}s</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {formatNumber(count)}
              </p>
              <p className="text-sm text-gray-500">
                {((count / analytics.userStats.totalUsers) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;