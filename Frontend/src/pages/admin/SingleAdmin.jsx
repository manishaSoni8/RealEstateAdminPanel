import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleAdmin = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch(`https://realestateadminpanel-2.onrender.com/admin/${id}`);
      const data = await response.json();
      setAdmin(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin details:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!admin) return <div className="text-center py-8">Admin not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <img 
            src={admin.user_image || `https://ui-avatars.com/api/?name=${admin.First_Name}+${admin.Last_Name}&background=8B5CF6&color=fff`}
            alt={`${admin.First_Name} ${admin.Last_Name}`}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-purple-800">{`${admin.First_Name} ${admin.Last_Name}`}</h1>
            <p className="text-gray-600">{admin.Email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">First Name:</span> {admin.First_Name}</p>
              <p><span className="font-semibold">Last Name:</span> {admin.Last_Name}</p>
              <p><span className="font-semibold">Email:</span> {admin.Email}</p>
              <p><span className="font-semibold">Phone:</span> {admin.Phone}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Role & Permissions</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">Role:</span> {admin.role || 'Administrator'}</p>
              <p><span className="font-semibold">Join Date:</span> {new Date(admin.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold">Last Updated:</span> {new Date(admin.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Activity Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-purple-800">Account Created</h4>
                <p className="text-sm mt-2">
                  {new Date(admin.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-purple-800">Account Type</h4>
                <p className="text-sm mt-2 font-semibold text-purple-600">
                  Super Admin
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-purple-800">Last Active</h4>
                <p className="text-sm mt-2">
                  {new Date(admin.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAdmin;