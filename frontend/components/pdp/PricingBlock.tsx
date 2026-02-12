import React from 'react';
import { Tag, TrendingDown, Info } from 'lucide-react';
import { formatPrice } from '../../types';

interface PricingBlockProps {
    price: number;
    mrp: number;
    bankOffers?: string[];
}

const PricingBlock: React.FC<PricingBlockProps> = ({ price, mrp, bankOffers = [] }) => {
    const discount = Math.round(((mrp - price) / mrp) * 100);
    const savings = mrp - price;

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <div className="flex items-end gap-3">
                    <span className="text-red-500 font-medium text-lg md:text-xl">-{discount}%</span>
                    <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-none">
                        {formatPrice(price).replace('.00', '')}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm md:text-base">
                    <span>M.R.P.:</span>
                    <span className="line-through">{formatPrice(mrp).replace('.00', '')}</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                        (Inclusive of all taxes)
                    </span>
                </div>
                {savings > 0 && (
                    <div className="text-green-600 font-medium text-sm">
                        You Save: {formatPrice(savings).replace('.00', '')}
                    </div>
                )}
            </div>

            {/* Bank Offers */}
            {bankOffers.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                        <Tag size={18} className="text-green-600" />
                        <span>Bank Offers</span>
                    </div>
                    <ul className="space-y-2">
                        {bankOffers.map((offer, idx) => (
                            <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">•</span>
                                {offer}
                                <button className="text-primary-600 text-xs font-medium whitespace-nowrap hover:underline ml-1">T&C</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* EMI Option Teaser */}
            <div className="flex items-center gap-2 text-sm">
                <button className="text-primary-600 font-medium hover:underline">View EMI Plans</button>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">Starting from {formatPrice(Math.round(price / 12))}/mo</span>
            </div>
        </div>
    );
};

export default PricingBlock;
