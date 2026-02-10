import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 mb-6">
          <ArrowRight className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Looks like you haven't added anything yet.</p>
        <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Shopping Cart ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div
                className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:underline" onClick={() => navigate(`/product/${item.id}`)}>
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.category}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button
                      className="p-1 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">{item.quantity}</span>
                    <button
                      className="p-1 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Tax (Est.)</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Button fullWidth onClick={() => navigate('/order-summary')}>
              Proceed to Checkout
            </Button>

            <p className="text-xs text-center text-slate-400 mt-4">
              Secure Checkout - SSL Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;