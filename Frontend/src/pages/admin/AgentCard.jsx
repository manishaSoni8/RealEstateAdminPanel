import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
 
const AgentCard = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const agentsPerPage = 6;
 
  useEffect(() => {
    fetchAgents();
  }, []);
 
  useEffect(() => {
    handleSearch();
  }, [search, agents]);
 
  const fetchAgents = async () => {
    try {
const res = await fetch('http://localhost:3005/agents');
      const data = await res.json();
      setAgents(data);
      setFilteredAgents(data); // ensure filteredAgents is updated
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };
 
  const handleSearch = () => {
    const keyword = search.toLowerCase();
    const filtered = agents.filter(
      (agent) =>
        agent.First_Name.toLowerCase().includes(keyword) ||
        agent.Last_Name.toLowerCase().includes(keyword)
    );
    setFilteredAgents(filtered);
    setCurrentPage(1);
  };
 
  const blockAgent = async (id) => {
    try {
const res = await fetch(`http://localhost:3005/agents/block/${id}`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Failed to update agent status');
 
      const updatedAgent = agents.find((a) => a._id === id);
      const isBlocked = updatedAgent?.status;
 
      setMessage(isBlocked ? 'Agent has been unblocked.' : 'Agent has been blocked.');
      setTimeout(() => setMessage(''), 5000); // clear message after 5 sec
 
      fetchAgents(); // refresh data
    } catch (err) {
      console.error('Error blocking/unblocking:', err);
      setMessage('Something went wrong.');
      setTimeout(() => setMessage(''), 5000);
    }
  };
 
  // Pagination logic
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
 
  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-300 group">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-purple-800">Agent Management</h2>
        <Link
          to="/agent/create"
          className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Agent
        </Link>
      </div>
 
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm"
        />
      </div>
 
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
 
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {currentAgents.map((agent) => (
              <div
                key={agent._id}
                className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-300 group"
              >
                <img
                  src={
                    agent.profilePhoto ||
`https://ui-avatars.com/api/?name=${agent.First_Name}+${agent.Last_Name}&background=8B5CF6&color=fff`
                  }
                  alt="Agent"
                  className="w-16 h-16 rounded-full mb-4 mx-auto"
                />
                <h3 className="text-lg font-semibold">
                  {agent.First_Name} {agent.Last_Name}
                </h3>
                <p>{agent.Email}</p>
                <p>{agent.Phone}</p>
                <button
                  onClick={() => blockAgent(agent._id)}
                  className={`mt-3 px-3 py-1 rounded text-white transition-colors duration-200 ${
                    agent.status ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  {agent.status ? 'Unblock' : 'Block'}
                </button>
              </div>
            ))}
          </div>
 
          {filteredAgents.length > agentsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};
 
export default AgentCard;