import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight, ChevronDown, Grid3X3, List, SlidersHorizontal,
    X, Star, Filter, ArrowUpDown, Check, ChevronLeft
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import { categories, brands } from '../data/categories';
import { products as allProducts, getProductsByCategory, getProductsBySubcategory } from '../data/products';
import { Product, formatPrice, SortOption } from '../types';

const PRODUCTS_PER_PAGE = 12;

const Shop: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL params
    const categoryParam = searchParams.get('category') || '';
    const subcategoryParam = searchParams.get('subcategory') || '';
    const searchQuery = searchParams.get('q') || '';

    // State
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.POPULARITY);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([categoryParam]);

    // Filter states
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [availability, setAvailability] = useState<'all' | 'inStock'>('all');
    const [discountFilter, setDiscountFilter] = useState<number>(0);

    // Get current category data
    const currentCategory = categories.find(c => c.slug === categoryParam);
    const currentSubcategory = currentCategory?.subcategories.find(s => s.slug === subcategoryParam);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.brand?.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (categoryParam) {
            result = result.filter(p => p.category === categoryParam);
        }

        // Subcategory filter
        if (subcategoryParam) {
            result = result.filter(p => p.subcategory === subcategoryParam);
        }

        // Price range filter
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Brand filter
        if (selectedBrands.length > 0) {
            result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
        }

        // Rating filter
        if (selectedRatings.length > 0) {
            result = result.filter(p => selectedRatings.some(r => p.rating >= r));
        }

        // Availability filter
        if (availability === 'inStock') {
            result = result.filter(p => p.stock > 0);
        }

        // Discount filter
        if (discountFilter > 0) {
            result = result.filter(p => {
                const discount = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
                return discount >= discountFilter;
            });
        }

        // Sorting
        switch (sortBy) {
            case SortOption.PRICE_LOW:
                result.sort((a, b) => a.price - b.price);
                break;
            case SortOption.PRICE_HIGH:
                result.sort((a, b) => b.price - a.price);
                break;
            case SortOption.RATING:
                result.sort((a, b) => b.rating - a.rating);
                break;
            case SortOption.DISCOUNT:
                result.sort((a, b) => {
                    const discA = a.mrp ? (a.mrp - a.price) / a.mrp : 0;
                    const discB = b.mrp ? (b.mrp - b.price) / b.mrp : 0;
                    return discB - discA;
                });
                break;
            case SortOption.NEWEST:
                result.sort((a, b) => b.id - a.id);
                break;
            default:
                result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        }

        return result;
    }, [searchQuery, categoryParam, subcategoryParam, priceRange, selectedBrands, selectedRatings, availability, discountFilter, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // Get available brands for current selection
    const availableBrands = useMemo(() => {
        const brandSet = new Set<string>();
        allProducts.forEach(p => {
            if ((!categoryParam || p.category === categoryParam) && p.brand) {
                brandSet.add(p.brand);
            }
        });
        return Array.from(brandSet).sort();
    }, [categoryParam]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryParam, subcategoryParam, priceRange, selectedBrands, selectedRatings, availability, discountFilter, sortBy, searchQuery]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const clearFilters = () => {
        setPriceRange([0, 200000]);
        setSelectedBrands([]);
        setSelectedRatings([]);
        setAvailability('all');
        setDiscountFilter(0);
    };

    const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 200000 || selectedBrands.length > 0 ||
        selectedRatings.length > 0 || availability !== 'all' || discountFilter > 0;

    // Breadcrumb
    const Breadcrumb = () => (
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-primary-600">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => { setSearchParams({}); }} className="hover:text-primary-600">Shop</button>
            {currentCategory && (
                <>
                    <ChevronRight size={14} />
                    <button
                        onClick={() => setSearchParams({ category: currentCategory.slug })}
                        className={!subcategoryParam ? 'text-slate-900 dark:text-white font-medium' : 'hover:text-primary-600'}
                    >
                        {currentCategory.name}
                    </button>
                </>
            )}
            {currentSubcategory && (
                <>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 dark:text-white font-medium">{currentSubcategory.name}</span>
                </>
            )}
            {searchQuery && (
                <>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 dark:text-white font-medium">Search: "{searchQuery}"</span>
                </>
            )}
        </nav>
    );

    // Filters Sidebar
    const FiltersSidebar = () => (
        <div className={`${showFilters ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:block'}`}>
            {/* Mobile overlay */}
            {showFilters && (
                <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)} />
            )}

            <div className={`${showFilters ? 'fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 z-50 overflow-y-auto lg:relative lg:w-64' : 'w-64'} bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 lg:sticky lg:top-24`}>
                {/* Mobile header */}
                <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="w-full mb-4 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    >
                        Clear All Filters
                    </button>
                )}

                {/* Categories */}
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Categories</h4>
                    <div className="space-y-1">
                        {categories.map(cat => (
                            <div key={cat.id}>
                                <button
                                    onClick={() => {
                                        setSearchParams({ category: cat.slug });
                                        toggleCategory(cat.id);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${categoryParam === cat.slug
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{cat.icon}</span>
                                        {cat.name}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${expandedCategories.includes(cat.id) ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Subcategories */}
                                {expandedCategories.includes(cat.id) && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {cat.subcategories.map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => setSearchParams({ category: cat.slug, subcategory: sub.slug })}
                                                className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${subcategoryParam === sub.slug
                                                        ? 'text-primary-600 dark:text-primary-400 font-medium'
                                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {sub.name}
                                                <span className="text-xs text-slate-400 ml-1">({sub.productCount})</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Price Range</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm border-none"
                                placeholder="Min"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm border-none"
                                placeholder="Max"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[[0, 1000], [1000, 5000], [5000, 10000], [10000, 50000], [50000, 200000]].map(([min, max]) => (
                                <button
                                    key={`${min}-${max}`}
                                    onClick={() => setPriceRange([min, max])}
                                    className={`px-2 py-1 rounded text-xs transition-colors ${priceRange[0] === min && priceRange[1] === max
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {formatPrice(min)} - {formatPrice(max)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Brands */}
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Brands</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availableBrands.slice(0, 10).map(brand => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedBrands([...selectedBrands, brand]);
                                        } else {
                                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                        }
                                    }}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Customer Ratings */}
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Customer Ratings</h4>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                            <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedRatings.includes(rating)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedRatings([...selectedRatings, rating]);
                                        } else {
                                            setSelectedRatings(selectedRatings.filter(r => r !== rating));
                                        }
                                    }}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="flex items-center gap-1 text-sm">
                                    {rating}
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    & above
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Discount */}
                <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Discount</h4>
                    <div className="space-y-2">
                        {[10, 20, 30, 40, 50].map(disc => (
                            <label key={disc} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="discount"
                                    checked={discountFilter === disc}
                                    onChange={() => setDiscountFilter(disc)}
                                    className="border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">{disc}% or more</span>
                            </label>
                        ))}
                        {discountFilter > 0 && (
                            <button
                                onClick={() => setDiscountFilter(0)}
                                className="text-xs text-primary-600 hover:underline"
                            >
                                Clear discount filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Availability</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={availability === 'inStock'}
                            onChange={(e) => setAvailability(e.target.checked ? 'inStock' : 'all')}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">In Stock Only</span>
                    </label>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                        {searchQuery ? `Search: "${searchQuery}"` : currentSubcategory?.name || currentCategory?.name || 'All Products'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Showing {filteredProducts.length} products
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium"
                    >
                        <Filter size={16} />
                        Filters
                        {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full"></span>}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="appearance-none px-4 py-2 pr-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium cursor-pointer focus:ring-2 focus:ring-primary-500"
                        >
                            <option value={SortOption.POPULARITY}>Popularity</option>
                            <option value={SortOption.PRICE_LOW}>Price: Low to High</option>
                            <option value={SortOption.PRICE_HIGH}>Price: High to Low</option>
                            <option value={SortOption.RATING}>Customer Rating</option>
                            <option value={SortOption.DISCOUNT}>Discount</option>
                            <option value={SortOption.NEWEST}>Newest First</option>
                        </select>
                        <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="hidden sm:flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <Grid3X3 size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Sidebar */}
                <FiltersSidebar />

                {/* Products Grid */}
                <div className="flex-1">
                    {paginatedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">No products found</p>
                            <Button onClick={clearFilters}>Clear Filters</Button>
                        </div>
                    ) : (
                        <>
                            <div className={`grid gap-4 lg:gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-2 lg:grid-cols-3'
                                    : 'grid-cols-1'
                                }`}>
                                {paginatedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                        ? 'bg-primary-600 text-white'
                                                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
