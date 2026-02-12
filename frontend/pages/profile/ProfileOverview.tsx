import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, HelpCircle, Gift, Bell, ChevronRight, Edit2, Mail, Phone, User, Copy, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockOrders } from '../../data/profile';
import { formatPrice } from '../../types';
import Button from '../../components/ui/Button';

const ProfileOverview: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Mock user stats
    const stats = [
        { label: 'Total Orders', value: '12', icon: Package, color: 'bg-blue-500' },
        { label: 'Wishlist Items', value: '5', icon: Heart, color: 'bg-pink-500' },
        { label: 'Reward Points', value: '450', icon: Gift, color: 'bg-amber-500' },
    ];

    const quickActions = [
        { icon: Package, label: 'Track Order', path: '/profile/orders', desc: 'Check order status' },
        { icon: Heart, label: 'Wishlist', path: '/profile/wishlist', desc: 'View saved items' },
        { icon: MapPin, label: 'Addresses', path: '/profile/addresses', desc: 'Manage delivery' },
        { icon: HelpCircle, label: 'Help', path: '/profile/help', desc: 'Get support' },
    ];

    const recentOrders = mockOrders.slice(0, 2);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-${stat.color.replace('bg-', '')}/20`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <User size={20} className="text-primary-600" /> Personal Info
                        </h2>
                        <button
                            onClick={() => navigate('/profile/settings')}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-primary-600 transition-colors"
                        >
                            <Edit2 size={18} />
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Full Name</p>
                                <p className="text-slate-900 dark:text-white font-medium text-lg">{user?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Email Address</p>
                                <p className="text-slate-900 dark:text-white font-medium text-lg">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Phone Number</p>
                                <p className="text-slate-900 dark:text-white font-medium text-lg flex items-center gap-2">
                                    +91 98765 43210
                                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] rounded-full font-bold uppercase">Verified</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(action.path)}
                                className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:shadow-md transition-all group text-center h-full"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors mb-3">
                                    <action.icon size={24} />
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">{action.label}</span>
                                <span className="text-xs text-slate-500 mt-1">{action.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/profile/orders')}>
                        View All Orders <ChevronRight size={16} className="ml-1" />
                    </Button>
                </div>

                <div className="space-y-4">
                    {recentOrders.map(order => (
                        <div key={order.id} className="group border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer" onClick={() => navigate(`/profile/orders/${order.id}`)}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <img
                                                key={idx}
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-sm bg-gray-100"
                                            />
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            {order.items[0].name}
                                            {order.items.length > 1 && <span className="text-slate-500 font-normal text-sm">+ {order.items.length - 1} more</span>}
                                        </p>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <span>Order #{order.id}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span>{new Date(order.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-slate-100 text-slate-700'}
                                        `}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <ChevronRight className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
