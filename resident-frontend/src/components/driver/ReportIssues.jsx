// src/components/driver/ReportIssues.jsx
import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Truck, Send } from 'lucide-react';
import axios from 'axios';

const ReportIssues = () => {
  const [formData, setFormData] = useState({
    issue_type: 'delay',
    description: '',
    location: '',
    estimated_delay: '',
    affected_stops: '',
    urgency: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFormData({
          ...formData,
          location: location
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
      // In real app, this would send to backend
      console.log('Issue reported:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        issue_type: 'delay',
        description: '',
        location: '',
        estimated_delay: '',
        affected_stops: '',
        urgency: 'medium'
      });
    } catch (error) {
      console.error('Error reporting issue:', error);
      alert('Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const issueTypes = [
    { value: 'delay', label: 'Route Delay', icon: Clock },
    { value: 'vehicle', label: 'Vehicle Issue', icon: Truck },
    { value: 'access', label: 'Access Problem', icon: MapPin },
    { value: 'waste', label: 'Waste Issue', icon: AlertTriangle },
    { value: 'other', label: 'Other Issue', icon: AlertTriangle }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <Send size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Issue Reported!
          </h1>
          <p className="text-gray-600 mb-6">
            Your issue has been reported to the management team. They will contact you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Report Issue</h1>
            <p className="text-gray-600">Report delays, problems, or incidents during your route</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Issue Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issueTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.value}
                    onClick={() => setFormData({ ...formData, issue_type: type.value })}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      formData.issue_type === type.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent 
                        size={20} 
                        className={formData.issue_type === type.value ? 'text-red-600' : 'text-gray-600'} 
                      />
                      <span className={formData.issue_type === type.value ? 'text-red-700 font-medium' : 'text-gray-700'}>
                        {type.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="flex flex-wrap gap-4">
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level.value })}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.urgency === level.value
                      ? level.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Current Location
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Your current location"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <MapPin size={16} className="mr-2" />
                Get Location
              </button>
            </div>
          </div>

          {/* Estimated Delay (for delay issues) */}
          {formData.issue_type === 'delay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Estimated Delay (minutes)
              </label>
              <input
                type="number"
                name="estimated_delay"
                value={formData.estimated_delay}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Estimated delay in minutes"
                min="1"
              />
            </div>
          )}

          {/* Affected Stops */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affected Stops
            </label>
            <input
              type="text"
              name="affected_stops"
              value={formData.affected_stops}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Which stops are affected? (e.g., #5-8)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Please describe the issue in detail..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={20} className="mr-2" />
            {loading ? 'Reporting Issue...' : 'Report Issue'}
          </button>
        </form>

        {/* Emergency Contact Info */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Emergency Contacts</h3>
          <div className="text-sm text-red-700 space-y-1">
            <p>• Dispatch: (555) 123-4567</p>
            <p>• Supervisor: (555) 123-4568</p>
            <p>• Maintenance: (555) 123-4569</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssues;