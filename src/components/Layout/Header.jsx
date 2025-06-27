import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {user?.role} Dashboard
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button> */}
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer" onClick={() => { navigate(`/${user.role}/profile`) }}>
            <span className="text-white text-sm font-medium">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;