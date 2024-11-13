import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Target, Megaphone, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { googleLogout } from '@react-oauth/google';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Segments', href: '/segments', icon: Target },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-sky-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold text-white">XENO CRM by Deevansh</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-sky-500 text-white'
                        : 'text-white hover:bg-sky-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-1.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border-2 border-white"
                  />
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-sky-700"
                >
                  <LogOut className="h-5 w-5 mr-1.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}