import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { OrderService } from '../services/api';

const Checkout: React.FC = () => {
  const { cartTotal, items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    try {
      await OrderService.create({ items, total: cartTotal * 1.08, ...formData });
      
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        clearCart();
      }, 1500);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Checkout</h1>
      
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
                  placeholder="First Name" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input 
                  required
                  name="lastName"
                  placeholder="Last Name" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input 
                  required
                  name="address"
                  placeholder="Address" 
                  className="col-span-2 w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input 
                  required
                  name="city"
                  placeholder="City" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <input 
                  required
                  name="zip"
                  placeholder="ZIP Code" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <CreditCard className="mr-2" size={20} /> Payment Details
              </h2>
              <div className="space-y-4">
                <input 
                  required
                  name="cardNumber"
                  placeholder="Card Number" 
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    required
                    name="expiry"
                    placeholder="MM/YY" 
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                    onChange={handleChange}
                  />
                  <input 
                    required
                    name="cvc"
                    placeholder="CVC" 
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={loading} className="mt-6">
              {loading ? (
                <span className="flex items-center gap-2">
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Lock size={16} /> Pay ${(cartTotal * 1.08).toFixed(2)}</span>
              )}
            </Button>
          </form>
        </div>

        {/* Order Preview */}
        <div>
           <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Your Order</h3>
             <ul className="space-y-3 mb-4 max-h-60 overflow-y-auto scrollbar-hide">
               {items.map(item => (
                 <li key={item.id} className="flex justify-between text-sm">
                   <span className="text-slate-600 dark:text-slate-400 truncate w-2/3">{item.quantity}x {item.name}</span>
                   <span className="text-slate-900 dark:text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                 </li>
               ))}
             </ul>
             <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between font-bold text-slate-900 dark:text-white">
               <span>Total</span>
               <span>${(cartTotal * 1.08).toFixed(2)}</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;