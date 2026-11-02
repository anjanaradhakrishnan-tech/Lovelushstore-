import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  X,
  Instagram,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types/store';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const term = (search || '').toLowerCase();
    const matchesSearch = 
      (o.id?.toLowerCase().includes(term) ?? false) ||
      (o.customerName?.toLowerCase().includes(term) ?? false) ||
      (o.customerPhone ? o.customerPhone.includes(search) : false);
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Packed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-stone-900"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order & Date</th>
                <th className="py-3 px-3">Customer & Phone</th>
                <th className="py-3 px-3">Items Ordered</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Order ID & Source */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900 font-mono text-xs">#{order.id}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {order.source?.includes('Instagram') && (
                      <span className="inline-flex items-center gap-0.5 mt-1 text-[9px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
                        <Instagram className="w-2.5 h-2.5 text-rose-500" /> Auto-DM
                      </span>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-900">{order.customerName}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5 text-stone-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="text-[10px] text-stone-400 truncate max-w-[160px] mt-0.5">
                      {order.shippingAddress.city}, {order.shippingAddress.pincode}
                    </div>
                  </td>

                  {/* Items */}
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img 
                            src={it.image} 
                            alt={it.title}
                            className="w-6 h-7 rounded object-cover border border-stone-200 shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 max-w-[180px]">
                            <div className="text-stone-800 font-medium truncate">{it.title}</div>
                            <div className="text-[10px] text-stone-400">
                              Size {it.selectedSize} · Qty {it.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-stone-800">{order.paymentMethod}</div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      order.paymentStatus === 'Paid' 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : 'text-amber-700 bg-amber-50'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-3 px-3 font-bold text-stone-900 tabular-nums">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${getStatusBadgeClass(order.orderStatus)}`}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Receipt button */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-600 hover:text-stone-900 transition-colors"
                      title="View Order Details"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  Order Summary #{selectedOrderDetails.id}
                </h4>
                <p className="text-[11px] text-stone-500">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Shipping info */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span>Customer Delivery Address</span>
                </div>
                <div className="text-stone-700 font-semibold">{selectedOrderDetails.shippingAddress.fullName}</div>
                <div className="text-stone-600">{selectedOrderDetails.shippingAddress.street}</div>
                <div className="text-stone-600">
                  {selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} - {selectedOrderDetails.shippingAddress.pincode}
                </div>
                <div className="text-stone-600 pt-1 font-mono">
                  Phone: {selectedOrderDetails.shippingAddress.phone}
                </div>
              </div>

              {/* Items */}
              <div>
                <h5 className="font-bold text-stone-900 mb-2">Ordered Outfits</h5>
                <div className="space-y-2">
                  {selectedOrderDetails.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-stone-100">
                      <div className="flex items-center gap-2">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-10 h-12 rounded object-cover border border-stone-200" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-semibold text-stone-900">{item.title}</div>
                          <div className="text-[11px] text-stone-500">Size: {item.selectedSize} · Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-bold text-stone-900 tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost summary */}
              <div className="border-t border-stone-200 pt-3 space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{selectedOrderDetails.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="tabular-nums">-₹{selectedOrderDetails.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{selectedOrderDetails.shippingFee === 0 ? 'FREE' : `₹${selectedOrderDetails.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Total Payable:</span>
                  <span className="tabular-nums">₹{selectedOrderDetails.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
