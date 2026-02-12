import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, Tag, Shield, Info, Check } from 'lucide-react';
import { mockNotifications } from '../../data/profile';
import { Notification } from '../../types';

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
    // In a real app, state would be managed globally or fetched
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === 'unread') return !n.read;
        return true;
    });

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'order': return <ShoppingBag size={20} className="text-blue-500" />;
            case 'offer': return <Tag size={20} className="text-green-500" />;
            case 'security': return <Shield size={20} className="text-red-500" />;
            default: return <Info size={20} className="text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <button
                    onClick={markAllAsRead}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
                >
                    Mark all as read
                </button>
            </div>

            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'all' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter('unread')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeFilter === 'unread' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Unread
                </button>
            </div>

            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <Bell size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">No notifications found</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => {
                                markAsRead(notification.id);
                                if (notification.actionUrl) navigate(notification.actionUrl);
                            }}
                            className={`flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer hover:shadow-sm ${notification.read ? 'bg-white dark:bg-slate-800' : 'bg-blue-50/50 dark:bg-blue-900/10'
                                }`}
                        >
                            <div className="flex-shrink-0 mt-1 p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm border border-slate-100 dark:border-slate-600 h-10 w-10 flex items-center justify-center">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-semibold text-slate-900 dark:text-white ${!notification.read ? 'text-primary-900 dark:text-primary-100' : ''}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                        {new Date(notification.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{notification.message}</p>
                                {!notification.read && (
                                    <div className="flex justify-end mt-2">
                                        <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-primary-600"></div> New
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
