import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Building2, ShieldCheck, Lock } from 'lucide-react';
import { PaymentMethodType, formatPrice } from '../../types';
import Button from '../ui/Button';

interface PaymentStepProps {
    totalAmount: number;
    onPayment: (method: PaymentMethodType) => void;
    onBack: () => void;
    loading: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ totalAmount, onPayment, onBack, loading }) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);

    const methods = [
        { id: 'upi', type: 'UPI', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
        { id: 'card', type: 'CARD', label: 'Credit / Debit / ATM Card', sub: 'Visa, MasterCard, Rupay', icon: CreditCard },
        { id: 'netbanking', type: 'NETBANKING', label: 'Net Banking', sub: 'All Indian banks supported', icon: Building2 },
        { id: 'cod', type: 'COD', label: 'Cash on Delivery', sub: 'Pay efficiently upon delivery', icon: Banknote },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Lock size={16} className="text-green-600" />
                        Choose Payment Mode
                    </h3>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {methods.map((method) => {
                        const Icon = method.icon;
                        return (
                            <div
                                key={method.id}
                                onClick={() => setSelectedMethod(method.type as PaymentMethodType)}
                                className={`p-5 flex items-start gap-4 cursor-pointer transition-colors ${selectedMethod === method.type
                                        ? 'bg-primary-50 dark:bg-primary-900/10'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.type ? 'border-primary-600' : 'border-slate-300'
                                    }`}>
                                    {selectedMethod === method.type && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2 bg-white dark:bg-slate-700 rounded shadow-sm">
                                            <Icon size={20} className="text-slate-700 dark:text-slate-300" />
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">{method.label}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 pl-[3.25rem]">
                                        {method.sub}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} />
                <span>100% Secure Transaction. SSL Encrypted.</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" onClick={onBack} disabled={loading}>Back</Button>
                <Button
                    onClick={() => selectedMethod && onPayment(selectedMethod)}
                    disabled={!selectedMethod || loading}
                    size="lg"
                    className="px-8 min-w-[200px]"
                >
                    {loading ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}
                </Button>
            </div>
        </div>
    );
};

export default PaymentStep;
