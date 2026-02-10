import axios from 'axios';
import { Product, Order, User } from '../types';

// Read from env or default to relative path
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Data Generator for Demo Purposes
// In a real app, strict error handling would just show error messages.
// Here we intercept errors to return "Demo Data" so the app is runnable.
const getMockProducts = (): Product[] => Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: i % 2 === 0 ? `Premium Wireless Headphones ${i + 1}` : `Ergonomic Workspace Chair ${i + 1}`,
  price: 99 + (i * 15),
  description: "Experience high-fidelity audio with our premium noise-cancelling headphones. Designed for comfort and longevity.",
  category: i % 3 === 0 ? "Electronics" : (i % 3 === 1 ? "Furniture" : "Accessories"),
  image: `https://picsum.photos/400/400?random=${i + 1}`,
  rating: 4.5,
  reviews: 120 + i,
  stock: 20
}));

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
      if (url?.includes('/auth')) {
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
        return {
          data: [
            { id: "ORD-1001", date: "2023-10-15", total: 299.99, status: 'Delivered', items: [] },
            { id: "ORD-1002", date: "2023-11-02", total: 149.50, status: 'Processing', items: [] }
          ]
        };
      }
    }
    return Promise.reject(error);
  }
);

export const ProductService = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
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
  updateProduct: (id: number, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),
  getAllUsers: () => api.get('/admin/users'),
};

export default api;