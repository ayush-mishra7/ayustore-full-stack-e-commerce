import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Heart, Share2, AlertCircle } from 'lucide-react';
import { ProductService } from '../services/api';
import { Product } from '../types';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

// New Components
import ProductGallery from '../components/pdp/ProductGallery';
import PricingBlock from '../components/pdp/PricingBlock';
import DeliveryCheck from '../components/pdp/DeliveryCheck';
import StockSellerInfo from '../components/pdp/StockSellerInfo';
import ProductTabs from '../components/pdp/ProductTabs';
import ReviewsSection from '../components/pdp/ReviewsSection';
import BundleDeal from '../components/pdp/BundleDeal';

import ShareModal from '../components/ui/ShareModal';

// Mock Data Enhancer
import { getRichProductData } from '../data/pdp_mock';
import { getProductById } from '../data/products';

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Bundle Data
  const [bundleItems, setBundleItems] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log('[ProductDetails] Route param ID:', id);
      window.scrollTo(0, 0);

      // Simulate API call using our mock factory for rich data
      // In a real app, this would be: ProductService.getById(id).then(res => ...)
      setTimeout(() => {
        const richData = getRichProductData(id);

        if (richData) {
          setProduct(richData);

          // Fetch bundle items based on IDs
          if (richData.frequentlyBoughtTogether) {
            // Use getProductById helper for reliability
            const bundles = richData.frequentlyBoughtTogether
              .map(bid => getProductById(bid))
              .filter((p): p is Product => p !== null);
            setBundleItems(bundles);
          }
        } else {
          // Fallback to basic lookup
          const basicProduct = getProductById(id);
          if (basicProduct) {
            setProduct(basicProduct);
          } else {
            setError('Product not found');
          }
        }
        setLoading(false);
      }, 600);
    }
  }, [id]);

  const redirectToLogin = (redirectPath: string) => {
    sessionStorage.setItem('auth_redirect', redirectPath);
    sessionStorage.setItem('auth_message', 'Please login first to continue');
    navigate('/login');
  };

  const handleAddToCart = () => {
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

  const handleAddBundle = (items: Product[]) => {
    items.forEach(item => addToCart(item, 1));
    // Optional: Show toast "Bundle added to cart"
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

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out this amazing product on AyuStore: ${product.name}`,
      url: window.location.href,
    };

    // Use native share if available (Mobile/supported browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
        setIsShareModalOpen(true); // Fallback if user cancels or error
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-slate-200 dark:bg-slate-800 aspect-square rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
          </div>
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
        <button onClick={() => navigate('/shop')} className="mt-4 text-primary-600 font-medium hover:underline">Back to Shop</button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-4 md:py-8">

        {/* Breadcrumb (simplified) */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <span role="button" onClick={() => navigate('/')} className="hover:text-primary-600">Home</span> /
          <span role="button" onClick={() => navigate('/shop')} className="hover:text-primary-600">Shop</span> /
          <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">

          {/* Left Column: Gallery */}
          <div className="lg:col-span-5 relative z-10">
            <ProductGallery images={product.images || [product.image]} productName={product.name} />
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-4 space-y-6">

            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 cursor-pointer">
                Visit the {product.brand} Store
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                {product.rating} <Star size={12} fill="currentColor" />
              </span>
              <span className="text-slate-500 text-sm font-medium">{product.reviews} ratings & {product.reviewsList?.length || 10} reviews</span>
            </div>

            {/* Pricing */}
            <PricingBlock price={product.price} mrp={product.mrp} bankOffers={product.bankOffers} />

            {/* Delivery */}
            <DeliveryCheck freeDelivery={product.delivery?.freeDelivery || false} estimatedDays={3} />

            {/* Stock & Seller */}
            <StockSellerInfo stock={product.stock} seller={product.seller} />

            {/* Description Excerpt */}
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {product.description.substring(0, 150)}...
              <button onClick={() => document.getElementById('details-tabs')?.scrollIntoView({ behavior: 'smooth' })} className="text-primary-600 font-medium ml-1 hover:underline">See more</button>
            </p>
          </div>

          {/* Far Right: Buy Box (Desktop only - or stack on mobile) */}
          <div className="lg:col-span-3">
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm sticky top-24 bg-white dark:bg-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price</span>
                  <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Quantity</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-slate-300 rounded-md py-1 px-2 text-sm bg-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(nu => (
                      <option key={nu} value={nu}>{nu}</option>
                    ))}
                  </select>
                </div>

                <Button fullWidth size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2" size={18} /> Add to Cart
                </Button>
                <Button fullWidth size="lg" variant="secondary" onClick={handleBuyNow}>
                  <Zap className="mr-2" size={18} /> Buy Now
                </Button>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleWishlist}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${inWishlist ? 'border-red-200 text-red-600 bg-red-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <Heart size={16} fill={inWishlist ? "currentColor" : "none"} /> Wishlist
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Share2 size={12} /> Secure Transaction
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="mt-16 space-y-16 max-w-7xl">

          {/* Bundles */}
          {bundleItems.length > 0 && (
            <BundleDeal mainProduct={product} bundleProducts={bundleItems} onAddBundle={handleAddBundle} />
          )}

          {/* Detailed Tabs */}
          <div id="details-tabs">
            <ProductTabs
              description={product.description}
              specifications={product.specifications || []}
              warranty={product.warranty}
            />
          </div>

          {/* Recommendations would go here */}

          {/* Reviews */}
          <ReviewsSection
            reviews={product.reviewsList || []}
            rating={product.rating}
            totalReviews={product.reviews}
          />
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 lg:hidden flex gap-3 z-50 shadow-2xl">
        <Button fullWidth variant="secondary" onClick={handleBuyNow}>Buy Now</Button>
        <Button fullWidth onClick={handleAddToCart}>Add to Cart</Button>
      </div>
    </div>
  );
};

// Helper for Star Icon in component
const Star = ({ size = 16, fill = 'none', className = '' }: { size?: number, fill?: string, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default ProductDetails;