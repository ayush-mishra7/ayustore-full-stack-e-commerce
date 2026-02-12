import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Package, Truck, CheckCircle } from 'lucide-react';
import { mockOrders } from '../../data/profile';
import { formatPrice } from '../../types';
import Button from '../../components/ui/Button';

const OrderList: React.FC = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = mockOrders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle size={18} className="text-green-500" />;
            case 'shipped': return <Truck size={18} className="text-blue-500" />;
            case 'processing': return <Package size={18} className="text-yellow-500" />;
            default: return <Package size={18} className="text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                        {['All', 'Processing', 'Delivered', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status.toLowerCase())}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filterStatus === status.toLowerCase()
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Search size={40} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No orders found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Try changing your search or filter criteria</p>
                    <Button onClick={() => { setFilterStatus('all'); setSearchQuery('') }}>Clear Filters</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 transition-colors shadow-sm">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 flex flex-wrap gap-4 justify-between items-center border-b border-slate-100 dark:border-slate-700">
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Order Placed</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Amount</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs text-slate-500 uppercase font-semibold">Ship To</p>
                                        <div className="relative group">
                                            <p className="text-sm font-medium text-primary-600 cursor-pointer flex items-center gap-1">
                                                {order.shippingAddress?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-slate-500 font-mono">#{order.id}</p>
                                    <button
                                        onClick={() => navigate(`/profile/orders/${order.id}`)}
                                        className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(order.status)}
                                            <span className="font-bold text-slate-900 dark:text-white capitalize text-lg">{order.status}</span>
                                            <span className="text-slate-400 text-sm">•</span>
                                            <span className="text-slate-500 text-sm">
                                                {order.status === 'Delivered' ? `Delivered on ${order.expectedDelivery}` : `Arriving by ${order.expectedDelivery}`}
                                            </span>
                                        </div>

                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.name}</h3>
                                                    <p className="text-sm text-slate-500 mb-2">Quantity: {item.quantity}</p>

                                                    <div className="flex gap-3">
                                                        <Button size="sm" onClick={() => navigate(`/product/${item.id}`)}>Buy Again</Button>
                                                        <Button variant="outline" size="sm" onClick={() => navigate(`/product/${item.id}`)}>View Item</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-full md:w-64 space-y-3 pt-4 md:pt-0 md:border-l md:border-slate-100 md:dark:border-slate-700 md:pl-6">
                                        <Button fullWidth onClick={() => { }}>Track Package</Button>
                                        <Button fullWidth variant="outline" onClick={() => { }}>Return Items</Button>
                                        <Button fullWidth variant="outline" onClick={() => { }}>Leave a Review</Button>
                                        <button className="w-full text-center text-sm text-primary-600 hover:underline py-1">Archive Order</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;
