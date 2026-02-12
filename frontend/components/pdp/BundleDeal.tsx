import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Product, formatPrice } from '../../types';

interface BundleDealProps {
    mainProduct: Product;
    bundleProducts: Product[];
    onAddBundle: (products: Product[]) => void;
}

const BundleDeal: React.FC<BundleDealProps> = ({ mainProduct, bundleProducts, onAddBundle }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>(bundleProducts.map(p => p.id));

    if (bundleProducts.length === 0) return null;

    const allProducts = [mainProduct, ...bundleProducts];
    const selectedProducts = allProducts.filter(p => p.id === mainProduct.id || selectedIds.includes(p.id));
    const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const totalMrp = selectedProducts.reduce((sum, p) => sum + p.mrp, 0);

    const toggleProduct = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Frequently Bought Together</h3>

            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-8">
                <div className="w-24 md:w-32 aspect-square rounded-xl overflow-hidden border border-slate-200">
                    <img src={mainProduct.image} alt={mainProduct.name} className="w-full h-full object-cover" />
                </div>

                {bundleProducts.map((p, idx) => (
                    <React.Fragment key={p.id}>
                        <Plus className="text-slate-400" />
                        <div className="relative w-24 md:w-32 aspect-square rounded-xl overflow-hidden border border-slate-200">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            {selectedIds.includes(p.id) && (
                                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
                                    <Check size={12} className="text-white" />
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-3">
                    {/* Main Product (Always Selected) */}
                    <div className="flex items-start gap-2">
                        <div className="mt-1 bg-primary-600 rounded p-0.5"><Check size={12} className="text-white" /></div>
                        <span className="text-sm">
                            <span className="font-semibold">This item:</span> {mainProduct.name}
                        </span>
                        <span className="text-sm font-bold ml-auto">{formatPrice(mainProduct.price).replace('.00', '')}</span>
                    </div>

                    {/* Optional Bundle Items */}
                    {bundleProducts.map(p => (
                        <div key={p.id} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(p.id)}
                                onChange={() => toggleProduct(p.id)}
                                className="mt-1 rounded text-primary-600 focus:ring-primary-500"
                            />
                            <span className="hover:text-primary-600 cursor-pointer">{p.name}</span>
                            <span className="font-bold ml-auto text-slate-900 dark:text-white">{formatPrice(p.price).replace('.00', '')}</span>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-64 flex flex-col justify-center gap-2">
                    <div className="text-lg">
                        Total Price: <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatPrice(totalPrice).replace('.00', '')}</span>
                    </div>
                    <div className="text-sm text-slate-500 mb-2">
                        (Price for {selectedProducts.length} items)
                    </div>
                    <button
                        onClick={() => onAddBundle(selectedProducts)}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2.5 rounded-full shadow-sm transition-colors"
                    >
                        Add {selectedProducts.length} to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BundleDeal;
