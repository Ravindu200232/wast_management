// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  MapPin, 
  BarChart3, 
  Gift,
  Settings,
  Shield,
  X
} from 'lucide-react';

const AdminSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const location = useLocation();
  
  // Safe menu items configuration
  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/admin/users', icon: Users, label: 'User Management', color: 'from-emerald-500 to-green-500' },
    { path: '/admin/inventory', icon: Package, label: 'Waste Inventory', color: 'from-amber-500 to-orange-500' },
    { path: '/admin/requests', icon: ShoppingCart, label: 'Factory Requests', color: 'from-purple-500 to-pink-500' },
    { path: '/admin/vehicles', icon: Truck, label: 'Vehicle Fleet', color: 'from-red-500 to-rose-500' },
    { path: '/admin/routes', icon: MapPin, label: 'Route Management', color: 'from-indigo-500 to-blue-500' },
    { path: '/admin/coupons', icon: Gift, label: 'Coupon System', color: 'from-pink-500 to-rose-500' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics', color: 'from-teal-500 to-cyan-500' },
    { path: '/admin/settings', icon: Settings, label: 'System Settings', color: 'from-gray-500 to-gray-600' },
  ];

  // Safe active check
  const isActive = (path) => {
    try {
      return location.pathname === path || location.pathname.startsWith(path + '/');
    } catch (error) {
      console.error('Error checking active path:', error);
      return false;
    }
  };

  const handleNavClick = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  // Safe icon rendering
  const renderIcon = (IconComponent, isActive) => {
    try {
      return <IconComponent size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />;
    } catch (error) {
      console.error('Error rendering icon:', error);
      return <Settings size={20} className={isActive ? 'text-white' : 'text-gray-400'} />;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleNavClick}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white w-80 h-full flex flex-col shadow-xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Admin Panel</h1>
                  <p className="text-gray-300 text-sm">Smart Waste System</p>
                </div>
              </div>
              <button 
                onClick={handleNavClick}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 mt-6 px-4 space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const IconComponent = item.icon || Settings; // Fallback icon
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`
                    group flex items-center px-4 py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                    ${active 
                      ? `bg-white text-gray-900 shadow-lg scale-105 bg-gradient-to-r ${item.color} text-white` 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl mr-4 transition-all ${
                    active ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-600'
                  }`}>
                    {renderIcon(IconComponent, active)}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={20} className="text-white" />
              </div>
              <p className="text-gray-300 text-sm font-medium">Admin Access</p>
              <p className="text-gray-400 text-xs mt-1">Secure Control Panel</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;