// src/components/factory/FactorySidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Truck, 
  History, 
  BarChart3,
  Factory,
  X,
  ChevronLeft
} from 'lucide-react';

const FactorySidebar = ({ onClose, isMobile, collapsed }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/factory', icon: Home, label: 'Dashboard', color: 'text-blue-400' },
    { path: '/factory/inventory', icon: Package, label: 'Browse Inventory', color: 'text-cyan-400' },
    { path: '/factory/requests', icon: ShoppingCart, label: 'My Requests', color: 'text-emerald-400' },
    { path: '/factory/orders', icon: Truck, label: 'Order Tracking', color: 'text-amber-400' },
    { path: '/factory/history', icon: History, label: 'Order History', color: 'text-purple-400' },
    { path: '/factory/analytics', icon: BarChart3, label: 'Analytics', color: 'text-pink-400' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleItemClick = () => {
    // Close sidebar on mobile when item is clicked
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full overflow-y-auto flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Factory size={24} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">EcoWaste Factory</h1>
              <p className="text-gray-400 text-xs">Industrial Portal</p>
            </div>
          )}
        </div>
        
        {/* Close/Collapse Button */}
        {!isMobile && (
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white active:scale-95 transition-transform"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      {/* Navigation Menu */}
      <nav className="mt-4 px-2 flex-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleItemClick}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-3 mb-1 rounded-xl transition-all duration-200 group ${
                  active 
                    ? 'bg-gray-800/80 shadow-lg border border-gray-700/50' 
                    : 'hover:bg-gray-800/50 hover:shadow-md'
                }`
              }
              end
              title={collapsed ? item.label : ''}
            >
              <div className={`flex items-center justify-center ${collapsed ? 'w-10 h-10' : 'w-9 h-9'} rounded-xl group-hover:scale-110 transition-transform ${
                active 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg' 
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
              {!collapsed && (
                <span className={`font-medium text-sm ml-3 ${
                  active ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - Hidden when collapsed */}
      {!collapsed && (
        <div className="p-4">
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Package size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Industrial Grade</p>
                <p className="text-gray-400 text-xs">Waste Materials</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactorySidebar;