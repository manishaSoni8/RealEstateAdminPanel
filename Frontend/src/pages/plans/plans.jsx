import React, { useEffect, useState } from 'react';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 30,
    propertySubmissionLimit: 0,
    features: [],
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/plans`);
      const data = await response.json();
      setPlans(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'features') {
      setFormData(prev => ({ ...prev, [name]: value.split(',').map(f => f.trim()) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentPlan
        ? `${import.meta.env.VITE_BASE_URL}/plans/${currentPlan._id}`
        : `${import.meta.env.VITE_BASE_URL}/plans`;

      const method = currentPlan ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchPlans();
        setEditMode(false);
        setCurrentPlan(null);
        setFormData({
          name: '',
          price: 0,
          duration: 30,
          propertySubmissionLimit: 0,
          features: [],
          description: ''
        });
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      propertySubmissionLimit: plan.propertySubmissionLimit,
      features: plan.features,
      description: plan.description
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/plans/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPlans();
        }
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Subscription Plans</h2>
      
      {/* Plan List */}
      {!editMode && (
        <div className="mb-6">
          <button
            onClick={() => setEditMode(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
          >
            Add New Plan
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan._id} className="border rounded-lg p-4 shadow">
                <h3 className="text-2xl font-semibold mb-2 text-purple-800">{plan.name}</h3>
                <p className="text-2xl font-bold mb-2">${plan.price}</p>
                <p className="mb-2">{plan.duration} days</p>
                <p className="mb-2">Property Limit: {plan.propertySubmissionLimit}</p>
                <div className="mb-2">
                  <strong>Features:</strong>
                  <ul className="list-disc pl-5">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <p className="mb-4">{plan.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Form */}
      {editMode && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
            <select
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="">Select a plan</option>
              <option value="Free">Free</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Property Submission Limit</label>
            <input
              type="number"
              name="propertySubmissionLimit"
              value={formData.propertySubmissionLimit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features.join(', ')}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {currentPlan ? 'Update Plan' : 'Create Plan'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setCurrentPlan(null);
                setFormData({
                  name: '',
                  price: 0,
                  duration: 30,
                  propertySubmissionLimit: 0,
                  features: [],
                  description: ''
                });
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Plans;