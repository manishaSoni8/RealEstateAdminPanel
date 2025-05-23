
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
const Account = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchTransactions();
  createPurchaseAndPay
    //  fetchinitiatepayment();
  }, []);

const createPurchaseAndPay = async () => {
  try {
    
    const userId = 'USER_ID';
    const propertyId = 'PROPERTY_ID';
    const amount = 100; 
 
    const res1 = await fetch(`${import.meta.env.VITE_BASE_URL}/create-purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, propertyId, amount })
    });
 
    const { purchaseId } = await res1.json();
 
    
    const res2 = await fetch(`${import.meta.env.VITE_BASE_URL}/createpayment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchaseId,
        token: { id: 'tok_visa' } 
      })
    });
 
    const data = await res2.json();
    console.log('Payment Result:', data);
    fetchTransactions();
  } catch (err) {
    console.error('Error creating purchase or payment:', err);
  }
};
 
  const fetchTransactions = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/transactions`);
    const data = await res.json();
    setTransactions(data?.data || []);
    setFiltered(data?.data || []);
  } catch (err) {
    console.error('Error fetching transactions:', err);
  } finally {
    setLoading(false);
  }
};
 
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filteredData = transactions.filter((t) =>
      t.user?.name?.toLowerCase().includes(value) ||
      t.agent?.name?.toLowerCase().includes(value)
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  };
 
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filtered.slice(indexOfFirst, indexOfLast);
 
  const totalPages = Math.ceil(filtered.length / transactionsPerPage);
 
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-800">All Transactions</h2>
        <input
          type="text"
          placeholder="Search by User/Agent"
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          value={search}
          onChange={handleSearch}
        />
      </div>
 
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-800 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading Transactions...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100 text-gray-500 text-sm">
              <tr>
                <th className="p-3 text-left text-xs font-medium">USER</th>
                <th className="p-3 text-left text-xs font-medium">AGENT</th>
                <th className="p-3 text-left text-xs font-medium">AMOUNT</th>
                <th className="p-3 text-left text-xs font-medium">STATUS</th>
                <th className="p-3 text-left text-xs font-medium">DATE</th>
                <th className="p-3 text-left text-xs font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {currentTransactions.map((t) => (
                <tr key={t._id} className="border-t border-gray-200">
                  <td className="p-3">
                    {t.userId?.First_Name} {t.userId?.Last_Name}
                  </td>
                  <td className="p-3">
                    {t.agentId?.First_Name} {t.agentId?.Last_Name}
                  </td>
                  <td className="p-3">${t.totalAmount?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/transactions/${t._id}`)}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
 
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === num + 1
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default Account;
 