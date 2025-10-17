// src/components/admin/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Bell, Shield, Database, AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import axios from 'axios';

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Mock settings - in real app, this would come from backend
      const mockSettings = {
        system_name: 'Smart Waste Management',
        currency: 'USD',
        timezone: 'UTC+5:30',
        maintenance_mode: false,
        auto_backup: true,
        backup_frequency: 'daily',
        max_file_size: '10MB',
        session_timeout: '30',
        email_notifications: true,
        sms_notifications: false,
        coupon_rate: '100',
        minimum_weight: '5',
        vehicle_tracking_interval: '30'
      };
      setSettings(mockSettings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 p-3 rounded-2xl mr-4">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-500 text-sm mt-1">Configure system-wide settings and preferences</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center"
          >
            {saving ? (
              <RefreshCw className="animate-spin mr-2" size={20} />
            ) : (
              <Save className="mr-2" size={20} />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* General Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-2xl mr-4">
              <Settings className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">System Name</label>
              <input
                type="text"
                value={settings.system_name}
                onChange={(e) => handleChange('system_name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter system name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="LKR">LKR (Rs)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="UTC+5:30">IST (UTC+5:30)</option>
                <option value="UTC+0">GMT (UTC+0)</option>
                <option value="UTC-5">EST (UTC-5)</option>
                <option value="UTC+1">CET (UTC+1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-2xl mr-4">
              <Bell className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-600">Send notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) => handleChange('email_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-medium text-gray-800">SMS Notifications</p>
                <p className="text-sm text-gray-600">Send notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sms_notifications}
                  onChange={(e) => handleChange('sms_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-3">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.session_timeout}
                onChange={(e) => handleChange('session_timeout', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Reward System Settings */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-amber-100 p-3 rounded-2xl mr-4">
              <Shield className="text-amber-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Reward System</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Coupon Rate (points per kg)</label>
              <input
                type="number"
                value={settings.coupon_rate}
                onChange={(e) => handleChange('coupon_rate', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter coupon rate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Weight for Coupon (kg)</label>
              <input
                type="number"
                value={settings.minimum_weight}
                onChange={(e) => handleChange('minimum_weight', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter minimum weight"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Tracking Interval (seconds)</label>
              <input
                type="number"
                value={settings.vehicle_tracking_interval}
                onChange={(e) => handleChange('vehicle_tracking_interval', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter tracking interval"
              />
            </div>
          </div>
        </div>

        {/* System Maintenance */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-2xl mr-4">
              <Database className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">System Maintenance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-medium text-gray-800">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Put system in maintenance mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-medium text-gray-800">Auto Backup</p>
                <p className="text-sm text-gray-600">Automatically backup system data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_backup}
                  onChange={(e) => handleChange('auto_backup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-3">Backup Frequency</label>
              <select
                value={settings.backup_frequency}
                onChange={(e) => handleChange('backup_frequency', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-3">Max File Size</label>
              <select
                value={settings.max_file_size}
                onChange={(e) => handleChange('max_file_size', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="5MB">5MB</option>
                <option value="10MB">10MB</option>
                <option value="25MB">25MB</option>
                <option value="50MB">50MB</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-3xl p-6">
        <div className="flex items-center mb-6">
          <div className="bg-red-100 p-3 rounded-2xl mr-4">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-2xl border border-red-200">
            <div className="mb-3 sm:mb-0">
              <p className="font-medium text-red-800">Clear All Data</p>
              <p className="text-sm text-red-600">Permanently delete all system data</p>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center">
              <Trash2 className="mr-2" size={16} />
              Clear Data
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-2xl border border-red-200">
            <div className="mb-3 sm:mb-0">
              <p className="font-medium text-red-800">Reset System</p>
              <p className="text-sm text-red-600">Reset all settings to default</p>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center">
              <RotateCcw className="mr-2" size={16} />
              Reset System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;