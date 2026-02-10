// Categories and Subcategories hierarchy for India E-Commerce
import { Category, Product } from '../types';

// High-quality product images from Unsplash
const images = {
    electronics: {
        phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
        watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
        speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    },
    fashion: {
        shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        jeans: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500',
        dress: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        saree: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500',
        kurta: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500',
    },
    home: {
        sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
        bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
        table: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500',
        chair: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500',
        lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
        kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        decor: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    },
    beauty: {
        skincare: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        makeup: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
        perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
        haircare: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
    },
    accessories: {
        bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
        wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
        sunglasses: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        belt: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500',
        jewelry: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
    },
    sports: {
        yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
        cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500',
        football: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
};

export const categories: Category[] = [
    {
        id: 'electronics',
        name: 'Electronics',
        slug: 'electronics',
        icon: '📱',
        image: images.electronics.phone,
        subcategories: [
            { id: 'mobiles', name: 'Mobile Phones', slug: 'mobiles', categoryId: 'electronics', productCount: 45 },
            { id: 'laptops', name: 'Laptops & Computers', slug: 'laptops', categoryId: 'electronics', productCount: 38 },
            { id: 'tablets', name: 'Tablets & iPads', slug: 'tablets', categoryId: 'electronics', productCount: 22 },
            { id: 'tvs', name: 'Televisions', slug: 'tvs', categoryId: 'electronics', productCount: 28 },
            { id: 'audio', name: 'Audio & Headphones', slug: 'audio', categoryId: 'electronics', productCount: 35 },
            { id: 'cameras', name: 'Cameras & Photography', slug: 'cameras', categoryId: 'electronics', productCount: 18 },
            { id: 'wearables', name: 'Smart Wearables', slug: 'wearables', categoryId: 'electronics', productCount: 24 },
            { id: 'accessories-elec', name: 'Mobile Accessories', slug: 'mobile-accessories', categoryId: 'electronics', productCount: 42 },
        ]
    },
    {
        id: 'fashion',
        name: 'Fashion',
        slug: 'fashion',
        icon: '👕',
        image: images.fashion.shirt,
        subcategories: [
            { id: 'men-clothing', name: "Men's Clothing", slug: 'men-clothing', categoryId: 'fashion', productCount: 52 },
            { id: 'women-clothing', name: "Women's Clothing", slug: 'women-clothing', categoryId: 'fashion', productCount: 58 },
            { id: 'kids', name: 'Kids Wear', slug: 'kids', categoryId: 'fashion', productCount: 34 },
            { id: 'footwear', name: 'Footwear', slug: 'footwear', categoryId: 'fashion', productCount: 45 },
            { id: 'ethnic', name: 'Ethnic & Fusion', slug: 'ethnic', categoryId: 'fashion', productCount: 38 },
            { id: 'winter', name: 'Winter Wear', slug: 'winter', categoryId: 'fashion', productCount: 28 },
        ]
    },
    {
        id: 'home-living',
        name: 'Home & Living',
        slug: 'home-living',
        icon: '🏠',
        image: images.home.sofa,
        subcategories: [
            { id: 'furniture', name: 'Furniture', slug: 'furniture', categoryId: 'home-living', productCount: 42 },
            { id: 'kitchen', name: 'Kitchen & Dining', slug: 'kitchen', categoryId: 'home-living', productCount: 38 },
            { id: 'bedding', name: 'Bedding & Mattress', slug: 'bedding', categoryId: 'home-living', productCount: 28 },
            { id: 'decor', name: 'Home Decor', slug: 'decor', categoryId: 'home-living', productCount: 45 },
            { id: 'lighting', name: 'Lighting & Lamps', slug: 'lighting', categoryId: 'home-living', productCount: 32 },
            { id: 'storage', name: 'Storage & Organization', slug: 'storage', categoryId: 'home-living', productCount: 24 },
        ]
    },
    {
        id: 'beauty',
        name: 'Beauty & Personal Care',
        slug: 'beauty',
        icon: '💄',
        image: images.beauty.skincare,
        subcategories: [
            { id: 'skincare', name: 'Skincare', slug: 'skincare', categoryId: 'beauty', productCount: 48 },
            { id: 'makeup', name: 'Makeup', slug: 'makeup', categoryId: 'beauty', productCount: 42 },
            { id: 'haircare', name: 'Haircare', slug: 'haircare', categoryId: 'beauty', productCount: 35 },
            { id: 'fragrances', name: 'Fragrances', slug: 'fragrances', categoryId: 'beauty', productCount: 28 },
            { id: 'mens-grooming', name: "Men's Grooming", slug: 'mens-grooming', categoryId: 'beauty', productCount: 32 },
        ]
    },
    {
        id: 'accessories',
        name: 'Accessories',
        slug: 'accessories',
        icon: '⌚',
        image: images.accessories.bag,
        subcategories: [
            { id: 'watches', name: 'Watches', slug: 'watches', categoryId: 'accessories', productCount: 38 },
            { id: 'bags', name: 'Bags & Luggage', slug: 'bags', categoryId: 'accessories', productCount: 42 },
            { id: 'jewelry', name: 'Jewelry', slug: 'jewelry', categoryId: 'accessories', productCount: 45 },
            { id: 'sunglasses', name: 'Sunglasses & Frames', slug: 'sunglasses', categoryId: 'accessories', productCount: 28 },
            { id: 'belts-wallets', name: 'Belts & Wallets', slug: 'belts-wallets', categoryId: 'accessories', productCount: 32 },
        ]
    },
    {
        id: 'sports',
        name: 'Sports & Fitness',
        slug: 'sports',
        icon: '🏃',
        image: images.sports.gym,
        subcategories: [
            { id: 'fitness', name: 'Fitness Equipment', slug: 'fitness', categoryId: 'sports', productCount: 35 },
            { id: 'sportswear', name: 'Sports Clothing', slug: 'sportswear', categoryId: 'sports', productCount: 42 },
            { id: 'outdoor', name: 'Outdoor & Adventure', slug: 'outdoor', categoryId: 'sports', productCount: 28 },
            { id: 'yoga', name: 'Yoga & Meditation', slug: 'yoga', categoryId: 'sports', productCount: 24 },
            { id: 'team-sports', name: 'Team Sports', slug: 'team-sports', categoryId: 'sports', productCount: 32 },
        ]
    },
];

// Brands per category
export const brands: Record<string, string[]> = {
    electronics: ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Boat', 'JBL', 'Realme', 'Oppo', 'Vivo'],
    fashion: ['Allen Solly', 'Peter England', 'Van Heusen', 'Louis Philippe', 'Levi\'s', 'US Polo', 'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'FabIndia', 'Biba', 'W'],
    'home-living': ['Ikea', 'Nilkamal', 'Urban Ladder', 'Pepperfry', 'Godrej', 'HomeTown', 'Sleepwell', 'Wipro', 'Philips', 'Prestige'],
    beauty: ['Lakme', 'Maybelline', 'L\'Oreal', 'Nykaa', 'Mamaearth', 'Biotique', 'Forest Essentials', 'The Body Shop', 'Nivea', 'Dove'],
    accessories: ['Fossil', 'Titan', 'Fastrack', 'Casio', 'Ray-Ban', 'Oakley', 'Hidesign', 'Wildcraft', 'American Tourister', 'Samsonite'],
    sports: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Decathlon', 'ASICS', 'Under Armour', 'Yonex', 'Cosco', 'SG'],
};

export default categories;
