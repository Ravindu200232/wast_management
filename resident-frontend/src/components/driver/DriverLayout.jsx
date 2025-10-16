// src/components/driver/DriverLayout.jsx
import React from 'react';
import DriverSidebar from './DriverSidebar';
import DriverHeader from './DriverHeader';

const DriverLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DriverSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DriverHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;