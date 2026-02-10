import React, { useEffect, useState } from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Zap, Star, ChevronRight, Clock, TrendingUp, Sparkles, Award, Users, BadgePercent } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { products, getFeaturedProducts, getBestSellers } from '../data/products';
import { formatPrice } from '../types';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const featuredProducts = getFeaturedProducts().slice(0, 8);
  const bestSellers = getBestSellers().slice(0, 4);

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-pulse">
      <div className="aspect-square bg-slate-200 dark:bg-slate-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 lg:space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl lg:rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[500px] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 px-6 py-12 md:py-20 lg:py-24 lg:px-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-5">
            <Sparkles size={16} className="text-yellow-400" />
            <span>Trusted by 50,000+ customers across India</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-[1.1] text-white">
            Premium Products for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-pink-400 to-purple-400">
              Modern Living
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-200 mb-6 max-w-xl leading-relaxed">
            Discover our curated selection of electronics, fashion, and lifestyle products with fast delivery across India.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button size="lg" onClick={() => navigate('/shop')} className="shadow-lg shadow-primary-500/30">
              Shop Now <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm">
              View Collections
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-green-400" />
              <span>Free Delivery on ₹999+</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-amber-400" />
              <span>7-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="hidden lg:block absolute bottom-6 right-6 z-20 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4.8</p>
              <div className="flex items-center gap-0.5 justify-center">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-xs text-white/60 mt-1">12k reviews</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">50K+</p>
              <p className="text-xs text-white/60">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Clock size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <BadgePercent size={18} className="text-yellow-300" />
                <span className="text-base lg:text-lg font-bold text-white">Flash Sale - Ends Today!</span>
              </div>
              <p className="text-white/80 text-sm">Up to 70% off on selected items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white font-mono text-lg">
              <span className="bg-white/20 px-2.5 py-1.5 rounded">05</span>:
              <span className="bg-white/20 px-2.5 py-1.5 rounded">42</span>:
              <span className="bg-white/20 px-2.5 py-1.5 rounded">18</span>
            </div>
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-red-600" onClick={() => navigate('/shop')}>
              Shop Sale <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {[
          { icon: <Truck size={20} />, title: "Free Shipping", desc: "Orders over ₹999", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { icon: <ShieldCheck size={20} />, title: "Secure Payment", desc: "100% Protected", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: <RefreshCw size={20} />, title: "Easy Returns", desc: "7-Day Policy", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { icon: <Zap size={20} />, title: "24/7 Support", desc: "Dedicated Team", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
          >
            <div className={`p-2 lg:p-2.5 rounded-xl ${feature.bg} ${feature.color}`}>
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{feature.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Shop by Category */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">Shop by Category</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Browse our wide range of products</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?category=${cat.slug}`)}
              className="group flex flex-col items-center p-3 lg:p-5 rounded-xl lg:rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform shadow-lg">
                {cat.icon}
              </div>
              <span className="font-medium text-slate-900 dark:text-white text-xs lg:text-sm text-center">{cat.name}</span>
              <span className="text-xs text-slate-400 mt-0.5">{cat.subcategories.reduce((sum, s) => sum + s.productCount, 0)} items</span>
            </button>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <TrendingUp size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">Best Sellers</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Most loved by our customers</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banners */}
      <section className="grid md:grid-cols-2 gap-4">
        <div
          className="relative h-48 md:h-64 rounded-xl lg:rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
          onClick={() => navigate('/shop?category=electronics')}
        >
          <img
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop"
            alt="Electronics"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent flex flex-col justify-center px-5 lg:px-8">
            <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-bold mb-2 w-fit">
              New Arrivals
            </span>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">Latest Electronics</h3>
            <p className="text-white/80 mb-3 text-sm">Starting from {formatPrice(999)}</p>
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
              Shop Now <ArrowRight size={16} />
            </span>
          </div>
        </div>

        <div
          className="relative h-48 md:h-64 rounded-xl lg:rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
          onClick={() => navigate('/shop?category=fashion')}
        >
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop"
            alt="Fashion"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent flex flex-col justify-center px-5 lg:px-8">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500 text-white text-xs font-bold mb-2 w-fit">
              <Sparkles size={10} /> Trending
            </span>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">Fashion Collection</h3>
            <p className="text-white/80 mb-3 text-sm">Up to 60% off</p>
            <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
              Explore <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Sparkles size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">Featured Products</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Handpicked favorites just for you</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/shop')}>
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
        <div className="text-center mb-6">
          <h2 className="text-xl lg:text-2xl font-bold mb-2">Why Choose AyuStore?</h2>
          <p className="text-white/70 text-sm">We're committed to providing the best shopping experience</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Award size={28} />, title: "Premium Quality", desc: "Every product is quality-tested before listing" },
            { icon: <Users size={28} />, title: "50,000+ Customers", desc: "Join our growing community across India" },
            { icon: <ShieldCheck size={28} />, title: "Secure & Trusted", desc: "Bank-level security for all transactions" },
          ].map((item, idx) => (
            <div key={idx} className="text-center p-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-3">
                {item.icon}
              </div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-slate-100 dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 lg:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Stay Updated
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">
            Subscribe for exclusive deals and new arrivals
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            />
            <Button className="px-5 whitespace-nowrap">
              Subscribe <ArrowRight size={14} className="ml-2" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;