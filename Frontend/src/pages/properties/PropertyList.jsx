import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultPropertyImage from '../../assets/default-property'; // We'll create this

const PropertyList = ({ status }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [status]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`http://localhost:3005/properties/${status}`);
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link 
          to={`/properties/${property._id}`} 
          key={property._id}
          className="block hover:shadow-xl transition-all duration-300"
        >
          <div className="border rounded-lg overflow-hidden hover:border-purple-300 transition-all duration-300 group">
            <img 
              src={property.image ? `http://localhost:3005/uploads/${property.image}` : defaultPropertyImage} 
              alt={property.name} 
              className="w-full h-48 object-cover group-hover:opacity-95 transition-all duration-300"
              onError={(e) => {
                e.target.src = defaultPropertyImage;
                e.target.onerror = null;
              }}
                />
            <div className="p-4 group-hover:bg-purple-50 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-800 transition-colors duration-300">{property.name}</h3>
              <p className="text-purple-800 font-bold">${property.price.toLocaleString()}</p>
              <div className="mt-2 text-gray-600">
                <p>{property.beds} beds • {property.baths} baths</p>
                <p>{property.area} sq ft</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PropertyList;