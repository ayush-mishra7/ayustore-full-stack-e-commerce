import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Wishlist: React.FC = () => {
    const navigate = useNavigate();
    const { items, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { isAuthenticated, login } = useAuth();

    const handleAddToCart = (product: any) => {
        if (!isAuthenticated) {
            login();
            return;
        }
        addToCart(product, 1);
        removeFromWishlist(product.id);
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                    <Heart className="text-slate-400" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Save items you love for later</p>
                <Button onClick={() => navigate('/shop')}>Browse Products</Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{items.length} items saved</p>
                </div>
                <button
                    onClick={clearWishlist}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(product => (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow"
                    >
                        <div
                            className="aspect-square relative cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                                className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-red-500 hover:bg-red-50"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1 truncate">{product.name}</h3>
                            <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-3">${product.price.toFixed(2)}</p>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                <ShoppingCart size={18} /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
