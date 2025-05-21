import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
 
const EditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Email: '',
    Phone: '',
  });
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    fetchAgent();
  }, [id]);
 
  const fetchAgent = async () => {
    try {
      const token = localStorage.getItem('token');
const res = await axios.get(`http://localhost:3005/agents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { First_Name, Last_Name, Email, Phone } = res.data;
      setFormData({
        First_Name,
        Last_Name,
        Email,
        Phone: Phone || '',
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch agent data');
      setLoading(false);
    }
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
`http://localhost:3005/agents/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Agent updated successfully');
      navigate('/agent');
    } catch (err) {
      setError('Failed to update agent');
    }
  };
 
  if (loading) return <div className="text-center py-8">Loading...</div>;
 
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Edit Agent</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="First_Name"
            value={formData.First_Name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="Last_Name"
            value={formData.Last_Name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Contact Number</label>
          <input
            type="tel"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            pattern="[0-9]{10}"
            title="Phone number must be 10 digits"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-purple-800 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Update Agent
          </button>
          <button
            type="button"
            onClick={() => navigate('/agent')}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default EditAgent;