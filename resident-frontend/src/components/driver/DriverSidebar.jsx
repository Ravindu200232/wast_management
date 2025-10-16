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
  User
} from 'lucide-react';

const DriverSidebar = () => {
  const menuItems = [
    { path: '/driver', icon: Home, label: 'Dashboard' },
    { path: '/driver/routes', icon: MapPin, label: 'My Routes' },
    { path: '/driver/today', icon: Truck, label: "Today's Schedule" },
    { path: '/driver/collections', icon: Package, label: 'Record Collection' },
    { path: '/driver/issues', icon: AlertTriangle, label: 'Report Issues' },
    { path: '/driver/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="bg-orange-800 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Truck size={32} className="text-orange-300" />
          <div>
            <h1 className="text-xl font-bold">Driver Portal</h1>
            <p className="text-orange-200 text-sm">Collection Team</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-orange-100 hover:bg-orange-700 transition-colors ${
                isActive ? 'bg-orange-900 border-r-4 border-orange-400' : ''
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

export default DriverSidebar;