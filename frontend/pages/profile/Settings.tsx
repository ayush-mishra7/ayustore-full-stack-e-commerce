import React, { useState } from 'react';
import { User, Lock, Bell, Eye, EyeOff, Shield, LogOut } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
    const { user, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    // Mock settings state
    const [notifications, setNotifications] = useState({
        emailOrder: true,
        emailPromo: false,
        smsOrder: true,
        pushOrder: true
    });

    return (
        <div className="max-w-4xl space-y-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>

            {/* Profile Edit Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Details</h2>
                        <p className="text-slate-500 text-sm">Update your public profile information.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <input type="text" defaultValue={user?.name} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input type="email" defaultValue={user?.email} disabled className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                        <input type="tel" placeholder="+91" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h2>
                        <p className="text-slate-500 text-sm">Manage your password and 2FA settings.</p>
                    </div>
                </div>

                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                        <input type="password" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl" />
                    </div>
                    <Button variant="outline">Update Password</Button>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                                <p className="text-xs text-slate-500">Add an extra layer of security.</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full border border-slate-200 cursor-pointer bg-slate-100">
                                <span className="translate-x-0 inline-block w-6 h-6 transform bg-white rounded-full shadow ring-0 transition duration-200 ease-in-out"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                        <p className="text-slate-500 text-sm">Choose what we get in touch about.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { id: 'emailOrder', label: 'Order Updates via Email', desc: 'Get notified when your order is shipped or delivered.' },
                        { id: 'smsOrder', label: 'Order Updates via SMS', desc: 'Receive delivery updates on your mobile.' },
                        { id: 'emailPromo', label: 'Promotional Emails', desc: 'Be the first to know about sales and offers.' },
                    ].map((item: any) => (
                        <div key={item.id} className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.label}</h3>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={(notifications as any)[item.id]}
                                onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl p-8 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-red-600 dark:text-red-400 mb-6">Irreversible actions regarding your account.</p>

                <div className="flex gap-4">
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20">Deactivate Account</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white border-none">Delete Account</Button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
