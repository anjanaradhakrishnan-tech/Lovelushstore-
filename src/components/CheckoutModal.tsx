import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types/store';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    placeOrder 
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const discountAmount = Math.round(cartTotal * 0.1);
  const shippingFee = cartTotal >= 799 ? 0 : 50;
  const grandTotal = cartTotal - discountAmount + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) {
      alert('Please fill in all required shipping fields.');
      return;
    }

    const order = placeOrder({
      customerName: fullName,
      customerPhone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      customerEmail: email || `${phone.replace(/\D/g, '')}@customer.lovelush.store`,
      shippingAddress: {
        fullName,
        phone,
        street,
        city,
        state,
        pincode,
      },
      paymentMethod,
      source: 'Instagram Comment Link',
      couponApplied: 'LOVE10',
    });

    setConfirmedOrder(order);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-scale-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {confirmedOrder ? 'Order Confirmation' : 'Express Checkout'}
            </h3>
            <p className="text-[11px] text-stone-500">
              {confirmedOrder ? `Order #${confirmedOrder.id} successfully received` : 'Secure 256-bit Encrypted Checkout'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Order State */}
        {confirmedOrder ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-stone-900">Order Placed Successfully!</h4>
              <p className="text-xs text-stone-600 mt-1">
                Thank you for shopping with <strong className="text-rose-600">LoveLush Store</strong>. A confirmation WhatsApp & SMS has been sent to <strong>{confirmedOrder.customerPhone}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between font-semibold text-stone-900 pb-2 border-b border-stone-200">
                <span>Order ID: <span className="font-mono">{confirmedOrder.id}</span></span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})
                </span>
              </div>
              <div className="text-stone-600">
                <strong>Deliver to:</strong> {confirmedOrder.shippingAddress.fullName}, {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.pincode}
              </div>
              <div className="text-stone-600">
                <strong>Items ({confirmedOrder.items.length}):</strong>{' '}
                {confirmedOrder.items.map(i => `${i.title} (${i.selectedSize})`).join(', ')}
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-sm">
                <span>Total Amount Paid:</span>
                <span className="tabular-nums">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[80vh] space-y-4">
            {/* Contact details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Contact & Delivery Info</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="For order tracking & invoice"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Flat, House no., Building, Street *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 301, Rosewood Heights, MG Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="6 digits"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                2. Select Payment Method
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Instant UPI */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Smartphone className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Fastest
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Instant UPI</div>
                    <div className="text-[10px] text-stone-500">GPay, PhonePe, Paytm</div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Banknote className="w-4 h-4 text-stone-700" />
                    <span className="text-[10px] font-medium text-stone-500">Pay at Door</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Cash on Delivery</div>
                    <div className="text-[10px] text-stone-500">Verified OTP delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Price Summary */}
            <div className="border-t border-stone-200 pt-3 bg-stone-50 -mx-5 -mb-5 p-5 space-y-3">
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Cart Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>VIP Creator Promo (LOVE10)</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Payable Amount</span>
                  <span className="text-base font-extrabold tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#ff3b60] hover:bg-[#e62e51] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all cursor-pointer"
              >
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
