import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, User, Sun, Moon, Menu, X, Search, LogOut,
  LayoutDashboard, Heart, UserPlus, LogIn, CreditCard,
  Shield, Headphones, MapPin, Mail, Phone, Facebook,
  Twitter, Instagram, Youtube, ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchSuggestions(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  // Search suggestions (mock data)
  const searchSuggestions = [
    'Wireless Earbuds',
    'Smart Watch',
    'Laptop Stand',
    'Phone Case',
    'USB-C Cable',
  ];

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Banner */}
      <div className="bg-primary-600 text-white text-center py-2 text-sm font-medium">
        <span className="animate-pulse">🎉</span> Free Shipping on orders over ₹999 | Use code <span className="font-bold">WELCOME10</span> for 10% off
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
              <img
                src="/ayustore_logo.png"
                alt="AyuStore Logo"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                AyuStore
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-all hover:text-primary-600 relative py-1 ${location.pathname === link.path
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-300'
                    }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Search Bar - Enhanced */}
            <div className="hidden md:block flex-1 max-w-xl mx-8 relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  <p className="px-4 py-2 text-xs text-slate-400 uppercase tracking-wide">Suggestions</p>
                  {searchSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
                    >
                      <Search size={14} className="text-slate-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:scale-105"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 relative"
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 relative"
                title="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={handleUserIconClick}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all"
                >
                  <User size={20} />
                  {isAuthenticated && user && (
                    <span className="text-sm font-medium hidden lg:block max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                  )}
                  <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-200 transform origin-top-right ${isUserMenuOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="p-2">
                    {isAuthenticated && user ? (
                      <>
                        {/* Logged in user info */}
                        <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <LayoutDashboard size={18} />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={18} />
                          My Profile
                        </Link>
                        <Link
                          to="/profile?tab=orders"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShoppingCart size={18} />
                          My Orders
                        </Link>
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome!</p>
                          <p className="text-xs text-slate-500">Sign in for the best experience</p>
                        </div>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LogIn size={18} />
                          Sign In
                        </Link>
                        <Link
                          to="/login?mode=signup"
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserPlus size={18} />
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Link to="/cart" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-slate-600 dark:text-slate-300">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-slideDown">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/wishlist"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={20} />
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  <div className="mt-4 px-3 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block mt-2 w-full text-center bg-primary-600 text-white px-4 py-3 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="block mt-2 w-full text-center bg-red-600 text-white px-4 py-3 rounded-xl font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center bg-primary-600 text-white px-4 py-3 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=signup"
                    className="block w-full text-center bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-6 lg:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer - Enhanced */}
      <footer className="bg-slate-900 dark:bg-black text-white">
        {/* Trust Bar */}
        <div className="border-b border-slate-800">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <CreditCard size={24} />, title: "Secure Payment", desc: "All cards accepted" },
                { icon: <Shield size={24} />, title: "Buyer Protection", desc: "100% money-back guarantee" },
                { icon: <Headphones size={24} />, title: "24/7 Support", desc: "Talk to our experts" },
                { icon: <MapPin size={24} />, title: "Pan-India Delivery", desc: "Fast & reliable" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-primary-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/ayustore_logo.png" alt="AyuStore" className="w-8 h-8 rounded-lg" />
                <span className="text-lg font-bold">AyuStore</span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Premium products for a modern lifestyle. Trusted by 50,000+ customers across India.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-primary-600 text-slate-400 hover:text-white transition-colors">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h3>
              <ul className="space-y-2.5">
                {['All Products', 'Electronics', 'Fashion', 'Home & Living', 'New Arrivals'].map((item, idx) => (
                  <li key={idx}>
                    <Link to="/shop" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2.5">
                {['Help Center', 'Track Order', 'Returns & Refunds', 'Shipping Info', 'FAQs'].map((item, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2.5">
                {['About Us', 'Careers', 'Press', 'Blog', 'Affiliate Program'].map((item, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail size={14} /> support@ayustore.com
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone size={14} /> +91 1800-123-4567
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <MapPin size={14} className="mt-0.5" />
                  <span>123 Business Park, Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                © 2026 AyuStore. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">Secure payments by</span>
                <div className="flex items-center gap-2">
                  {['Visa', 'Mastercard', 'Razorpay', 'UPI'].map((pay, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-800 rounded text-xs font-medium text-slate-300">{pay}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <Link to="#" className="hover:text-white">Privacy Policy</Link>
                <Link to="#" className="hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;