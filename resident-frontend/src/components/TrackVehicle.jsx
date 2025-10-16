// src/components/TrackVehicle.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Truck } from 'lucide-react';
import axios from 'axios';

const TrackVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleLocation();
    const interval = setInterval(fetchVehicleLocation, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchVehicleLocation = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/vehicles/my-vehicle');
      setVehicles(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setVehicles([]); // Set empty array instead of showing error
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Collection Vehicle</h1>
        <p className="text-gray-600">Live location of waste collection vehicles in your area</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            {vehicles.length > 0 ? (
              <div className="text-center">
                <MapPin size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-gray-800 font-semibold">Vehicle Tracking Active</p>
                <p className="text-gray-600 text-sm mt-2">
                  Real-time location tracking would be displayed here
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Coordinates: {vehicles[0].current_location_lat?.toFixed(4)}, {vehicles[0].current_location_lng?.toFixed(4)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Truck size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active vehicles in your area</p>
                <p className="text-sm text-gray-500 mt-2">
                  Check back during your scheduled collection time
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Vehicle List */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Active Vehicles
            </h3>
            
            {vehicles.length > 0 ? (
              <div className="space-y-4">
                {vehicles.map((vehicle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">
                        {vehicle.vehicle_number || 'Collection Vehicle'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status || 'Active'}
                      </span>
                    </div>
                    
                    {vehicle.last_location_update && (
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Clock size={14} className="mr-1" />
                        Last updated: {new Date(vehicle.last_location_update).toLocaleTimeString()}
                      </div>
                    )}
                    
                    {(vehicle.current_location_lat && vehicle.current_location_lng) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Navigation size={14} className="mr-1" />
                        Location: {vehicle.current_location_lat?.toFixed(4)}, {vehicle.current_location_lng?.toFixed(4)}
                      </div>
                    )}
                    
                    {vehicle.driver_id && (
                      <div className="text-sm text-gray-600 mt-1">
                        Driver: {vehicle.driver_id?.full_name || 'Assigned'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No active vehicles found</p>
                <p className="text-sm mt-1">Vehicles will appear during collection hours</p>
              </div>
            )}
          </div>

          {/* Notifications */}
          {vehicles.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Vehicle Nearby</h4>
              <p className="text-yellow-700 text-sm">
                Collection vehicle is active in your area. Please have your waste ready for collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackVehicle;