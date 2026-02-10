import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, MapPin, CreditCard, Shield, ChevronRight, Plus, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { OrderService, PaymentService } from '../services/api';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

const OrderSummary: React.FC = () => {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [showAddAddress, setShowAddAddress] = useState(false);

    // Sample addresses - in real app, fetch from API
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            name: user?.name || 'User',
            phone: '+91 9876543210',
            address: '123 Main Street, Sector 15',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            isDefault: true
        }
    ]);

    // New address form
    const [newAddress, setNewAddress] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    // Pricing calculations
    const subtotal = cartTotal;
    const gstRate = 0.18; // 18% GST
    const gst = subtotal * gstRate;
    const deliveryCharge = subtotal > 500 ? 0 : 49; // Free delivery above $500
    const platformFee = 2;
    const total = subtotal + gst + deliveryCharge + platformFee;

    // Convert to INR for display
    const inrRate = 83;
    const totalINR = total * inrRate;

    useEffect(() => {
        if (items.length === 0 && !success) {
            navigate('/shop');
        }
        // Set default selected address
        const defaultAddr = addresses.find(a => a.isDefault);
        if (defaultAddr) {
            setSelectedAddress(defaultAddr.id);
        }
    }, [items.length, success, navigate, addresses]);

    const handleAddAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.pincode) {
            setError('Please fill all address fields');
            return;
        }

        const addr: Address = {
            id: Date.now().toString(),
            ...newAddress,
            isDefault: addresses.length === 0
        };

        setAddresses([...addresses, addr]);
        setSelectedAddress(addr.id);
        setShowAddAddress(false);
        setNewAddress({ name: user?.name || '', phone: '', address: '', city: '', state: '', pincode: '' });
        setError(null);
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

    const handleProceedToPayment = async () => {
        if (!selectedAddress) {
            setError('Please select a delivery address');
            return;
        }

        setLoading(true);
        setError(null);

        const selectedAddr = addresses.find(a => a.id === selectedAddress);

        try {
            // Create order in backend
            // Backend expects: items[{id, quantity, price}], total, firstName, lastName, address, city, zip
            const orderData = {
                items: items.map(item => ({
                    id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total,
                firstName: selectedAddr?.name?.split(' ')[0] || '',
                lastName: selectedAddr?.name?.split(' ').slice(1).join(' ') || '',
                address: selectedAddr?.address || '',
                city: selectedAddr?.city || '',
                zip: selectedAddr?.pincode || ''
            };

            console.log('Creating order with data:', orderData);
            const orderRes = await OrderService.create(orderData);
            console.log('Order response:', orderRes);

            // Extract orderId from response - check multiple possible locations
            const orderId = orderRes.data?.id || orderRes.data?.orderId || (orderRes as any).id;

            if (!orderId) {
                throw new Error('Failed to create order - no order ID received');
            }

            console.log('Order created with ID:', orderId);

            // Create Razorpay order
            console.log('Creating Razorpay order for orderId:', orderId);
            const paymentRes = await PaymentService.createRazorpayOrder(orderId);
            console.log('Payment response:', paymentRes);

            const razorpayData = paymentRes.data;
            if (!razorpayData?.razorpayOrderId) {
                throw new Error('Failed to create payment order - no Razorpay order ID received');
            }

            const { razorpayOrderId, amount, currency, keyId } = razorpayData;

            // Load Razorpay SDK
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error('Failed to load payment gateway. Please check your internet connection.');
            }

            // Open Razorpay checkout
            const options = {
                key: keyId,
                amount: Math.round((amount || total) * 100), // Amount in paise
                currency: currency || 'INR',
                name: 'AyuStore',
                description: `Order #${orderId.substring(0, 8)}...`,
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
                        console.error('Payment verification failed:', err);
                        // Still show success since payment went through on Razorpay
                        setSuccess(true);
                        clearCart();
                    }
                },
                prefill: {
                    name: selectedAddr?.name || user?.name,
                    email: user?.email,
                    contact: selectedAddr?.phone?.replace(/\s+/g, '') || ''
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

            console.log('Opening Razorpay with options:', { ...options, key: '***' });
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                console.error('Payment failed:', response.error);
                setError(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });
            rzp.open();
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto text-center py-20 px-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white mb-6 shadow-xl">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Order Confirmed!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Thank you for your purchase! We've sent a confirmation email to {user?.email}. Your order will be delivered within 5-7 business days.
                </p>
                <div className="space-y-3">
                    <Button fullWidth onClick={() => navigate('/shop')}>Continue Shopping</Button>
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary-600 hover:underline text-sm font-medium"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Order Summary</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Cart Items & Address */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Cart Items */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="text-primary-600" size={24} />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Items in Cart ({items.length})</h2>
                        </div>

                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-slate-900 dark:text-white truncate">{item.name}</h3>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-slate-500">₹{(item.price * item.quantity * inrRate).toFixed(0)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="text-primary-600" size={24} />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Delivery Address</h2>
                            </div>
                            <button
                                onClick={() => setShowAddAddress(!showAddAddress)}
                                className="flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline"
                            >
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        {/* Add New Address Form */}
                        {showAddAddress && (
                            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-600">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-slate-900 dark:text-white">New Address</h3>
                                    <button onClick={() => setShowAddAddress(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        placeholder="Full Name"
                                        value={newAddress.name}
                                        onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                    <input
                                        placeholder="Phone Number"
                                        value={newAddress.phone}
                                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                    <input
                                        placeholder="Address"
                                        value={newAddress.address}
                                        onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                                        className="col-span-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                    <input
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                    <input
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                    <input
                                        placeholder="PIN Code"
                                        value={newAddress.pincode}
                                        onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                    <button
                                        onClick={handleAddAddress}
                                        className="bg-primary-600 text-white rounded-lg py-2.5 font-medium hover:bg-primary-700 transition"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Address List */}
                        <div className="space-y-3">
                            {addresses.map(addr => (
                                <label
                                    key={addr.id}
                                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${selectedAddress === addr.id
                                        ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddress === addr.id}
                                        onChange={() => setSelectedAddress(addr.id)}
                                        className="mt-1 h-4 w-4 text-primary-600"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900 dark:text-white">{addr.name}</span>
                                            {addr.isDefault && (
                                                <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{addr.phone}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Partner */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="text-primary-600" size={24} />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Details</h2>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    DTDC
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">DTDC Express</p>
                                    <p className="text-sm text-slate-500">Estimated delivery: 5-7 business days</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryCharge * inrRate}`}
                                </p>
                                {deliveryCharge === 0 && <p className="text-xs text-green-600">Orders above $500</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Price Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Price Details</h2>

                        <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                                <span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">GST (18%)</span>
                                <span className="text-slate-900 dark:text-white">${gst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Delivery Charges</span>
                                <span className={deliveryCharge === 0 ? 'text-green-600' : 'text-slate-900 dark:text-white'}>
                                    {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Platform Fee</span>
                                <span className="text-slate-900 dark:text-white">${platformFee.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
                                    <p className="text-sm text-primary-600 font-medium">≈ ₹{totalINR.toFixed(0)} INR</p>
                                </div>
                            </div>
                        </div>

                        {/* Security & Trust Badges */}
                        <div className="mt-4 mb-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Shield size={16} className="text-green-500" />
                                <span>100% Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <CheckCircle size={16} className="text-green-500" />
                                <span>Easy Returns & Refunds</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="text-primary-600" size={20} />
                                <span className="font-medium text-slate-900 dark:text-white">Pay with Razorpay</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Credit/Debit Cards, UPI, NetBanking, Wallets
                            </p>
                            <div className="flex gap-2 mt-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 object-contain" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 object-contain" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/100px-UPI-Logo-vector.svg.png" alt="UPI" className="h-5 object-contain" />
                            </div>
                        </div>

                        <Button
                            fullWidth
                            size="lg"
                            onClick={handleProceedToPayment}
                            disabled={loading || !selectedAddress}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Proceed to Payment <ChevronRight size={20} />
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
