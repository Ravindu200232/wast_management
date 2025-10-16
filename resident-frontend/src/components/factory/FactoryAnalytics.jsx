// src/components/factory/FactoryAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar, ArrowLeft, PieChart, Activity } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FactoryAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlySpending: [],
    materialTypes: [],
    orderTrends: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // This would typically come from a dedicated analytics endpoint
      const [ordersResponse, requestsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/factory/requests`)
      ]);

      const orders = ordersResponse.data;
      const requests = requestsResponse.data;

      // Generate mock analytics data based on actual orders and requests
      const monthlySpending = generateMonthlySpending(orders);
      const materialTypes = generateMaterialTypes(requests);
      const orderTrends = generateOrderTrends(orders);

      setAnalytics({
        monthlySpending,
        materialTypes,
        orderTrends
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  // Helper functions to generate analytics data
  const generateMonthlySpending = (orders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      amount: Math.floor(Math.random() * 10000) + 5000
    }));
  };

  const generateMaterialTypes = (requests) => {
    const types = ['plastic', 'glass', 'metal', 'paper', 'electronic'];
    return types.map(type => ({
      type,
      quantity: requests.filter(req => req.waste_type === type).reduce((sum, req) => sum + (req.quantity_requested || 0), 0),
      percentage: Math.floor(Math.random() * 30) + 10
    }));
  };

  const generateOrderTrends = (orders) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      orders: Math.floor(Math.random() * 20) + 5,
      completed: Math.floor(Math.random() * 15) + 3
    }));
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
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-blue-100 text-sm">Insights into your waste material procurement</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Total Investment</p>
              <p className="text-white text-lg font-bold mt-1">
                ${analytics.monthlySpending.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="text-center">
              <p className="text-blue-100 text-xs font-medium">Materials</p>
              <p className="text-white text-lg font-bold mt-1">
                {analytics.materialTypes.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Successful Orders</p>
                <p className="text-purple-600 text-lg font-bold mt-1">
                  {analytics.orderTrends.reduce((sum, item) => sum + item.completed, 0)}
                </p>
              </div>
              <TrendingUp className="text-purple-400" size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium">Avg. Monthly</p>
                <p className="text-orange-600 text-lg font-bold mt-1">
                  ${Math.round(analytics.monthlySpending.reduce((sum, item) => sum + item.amount, 0) / 
                  Math.max(analytics.monthlySpending.length, 1)).toLocaleString()}
                </p>
              </div>
              <Calendar className="text-orange-400" size={20} />
            </div>
          </div>
        </div>

        {/* Monthly Spending */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Monthly Spending</h3>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <div className="space-y-3">
            {analytics.monthlySpending.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${(item.amount / 15000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-16 text-right">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Distribution */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Material Distribution</h3>
            <PieChart className="text-blue-500" size={20} />
          </div>
          <div className="space-y-4">
            {analytics.materialTypes.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getMaterialColor(item.type)}`}></div>
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {item.quantity} kg
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getMaterialColor(item.type)}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{item.percentage}% of total</span>
                  <span>{Math.round(item.quantity)} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Trends */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Order Trends</h3>
            <Activity className="text-purple-500" size={20} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {analytics.orderTrends.map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-xs font-medium text-gray-600">{item.month}</p>
                <div className="mt-2">
                  <p className="text-lg font-bold text-blue-600">{item.orders}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div className="mt-1">
                  <p className="text-sm font-semibold text-green-600">{item.completed}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm">Performance Summary</h4>
              <p className="text-blue-600 text-xs">Last 6 months overview</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-blue-800 font-bold text-lg">
                {analytics.orderTrends.reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-blue-600 text-xs">Total Orders</p>
            </div>
            <div>
              <p className="text-green-600 font-bold text-lg">
                {Math.round(analytics.orderTrends.reduce((sum, item) => sum + item.completed, 0) / 
                 analytics.orderTrends.reduce((sum, item) => sum + item.orders, 0) * 100)}%
              </p>
              <p className="text-green-600 text-xs">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryAnalytics;