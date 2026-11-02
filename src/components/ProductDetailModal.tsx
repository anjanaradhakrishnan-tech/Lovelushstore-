import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  ShoppingBag, 
  Sparkles, 
  Instagram, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen, 
    showToast 
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Free Size');
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleShare = () => {
    const url = `${window.location.origin}/#product-${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on LoveLush Store!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast('Product direct link copied! 📋');
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, 1);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
      showToast('Standard delivery available: 3 - 5 business days');
    } else {
      showToast('Please enter a valid 6-digit postal code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div 
        className="bg-white w-full sm:max-w-xl md:max-w-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close & Share */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-mono text-stone-400">
              {product.sku}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              title="Share product link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              title={isSaved ? 'Remove wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-600'}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Main Visual */}
          <div className="relative aspect-[4/5] sm:aspect-[16/11] rounded-xl overflow-hidden bg-stone-100 shadow-inner">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            {product.reelCaption && (
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded shadow-md">
                Lookbook: {product.reelCaption}
              </div>
            )}
          </div>

          {/* Title & Pricing */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {product.title}
            </h2>

            {(() => {
              const salePrice = product.discountedPrice ?? product.price;
              const originalPrice = product.originalPrice ?? product.mrp ?? salePrice;
              const hasDiscount = originalPrice > salePrice;
              const savings = hasDiscount ? originalPrice - salePrice : 0;
              return (
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                      ₹{salePrice.toLocaleString('en-IN')}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-stone-400 line-through tabular-nums">
                        MRP ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.discountPercent > 0 && (
                      <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-200">
                        {product.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <div className="text-[11px] font-semibold text-emerald-700">
                      You save ₹{savings.toLocaleString('en-IN')} on this order!
                    </div>
                  )}
                </div>
              );
            })()}

            <p className="text-[11px] text-stone-500 mt-1">
              Inclusive of all taxes · Free standard delivery on orders above ₹799
            </p>
          </div>

          {/* Instagram Comment-to-Link Feature Highlight */}
          <div className="bg-gradient-to-r from-rose-50 via-amber-50/50 to-rose-50 border border-rose-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-2 rounded-full bg-rose-500 text-white shrink-0 mt-0.5 shadow-xs">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <span>Automated Instagram Comment Link</span>
                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">LIVE</span>
              </p>
              <p className="text-stone-600 mt-1 leading-relaxed">
                Comment <strong className="text-rose-600 font-bold bg-rose-100/70 px-1 rounded">"{product.instagramCode}"</strong> or <strong className="text-rose-600 font-bold bg-rose-100/70 px-1 rounded">"LINK"</strong> on our Instagram reel to instantly receive this direct checkout link in your DMs with promo code <strong className="text-stone-900">LOVE10</strong>!
              </p>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-900">Select Size</span>
              <span className="text-stone-500 font-medium">Standard Indian Sizing</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="text-xs flex items-center gap-2">
            {product.stock > 5 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> In Stock ready for immediate dispatch
              </span>
            ) : product.stock > 0 ? (
              <span className="text-rose-600 font-bold animate-pulse">
                Hurry, only {product.stock} units left in stock!
              </span>
            ) : (
              <span className="text-stone-500 font-bold">Currently Out of Stock</span>
            )}
          </div>

          {/* Description & Details */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Product Overview
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <ul className="text-xs text-stone-600 space-y-1.5 pt-1">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="border-t border-stone-200 pt-4">
            <h4 className="text-xs font-bold text-stone-900 mb-2">Check Delivery Estimate</h4>
            <form onSubmit={handleCheckPincode} className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 560038)"
                className="w-full bg-stone-50 text-xs px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 shrink-0"
              >
                Check
              </button>
            </form>
            {pincodeChecked && (
              <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5" />
                Delivery to {pincode}: Expected in 3-5 business days · Cash on Delivery available
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 border-t border-stone-200 pt-4 text-center">
            <div className="p-2 bg-stone-50 rounded-lg">
              <Truck className="w-4 h-4 mx-auto text-stone-600 mb-1" />
              <div className="text-[10px] font-semibold text-stone-800">Pan-India Express</div>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <RotateCcw className="w-4 h-4 mx-auto text-stone-600 mb-1" />
              <div className="text-[10px] font-semibold text-stone-800">7-Day Easy Exchange</div>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <ShieldCheck className="w-4 h-4 mx-auto text-stone-600 mb-1" />
              <div className="text-[10px] font-semibold text-stone-800">Verified Quality</div>
            </div>
          </div>
        </div>

        {/* Sticky Purchase Module Bottom Bar */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-3 sm:p-4 flex items-center gap-3">
          <button
            onClick={() => {
              addToCart(product, selectedSize, 1);
            }}
            disabled={product.stock <= 0}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-1 py-3 px-4 rounded-xl bg-[#ff3b60] hover:bg-[#e62e51] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
