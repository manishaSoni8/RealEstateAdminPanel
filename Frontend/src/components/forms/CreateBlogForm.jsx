import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBlogForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Auther: '',
    Title: '',
    Description: '',
    Img: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Auther.trim()) {
      newErrors.Auther = 'Author name is required';
    } else if (formData.Auther.length < 2) {
      newErrors.Auther = 'Author name must be at least 2 characters';
    }

    if (!formData.Title.trim()) {
      newErrors.Title = 'Title is required';
    } else if (formData.Title.length < 5) {
      newErrors.Title = 'Title must be at least 5 characters';
    }

    if (!formData.Description.trim()) {
      newErrors.Description = 'Description is required';
    } else if (formData.Description.length < 20) {
      newErrors.Description = 'Description must be at least 20 characters';
    }

    if (!formData.Img) {
      newErrors.Img = 'Image is required';
    } else {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(formData.Img.type)) {
        newErrors.Img = 'Only JPG, PNG and GIF images are allowed';
      } else if (formData.Img.size > 5000000) { // 5MB
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      Img: file
    }));
    if (errors.Img) {
      setErrors(prev => ({
        ...prev,
        Img: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://realestateadminpanel-2.onrender.com/blogs/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend,
        });
  
        const data = await response.json();
        
        if (response.ok) {
          navigate('/blogs');
        } else {
          setErrors(data.errors || { submit: data.message || 'Failed to create blog' });
        }
      } catch (err) {
        setErrors({ submit: 'Failed to create blog. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
  `;

  // Rest of your return statement remains the same, just add error messages:
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Create New Blog</h2>
      {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Author *</label>
          <input
            type="text"
            name="Auther"
            value={formData.Auther}
            onChange={handleChange}
            className={inputClasses('Auther')}
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
            className={inputClasses('Title')}
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
            className={inputClasses('Description')}
            required
          />
          {errors.Description && (
            <p className="text-red-500 text-sm mt-1">{errors.Description}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Image *</label>
          <input
            type="file"
            name="Img"
            onChange={handleFileChange}
            className={inputClasses('Img')}
            accept="image/*"
            required
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
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogForm;