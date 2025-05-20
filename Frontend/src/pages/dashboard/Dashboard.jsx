import React, { useState, useEffect } from 'react';
import PropertyStateChart from '../../components/charts/PropertyStateChart';

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
      const propertiesRes = await fetch('http://localhost:3005/dashboard/stats/total');
      const propertiesData = await propertiesRes.json();
      setTotalProperties(propertiesData.total);

      // Fetch state-wise properties
      const stateRes = await fetch('http://localhost:3005/dashboard/stats/by-state');
      const stateData = await stateRes.json();
      setStateData(stateData);

      // Fetch top 5 sold properties
      const topRes = await fetch('http://localhost:3005/dashboard/stats/top-sold');
      const topData = await topRes.json();
      setTopProperties(topData);

      // Fetch total sales
      const salesRes = await fetch('http://localhost:3005/dashboard/stats/total-sales');
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
        <PropertyStateChart data={stateData} />
      </div>

      {/* Top 5 Properties List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Top 5 Properties Sold Last Month</h3>
        <div className="space-y-4">
          {topProperties.map((property) => (
            <div key={property._id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">{property.name}</h4>
                  <p className="text-gray-600">{property.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-800">
                    ${property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sold on {new Date(property.soldDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;