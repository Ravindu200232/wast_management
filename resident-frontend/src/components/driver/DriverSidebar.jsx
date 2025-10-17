// src/components/driver/DriverSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Truck, 
  ClipboardCheck, 
  Package,
  AlertTriangle,
  User,
  X
} from 'lucide-react';

const DriverSidebar = ({ onClose }) => {
  const menuItems = [
    { path: '/driver', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/driver/routes', icon: MapPin, label: 'My Routes', color: 'from-purple-500 to-pink-500' },
    { path: '/driver/today', icon: Truck, label: "Today's Schedule", color: 'from-emerald-500 to-green-500' },
    { path: '/driver/collections', icon: Package, label: 'Record Collection', color: 'from-amber-500 to-orange-500' },
    { path: '/driver/issues', icon: AlertTriangle, label: 'Report Issues', color: 'from-red-500 to-rose-500' },
    { path: '/driver/profile', icon: User, label: 'Profile', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="bg-gradient-to-b from-orange-700 to-amber-800 text-white w-64 h-full flex flex-col shadow-xl">
      {/* Header with close button for mobile */}
      <div className="p-6 border-b border-orange-600/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Truck size={24} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Driver Portal</h1>
              <p className="text-orange-200 text-sm">Smart Waste System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-orange-200 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center px-4 py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                isActive 
                  ? `bg-white text-gray-900 shadow-lg scale-105 ${item.color.replace('from-', 'bg-gradient-to-r from-')} text-white` 
                  : 'text-orange-100 hover:bg-orange-600/50 hover:text-white'
              }`
            }
          >
            <div className={`p-3 rounded-xl mr-4 transition-all ${
              item.path === '/driver' ? 'bg-gradient-to-r ' + item.color : 'bg-white/10 group-hover:bg-white/20'
            }`}>
              <item.icon 
                size={20} 
                className={item.path === '/driver' ? 'text-white' : 'text-orange-300 group-hover:text-white'} 
              />
            </div>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-orange-600/50">
        <div className="text-center text-orange-200 text-sm">
          <p>Smart Waste Management</p>
          <p className="text-xs mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default DriverSidebar;