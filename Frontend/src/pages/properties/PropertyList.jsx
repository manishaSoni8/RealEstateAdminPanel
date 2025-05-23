import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultPropertyImage from '../../assets/default-property';
import Pagination from '../../components/Pagination';

const PropertyList = ({ status, searchTerm, currentPage, propertiesPerPage, onPageChange }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [status]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/properties/${status}`);
      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const keyword = searchTerm.toLowerCase();
    const filtered = properties.filter(
      (property) => property.name.toLowerCase().includes(keyword)
    );
    setFilteredProperties(filtered);
    onPageChange(1); // Reset to first page when searching
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <Link
            to={`/properties/${property._id}`}
            key={property._id}
            className="block hover:shadow-xl transition-all duration-300"
          >
            <div className="border rounded-lg overflow-hidden hover:border-purple-300 transition-all duration-300 group">
              <img
                src={property.image ? `${import.meta.env.VITE_BASE_URL}/uploads/${property.image}` : defaultPropertyImage}
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
                <p className="text-purple-800 font-bold">
                  Created By: {property.userId ? `${property.userId.First_Name} ${property.userId.Last_Name}` : 'Manisha Soni'}</p>
                <div className="mt-2 text-gray-600">
                  <p>{property.beds} beds • {property.baths} baths</p>
                  <p>{property.area} sq ft</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProperties.length > propertiesPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default PropertyList;