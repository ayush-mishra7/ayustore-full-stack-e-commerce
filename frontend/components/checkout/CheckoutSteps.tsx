import React from 'react';
import { Check, MapPin, CreditCard, ClipboardList } from 'lucide-react';

interface CheckoutStepsProps {
    currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Address', icon: MapPin },
        { id: 2, label: 'Review', icon: ClipboardList },
        { id: 3, label: 'Payment', icon: CreditCard },
    ];

    return (
        <div className="w-full py-6 mb-8">
            <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                {/* Connector Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 transition-all duration-500 ease-in-out -z-10"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-transparent">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isCurrent
                                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                                    }`}
                            >
                                {isCompleted ? <Check size={20} /> : <Icon size={18} />}
                            </div>
                            <span
                                className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isCurrent || isCompleted
                                        ? 'text-slate-900 dark:text-white'
                                        : 'text-slate-400'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutSteps;
