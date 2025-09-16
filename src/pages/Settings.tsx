import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Company Inc.',
    phone: '+1 (555) 123-4567',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    contractExpiry: true,
    riskAlerts: true,
    systemUpdates: false,
    weeklyReports: true,
    emailNotifications: true,
    browserNotifications: false,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile updated:', profileForm);
    // Show success message
  };

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle notification settings update
    console.log('Notifications updated:', notificationSettings);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Handle password change
    console.log('Password changed');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ] as const;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <UserCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={profileForm.company}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <BellIcon className="h-6 w-6 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <form onSubmit={handleNotificationSave}>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Contract Alerts</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.contractExpiry}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, contractExpiry: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Contract expiry notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.riskAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, riskAlerts: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Risk alerts and warnings</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">System Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.systemUpdates}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemUpdates: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">System updates and maintenance</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Weekly portfolio reports</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Delivery Methods</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.browserNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, browserNotifications: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Browser push notifications</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <KeyIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <CogIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Account Actions</h2>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Download all your contract data in JSON format.
                </p>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm">
                  Export Data
                </button>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-700 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm">
                  Delete Account
                </button>
              </div>

              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <h3 className="font-medium text-yellow-900 mb-2">Sign Out</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Sign out of your account on this device.
                </p>
                <button 
                  onClick={logout}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;