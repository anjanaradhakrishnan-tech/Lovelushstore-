import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setCurrentView } = useStore();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>My Wishlist ({savedProducts.length})</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Items you've bookmarked from our reels and store collections.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Your wishlist is empty</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Tap the heart icon on any outfit to save it here for later.
          </p>
          <button
            onClick={() => setCurrentView('store')}
            className="mt-2 px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Explore Trends</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {savedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
