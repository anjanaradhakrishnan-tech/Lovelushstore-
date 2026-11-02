export type Category = 
  | 'All'
  | 'Kurta Sets'
  | 'Dresses'
  | 'Skirts'
  | 'Sarees'
  | 'Co-ords'
  | 'Tops & Shirts'
  | 'Bodycon';

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number; // in INR (current sale price)
  discountedPrice: number; // New sale price / discounted price
  originalPrice: number; // Original retail price before discount
  mrp: number; // original price
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  reelCaption: string; // e.g., "these birthday dresses >>>", "The bodycon"
  reelViews?: string; // e.g. "1.4M", "850K"
  reelUrl?: string; // e.g. instagram reel link
  sizes: string[];
  stock: number;
  sku: string;
  description: string;
  features: string[];
  instagramCode: string; // e.g. "LOVE101", "DRESS12"
  createdAt: string;
  isViralReel?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  price: number;
  selectedSize: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'UPI' | 'Card';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending COD';
  orderStatus: OrderStatus;
  source: 'Direct Store' | 'Instagram Comment Link' | 'Instagram Reel DM';
  couponApplied?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface InstagramTrigger {
  id: string;
  productId: string;
  keyword: string; // e.g. "LINK", "DRESS", "101"
  autoReplyText: string;
  reelTitle: string;
  isActive: boolean;
  dmsSent: number;
  clicks: number;
  ordersConverted: number;
  createdAt: string;
}

export interface InstagramCommentLog {
  id: string;
  commenterHandle: string;
  commentText: string;
  reelTitle: string;
  matchedKeyword: string;
  productTitle: string;
  dmSentText: string;
  status: 'Sent' | 'Clicked' | 'Purchased';
  timestamp: string;
}

export interface CreatorUser {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
  followers: string;
  productsCount: string;
  shoppersCount: string;
}
