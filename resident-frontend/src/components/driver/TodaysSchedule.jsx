// src/components/driver/TodaysSchedule.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle, Navigation, Truck, Calendar, PlayCircle, PauseCircle, AlertCircle } from "lucide-react";
import axios from "axios";

const TodaysSchedule = () => {
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStop, setActiveStop] = useState(null);

  useEffect(() => {
    fetchTodaysSchedule();
  }, []);

  const fetchTodaysSchedule = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/schedules/driver?date=${today}`
      );
      const schedules = response.data;
      const driverSchedule = schedules.length > 0 ? schedules[0] : null;

      if (driverSchedule) {
        setTodaySchedule(driverSchedule);
        setStops(generateMockStops());
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockStops = () => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      address: `123${i} Main Street, Area ${i + 1}`,
      scheduledTime: `08:${(i * 3 + 30).toString().padStart(2, "0")}`,
      status: i < 5 ? "completed" : i === 5 ? "current" : "pending",
      wasteType:
        i % 3 === 0 ? "General" : i % 3 === 1 ? "Recyclable" : "Organic",
      specialInstructions: i % 4 === 0 ? "Backyard collection" : null,
      estimatedTime: `${Math.floor(Math.random() * 8) + 3} mins`,
      distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`
    }));
  };

  const markAsCompleted = async (stopId) => {
    try {
      setStops((prev) =>
        prev.map((stop) =>
          stop.id === stopId ? { ...stop, status: "completed" } : stop
        )
      );
    } catch (error) {
      console.error("Error marking stop as completed:", error);
    }
  };

  const startNavigation = (stopId) => {
    setActiveStop(stopId);
    alert(`Starting navigation to Stop #${stopId}`);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          color: "from-emerald-500 to-green-600",
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-700",
          icon: CheckCircle
        };
      case "current":
        return {
          color: "from-blue-500 to-cyan-600",
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-700",
          icon: Navigation
        };
      case "pending":
        return {
          color: "from-gray-400 to-gray-500",
          bg: "bg-gray-50 border-gray-200",
          text: "text-gray-600",
          icon: Clock
        };
      default:
        return {
          color: "from-gray-400 to-gray-500",
          bg: "bg-gray-50 border-gray-200",
          text: "text-gray-600",
          icon: Clock
        };
    }
  };

  const getWasteTypeColor = (type) => {
    switch (type) {
      case "General":
        return "bg-gradient-to-r from-gray-500 to-gray-600";
      case "Recyclable":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "Organic":
        return "bg-gradient-to-r from-emerald-500 to-green-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading today's schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
              <Calendar size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Today's Schedule</h1>
              <p className="text-blue-100 opacity-90">Your collection route and stops for today</p>
            </div>
          </div>
          <div className="hidden sm:block bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm text-center">
            <p className="font-semibold">{stops.length} Stops</p>
            <p className="text-blue-100 text-sm">Total Today</p>
          </div>
        </div>
      </div>

      {todaySchedule ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Overview & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Schedule Overview */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Truck className="mr-2" size={20} />
                Route Overview
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-blue-600 text-sm font-medium mb-1">Route Name</p>
                  <p className="font-bold text-blue-800 text-lg">
                    {todaySchedule.route_id?.route_name || "Main Route"}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-emerald-600 text-sm font-medium mb-1">Time Slot</p>
                  <p className="font-bold text-emerald-800 text-lg">
                    {todaySchedule.start_time} - {todaySchedule.end_time}
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <p className="text-purple-600 text-sm font-medium mb-1">Total Stops</p>
                  <p className="font-bold text-purple-800 text-lg">{stops.length}</p>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-4">
                {[
                  { label: "Completed", count: stops.filter(s => s.status === "completed").length, color: "bg-emerald-500" },
                  { label: "In Progress", count: stops.filter(s => s.status === "current").length, color: "bg-blue-500" },
                  { label: "Pending", count: stops.filter(s => s.status === "pending").length, color: "bg-gray-400" }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
                      <span className="text-gray-700 text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg text-sm">
                      {stat.count}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Route Progress</span>
                  <span>{Math.round((stops.filter(s => s.status === "completed").length / stops.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(stops.filter(s => s.status === "completed").length / stops.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-lg p-6 border border-orange-100">
              <h3 className="font-bold text-orange-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Start Route
                </button>
                <button className="w-full bg-white text-orange-600 border border-orange-300 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200">
                  Report Issue
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Stops List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Collection Stops</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    <span>Pending</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {stops.map((stop) => {
                  const statusConfig = getStatusConfig(stop.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={stop.id}
                      className={`rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-lg ${
                        stop.status === "current" 
                          ? "border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 transform scale-105" 
                          : statusConfig.bg
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${statusConfig.color}`}>
                            <StatusIcon size={24} className="text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-bold text-gray-800 text-lg">Stop #{stop.id}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.text} bg-white/80 backdrop-blur-sm`}>
                                {stop.status.charAt(0).toUpperCase() + stop.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-700 font-medium mb-1">{stop.address}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {stop.scheduledTime}
                              </span>
                              <span className="flex items-center">
                                <MapPin size={14} className="mr-1" />
                                {stop.distance}
                              </span>
                              <span>~{stop.estimatedTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Waste Type:</span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${getWasteTypeColor(stop.wasteType)}`}>
                            {stop.wasteType}
                          </span>
                        </div>
                        
                        {stop.specialInstructions && (
                          <div className="flex items-start space-x-2">
                            <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-700 font-medium">{stop.specialInstructions}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        {stop.status === "current" && (
                          <>
                            <button
                              onClick={() => markAsCompleted(stop.id)}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                            >
                              <CheckCircle size={20} className="mr-2" />
                              Mark Completed
                            </button>
                            <button 
                              onClick={() => startNavigation(stop.id)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                            >
                              <Navigation size={20} className="mr-2" />
                              Get Directions
                            </button>
                          </>
                        )}

                        {stop.status === "pending" && (
                          <button 
                            onClick={() => startNavigation(stop.id)}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                          >
                            <PlayCircle size={20} className="mr-2" />
                            Start Navigation
                          </button>
                        )}

                        {stop.status === "completed" && (
                          <div className="w-full text-center py-3">
                            <div className="flex items-center justify-center text-emerald-600 font-semibold">
                              <CheckCircle size={20} className="mr-2" />
                              Completed Successfully
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-blue-gray-50 rounded-3xl shadow-xl p-8 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Schedule Today
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You don't have any scheduled collections for today. Enjoy your day off!
            </p>
            <button className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold">
              View Weekly Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysSchedule;