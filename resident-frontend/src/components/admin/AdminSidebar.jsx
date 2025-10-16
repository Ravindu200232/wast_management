// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Shield
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/inventory', icon: Package, label: 'Waste Inventory' },
    { path: '/admin/requests', icon: ShoppingCart, label: 'Factory Requests' },
    { path: '/admin/vehicles', icon: Truck, label: 'Vehicle Fleet' },
    { path: '/admin/routes', icon: MapPin, label: 'Route Management' },
    { path: '/admin/coupons', icon: Gift, label: 'Coupon System' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'System Settings' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Shield size={32} className="text-gray-300" />
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-gray-300 text-sm">Waste Management Authority</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-900 border-r-4 border-blue-400' : ''
              }`
            }
          >
            <item.icon size={20} className="mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;