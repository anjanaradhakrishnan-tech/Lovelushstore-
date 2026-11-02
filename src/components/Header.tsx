import React from 'react';
import { 
  Instagram, 
  Share2, 
  ShoppingBag, 
  Sparkles, 
  ArrowLeft,
  SlidersHorizontal,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    creatorUser, 
    cartCount, 
    setIsCartOpen, 
    isCreatorLoggedIn, 
    setIsLoginModalOpen, 
    currentView, 
    setCurrentView,
    showToast 
  } = useStore();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LoveLush Store | Trendy Outfits & Lookbooks',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Store link copied to clipboard! 📋');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Announcement top ribbon */}
      <div className="bg-gradient-to-r from-rose-50 via-stone-100 to-rose-50 px-3 py-1.5 text-center text-[11px] font-medium text-stone-700 flex items-center justify-center gap-2 border-b border-rose-100/60">
        <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        <span>Use code <strong className="text-rose-600 font-bold">LOVE10</strong> for extra 10% OFF · Free Shipping on Prepaid Orders</span>
      </div>

      {/* Main navigation row */}
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Back or Brand Handle */}
        <div className="flex items-center gap-2.5">
          {currentView !== 'store' ? (
            <button 
              onClick={() => setCurrentView('store')}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-stone-100 transition-colors text-stone-700"
              title="Back to storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* Brand handle with discreet secret creator access via verified badge */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-900 tracking-tight text-base sm:text-lg">
              @{creatorUser.handle}
            </span>
            <button 
              onClick={() => {
                if (isCreatorLoggedIn) {
                  setCurrentView(currentView === 'admin' ? 'store' : 'admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              title="Creator Portal"
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-[9px] cursor-pointer transition-colors"
            >
              ✓
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Creator Admin Mode Switcher (ONLY shown if authenticated as Creator) */}
          {isCreatorLoggedIn && (
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                currentView === 'admin' 
                  ? 'bg-rose-500 text-white shadow-rose-200' 
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-rose-300" />
              <span>{currentView === 'admin' ? 'View Store' : 'Dashboard & Orders'}</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Share store"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Cart Bag Icon with live counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-stone-100 text-stone-800 transition-colors cursor-pointer"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ff3b60] text-white text-[10px] font-bold flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
