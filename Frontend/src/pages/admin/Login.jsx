import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Email: email, Password: password })
      });

      const result = await response.json();

      if (response.ok && result.token) {
        console.log(result);
        localStorage.setItem('token', result.token); 
        localStorage.setItem('user', JSON.stringify(result.admin)); 
        navigate('/dashboard'); 
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg ">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-6">Admin Login</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <div className="mb-2">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <div className="text-right mb-4">
            <a href="/forgot-password" className="text-sm text-purple-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
