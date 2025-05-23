import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Password: '',
    Email: '',
    Phone: ''  
  });

  const [errors, setErrors] = useState({});

 
  const validateForm = () => {
    const newErrors = {};
    
    
    if (!formData.First_Name.trim()) {
      newErrors.First_Name = 'First name is required';
    } else if (formData.First_Name.length < 2) {
      newErrors.First_Name = 'First name must be at least 2 characters';
    }

    if (!formData.Last_Name.trim()) {
      newErrors.Last_Name = 'Last name is required';
    } else if (formData.Last_Name.length < 2) {
      newErrors.Last_Name = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.Email) {
      newErrors.Email = 'Email is required';
    } else if (!emailRegex.test(formData.Email)) {
      newErrors.Email = 'Invalid email format';
    }

    
    if (!formData.Password) {
      newErrors.Password = 'Password is required';
    } else if (formData.Password.length < 6) {
      newErrors.Password = 'Password must be at least 6 characters';
    }

    
    if (!formData.Phone.trim()) {
      newErrors.Phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.Phone)) {
      newErrors.Phone = 'Phone number must be 10 digits';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (response.ok) {
          alert('Admin created successfully');
          setFormData({
            First_Name: '',
            Last_Name: '',
            Password: '',
            Email: '',
            Phone: ''  
          });
          navigate('/admin');
        } else {
          if (data.errors) {
            const backendErrors = {};
            if (Array.isArray(data.errors)) {
              data.errors.forEach(error => {
                backendErrors[error.param] = error.msg;
              });
            } else {
              Object.keys(data.errors).forEach(key => {
                backendErrors[key] = data.errors[key];
              });
            }
            setErrors(backendErrors);
          } else {
            alert(data.message || 'Failed to create admin');
          }
        }
      } catch (error) {
        console.error('Error creating admin:', error);
        alert('Failed to create admin');
      }
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
  `;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="First_Name"
              value={formData.First_Name}
              onChange={handleChange}
              className={inputClasses('First_Name')}
            />
            {errors.First_Name && (
              <p className="text-red-500 text-sm mt-1">{errors.First_Name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="Last_Name"
              value={formData.Last_Name}
              onChange={handleChange}
              className={inputClasses('Last_Name')}
            />
            {errors.Last_Name && (
              <p className="text-red-500 text-sm mt-1">{errors.Last_Name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className={inputClasses('Email')}
          />
          {errors.Email && (
            <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            className={inputClasses('Password')}
          />
          {errors.Password && (
            <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            className={inputClasses('Phone')}
            placeholder="1234567890"
          />
          {errors.Phone && (
            <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default AdminSignupForm;