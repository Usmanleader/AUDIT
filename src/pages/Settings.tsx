import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  LogOut,
  Camera,
  Check,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  const [notifications, setNotifications] = useState({
    emailFindings: true,
    emailAudits: true,
    emailReports: false,
    pushFindings: true,
    pushAudits: false,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (user) {
        await supabase
          .from('profiles')
          .update({
            full_name: profileData.full_name,
            department: profileData.department,
          })
          .eq('id', user.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account preferences" />

      <div className="pt-20 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card padding="sm">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <hr className="my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              <>
                <Card>
                  <CardHeader title="Profile Information" subtitle="Update your personal details" />
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50">
                        <Camera className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{profileData.full_name || 'User'}</p>
                      <p className="text-sm text-slate-500">{user?.role || 'Auditor'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                    />

                    <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled
                      helpText="Email cannot be changed"
                    />

                    <Input
                      label="Department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      placeholder="Enter your department"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
                    {saved && (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        Saved successfully
                      </span>
                    )}
                    <Button onClick={handleSaveProfile} isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader title="Notification Preferences" subtitle="Control how you receive notifications" />
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Email Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">New Findings</p>
                          <p className="text-sm text-slate-500">Get notified when new findings are created</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailFindings}
                          onChange={(e) => setNotifications({ ...notifications, emailFindings: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">Audit Updates</p>
                          <p className="text-sm text-slate-500">Get notified about audit status changes</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailAudits}
                          onChange={(e) => setNotifications({ ...notifications, emailAudits: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">Report Generation</p>
                          <p className="text-sm text-slate-500">Get notified when reports are generated</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailReports}
                          onChange={(e) => setNotifications({ ...notifications, emailReports: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Push Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">Critical Findings</p>
                          <p className="text-sm text-slate-500">Get push notifications for critical findings</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushFindings}
                          onChange={(e) => setNotifications({ ...notifications, pushFindings: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-700">Audit Assignments</p>
                          <p className="text-sm text-slate-500">Get notified when assigned to audits</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushAudits}
                          onChange={(e) => setNotifications({ ...notifications, pushAudits: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button>Save Preferences</Button>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader title="Security Settings" subtitle="Manage your account security" />
                
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Key className="w-5 h-5 text-slate-600" />
                      <h4 className="font-medium text-slate-900">Change Password</h4>
                    </div>
                    <div className="space-y-3">
                      <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                      />
                      <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button className="mt-4">Update Password</Button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-slate-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-slate-600" />
                      <h4 className="font-medium text-slate-900">Active Sessions</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div>
                          <p className="font-medium text-slate-700">Current Session</p>
                          <p className="text-sm text-slate-500">Chrome on Windows • Active now</p>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Current</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardHeader title="Appearance" subtitle="Customize your interface" />
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Theme</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 border-2 border-indigo-500 rounded-lg text-center">
                        <div className="w-full h-20 bg-white rounded-lg mb-2 border" />
                        <span className="text-sm font-medium text-slate-700">Light</span>
                      </button>
                      <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-indigo-300">
                        <div className="w-full h-20 bg-slate-800 rounded-lg mb-2" />
                        <span className="text-sm font-medium text-slate-700">Dark</span>
                      </button>
                      <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-indigo-300">
                        <div className="w-full h-20 bg-gradient-to-b from-white to-slate-800 rounded-lg mb-2" />
                        <span className="text-sm font-medium text-slate-700">System</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Accent Color</h4>
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-indigo-500 ring-2 ring-offset-2 ring-indigo-500" />
                      <button className="w-10 h-10 rounded-full bg-emerald-500 hover:ring-2 hover:ring-offset-2 hover:ring-emerald-500" />
                      <button className="w-10 h-10 rounded-full bg-purple-500 hover:ring-2 hover:ring-offset-2 hover:ring-purple-500" />
                      <button className="w-10 h-10 rounded-full bg-rose-500 hover:ring-2 hover:ring-offset-2 hover:ring-rose-500" />
                      <button className="w-10 h-10 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-2 hover:ring-amber-500" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-3">Sidebar</h4>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
                      <span className="text-slate-700">Collapse sidebar by default</span>
                    </label>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
