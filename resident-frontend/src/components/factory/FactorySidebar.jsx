// src/components/factory/FactorySidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Truck, 
  History, 
  BarChart3,
  Factory
} from 'lucide-react';

const FactorySidebar = () => {
  const menuItems = [
    { path: '/factory', icon: Home, label: 'Dashboard' },
    { path: '/factory/inventory', icon: Package, label: 'Browse Inventory' },
    { path: '/factory/requests', icon: ShoppingCart, label: 'My Requests' },
    { path: '/factory/orders', icon: Truck, label: 'Order Tracking' },
    { path: '/factory/history', icon: History, label: 'Order History' },
    { path: '/factory/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="bg-blue-800 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Factory size={32} className="text-blue-300" />
          <div>
            <h1 className="text-xl font-bold">EcoWaste Factory</h1>
            <p className="text-blue-200 text-sm">Industrial Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-blue-100 hover:bg-blue-700 transition-colors ${
                isActive ? 'bg-blue-900 border-r-4 border-blue-400' : ''
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

export default FactorySidebar;