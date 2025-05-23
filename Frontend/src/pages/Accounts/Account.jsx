
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
  createPurchaseAndPay();
    //  fetchinitiatepayment();
  }, []);

const createPurchaseAndPay = async () => {
  try {
    // Replace these with actual userId, propertyId, and amount
    const userId = 'USER_ID';
    const propertyId = 'PROPERTY_ID';
    const amount = 100; // e.g., $100
 
    const res1 = await fetch('https://realestateadminpanel-2.onrender.com/create-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, propertyId, amount })
    });
 
    const { purchaseId } = await res1.json();
 
    // Call createPayment using the purchaseId
    const res2 = await fetch('https://realestateadminpanel-2.onrender.com/createpayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchaseId,
        token: { id: 'tok_visa' } // test token for Stripe
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
    const res = await fetch(`https://realestateadminpanel-2.onrender.com/transactions`);
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
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Agent</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {currentTransactions.map((t) => (
                <tr key={t._id} className="border-t border-gray-200">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={
                        t.user?.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${t.user?.name}&background=8B5CF6&color=fff`
                      }
                      alt={t.user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {t.user?.name || 'N/A'}
                  </td>
                  <td className="p-3">{t.agent?.name || 'N/A'}</td>
                  <td className="p-3">${t.totalAmount?.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        t.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
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
              {currentTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
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
 