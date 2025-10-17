// src/components/driver/RecordCollection.jsx
import React, { useState, useEffect } from 'react';
import { Package, Scale, Camera, MapPin, CheckCircle, Users, Navigation, Weight, User, Home, Info } from 'lucide-react';
import axios from 'axios';

const RecordCollection = () => {
  const [formData, setFormData] = useState({
    resident_id: '',
    waste_type: 'general',
    weight: '',
    notes: '',
    location_lat: '',
    location_lng: '',
    photo: null
  });
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingResidents, setFetchingResidents] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
      const allUsers = response.data;
      
      const residentUsers = allUsers
        .filter(user => user.role === 'resident' && user.is_active)
        .map(user => ({
          resident_id: user.user_id,
          full_name: user.full_name,
          address: user.address,
          house_number: user.house_number,
          street: user.street,
          area: user.area,
          city: user.city
        }));

      setResidents(residentUsers);
    } catch (error) {
      console.error('Error fetching residents:', error);
      alert('Failed to load residents data');
    } finally {
      setFetchingResidents(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoCapture = () => {
    alert('Photo capture functionality would be implemented here');
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location_lat: position.coords.latitude,
          location_lng: position.coords.longitude
        });
      },
      (error) => {
        alert('Error getting location: ' + error.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const collectionData = {
        resident_id: formData.resident_id,
        waste_type: formData.waste_type,
        weight: parseFloat(formData.weight),
        notes: formData.notes,
        location_lat: formData.location_lat,
        location_lng: formData.location_lng,
        team_id: 'driver-team-001',
        vehicle_id: 'vehicle-001'
      };

      console.log('Sending collection data:', collectionData);

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/collections`, collectionData);

      setSuccess(true);
      setFormData({
        resident_id: '',
        waste_type: 'general',
        weight: '',
        notes: '',
        location_lat: '',
        location_lng: '',
        photo: null
      });
    } catch (error) {
      console.error('Error recording collection:', error);
      alert('Failed to record collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wasteTypes = [
    { value: 'general', label: 'General Waste', color: 'from-gray-500 to-gray-600' },
    { value: 'plastic', label: 'Plastic', color: 'from-blue-500 to-cyan-500' },
    { value: 'glass', label: 'Glass', color: 'from-emerald-500 to-green-500' },
    { value: 'metal', label: 'Metal', color: 'from-amber-500 to-orange-500' },
    { value: 'paper', label: 'Paper', color: 'from-purple-500 to-pink-500' },
    { value: 'electronic', label: 'Electronic', color: 'from-red-500 to-rose-500' },
    { value: 'organic', label: 'Organic', color: 'from-lime-500 to-emerald-600' }
  ];

  const getResidentAddress = (resident) => {
    if (resident.address) return resident.address;
    
    const addressParts = [
      resident.house_number,
      resident.street,
      resident.area,
      resident.city
    ].filter(part => part && part.trim() !== '');
    
    return addressParts.join(', ') || 'Address not specified';
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl shadow-xl p-8 text-center border border-emerald-200">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Collection Recorded!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            The waste collection has been successfully recorded in the Smart Waste System.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold w-full"
          >
            Record Another Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
            <Package size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">Record Collection</h1>
            <p className="text-emerald-100 opacity-90">Log waste collection details and measurements</p>
          </div>
          <div className="hidden sm:block bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
            <p className="font-semibold">{residents.length} Residents</p>
            <p className="text-emerald-100 text-sm">In System</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resident Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <User className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Select Resident</h3>
                </div>
                
                {fetchingResidents ? (
                  <div className="flex items-center justify-center p-6 bg-white rounded-xl border border-blue-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                    <span className="text-gray-600 font-medium">Loading residents...</span>
                  </div>
                ) : (
                  <select
                    name="resident_id"
                    value={formData.resident_id}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium"
                    required
                  >
                    <option value="" className="text-gray-400">Choose a resident...</option>
                    {residents.map((resident) => (
                      <option key={resident.resident_id} value={resident.resident_id}>
                        {resident.full_name} - {getResidentAddress(resident)}
                      </option>
                    ))}
                  </select>
                )}
                
                {residents.length === 0 && !fetchingResidents && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm font-medium text-center">
                      No residents found. Please contact administrator.
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Resident Info */}
              {formData.resident_id && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 transform transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <Home className="text-purple-600 mr-2" size={20} />
                    <h4 className="font-bold text-purple-800">Selected Resident</h4>
                  </div>
                  {(() => {
                    const selectedResident = residents.find(r => r.resident_id === formData.resident_id);
                    return selectedResident ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-200">
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="font-semibold text-purple-700">{selectedResident.full_name}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-purple-200">
                          <span className="font-medium text-gray-700">Address:</span>
                          <p className="font-semibold text-purple-700 mt-1">{getResidentAddress(selectedResident)}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Waste Type & Weight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Waste Type */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Package className="text-amber-600 mr-2" size={20} />
                    Waste Type
                  </label>
                  <select
                    name="waste_type"
                    value={formData.waste_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                  >
                    {wasteTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Weight className="text-green-600 mr-2" size={20} />
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    min="0.1"
                    max="1000"
                    className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="0.0"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center mb-4">
                  <Navigation className="text-blue-600 mr-2" size={20} />
                  <h3 className="text-sm font-bold text-gray-700">Location Coordinates</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="location_lat"
                    value={formData.location_lat}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Latitude"
                  />
                  <input
                    type="text"
                    name="location_lng"
                    value={formData.location_lng}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Longitude"
                  />
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                >
                  <MapPin size={20} className="mr-2" />
                  Get Current Location
                </button>
              </div>

              {/* Photo & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-100">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Camera className="text-pink-600 mr-2" size={20} />
                    Collection Photo
                  </label>
                  <button
                    type="button"
                    onClick={handlePhotoCapture}
                    className="w-full h-32 border-2 border-dashed border-pink-300 rounded-xl p-4 hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 flex flex-col items-center justify-center"
                  >
                    <Camera size={32} className="text-pink-400 mb-2" />
                    <p className="text-pink-600 font-medium text-sm">Tap to capture photo</p>
                    <p className="text-pink-500 text-xs">Proof of collection</p>
                  </button>
                </div>

                {/* Notes */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Info className="text-gray-600 mr-2" size={20} />
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 resize-none"
                    placeholder="Any special notes or observations..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.resident_id || !formData.weight}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Recording Collection...
                  </div>
                ) : (
                  'Record Collection'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Quick Info */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-lg p-6 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-4 flex items-center">
              <Info className="mr-2" size={20} />
              Quick Tips
            </h3>
            <div className="space-y-3">
              {[
                "Verify resident address before collection",
                "Record accurate weight measurements",
                "Capture photo evidence when possible",
                "Update location for real-time tracking",
                "Note special handling requirements",
                "Ensure resident is selected before submitting"
              ].map((tip, index) => (
                <div key={index} className="flex items-start p-3 bg-white/50 rounded-xl border border-blue-200/50">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-blue-700 text-sm font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Collection Stats */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-6 border border-green-100">
            <h3 className="font-bold text-green-800 mb-4 flex items-center">
              <Scale className="mr-2" size={20} />
              Collection Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: "Residents in System", value: residents.length, icon: Users },
                { label: "Required Fields", value: "Resident & Weight", icon: Package },
                { label: "Auto Rewards", value: "≥10kg = Coupons", icon: CheckCircle }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-green-200/50">
                  <div className="flex items-center">
                    <stat.icon size={16} className="text-green-600 mr-2" />
                    <span className="text-green-700 text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="font-bold text-green-800 bg-green-100 px-2 py-1 rounded-lg text-sm">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Residents */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-lg p-6 border border-orange-100">
            <h3 className="font-bold text-orange-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Recent Residents
            </h3>
            <div className="space-y-3">
              {residents.slice(0, 3).map((resident) => (
                <div key={resident.resident_id} className="p-3 bg-white/50 rounded-xl border border-orange-200/50 hover:shadow-md transition-shadow duration-200">
                  <p className="font-semibold text-orange-800 text-sm mb-1">{resident.full_name}</p>
                  <p className="text-orange-600 text-xs truncate">
                    {getResidentAddress(resident)}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                      Active
                    </span>
                    <span className="text-orange-500 text-xs">● Online</span>
                  </div>
                </div>
              ))}
              {residents.length === 0 && !fetchingResidents && (
                <div className="text-center p-4 bg-white/50 rounded-xl border border-orange-200/50">
                  <p className="text-orange-600 text-sm">No residents available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCollection;