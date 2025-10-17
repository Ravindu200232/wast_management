// src/components/driver/ReportIssues.jsx
import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Truck, Send, Navigation, Phone, User, Shield } from 'lucide-react';
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
    { value: 'delay', label: 'Route Delay', icon: Clock, color: 'from-amber-500 to-orange-500' },
    { value: 'vehicle', label: 'Vehicle Issue', icon: Truck, color: 'from-red-500 to-rose-500' },
    { value: 'access', label: 'Access Problem', icon: MapPin, color: 'from-purple-500 to-pink-500' },
    { value: 'waste', label: 'Waste Issue', icon: AlertTriangle, color: 'from-lime-500 to-green-500' },
    { value: 'other', label: 'Other Issue', icon: AlertTriangle, color: 'from-gray-500 to-blue-gray-600' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'from-green-500 to-emerald-600', bg: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'from-amber-500 to-yellow-600', bg: 'bg-amber-100 text-amber-800' },
    { value: 'high', label: 'High', color: 'from-orange-500 to-red-500', bg: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'from-red-600 to-rose-700', bg: 'bg-red-100 text-red-800' }
  ];

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl shadow-xl p-8 text-center border border-emerald-200">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Send size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Issue Reported!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your issue has been reported to the management team. They will contact you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold w-full"
          >
            Report Another Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl shadow-xl p-6 mb-8 text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
            <AlertTriangle size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">Report Issue</h1>
            <p className="text-red-100 opacity-90">Report delays, problems, or incidents during your route</p>
          </div>
          <div className="hidden sm:block bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
            <p className="font-semibold">24/7 Support</p>
            <p className="text-red-100 text-sm">Available</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type Selection */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="text-red-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Issue Type</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.value}
                        onClick={() => setFormData({ ...formData, issue_type: type.value })}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                          formData.issue_type === type.value
                            ? `border-red-500 bg-gradient-to-r ${type.color} text-white shadow-lg`
                            : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent 
                            size={20} 
                            className={formData.issue_type === type.value ? 'text-white' : 'text-gray-600'} 
                          />
                          <span className={`font-medium ${
                            formData.issue_type === type.value ? 'text-white' : 'text-gray-700'
                          }`}>
                            {type.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Urgency Level */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-center mb-4">
                  <Shield className="text-amber-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Urgency Level</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: level.value })}
                      className={`py-3 rounded-xl transition-all duration-200 transform hover:scale-105 font-semibold ${
                        formData.urgency === level.value
                          ? `bg-gradient-to-r ${level.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-4">
                  <Navigation className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Current Location</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Your current location"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center"
                  >
                    <MapPin size={20} className="mr-2" />
                    Get Location
                  </button>
                </div>
              </div>

              {/* Estimated Delay (for delay issues) */}
              {formData.issue_type === 'delay' && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
                  <div className="flex items-center mb-4">
                    <Clock className="text-amber-600 mr-3" size={24} />
                    <h3 className="text-lg font-semibold text-gray-800">Estimated Delay</h3>
                  </div>
                  <input
                    type="number"
                    name="estimated_delay"
                    value={formData.estimated_delay}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="Estimated delay in minutes"
                    min="1"
                  />
                  <p className="text-amber-600 text-sm mt-2 font-medium">
                    This helps dispatch plan alternative routes
                  </p>
                </div>
              )}

              {/* Affected Stops */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <MapPin className="text-purple-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Affected Stops</h3>
                </div>
                <input
                  type="text"
                  name="affected_stops"
                  value={formData.affected_stops}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="Which stops are affected? (e.g., #5-8)"
                />
              </div>

              {/* Description */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="text-gray-600 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Issue Description</h3>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 resize-none"
                  placeholder="Please describe the issue in detail..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-6 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Reporting Issue...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send size={20} className="mr-2" />
                    Report Issue
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Emergency Contacts & Info */}
        <div className="space-y-6">
          {/* Emergency Contacts */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl shadow-lg p-6 border border-red-100">
            <h3 className="font-bold text-red-800 mb-4 flex items-center">
              <Phone className="mr-2" size={20} />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {[
                { name: "Dispatch", number: "(555) 123-4567", type: "primary" },
                { name: "Supervisor", number: "(555) 123-4568", type: "secondary" },
                { name: "Maintenance", number: "(555) 123-4569", type: "secondary" },
                { name: "Emergency", number: "(555) 911-HELP", type: "emergency" }
              ].map((contact, index) => (
                <div key={index} className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  contact.type === 'emergency' 
                    ? 'bg-red-100 border-red-300 hover:bg-red-200' 
                    : 'bg-white border-red-200/50'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`font-semibold ${
                        contact.type === 'emergency' ? 'text-red-800' : 'text-red-700'
                      }`}>
                        {contact.name}
                      </p>
                      <p className={`text-sm ${
                        contact.type === 'emergency' ? 'text-red-600 font-bold' : 'text-red-600'
                      }`}>
                        {contact.number}
                      </p>
                    </div>
                    {contact.type === 'emergency' && (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Phone size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Response Info */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-lg p-6 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Response Times
            </h3>
            <div className="space-y-4">
              {[
                { level: "Critical", time: "< 15 mins", color: "bg-red-500" },
                { level: "High", time: "< 30 mins", color: "bg-orange-500" },
                { level: "Medium", time: "< 2 hours", color: "bg-amber-500" },
                { level: "Low", time: "< 4 hours", color: "bg-green-500" }
              ].map((response, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-blue-200/50">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${response.color} mr-3`}></div>
                    <span className="text-blue-700 text-sm font-medium">{response.level}</span>
                  </div>
                  <span className="font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded-lg text-sm">
                    {response.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-lg p-6 border border-emerald-100">
            <h3 className="font-bold text-emerald-800 mb-4 flex items-center">
              <Shield className="mr-2" size={20} />
              Safety First
            </h3>
            <div className="space-y-3">
              {[
                "Ensure vehicle is in safe location",
                "Use hazard lights when stopped",
                "Wear safety vest when outside vehicle",
                "Keep emergency kit accessible",
                "Report immediately if unsafe"
              ].map((tip, index) => (
                <div key={index} className="flex items-start p-3 bg-white/50 rounded-xl border border-emerald-200/50">
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-emerald-700 text-sm font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssues;