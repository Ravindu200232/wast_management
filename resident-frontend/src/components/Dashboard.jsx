// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Gift, 
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [schedule, setSchedule] = useState(null);
  const [stats, setStats] = useState({
    totalWaste: 0,
    rewardPoints: 0,
    coupons: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch weekly schedule
      const scheduleResponse = await axios.get('http://localhost:3000/api/schedules');
      if (scheduleResponse.data && scheduleResponse.data.length > 0) {
        setSchedule(scheduleResponse.data[0]);
      }

      // Fetch resident stats from profile
      const profileResponse = await axios.get('http://localhost:3000/api/auth/profile');
      if (profileResponse.data.resident_details) {
        setStats({
          totalWaste: profileResponse.data.resident_details.total_waste_contributed || 0,
          rewardPoints: profileResponse.data.resident_details.reward_points || 0,
          coupons: 0 // You might need to fetch this separately
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Don't show error for empty data, just log it
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Track Vehicle',
      description: 'Live location of waste collection vehicles',
      icon: MapPin,
      link: '/track-vehicle',
      color: 'bg-blue-500'
    },
    {
      title: 'Request Pickup',
      description: 'Schedule extra waste pickup',
      icon: Truck,
      link: '/extra-pickup',
      color: 'bg-green-500'
    },
    {
      title: 'My Coupons',
      description: 'View and redeem your reward coupons',
      icon: Gift,
      link: '/my-coupons',
      color: 'bg-yellow-500'
    },
    {
      title: 'Collection History',
      description: 'View your waste collection records',
      icon: Calendar,
      link: '/collection-history',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Monitor your waste management activities and rewards</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Waste Contributed</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.totalWaste} kg
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Reward Points</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.rewardPoints}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Gift className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Coupons</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.coupons}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
              <action.icon className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Collection Schedule */}
      {schedule ? (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Next Collection</h2>
            <Clock className="text-gray-400" size={20} />
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  {schedule.day_of_week?.charAt(0).toUpperCase() + schedule.day_of_week?.slice(1)} Collection
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {schedule.start_time} - {schedule.end_time}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(schedule.collection_date).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                Scheduled
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Collections</h3>
            <p className="text-gray-500">
              You don't have any scheduled collections at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;