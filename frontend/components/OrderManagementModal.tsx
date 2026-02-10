import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, ArrowLeft, Package, RefreshCcw, RotateCcw, ChevronRight, AlertCircle, FileText } from 'lucide-react';
import Button from './ui/Button';

interface Order {
    id: string;
    date: string;
    total: number;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    items: { name: string; quantity: number; image: string; price: number }[];
}

interface OrderManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSuccess: (action: string, orderId: string) => void;
}

type ActionType = 'cancel' | 'return' | 'replace' | null;
type Step = 'select-action' | 'select-reason' | 'confirm' | 'success';

const cancelReasons = [
    { id: 'changed_mind', label: 'I changed my mind' },
    { id: 'found_better_price', label: 'Found a better price elsewhere' },
    { id: 'ordered_wrong', label: 'Ordered by mistake / Wrong item' },
    { id: 'delivery_too_long', label: 'Delivery time is too long' },
    { id: 'payment_issues', label: 'Payment issues' },
    { id: 'other', label: 'Other reason' }
];

const returnReasons = [
    { id: 'defective', label: 'Product is defective or damaged' },
    { id: 'not_as_described', label: 'Product not as described' },
    { id: 'wrong_item', label: 'Wrong item received' },
    { id: 'size_fit', label: 'Size/Fit issues' },
    { id: 'quality', label: 'Quality not satisfactory' },
    { id: 'other', label: 'Other reason' }
];

const replaceReasons = [
    { id: 'defective', label: 'Product is defective or damaged' },
    { id: 'wrong_item', label: 'Wrong item received' },
    { id: 'missing_parts', label: 'Missing parts or accessories' },
    { id: 'size_color', label: 'Wrong size/color received' },
    { id: 'other', label: 'Other reason' }
];

const OrderManagementModal: React.FC<OrderManagementModalProps> = ({ isOpen, onClose, order, onSuccess }) => {
    const [action, setAction] = useState<ActionType>(null);
    const [step, setStep] = useState<Step>('select-action');
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [otherReason, setOtherReason] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !order) return null;

    const resetState = () => {
        setAction(null);
        setStep('select-action');
        setSelectedReason('');
        setOtherReason('');
        setError(null);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleActionSelect = (selectedAction: ActionType) => {
        setAction(selectedAction);
        setStep('select-reason');
        setError(null);
    };

    const handleReasonSelect = (reasonId: string) => {
        setSelectedReason(reasonId);
        if (reasonId !== 'other') {
            setOtherReason('');
        }
    };

    const handleProceed = () => {
        if (!selectedReason) {
            setError('Please select a reason');
            return;
        }
        if (selectedReason === 'other' && otherReason.trim().length < 10) {
            setError('Please provide a detailed reason (at least 10 characters)');
            return;
        }
        setStep('confirm');
        setError(null);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In real app, call backend API here
            // await OrderService.cancelOrder(order.id, { reason: selectedReason, details: otherReason });

            setStep('success');
            setTimeout(() => {
                onSuccess(action!, order.id);
                handleClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getReasons = () => {
        switch (action) {
            case 'cancel': return cancelReasons;
            case 'return': return returnReasons;
            case 'replace': return replaceReasons;
            default: return [];
        }
    };

    const getActionTitle = () => {
        switch (action) {
            case 'cancel': return 'Cancel Order';
            case 'return': return 'Return Order';
            case 'replace': return 'Replace Order';
            default: return 'Manage Order';
        }
    };

    const getActionIcon = () => {
        switch (action) {
            case 'cancel': return <X className="text-red-500" size={24} />;
            case 'return': return <RotateCcw className="text-amber-500" size={24} />;
            case 'replace': return <RefreshCcw className="text-blue-500" size={24} />;
            default: return <Package className="text-primary-500" size={24} />;
        }
    };

    const canCancel = order.status === 'processing';
    const canReturn = order.status === 'delivered';
    const canReplace = order.status === 'delivered';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {step !== 'select-action' && step !== 'success' && (
                            <button
                                onClick={() => step === 'select-reason' ? setStep('select-action') : setStep('select-reason')}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            >
                                <ArrowLeft size={20} className="text-slate-500" />
                            </button>
                        )}
                        {step !== 'success' && getActionIcon()}
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {step === 'success' ? 'Request Submitted!' : getActionTitle()}
                        </h2>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {/* Step 1: Select Action */}
                    {step === 'select-action' && (
                        <div className="space-y-4">
                            {/* Order Info */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-900 dark:text-white">{order.id}</span>
                                    <span className="text-sm text-slate-500">Ordered on {new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex -space-x-2">
                                    {order.items.slice(0, 3).map((item, i) => (
                                        <img key={i} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg border-2 border-white dark:border-slate-800 object-cover" />
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => handleActionSelect('cancel')}
                                disabled={!canCancel}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${canCancel
                                        ? 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/10'
                                        : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <X className="text-red-500" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-slate-900 dark:text-white">Cancel Order</p>
                                        <p className="text-sm text-slate-500">{canCancel ? 'Available before shipping' : 'Not available - order already shipped'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400" size={20} />
                            </button>

                            <button
                                onClick={() => handleActionSelect('return')}
                                disabled={!canReturn}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${canReturn
                                        ? 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10'
                                        : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                        <RotateCcw className="text-amber-500" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-slate-900 dark:text-white">Return Order</p>
                                        <p className="text-sm text-slate-500">{canReturn ? 'Return within 7 days of delivery' : 'Available after delivery'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400" size={20} />
                            </button>

                            <button
                                onClick={() => handleActionSelect('replace')}
                                disabled={!canReplace}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${canReplace
                                        ? 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                                        : 'border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <RefreshCcw className="text-blue-500" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-slate-900 dark:text-white">Replace Order</p>
                                        <p className="text-sm text-slate-500">{canReplace ? 'Get a replacement for defective items' : 'Available after delivery'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400" size={20} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Select Reason */}
                    {step === 'select-reason' && (
                        <div className="space-y-4">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Please select a reason for {action === 'cancel' ? 'cancellation' : action === 'return' ? 'return' : 'replacement'}:
                            </p>

                            <div className="space-y-2">
                                {getReasons().map(reason => (
                                    <label
                                        key={reason.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${selectedReason === reason.id
                                                ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                                                : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="reason"
                                            checked={selectedReason === reason.id}
                                            onChange={() => handleReasonSelect(reason.id)}
                                            className="h-4 w-4 text-primary-600"
                                        />
                                        <span className="text-slate-900 dark:text-white">{reason.label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Other Reason Text Area */}
                            {selectedReason === 'other' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Please describe your reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        placeholder="Please provide a detailed reason for your request..."
                                        rows={4}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">{otherReason.length}/500 characters (minimum 10 required)</p>
                                </div>
                            )}

                            <Button fullWidth onClick={handleProceed} className="mt-4">
                                Continue <ChevronRight size={18} className="ml-1" />
                            </Button>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 'confirm' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-medium text-amber-800 dark:text-amber-200">Please confirm your request</p>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            {action === 'cancel' && 'Once cancelled, this action cannot be undone. Any payment will be refunded within 5-7 business days.'}
                                            {action === 'return' && 'A pickup will be scheduled within 48 hours. Refund will be processed after quality check.'}
                                            {action === 'replace' && 'A pickup will be scheduled and replacement will be shipped once we receive the original item.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Order ID</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Action</span>
                                    <span className="font-medium text-slate-900 dark:text-white capitalize">{action}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Reason</span>
                                    <span className="font-medium text-slate-900 dark:text-white text-right max-w-[60%]">
                                        {selectedReason === 'other' ? otherReason.substring(0, 50) + '...' : getReasons().find(r => r.id === selectedReason)?.label}
                                    </span>
                                </div>
                                {action !== 'cancel' && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refund Amount</span>
                                        <span className="font-medium text-green-600">₹{(order.total * 83).toFixed(0)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Policies */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={16} className="text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Refund Policy</span>
                                </div>
                                <ul className="text-xs text-slate-500 space-y-1">
                                    <li>• Refunds are processed within 5-7 business days</li>
                                    <li>• Amount will be credited to original payment method</li>
                                    <li>• Damaged/used items may result in partial refund</li>
                                    <li>• Some items are non-returnable (see policy)</li>
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep('select-reason')} className="flex-1">
                                    Back
                                </Button>
                                <Button onClick={handleConfirm} disabled={loading} className="flex-1">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Confirm Request'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white mb-6 shadow-xl">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {action === 'cancel' && 'Order Cancelled Successfully!'}
                                {action === 'return' && 'Return Request Submitted!'}
                                {action === 'replace' && 'Replacement Request Submitted!'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                {action === 'cancel' && `Your order ${order.id} has been cancelled. Refund will be processed within 5-7 business days.`}
                                {action === 'return' && `Return request for order ${order.id} has been submitted. A pickup will be scheduled within 48 hours.`}
                                {action === 'replace' && `Replacement request for order ${order.id} has been submitted. We'll notify you once the pickup is scheduled.`}
                            </p>
                            <p className="text-sm text-slate-500">
                                A confirmation email has been sent to your registered email address.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagementModal;
