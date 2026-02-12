import React, { useState } from 'react';
import { MapPin, Plus, Edit2, CheckCircle2 } from 'lucide-react';
import { Address } from '../../types';
import Button from '../ui/Button';

interface AddressStepProps {
    selectedAddressId: string | null;
    onSelectAddress: (address: Address) => void;
    onNext: () => void;
}

// Mock Addresses
const MOCK_ADDRESSES: Address[] = [
    {
        id: 'addr_1',
        name: 'Ayush Mishra',
        phone: '+91 9876543210',
        address: '123, Tech Park Residency, Sector 45',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122003',
        isDefault: true,
    },
    {
        id: 'addr_2',
        name: 'Ayush Mishra (Office)',
        phone: '+91 9876543210',
        address: 'WeWork Forum, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        isDefault: false,
    }
];

const AddressStep: React.FC<AddressStepProps> = ({ selectedAddressId, onSelectAddress, onNext }) => {
    const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({});

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAddress.name && newAddress.address && newAddress.city && newAddress.pincode && newAddress.state && newAddress.phone) {
            const addr: Address = {
                id: `addr_${Date.now()}`,
                name: newAddress.name,
                phone: newAddress.phone,
                address: newAddress.address,
                city: newAddress.city,
                state: newAddress.state,
                pincode: newAddress.pincode,
            };
            setAddresses([...addresses, addr]);
            onSelectAddress(addr);
            setShowAddForm(false);
            setNewAddress({});
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="text-primary-600" /> Select Delivery Address
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                    <Plus size={16} /> Add New Address
                </button>
            </div>

            {!showAddForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            onClick={() => onSelectAddress(addr)}
                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300'
                                }`}
                        >
                            {selectedAddressId === addr.id && (
                                <div className="absolute top-4 right-4 text-primary-600">
                                    <CheckCircle2 size={24} className="fill-primary-100" />
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{addr.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                                        {addr.address}, <br />
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
                                        Mobile: {addr.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <form onSubmit={handleAddAddress} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required name="name" placeholder="Full Name" onChange={handleChange} className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                        <input required name="phone" placeholder="Phone Number" onChange={handleChange} className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                        <input required name="pincode" placeholder="Pincode" onChange={handleChange} className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                        <input required name="city" placeholder="City" onChange={handleChange} className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                        <input required name="state" placeholder="State" onChange={handleChange} className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                        <input required name="address" placeholder="Flat, House no., Building, Company, Apartment" onChange={handleChange} className="md:col-span-2 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <Button type="submit">Save & Deliver Here</Button>
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                </form>
            )}

            <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                    onClick={onNext}
                    disabled={!selectedAddressId}
                    size="lg"
                    className="px-8"
                >
                    Deliver Here
                </Button>
            </div>
        </div>
    );
};

export default AddressStep;
