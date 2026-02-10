// Enhanced types for India-focused E-Commerce platform

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  price: number; // Offer price in INR
  mrp: number; // Maximum Retail Price in INR
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  images?: string[]; // Additional images
  rating: number;
  reviews: number;
  stock: number;
  specifications?: Record<string, string>;
  highlights?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  phone?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  items: CartItem[];
  shippingAddress?: Address;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  ratings: number[];
  availability: 'all' | 'inStock' | 'outOfStock';
  discount: number | null;
}

export enum SortOption {
  NEWEST = 'newest',
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_high',
  RATING = 'rating',
  POPULARITY = 'popularity',
  DISCOUNT = 'discount'
}

// Utility function to format price in INR
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage  
export const getDiscountPercent = (mrp: number, price: number): number => {
  return Math.round(((mrp - price) / mrp) * 100);
};