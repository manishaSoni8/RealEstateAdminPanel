import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
 
const ResetPassword = () => {
  const { token } = useParams();
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    const validateToken = async () => {
      try {
const res = await fetch(`http://localhost:3005/admin-reset/${token}`);
        const data = await res.json();
        if (res.ok) {
setEmail(data.email);
          setAdminId(data.adminId);
        } else {
          setError(data.message || 'Invalid or expired token.');
        }
      } catch (err) {
        setError('Failed to verify token.');
      }
    };
    validateToken();
  }, [token]);
 
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
const res = await fetch('http://localhost:3005/admin-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Password: newPassword, adminId, resetToken: token })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password has been reset successfully!');
        setTimeout(() => navigate('/'), 2500);
      } else {
        setError(data.message || 'Reset failed.');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };
 
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-6">Reset Password</h2>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input type="email" value={email} disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">New Password</label>
            <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="********" />
          </div>
          <button type="submit" className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-700 transition-colors">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default ResetPassword;