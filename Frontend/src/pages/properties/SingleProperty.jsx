import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import defaultPropertyImage from '../../assets/default-property';

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
      const response = await fetch(`https://realestateadminpanel-2.onrender.com/properties/detail/${id}`);
      const data = await response.json();
      setProperty(data);
      setSelectedImage(data.image);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!property) return <div className="text-center py-8">Property not found</div>;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultPropertyImage;
    return `https://realestateadminpanel-2.onrender.com/uploads/${imagePath}`;
  };

  const getVideoUrl = (videoPath) => {
    if (!videoPath) return null;
    return `https://realestateadminpanel-2.onrender.com/uploads/${videoPath}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{property.name}</h1>
      
      {/* Main top grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div>
          <div className="mb-4 relative">
            <img 
              src={getImageUrl(selectedImage || property.image)} 
              alt={property.name} 
              className="w-full h-96 object-cover rounded-lg shadow-lg" 
              onError={(e) => {
                e.target.src = defaultPropertyImage;
                e.target.onerror = null;
              }}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Gallery</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* Main image thumbnail */}
              <div 
                className={`relative rounded overflow-hidden cursor-pointer ${
                  selectedImage === property.image ? 'ring-2 ring-purple-600' : ''
                }`}
                onClick={() => setSelectedImage(property.image)}
              >
                <img 
                  src={getImageUrl(property.image)} 
                  alt={property.name}
                  className="w-full h-24 object-cover hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.src = defaultPropertyImage;
                    e.target.onerror = null;
                  }}
                />
              </div>

              {/* Additional images thumbnails */}
              {property.additionalImages?.slice(0, 2).map((img, index) => (
                <div 
                  key={index}
                  className={`relative rounded overflow-hidden cursor-pointer ${
                    selectedImage === img.image ? 'ring-2 ring-purple-600' : ''
                  }`}
                  onClick={() => setSelectedImage(img.image)}
                >
                  <img 
                    src={getImageUrl(img.image)} 
                    alt={`View ${index + 1} of ${property.name}`} 
                    className="w-full h-24 object-cover hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      e.target.src = defaultPropertyImage;
                      e.target.onerror = null;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Main details */}
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

      {/* Features & Videos below the main grid on mobile and desktop */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Features</h3>
          {property.features && property.features.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {property.features.map((feature) => (
                <li key={feature._id}>{feature.name || feature.featureId?.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No features available.</p>
          )}
        </div>

        {/* Videos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Videos</h3>
          {property.videos && property.videos.length > 0 ? (
            <div className="space-y-4">
              {property.videos.map((video, index) => (
                <video
                  key={index}
                  controls
                  className="w-full max-h-64 rounded-lg shadow"
                  src={getVideoUrl(video.video || video.filename)}
                >
                  Sorry, your browser does not support embedded videos.
                </video>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No videos available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProperty;
