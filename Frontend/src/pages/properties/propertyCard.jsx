import React, { useState } from 'react';
import PropertyList from './PropertyList';
import Pagination from '../../components/Pagination';

const PropertyCard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex space-x-4">
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
        <div className="w-full">
          <input
            type="text"
            placeholder="Search properties by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          />
        </div>
      </div>
      <PropertyList 
        status={activeTab} 
        searchTerm={search}
        currentPage={currentPage}
        propertiesPerPage={propertiesPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PropertyCard;