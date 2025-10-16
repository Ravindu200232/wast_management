// src/components/factory/FactoryLayout.jsx
import React from 'react';
import FactorySidebar from './FactorySidebar';
import FactoryHeader from './FactoryHeader';

const FactoryLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <FactorySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FactoryHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FactoryLayout;