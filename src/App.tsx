import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { CreatorProfileHeader } from './components/CreatorProfileHeader';
import { ProductGrid } from './components/ProductGrid';
import { WishlistView } from './components/WishlistView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CreatorLoginModal } from './components/CreatorLoginModal';
import { CreatorAdminPortal } from './components/CreatorAdmin/CreatorAdminPortal';
import { BottomNav } from './components/BottomNav';
import { Sparkles, Check, Heart, Instagram, Lock } from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    activeTab, 
    selectedProduct, 
    closeProductDetail,
    toastMessage,
    openProductDetail,
    products,
    setSelectedCategory,
    isCreatorLoggedIn,
    setIsLoginModalOpen
  } = useStore();

  // Handle URL hash direct product linking and #admin access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const target = products.find(p => p.id === prodId);
        if (target) {
          openProductDetail(target);
        }
      } else if (hash === '#admin') {
        if (isCreatorLoggedIn) {
          setCurrentView('admin');
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products, isCreatorLoggedIn]);

  // If Creator Mode is active (Only accessible by the logged-in creator)
  if (currentView === 'admin' && isCreatorLoggedIn) {
    return (
      <>
        <CreatorAdminPortal />
        {/* Modals & Toasts */}
        {selectedProduct && (
          <ProductDetailModal product={selectedProduct} onClose={closeProductDetail} />
        )}
        <CartDrawer />
        <CheckoutModal />
        <CreatorLoginModal />
        <BottomNav />
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-stone-800 animate-slide-down">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] flex flex-col">
      <Header />

      <main className="flex-1">
        {currentView === 'wishlist' ? (
          <WishlistView />
        ) : (
          <>
            <CreatorProfileHeader />

            {/* Special Collections Banner if Collections tab is active */}
            {activeTab === 'collections' && (
              <div className="max-w-4xl mx-auto px-4 pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {[
                    { name: 'Birthday Dresses', category: 'Dresses', tag: 'Trending' },
                    { name: 'Minimal Kurta Sets', category: 'Kurta Sets', tag: 'Festive' },
                    { name: 'Hourglass Bodycons', category: 'Bodycon', tag: 'Popular' },
                    { name: 'Satin & Silk Skirts', category: 'Skirts', tag: 'Chic' },
                  ].map((col) => (
                    <div 
                      key={col.name}
                      onClick={() => setSelectedCategory(col.category as any)}
                      className="cursor-pointer bg-white p-3 rounded-xl border border-stone-200 hover:border-stone-400 transition-all shadow-2xs"
                    >
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{col.tag}</span>
                      <h4 className="text-xs font-bold text-stone-900 mt-0.5">{col.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Product Grid */}
            <ProductGrid />
          </>
        )}
      </main>

      {/* Discreet Footer with Creator Owner portal access */}
      <footer className="border-t border-stone-200/80 bg-white py-6 pb-20 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} LoveLush Store · Curated Trendy Outfits</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Verified Quality & Express Delivery</span>
            <span>·</span>
            {/* Discreet lock icon for owner login */}
            <button
              onClick={() => {
                if (isCreatorLoggedIn) {
                  setCurrentView('admin');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="text-stone-300 hover:text-stone-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Creator Admin Access"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Access</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Nav */}
      <BottomNav />

      {/* Overlay Modals */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={closeProductDetail} />
      )}
      <CartDrawer />
      <CheckoutModal />
      <CreatorLoginModal />

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 border border-stone-800 animate-slide-down">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontContent />
    </StoreProvider>
  );
}
