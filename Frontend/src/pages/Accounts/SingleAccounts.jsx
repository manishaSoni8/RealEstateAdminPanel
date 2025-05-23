import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 
const SingleAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchTransaction();
  }, [id]); // Added id to dependency array
 
  const fetchTransaction = async () => {
    try {
const res = await fetch(`${import.meta.env.VITE_BASE_URL}/transactions/${id}`);
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
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Name:</span>{' '}
                  {`${transaction.userId?.First_Name} ${transaction.userId?.Last_Name}`}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Email:</span>{' '}
                  {transaction.userId?.Email}
                </p>
              </div>
            </div>
 
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Agent Information</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Name:</span>{' '}
                  {`${transaction.agentId?.First_Name} ${transaction.agentId?.Last_Name}`}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Email:</span>{' '}
                  {transaction.agentId?.Email}
                </p>
              </div>
            </div>

            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Details</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Total Amount:</span>{' '}
                  ${transaction.totalAmount?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Agent Share:</span>{' '}
                  ${transaction.agentShare?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Owner Share:</span>{' '}
                  ${transaction.ownerShare?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Transaction ID:</span>{' '}
                  {transaction.transactionId}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.status}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default SingleAccount;
 