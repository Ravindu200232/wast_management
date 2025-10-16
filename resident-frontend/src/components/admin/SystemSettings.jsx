// src/components/admin/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Bell, Shield, Database } from 'lucide-react';
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Settings className="text-gray-400 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
              <input
                type="text"
                value={settings.system_name}
                onChange={(e) => handleChange('system_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="LKR">LKR (Rs)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Bell className="text-gray-400 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-600">Send notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => handleChange('email_notifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">SMS Notifications</p>
                <p className="text-sm text-gray-600">Send notifications via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.sms_notifications}
                onChange={(e) => handleChange('sms_notifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.session_timeout}
                onChange={(e) => handleChange('session_timeout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Reward System Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="text-gray-400 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Reward System</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Rate (points per kg)</label>
              <input
                type="number"
                value={settings.coupon_rate}
                onChange={(e) => handleChange('coupon_rate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Weight for Coupon (kg)</label>
              <input
                type="number"
                value={settings.minimum_weight}
                onChange={(e) => handleChange('minimum_weight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Tracking Interval (seconds)</label>
              <input
                type="number"
                value={settings.vehicle_tracking_interval}
                onChange={(e) => handleChange('vehicle_tracking_interval', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* System Maintenance */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Database className="text-gray-400 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">System Maintenance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Put system in maintenance mode</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Auto Backup</p>
                <p className="text-sm text-gray-600">Automatically backup system data</p>
              </div>
              <input
                type="checkbox"
                checked={settings.auto_backup}
                onChange={(e) => handleChange('auto_backup', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                value={settings.backup_frequency}
                onChange={(e) => handleChange('backup_frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size</label>
              <select
                value={settings.max_file_size}
                onChange={(e) => handleChange('max_file_size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Clear All Data</p>
              <p className="text-sm text-red-600">Permanently delete all system data</p>
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Clear Data
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Reset System</p>
              <p className="text-sm text-red-600">Reset all settings to default</p>
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Reset System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;