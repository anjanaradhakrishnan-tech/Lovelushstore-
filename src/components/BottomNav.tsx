import React from 'react';
import { 
  Home, 
  Sparkles, 
  Bookmark, 
  ShoppingBag, 
  LayoutDashboard
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen,
    wishlist,
    isCreatorLoggedIn,
    setActiveTab
  } = useStore();

  const handleHomeClick = () => {
    setActiveTab('products');
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollectionsClick = () => {
    setActiveTab('collections');
    setCurrentView('store');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-1.5 px-3 shadow-lg">
      <div className={`max-w-md mx-auto grid ${isCreatorLoggedIn ? 'grid-cols-5' : 'grid-cols-4'} items-center text-center`}>
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'store' ? 'text-[#ff3b60]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Shop</span>
        </button>

        {/* Collections */}
        <button
          onClick={handleCollectionsClick}
          className="flex flex-col items-center justify-center py-1 text-stone-500 hover:text-stone-800 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5 whitespace-nowrap">Collections</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            currentView === 'wishlist' ? 'text-[#ff3b60]' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-4 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* Cart Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-stone-500 hover:text-stone-800 transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#ff3b60] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Bag</span>
        </button>

        {/* Creator Portal — ONLY visible when already authenticated as Creator! */}
        {isCreatorLoggedIn && (
          <button
            onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
            className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
              currentView === 'admin' ? 'text-[#ff3b60]' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 text-emerald-700">
              Admin
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
