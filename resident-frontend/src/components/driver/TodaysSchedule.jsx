// src/components/driver/TodaysSchedule.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle, Navigation, Truck } from "lucide-react";
import axios from "axios";

const TodaysSchedule = () => {
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysSchedule();
  }, []);

  // Update the fetchTodaysSchedule function in TodaysSchedule.jsx
  const fetchTodaysSchedule = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `http://localhost:3000/api/schedules/driver?date=${today}`
      );
      const schedules = response.data;
      const driverSchedule = schedules.length > 0 ? schedules[0] : null;

      if (driverSchedule) {
        setTodaySchedule(driverSchedule);
        // Mock stops data - in real app, this would come from the backend
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
    }));
  };

  const markAsCompleted = async (stopId) => {
    try {
      // In real app, this would update the backend
      setStops((prev) =>
        prev.map((stop) =>
          stop.id === stopId ? { ...stop, status: "completed" } : stop
        )
      );
    } catch (error) {
      console.error("Error marking stop as completed:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "current":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={16} />;
      case "current":
        return <Navigation className="text-blue-500" size={16} />;
      case "pending":
        return <Clock className="text-gray-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Today's Schedule
            </h1>
            <p className="text-gray-600">
              Your collection route and stops for today
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <MapPin className="text-orange-600" size={24} />
          </div>
        </div>
      </div>

      {todaySchedule ? (
        <>
          {/* Schedule Overview */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Truck className="text-blue-500 mx-auto mb-2" size={24} />
                <p className="font-semibold text-gray-800">Route</p>
                <p className="text-blue-600">
                  {todaySchedule.route_id?.route_name || "Main Route"}
                </p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <Clock className="text-green-500 mx-auto mb-2" size={24} />
                <p className="font-semibold text-gray-800">Time Slot</p>
                <p className="text-green-600">
                  {todaySchedule.start_time} - {todaySchedule.end_time}
                </p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <MapPin className="text-purple-500 mx-auto mb-2" size={24} />
                <p className="font-semibold text-gray-800">Total Stops</p>
                <p className="text-purple-600">{stops.length}</p>
              </div>
            </div>
          </div>

          {/* Stops List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Collection Stops
            </h2>

            <div className="space-y-4">
              {stops.map((stop) => (
                <div
                  key={stop.id}
                  className={`border rounded-xl p-4 ${
                    stop.status === "current"
                      ? "border-blue-300 bg-blue-50"
                      : stop.status === "completed"
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(stop.status)}
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Stop #{stop.id}
                        </h3>
                        <p className="text-gray-600 text-sm">{stop.address}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          stop.status
                        )}`}
                      >
                        {stop.status.charAt(0).toUpperCase() +
                          stop.status.slice(1)}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {stop.scheduledTime}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Waste Type:</span>{" "}
                      {stop.wasteType}
                    </div>

                    {stop.specialInstructions && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Instructions:</span>{" "}
                        {stop.specialInstructions}
                      </div>
                    )}
                  </div>

                  {stop.status === "current" && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => markAsCompleted(stop.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Mark Completed
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                        <Navigation size={16} className="mr-2" />
                        Get Directions
                      </button>
                    </div>
                  )}

                  {stop.status === "pending" && (
                    <div className="mt-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                        <Navigation size={16} className="mr-2" />
                        Navigate to Stop
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Schedule for Today
          </h3>
          <p className="text-gray-500">
            You don't have any scheduled collections for today.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaysSchedule;
