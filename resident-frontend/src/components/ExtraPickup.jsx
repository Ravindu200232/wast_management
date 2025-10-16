// src/components/ExtraPickup.jsx
import React, { useState } from 'react';
import { Calendar, Clock, Package, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', color: 'bg-blue-500' },
    { value: 'glass', label: 'Glass', color: 'bg-emerald-500' },
    { value: 'metal', label: 'Metal', color: 'bg-amber-500' },
    { value: 'paper', label: 'Paper', color: 'bg-amber-400' },
    { value: 'electronic', label: 'Electronic', color: 'bg-purple-500' },
    { value: 'general', label: 'General Waste', color: 'bg-gray-500' }
  ];

  const timeSlots = [
    { value: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM', icon: '🌅' },
    { value: 'afternoon', label: 'Afternoon', time: '12:00 PM - 4:00 PM', icon: '☀️' },
    { value: 'evening', label: 'Evening', time: '4:00 PM - 7:00 PM', icon: '🌇' }
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
        `${import.meta.env.VITE_BACKEND_URL}/api/pickups/extra`,
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
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Pickup Requested!
          </h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Your extra waste pickup has been scheduled successfully. 
            You will receive a notification when a collection team is assigned to your request.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-200 active:scale-95"
            >
              Request Another Pickup
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl hover:bg-gray-200 transition-colors font-medium active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Extra Pickup</h1>
            <p className="text-emerald-100 text-sm">Schedule additional waste collection</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Waste Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Waste Type
              </label>
              <select
                name="waste_type"
                value={formData.waste_type}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm"
              >
                {wasteTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Volume and Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume (L)
                </label>
                <input
                  type="number"
                  name="estimated_volume"
                  value={formData.estimated_volume}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="estimated_weight"
                  value={formData.estimated_weight}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm"
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2 text-emerald-500" />
                Preferred Date
              </label>
              <input
                type="date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm"
                required
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Clock size={16} className="inline mr-2 text-emerald-500" />
                Preferred Time Slot
              </label>
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <label 
                    key={slot.value}
                    className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      formData.preferred_time === slot.value 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferred_time"
                      value={slot.value}
                      checked={formData.preferred_time === slot.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      formData.preferred_time === slot.value 
                        ? 'border-emerald-500 bg-emerald-500' 
                        : 'border-gray-400'
                    }`}>
                      {formData.preferred_time === slot.value && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">
                        {slot.icon} {slot.label}
                      </div>
                      <div className="text-gray-500 text-xs">{slot.time}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Info size={16} className="inline mr-2 text-emerald-500" />
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm resize-none"
                placeholder="Any special instructions for the collection team..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.preferred_date}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-medium text-sm shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Request...
                </div>
              ) : (
                'Schedule Extra Pickup'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExtraPickup;