// src/components/admin/AdminHeader.jsx
import React from 'react';
import { Bell, User, Shield, Menu, Activity, Cpu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = ({ onMenuToggle = () => {} }) => {
  const { user, logout } = useAuth();

  const handleMenuToggle = () => {
    if (onMenuToggle && typeof onMenuToggle === 'function') {
      onMenuToggle();
    }
  };

  const handleLogout = () => {
    if (logout && typeof logout === 'function') {
      logout();
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl">
      <div className="px-4 py-3 sm:px-6">
        {/* Mobile First Design */}
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            onClick={handleMenuToggle}
            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Title and Status - Centered on mobile */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center justify-center lg:justify-start space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <Activity size={14} className="text-green-400" />
                <span className="text-gray-300 text-sm">System Online</span>
              </div>
              <span className="text-gray-500 hidden sm:inline">•</span>
              <div className="flex items-center space-x-1 sm:flex hidden">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-gray-300 text-sm">All Services Active</span>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">All Systems Normal</span>
            </div>
            
            {/* Notifications */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-colors relative">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-gray-800"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div className="text-right">
                <span className="text-white font-medium block">{user?.full_name || 'Admin'}</span>
                <span className="text-gray-300 text-xs">Administrator</span>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              Logout
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <button className="p-2 text-gray-300 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Mobile System Status */}
        <div className="lg:hidden mt-3 flex justify-center">
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Systems Normal</span>
          </div>
        </div>

        {/* Mobile Logout Button */}
        <div className="lg:hidden mt-3 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;