// src/components/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, LogIn, Recycle, Shield, Truck, Factory, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect based on user role
      let redirectPath = '/';
      switch (result.userData.role) {
        case 'factory':
          redirectPath = '/factory';
          break;
        case 'admin':
          redirectPath = '/admin';
          break;
        case 'driver':
          redirectPath = '/driver';
          break;
        default:
          redirectPath = from;
      }
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  // Quick login for demo accounts
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const demoAccounts = [
    { email: 'resident@ecowaste.com', password: 'password', role: 'Resident', icon: User, color: 'from-emerald-500 to-green-500' },
    { email: 'driver@ecowaste.com', password: 'password', role: 'Driver', icon: Truck, color: 'from-blue-500 to-cyan-500' },
    { email: 'factory@ecowaste.com', password: 'password', role: 'Factory', icon: Factory, color: 'from-amber-500 to-orange-500' },
    { email: 'admin@ecowaste.com', password: 'password', role: 'Admin', icon: Shield, color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Recycle className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your EcoWaste account</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-4 text-sm">
            {error}
          </div>
        )}

        {location.state?.message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl mb-4 text-sm">
            {location.state.message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-2xl hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 font-medium text-sm shadow-lg shadow-emerald-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn size={18} className="mr-2" />
                Sign In
              </div>
            )}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-6">
          <div className="text-center mb-4">
            <p className="text-gray-500 text-sm font-medium">Quick Demo Access</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => handleQuickLogin(account.email, account.password)}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-3 text-left active:scale-95 transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${account.color} rounded-lg flex items-center justify-center`}>
                    <account.icon size={16} className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{account.role}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-500 hover:text-emerald-600 font-medium">
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              Secure login with EcoWaste Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;