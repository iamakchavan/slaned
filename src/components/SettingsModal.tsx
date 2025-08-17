import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Upload, User, Palette, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { profile, getDisplayName, updateProfile } = useProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [language, setLanguage] = useState('english');

  // Profile settings
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('utc');

  // Account settings
  const [autoSave, setAutoSave] = useState(true);
  const [taskReminders, setTaskReminders] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Populate form with actual user data
      setDisplayName(profile?.full_name || getDisplayName());
      setEmail(user?.email || '');
    } else {
      setIsVisible(false);
    }
  }, [isOpen, profile, user, getDisplayName]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSave = async () => {
    try {
      if (profile && displayName !== profile.full_name) {
        await updateProfile({
          full_name: displayName,
        });
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleResetDefaults = () => {
    setLanguage('english');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: SettingsIcon },
  ];





  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${isVisible ? 'bg-black/20 backdrop-blur-sm' : 'bg-black/0'
        }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white w-full max-w-md sm:max-w-2xl mx-auto flex flex-col border border-gray-200 dark:border-[#3a3a3c] transition-all duration-300 ease-out transform max-h-[90vh] shadow-2xl ${isVisible
          ? 'scale-100 opacity-100 translate-y-0'
          : 'scale-95 opacity-0 translate-y-4'
          }`}
      >
        {/* Sharp Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#3a3a3c]">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">Manage your preferences</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 dark:text-[#a1a1a6] hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] h-9 w-9 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Ultra Minimal Tab Navigation */}
        <div className="px-6 border-b border-gray-200 dark:border-[#3a3a3c]">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-white'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto max-h-96 scrollbar-minimal">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="text-center sm:text-left sm:flex sm:items-center sm:space-x-6">
                <div className="relative inline-block">
                  <Avatar className="w-20 h-20 mx-auto sm:mx-0 shadow-lg">

                    <AvatarFallback className="text-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium">{getDisplayName()[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-4 sm:mt-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{getDisplayName()}</h3>
                  <p className="text-xs text-gray-500 dark:text-[#a1a1a6]">{user?.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all bg-gray-50 dark:bg-[#1c1c1e] focus:bg-white dark:focus:bg-[#2c2c2e] placeholder-gray-400 dark:placeholder-[#6d6d70]"
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-500 dark:text-[#a1a1a6] bg-gray-100 dark:bg-[#2c2c2e] cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                    Timezone
                  </label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-[#1c1c1e]">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c]">
                      <SelectItem value="utc" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">UTC (Coordinated Universal Time)</SelectItem>
                      <SelectItem value="est" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="pst" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">PST (Pacific Standard Time)</SelectItem>
                      <SelectItem value="gmt" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">GMT (Greenwich Mean Time)</SelectItem>
                      <SelectItem value="ist" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">IST (India Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                    Language
                  </label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full px-3 py-2.5 border border-gray-200 dark:border-[#3a3a3c] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-[#1c1c1e]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c]">
                      <SelectItem value="english" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">English</SelectItem>
                      <SelectItem value="spanish" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">Spanish</SelectItem>
                      <SelectItem value="french" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">French</SelectItem>
                      <SelectItem value="german" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] focus:bg-gray-100 dark:focus:bg-[#3a3a3c]">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div></div>
              </div>

              {/* Interface Theme */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                  Interface Theme
                </label>
                <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mb-3">
                  Choose between light and dark mode
                </p>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#3a3a3c] rounded-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-900 dark:text-white">
                      Dark Mode
                    </label>
                    <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-5 w-9 items-center transition-colors ${theme === 'dark' ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-[#6d6d70]'
                      }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform bg-white dark:bg-gray-900 transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>




            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              {/* Account Plan */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-400">Free Plan</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Basic features with limited storage</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenPricing}
                    className="text-xs h-7 px-3 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-3">


                {/* Auto Save */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#3a3a3c]">
                  <div>
                    <label className="block text-xs font-medium text-gray-900 dark:text-white">
                      Auto Save
                    </label>
                    <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">
                      Save work automatically
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`relative inline-flex h-5 w-9 items-center transition-colors ${autoSave ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-[#6d6d70]'
                      }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform bg-white dark:bg-gray-900 transition-transform ${autoSave ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                {/* Task Reminders */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#3a3a3c]">
                  <div>
                    <label className="block text-xs font-medium text-gray-900 dark:text-white">
                      Task Reminders
                    </label>
                    <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mt-0.5">
                      Get reminded about deadlines
                    </p>
                  </div>
                  <button
                    onClick={() => setTaskReminders(!taskReminders)}
                    className={`relative inline-flex h-5 w-9 items-center transition-colors ${taskReminders ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-[#6d6d70]'
                      }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform bg-white dark:bg-gray-900 transition-transform ${taskReminders ? 'translate-x-5' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-200 dark:border-[#3a3a3c]">
                <div className="p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-200/60 dark:border-red-800/20 rounded-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full"></div>
                    <label className="text-xs font-semibold text-red-600 dark:text-red-400">
                      Danger Zone
                    </label>
                  </div>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-4">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700/50 py-2 text-xs"
                    >
                      Export All Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700/50 py-2 text-xs"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sharp Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-[#3a3a3c] bg-gray-50 dark:bg-[#1c1c1e]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            className="text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] px-3 py-2 text-xs transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 dark:text-[#a1a1a6] hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3a3a3c] px-4 py-2 text-xs transition-colors"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 text-xs shadow-sm transition-all"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};