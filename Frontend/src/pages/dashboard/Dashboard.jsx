import React, { useState, useEffect } from 'react';
import PropertyStateChart from '../../components/charts/PropertyStateChart';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [totalProperties, setTotalProperties] = useState(0);
  const [stateData, setStateData] = useState([]);
  const [topProperties, setTopProperties] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total properties
      const propertiesRes = await fetch('https://realestateadminpanel-2.onrender.com/dashboard/stats/total');
      const propertiesData = await propertiesRes.json();
      setTotalProperties(propertiesData.total);

      // Fetch state-wise properties
      const stateRes = await fetch('https://realestateadminpanel-2.onrender.com/dashboard/stats/by-state');
      const stateData = await stateRes.json();
      setStateData(stateData);

      // Fetch top 5 sold properties
      const topRes = await fetch('https://realestateadminpanel-2.onrender.com/dashboard/stats/top-sold');
      const topData = await topRes.json();
      setTopProperties(topData);

      // Fetch total sales
      const salesRes = await fetch('https://realestateadminpanel-2.onrender.com/dashboard/stats/total-sales');
      const salesData = await salesRes.json();
      setTotalSales(salesData.total);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Total Properties</h3>
          <p className="text-4xl font-bold">{totalProperties}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Total Sales</h3>
          <p className="text-4xl font-bold">${totalSales.toLocaleString()}</p>
        </div>
      </div>

      {/* State-wise Properties Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Properties by State Distribution</h2>
        <div className="w-full h-[400px]">
          <PropertyStateChart data={stateData} />
        </div>
      </div>

      {/* Top 5 Properties List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Recently Sold Properties</h3>
        {topProperties.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No sold properties found</p>
        ) : (
          <div className="space-y-4">
            {topProperties.map((property) => (
              <Link
                to={`/properties/${property._id}`}
                key={property._id}
                className="block hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img
                      src={property.image ? `https://realestateadminpanel-2.onrender.com/uploads/${property.image}` : '/default-property.jpg'}
                      alt={property.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/default-property.jpg';
                      }}
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{property.name}</h4>
                      <p className="text-gray-600">
                        {property.cityId?.name || 'N/A'}, {property.stateId?.name || 'N/A'}
                      </p>
                      {property.description && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {property.description}
                        </p>
                      )}
                      <div className="mt-2 flex gap-4 text-sm text-gray-600">
                        <span>{property.categoryId?.name || 'N/A'}</span>
                        <span>•</span>
                        <span>{property.beds} Beds</span>
                        <span>•</span>
                        <span>{property.baths} Baths</span>
                        <span>•</span>
                        <span>{property.area} m2</span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {property.saleStatus}
                        </span>
                      </div>

                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-purple-800">
                      ${Number(property.price).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Contact: {property.phone}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;