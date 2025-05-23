import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Auther: '',
    Title: '',
    Description: '',
    Img: null
  });
  const [currentImg, setCurrentImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/blogs/${id}`);
      const data = await response.json();
      setFormData({
        Auther: data.blog.Auther,
        Title: data.blog.Title,
        Description: data.blog.Description,
      });
      setCurrentImg(data.blog.Img);
      setLoading(false);
    } catch (error) {
      setErrors({ submit: 'Failed to fetch blog data' });
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Auther.trim()) newErrors.Auther = 'Author name is required';
    if (!formData.Title.trim()) newErrors.Title = 'Title is required';
    if (!formData.Description.trim()) newErrors.Description = 'Description is required';
    
    if (formData.Img) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(formData.Img.type)) {
        newErrors.Img = 'Only JPG, PNG and GIF images are allowed';
      } else if (formData.Img.size > 5000000) {
        newErrors.Img = 'Image size should not exceed 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      Img: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/blogs/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Failed to update blog');
        }

        navigate(`/blogs/${id}`);
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Edit Blog</h2>
      {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Author *</label>
          <input
            type="text"
            name="Auther"
            value={formData.Auther}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          {errors.Auther && (
            <p className="text-red-500 text-sm mt-1">{errors.Auther}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          {errors.Title && (
            <p className="text-red-500 text-sm mt-1">{errors.Title}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Description *</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          {errors.Description && (
            <p className="text-red-500 text-sm mt-1">{errors.Description}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Current Image</label>
          <img
            src={`${import.meta.env.VITE_BASE_URL}/uploads/${currentImg}`}
            alt="Current blog image"
            className="w-32 h-32 object-cover mb-2"
          />
          <input
            type="file"
            name="Img"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*"
          />
          {errors.Img && (
            <p className="text-red-500 text-sm mt-1">{errors.Img}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300"
        >
          {loading ? 'Updating...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;