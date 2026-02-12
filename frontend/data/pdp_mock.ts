import { Product, Review, Seller } from '../types';
import { products } from './products';

// Mock Reviews
const mockReviews: Review[] = [
    {
        id: 'r1',
        userId: 'u1',
        userName: 'Rahul Sharma',
        rating: 5,
        comment: 'Absolutely amazing product! The display quality is stunning and the battery life lasts all day.',
        date: '2023-11-15',
        helpfulCount: 45,
        isVerifiedPurchase: true
    },
    {
        id: 'r2',
        userId: 'u2',
        userName: 'Priya Patel',
        rating: 4,
        comment: 'Great value for money. Delivery was super fast.',
        date: '2023-10-22',
        helpfulCount: 12,
        isVerifiedPurchase: true
    },
    {
        id: 'r3',
        userId: 'u3',
        userName: 'Amit Singh',
        rating: 5,
        comment: 'Best purchase I made this year. Highly recommended!',
        date: '2023-12-01',
        helpfulCount: 8,
        isVerifiedPurchase: true
    },
    {
        id: 'r4',
        userId: 'u4',
        userName: 'Sneha Gupta',
        rating: 3,
        comment: 'Good product but shipping took longer than expected.',
        date: '2023-09-30',
        helpfulCount: 3,
        isVerifiedPurchase: true
    }
];

const mockSeller: Seller = {
    id: 's1',
    name: 'AyuStore Retail',
    rating: 4.8,
    followerCount: 15400,
    isVerified: true,
    joinedDate: '2021-05-20'
};

// Helper to enhance a product with rich data
export const getRichProductData = (id: string): Product | null => {
    console.log(`[PDP Mock] Enhancing data for ID: "${id}"`);
    const product = products.find(p => String(p.id) === String(id));
    if (!product) {
        console.error(`[PDP Mock] Base product not found for ID: "${id}"`);
        return null;
    }

    // Use deterministic random logic to generate consistent data for any product
    const isTech = ['electronics', 'mobile', 'laptop', 'audio'].includes(product.category);

    return {
        ...product,
        images: [
            product.image,
            `https://picsum.photos/800/800?random=${id}1`,
            `https://picsum.photos/800/800?random=${id}2`,
            `https://picsum.photos/800/800?random=${id}3`,
        ],
        seller: mockSeller,
        warranty: isTech ? '1 Year Manufacturer Warranty' : '6 Months Seller Warranty',
        returnPolicy: '7 Days Replacement Policy',
        delivery: {
            freeDelivery: product.price > 499,
            estimatedDays: 3,
            isCOD: true
        },
        reviewsList: mockReviews,
        frequentlyBoughtTogether: [
            // Use static IDs: Samsung S24 (elec-001), Vivo X100 (elec-006), Headphones (elec-041)
            'elec-001', 'elec-006', 'elec-041'
        ].filter(pid => pid !== id).slice(0, 2),
        specifications: isTech ? [
            { key: 'Model Name', value: product.name },
            { key: 'Color', value: 'Midnight Black' },
            { key: 'Display', value: '6.7-inch Super AMOLED' },
            { key: 'Processor', value: 'Octa-core 3.2GHz' },
            { key: 'OS', value: 'Android 14' },
            { key: 'Battery', value: '5000 mAh' },
            { key: 'Warranty', value: '1 Year' },
        ] : [
            { key: 'Material', value: 'Premium Quality' },
            { key: 'Pattern', value: 'Solid' },
            { key: 'Fit', value: 'Regular' },
            { key: 'Occasion', value: 'Casual' },
            { key: 'Country of Origin', value: 'India' }
        ],
        bankOffers: [
            '10% Instant Discount on HDFC Bank Credit Cards',
            'Flat ₹500 Cashback on UPI payments',
            '5% Unlimited Cashback on Flipkart Axis Bank Credit Card'
        ]
    };
};
