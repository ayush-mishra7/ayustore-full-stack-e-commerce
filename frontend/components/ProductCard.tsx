import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full">
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100 dark:bg-slate-700"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 text-primary-600 p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white"
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 
          className="text-lg font-medium text-slate-900 dark:text-white mb-1 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;