import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Sparkles, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CreatorLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    creatorLogin, 
    setCurrentView 
  } = useStore();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = creatorLogin(pin || '1234');
    if (success) {
      setCurrentView('admin');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleQuickDemoLogin = () => {
    creatorLogin('1234');
    setCurrentView('admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-4 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-rose-400" />
        </div>

        <h3 className="text-lg font-bold text-stone-900">Creator Authentication</h3>
        <p className="text-xs text-stone-500 mt-1">
          Separate portal for store owner to upload/delete products, manage orders, automate Instagram links, and track inventory & sales.
        </p>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>Creator Security PIN / Password</span>
              <span className="text-[10px] text-stone-400 font-normal">Default PIN: 1234</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter PIN (e.g. 1234)"
                className="w-full text-sm bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 font-mono tracking-widest"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-600 mt-1">
                Incorrect PIN. Please use 1234 or click Quick Creator Login below.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Log In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2 text-stone-400 font-semibold">Or Instant Access</span>
          </div>
        </div>

        {/* 1-Click Fast Login */}
        <button
          onClick={handleQuickDemoLogin}
          type="button"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Quick 1-Click Creator Login</span>
        </button>

        <p className="text-[10px] text-center text-stone-400 mt-3">
          Authenticated for @lovelushstore creator management.
        </p>
      </div>
    </div>
  );
};
