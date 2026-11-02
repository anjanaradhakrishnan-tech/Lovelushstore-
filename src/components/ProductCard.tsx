import React from 'react';
import { Heart, Sparkles, Instagram, Plus } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductDetail, toggleWishlist, isInWishlist } = useStore();
  const isSaved = isInWishlist(product.id);

  return (
    <div 
      onClick={() => openProductDetail(product)}
      className="group cursor-pointer flex flex-col bg-white rounded-lg overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-md transition-all duration-200"
    >
      {/* Media container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Lookbook Reel Caption overlay (matches screenshot: e.g. "these birthday dresses >>>" or "The bodycon") */}
        {product.reelCaption && (
          <div className="absolute top-2 left-2 right-2 flex justify-start pointer-events-none">
            <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded shadow-xs max-w-full truncate">
              {product.reelCaption}
            </span>
          </div>
        )}

        {/* Wishlist Heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-rose-600 transition-colors shadow-xs"
          title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
            }`} 
          />
        </button>

        {/* Instagram Auto-Link Indicator tag */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-stone-900 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs border border-stone-200/50">
            <Instagram className="w-2.5 h-2.5 text-rose-500" />
            <span>Code: {product.instagramCode}</span>
          </span>
        </div>

        {/* Low Stock Warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="bg-rose-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              {product.stock} left
            </span>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs font-semibold px-2.5 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product metadata */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs sm:text-[13px] font-medium text-stone-900 line-clamp-1 leading-snug">
            {product.title}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-stone-500 line-clamp-1 mt-0.5">
            {product.category} · {product.sizes.slice(0, 3).join(', ')}
          </p>
        </div>

        {/* Pricing: New Sale Price + Original Price Struck Through */}
        {(() => {
          const salePrice = product.discountedPrice ?? product.price;
          const originalPrice = product.originalPrice ?? product.mrp ?? salePrice;
          const hasDiscount = originalPrice > salePrice;
          return (
            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-stone-900 tabular-nums">
                ₹{salePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-600">
                  {product.discountPercent}% off
                </span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
