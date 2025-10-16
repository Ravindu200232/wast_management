// src/components/ExtraPickup.jsx
import React, { useState } from 'react';
import { Calendar, Clock, Package, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ExtraPickup = () => {
  const [formData, setFormData] = useState({
    waste_type: 'general',
    estimated_volume: '',
    estimated_weight: '',
    preferred_date: '',
    preferred_time: 'morning',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'general', label: 'General Waste' }
  ];

  const timeSlots = [
    { value: 'morning', label: 'Morning (8:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:00 PM)' },
    { value: 'evening', label: 'Evening (4:00 PM - 7:00 PM)' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/pickups/extra',
        formData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      setSuccess(true);
      setFormData({
        waste_type: 'general',
        estimated_volume: '',
        estimated_weight: '',
        preferred_date: '',
        preferred_time: 'morning',
        notes: ''
      });
    } catch (error) {
      console.error('Error requesting pickup:', error);
      alert('Failed to request pickup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pickup Request Submitted!
          </h1>
          <p className="text-gray-600 mb-6">
            Your extra waste pickup has been scheduled successfully. 
            You will receive a notification when a collection team is assigned.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Request Another Pickup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <Package className="text-green-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Request Extra Pickup</h1>
            <p className="text-gray-600">Schedule additional waste collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Estimated Volume and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Volume (liters)
              </label>
              <input
                type="number"
                name="estimated_volume"
                value={formData.estimated_volume}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Weight (kg)
              </label>
              <input
                type="number"
                name="estimated_weight"
                value={formData.estimated_weight}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 10"
              />
            </div>
          </div>

          {/* Preferred Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Preferred Date
              </label>
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Preferred Time
              </label>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any special instructions for the collection team..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting Request...' : 'Schedule Extra Pickup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtraPickup;