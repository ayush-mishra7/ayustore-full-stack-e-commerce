// Comprehensive Product Data for India E-Commerce
import { Product } from '../types';

// Helper to generate product IDs
let productId = 1;
const nextId = () => productId++;

// Product images
const img = {
    phone1: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    phone2: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500',
    phone3: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500',
    laptop1: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    laptop2: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500',
    laptop3: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    headphone1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    headphone2: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    headphone3: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
    watch1: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    watch2: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
    tv1: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
    speaker1: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    camera1: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    tablet1: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    shirt1: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    shirt2: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    tshirt1: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    tshirt2: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500',
    jeans1: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500',
    dress1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
    shoes1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    shoes2: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
    sofa1: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    bed1: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
    table1: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500',
    lamp1: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    skincare1: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    makeup1: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
    bag1: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    wallet1: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    sunglasses1: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    gym1: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
    yoga1: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
};

// Electronics Products
const electronicsProducts: Product[] = [
    // Mobile Phones
    { id: nextId(), name: 'Samsung Galaxy S24 Ultra 5G', price: 129999, mrp: 149999, description: 'Flagship smartphone with 200MP camera, S Pen support, and Snapdragon 8 Gen 3', category: 'electronics', subcategory: 'mobiles', brand: 'Samsung', image: img.phone1, rating: 4.7, reviews: 12453, stock: 45, isBestSeller: true },
    { id: nextId(), name: 'iPhone 15 Pro Max 256GB', price: 159900, mrp: 169900, description: 'Apple A17 Pro chip, Titanium design, 48MP camera system', category: 'electronics', subcategory: 'mobiles', brand: 'Apple', image: img.phone2, rating: 4.8, reviews: 23456, stock: 32, isFeatured: true },
    { id: nextId(), name: 'OnePlus 12 5G (12GB RAM)', price: 64999, mrp: 69999, description: 'Snapdragon 8 Gen 3, 100W SUPERVOOC charging, Hasselblad camera', category: 'electronics', subcategory: 'mobiles', brand: 'OnePlus', image: img.phone3, rating: 4.6, reviews: 8765, stock: 78, isNewArrival: true },
    { id: nextId(), name: 'Xiaomi 14 Pro 5G', price: 59999, mrp: 64999, description: 'Leica optics, Snapdragon 8 Gen 3, 120W HyperCharge', category: 'electronics', subcategory: 'mobiles', brand: 'Xiaomi', image: img.phone1, rating: 4.5, reviews: 5432, stock: 56 },
    { id: nextId(), name: 'Realme GT 5 Pro', price: 44999, mrp: 49999, description: 'Snapdragon 8 Gen 3, 144Hz display, 100W charging', category: 'electronics', subcategory: 'mobiles', brand: 'Realme', image: img.phone2, rating: 4.4, reviews: 3456, stock: 89 },
    { id: nextId(), name: 'Vivo X100 Pro 5G', price: 89999, mrp: 99999, description: 'ZEISS optics, Dimensity 9300, 100W FlashCharge', category: 'electronics', subcategory: 'mobiles', brand: 'Vivo', image: img.phone3, rating: 4.5, reviews: 2345, stock: 34 },
    { id: nextId(), name: 'Oppo Find X7 Ultra', price: 94999, mrp: 99999, description: 'Dual periscope camera, Snapdragon 8 Gen 3', category: 'electronics', subcategory: 'mobiles', brand: 'Oppo', image: img.phone1, rating: 4.4, reviews: 1234, stock: 23 },
    { id: nextId(), name: 'Samsung Galaxy A54 5G', price: 32999, mrp: 38999, description: 'Awesome display, 64MP camera, 5000mAh battery', category: 'electronics', subcategory: 'mobiles', brand: 'Samsung', image: img.phone2, rating: 4.3, reviews: 15678, stock: 120 },
    { id: nextId(), name: 'iPhone 15 128GB', price: 79900, mrp: 84900, description: 'A16 Bionic chip, Dynamic Island, USB-C', category: 'electronics', subcategory: 'mobiles', brand: 'Apple', image: img.phone3, rating: 4.7, reviews: 18765, stock: 67 },
    { id: nextId(), name: 'Redmi Note 13 Pro+ 5G', price: 29999, mrp: 34999, description: '200MP camera, 120W charging, AMOLED display', category: 'electronics', subcategory: 'mobiles', brand: 'Xiaomi', image: img.phone1, rating: 4.4, reviews: 25678, stock: 150, isBestSeller: true },

    // Laptops
    { id: nextId(), name: 'Apple MacBook Air M3 13"', price: 114900, mrp: 119900, description: 'M3 chip, 18-hour battery, Liquid Retina display', category: 'electronics', subcategory: 'laptops', brand: 'Apple', image: img.laptop3, rating: 4.9, reviews: 8765, stock: 28, isFeatured: true },
    { id: nextId(), name: 'Dell XPS 15 (2024)', price: 189990, mrp: 209990, description: 'Intel Core Ultra 7, 32GB RAM, 1TB SSD, OLED display', category: 'electronics', subcategory: 'laptops', brand: 'Dell', image: img.laptop1, rating: 4.7, reviews: 3456, stock: 15 },
    { id: nextId(), name: 'HP Pavilion x360 14"', price: 74990, mrp: 84990, description: '13th Gen Intel Core i5, 16GB RAM, 512GB SSD, Touch', category: 'electronics', subcategory: 'laptops', brand: 'HP', image: img.laptop2, rating: 4.5, reviews: 6789, stock: 45 },
    { id: nextId(), name: 'Lenovo ThinkPad X1 Carbon', price: 165000, mrp: 185000, description: 'Intel Core Ultra 7, 16GB RAM, 1TB SSD, 14" 2.8K OLED', category: 'electronics', subcategory: 'laptops', brand: 'Lenovo', image: img.laptop1, rating: 4.8, reviews: 2345, stock: 12 },
    { id: nextId(), name: 'ASUS ROG Strix G16 Gaming', price: 149990, mrp: 169990, description: 'Intel Core i9, RTX 4070, 32GB RAM, 165Hz display', category: 'electronics', subcategory: 'laptops', brand: 'Asus', image: img.laptop2, rating: 4.6, reviews: 4567, stock: 23, isBestSeller: true },
    { id: nextId(), name: 'Acer Aspire 5 (2024)', price: 54990, mrp: 62990, description: '13th Gen Core i5, 16GB RAM, 512GB SSD, 15.6" FHD', category: 'electronics', subcategory: 'laptops', brand: 'Acer', image: img.laptop1, rating: 4.3, reviews: 8901, stock: 67 },

    // Audio & Headphones
    { id: nextId(), name: 'Sony WH-1000XM5', price: 26990, mrp: 34990, description: 'Industry-leading noise cancellation, 30-hour battery', category: 'electronics', subcategory: 'audio', brand: 'Sony', image: img.headphone1, rating: 4.8, reviews: 15678, stock: 89, isFeatured: true },
    { id: nextId(), name: 'Apple AirPods Pro 2nd Gen', price: 24900, mrp: 26900, description: 'Active noise cancellation, Adaptive Audio, MagSafe', category: 'electronics', subcategory: 'audio', brand: 'Apple', image: img.headphone2, rating: 4.7, reviews: 23456, stock: 120, isBestSeller: true },
    { id: nextId(), name: 'boAt Rockerz 550', price: 1799, mrp: 4990, description: '50mm drivers, 20-hour playback, Bluetooth 5.0', category: 'electronics', subcategory: 'audio', brand: 'Boat', image: img.headphone3, rating: 4.2, reviews: 45678, stock: 234 },
    { id: nextId(), name: 'JBL Tune 770NC', price: 5999, mrp: 8999, description: 'Active noise cancelling, 70-hour battery, JBL Pure Bass', category: 'electronics', subcategory: 'audio', brand: 'JBL', image: img.headphone1, rating: 4.4, reviews: 12345, stock: 156 },
    { id: nextId(), name: 'Samsung Galaxy Buds2 Pro', price: 12999, mrp: 17999, description: '24-bit Hi-Fi audio, ANC, 360 Audio', category: 'electronics', subcategory: 'audio', brand: 'Samsung', image: img.headphone2, rating: 4.5, reviews: 8765, stock: 78 },
    { id: nextId(), name: 'boAt Airdopes 141', price: 1299, mrp: 3990, description: '42-hour playback, ENx Technology, IPX4 rating', category: 'electronics', subcategory: 'audio', brand: 'Boat', image: img.headphone3, rating: 4.1, reviews: 67890, stock: 345, isBestSeller: true },

    // Smart Watches
    { id: nextId(), name: 'Apple Watch Series 9 GPS', price: 41900, mrp: 45900, description: 'S9 chip, Always-On Retina display, Health monitoring', category: 'electronics', subcategory: 'wearables', brand: 'Apple', image: img.watch1, rating: 4.8, reviews: 12345, stock: 56, isFeatured: true },
    { id: nextId(), name: 'Samsung Galaxy Watch 6 Classic', price: 34999, mrp: 41999, description: 'Rotating bezel, BioActive sensor, Wear OS', category: 'electronics', subcategory: 'wearables', brand: 'Samsung', image: img.watch2, rating: 4.6, reviews: 6789, stock: 45 },
    { id: nextId(), name: 'Noise ColorFit Pro 5', price: 4999, mrp: 7999, description: '1.85" AMOLED, Bluetooth calling, 100+ sports modes', category: 'electronics', subcategory: 'wearables', brand: 'Noise', image: img.watch1, rating: 4.3, reviews: 23456, stock: 189, isBestSeller: true },
    { id: nextId(), name: 'Fire-Boltt Phoenix Pro', price: 2999, mrp: 5999, description: '1.39" HD display, Bluetooth calling, SpO2 monitor', category: 'electronics', subcategory: 'wearables', brand: 'Fire-Boltt', image: img.watch2, rating: 4.2, reviews: 34567, stock: 234 },

    // TVs
    { id: nextId(), name: 'Sony Bravia XR A95L 65" OLED', price: 369990, mrp: 399990, description: '4K OLED, Cognitive Processor XR, Google TV', category: 'electronics', subcategory: 'tvs', brand: 'Sony', image: img.tv1, rating: 4.9, reviews: 1234, stock: 8, isFeatured: true },
    { id: nextId(), name: 'Samsung 55" Crystal 4K UHD', price: 47990, mrp: 62990, description: 'Crystal Processor 4K, Smart TV, HDR', category: 'electronics', subcategory: 'tvs', brand: 'Samsung', image: img.tv1, rating: 4.5, reviews: 8765, stock: 45, isBestSeller: true },
    { id: nextId(), name: 'LG 55" OLED evo C3', price: 134990, mrp: 159990, description: 'α9 AI Processor, Dolby Vision, webOS', category: 'electronics', subcategory: 'tvs', brand: 'LG', image: img.tv1, rating: 4.7, reviews: 4567, stock: 23 },
    { id: nextId(), name: 'MI TV 5X 55"', price: 39999, mrp: 54999, description: '4K HDR, Dolby Vision, PatchWall', category: 'electronics', subcategory: 'tvs', brand: 'Xiaomi', image: img.tv1, rating: 4.3, reviews: 12345, stock: 78 },
];

// Fashion Products
const fashionProducts: Product[] = [
    // Men's Clothing
    { id: nextId(), name: 'Allen Solly Regular Fit Formal Shirt', price: 1299, mrp: 2499, description: 'Cotton blend, Regular fit, Full sleeves', category: 'fashion', subcategory: 'men-clothing', brand: 'Allen Solly', image: img.shirt1, rating: 4.4, reviews: 8765, stock: 234 },
    { id: nextId(), name: 'Peter England Slim Fit Shirt', price: 1499, mrp: 2999, description: 'Premium cotton, Slim fit, Easy iron', category: 'fashion', subcategory: 'men-clothing', brand: 'Peter England', image: img.shirt2, rating: 4.3, reviews: 6543, stock: 189 },
    { id: nextId(), name: 'Levi\'s 511 Slim Fit Jeans', price: 2799, mrp: 4999, description: 'Stretch denim, Slim fit, Classic design', category: 'fashion', subcategory: 'men-clothing', brand: 'Levi\'s', image: img.jeans1, rating: 4.5, reviews: 15678, stock: 156, isBestSeller: true },
    { id: nextId(), name: 'US Polo Assn Polo T-Shirt', price: 999, mrp: 1999, description: '100% cotton, Classic fit, Embroidered logo', category: 'fashion', subcategory: 'men-clothing', brand: 'US Polo', image: img.tshirt1, rating: 4.4, reviews: 12345, stock: 267 },
    { id: nextId(), name: 'Van Heusen Ultra Slim Blazer', price: 4999, mrp: 8999, description: 'Premium fabric, Ultra slim fit, Single button', category: 'fashion', subcategory: 'men-clothing', brand: 'Van Heusen', image: img.shirt1, rating: 4.6, reviews: 3456, stock: 45, isFeatured: true },
    { id: nextId(), name: 'Nike Dri-FIT Training T-Shirt', price: 1795, mrp: 2495, description: 'Moisture-wicking, Regular fit, Breathable', category: 'fashion', subcategory: 'men-clothing', brand: 'Nike', image: img.tshirt2, rating: 4.5, reviews: 8901, stock: 178 },

    // Women's Clothing
    { id: nextId(), name: 'Biba Printed Anarkali Kurta', price: 1899, mrp: 3499, description: 'Cotton blend, Flared fit, Ethnic print', category: 'fashion', subcategory: 'women-clothing', brand: 'Biba', image: img.dress1, rating: 4.5, reviews: 9876, stock: 145, isFeatured: true },
    { id: nextId(), name: 'W Solid A-Line Dress', price: 1599, mrp: 2999, description: 'Viscose rayon, Regular fit, Midi length', category: 'fashion', subcategory: 'women-clothing', brand: 'W', image: img.dress1, rating: 4.4, reviews: 7654, stock: 123 },
    { id: nextId(), name: 'FabIndia Silk Saree', price: 4999, mrp: 7999, description: 'Pure silk, Traditional weave, With blouse piece', category: 'fashion', subcategory: 'ethnic', brand: 'FabIndia', image: img.dress1, rating: 4.7, reviews: 4567, stock: 56, isBestSeller: true },
    { id: nextId(), name: 'H&M Slim Fit Blazer', price: 3999, mrp: 5999, description: 'Lined, Single-breasted, Two pockets', category: 'fashion', subcategory: 'women-clothing', brand: 'H&M', image: img.shirt1, rating: 4.3, reviews: 2345, stock: 78 },
    { id: nextId(), name: 'Zara Floral Print Maxi Dress', price: 3299, mrp: 4999, description: 'Flowy fabric, V-neck, Maxi length', category: 'fashion', subcategory: 'women-clothing', brand: 'Zara', image: img.dress1, rating: 4.5, reviews: 5678, stock: 89 },

    // Footwear
    { id: nextId(), name: 'Nike Air Max 270', price: 12995, mrp: 15995, description: 'Max Air unit, Mesh upper, Foam midsole', category: 'fashion', subcategory: 'footwear', brand: 'Nike', image: img.shoes1, rating: 4.7, reviews: 23456, stock: 89, isFeatured: true },
    { id: nextId(), name: 'Adidas Ultraboost 22', price: 14999, mrp: 18999, description: 'Boost midsole, Primeknit upper, Continental rubber', category: 'fashion', subcategory: 'footwear', brand: 'Adidas', image: img.shoes2, rating: 4.8, reviews: 18765, stock: 67, isBestSeller: true },
    { id: nextId(), name: 'Puma RS-X Reinvention', price: 8999, mrp: 11999, description: 'Running System cushioning, Mesh upper, Bold design', category: 'fashion', subcategory: 'footwear', brand: 'Puma', image: img.shoes1, rating: 4.4, reviews: 8765, stock: 123 },
    { id: nextId(), name: 'Woodland Outdoor Boots', price: 5495, mrp: 7495, description: 'Genuine leather, Rubber sole, Water resistant', category: 'fashion', subcategory: 'footwear', brand: 'Woodland', image: img.shoes2, rating: 4.5, reviews: 12345, stock: 156 },
    { id: nextId(), name: 'Bata Power Running Shoes', price: 1999, mrp: 2999, description: 'Lightweight, Memory foam, Anti-slip sole', category: 'fashion', subcategory: 'footwear', brand: 'Bata', image: img.shoes1, rating: 4.2, reviews: 34567, stock: 234 },
];

// Home & Living Products  
const homeProducts: Product[] = [
    // Furniture
    { id: nextId(), name: 'Urban Ladder L-Shaped Sofa', price: 64999, mrp: 84999, description: '6-seater, Premium fabric, Solid wood frame', category: 'home-living', subcategory: 'furniture', brand: 'Urban Ladder', image: img.sofa1, rating: 4.6, reviews: 3456, stock: 12, isFeatured: true },
    { id: nextId(), name: 'Nilkamal Sheesham Wood Dining Table', price: 24999, mrp: 34999, description: '6-seater, Solid sheesham wood, Natural finish', category: 'home-living', subcategory: 'furniture', brand: 'Nilkamal', image: img.table1, rating: 4.4, reviews: 2345, stock: 18 },
    { id: nextId(), name: 'Godrej Interio King Size Bed', price: 45999, mrp: 59999, description: 'Engineered wood, Storage drawers, Modern design', category: 'home-living', subcategory: 'furniture', brand: 'Godrej', image: img.bed1, rating: 4.5, reviews: 4567, stock: 15, isBestSeller: true },
    { id: nextId(), name: 'Pepperfry Ergonomic Office Chair', price: 12999, mrp: 18999, description: 'Mesh back, Lumbar support, Height adjustable', category: 'home-living', subcategory: 'furniture', brand: 'Pepperfry', image: img.sofa1, rating: 4.3, reviews: 6789, stock: 45 },

    // Kitchen
    { id: nextId(), name: 'Prestige Iris 750W Mixer Grinder', price: 3499, mrp: 5495, description: '3 stainless steel jars, 750W motor, 5-year warranty', category: 'home-living', subcategory: 'kitchen', brand: 'Prestige', image: img.lamp1, rating: 4.4, reviews: 15678, stock: 89, isBestSeller: true },
    { id: nextId(), name: 'Philips HD6975 Digital Air Fryer', price: 9999, mrp: 14995, description: '7L capacity, Digital display, 1500W', category: 'home-living', subcategory: 'kitchen', brand: 'Philips', image: img.lamp1, rating: 4.5, reviews: 8765, stock: 56 },
    { id: nextId(), name: 'Borosil 5L Stainless Steel Pressure Cooker', price: 2499, mrp: 3999, description: 'Tri-ply base, Induction compatible, 5-year warranty', category: 'home-living', subcategory: 'kitchen', brand: 'Borosil', image: img.lamp1, rating: 4.6, reviews: 12345, stock: 134 },

    // Lighting
    { id: nextId(), name: 'Philips Hue Smart LED Bulb Starter Kit', price: 7999, mrp: 9999, description: 'Color changing, Voice control, Bluetooth', category: 'home-living', subcategory: 'lighting', brand: 'Philips', image: img.lamp1, rating: 4.7, reviews: 5678, stock: 67, isFeatured: true },
    { id: nextId(), name: 'Wipro Garnet 22W LED Panel Light', price: 899, mrp: 1499, description: 'Cool daylight, Slim design, Energy efficient', category: 'home-living', subcategory: 'lighting', brand: 'Wipro', image: img.lamp1, rating: 4.3, reviews: 23456, stock: 189 },
];

// Beauty Products
const beautyProducts: Product[] = [
    { id: nextId(), name: 'Lakme 9 to 5 Primer + Matte Foundation', price: 599, mrp: 850, description: 'Oil-free, SPF 15, All day matte finish', category: 'beauty', subcategory: 'makeup', brand: 'Lakme', image: img.makeup1, rating: 4.3, reviews: 34567, stock: 234, isBestSeller: true },
    { id: nextId(), name: 'Maybelline Fit Me Foundation', price: 399, mrp: 599, description: 'Natural finish, Poreless, Lightweight', category: 'beauty', subcategory: 'makeup', brand: 'Maybelline', image: img.makeup1, rating: 4.4, reviews: 45678, stock: 267 },
    { id: nextId(), name: 'Mamaearth Vitamin C Face Serum', price: 549, mrp: 799, description: 'With Turmeric, Brightening, Paraben-free', category: 'beauty', subcategory: 'skincare', brand: 'Mamaearth', image: img.skincare1, rating: 4.2, reviews: 56789, stock: 345, isFeatured: true },
    { id: nextId(), name: 'Nykaa SkinRX 2% Salicylic Acid Serum', price: 649, mrp: 899, description: 'Anti-acne, Pore minimizing, Oil control', category: 'beauty', subcategory: 'skincare', brand: 'Nykaa', image: img.skincare1, rating: 4.3, reviews: 23456, stock: 189 },
    { id: nextId(), name: 'Forest Essentials Soundarya Radiance Cream', price: 3675, mrp: 4200, description: '24K Gold, Anti-aging, Ayurvedic', category: 'beauty', subcategory: 'skincare', brand: 'Forest Essentials', image: img.skincare1, rating: 4.6, reviews: 4567, stock: 45 },
    { id: nextId(), name: 'L\'Oreal Paris Revitalift Crystal Micro-Essence', price: 799, mrp: 1099, description: 'Salicylic Acid, Deep cleansing, Glowing skin', category: 'beauty', subcategory: 'skincare', brand: 'L\'Oreal', image: img.skincare1, rating: 4.4, reviews: 12345, stock: 156 },
];

// Accessories Products
const accessoriesProducts: Product[] = [
    { id: nextId(), name: 'Titan Octane Chronograph Watch', price: 7995, mrp: 10995, description: 'Stainless steel, Water resistant, Luminous hands', category: 'accessories', subcategory: 'watches', brand: 'Titan', image: img.watch1, rating: 4.5, reviews: 8765, stock: 67, isFeatured: true },
    { id: nextId(), name: 'Fastrack Reflex Play Smartwatch', price: 3995, mrp: 5995, description: 'AMOLED display, Bluetooth calling, SpO2 monitor', category: 'accessories', subcategory: 'watches', brand: 'Fastrack', image: img.watch2, rating: 4.3, reviews: 15678, stock: 134 },
    { id: nextId(), name: 'Fossil Grant Chronograph Leather Watch', price: 9995, mrp: 13995, description: 'Genuine leather, Roman numerals, 24-hour dial', category: 'accessories', subcategory: 'watches', brand: 'Fossil', image: img.watch1, rating: 4.6, reviews: 6789, stock: 45, isBestSeller: true },
    { id: nextId(), name: 'Ray-Ban Aviator Classic Sunglasses', price: 8990, mrp: 11990, description: 'Polarized, Metal frame, UV protection', category: 'accessories', subcategory: 'sunglasses', brand: 'Ray-Ban', image: img.sunglasses1, rating: 4.7, reviews: 12345, stock: 89, isFeatured: true },
    { id: nextId(), name: 'American Tourister Urban Track Backpack', price: 2499, mrp: 4999, description: '33L capacity, Laptop compartment, Water resistant', category: 'accessories', subcategory: 'bags', brand: 'American Tourister', image: img.bag1, rating: 4.4, reviews: 23456, stock: 156, isBestSeller: true },
    { id: nextId(), name: 'Hidesign Men\'s Leather Wallet', price: 1895, mrp: 2995, description: 'Genuine leather, RFID blocking, Multiple card slots', category: 'accessories', subcategory: 'belts-wallets', brand: 'Hidesign', image: img.wallet1, rating: 4.5, reviews: 8765, stock: 123 },
];

// Sports Products
const sportsProducts: Product[] = [
    { id: nextId(), name: 'Decathlon 20kg Dumbbell Set', price: 2999, mrp: 4499, description: 'Adjustable weights, Rubber coating, With case', category: 'sports', subcategory: 'fitness', brand: 'Decathlon', image: img.gym1, rating: 4.4, reviews: 6789, stock: 89, isBestSeller: true },
    { id: nextId(), name: 'Nike Yoga Mat 5mm', price: 2495, mrp: 3295, description: 'Non-slip surface, Cushioned, Lightweight', category: 'sports', subcategory: 'yoga', brand: 'Nike', image: img.yoga1, rating: 4.5, reviews: 8765, stock: 145 },
    { id: nextId(), name: 'Adidas Dry-Fit Training Tracksuit', price: 4999, mrp: 6999, description: 'Moisture-wicking, Slim fit, Zip-up jacket', category: 'sports', subcategory: 'sportswear', brand: 'Adidas', image: img.tshirt1, rating: 4.4, reviews: 5678, stock: 78, isFeatured: true },
    { id: nextId(), name: 'Yonex Badminton Racket Nanoray 10F', price: 1990, mrp: 2490, description: 'Lightweight, Isometric head, Pre-strung', category: 'sports', subcategory: 'team-sports', brand: 'Yonex', image: img.gym1, rating: 4.3, reviews: 12345, stock: 167 },
    { id: nextId(), name: 'SG Cricket Bat English Willow', price: 8999, mrp: 12999, description: 'Grade 1 English willow, Full size, With cover', category: 'sports', subcategory: 'team-sports', brand: 'SG', image: img.gym1, rating: 4.6, reviews: 3456, stock: 45 },
];

// Combine all products
export const products: Product[] = [
    ...electronicsProducts,
    ...fashionProducts,
    ...homeProducts,
    ...beautyProducts,
    ...accessoriesProducts,
    ...sportsProducts,
];

// Get products by category
export const getProductsByCategory = (categorySlug: string): Product[] => {
    return products.filter(p => p.category === categorySlug);
};

// Get products by subcategory
export const getProductsBySubcategory = (subcategorySlug: string): Product[] => {
    return products.filter(p => p.subcategory === subcategorySlug);
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
    return products.filter(p => p.isFeatured);
};

// Get best sellers
export const getBestSellers = (): Product[] => {
    return products.filter(p => p.isBestSeller);
};

// Get new arrivals
export const getNewArrivals = (): Product[] => {
    return products.filter(p => p.isNewArrival);
};

export default products;
