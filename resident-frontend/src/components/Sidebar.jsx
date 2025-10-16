// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Truck, 
  Gift, 
  History, 
  MessageSquare, 
  User,
  Recycle,
  X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-400' },
    { path: '/track-vehicle', icon: MapPin, label: 'Track Vehicle', color: 'text-emerald-400' },
    { path: '/extra-pickup', icon: Truck, label: 'Extra Pickup', color: 'text-amber-400' },
    { path: '/my-coupons', icon: Gift, label: 'My Coupons', color: 'text-purple-400' },
    { path: '/collection-history', icon: History, label: 'Collection History', color: 'text-cyan-400' },
    { path: '/feedback', icon: MessageSquare, label: 'Feedback', color: 'text-pink-400' },
    { path: '/profile', icon: User, label: 'Profile', color: 'text-gray-400' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleItemClick = () => {
    // Close sidebar on mobile when item is clicked
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 h-full overflow-y-auto flex flex-col">
      {/* Header with Close Button for Mobile */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Recycle size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EcoWaste</h1>
            <p className="text-gray-400 text-xs">Smart Management</p>
          </div>
        </div>
        
        {/* Close Button - Visible only on mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-white active:scale-95 transition-transform"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation Menu */}
      <nav className="mt-6 px-3 flex-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleItemClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-4 mb-1 rounded-2xl transition-all duration-200 group ${
                  active 
                    ? 'bg-gray-800/80 shadow-lg border border-gray-700/50' 
                    : 'hover:bg-gray-800/50 hover:shadow-md'
                }`
              }
              end
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl mr-3 group-hover:scale-110 transition-transform ${
                active 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg' 
                  : 'bg-gray-700/50'
              }`}>
                <item.icon 
                  size={20} 
                  className={
                    active 
                      ? 'text-white' 
                      : `${item.color} group-hover:text-white`
                  } 
                />
              </div>
              <span className={`font-medium text-sm ${
                active ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6">
        <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Gift size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Earn Rewards</p>
              <p className="text-gray-400 text-xs">Recycle & Get Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;