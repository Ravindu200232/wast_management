// src/components/factory/FactoryHeader.jsx
import React from 'react';
import { Bell, User, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FactoryHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.company_name || user?.full_name}!
          </h1>
          <p className="text-gray-600">Recycling Factory Management Portal</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <span className="text-gray-700">{user?.company_name || user?.full_name}</span>
          </div>
          
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default FactoryHeader;