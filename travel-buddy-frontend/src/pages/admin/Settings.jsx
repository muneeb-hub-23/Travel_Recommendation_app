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
