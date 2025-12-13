import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Lock,
  User,
  Palette,
  Save,
} from "lucide-react";
import Button from "./Button";

const Settings = ({ userId }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
    },
    privacy: {
      profileVisible: false,
      dataSharing: false,
      analytics: true,
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
    },
    preferences: {
      language: "en",
      timezone: "auto",
      soundEnabled: true,
    },
  });

  const handleToggle = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleSelect = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // TODO: Save settings to backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  const ToggleItem = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-primary-500" : "bg-gray-300"
        }`}
      >
        <motion.div
          animate={{ x: checked ? 24 : 2 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  );

  const SelectItem = ({ label, description, value, options, onChange }) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="mb-2">
        <p className="font-semibold text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 bg-gradient-to-br from-stone-50 via-slate-50 to-neutral-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy settings</p>
        </motion.div>

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <ToggleItem
            label="Email Notifications"
            description="Receive updates and reports via email"
            checked={settings.notifications.email}
            onChange={() => handleToggle("notifications", "email")}
          />
          <ToggleItem
            label="Push Notifications"
            description="Get real-time alerts on your device"
            checked={settings.notifications.push}
            onChange={() => handleToggle("notifications", "push")}
          />
          <ToggleItem
            label="SMS Notifications"
            description="Receive important updates via text message"
            checked={settings.notifications.sms}
            onChange={() => handleToggle("notifications", "sms")}
          />
          <ToggleItem
            label="Weekly Reports"
            description="Get a summary of your progress every week"
            checked={settings.notifications.weeklyReport}
            onChange={() => handleToggle("notifications", "weeklyReport")}
          />
        </SettingSection>

        {/* Privacy */}
        <SettingSection title="Privacy & Security" icon={Shield}>
          <ToggleItem
            label="Profile Visibility"
            description="Allow others to see your profile"
            checked={settings.privacy.profileVisible}
            onChange={() => handleToggle("privacy", "profileVisible")}
          />
          <ToggleItem
            label="Data Sharing"
            description="Share anonymized data for research"
            checked={settings.privacy.dataSharing}
            onChange={() => handleToggle("privacy", "dataSharing")}
          />
          <ToggleItem
            label="Analytics"
            description="Help us improve by sharing usage analytics"
            checked={settings.privacy.analytics}
            onChange={() => handleToggle("privacy", "analytics")}
          />
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={Palette}>
          <SelectItem
            label="Theme"
            description="Choose your preferred color theme"
            value={settings.appearance.theme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "auto", label: "Auto" },
            ]}
            onChange={(value) => handleSelect("appearance", "theme", value)}
          />
          <SelectItem
            label="Font Size"
            description="Adjust text size for better readability"
            value={settings.appearance.fontSize}
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ]}
            onChange={(value) => handleSelect("appearance", "fontSize", value)}
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="Preferences" icon={Globe}>
          <SelectItem
            label="Language"
            description="Select your preferred language"
            value={settings.preferences.language}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
            ]}
            onChange={(value) => handleSelect("preferences", "language", value)}
          />
          <SelectItem
            label="Timezone"
            description="Set your timezone for accurate timestamps"
            value={settings.preferences.timezone}
            options={[
              { value: "auto", label: "Auto-detect" },
              { value: "utc", label: "UTC" },
              { value: "est", label: "Eastern Time" },
              { value: "pst", label: "Pacific Time" },
            ]}
            onChange={(value) => handleSelect("preferences", "timezone", value)}
          />
          <ToggleItem
            label="Sound Effects"
            description="Enable sound notifications"
            checked={settings.preferences.soundEnabled}
            onChange={() => handleToggle("preferences", "soundEnabled")}
          />
        </SettingSection>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end mt-8"
        >
          <Button
            onClick={handleSave}
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
