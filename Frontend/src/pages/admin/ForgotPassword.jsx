import React, { useState } from 'react';
 
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
 
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
const res = await fetch('https://realestateadminpanel-2.onrender.com/admin-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
      });
      const data = await res.json();
      if (res.ok) {
  setMessage('An email has been sent to reset your password.');
}
  else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };
 
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-6">Forgot Password</h2>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default ForgotPassword;