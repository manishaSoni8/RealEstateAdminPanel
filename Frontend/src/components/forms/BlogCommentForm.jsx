import React, { useState } from 'react';

const BlogCommentForm = ({ blogId, onCommentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    Comment: '',
    Img: null,
    BlogId: blogId,
    Date: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.Comment.trim()) {
      newErrors.Comment = 'Comment is required';
    } else if (formData.Comment.length < 10) {
      newErrors.Comment = 'Comment must be at least 10 characters';
    }

    if (formData.Img) {
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
      // Ensure all fields match the backend schema
      formDataToSend.append('BlogId', blogId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('Comment', formData.Comment);
      formDataToSend.append('Date', formData.Date);
      if (formData.Img) {
        formDataToSend.append('Img', formData.Img);
      }

      try {
        const response = await fetch('http://localhost:3005/blogs/comment', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add comment');
        }

        const newComment = await response.json();
        onCommentAdded(newComment);
        // Reset form with all fields
        setFormData({
          name: '',
          Comment: '',
          Img: null,
          BlogId: blogId,
          Date: new Date().toISOString()
        });
        setErrors({});
        e.target.reset();
      } catch (err) {
        setErrors({ submit: err.message });
      } finally {
        setLoading(false);
      }
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
  `;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-purple-800 mb-4">Add a Comment</h3>
      {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClasses('name')}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Comment *</label>
          <textarea
            name="Comment"
            value={formData.Comment}
            onChange={handleChange}
            rows="4"
            className={inputClasses('Comment')}
            required
          />
          {errors.Comment && (
            <p className="text-red-500 text-sm mt-1">{errors.Comment}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Image (Optional)</label>
          <input
            type="file"
            name="Img"
            onChange={handleFileChange}
            className={inputClasses('Img')}
            accept="image/*"
          />
          {errors.Img && (
            <p className="text-red-500 text-sm mt-1">{errors.Img}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default BlogCommentForm;