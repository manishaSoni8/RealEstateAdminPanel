import React, { useEffect, useState } from 'react';

const Header = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get the user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'Admin'); // Corrected this line
      } catch {
        setUserName('Admin');
      }
    } else {
      setUserName('Admin');
    }
  }, []);

  return (
    <header className="bg-white h-16 shadow-md">
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
