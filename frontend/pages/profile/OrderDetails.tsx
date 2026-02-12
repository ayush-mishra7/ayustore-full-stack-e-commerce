import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Package, Truck, CheckCircle, Home, Printer, CreditCard } from 'lucide-react';
import { mockOrders } from '../../data/profile';
import { DetailedOrder, formatPrice } from '../../types';
import Button from '../../components/ui/Button';

const OrderDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<DetailedOrder | null>(null);

    useEffect(() => {
        // In real app, fetch order by ID
        const foundOrder = mockOrders.find(o => o.id === id);
        if (foundOrder) setOrder(foundOrder);
    }, [id]);

    if (!order) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            </div>
        );
    }

    const steps = [
        { id: 'ordered', label: 'Ordered', icon: Package },
        { id: 'shipped', label: 'Shipped', icon: Package }, // Should ideally be a different icon
        { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(step => step.id === order.timeline[order.timeline.length - 1].status) || 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <button
                onClick={() => navigate('/profile/orders')}
                className="flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <ChevronLeft size={18} className="mr-1" /> Back to Orders
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        Order #{order.id}
                        <span className={`text-sm px-3 py-1 rounded-full border ${order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">Placed on {new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                        <Printer size={16} className="mr-2" /> Invoice
                    </Button>
                    <Button size="sm">Track Package</Button>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-x-auto">
                <div className="min-w-[600px] relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 rounded-full z-0"></div>

                    {/* Active Progress Bar */}
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>

                    <div className="relative z-10 flex justify-between">
                        {steps.map((step, idx) => {
                            const isCompleted = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted
                                            ? 'bg-green-500 border-green-100 dark:border-green-900 text-white'
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'
                                        }`}>
                                        <step.icon size={18} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-sm font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {order.timeline.find(t => t.status === step.id)?.date.split(' ')[0] || ''}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order Items</h2>
                    <div className="space-y-6">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-700 rounded-xl">
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-slate-50" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{item.name}</h3>
                                            <p className="text-slate-500 text-sm mt-1">{item.brand} • {item.quantity} Unit(s)</p>
                                        </div>
                                        <p className="font-bold text-lg text-slate-900 dark:text-white">{formatPrice(item.price)}</p>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.description}</p>

                                    <div className="flex gap-3 mt-4">
                                        <button className="text-primary-600 font-medium text-sm hover:underline">Write a Review</button>
                                        <div className="w-px h-4 bg-slate-300 self-center"></div>
                                        <button className="text-slate-600 dark:text-slate-400 font-medium text-sm hover:underline">Return Item</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Shipping Details</h2>
                        <div className="flex items-start gap-3">
                            <Home className="text-slate-400 mt-1" size={20} />
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{order.shippingAddress?.name}</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                                    {order.shippingAddress?.address}, <br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                                    Phone: {order.shippingAddress?.phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Payment Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Item Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Grand Total</span>
                                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                                <CreditCard size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Paid via {order.paymentMethod}</p>
                                    {order.paymentId && <p className="text-xs text-slate-500">Trans ID: {order.paymentId}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
