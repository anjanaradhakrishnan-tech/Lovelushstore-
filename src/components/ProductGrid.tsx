import React from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { Sparkles, SearchX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery, activeTab } = useStore();

  const filteredProducts = products.filter((p) => {
    const term = (searchQuery || '').toLowerCase();
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      (p.title?.toLowerCase().includes(term) ?? false) ||
      (p.category?.toLowerCase().includes(term) ?? false) ||
      (p.reelCaption ? p.reelCaption.toLowerCase().includes(term) : false) ||
      (p.instagramCode?.toLowerCase().includes(term) ?? false);
    
    if (activeTab === 'bestsellers') {
      return matchesCategory && matchesSearch && (p.rating >= 4.8 || (p.isViralReel ?? false));
    }
    if (activeTab === 'newarrivals') {
      return matchesCategory && matchesSearch && (p.stock > 8 || p.discountPercent >= 50);
    }
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 pb-24">
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-3 mx-2">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">No outfits found</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            We couldn't find matches for "{searchQuery}". Try selecting another category or resetting filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Show All Outfits
          </button>
        </div>
      ) : (
        /* 3-Column Grid on Mobile matching user screenshot, 3-4 columns on desktop */
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
