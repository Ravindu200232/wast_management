// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  Gift, 
  Calendar,
  TrendingUp,
  Clock,
  User,
  AlertCircle
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
      const scheduleResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/schedules`);
      if (scheduleResponse.data && scheduleResponse.data.length > 0) {
        setSchedule(scheduleResponse.data[0]);
      }

      // Fetch resident stats from profile
      const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`);
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
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      title: 'Request Pickup',
      description: 'Schedule extra waste pickup',
      icon: Truck,
      link: '/extra-pickup',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-green-500'
    },
    {
      title: 'My Coupons',
      description: 'View and redeem your reward coupons',
      icon: Gift,
      link: '/my-coupons',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500'
    },
    {
      title: 'Collection History',
      description: 'View your waste collection records',
      icon: Calendar,
      link: '/collection-history',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-purple-500 to-indigo-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/60">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back!</h1>
            <p className="text-emerald-100 text-sm">Monitor your waste management activities</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <User className="text-white" size={24} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-medium">Total Waste</p>
                <p className="text-white text-lg font-bold mt-1">
                  {stats.totalWaste} kg
                </p>
              </div>
              <TrendingUp className="text-white/80" size={18} />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-medium">Points</p>
                <p className="text-white text-lg font-bold mt-1">
                  {stats.rewardPoints}
                </p>
              </div>
              <Gift className="text-white/80" size={18} />
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs font-medium">Coupons</p>
                <p className="text-white text-lg font-bold mt-1">
                  {stats.coupons}
                </p>
              </div>
              <Gift className="text-white/80" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                <action.icon className="text-white" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                {action.title}
              </h3>
              <p className="text-gray-600 text-xs leading-tight">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Collection Schedule */}
      <div className="px-4">
        {schedule ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Next Collection</h2>
              <Clock className="text-gray-400" size={20} />
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {schedule.day_of_week?.charAt(0).toUpperCase() + schedule.day_of_week?.slice(1)} Collection
                    </p>
                  </div>
                  <p className="text-gray-600 text-xs mb-1">
                    ⏰ {schedule.start_time} - {schedule.end_time}
                  </p>
                  <p className="text-gray-500 text-xs">
                    📅 {new Date(schedule.collection_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  Scheduled
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={28} className="text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-800 mb-1">No Upcoming Collections</h3>
              <p className="text-gray-500 text-sm px-2">
                You don't have any scheduled collections at the moment.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Padding for Mobile */}
      <div className="h-6"></div>
    </div>
  );
};

export default Dashboard;