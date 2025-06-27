import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  Pill,
  Settings,
  LogOut,
  Activity,
  UserCheck,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getMenuItems = (role) => {
    switch (role) {
      case 'admin':
        return [
          { icon: Shield, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Manage Users', path: '/admin/users' },
          { icon: Activity, label: 'Analytics', path: '/admin/analytics' },
        ];
      case 'doctor':
        return [
          { icon: Activity, label: 'Dashboard', path: '/doctor' },
          { icon: Users, label: 'My Patients', path: '/doctor/patients' },
          { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
          { icon: FileText, label: 'Medical Records', path: '/doctor/records' },
          { icon: Pill, label: 'Prescriptions', path: '/doctor/prescriptions' },
        ];
      case 'patient':
        return [
          { icon: Activity, label: 'Dashboard', path: '/patient' },
          { icon: FileText, label: 'Medical History', path: '/patient/history' },
          { icon: Pill, label: 'Medications', path: '/patient/medications' },
          { icon: Calendar, label: 'Appointments', path: '/patient/appointments' },
          { icon: Calendar, label: 'Doctors', path: '/patient/doctors' },
        ];
      default:
        return [];
    }
  };

  const menuItems = user ? getMenuItems(user.role) : [];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold text-blue-700 tracking-tight mb-4">BlueCare</h1>

            {user && (
              <div className="flex items-center space-x-3">
                {/* Avatar Circle with Initial */}
                <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-lg font-semibold uppercase shadow-sm">
                  {user.fullName?.charAt(0)}
                </div>

                {/* Name & Role */}
                <div>
                  <p className="text-base font-semibold text-gray-800 leading-tight">{user.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize tracking-wide">{user.role}</p>
                </div>
              </div>
            )}
          </div>


          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 bg-white">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg group transition-all duration-200 font-medium
                        ${isActive
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                    >
                      <Icon size={20} className={`${isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut size={20} className="text-gray-500 group-hover:text-red-700" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
