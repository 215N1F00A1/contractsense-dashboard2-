import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Contracts', href: '/contracts', icon: DocumentTextIcon },
  { name: 'Upload', href: '/upload', icon: CloudArrowUpIcon },
  { name: 'Query', href: '/query', icon: MagnifyingGlassIcon },
  { name: 'Insights', href: '/insights', icon: LightBulbIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
            <div className="absolute top-0 right-0 p-1 -mr-12">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">ContractAI</span>
              </div>
              <nav className="mt-8 px-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 h-16 px-4 bg-white border-b border-gray-200">
            <DocumentTextIcon className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ContractAI</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
          <button
            className="p-1 rounded-md text-gray-500 md:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.username}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;