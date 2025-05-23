import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 
const SingleAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchTransaction();
  }, []);
 
  const fetchTransaction = async () => {
    try {
const res = await fetch(`https://realestateadminpanel-2.onrender.com/transactions/${id}`);
      const data = await res.json();
      setTransaction(data?.data);
    } catch (err) {
      console.error('Error fetching transaction:', err);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <button
        className="mb-4 text-purple-600 font-medium hover:underline"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Transactions
      </button>
 
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-800 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading Transaction...</p>
        </div>
      ) : !transaction ? (
        <div className="text-center text-red-500 text-lg font-medium">
          Transaction not found.
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Transaction Details</h2>
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">User Information</h3>
              <div className="flex items-center space-x-4">
                <img
                  className="w-16 h-16 rounded-full"
                  src={
                    transaction?.user?.profilePhoto ||
`https://ui-avatars.com/api/?name=${transaction?.user?.name}&background=8B5CF6&color=fff`
                  }
                  alt={transaction?.user?.name}
                />
                <div>
                  <p className="text-md font-medium text-gray-900">
                    {transaction?.user?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">{transaction?.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Info</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Amount:</span>{' '}
                ${transaction?.amount?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Status:</span>{' '}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    transaction?.status === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {transaction?.status || 'pending'}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Date:</span>{' '}
                {new Date(transaction?.createdAt).toLocaleString()}
              </p>
              {transaction?.agent && (
                <p className="text-sm text-gray-700">
Agent: {transaction.agent.name}
                </p>
              )}
            </div>
          </div>
 
          {transaction?.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-700">{transaction.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
export default SingleAccount;
 