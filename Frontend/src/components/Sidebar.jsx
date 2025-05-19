import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: '📊', path: '/dashboard' },
    { title: 'Properties', icon: '🏠', path: '/properties' },
    { title: 'Admin', icon: '👥', path: '/admin' },
    { title: 'Agents', icon: '🧑', path: '/agents' },
    { title: 'Blogs', icon: '📝', path: '/blogs' },
    { title: 'Contact', icon: '📞', path: '/contact' },
    { title: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
      window.dispatchEvent(new Event('logout')); 
    navigate('/admin-login');
  };

  return (
    <div
      className={`bg-white shadow-lg text-gray-800 min-h-screen transition-all duration-300 
      ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
          RealEstate Admin
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-purple-200  bg-purple-800 transition-colors"
        >
          <div className="flex flex-col space-y-1 hover:bg-purple-200">
            <span className="w-4 h-0.5 bg-gray-100"></span>
            <span className="w-4 h-0.5 bg-gray-100"></span>
            <span className="w-4 h-0.5 bg-gray-100"></span>
          </div>
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
                  p-3 rounded-lg transition-colors
                  ${isActive ? 'bg-purple-800 text-white' : 'hover:bg-purple-300'}
                `}
                title={item.title}
              >
                <span className="text-xl">{item.icon}</span>
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
                  {item.title}
                </span>
              </NavLink>
            </li>
          ))}

          {/* Logout directly after Settings */}
          <li>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              } p-3 rounded-lg text-red-600 hover:bg-red-100 transition-colors`}
              title="Logout"
            >
              <span className="text-xl">🔓</span>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
