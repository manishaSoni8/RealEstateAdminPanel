import React from 'react';
import PropertyCard from './propertyCard';

const Property = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Properties Management</h1>
      <PropertyCard />
    </div>
  );
};

export default Property;