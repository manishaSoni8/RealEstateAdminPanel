import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SingleProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3005/properties/detail/${id}`);
      const data = await response.json();
      setProperty(data);
      setSelectedImage(data.image); // Set main image as selected image
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!property) return <div className="text-center py-8">Property not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{property.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Main Image Display */}
          <div className="mb-4">
            <img 
              src={`http://localhost:3005/uploads/${selectedImage || property.image}`} 
              alt={property.name} 
              className="w-full h-96 object-cover rounded-lg shadow-lg" 
              onError={(e) => {
                e.target.src = '/default-property.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
          
          {/* Additional Images Gallery */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Gallery</h3>
            <div className="grid grid-cols-4 gap-2">
              {/* Main property image thumbnail */}
              <img 
                src={`http://localhost:3005/uploads/${property.image}`} 
                alt={property.name}
                className={`w-full h-20 object-cover rounded cursor-pointer ${selectedImage === property.image ? 'ring-2 ring-purple-600' : ''}`}
                onClick={() => setSelectedImage(property.image)}
                onError={(e) => {
                  e.target.src = '/default-property.jpg';
                  e.target.onerror = null;
                }}
              />
              {/* Additional images thumbnails */}
              {property.additionalImages && property.additionalImages.map((img, index) => (
                <img 
                  key={index} 
                  src={`http://localhost:3005/uploads/${img.image}`} 
                  alt={`View ${index + 1} of ${property.name}`} 
                  className={`w-full h-20 object-cover rounded cursor-pointer ${selectedImage === img.image ? 'ring-2 ring-purple-600' : ''}`}
                  onClick={() => setSelectedImage(img.image)}
                  onError={(e) => {
                    e.target.src = '/default-property.jpg';
                    e.target.onerror = null;
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <p className="text-3xl font-bold text-purple-800">${property.price.toLocaleString()}</p>
            <p className="text-gray-600 mt-2">Contact: {property.phone}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow">
            <div>
              <p className="font-semibold">Beds</p>
              <p>{property.beds}</p>
            </div>
            <div>
              <p className="font-semibold">Baths</p>
              <p>{property.baths}</p>
            </div>
            <div>
              <p className="font-semibold">Area</p>
              <p>{property.area} sq ft</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p className="capitalize">{property.saleStatus}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-3">Property Details</h3>
            <div className="space-y-2">
              <p><span className="font-semibold">Category:</span> {property.categoryId?.name}</p>
              <p><span className="font-semibold">State:</span> {property.stateId?.name}</p>
              <p><span className="font-semibold">City:</span> {property.cityId?.name}</p>
              <p><span className="font-semibold">Status:</span> {property.statusId?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProperty;