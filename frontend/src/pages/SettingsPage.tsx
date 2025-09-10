import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { BellIcon, UserIcon, LockIcon, MonitorIcon, GlobeIcon, CheckIcon } from 'lucide-react';
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  return <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <UserIcon className="w-5 h-5 inline mr-2" />
                Profile
              </button>
              <button onClick={() => setActiveTab('security')} className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <LockIcon className="w-5 h-5 inline mr-2" />
                Security
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <BellIcon className="w-5 h-5 inline mr-2" />
                Notifications
              </button>
              <button onClick={() => setActiveTab('display')} className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'display' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <MonitorIcon className="w-5 h-5 inline mr-2" />
                Display
              </button>
              <button onClick={() => setActiveTab('language')} className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'language' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <GlobeIcon className="w-5 h-5 inline mr-2" />
                Language
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'profile' && <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Profile Information
                </h2>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl">
                    <UserIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <Button variant="outline" size="small">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input type="text" name="first-name" id="first-name" defaultValue="Demo" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input type="text" name="last-name" id="last-name" defaultValue="User" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input type="email" name="email" id="email" defaultValue="demo@example.com" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input type="tel" name="phone" id="phone" defaultValue="+1 (555) 123-4567" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea id="bio" name="bio" rows={3} defaultValue="I'm interested in sign language translation technology." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>}
            {activeTab === 'security' && <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Security Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Change Password
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <input type="password" name="current-password" id="current-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input type="password" name="new-password" id="new-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input type="password" name="confirm-password" id="confirm-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Two-Factor Authentication
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account by
                          enabling two-factor authentication.
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button variant="secondary" size="small">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Sessions
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        You're currently signed in on these devices:
                      </p>
                      <ul className="mt-3 divide-y divide-gray-100 border border-gray-200 rounded-md">
                        <li className="flex items-center justify-between py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Chrome on Windows
                            </p>
                            <p className="text-xs text-gray-500">
                              192.168.1.100 • Current session
                            </p>
                          </div>
                          <div className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
                            <span className="text-xs text-gray-500">
                              Active now
                            </span>
                          </div>
                        </li>
                        <li className="flex items-center justify-between py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Safari on iPhone
                            </p>
                            <p className="text-xs text-gray-500">
                              86.75.30.9 • Last active 2 days ago
                            </p>
                          </div>
                          <Button variant="outline" size="small">
                            Sign Out
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>}
            {activeTab === 'notifications' && <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Notification Preferences
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="comments" name="comments" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="comments" className="font-medium text-gray-700">
                            Detection Results
                          </label>
                          <p className="text-gray-500">
                            Get notified when your sign language detection
                            results are ready.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="accuracy" name="accuracy" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="accuracy" className="font-medium text-gray-700">
                            Accuracy Reports
                          </label>
                          <p className="text-gray-500">
                            Receive weekly reports about your detection accuracy
                            and improvements.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="updates" name="updates" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="updates" className="font-medium text-gray-700">
                            Product Updates
                          </label>
                          <p className="text-gray-500">
                            Get notified about new features and improvements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Push Notifications
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="push-everything" name="push-notifications" type="radio" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push-everything" className="font-medium text-gray-700">
                            Everything
                          </label>
                          <p className="text-gray-500">
                            Receive all push notifications.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="push-important" name="push-notifications" type="radio" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push-important" className="font-medium text-gray-700">
                            Important Only
                          </label>
                          <p className="text-gray-500">
                            Only receive notifications for important events.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="push-none" name="push-notifications" type="radio" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="push-none" className="font-medium text-gray-700">
                            None
                          </label>
                          <p className="text-gray-500">
                            Don't receive any push notifications.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>}
            {activeTab === 'display' && <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Display Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">Theme</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input id="light" name="theme" type="radio" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700">
                          Light
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input id="dark" name="theme" type="radio" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700">
                          Dark
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input id="system" name="theme" type="radio" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        <label htmlFor="system" className="ml-3 block text-sm font-medium text-gray-700">
                          System Default
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
                      Video Display Settings
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="video-quality" className="block text-sm font-medium text-gray-700">
                          Video Quality
                        </label>
                        <select id="video-quality" name="video-quality" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option>Low (360p)</option>
                          <option selected>Medium (720p)</option>
                          <option>High (1080p)</option>
                        </select>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="mirror-video" name="mirror-video" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="mirror-video" className="font-medium text-gray-700">
                            Mirror Video
                          </label>
                          <p className="text-gray-500">
                            Flip the webcam feed horizontally to make it easier
                            to position yourself.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>}
            {activeTab === 'language' && <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Language Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="interface-language" className="block text-sm font-medium text-gray-700">
                      Interface Language
                    </label>
                    <select id="interface-language" name="interface-language" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option selected>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese (Simplified)</option>
                      <option>Japanese</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="translation-language" className="block text-sm font-medium text-gray-700">
                      Translation Output Language
                    </label>
                    <select id="translation-language" name="translation-language" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option selected>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese (Simplified)</option>
                      <option>Japanese</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      This is the language that sign language will be translated
                      into.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="sign-language" className="block text-sm font-medium text-gray-700">
                      Sign Language Type
                    </label>
                    <select id="sign-language" name="sign-language" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option selected>American Sign Language (ASL)</option>
                      <option>British Sign Language (BSL)</option>
                      <option>Australian Sign Language (Auslan)</option>
                      <option>French Sign Language (LSF)</option>
                      <option>Chinese Sign Language (CSL)</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      This is the type of sign language you're using for
                      detection.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default SettingsPage;