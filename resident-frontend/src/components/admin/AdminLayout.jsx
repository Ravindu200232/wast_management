// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50/60 to-blue-gray-50/60">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;