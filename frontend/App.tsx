import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import OrderSummary from './pages/OrderSummary';
import OAuthCallback from './pages/OAuthCallback';
// import Profile from './pages/Profile'; // Deprecated

// Profile Components
import ProfileLayout from './pages/profile/ProfileLayout';
import ProfileOverview from './pages/profile/ProfileOverview';
import OrderList from './pages/profile/OrderList';
import OrderDetails from './pages/profile/OrderDetails';
import AddressManage from './pages/profile/AddressManage';
import Rewards from './pages/profile/Rewards';
import Notifications from './pages/profile/Notifications';
import HelpCenter from './pages/profile/HelpCenter';
import Settings from './pages/profile/Settings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/callback" element={<OAuthCallback />} />
                  <Route path="/wishlist" element={<Wishlist />} />

                  {/* Protected Routes */}
                  <Route
                    path="/order-summary"
                    element={
                      <ProtectedRoute>
                        <OrderSummary />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Profile Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<ProfileOverview />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="orders/:id" element={<OrderDetails />} />
                    <Route path="addresses" element={<AddressManage />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="rewards" element={<Rewards />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="help" element={<HelpCenter />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;