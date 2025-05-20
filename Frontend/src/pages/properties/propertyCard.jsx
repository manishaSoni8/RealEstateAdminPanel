import React, { useState } from 'react';
import PropertyList from './PropertyList';

const PropertyCard = () => {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg ${
            activeTab === 'available'
              ? 'bg-purple-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-purple-100'
          }`}
          onClick={() => setActiveTab('available')}
        >
          Available Properties
        </button>
        <button
          className={`px-6 py-2 rounded-lg ${
            activeTab === 'sold'
              ? 'bg-purple-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-purple-100'
          }`}
          onClick={() => setActiveTab('sold')}
        >
          Sold Properties
        </button>
      </div>
      <PropertyList status={activeTab} />
    </div>
  );
};

export default PropertyCard;