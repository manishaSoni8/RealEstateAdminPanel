import React from 'react';
import AdminCard from './AdminCard';

const Admin = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your admin users and permissions</p>
      </div>
      <AdminCard />
    </div>
  );
};

export default Admin;