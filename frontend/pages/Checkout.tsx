import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { OrderService, PaymentService } from '../services/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const { cartTotal, items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create order in backend
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone
        },
        total: cartTotal
      };

      const orderRes = await OrderService.create(orderData);
      const orderId = orderRes.data?.id || orderRes.data?.orderId;

      // Create Razorpay order
      const paymentRes = await PaymentService.createRazorpayOrder(orderId);
      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data;

      // Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'AyuStore',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment in backend
            await PaymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            setSuccess(true);
            clearCart();
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#7C3AED'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zip || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    handleRazorpayPayment();
  };

  if (items.length === 0 && !success) {
    navigate('/shop');
    return null;
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Thank you for your purchase. We've sent a confirmation email to your inbox.
        </p>
        <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">

            {/* Shipping Info */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  required
                  name="lastName"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  required
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  required
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  className="col-span-2 w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  required
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input
                  required
                  name="zip"
                  placeholder="ZIP Code *"
                  value={formData.zip}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="mr-2" size={20} /> Payment Method
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <img
                    src="https://razorpay.com/assets/razorpay-logo.svg"
                    alt="Razorpay"
                    className="h-6"
                  />
                  <span className="text-slate-600 dark:text-slate-300">Secure payment via Razorpay</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Credit/Debit Cards, UPI, NetBanking, Wallets
                </p>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={loading} className="mt-6">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Lock size={16} /> Pay ₹{(total * 83).toFixed(0)}</span>
              )}
            </Button>
          </form>
        </div>

        {/* Order Preview */}
        <div>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h3>
            <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
              {items.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 truncate w-2/3">{item.quantity}x {item.name}</span>
                  <span className="text-slate-900 dark:text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
                ≈ ₹{(total * 83).toFixed(0)} INR
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;