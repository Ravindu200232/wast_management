// src/components/Header.jsx
import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Menu Button and Welcome */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu Button - Visible only on mobile */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
          >
            <Menu size={20} />
          </button>
          
          <div>
            <h1 className="text-lg font-bold text-white">
              Hello, {user?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-emerald-100 text-xs">Smart Waste Management</p>
          </div>
        </div>
        
        {/* Right Section - Icons */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 text-white/90 hover:text-white active:scale-95 transition-transform">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-emerald-500"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <User size={16} className="text-white" />
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-emerald-400/50 to-teal-500/50"></div>
    </header>
  );
};

export default Header;