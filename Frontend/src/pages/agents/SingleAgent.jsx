import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SingleAgent = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDetails();
    fetchAgentProperties();
  }, [id]);

  const fetchAdminDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/agents/${id}`);
      const data = await response.json();
      setAgent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      setLoading(false);
    }
  };
  const fetchAgentProperties = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/agents/${id}/properties`);
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agent properties:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!agent) return <div className="text-center py-8">Agent not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <img
            src={agent.user_image || `https://ui-avatars.com/api/?name=${agent.First_Name}+${agent.Last_Name}&background=8B5CF6&color=fff`}
            alt={`${agent.First_Name} ${agent.Last_Name}`}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-purple-800">{`${agent.First_Name} ${agent.Last_Name}`}</h1>
            <p className="text-gray-600">{agent.Email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">First Name:</span> {agent.First_Name}</p>
              <p><span className="font-semibold">Last Name:</span> {agent.Last_Name}</p>
              <p><span className="font-semibold">Email:</span> {agent.Email}</p>
              <p><span className="font-semibold">Phone:</span> {agent.Phone}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Role & Permissions</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">Role:</span> {agent.role || 'Agent'}</p>
              <p><span className="font-semibold">Join Date:</span> {new Date(agent.createdAt).toLocaleDateString()}</p>
              <p><span className="font-semibold">Last Updated:</span> {new Date(agent.updatedAt).toLocaleDateString()}</p>
              <p>
                <span className="font-semibold">Subscription Plan:</span>{" "}
                <span className={`px-2 py-1 rounded-full text-white text-sm font-medium ${agent.is_subscribed?.name === 'Gold' ? 'bg-yellow-500' :
                    agent.is_subscribed?.name === 'Silver' ? 'bg-gray-500' : 'bg-green-500'
                  }`}>
                  {agent.is_subscribed?.name || 'Free'}
                </span>
              </p>

            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Activity Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-purple-800">Account Created</h4>
                <p className="text-sm mt-2">
                  {new Date(agent.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-purple-800">Account Type</h4>
                <p className="text-sm mt-2 font-semibold text-purple-600">
                  Agent
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="text-lg font-semibold text-purple-800">Last Active</h4>
                <p className="text-sm mt-2">
                  {new Date(agent.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-purple-800">Properties Created by {agent.First_Name}</h3>
                <p className="text-sm mt-2"><strong>Total Properties:</strong> {properties.length}</p>
                <ul className="list-disc pl-5 mt-2 text-purple-800">
                  {properties.map((prop) => (
                    <Link to={`/properties/${prop._id}`}>
                      <li key={prop._id}>{prop.name}</li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAgent;