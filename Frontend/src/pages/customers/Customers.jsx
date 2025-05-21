import React from 'react';
import CustomerList from './CustomerList';

const Customers = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Customers Management</h1>
      <CustomerList />
    </div>
  );
};

export default Customers;