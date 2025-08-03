import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { AnimatedButton } from './MicroInteractions';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Users,
  FileText,
  Globe,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from 'lucide-react';
import ResponsiveCard from './ResponsiveCard';
import InteractiveButton from './InteractiveButton';
import InteractiveInput from './InteractiveInput';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSettings, setSavedSettings] = useState<string[]>([]);
  const { addNotification } = useNotifications();

  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@familyhealthclinic.org',
    phone: '(555) 123-4567',
    title: 'Family Nurse Practitioner',
    department: 'Primary Care',
    license: 'NP-12345',
    npi: '1234567890'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    complianceAlerts: true,
    systemUpdates: false,
    patientMessages: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginNotifications: true
  });

  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'compliance', label: 'Compliance', icon: FileText },
    { id: 'integration', label: 'Integrations', icon: Globe }
  ];

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavedSettings([...savedSettings, section]);
    setIsSaving(false);
    
    // Remove success indicator after 3 seconds
    setTimeout(() => {
      setSavedSettings(savedSettings.filter(s => s !== section));
    }, 3000);
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <ResponsiveCard title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InteractiveInput
            label="First Name"
            value={profileData.firstName}
            onChange={(value) => setProfileData({...profileData, firstName: value})}
            required
          />
          <InteractiveInput
            label="Last Name"
            value={profileData.lastName}
            onChange={(value) => setProfileData({...profileData, lastName: value})}
            required
          />
          <InteractiveInput
            label="Email Address"
            type="email"
            value={profileData.email}
            onChange={(value) => setProfileData({...profileData, email: value})}
            required
          />
          <InteractiveInput
            label="Phone Number"
            value={profileData.phone}
            onChange={(value) => setProfileData({...profileData, phone: value})}
          />
        </div>
        <div className="flex justify-end mt-4">
          <AnimatedButton 
            variant="primary" 
            onClick={() => handleSave('profile')}
            animation="glow"
            icon={savedSettings.includes('profile') ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {savedSettings.includes('profile') ? 'Saved' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </ResponsiveCard>

      <ResponsiveCard title="Professional Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InteractiveInput
            label="Job Title"
            value={profileData.title}
            onChange={(value) => setProfileData({...profileData, title: value})}
          />
          <InteractiveInput
            label="Department"
            value={profileData.department}
            onChange={(value) => setProfileData({...profileData, department: value})}
          />
          <InteractiveInput
            label="License Number"
            value={profileData.license}
            onChange={(value) => setProfileData({...profileData, license: value})}
          />
          <InteractiveInput
            label="NPI Number"
            value={profileData.npi}
            onChange={(value) => setProfileData({...profileData, npi: value})}
          />
        </div>
        <div className="flex justify-end mt-4">
          <AnimatedButton 
            variant="primary" 
            onClick={() => handleSave('professional')}
            animation="glow"
            icon={savedSettings.includes('professional') ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {savedSettings.includes('professional') ? 'Saved' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </ResponsiveCard>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <ResponsiveCard title="Notification Preferences">
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-xs text-gray-500">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'smsNotifications' && 'Receive notifications via SMS'}
                  {key === 'appointmentReminders' && 'Get reminders for upcoming appointments'}
                  {key === 'complianceAlerts' && 'Alerts for compliance issues'}
                  {key === 'systemUpdates' && 'Notifications about system updates'}
                  {key === 'patientMessages' && 'Notifications for patient messages'}
                </p>
              </div>
              <button
                onClick={() => setNotificationSettings({
                  ...notificationSettings,
                  [key]: !value
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <AnimatedButton 
            variant="primary" 
            onClick={() => handleSave('notifications')}
            animation="glow"
            icon={savedSettings.includes('notifications') ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {savedSettings.includes('notifications') ? 'Saved' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </ResponsiveCard>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <ResponsiveCard title="Password & Authentication">
        <div className="space-y-4">
          <InteractiveInput
            label="Current Password"
            type="password"
            value=""
            onChange={() => {}}
            placeholder="Enter current password"
          />
          <InteractiveInput
            label="New Password"
            type="password"
            value=""
            onChange={() => {}}
            placeholder="Enter new password"
          />
          <InteractiveInput
            label="Confirm New Password"
            type="password"
            value=""
            onChange={() => {}}
            placeholder="Confirm new password"
          />
        </div>
        <div className="flex justify-end mt-4">
          <InteractiveButton variant="primary" icon={<Save className="h-4 w-4" />}>
            Update Password
          </InteractiveButton>
        </div>
      </ResponsiveCard>

      <ResponsiveCard title="Security Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => setSecuritySettings({
                ...securitySettings,
                twoFactorAuth: !securitySettings.twoFactorAuth
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InteractiveInput
              label="Session Timeout (minutes)"
              type="select"
              value={securitySettings.sessionTimeout}
              onChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
              options={['15', '30', '60', '120', 'Never']}
            />
            <InteractiveInput
              label="Password Expiry (days)"
              type="select"
              value={securitySettings.passwordExpiry}
              onChange={(value) => setSecuritySettings({...securitySettings, passwordExpiry: value})}
              options={['30', '60', '90', '180', 'Never']}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <AnimatedButton 
            variant="primary" 
            onClick={() => handleSave('security')}
            animation="glow"
            icon={savedSettings.includes('security') ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {savedSettings.includes('security') ? 'Saved' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </ResponsiveCard>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <ResponsiveCard title="Theme & Display">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map(theme => (
                <button
                  key={theme}
                  onClick={() => setSystemSettings({...systemSettings, theme})}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    systemSettings.theme === theme
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded ${
                    theme === 'light' ? 'bg-white border border-gray-300' :
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-white to-gray-800'
                  }`}></div>
                  <p className="text-sm font-medium capitalize">{theme}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <AnimatedButton 
            variant="primary" 
            onClick={() => handleSave('appearance')}
            animation="glow"
            icon={savedSettings.includes('appearance') ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {savedSettings.includes('appearance') ? 'Saved' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </ResponsiveCard>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <ResponsiveCard title="Regional Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InteractiveInput
            label="Language"
            type="select"
            value={systemSettings.language}
            onChange={(value) => setSystemSettings({...systemSettings, language: value})}
            options={['en', 'es', 'fr']}
          />
          <InteractiveInput
            label="Timezone"
            type="select"
            value={systemSettings.timezone}
            onChange={(value) => setSystemSettings({...systemSettings, timezone: value})}
            options={['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles']}
          />
          <InteractiveInput
            label="Date Format"
            type="select"
            value={systemSettings.dateFormat}
            onChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}
            options={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']}
          />
          <InteractiveInput
            label="Time Format"
            type="select"
            value={systemSettings.timeFormat}
            onChange={(value) => setSystemSettings({...systemSettings, timeFormat: value})}
            options={['12', '24']}
          />
        </div>
        <div className="flex justify-end mt-4">
          <AnimatedButton 
            variant="primary" 
            onClick={() => handleSave('system')}
            animation="glow"
            icon={savedSettings.includes('system') ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {savedSettings.includes('system') ? 'Saved' : 'Save Changes'}
          </AnimatedButton>
        </div>
      </ResponsiveCard>

      <ResponsiveCard title="Data & Backup">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-blue-900">Automatic Backup</h4>
              <p className="text-xs text-blue-700">Last backup: 2 hours ago</p>
            </div>
            <InteractiveButton variant="secondary" size="sm">
              Configure
            </InteractiveButton>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-green-900">Data Sync</h4>
              <p className="text-xs text-green-700">All data synchronized</p>
            </div>
            <InteractiveButton variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
              Sync Now
            </InteractiveButton>
          </div>
        </div>
      </ResponsiveCard>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="text-center py-12">
      <SettingsIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-2">{title} Settings</p>
      <p className="text-sm text-gray-400">Advanced configuration options coming soon</p>
    </div>
  );

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account, preferences, and system configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <ResponsiveCard title="Settings" size="sm">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </ResponsiveCard>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'appearance' && renderAppearance()}
          {activeTab === 'system' && renderSystem()}
          {activeTab === 'users' && renderPlaceholder('User Management')}
          {activeTab === 'compliance' && renderPlaceholder('Compliance')}
          {activeTab === 'integration' && renderPlaceholder('Integration')}
        </div>
      </div>
    </div>
  );
}