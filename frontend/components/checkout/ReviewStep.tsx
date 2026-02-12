import React, { useState } from 'react';
import { Package, Truck, ShieldCheck, Tag, Info } from 'lucide-react';
import { CartItem, Address, formatPrice } from '../../types';
import Button from '../ui/Button';

interface ReviewStepProps {
    items: CartItem[];
    address: Address | null;
    onNext: () => void;
    onBack: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ items, address, onNext, onBack }) => {
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [errorLine, setErrorLine] = useState('');

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharges = subtotal > 499 ? 0 : 40;
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const totalAmount = subtotal + deliveryCharges - discountAmount;

    // Delivery Estimate (Mock: 3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'WELCOME10') {
            const disc = Math.round(subtotal * 0.1);
            setAppliedCoupon({ code: 'WELCOME10', discount: disc });
            setErrorLine('');
        } else {
            setErrorLine('Invalid Coupon Code');
            setAppliedCoupon(null);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    return (
        <div className="space-y-6">
            {/* Address Summary */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="mt-1 text-slate-400"><Truck size={20} /></div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delivering to {address?.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {address?.address}, {address?.city} - {address?.pincode}
                        </p>
                    </div>
                </div>
                <button onClick={onBack} className="text-xs font-semibold text-primary-600 hover:underline">
                    CHANGE
                </button>
            </div>

            {/* Items List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Package size={18} className="text-primary-600" />
                        Arriving by {formattedDate}
                    </h3>
                    {deliveryCharges === 0 && (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">FREE Delivery</span>
                    )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 flex gap-4">
                            <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Qty: {item.quantity}  •  Brand: {item.brand}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(item.price)}</span>
                                    {item.mrp > item.price && (
                                        <span className="text-xs text-slate-400 line-through">{formatPrice(item.mrp)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 text-primary-600"><ShieldCheck size={20} /></div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Protect your product</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add 1 Year Extended Warranty for just ₹199</p>
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add Warranty</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Coupon */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Tag size={16} /> Apply Coupon
                </h3>
                {!appliedCoupon ? (
                    <div className="flex gap-2">
                        <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter code"
                            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-sm"
                        />
                        <Button onClick={handleApplyCoupon} variant="outline" size="sm">Apply</Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800">
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            Code '{appliedCoupon.code}' applied!
                        </span>
                        <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:text-red-700">REMOVE</button>
                    </div>
                )}
                {errorLine && <p className="text-xs text-red-500 mt-2">{errorLine}</p>}
            </div>

            {/* Warnings / Info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p>Safe and Secure Payments. 100% Authentic Products.</p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" onClick={onBack}>Back</Button>
                <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Total Payable</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">{formatPrice(totalAmount)}</p>
                    <Button onClick={onNext} size="lg" className="px-8">Proceed to Payment</Button>
                </div>
            </div>
        </div>
    );
};

export default ReviewStep;
