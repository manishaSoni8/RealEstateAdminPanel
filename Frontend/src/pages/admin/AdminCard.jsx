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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-purple-800">Admin Management</h2>
        <Link 
          to="/admin/create" 
          className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Admin
        </Link>
      </div>
      
      <div className="mb-8 bg-purple-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-purple-900">Available Admins</h3>
        <p className="text-purple-700">Total Admins: {admins.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-800 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading admins...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-7xl mb-6">👥</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Admins Available</h3>
          <p className="text-gray-600 mb-6 text-lg">Get started by creating your first admin</p>
          <Link 
            to="/admin/create"
            className="inline-flex items-center gap-2 bg-purple-800 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create First Admin
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div key={admin._id} className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-300 group">
              <div className="flex items-center space-x-4">
                <img 
                  src={admin.user_image || `https://ui-avatars.com/api/?name=${admin.First_Name}+${admin.Last_Name}&background=8B5CF6&color=fff`}
                  alt={`${admin.First_Name} ${admin.Last_Name}`}
                  className="w-16 h-16 shrink-0 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-colors duration-300"
                />
                <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-purple-800 transition-colors duration-300 truncate">
                    {admin.First_Name} {admin.Last_Name}
                  </h4>
                  <p className="text-sm text-gray-600 truncate" title={admin.Email}>
                    {admin.Email}
                  </p>
                  <p className="text-sm text-gray-500 truncate" title={admin.Phone}>
                    {admin.Phone}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
                <button className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300">
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
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