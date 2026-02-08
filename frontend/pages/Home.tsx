import React, { useEffect, useState } from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/api';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.getAll()
      .then(res => {
        setFeaturedProducts(res.data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-black text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-transparent z-10"></div>
        <img 
          src="https://picsum.photos/1600/600?random=hero" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 px-8 py-24 md:py-32 md:px-12 max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm font-medium mb-4 backdrop-blur-sm">
            New Collection 2024
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-pink-400">Everyday Lifestyle</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-xl">
            Discover our curated selection of premium electronics, furniture, and accessories designed for the modern individual.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => navigate('/shop')}>
              Shop Now <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
              View Lookbook
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: <Truck size={24} />, title: "Free Shipping", desc: "On orders over $150" },
          { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "100% protected" },
          { icon: <RefreshCw size={24} />, title: "Easy Returns", desc: "30-day money back" },
          { icon: <Zap size={24} />, title: "Fast Support", desc: "24/7 dedicated team" },
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
            <p className="text-slate-500 dark:text-slate-400">Handpicked favorites just for you</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/shop')}>View All</Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => navigate('/shop')}>
          <img src="https://picsum.photos/800/600?random=promo1" alt="Promo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
            <h3 className="text-3xl font-bold text-white mb-2">Summer Sale</h3>
            <p className="text-white/80 mb-4">Up to 50% off on selected items</p>
            <span className="text-white font-medium underline decoration-primary-500 decoration-2 underline-offset-4">Explore</span>
          </div>
        </div>
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden group cursor-pointer" onClick={() => navigate('/shop')}>
          <img src="https://picsum.photos/800/600?random=promo2" alt="Promo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
            <h3 className="text-3xl font-bold text-white mb-2">New Electronics</h3>
            <p className="text-white/80 mb-4">Latest gadgets for your setup</p>
            <span className="text-white font-medium underline decoration-primary-500 decoration-2 underline-offset-4">Shop Now</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;