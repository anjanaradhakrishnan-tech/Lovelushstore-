import React, { useState } from 'react';
import { 
  Instagram, 
  Sparkles, 
  MessageCircle, 
  Send, 
  Check, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Zap, 
  CheckCircle2,
  Copy,
  Settings
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { InstagramTrigger, Product } from '../../types/store';

export const InstagramAutomationTab: React.FC = () => {
  const { 
    instagramTriggers, 
    addInstagramTrigger, 
    deleteInstagramTrigger, 
    toggleTriggerActive, 
    products, 
    commentLogs, 
    simulateIncomingComment, 
    showToast,
    openProductDetail
  } = useStore();

  // Selected reel ID with fallback
  const [selectedReelId, setSelectedReelId] = useState<string>(() => products[0]?.id || '');
  
  // Safely resolve the active reel product
  const activeReel = products.find(p => p.id === selectedReelId) || products[0] || null;

  // New Trigger Modal State
  const [isAddTriggerModalOpen, setIsAddTriggerModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(() => products[0]?.id || '');
  const [triggerKeyword, setTriggerKeyword] = useState('LINK');
  const [autoReplyMessage, setAutoReplyMessage] = useState('Hey gorgeous! ✨ Here is the exact direct link from our reel: ');
  const [reelTitleInput, setReelTitleInput] = useState('New Viral Reel Drop');

  // Interactive Live Simulator State
  const [simCommentText, setSimCommentText] = useState('link please ❤️');
  const [simUsername, setSimUsername] = useState('fashion_lover_riya');
  const [simDmFeed, setSimDmFeed] = useState<Array<{ sender: 'creator' | 'user'; text: string; product?: Product; timestamp: string }>>(() => [
    {
      sender: 'creator',
      text: 'Hey gorgeous! ✨ Here is your instant direct link to our viral collection! Tap below & use code LOVE10 for 10% off today: \n🔗 lovelushstore.app/#shop',
      product: products[0] || undefined,
      timestamp: '11:42 AM',
    }
  ]);
  const [simCommentsList, setSimCommentsList] = useState<Array<{ username: string; comment: string; time: string }>>([
    { username: 'aanya_style', comment: 'obsessed with this dress! 💕', time: '15m' },
    { username: 'pooja.verma', comment: 'link please!!', time: '8m' },
    { username: 'tanya_sharma2', comment: 'where is this from???', time: '3m' },
  ]);

  const handleCreateTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProdId = selectedProductId || products[0]?.id;
    if (!targetProdId || !triggerKeyword.trim()) return;

    const prod = products.find(p => p.id === targetProdId);
    addInstagramTrigger({
      productId: targetProdId,
      keyword: triggerKeyword.toUpperCase().trim(),
      autoReplyText: autoReplyMessage,
      reelTitle: reelTitleInput || prod?.reelCaption || `${prod?.title || 'Outfit'} Reel`,
      isActive: true,
    });

    setIsAddTriggerModalOpen(false);
    setTriggerKeyword('LINK');
  };

  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simCommentText.trim()) return;

    // 1. Add comment to Reel Comments feed
    const newComment = {
      username: simUsername,
      comment: simCommentText,
      time: 'Just now',
    };
    setSimCommentsList(prev => [...prev, newComment]);

    // 2. Trigger the automated comment link processor
    const activeCaption = activeReel?.reelCaption || activeReel?.title || 'Viral Reel';
    const result = simulateIncomingComment(
      simUsername,
      simCommentText,
      activeCaption
    );

    // 3. Dispatch simulated automated DM to the customer within 400ms
    setTimeout(() => {
      if (result.matched && result.product) {
        setSimDmFeed(prev => [
          ...prev,
          {
            sender: 'creator',
            text: result.dmMessage || `Hey babe! ✨ Here is your link to ${result.product?.title}:`,
            product: result.product,
            timestamp: 'Just now',
          }
        ]);
        showToast(`⚡ Automation fired! Sent direct link for "${result.product.title}" to @${simUsername}`);
      }
    }, 400);

    setSimCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Instagram Integration Header Status */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-0.5 rounded-2xl shadow-sm">
        <div className="bg-white p-5 rounded-[15px] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl insta-gradient-border text-white flex items-center justify-center shrink-0 shadow-sm">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  Instagram Comment-to-Link Engine
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected: @lovelushstore
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Automatically detects when followers comment keywords like <strong>"LINK"</strong>, <strong>"PRICE"</strong>, or codes on your Reels and sends an instant DM containing the direct checkout link.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedProductId(products[0]?.id || '');
                setIsAddTriggerModalOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Trigger Rule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Live Simulator: Test Comment & Instant DM */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
          <div>
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Interactive Comment & Automated DM Simulator</span>
            </h4>
            <p className="text-xs text-stone-500">
              Test how followers experience the automation when they comment on your Instagram Reels.
            </p>
          </div>
          <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
            <span>Active Reel Outfit:</span>
            <select
              value={activeReel?.id || ''}
              onChange={(e) => setSelectedReelId(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-bold text-stone-900"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Split: Instagram Reel Preview (Left) vs Customer DM Inbox (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
          {/* Left Column: Mock Instagram Reel & Comments */}
          <div className="bg-stone-900 text-white rounded-xl overflow-hidden flex flex-col border border-stone-800 shadow-md">
            {/* Reel Header */}
            <div className="p-3 bg-stone-950/80 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full p-0.5 insta-story-ring">
                  {activeReel?.image ? (
                    <img src={activeReel.image} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-rose-500" />
                  )}
                </div>
                <span className="text-xs font-bold">lovelushstore</span>
                <span className="text-[10px] text-stone-400">· Follow</span>
              </div>
              <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">
                Reel Post
              </span>
            </div>

            {/* Reel Visual Media Banner */}
            <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
              {activeReel?.image ? (
                <img 
                  src={activeReel.image} 
                  alt="reel" 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                  No preview available
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 text-xs drop-shadow-md">
                <p className="font-semibold text-white">
                  "{activeReel?.reelCaption || activeReel?.title || 'Trending Collection'}" ✨
                </p>
                <p className="text-[11px] text-rose-300 font-bold mt-0.5">
                  Comment 'LINK' or '{activeReel?.instagramCode || 'LOVE101'}' to get automated DM link!
                </p>
              </div>
            </div>

            {/* Simulated Live Comments Feed */}
            <div className="flex-1 bg-stone-950/90 p-3 space-y-2.5 max-h-48 overflow-y-auto">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Comments ({simCommentsList.length})
              </div>
              {simCommentsList.map((c, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className="font-bold text-stone-200 shrink-0">@{c.username}</span>
                  <span className="text-stone-300 break-words">{c.comment}</span>
                  <span className="text-[10px] text-stone-500 ml-auto shrink-0">{c.time}</span>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSimulateSend} className="p-2.5 bg-stone-900 border-t border-stone-800 flex gap-2">
              <input
                type="text"
                placeholder="Type 'link' or product code..."
                value={simCommentText}
                onChange={(e) => setSimCommentText(e.target.value)}
                className="flex-1 bg-stone-800 text-white text-xs px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-stone-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#ff3b60] hover:bg-[#e62e51] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Post</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Right Column: Customer Instagram Direct Messages (DM) Inbox */}
          <div className="bg-[#faf9f8] rounded-xl border border-stone-200 overflow-hidden flex flex-col shadow-sm">
            {/* DM Top Bar */}
            <div className="p-3 bg-white border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full p-0.5 insta-story-ring">
                  {activeReel?.image ? (
                    <img src={activeReel.image} alt="creator" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-rose-500" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    <span>lovelushstore</span>
                    <span className="w-3 h-3 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center">✓</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Active Now · Auto-Responder</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-mono">
                DM Preview
              </span>
            </div>

            {/* DM Chat Messages Area */}
            <div className="flex-1 p-3.5 space-y-3.5 max-h-72 overflow-y-auto">
              <div className="text-center">
                <span className="text-[10px] text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  Automated Link Sent via Instagram Graph API
                </span>
              </div>

              {simDmFeed.map((msg, idx) => (
                <div key={idx} className="flex flex-col items-start space-y-1.5 max-w-[90%]">
                  {/* Chat bubble text */}
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-3 text-xs text-stone-800 leading-relaxed shadow-xs">
                    {msg.text}
                  </div>

                  {/* Rich Product Card inside DM */}
                  {msg.product && (
                    <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs w-full">
                      <div className="flex gap-2.5 p-2 bg-stone-50/50">
                        <img 
                          src={msg.product.image} 
                          alt={msg.product.title} 
                          className="w-14 h-16 rounded-lg object-cover border border-stone-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-stone-900 text-xs truncate">
                            {msg.product.title}
                          </h5>
                          {(() => {
                            const salePrice = msg.product.discountedPrice ?? msg.product.price;
                            const origPrice = msg.product.originalPrice ?? msg.product.mrp ?? salePrice;
                            const hasDiscount = origPrice > salePrice;
                            return (
                              <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                                <span className="font-extrabold text-stone-900 text-xs">
                                  ₹{salePrice.toLocaleString('en-IN')}
                                </span>
                                {hasDiscount && (
                                  <span className="text-[10px] text-stone-400 line-through">
                                    ₹{origPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                                {msg.product.discountPercent > 0 && (
                                  <span className="text-[10px] text-rose-600 font-bold">
                                    {msg.product.discountPercent}% OFF
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                          {msg.product.sizes && msg.product.sizes.length > 0 && (
                            <div className="text-[10px] text-stone-500 mt-0.5">
                              Sizes: {msg.product.sizes.slice(0, 3).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* DM CTA Button */}
                      <div className="p-2 border-t border-stone-100 bg-white">
                        <button
                          onClick={() => {
                            if (msg.product) openProductDetail(msg.product);
                          }}
                          className="w-full py-2 bg-[#ff3b60] hover:bg-[#e62e51] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <span>Shop Now & Apply Code</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[9px] text-stone-400 pl-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input note */}
            <div className="p-2.5 bg-stone-100 text-center text-[11px] text-stone-500 border-t border-stone-200">
              ⚡ Instant link dispatched via <strong>ManyChat & Instagram Webhook</strong> integration
            </div>
          </div>
        </div>
      </div>

      {/* Configured Instagram Trigger Rules Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              Active Comment Trigger Rules ({instagramTriggers.length})
            </h4>
            <p className="text-xs text-stone-500">
              Keywords monitored across your Instagram reels with automatic direct link responses.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedProductId(products[0]?.id || '');
              setIsAddTriggerModalOpen(true);
            }}
            className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            + Add Rule
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Keyword Trigger</th>
                <th className="py-2.5 px-3">Target Outfit</th>
                <th className="py-2.5 px-3">DMs Sent</th>
                <th className="py-2.5 px-3">Clicks</th>
                <th className="py-2.5 px-3">Sales Converted</th>
                <th className="py-2.5 px-3">Active</th>
                <th className="py-2.5 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {instagramTriggers.map((t) => {
                const prod = products.find(p => p.id === t.productId);
                return (
                  <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        {t.keyword}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-stone-900 truncate max-w-xs">
                        {prod?.title || 'Selected Outfit'}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">
                        Reel: {t.reelTitle}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-semibold text-stone-900">
                      {(t.dmsSent || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums text-stone-600">
                      {(t.clicks || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums font-bold text-emerald-700">
                      {t.ordersConverted || 0} orders
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => toggleTriggerActive(t.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                          t.isActive ? 'bg-emerald-500' : 'bg-stone-300'
                        }`}
                      >
                        <span 
                          className={`w-4 h-4 rounded-full bg-white block transition-transform shadow-xs ${
                            t.isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => deleteInstagramTrigger(t.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Automation Logs */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs">
        <h4 className="text-sm font-bold text-stone-900 mb-1">
          Recent Automated Link Logs
        </h4>
        <p className="text-xs text-stone-500 mb-3">
          Live stream of comments detected on Instagram and automated DM dispatches.
        </p>

        <div className="space-y-2">
          {commentLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between text-xs gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">@{log.commenterHandle}</span>
                  <span className="text-stone-400">commented</span>
                  <span className="italic text-stone-700 font-medium">"{log.commentText}"</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                  <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Auto-DM Dispatched
                  </span>
                  <span>·</span>
                  <span className="text-stone-600">Product: {log.productTitle}</span>
                </div>
              </div>
              <span className="text-[10px] text-stone-400 shrink-0 font-medium">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Trigger Modal */}
      {isAddTriggerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            <h4 className="text-sm font-bold text-stone-900 mb-1">Add Comment Link Automation Rule</h4>
            <p className="text-xs text-stone-500 mb-4">
              Map a comment trigger keyword or code to a specific outfit in your store.
            </p>

            <form onSubmit={handleCreateTrigger} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Outfit to Link</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Trigger Keyword (e.g. LINK, DRESS, 101)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LINK, YELLOW, LOVE101"
                  value={triggerKeyword}
                  onChange={(e) => setTriggerKeyword(e.target.value.toUpperCase())}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Reel / Lookbook Reference Title</label>
                <input
                  type="text"
                  placeholder="e.g. these birthday dresses >>>"
                  value={reelTitleInput}
                  onChange={(e) => setReelTitleInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Automated DM Message Template</label>
                <textarea
                  rows={2}
                  value={autoReplyMessage}
                  onChange={(e) => setAutoReplyMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  The product direct checkout link & LOVE10 code will be appended automatically.
                </span>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTriggerModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800"
                >
                  Save Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
