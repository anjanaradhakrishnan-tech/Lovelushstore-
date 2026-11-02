import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Instagram, 
  BarChart3, 
  LogOut, 
  Eye, 
  Sparkles,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AnalyticsTab } from './AnalyticsTab';
import { ProductsTab } from './ProductsTab';
import { InventoryTab } from './InventoryTab';
import { OrdersTab } from './OrdersTab';
import { InstagramAutomationTab } from './InstagramAutomationTab';

type AdminTab = 'analytics' | 'products' | 'inventory' | 'orders' | 'instagram';

export const CreatorAdminPortal: React.FC = () => {
  const { 
    creatorUser, 
    creatorLogout, 
    setCurrentView, 
    orders, 
    products, 
    instagramTriggers 
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('analytics');

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div className="min-h-screen bg-[#f7f6f4] pb-24">
      {/* Top Creator Portal Header */}
      <div className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('store')}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront View</span>
            </button>

            <div className="h-4 w-px bg-stone-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full p-0.5 insta-story-ring">
                <img 
                  src={creatorUser.avatar} 
                  alt={creatorUser.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1">
                  <span>@{creatorUser.handle}</span>
                  <span className="bg-rose-500 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">CREATOR</span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Command Center & Store Manager
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/lovelushstore-source.zip"
              download="lovelushstore-source.zip"
              className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              title="Download entire project source code as .ZIP"
            >
              <Package className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Code ZIP</span>
            </a>

            <button
              onClick={() => setCurrentView('store')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>Preview Store</span>
            </button>

            <button
              onClick={creatorLogout}
              className="p-1.5 bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 rounded-lg transition-colors"
              title="Sign out of Creator Mode"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation Ribbon */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-1 border-t border-stone-800/80 pt-1">
          {[
            { id: 'analytics', label: 'Sales & Analytics', icon: BarChart3 },
            { id: 'products', label: 'Products Catalog', icon: Package, badge: products.length },
            { id: 'inventory', label: 'Inventory Tracker', icon: LayoutDashboard, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-amber-500' },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-rose-500' },
            { id: 'instagram', label: 'Instagram Auto-Links', icon: Instagram, badge: 'Live', badgeColor: 'bg-emerald-500' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as AdminTab)}
                className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                  isActive 
                    ? 'border-rose-500 text-white bg-stone-800/60' 
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white ${tab.badgeColor || 'bg-stone-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeAdminTab === 'analytics' && <AnalyticsTab />}
        {activeAdminTab === 'products' && <ProductsTab />}
        {activeAdminTab === 'inventory' && <InventoryTab />}
        {activeAdminTab === 'orders' && <OrdersTab />}
        {activeAdminTab === 'instagram' && <InstagramAutomationTab />}
      </div>
    </div>
  );
};
