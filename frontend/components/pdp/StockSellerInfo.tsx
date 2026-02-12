import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import { Seller } from '../../types';

interface StockSellerInfoProps {
    stock: number;
    seller?: Seller;
}

const StockSellerInfo: React.FC<StockSellerInfoProps> = ({ stock, seller }) => {
    return (
        <div className="space-y-4">
            {/* Stock Status */}
            <div>
                {stock > 0 ? (
                    stock < 10 ? (
                        <span className="text-red-600 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full animate-pulse">
                            Hurry, only {stock} left!
                        </span>
                    ) : (
                        <span className="text-green-600 font-bold text-sm">
                            In Stock
                        </span>
                    )
                ) : (
                    <span className="text-red-600 font-bold text-lg">
                        Currently Unavailable
                    </span>
                )}
            </div>

            {/* Seller Info */}
            {seller && (
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <span>Sold by</span>
                        <span className="font-semibold text-primary-600 cursor-pointer hover:underline">
                            {seller.name}
                        </span>
                        {seller.isVerified && (
                            <ShieldCheck size={14} className="text-blue-500 fill-blue-100" />
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                            {seller.rating} <Star size={10} fill="currentColor" />
                        </div>
                        <span className="text-slate-500 text-xs">
                            {seller.followerCount > 1000 ? `${(seller.followerCount / 1000).toFixed(1)}K` : seller.followerCount} ratings
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockSellerInfo;
