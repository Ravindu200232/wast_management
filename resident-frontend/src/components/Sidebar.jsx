// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Truck, 
  Gift, 
  History, 
  MessageSquare, 
  User 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/track-vehicle', icon: MapPin, label: 'Track Vehicle' },
    { path: '/extra-pickup', icon: Truck, label: 'Extra Pickup' },
    { path: '/my-coupons', icon: Gift, label: 'My Coupons' },
    { path: '/collection-history', icon: History, label: 'Collection History' },
    { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-green-800 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">EcoWaste</h1>
        <p className="text-green-200 text-sm">Smart Management</p>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-green-100 hover:bg-green-700 transition-colors ${
                isActive ? 'bg-green-900 border-r-4 border-green-400' : ''
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

export default Sidebar;