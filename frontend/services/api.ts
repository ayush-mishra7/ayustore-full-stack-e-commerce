import axios from 'axios';
import { Product, Order, User } from '../types';

import { products } from '../data/products';

// Read from env
const envUrl = (import.meta as any).env?.VITE_API_URL;
// VITE_API_URL should be the root domain (e.g. https://backend.com)
// We need to append /api for the axios instance
const BASE_URL = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`)
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    // Don't attach token for public endpoints to avoid backend confusion
    if (token && !config.url?.includes('/auth/login') && !config.url?.includes('/auth/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock Data Generator for Demo Purposes
const getMockProducts = (): Product[] => {
  // Return the real catalog data for the demo
  return products;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // SIMULATION LAYER: If API 404s (because no backend), return mock data
    // This ensures the frontend is viewable as a portfolio piece
    if (error.response?.status === 404 || error.code === "ERR_NETWORK") {
      const url = error.config.url;

      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      if (url?.includes('/products')) {
        return { data: getMockProducts() };
      }
      if (url?.includes('/auth/me')) {
        return {
          data: {
            id: "1",
            name: "Demo User",
            email: "user@ayustore.com",
            role: "admin",
            avatar: "https://picsum.photos/200/200?random=user"
          }
        };
      }
      if (url?.includes('/auth/login') || url?.includes('/auth/register') || url?.includes('/auth/google')) {
        return {
          data: {
            token: "mock_jwt_token",
            user: {
              id: "1",
              name: "Demo User",
              email: "user@ayustore.com",
              role: "admin",
              avatar: "https://picsum.photos/200/200?random=user"
            }
          }
        };
      }
      if (url?.includes('/orders')) {
        // If it's a POST request (Create Order), return a single order object
        if (error.config.method === 'post') {
          return {
            data: {
              id: "550e8400-e29b-41d4-a716-44665544" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'), // Valid Mock UUID
              date: new Date().toISOString().split('T')[0],
              total: JSON.parse(error.config.data).total || 0,
              status: 'Pending',
              items: []
            }
          };
        }

        // Default (GET): Return list of orders
        return {
          data: [
            { id: "ORD-1001", date: "2023-10-15", total: 299.99, status: 'Delivered', items: [] },
            { id: "ORD-1002", date: "2023-11-02", total: 149.50, status: 'Processing', items: [] }
          ]
        };
      }

      // Mock Razorpay Order Creation
      if (url?.includes('/payments/razorpay/create')) {
        return {
          data: {
            razorpayOrderId: "order_mock_" + Math.random().toString(36).substring(7),
            amount: 10000,
            currency: "INR",
            keyId: "rzp_test_SDhmQcFx2MYJFD"
          }
        };
      }

      // Mock Razorpay Verification
      if (url?.includes('/payments/razorpay/verify')) {
        return {
          data: {
            status: "success",
            message: "Payment verified successfully"
          }
        };
      }
    }
    return Promise.reject(error);
  }
);

export const ProductService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  getCategories: () => api.get<string[]>('/products/categories'),
  search: (query: string) => api.get<Product[]>(`/products/search?q=${query}`),
};

export const AuthService = {
  // Email/Password Login
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),

  // Registration
  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),

  // Redirect to Google OAuth
  initiateGoogleLogin: () => {
    window.location.href = `${BASE_URL}/auth/google`;
  },
  // For the redirect callback - extract token from URL
  handleAuthCallback: (): { token: string } | null => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/token=([^&]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      localStorage.setItem('auth_token', token);
      return { token };
    }
    return null;
  },
  getProfile: () => api.get<User>('/auth/me'),
  logout: () => {
    localStorage.removeItem('auth_token');
  },
  isAuthenticated: () => !!localStorage.getItem('auth_token'),
};

export const OrderService = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get<Order[]>('/orders'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  getAllOrders: () => api.get<Order[]>('/admin/orders'), // Admin
};

export const PaymentService = {
  createRazorpayOrder: (orderId: string) =>
    api.post<{ razorpayOrderId: string; amount: number; currency: string; keyId: string }>
      (`/payments/razorpay/create?orderId=${orderId}`),
  verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post('/payments/razorpay/verify', data),
};

export const AdminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllOrders: () => api.get<Order[]>('/admin/orders'),
  updateOrderStatus: (orderId: string, status: string) =>
    api.put(`/admin/orders/${orderId}/status?status=${status}`),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getAllUsers: () => api.get('/admin/users'),
};

export default api;