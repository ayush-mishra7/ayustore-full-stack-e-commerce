import React, { useEffect, useRef } from 'react';
import { X, Copy, Check, MessageCircle, Facebook, Twitter, Mail } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, productName, url }) => {
    const [copied, setCopied] = React.useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-500',
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${productName} on AyuStore: ${url}`)}`, '_blank'),
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600',
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'),
        },
        {
            name: 'Twitter/X',
            icon: Twitter,
            color: 'bg-black',
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${productName}`)}&url=${encodeURIComponent(url)}`, '_blank'),
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-red-500',
            action: () => window.open(`mailto:?subject=${encodeURIComponent(`Check out ${productName}`)}&body=${encodeURIComponent(`I found this amazing product on AyuStore: ${url}`)}`, '_blank'),
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div
                ref={modalRef}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl transform transition-all scale-100"
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Share Product</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Social Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {shareLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={link.action}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-12 h-12 ${link.color} rounded-full flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform`}>
                                    <link.icon size={20} fill="currentColor" className={link.name === 'Twitter/X' ? '' : 'fill-transparent'} />
                                </div>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{link.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Copy Link */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 flex items-center gap-3 border border-slate-200 dark:border-slate-700">
                        <div className="flex-1 truncate text-sm text-slate-500 font-medium">
                            {url}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
