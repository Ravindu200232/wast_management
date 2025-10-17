// src/components/driver/DriverHeader.jsx
import React from 'react';
import { Bell, User, Truck, Navigation, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DriverHeader = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg">
      <div className="px-4 py-3 sm:px-6">
        {/* Mobile First Design */}
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-white hover:bg-orange-600 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Logo and Title - Centered on mobile */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Welcome, {user?.full_name}!
            </h1>
            <p className="text-orange-100 text-sm">Collection Team Dashboard</p>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
              <Navigation className="text-white" size={20} />
              <span className="text-white text-sm font-medium">GPS: Active</span>
            </div>
            
            <button className="p-2 text-white hover:text-orange-100 relative transition-colors">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-orange-500"></span>
            </button>
            
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Truck size={20} className="text-orange-600" />
              </div>
              <span className="text-white font-medium">{user?.full_name}</span>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <button className="p-2 text-white relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>
            
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User size={16} className="text-orange-600" />
            </div>
          </div>
        </div>

        {/* Mobile GPS Status */}
        <div className="lg:hidden mt-3 flex justify-center">
          <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
            <Navigation className="text-white" size={16} />
            <span className="text-white text-sm font-medium">GPS: Active</span>
          </div>
        </div>

        {/* Mobile Logout Button */}
        <div className="lg:hidden mt-3 flex justify-center">
          <button
            onClick={logout}
            className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DriverHeader;