// src/components/factory/FactoryHeader.jsx
import React from 'react';
import { Bell, Building2, LogOut, Menu, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FactoryHeader = ({ onMenuClick, onSidebarToggle, sidebarCollapsed }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg">
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

          {/* Sidebar Toggle Button - Visible only on desktop */}
          <button 
            onClick={onSidebarToggle}
            className="hidden lg:block p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
          >
            <ChevronRight 
              size={20} 
              className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
          
          <div>
            <h1 className="text-lg font-bold text-white">
              Hello, {user?.company_name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'Factory'}! 👋
            </h1>
            <p className="text-blue-100 text-xs">Recycling Factory Management</p>
          </div>
        </div>
        
        {/* Right Section - Icons */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 text-white/90 hover:text-white active:scale-95 transition-transform">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-500"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Building2 size={16} className="text-white" />
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
      <div className="h-1 bg-gradient-to-r from-blue-400/50 to-cyan-500/50"></div>
    </header>
  );
};

export default FactoryHeader;