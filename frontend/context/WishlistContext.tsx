import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product } from '../types';

interface WishlistContextType {
    items: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Product[]>(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    const addToWishlist = (product: Product) => {
        setItems(prev => {
            if (prev.find(item => item.id === product.id)) return prev;
            const updated = [...prev, product];
            localStorage.setItem('wishlist', JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromWishlist = (productId: string) => {
        setItems(prev => {
            const updated = prev.filter(item => item.id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(updated));
            return updated;
        });
    };

    const isInWishlist = (productId: string) => items.some(item => item.id === productId);

    const clearWishlist = () => {
        setItems([]);
        localStorage.removeItem('wishlist');
    };

    const itemCount = useMemo(() => items.length, [items]);

    return (
        <WishlistContext.Provider value={{
            items, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist, itemCount
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};
