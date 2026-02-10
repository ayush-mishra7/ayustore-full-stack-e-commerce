import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/api';
import { Product } from '../types';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            setLoading(true);
            ProductService.search(query)
                .then(res => {
                    setProducts(res.data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    // Fallback: fetch all and filter client-side
                    ProductService.getAll()
                        .then(res => {
                            const filtered = (res.data || []).filter((p: Product) =>
                                p.name.toLowerCase().includes(query.toLowerCase()) ||
                                p.description.toLowerCase().includes(query.toLowerCase()) ||
                                p.category.toLowerCase().includes(query.toLowerCase())
                            );
                            setProducts(filtered);
                            setLoading(false);
                        })
                        .catch(() => setLoading(false));
                });
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Search Results for "{query}"
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {loading ? 'Searching...' : `Found ${products.length} products`}
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-xl h-96 animate-pulse"></div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Search className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-medium text-slate-900 dark:text-white">No products found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try a different search term</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="mt-4 text-primary-600 font-medium hover:underline"
                    >
                        Browse all products
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
