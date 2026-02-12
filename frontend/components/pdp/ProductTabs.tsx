import React, { useState } from 'react';

interface ProductTabsProps {
    description: string;
    specifications: { key: string; value: string }[];
    warranty?: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ description, specifications, warranty }) => {
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'warranty'>('specs');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-100 dark:border-slate-700">
                {[
                    { id: 'specs', label: 'Specifications' },
                    { id: 'desc', label: 'Description' },
                    { id: 'warranty', label: 'Warranty' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === tab.id
                                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/10'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-6 md:p-8">
                {activeTab === 'desc' && (
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>{description}</p>
                    </div>
                )}

                {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        {specifications.map((spec, idx) => (
                            <div key={idx} className="flex border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0">
                                <span className="w-1/3 text-slate-500 text-sm font-medium">{spec.key}</span>
                                <span className="w-2/3 text-slate-900 dark:text-white text-sm font-medium">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'warranty' && (
                    <div className="text-slate-600 dark:text-slate-300">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">Warranty Summary</h4>
                        <p>{warranty || 'Manufacturer Warranty'}</p>
                        <div className="mt-4 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-yellow-800 dark:text-yellow-200">
                            Note: Warranty is covered by the manufacturer. Please keep the invoice for warranty claims.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTabs;
