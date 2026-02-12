import { DetailedOrder, Notification, RewardTransaction, SupportTicket, FAQ } from '../types';

// Mock Orders with Timeline
export const mockOrders: DetailedOrder[] = [
    {
        id: 'ORD-2026-1001',
        date: '2026-02-08',
        total: 12999,
        status: 'Delivered',
        paymentMethod: 'UPI',
        paymentId: 'pay_Hj89sdk32',
        expectedDelivery: '2026-02-10',
        invoiceUrl: '/invoices/ORD-2026-1001.pdf',
        shippingAddress: {
            id: '1',
            name: 'Ayush Mishra',
            phone: '+91 9876543210',
            address: '123, Tech Park, Sector 62',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201309',
            isDefault: true
        },
        items: [
            {
                id: '1',
                name: 'Sony WH-1000XM5 Wireless Headphones',
                price: 26990,
                mrp: 34990,
                description: 'Industry Leading Noise Cancellation',
                category: 'Electronics',
                subcategory: 'Audio',
                brand: 'Sony',
                image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
                rating: 4.8,
                reviews: 1200,
                stock: 15,
                quantity: 1
            }
        ],
        timeline: [
            { status: 'ordered', date: '2026-02-08 10:30 AM', description: 'Order Placed' },
            { status: 'shipped', date: '2026-02-08 06:00 PM', description: 'Shipped via BlueDart' },
            { status: 'out_for_delivery', date: '2026-02-10 09:00 AM', description: 'Out for Delivery' },
            { status: 'delivered', date: '2026-02-10 02:15 PM', description: 'Delivered to neighbor' }
        ]
    },
    {
        id: 'ORD-2026-0955',
        date: '2026-02-05',
        total: 4999,
        status: 'Processing',
        paymentMethod: 'Credit Card',
        expectedDelivery: '2026-02-12',
        items: [
            {
                id: '2',
                name: 'Fastrack Reflex Vox Smartwatch',
                price: 4995,
                mrp: 7995,
                description: 'Alexa Built-in, 1.69" HD Display',
                category: 'Electronics',
                subcategory: 'Wearables',
                brand: 'Fastrack',
                image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
                rating: 4.2,
                reviews: 850,
                stock: 45,
                quantity: 1
            }
        ],
        timeline: [
            { status: 'ordered', date: '2026-02-05 02:20 PM', description: 'Order Placed' },
            { status: 'shipped', date: '2026-02-06 11:00 AM', description: 'Seller is packing your order' }
        ]
    }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Order Delivered',
        message: 'Your order #ORD-2026-1001 has been delivered successfully.',
        date: '2026-02-10 14:15',
        read: false,
        type: 'order',
        actionUrl: '/profile/orders/ORD-2026-1001'
    },
    {
        id: '2',
        title: 'Flash Sale Alert!',
        message: 'Up to 70% off on Electronics starts in 1 hour.',
        date: '2026-02-09 10:00',
        read: true,
        type: 'offer',
        actionUrl: '/shop?category=electronics'
    },
    {
        id: '3',
        title: 'Login Alert',
        message: 'New login detected from Chrome on Windows.',
        date: '2026-02-08 09:30',
        read: true,
        type: 'security'
    }
];

// Mock Rewards
export const mockRewards: RewardTransaction[] = [
    { id: '1', date: '2026-02-10', description: 'Order #ORD-2026-1001 Bonus', points: 260, type: 'earned' },
    { id: '2', date: '2026-01-25', description: 'Republic Day Sale Purchase', points: 150, type: 'earned' },
    { id: '3', date: '2026-01-15', description: 'Redeemed for Coupon', points: -500, type: 'redeemed' }
];

// Mock Support Tickets
export const mockTickets: SupportTicket[] = [
    {
        id: 'TKT-9982',
        subject: 'Wrong item received in Order #ORD-2025-888',
        category: 'order',
        status: 'closed',
        lastUpdated: '2026-01-20',
        messages: [
            { sender: 'user', message: 'I received a blue case instead of black.', timestamp: '2026-01-18 10:00' },
            { sender: 'support', message: 'We apologize. Initiating replacement.', timestamp: '2026-01-18 14:00' }
        ]
    }
];

// Mock FAQs
export const mockFAQs: FAQ[] = [
    {
        id: '1',
        question: 'How do I track my order?',
        answer: 'Go to My Orders section and click on the specific order to see the tracking timeline.',
        category: 'Orders'
    },
    {
        id: '2',
        question: 'What is the return policy?',
        answer: 'We offer a 7-day return policy for most items. Electronics must be in original packaging.',
        category: 'Returns'
    },
    {
        id: '3',
        question: 'How do I use my reward points?',
        answer: 'You can redeem points at checkout. 1 Point = ₹1.',
        category: 'Payments'
    }
];
