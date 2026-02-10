import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Package, MapPin, Heart, Settings, LogOut,
    ChevronRight, Edit2, Plus, Trash2, Shield, Bell,
    CreditCard, HelpCircle, Gift, Clock, Star, ShoppingBag,
    Mail, Phone, Camera, Check, X, AlertCircle, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Button from '../components/ui/Button';
import OrderManagementModal from '../components/OrderManagementModal';

// Tabs for profile sections
type TabType = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    type: 'home' | 'work' | 'other';
}

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    items: { name: string; quantity: number; image: string; price: number }[];
}

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { items: wishlistItems } = useWishlist();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editProfile, setEditProfile] = useState({
        name: user?.name || '',
        phone: '',
        email: user?.email || ''
    });

    // Sample data - in real app, fetch from API
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            name: user?.name || 'User',
            phone: '+91 9876543210',
            address: '123 Main Street, Sector 15',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            isDefault: true,
            type: 'home'
        }
    ]);

    const [orders, setOrders] = useState<Order[]>([
        {
            id: 'ORD-001',
            date: '2026-02-08',
            total: 299.99,
            status: 'delivered',
            items: [
                { name: 'Wireless Headphones', quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', price: 199.99 },
                { name: 'Phone Case', quantity: 2, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100', price: 49.99 }
            ]
        },
        {
            id: 'ORD-002',
            date: '2026-02-05',
            total: 149.99,
            status: 'processing',
            items: [
                { name: 'USB-C Cable Pack', quantity: 1, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100', price: 29.99 },
                { name: 'Bluetooth Speaker', quantity: 1, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100', price: 119.99 }
            ]
        },
        {
            id: 'ORD-003',
            date: '2026-02-03',
            total: 89.99,
            status: 'shipped',
            items: [
                { name: 'Smart Watch Band', quantity: 2, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100', price: 44.99 }
            ]
        }
    ]);

    const [newAddress, setNewAddress] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home' as 'home' | 'work' | 'other'
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSaveProfile = () => {
        // In real app, save to backend
        setIsEditing(false);
    };

    const handleAddAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.pincode) return;

        const addr: Address = {
            id: Date.now().toString(),
            ...newAddress,
            isDefault: addresses.length === 0
        };
        setAddresses([...addresses, addr]);
        setShowAddAddress(false);
        setNewAddress({ name: user?.name || '', phone: '', address: '', city: '', state: '', pincode: '', type: 'home' });
    };

    const handleDeleteAddress = (id: string) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const handleSetDefaultAddress = (id: string) => {
        setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'returned': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleManageOrder = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handleOrderAction = (action: string, orderId: string) => {
        // Update order status based on action
        setOrders(orders.map(o => {
            if (o.id === orderId) {
                if (action === 'cancel') return { ...o, status: 'cancelled' as const };
                if (action === 'return' || action === 'replace') return { ...o, status: 'returned' as const };
            }
            return o;
        }));
    };

    const tabs = [
        { id: 'overview' as TabType, label: 'Overview', icon: User },
        { id: 'orders' as TabType, label: 'My Orders', icon: Package },
        { id: 'addresses' as TabType, label: 'Addresses', icon: MapPin },
        { id: 'wishlist' as TabType, label: 'Wishlist', icon: Heart },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    ];

    const quickActions = [
        { icon: Package, label: 'Track Order', onClick: () => setActiveTab('orders') },
        { icon: Heart, label: 'Wishlist', onClick: () => setActiveTab('wishlist') },
        { icon: MapPin, label: 'Addresses', onClick: () => setActiveTab('addresses') },
        { icon: HelpCircle, label: 'Help Center', onClick: () => alert('Help Center coming soon') },
        { icon: Gift, label: 'Rewards', onClick: () => alert('Rewards program coming soon') },
        { icon: Bell, label: 'Notifications', onClick: () => alert('Notifications coming soon') },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/30 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-primary-600 shadow-lg hover:bg-slate-100 transition">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{user?.name || 'Welcome!'}</h1>
                        <p className="text-white/80">{user?.email}</p>
                        <div className="flex gap-4 mt-3">
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                <Star size={14} className="inline mr-1" /> Premium Member
                            </span>
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                <ShoppingBag size={14} className="inline mr-1" /> {orders.length} Orders
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${activeTab === tab.id
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <tab.icon size={20} />
                                    {tab.label}
                                    {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                                        <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                    {tab.id === 'orders' && orders.length > 0 && (
                                        <span className="ml-auto bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs px-2 py-0.5 rounded-full">
                                            {orders.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        {/* Security Badge */}
                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <Shield size={18} />
                                <span className="text-sm font-medium">Account Secured</span>
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-500 mt-1">Your account is protected</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={action.onClick}
                                            className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition group"
                                        >
                                            <action.icon size={24} className="text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400 text-center">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Personal Info */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                        <Edit2 size={14} /> {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={editProfile.name}
                                                onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={editProfile.email}
                                                disabled
                                                className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={editProfile.phone}
                                                onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                                                placeholder="+91 XXXXXXXXXX"
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                                            />
                                        </div>
                                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <User className="text-slate-400" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Full Name</p>
                                                <p className="text-slate-900 dark:text-white font-medium">{user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <Mail className="text-slate-400" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Email Address</p>
                                                <p className="text-slate-900 dark:text-white font-medium">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <Phone className="text-slate-400" size={20} />
                                            <div>
                                                <p className="text-xs text-slate-500">Phone Number</p>
                                                <p className="text-slate-900 dark:text-white font-medium">Not added yet</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recent Orders Preview */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className="text-primary-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                        View All <ChevronRight size={14} />
                                    </button>
                                </div>
                                {orders.slice(0, 2).map(order => (
                                    <div key={order.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl mb-3 last:mb-0">
                                        <div className="flex -space-x-2">
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <img key={i} src={item.image} alt={item.name} className="w-12 h-12 rounded-lg border-2 border-white dark:border-slate-800 object-cover" />
                                            ))}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white">{order.id}</p>
                                            <p className="text-sm text-slate-500">{order.items.length} items • ${order.total}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">My Orders</h2>
                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500">No orders yet</p>
                                    <Button className="mt-4" onClick={() => navigate('/shop')}>Start Shopping</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                            <div className="bg-slate-50 dark:bg-slate-900 p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{order.id}</p>
                                                    <p className="text-sm text-slate-500">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">${item.price}</p>
                                                    </div>
                                                ))}
                                                <div className="flex items-center justify-between pt-4">
                                                    <p className="font-bold text-slate-900 dark:text-white">Total: ${order.total}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm">Track Order</Button>
                                                        {order.status === 'delivered' && <Button size="sm">Reorder</Button>}
                                                        {(order.status === 'processing' || order.status === 'delivered') && (
                                                            <button
                                                                onClick={() => handleManageOrder(order)}
                                                                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                                                                title="Manage Order"
                                                            >
                                                                <MoreHorizontal size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Saved Addresses</h2>
                                <Button onClick={() => setShowAddAddress(!showAddAddress)} size="sm">
                                    <Plus size={16} className="mr-1" /> Add Address
                                </Button>
                            </div>

                            {showAddAddress && (
                                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-600">
                                    <h3 className="font-medium text-slate-900 dark:text-white mb-4">Add New Address</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                        <input placeholder="Phone Number" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                        <input placeholder="Address" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} className="col-span-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                        <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                        <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                        <input placeholder="PIN Code" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                                        <select value={newAddress.type} onChange={e => setNewAddress({ ...newAddress, type: e.target.value as any })} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <option value="home">Home</option>
                                            <option value="work">Work</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button onClick={handleAddAddress}>Save Address</Button>
                                        <Button variant="outline" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className={`p-4 rounded-xl border-2 ${addr.isDefault ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-900 dark:text-white">{addr.name}</span>
                                                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full capitalize">{addr.type}</span>
                                                    {addr.isDefault && <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">Default</span>}
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1">{addr.phone}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {!addr.isDefault && (
                                                    <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs text-primary-600 hover:underline">Set as Default</button>
                                                )}
                                                <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'wishlist' && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">My Wishlist</h2>
                            {wishlistItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500">Your wishlist is empty</p>
                                    <Button className="mt-4" onClick={() => navigate('/shop')}>Explore Products</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {wishlistItems.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-lg font-bold text-primary-600">${item.price}</p>
                                            </div>
                                            <Button size="sm" onClick={() => navigate(`/product/${item.id}`)}>View</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Account Settings</h2>

                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                        <div className="flex items-center gap-3">
                                            <Bell className="text-slate-500" size={20} />
                                            <div className="text-left">
                                                <p className="font-medium text-slate-900 dark:text-white">Notifications</p>
                                                <p className="text-sm text-slate-500">Manage email & push notifications</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-400" size={20} />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="text-slate-500" size={20} />
                                            <div className="text-left">
                                                <p className="font-medium text-slate-900 dark:text-white">Payment Methods</p>
                                                <p className="text-sm text-slate-500">Manage saved cards & UPI</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-400" size={20} />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                        <div className="flex items-center gap-3">
                                            <Shield className="text-slate-500" size={20} />
                                            <div className="text-left">
                                                <p className="font-medium text-slate-900 dark:text-white">Privacy & Security</p>
                                                <p className="text-sm text-slate-500">Password, 2FA, login history</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-400" size={20} />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                        <div className="flex items-center gap-3">
                                            <HelpCircle className="text-slate-500" size={20} />
                                            <div className="text-left">
                                                <p className="font-medium text-slate-900 dark:text-white">Help & Support</p>
                                                <p className="text-sm text-slate-500">FAQs, contact support, feedback</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-400" size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">Danger Zone</h3>
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
                                <div className="space-y-2">
                                    <button className="flex items-center gap-2 text-red-600 hover:underline text-sm">
                                        <X size={16} /> Deactivate Account
                                    </button>
                                    <button className="flex items-center gap-2 text-red-600 hover:underline text-sm">
                                        <Trash2 size={16} /> Delete Account Permanently
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Management Modal */}
            <OrderManagementModal
                isOpen={showOrderModal}
                onClose={() => setShowOrderModal(false)}
                order={selectedOrder}
                onSuccess={handleOrderAction}
            />
        </div>
    );
};

export default Profile;
