// src/components/driver/RecordCollection.jsx
import React, { useState, useEffect } from 'react';
import { Package, Scale, Camera, MapPin, CheckCircle, Users } from 'lucide-react';
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
      // Fetch all residents from the backend
      const response = await axios.get('http://localhost:3000/api/users');
      const allUsers = response.data;
      
      // Filter only residents and extract necessary data
      const residentUsers = allUsers
        .filter(user => user.role === 'resident' && user.is_active)
        .map(user => ({
          resident_id: user.user_id, // Using user_id as resident_id
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
    // In real app, this would use device camera
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
      // Prepare the collection data
      const collectionData = {
        resident_id: formData.resident_id,
        waste_type: formData.waste_type,
        weight: parseFloat(formData.weight),
        notes: formData.notes,
        location_lat: formData.location_lat,
        location_lng: formData.location_lng,
        // These would come from the driver's context in a real app
        team_id: 'driver-team-001', // You might want to get this from auth context
        vehicle_id: 'vehicle-001'   // You might want to get this from assigned vehicle
      };

      console.log('Sending collection data:', collectionData);

      await axios.post('http://localhost:3000/api/collections', collectionData);

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
    { value: 'general', label: 'General Waste' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'organic', label: 'Organic' }
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Collection Recorded!
          </h1>
          <p className="text-gray-600 mb-6">
            The waste collection has been successfully recorded in the system.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Record Another Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <Package className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Record Collection</h1>
            <p className="text-gray-600">Log waste collection details and measurements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Form */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Collection Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resident Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resident *
                </label>
                {fetchingResidents ? (
                  <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-2"></div>
                    <span className="text-gray-600">Loading residents...</span>
                  </div>
                ) : (
                  <select
                    name="resident_id"
                    value={formData.resident_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a resident...</option>
                    {residents.map((resident) => (
                      <option key={resident.resident_id} value={resident.resident_id}>
                        {resident.full_name} - {getResidentAddress(resident)}
                      </option>
                    ))}
                  </select>
                )}
                {residents.length === 0 && !fetchingResidents && (
                  <p className="text-red-500 text-sm mt-2">
                    No residents found. Please contact administrator.
                  </p>
                )}
              </div>

              {/* Selected Resident Info */}
              {formData.resident_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Selected Resident</h4>
                  {(() => {
                    const selectedResident = residents.find(r => r.resident_id === formData.resident_id);
                    return selectedResident ? (
                      <div className="text-sm text-blue-700">
                        <p><strong>Name:</strong> {selectedResident.full_name}</p>
                        <p><strong>Address:</strong> {getResidentAddress(selectedResident)}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Waste Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  name="waste_type"
                  value={formData.waste_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {wasteTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale size={16} className="inline mr-2" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter weight in kilograms"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Location Coordinates
                </label>
                <div className="flex space-x-4 mb-2">
                  <input
                    type="text"
                    name="location_lat"
                    value={formData.location_lat}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Latitude"
                  />
                  <input
                    type="text"
                    name="location_lng"
                    value={formData.location_lng}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Longitude"
                  />
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <MapPin size={16} className="mr-2" />
                  Get Current Location
                </button>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera size={16} className="inline mr-2" />
                  Collection Photo (Optional)
                </label>
                <button
                  type="button"
                  onClick={handlePhotoCapture}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors text-center"
                >
                  <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Tap to capture photo</p>
                  <p className="text-gray-500 text-sm">Proof of collection</p>
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any special notes or observations..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.resident_id || !formData.weight}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Recording Collection...' : 'Record Collection'}
              </button>
            </form>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Quick Tips</h3>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Always verify the resident's address before collection</li>
                <li>• Record accurate weight measurements</li>
                <li>• Capture photo evidence when possible</li>
                <li>• Update location for real-time tracking</li>
                <li>• Note any special handling requirements</li>
                <li>• Ensure resident is selected before submitting</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-800 mb-3">Collection Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Residents in System:</span>
                  <span className="font-semibold">{residents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Required Fields:</span>
                  <span className="font-semibold">Resident & Weight</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Auto Rewards:</span>
                  <span className="font-semibold">≥10kg = Coupons</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-semibold text-orange-800 mb-3">Recent Residents</h3>
              <div className="space-y-2">
                {residents.slice(0, 3).map((resident) => (
                  <div key={resident.resident_id} className="flex items-center justify-between p-2 border border-orange-200 rounded">
                    <div>
                      <p className="text-sm font-medium text-orange-800">{resident.full_name}</p>
                      <p className="text-xs text-orange-600 truncate max-w-[200px]">
                        {getResidentAddress(resident)}
                      </p>
                    </div>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      Active
                    </span>
                  </div>
                ))}
                {residents.length === 0 && !fetchingResidents && (
                  <p className="text-orange-600 text-sm text-center">No residents available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCollection;