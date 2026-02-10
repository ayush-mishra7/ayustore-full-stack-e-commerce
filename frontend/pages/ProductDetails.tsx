import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Heart, Zap, ArrowLeft, Truck, Shield, AlertCircle } from 'lucide-react';
import { ProductService } from '../services/api';
import { Product } from '../types';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      ProductService.getById(Number(id))
        .then(res => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load product:', err);
          setError('Failed to load product. Please try again.');
          setLoading(false);
        });
    }
  }, [id]);

  const redirectToLogin = (redirectPath: string) => {
    sessionStorage.setItem('auth_redirect', redirectPath);
    sessionStorage.setItem('auth_message', 'Please login first to continue');
    navigate('/login');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      redirectToLogin(`/product/${id}`);
      return;
    }
    if (product) addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      redirectToLogin('/order-summary');
      return;
    }
    if (product) {
      addToCart(product, quantity);
      navigate('/order-summary');
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      redirectToLogin(`/product/${id}`);
      return;
    }
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-200 dark:bg-slate-800 aspect-square rounded-2xl"></div>
        <div className="space-y-4 pt-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white">{error || 'Product not found'}</h3>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 text-primary-600 font-medium hover:underline"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const images = [
    product.image,
    `https://picsum.photos/400/400?random=${product.id + 100}`,
    `https://picsum.photos/400/400?random=${product.id + 200}`,
  ];

  const inWishlist = isInWishlist(product.id);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg relative">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === idx
                  ? 'border-primary-600 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase text-sm mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{product.reviews} reviews</span>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="border-t border-b border-slate-100 dark:border-slate-800 py-6 mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-green-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">2 Year Warranty included</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-primary-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Free shipping on orders over $50</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
              <button
                className="p-3 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-medium text-slate-900 dark:text-white">{quantity}</span>
              <button
                className="p-3 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="flex-1"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2" size={20} /> Add to Cart
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={handleBuyNow}
              className="flex-1"
              disabled={product.stock === 0}
            >
              <Zap className="mr-2" size={20} /> Buy Now
            </Button>

            <button
              onClick={handleWishlist}
              className={`p-3 rounded-lg border-2 transition-colors ${inWishlist
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-500 hover:text-red-500'
                }`}
            >
              <Heart size={24} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {!isAuthenticated && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
              <button onClick={() => navigate('/login')} className="text-primary-600 hover:underline">Sign in</button> to add items to cart or wishlist
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;