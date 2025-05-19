import React, { useEffect, useState } from 'react';

const Header = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'Admin');
      } catch {
        setUserName('Admin');
      }
    } else {
      setUserName('Admin');
    }
  };

  useEffect(() => {
    updateUser(); // Run on mount

    // Run on logout
    const handleLogout = () => updateUser();

    window.addEventListener('logout', handleLogout);

    // Optional: Also listen to storage changes from other tabs
    window.addEventListener('storage', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('storage', handleLogout);
    };
  }, []);

  return (
    <header className="bg-purple-200 h-16 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">RealEstate Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
