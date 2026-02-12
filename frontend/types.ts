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

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  images?: string[];
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  followerCount: number;
  isVerified: boolean;
  joinedDate: string;
}

export interface Product {
  id: string;
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

  // Extended Details
  specifications?: { key: string; value: string }[];
  highlights?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;

  // New Fields for PDP Upgrade
  seller?: Seller;
  warranty?: string;
  returnPolicy?: string;
  delivery?: {
    freeDelivery: boolean;
    estimatedDays: number;
    isCOD: boolean;
  };
  reviewsList?: Review[];
  frequentlyBoughtTogether?: string[]; // IDs of related products
  bankOffers?: string[];
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

export type PaymentMethodType = 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI';

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  title: string;
  description?: string;
  icon?: any;
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

// --- Profile System Types ---

export interface OrderEvent {
  status: 'ordered' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  date: string;
  description: string;
}

export interface DetailedOrder extends Order {
  paymentMethod: string;
  paymentId?: string;
  timeline: OrderEvent[];
  expectedDelivery: string;
  invoiceUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'offer' | 'security' | 'system';
  actionUrl?: string;
}

export interface RewardTransaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'order' | 'payment' | 'account' | 'other';
  status: 'open' | 'closed' | 'resolved';
  lastUpdated: string;
  messages: {
    sender: 'user' | 'support';
    message: string;
    timestamp: string;
  }[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
