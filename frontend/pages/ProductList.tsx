import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/api';
import { Product, SortOption } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<SortOption>(SortOption.NEWEST);

  useEffect(() => {
    setLoading(true);
    ProductService.getAll()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Electronics', 'Furniture', 'Accessories'];

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    switch (sort) {
      case SortOption.PRICE_LOW:
        result.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PRICE_HIGH:
        result.sort((a, b) => b.price - a.price);
        break;
      case SortOption.RATING:
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Newest (id order for now)
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, category, search, sort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shop</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Showing {filteredProducts.length} results
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setCategory(cat)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                   category === cat 
                     ? 'bg-primary-600 text-white' 
                     : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          <div className="relative min-w-[140px]">
            <select
              className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 pr-8 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value={SortOption.NEWEST}>Newest</option>
              <option value={SortOption.PRICE_LOW}>Price: Low to High</option>
              <option value={SortOption.PRICE_HIGH}>Price: High to Low</option>
              <option value={SortOption.RATING}>Best Rating</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-xl h-96 animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <SlidersHorizontal className="text-slate-400" size={32} />
          </div>
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">No products found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters</p>
          <button 
            onClick={() => { setSearch(''); setCategory('All'); }}
            className="mt-4 text-primary-600 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;