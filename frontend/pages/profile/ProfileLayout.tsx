import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    User, Package, MapPin, Heart, Settings, LogOut,
    Shield, Bell, HelpCircle, Gift, Camera, Star, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const ProfileLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { items: wishlistItems } = useWishlist();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/profile', label: 'Overview', icon: User, exact: true },
        { path: '/profile/orders', label: 'My Orders', icon: Package },
        { path: '/profile/addresses', label: 'Addresses', icon: MapPin },
        { path: '/profile/wishlist', label: 'Wishlist', icon: Heart },
        { path: '/profile/rewards', label: 'Rewards', icon: Gift },
        { path: '/profile/notifications', label: 'Notifications', icon: Bell },
        { path: '/profile/help', label: 'Help Center', icon: HelpCircle },
        { path: '/profile/settings', label: 'Settings', icon: Settings },
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30 overflow-hidden backdrop-blur-sm">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-primary-600 shadow-lg group-hover:bg-slate-50 transition transform group-hover:scale-110">
                            <Camera size={16} />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold">{user?.name || 'Welcome!'}</h1>
                        <p className="text-white/80">{user?.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                            <span className="inline-flex items-center text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition backdrop-blur-sm border border-white/10">
                                <Star size={12} className="mr-1.5 text-yellow-300 fill-yellow-300" /> Premium Member
                            </span>
                            <span className="inline-flex items-center text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition backdrop-blur-sm border border-white/10">
                                <ShoppingBag size={12} className="mr-1.5" /> 12 Orders
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition backdrop-blur-sm border border-white/10"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24 overflow-hidden">
                        <nav className="p-3 space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${isActive(item.path, item.exact)
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className={isActive(item.path, item.exact) ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.label === 'Wishlist' && wishlistItems.length > 0 && (
                                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs px-2 py-0.5 rounded-full font-medium">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Security Badge */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                                <Shield size={18} className="flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5">100% Secure</p>
                                    <p className="text-[10px] opacity-80 leading-tight">Your account data is encrypted & protected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
