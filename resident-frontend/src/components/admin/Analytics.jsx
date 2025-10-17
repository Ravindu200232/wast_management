// src/components/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, Truck, DollarSign, Calendar, RefreshCw, Activity, Cpu, Zap, Shield, ArrowUpRight, Download } from 'lucide-react';
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/system?range=${timeRange}`);
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

  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <BarChart3 size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">System Analytics</h1>
              <p className="text-blue-100 opacity-90">Real-time system performance and metrics</p>
              {lastUpdated && (
                <p className="text-blue-200 text-sm mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-4 py-2 focus:ring-2 focus:ring-white focus:border-transparent"
            >
              <option value="weekly" className="text-gray-800">Last 7 Days</option>
              <option value="monthly" className="text-gray-800">Last 30 Days</option>
              <option value="yearly" className="text-gray-800">Last 12 Months</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-white/30 transition-all duration-200 transform hover:scale-105"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center font-semibold">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="sm:hidden mt-4 flex items-center justify-between">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl px-3 py-2 text-sm flex-1 mr-2"
          >
            <option value="weekly" className="text-gray-800">7 Days</option>
            <option value="monthly" className="text-gray-800">30 Days</option>
            <option value="yearly" className="text-gray-800">12 Months</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-xl hover:bg-white/30 transition-all duration-200"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Users', 
            value: analytics.userStats.totalUsers || 0, 
            icon: Users, 
            color: 'from-blue-500 to-cyan-600',
            change: '+12%',
            description: `${analytics.userStats.activeUsers || 0} active users`
          },
          { 
            label: 'Waste Collected', 
            value: analytics.wasteStats.totalWeight || 0, 
            icon: Package, 
            color: 'from-emerald-500 to-green-600',
            change: '+8.5%',
            description: `${analytics.wasteStats.collectionCount || 0} collections`
          },
          { 
            label: 'Total Revenue', 
            value: analytics.revenueStats.totalRevenue || 0, 
            icon: DollarSign, 
            color: 'from-purple-500 to-pink-600',
            change: '+15.2%',
            description: `${analytics.revenueStats.orderCount || 0} orders`
          },
          { 
            label: 'Collection Efficiency', 
            value: analytics.systemStats.collectionEfficiency || 0, 
            icon: TrendingUp, 
            color: 'from-amber-500 to-orange-600',
            change: '+2.3%',
            description: `${analytics.systemStats.completedCollections || 0}/${analytics.systemStats.totalScheduled || 0} completed`
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
              <p className="text-2xl font-bold text-gray-800 mb-2">
                {stat.label.includes('Revenue') ? formatCurrency(stat.value) : 
                 stat.label.includes('Efficiency') ? `${stat.value}%` : 
                 stat.label.includes('Waste') ? `${formatNumber(stat.value)} kg` : 
                 formatNumber(stat.value)}
              </p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Users className="mr-2 text-blue-500" size={24} />
              User Growth
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                <span>Residents</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>Factories</span>
              </div>
            </div>
          </div>
          {analytics.userGrowth.length > 0 ? (
            <div className="space-y-4">
              {analytics.userGrowth.map((data, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{formatMonth(data)}</span>
                    <div className="text-right text-xs">
                      <div className="text-blue-600 font-semibold">{data.residents} Residents</div>
                      <div className="text-green-600">{data.factories} Factories</div>
                    </div>
                  </div>
                  <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 group-hover:brightness-110"
                      style={{ width: `${(data.residents / Math.max(...analytics.userGrowth.map(d => d.residents))) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 group-hover:brightness-110"
                      style={{ width: `${(data.factories / Math.max(...analytics.userGrowth.map(d => d.factories))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No user growth data available</p>
            </div>
          )}
        </div>

        {/* Waste by Type */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Package className="mr-2 text-emerald-500" size={24} />
              Waste by Type
            </h3>
            <span className="text-sm text-gray-500">
              Total: {formatNumber(analytics.wasteStats.totalWeight || 0)} kg
            </span>
          </div>
          {analytics.wasteByType.length > 0 ? (
            <div className="space-y-4">
              {analytics.wasteByType.map((data, index) => {
                const percentage = ((data.totalWeight / analytics.wasteStats.totalWeight) * 100).toFixed(1);
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 capitalize">
                        {data._id}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {formatNumber(data.totalWeight)} kg
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 group-hover:brightness-110"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {data.collectionCount} collections
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No waste collection data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2 text-purple-500" size={24} />
            Revenue Trend
          </h3>
          <span className="text-sm text-gray-500">
            Total: {formatCurrency(analytics.revenueStats.totalRevenue || 0)}
          </span>
        </div>
        {analytics.monthlyRevenue.length > 0 ? (
          <div className="space-y-4">
            {analytics.monthlyRevenue.map((data, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{formatMonth(data)}</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{formatCurrency(data.revenue)}</div>
                    <div className="text-xs text-gray-500">{data.orders} orders</div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 group-hover:brightness-110"
                    style={{ 
                      width: `${(data.revenue / Math.max(...analytics.monthlyRevenue.map(d => d.revenue))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No revenue data available</p>
          </div>
        )}
      </div>

      {/* System Performance & User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Performance */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="mr-2 text-amber-500" size={24} />
            System Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Vehicles', value: analytics.systemStats.activeVehicles || 0, icon: Truck, color: 'from-blue-500 to-cyan-500' },
              { label: 'Pending Requests', value: analytics.systemStats.pendingRequests || 0, icon: BarChart3, color: 'from-emerald-500 to-green-500' },
              { label: 'Active Coupons', value: analytics.systemStats.activeCoupons || 0, icon: DollarSign, color: 'from-purple-500 to-pink-500' },
              { label: 'Avg Collection', value: analytics.wasteStats.averageWeight || 0, icon: Package, color: 'from-amber-500 to-orange-500' }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                  <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-gray-800">
                    {item.label.includes('Avg Collection') ? `${formatNumber(item.value)} kg` : formatNumber(item.value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="mr-2 text-indigo-500" size={24} />
            User Distribution
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.userStats.usersByRole || {}).map(([role, count], index) => {
              const percentage = ((count / analytics.userStats.totalUsers) * 100).toFixed(1);
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-emerald-500 to-green-500',
                'from-purple-500 to-pink-500',
                'from-amber-500 to-orange-500'
              ];
              return (
                <div key={role} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                  <div className={`w-10 h-10 bg-gradient-to-r ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Users size={20} className="text-white" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm capitalize">{role}s</p>
                  <p className="text-lg font-bold text-gray-800 mb-1">{formatNumber(count)}</p>
                  <p className="text-xs font-semibold text-gray-500">{percentage}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;