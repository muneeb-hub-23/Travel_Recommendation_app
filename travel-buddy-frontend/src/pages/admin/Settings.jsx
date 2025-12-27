import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Settings as SettingsIcon, Mail, Phone, Shield, Bell, Database, Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'AI Travel Buddy',
      tagline: 'Discover Pakistan with AI',
      contactEmail: 'support@travelbuddy.pk',
      supportPhone: '+92 300 1234567',
    },
    features: {
      aiRecommendations: true,
      userReviews: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    },
  });

  const handleSaveSettings = async () => {
    await Swal.fire({
      icon: 'success',
      title: 'Settings Saved!',
      text: 'Your settings have been updated successfully.',
      confirmButtonColor: '#10b981',
      timer: 2000
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
        <p className="text-sm text-slate-600 mt-1">Configure your application settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-black">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">General Settings</h3>
              <p className="text-sm text-slate-600">Basic application configuration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, siteName: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
              <input
                type="text"
                value={settings.general.tagline}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, tagline: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Contact Email
              </label>
              <input
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, contactEmail: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Support Phone
              </label>
              <input
                type="tel"
                value={settings.general.supportPhone}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, supportPhone: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-black">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Features</h3>
              <p className="text-sm text-slate-600">Enable or disable application features</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
              <div>
                <p className="font-medium text-slate-800">AI Recommendations</p>
                <p className="text-sm text-slate-600">Enable AI-powered destination recommendations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.aiRecommendations}
                  onChange={(e) => setSettings({
                    ...settings,
                    features: { ...settings.features, aiRecommendations: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
              <div>
                <p className="font-medium text-slate-800">User Reviews</p>
                <p className="text-sm text-slate-600">Allow users to post reviews and ratings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.userReviews}
                  onChange={(e) => setSettings({
                    ...settings,
                    features: { ...settings.features, userReviews: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-600">Send email notifications to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.emailNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    features: { ...settings.features, emailNotifications: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
              <div>
                <p className="font-medium text-slate-800">SMS Notifications</p>
                <p className="text-sm text-slate-600">Send SMS notifications to users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.features.smsNotifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    features: { ...settings.features, smsNotifications: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-black">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Security</h3>
              <p className="text-sm text-slate-600">Manage security and authentication settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200">
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactorAuth: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
