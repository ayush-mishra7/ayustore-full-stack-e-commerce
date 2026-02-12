import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Eye, TrendingUp } from 'lucide-react';
import { Product, formatPrice, getDiscountPercent } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  showBadge?: 'NEW' | 'SALE' | 'HOT' | 'BESTSELLER' | string;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discountPercent = product.mrp ? getDiscountPercent(product.mrp, product.price) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    addToCart(product);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'NEW': return 'bg-blue-500';
      case 'SALE': return 'bg-red-500';
      case 'HOT': return 'bg-orange-500';
      case 'BESTSELLER': return 'bg-amber-500';
      default: return 'bg-primary-500';
    }
  };

  // Determine badge based on product attributes
  const displayBadge = showBadge ||
    (product.isBestSeller ? 'BESTSELLER' : '') ||
    (product.isNewArrival ? 'NEW' : '') ||
    (discountPercent >= 40 ? 'SALE' : '');

  // List view mode
  if (viewMode === 'list') {
    return (
      <div
        className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => {
          console.log(`Navigating to product ID: ${product.id}`);
          navigate(`/product/${product.id}`);
        }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 md:w-56 aspect-square sm:aspect-auto sm:h-48 flex-shrink-0 bg-slate-100 dark:bg-slate-700">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            {displayBadge && (
              <span className={`absolute top-3 left-3 px-2 py-1 rounded ${getBadgeStyle(displayBadge)} text-white text-xs font-bold uppercase`}>
                {displayBadge}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1">
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-1">
                {product.brand || product.category}
              </p>
              <h3 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                  {product.rating} <Star size={10} className="fill-current" />
                </div>
                <span className="text-xs text-slate-500">({product.reviews?.toLocaleString()} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                {product.description}
              </p>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {discountPercent}% off
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-lg border transition-colors ${inWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-slate-200 dark:border-slate-600 hover:border-red-300 hover:text-red-500'
                    }`}
                >
                  <Heart size={18} className={inWishlist ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isAddingToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                >
                  {isAddingToCart ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view mode (default)
  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full">
      {/* Image Container */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-700"
        onClick={() => {
          console.log(`Navigating to product ID: ${product.id}`);
          navigate(`/product/${product.id}`);
        }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
        )}

        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {displayBadge && (
          <span className={`absolute top-3 left-3 px-2 py-1 rounded ${getBadgeStyle(displayBadge)} text-white text-xs font-bold uppercase tracking-wide shadow-lg`}>
            {displayBadge === 'BESTSELLER' && <TrendingUp size={10} className="inline mr-1" />}
            {displayBadge}
          </span>
        )}

        {/* Discount Badge */}
        {!displayBadge && discountPercent >= 10 && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded bg-green-600 text-white text-xs font-bold shadow-lg">
            {discountPercent}% OFF
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 ${inWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white'
              }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={16} className={inWishlist ? 'fill-current' : ''} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 shadow-lg backdrop-blur-sm hover:bg-primary-500 hover:text-white transition-all duration-200"
            title="Quick View"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 left-0 right-0 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isAddingToCart
            ? 'bg-green-500 text-white'
            : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
        >
          {isAddingToCart ? (
            <>✓ Added to Cart</>
          ) : (
            <>
              <ShoppingCart size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 lg:p-4 flex-1 flex flex-col">
        {/* Brand */}
        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-1">
          {product.brand || product.category}
        </p>

        {/* Title */}
        <h3
          className="text-sm lg:text-base font-medium text-slate-900 dark:text-white mb-1.5 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 leading-snug"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
            {product.rating} <Star size={10} className="fill-current" />
          </div>
          <span className="text-xs text-slate-400">({product.reviews?.toLocaleString() || 0})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
          {discountPercent >= 5 && (
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-0.5">
              {discountPercent}% off • Save {formatPrice(product.mrp - product.price)}
            </p>
          )}
        </div>

        {/* Stock indicator */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;