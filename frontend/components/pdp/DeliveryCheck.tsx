import React, { useState } from 'react';
import { MapPin, Truck, Check, Calendar } from 'lucide-react';

interface DeliveryCheckProps {
    freeDelivery: boolean;
    estimatedDays: number;
}

const DeliveryCheck: React.FC<DeliveryCheckProps> = ({ freeDelivery, estimatedDays }) => {
    const [pincode, setPincode] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheck = () => {
        if (pincode.length !== 6) return;
        setLoading(true);
        setTimeout(() => {
            setChecked(true);
            setLoading(false);
        }, 800);
    };

    // Calculate delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
    const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'short'
    });

    return (
        <div className="border-t border-b border-slate-100 dark:border-slate-800 py-6 space-y-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-white mb-2">
                <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-slate-400" />
                    Delivery to
                </span>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, ''));
                        setChecked(false);
                    }}
                    className="w-40 border-b-2 border-slate-200 dark:border-slate-700 bg-transparent py-1 px-1 focus:border-primary-600 outline-none text-slate-900 dark:text-white font-medium"
                />
                <button
                    onClick={handleCheck}
                    disabled={pincode.length !== 6 || loading}
                    className="text-sm font-bold text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Checking...' : 'Check'}
                </button>
            </div>

            {checked && (
                <div className="space-y-3 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-700 p-1.5 rounded-full">
                            <Truck size={16} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
                                Get it by <span className="text-green-600">{formattedDate}</span>
                            </p>
                            {freeDelivery && (
                                <span className="text-xs text-slate-500">Free Delivery </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-8 flex justify-center text-primary-600"><Check size={16} /></span>
                        <span>Cash on Delivery Available</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="w-8 flex justify-center text-primary-600"><Check size={16} /></span>
                        <span>7 Days Replacement Policy</span>
                    </div>
                </div>
            )}

            {!checked && (
                <p className="text-xs text-slate-500">Enter your pincode to check delivery date and availability.</p>
            )}
        </div>
    );
};

export default DeliveryCheck;
