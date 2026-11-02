import React, { useState } from 'react';
import { 
  Instagram, 
  Search, 
  Share2, 
  Sparkles, 
  Check, 
  X,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types/store';

const CATEGORIES: Category[] = [
  'All',
  'Kurta Sets',
  'Dresses',
  'Skirts',
  'Sarees',
  'Co-ords',
  'Tops & Shirts',
  'Bodycon',
];

export const CreatorProfileHeader: React.FC = () => {
  const { 
    creatorUser, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    products,
    showToast
  } = useStore();

  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      showToast('Following @lovelushstore on Instagram ✨');
    }
  };

  return (
    <div className="bg-white border-b border-stone-200 pt-5 pb-2">
      <div className="max-w-4xl mx-auto px-4">
        {/* Creator Identity Profile Header */}
        <div className="flex items-start gap-4">
          {/* Avatar with Pink/Rose gradient ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] insta-story-ring shadow-sm">
              <div className="w-full h-full rounded-full p-0.5 bg-white">
                <img 
                  src={creatorUser.avatar} 
                  alt={creatorUser.name}
                  className="w-full h-full rounded-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            {/* Instagram small tag */}
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-stone-100">
              <Instagram className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-tight">
                  {creatorUser.name}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                  <Instagram className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-medium text-stone-600">@{creatorUser.handle}</span>
                </div>
              </div>

              {/* Share icon on mobile */}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Store link copied! ✨');
                }}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 sm:hidden"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Follow Button & Followers Count */}
            <div className="flex items-center gap-3 mt-2.5">
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm ${
                  isFollowing 
                    ? 'bg-stone-100 text-stone-800 border border-stone-300' 
                    : 'bg-[#ff3b60] hover:bg-[#e62e51] text-white shadow-rose-200'
                }`}
              >
                {isFollowing ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-stone-700" /> Following
                  </span>
                ) : (
                  'Follow'
                )}
              </button>
              <span className="text-xs font-medium text-stone-600">
                {isFollowing ? '48.6K' : creatorUser.followers} Followers
              </span>
            </div>
          </div>
        </div>

        {/* Bio description */}
        <p className="mt-3.5 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
          {creatorUser.bio}
        </p>

        {/* Wishlink-style 3 Stats Card */}
        <div className="mt-4 grid grid-cols-3 bg-[#f8f7f5] rounded-xl border border-stone-200/80 p-2.5 sm:p-3 text-center divide-x divide-stone-200">
          <div>
            <div className="text-sm sm:text-base font-bold text-stone-900 tabular-nums">
              {products.length}
            </div>
            <div className="text-[11px] sm:text-xs text-stone-500 font-medium">
              Products
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-stone-900 tabular-nums">
              {creatorUser.followers}
            </div>
            <div className="text-[11px] sm:text-xs text-stone-500 font-medium">
              Followers
            </div>
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-stone-900 tabular-nums">
              {creatorUser.shoppersCount}
            </div>
            <div className="text-[11px] sm:text-xs text-stone-500 font-medium">
              Shoppers
            </div>
          </div>
        </div>

        {/* Search Bar matching screenshot */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in @${creatorUser.handle}'s store...`}
            className="w-full bg-[#f8f7f5] hover:bg-stone-100 focus:bg-white text-xs sm:text-sm text-stone-900 placeholder-stone-400 pl-10 pr-9 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Tabs (All Outfits, Collections, Best Sellers, New Drops) */}
        <div className="mt-4 flex items-center justify-between border-b border-stone-200 overflow-x-auto no-scrollbar">
          {(['products', 'collections', 'bestsellers', 'newarrivals'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              products: 'All Outfits',
              collections: 'Collections',
              bestsellers: 'Best Sellers',
              newarrivals: 'New Drops',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold capitalize whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive ? 'text-[#ff3b60]' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {labels[tab]}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff3b60] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-stone-900 shrink-0 pr-1">
            Category
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap font-medium transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
