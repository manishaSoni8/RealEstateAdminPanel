import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminCard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:3005/admin');
      const data = await response.json();
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800">Admin Management</h2>
        <Link 
          to="/admin/create" 
          className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Create Admin
        </Link>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Available Admins</h3>
        <p className="text-gray-600">Total Admins: {admins.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admins...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Admins Available</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first admin</p>
          <Link 
            to="/admin/create"
            className="inline-block bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create First Admin
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {admins.map((admin) => (
            <div key={admin._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <img 
                  src={admin.user_image || `https://ui-avatars.com/api/?name=${admin.First_Name}+${admin.Last_Name}`}
                  alt={`${admin.First_Name} ${admin.Last_Name}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{admin.First_Name} {admin.Last_Name}</h4>
                  <p className="text-sm text-gray-600">{admin.Email}</p>
                  <p className="text-xs text-gray-500">{admin.Phone}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Public Email:</span>
                  <span>{admin.Public_email || 'Not set'}</span>
                </div>
                <div className="flex gap-2">
                  {admin.Website && (
                    <a href={admin.Website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <i className="fas fa-globe"></i>
                    </a>
                  )}
                  {admin.Facebook && (
                    <a href={admin.Facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <i className="fab fa-facebook"></i>
                    </a>
                  )}
                  {admin.Twitter && (
                    <a href={admin.Twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${admin.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {admin.is_verified ? 'Verified' : 'Pending'}
                  </span>
                  {admin.is_blocked && (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      Blocked
                    </span>
                  )}
                </div>
                <button className="text-purple-600 hover:text-purple-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCard;