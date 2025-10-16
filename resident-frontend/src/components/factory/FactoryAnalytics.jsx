// src/components/factory/FactoryAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar } from 'lucide-react';
import axios from 'axios';

const FactoryAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlySpending: [],
    materialTypes: [],
    orderTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // This would typically come from a dedicated analytics endpoint
      const [ordersResponse, requestsResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/orders'),
        axios.get('http://localhost:3000/api/factory/requests')
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Insights into your waste material procurement</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Investment</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${
                  analytics.monthlySpending.reduce((sum, item) => sum + item.amount, 0).toLocaleString()
                }
              </p>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Materials Procured</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {
                  analytics.materialTypes.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()
                } kg
              </p>
            </div>
            <Package className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Successful Orders</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {
                  analytics.orderTrends.reduce((sum, item) => sum + item.completed, 0)
                }
              </p>
            </div>
            <TrendingUp className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg. Monthly Spend</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                ${
                  Math.round(analytics.monthlySpending.reduce((sum, item) => sum + item.amount, 0) / 
                  Math.max(analytics.monthlySpending.length, 1)).toLocaleString()
                }
              </p>
            </div>
            <Calendar className="text-orange-400" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Spending</h3>
          <div className="space-y-3">
            {analytics.monthlySpending.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(item.amount / 15000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-16 text-right">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Material Types */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Material Distribution</h3>
          <div className="space-y-4">
            {analytics.materialTypes.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 capitalize">
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.quantity} kg ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Trends */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Trends</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analytics.orderTrends.map((item, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium text-gray-800">{item.month}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{item.orders}</p>
              <p className="text-xs text-gray-600">Total Orders</p>
              <p className="text-lg font-semibold text-green-600 mt-1">{item.completed}</p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FactoryAnalytics;