import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Tag, 
  Plus, 
  Minus 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotal, 
    setIsCheckoutOpen,
    showToast
  } = useStore();

  const [couponCode, setCouponCode] = useState('LOVE10');
  const [couponApplied, setCouponApplied] = useState(true);

  if (!isCartOpen) return null;

  const discountAmount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const shippingFee = cartTotal >= 799 || cartTotal === 0 ? 0 : 50;
  const grandTotal = cartTotal - discountAmount + shippingFee;
  const freeShippingThreshold = 799;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LOVE10') {
      setCouponApplied(true);
      showToast('Coupon LOVE10 applied! 10% off');
    } else {
      showToast('Invalid coupon code. Try LOVE10');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="text-base font-bold text-stone-900">
              Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="bg-rose-50/70 px-5 py-2.5 border-b border-rose-100">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1">
            {amountToFreeShipping > 0 ? (
              <span>Add <strong className="text-rose-600">₹{amountToFreeShipping}</strong> more for FREE Shipping!</span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <Check className="w-3.5 h-3.5" /> Free Express Shipping Unlocked!
              </span>
            )}
            <span className="text-[10px] text-stone-500">₹799 Target</span>
          </div>
          <div className="w-full bg-rose-200/50 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#ff3b60] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Your bag is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our viral reels and trending collections to find your look.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Browse Outfits
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${item.selectedSize}-${index}`}
                className="flex gap-3.5 p-3 rounded-xl border border-stone-200/80 bg-white shadow-xs"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-stone-400 hover:text-rose-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-0.5 text-[11px] text-stone-500 flex items-center gap-2">
                      <span className="font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-stone-400">{item.product.sku}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Coupon Code section */}
          {cart.length > 0 && (
            <div className="pt-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. LOVE10)"
                    className="w-full bg-stone-50 text-xs pl-8 pr-3 py-2 rounded-lg border border-stone-200 uppercase font-medium focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                >
                  Apply
                </button>
              </form>
              {couponApplied && (
                <div className="mt-1.5 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Extra 10% creator discount applied (-₹{discountAmount})
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="border-t border-stone-200 p-5 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Creator Discount (LOVE10)</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    <strong className="tabular-nums">₹{shippingFee}</strong>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Estimated Total</span>
                <span className="text-base tabular-nums">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-xl bg-[#ff3b60] hover:bg-[#e62e51] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
