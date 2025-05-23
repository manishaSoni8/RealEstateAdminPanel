import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [message, setMessage] = useState('');
    const contactsPerPage = 5;

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [search, contacts]);

    const fetchAgents = async () => {
  try {
const res = await fetch(`${import.meta.env.VITE_BASE_URL}/contactforms`);
    const data = await res.json();
    setContacts(data.data); 
    setFilteredContacts(data.data); 
  } catch (err) {
    console.error('Error:', err);
  }
  setLoading(false);
};
const handleDelete = async (e, id) => {
  e.preventDefault();
  if (window.confirm('Are you sure you want to delete this agent?')) {
    try {
const response = await fetch(`${import.meta.env.VITE_BASE_URL}/contactforms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete agent');
      fetchAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent');
    }
  }
};
    const handleSearch = () => {
        const keyword = search.toLowerCase();
        const filtered = contacts.filter(
            (contacts) =>
                contacts.First_Name.toLowerCase().includes(keyword) ||
               contacts.Last_Name.toLowerCase().includes(keyword) ||
               contacts.Email.toLowerCase().includes(keyword)
        );
        setFilteredContacts(filtered);
        setCurrentPage(1);
    };

    

    // Pagination logic
    const indexOfLastAgent = currentPage * contactsPerPage;
    const indexOfFirstAgent = indexOfLastAgent - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstAgent, indexOfLastAgent);
    const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            
<h2 className="text-3xl font-bold text-purple-800 mb-6">Messages</h2>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search agents by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2 border rounded shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                />
            </div>

            {message && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-800 mx-auto"></div>
                    <p className="mt-6 text-gray-600 text-lg">Loading Messages...</p>
                </div>
            ) : currentContacts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-7xl mb-6">👥</div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Messages Found</h3>
                    <p className="text-gray-600 mb-6 text-lg">
                        {search ? 'Try a different search term' : 'Get started by creating your first agent'}
                    </p>
                    
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentContacts.map((contact) => (
                                    <tr key={contact._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={contact.profilePhoto || `https://ui-avatars.com/api/?name=${contact.First_Name}+${contact.Last_Name}&background=8B5CF6&color=fff`}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {contact.First_Name} {contact.Last_Name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contact.Email}</div>
                                        </td>
                                       
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contact.Subject}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-4">
                                                <Link to={`/contact/${contact._id}`} className="text-purple-600 hover:text-purple-900">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={(e) => handleDelete(e, contact._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Contact;