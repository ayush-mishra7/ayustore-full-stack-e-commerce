import React, { useState } from 'react';
import { Plus, MapPin, Trash2, Check, X, Home, Briefcase } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

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

const AddressManage: React.FC = () => {
    const { user } = useAuth();
    const [showAddForm, setShowAddForm] = useState(false);

    // Mock addresses - in real app fetch from API
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            name: user?.name || 'Ayush Mishra',
            phone: '+91 9876543210',
            address: '123, Tech Park, Sector 62',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201309',
            isDefault: true,
            type: 'home'
        },
        {
            id: '2',
            name: 'Ayush Mishra',
            phone: '+91 9876543210',
            address: '45, Corporate Tower, Cyber City',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            isDefault: false,
            type: 'work'
        }
    ]);

    const [newAddress, setNewAddress] = useState<Partial<Address>>({
        type: 'home',
        isDefault: false
    });

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation logic here
        const address: Address = {
            id: Date.now().toString(),
            name: newAddress.name || '',
            phone: newAddress.phone || '',
            address: newAddress.address || '',
            city: newAddress.city || '',
            state: newAddress.state || '',
            pincode: newAddress.pincode || '',
            type: newAddress.type || 'home',
            isDefault: addresses.length === 0 || newAddress.isDefault || false
        };

        if (address.isDefault) {
            setAddresses(addresses.map(a => ({ ...a, isDefault: false })).concat(address));
        } else {
            setAddresses([...addresses, address]);
        }

        setShowAddForm(false);
        setNewAddress({ type: 'home', isDefault: false });
    };

    const handleDelete = (id: string) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Addresses</h1>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={18} className="mr-2" /> Add New Address
                </Button>
            </div>

            {showAddForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-primary-100 dark:border-primary-900/30 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add New Address</h2>
                    <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input
                                required
                                type="text"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                value={newAddress.name || ''}
                                onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm">
                                    +91
                                </span>
                                <input
                                    required
                                    type="tel"
                                    maxLength={10}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-r-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    value={newAddress.phone || ''}
                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })}
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">PIN Code</label>
                            <input
                                required
                                type="text"
                                maxLength={6}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                value={newAddress.pincode || ''}
                                onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') })}
                                placeholder="6-digit PIN code"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address (House No, Building, Street, Area)</label>
                            <textarea
                                required
                                rows={2}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                                value={newAddress.address || ''}
                                onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                placeholder="Enter address details"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City / District</label>
                            <input
                                required
                                type="text"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                value={newAddress.city || ''}
                                onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                placeholder="Enter city"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State</label>
                            <select
                                required
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                value={newAddress.state || ''}
                                onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                            >
                                <option value="">Select State</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Haryana">Haryana</option>
                                {/* Add more states as needed */}
                            </select>
                        </div>

                        <div className="md:col-span-2 flex flex-col md:flex-row gap-6 mt-2">
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${newAddress.type === 'home' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                    <input type="radio" name="addressType" className="hidden" checked={newAddress.type === 'home'} onChange={() => setNewAddress({ ...newAddress, type: 'home' })} />
                                    <Home size={18} /> Home
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${newAddress.type === 'work' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                    <input type="radio" name="addressType" className="hidden" checked={newAddress.type === 'work'} onChange={() => setNewAddress({ ...newAddress, type: 'work' })} />
                                    <Briefcase size={18} /> Work
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${newAddress.type === 'other' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                    <input type="radio" name="addressType" className="hidden" checked={newAddress.type === 'other'} onChange={() => setNewAddress({ ...newAddress, type: 'other' })} />
                                    <MapPin size={18} /> Other
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                    checked={newAddress.isDefault}
                                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                />
                                <label htmlFor="isDefault" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer">Make this my default address</label>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex gap-3 mt-4">
                            <Button type="submit">Save Address</Button>
                            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(addr => (
                    <div key={addr.id} className={`group relative p-6 rounded-2xl border-2 transition-all ${addr.isDefault ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'}`}>
                        {addr.isDefault && (
                            <div className="absolute top-4 right-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Default
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                            <span className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                                {addr.type === 'home' ? <Home size={18} /> : addr.type === 'work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white capitalize">{addr.type}</span>
                        </div>

                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">{addr.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                            {addr.address}, <br />
                            {addr.city}, {addr.state} - <span className="font-medium text-slate-900 dark:text-white">{addr.pincode}</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex items-center gap-2">
                            PHONE: <span className="font-medium text-slate-900 dark:text-white">{addr.phone}</span>
                        </p>

                        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                                Edit
                            </button>
                            <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                            <button
                                onClick={() => handleDelete(addr.id)}
                                className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition"
                            >
                                Remove
                            </button>
                            {!addr.isDefault && (
                                <>
                                    <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="flex-1 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition"
                                    >
                                        Set Default
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressManage;
