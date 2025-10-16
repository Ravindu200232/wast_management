// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, Home, Building2, User, Truck, ArrowLeft, Recycle, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    full_name: '',
    phone: '',
    address: '',
    house_number: '',
    street: '',
    area: '',
    city: '',
    postal_code: '',
    // Factory-specific fields
    company_name: '',
    registration_number: '',
    business_address: '',
    contact_person: '',
    // Driver-specific fields
    license_number: '',
    vehicle_type: '',
    experience_years: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate factory-specific fields if role is factory
    if (formData.role === 'factory') {
      if (!formData.company_name || !formData.registration_number || !formData.business_address) {
        setError('Please fill all required company information');
        setLoading(false);
        return;
      }
    }

    // Validate driver-specific fields if role is driver
    if (formData.role === 'driver') {
      if (!formData.license_number || !formData.vehicle_type) {
        setError('Please fill all required driver information');
        setLoading(false);
        return;
      }
    }

    const result = await register(formData);
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const roles = [
    { value: 'resident', label: 'Resident', icon: User, description: 'Home waste management', color: 'from-emerald-500 to-green-500' },
    { value: 'factory', label: 'Recycling Factory', icon: Building2, description: 'Industrial waste procurement', color: 'from-blue-500 to-cyan-500' },
    { value: 'driver', label: 'Collection Driver', icon: Truck, description: 'Waste collection operations', color: 'from-amber-500 to-orange-500' }
  ];

  const vehicleTypes = [
    'Compact Truck',
    'Medium Truck',
    'Large Truck',
    'Recycling Vehicle',
    'Waste Compactor',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="text-center flex-1">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <UserPlus className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 text-sm mt-1">Join our smart waste management community</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Account Type *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <div
                    key={role.value}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition-all active:scale-95 ${
                      formData.role === role.value
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        formData.role === role.value 
                          ? `bg-gradient-to-r ${role.color}` 
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent 
                          size={20} 
                          className={formData.role === role.value ? 'text-white' : 'text-gray-600'} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${
                          formData.role === role.value ? 'text-emerald-700' : 'text-gray-800'
                        }`}>
                          {role.label}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">{role.description}</p>
                      </div>
                      {formData.role === role.value && (
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Factory-specific Information */}
          {formData.role === 'factory' && (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <Building2 size={16} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Company Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Business registration number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <textarea
                      name="business_address"
                      value={formData.business_address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm resize-none"
                      placeholder="Enter complete business address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Primary contact person"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Driver-specific Information */}
          {formData.role === 'driver' && (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Truck size={16} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Driver Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver License Number *
                    </label>
                    <input
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Enter license number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      name="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm"
                      required
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      min="0"
                      max="50"
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Years of experience"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Information (for residents) */}
          {formData.role === 'resident' && (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                  <Home size={16} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">Address Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      House Number
                    </label>
                    <input
                      type="text"
                      name="house_number"
                      value={formData.house_number}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="House No."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Street name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Area/Locality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                      placeholder="Postal Code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Shield size={16} className="text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-700">Security</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-medium text-sm shadow-lg shadow-emerald-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 hover:text-emerald-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              Secure registration with EcoWaste Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;