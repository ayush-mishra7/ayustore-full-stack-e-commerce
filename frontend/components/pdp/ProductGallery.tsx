import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images = [], productName }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Fallback if no images
    const safeImages = images.length > 0 ? images : ['https://via.placeholder.com/600'];

    const nextImage = () => setSelectedIndex((prev) => (prev + 1) % safeImages.length);
    const prevImage = () => setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-24">
            {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:h-[500px] min-w-[70px]">
                {safeImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedIndex === idx ? 'border-primary-600 ring-1 ring-primary-200' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <img src={img} alt={`${productName} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 bg-white dark:bg-white rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden group">
                <div
                    className={`w-full h-[400px] md:h-[600px] cursor-zoom-in flex items-center justify-center relative overflow-hidden`}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={(e) => {
                        if (!isZoomed) return;
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - left) / width) * 100;
                        const y = ((e.clientY - top) / height) * 100;
                        e.currentTarget.style.setProperty('--x', `${x}%`);
                        e.currentTarget.style.setProperty('--y', `${y}%`);
                    }}
                    style={{

                    } as React.CSSProperties}
                >
                    <img
                        src={safeImages[selectedIndex]}
                        alt={productName}
                        className={`max-w-full max-h-full object-contain transition-transform duration-200 ${isZoomed ? 'scale-150 origin-[var(--x)_var(--y)]' : 'scale-100'}`}
                    />

                    {!isZoomed && (
                        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <ZoomIn size={20} />
                        </div>
                    )}
                </div>

                {/* Navigation Arrows (Mobile Only or if needed) */}
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md md:hidden">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md md:hidden">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ProductGallery;
