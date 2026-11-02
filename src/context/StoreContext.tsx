import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  InstagramTrigger, 
  InstagramCommentLog, 
  Category, 
  CreatorUser,
  ShippingAddress,
  PaymentMethod
} from '../types/store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_INSTAGRAM_TRIGGERS, 
  INITIAL_COMMENT_LOGS, 
  INITIAL_CREATOR 
} from '../data/initialData';

interface StoreContextType {
  // Catalog
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;
  setProductStock: (id: string, newStock: number) => void;
  
  // Navigation & Filtering
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: 'products' | 'collections' | 'bestsellers' | 'newarrivals';
  setActiveTab: (tab: 'products' | 'collections' | 'bestsellers' | 'newarrivals') => void;
  currentView: 'store' | 'wishlist' | 'admin';
  setCurrentView: (view: 'store' | 'wishlist' | 'admin') => void;

  // Product Detail Modal
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string, quantity?: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateCartQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    source?: 'Direct Store' | 'Instagram Comment Link' | 'Instagram Reel DM';
    couponApplied?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Creator Auth
  creatorUser: CreatorUser;
  isCreatorLoggedIn: boolean;
  creatorLogin: (pinOrPass: string) => boolean;
  creatorLogout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Instagram Automation
  instagramTriggers: InstagramTrigger[];
  addInstagramTrigger: (trigger: Omit<InstagramTrigger, 'id' | 'dmsSent' | 'clicks' | 'ordersConverted' | 'createdAt'>) => void;
  updateInstagramTrigger: (id: string, updates: Partial<InstagramTrigger>) => void;
  deleteInstagramTrigger: (id: string) => void;
  toggleTriggerActive: (id: string) => void;
  commentLogs: InstagramCommentLog[];
  simulateIncomingComment: (handle: string, commentText: string, reelTitle: string) => {
    matched: boolean;
    trigger?: InstagramTrigger;
    product?: Product;
    dmMessage?: string;
  };

  // Toast / Alerts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'lovelush_products_v2',
  ORDERS: 'lovelush_orders_v2',
  TRIGGERS: 'lovelush_triggers_v2',
  COMMENT_LOGS: 'lovelush_comment_logs_v2',
  CART: 'lovelush_cart_v2',
  WISHLIST: 'lovelush_wishlist_v2',
  CREATOR_LOGGED_IN: 'lovelush_creator_auth_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (!saved) return INITIAL_PRODUCTS;
      const parsed: Product[] = JSON.parse(saved);
      return parsed.map(p => {
        const discPrice = p.discountedPrice ?? p.price;
        const origPrice = p.originalPrice ?? p.mrp ?? p.price;
        return {
          ...p,
          price: discPrice,
          discountedPrice: discPrice,
          originalPrice: origPrice,
          mrp: origPrice,
        };
      });
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Instagram Automation Triggers
  const [instagramTriggers, setInstagramTriggers] = useState<InstagramTrigger[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TRIGGERS);
      return saved ? JSON.parse(saved) : INITIAL_INSTAGRAM_TRIGGERS;
    } catch {
      return INITIAL_INSTAGRAM_TRIGGERS;
    }
  });

  // Comment Logs
  const [commentLogs, setCommentLogs] = useState<InstagramCommentLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMENT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENT_LOGS;
    } catch {
      return INITIAL_COMMENT_LOGS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['prod-001', 'prod-003'];
    } catch {
      return ['prod-001', 'prod-003'];
    }
  });

  // Creator Auth
  const [isCreatorLoggedIn, setIsCreatorLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CREATOR_LOGGED_IN);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [creatorUser] = useState<CreatorUser>(INITIAL_CREATOR);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // UI Navigation
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'collections' | 'bestsellers' | 'newarrivals'>('products');
  const [currentView, setCurrentView] = useState<'store' | 'wishlist' | 'admin'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product[] | any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRIGGERS, JSON.stringify(instagramTriggers));
  }, [instagramTriggers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMMENT_LOGS, JSON.stringify(commentLogs));
  }, [commentLogs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CREATOR_LOGGED_IN, String(isCreatorLoggedIn));
  }, [isCreatorLoggedIn]);

  // Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Product Actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const discPrice = newProdData.discountedPrice ?? newProdData.price;
    const origPrice = newProdData.originalPrice ?? newProdData.mrp ?? discPrice;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
      price: discPrice,
      discountedPrice: discPrice,
      originalPrice: origPrice,
      mrp: origPrice,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Automatically create an Instagram trigger for comment link if code is given
    if (newProduct.instagramCode) {
      const newTrigger: InstagramTrigger = {
        id: `trig-${Date.now().toString().slice(-4)}`,
        productId: newId,
        keyword: newProduct.instagramCode.toUpperCase(),
        autoReplyText: `Hey love! ✨ Here is your instant checkout link to ${newProduct.title}: `,
        reelTitle: newProduct.reelCaption || `${newProduct.title} Reel`,
        isActive: true,
        dmsSent: 0,
        clicks: 0,
        ordersConverted: 0,
        createdAt: new Date().toISOString(),
      };
      setInstagramTriggers(prev => [newTrigger, ...prev]);
    }

    showToast(`Added "${newProduct.title}" to catalog`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updates };
        const discPrice = merged.discountedPrice ?? merged.price;
        const origPrice = merged.originalPrice ?? merged.mrp ?? discPrice;
        return {
          ...merged,
          price: discPrice,
          discountedPrice: discPrice,
          originalPrice: origPrice,
          mrp: origPrice,
        };
      }
      return p;
    }));
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    // Also remove from cart and triggers
    setCart(prev => prev.filter(item => item.product.id !== id));
    setInstagramTriggers(prev => prev.filter(t => t.productId !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    showToast(`Deleted ${prod?.title || 'product'}`);
  };

  const updateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
  };

  const setProductStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  // Product Detail
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Cart actions
  const addToCart = (product: Product, selectedSize: string, quantity: number = 1) => {
    if (product.stock <= 0) {
      showToast('Sorry, this item is currently out of stock!');
      return;
    }
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize, quantity }];
    });
    showToast(`Added to Bag · Size ${selectedSize}`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === selectedSize)));
  };

  const updateCartQuantity = (productId: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === selectedSize) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = ({
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    paymentMethod,
    source = 'Direct Store',
    couponApplied
  }: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    source?: 'Direct Store' | 'Instagram Comment Link' | 'Instagram Reel DM';
    couponApplied?: string;
  }): Order => {
    const subtotal = cartTotal;
    const discount = couponApplied === 'LOVE10' ? Math.round(subtotal * 0.1) : 0;
    const shippingFee = subtotal > 799 ? 0 : 50;
    const totalAmount = subtotal - discount + shippingFee;

    const newOrder: Order = {
      id: `LL-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items: cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        image: item.product.image,
        price: item.product.price,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
      })),
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending COD' : 'Paid',
      orderStatus: 'Confirmed',
      source,
      couponApplied,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock
    cart.forEach(item => {
      updateStock(item.product.id, -item.quantity);
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    showToast(`Order #${newOrder.id} confirmed! Thank you.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
    showToast(`Order #${orderId} marked as ${status}`);
  };

  // Creator Authentication
  const creatorLogin = (pinOrPass: string) => {
    // Allows easy creator access with PIN "1234", "admin", "lovelush", or any quick login
    const validPins = ['1234', 'admin', 'lovelush', 'love', 'creator'];
    if (validPins.includes(pinOrPass.trim().toLowerCase()) || pinOrPass.length > 0) {
      setIsCreatorLoggedIn(true);
      setIsLoginModalOpen(false);
      showToast('Welcome back, Creator! Accessing admin dashboard.');
      return true;
    }
    return false;
  };

  const creatorLogout = () => {
    setIsCreatorLoggedIn(false);
    if (currentView === 'admin') {
      setCurrentView('store');
    }
    showToast('Signed out from Creator Mode');
  };

  // Instagram Automation
  const addInstagramTrigger = (triggerData: Omit<InstagramTrigger, 'id' | 'dmsSent' | 'clicks' | 'ordersConverted' | 'createdAt'>) => {
    const newTrigger: InstagramTrigger = {
      ...triggerData,
      id: `trig-${Date.now().toString().slice(-4)}`,
      dmsSent: 0,
      clicks: 0,
      ordersConverted: 0,
      createdAt: new Date().toISOString(),
    };
    setInstagramTriggers(prev => [newTrigger, ...prev]);
    showToast(`Automated link configured for trigger "${newTrigger.keyword}"`);
  };

  const updateInstagramTrigger = (id: string, updates: Partial<InstagramTrigger>) => {
    setInstagramTriggers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Trigger rule updated');
  };

  const deleteInstagramTrigger = (id: string) => {
    setInstagramTriggers(prev => prev.filter(t => t.id !== id));
    showToast('Trigger deleted');
  };

  const toggleTriggerActive = (id: string) => {
    setInstagramTriggers(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  // Live Instagram Comment Simulator
  const simulateIncomingComment = (handle: string, commentText: string, reelTitle: string) => {
    const cleanComment = commentText.toUpperCase();
    
    // Check if any trigger keyword matches
    const matchedTrigger = instagramTriggers.find(t => 
      t.isActive && (
        cleanComment.includes(t.keyword.toUpperCase()) || 
        cleanComment.includes('LINK') || 
        cleanComment.includes('PRICE') ||
        cleanComment.includes('BUY')
      )
    ) || instagramTriggers[0]; // fallback to first trigger

    if (matchedTrigger) {
      const targetProduct = products.find(p => p.id === matchedTrigger.productId) || products[0];
      if (!targetProduct) {
        return { matched: false };
      }

      const checkoutUrl = `${window.location.origin}/#product-${targetProduct.id}`;
      const fullDmMessage = `${matchedTrigger.autoReplyText || 'Here is your direct link: '}\n🔗 Direct Link: ${checkoutUrl}\n🏷️ Code: LOVE10 for 10% OFF`;

      // Log the event
      const newLog: InstagramCommentLog = {
        id: `c-${Date.now().toString().slice(-4)}`,
        commenterHandle: handle.replace('@', ''),
        commentText,
        reelTitle: reelTitle || targetProduct.reelCaption || targetProduct.title,
        matchedKeyword: matchedTrigger.keyword,
        productTitle: targetProduct.title,
        dmSentText: fullDmMessage,
        status: 'Sent',
        timestamp: 'Just now',
      };

      setCommentLogs(prev => [newLog, ...prev]);

      // Increment trigger metrics
      setInstagramTriggers(prev => prev.map(t => {
        if (t.id === matchedTrigger.id) {
          return { ...t, dmsSent: (t.dmsSent || 0) + 1 };
        }
        return t;
      }));

      return {
        matched: true,
        trigger: matchedTrigger,
        product: targetProduct,
        dmMessage: fullDmMessage,
      };
    }

    return { matched: false };
  };

  return (
    <StoreContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      setProductStock,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      activeTab,
      setActiveTab,
      currentView,
      setCurrentView,
      selectedProduct,
      openProductDetail,
      closeProductDetail,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      orders,
      placeOrder,
      updateOrderStatus,
      creatorUser,
      isCreatorLoggedIn,
      creatorLogin,
      creatorLogout,
      isLoginModalOpen,
      setIsLoginModalOpen,
      instagramTriggers,
      addInstagramTrigger,
      updateInstagramTrigger,
      deleteInstagramTrigger,
      toggleTriggerActive,
      commentLogs,
      simulateIncomingComment,
      toastMessage,
      showToast,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
