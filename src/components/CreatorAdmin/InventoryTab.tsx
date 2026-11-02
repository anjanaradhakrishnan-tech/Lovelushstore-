import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  RefreshCw,
  Sparkles,
  TrendingDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const InventoryTab: React.FC = () => {
  const { products, updateStock, setProductStock, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState<'all' | 'low' | 'out'>('all');

  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (filterHealth === 'low') return matchesSearch && p.stock > 0 && p.stock <= 5;
    if (filterHealth === 'out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  const handleQuickRestockAllLow = () => {
    products.forEach(p => {
      if (p.stock <= 5) {
        updateStock(p.id, 10);
      }
    });
    showToast('Restocked +10 units to all low/out-of-stock items');
  };

  return (
    <div className="space-y-5">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 font-medium">Total Inventory in Stock</span>
            <div className="text-2xl font-bold text-stone-900 mt-1 tabular-nums">
              {totalUnits} <span className="text-xs font-normal text-stone-400">units</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Across {products.length} catalog styles</div>
          </div>
          <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-800 font-semibold">Low Stock Warnings</span>
            <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">
              {lowStockCount} <span className="text-xs font-normal">styles</span>
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5">&le; 5 units remaining</div>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-800 font-semibold">Out of Stock Alerts</span>
            <div className="text-2xl font-bold text-rose-700 mt-1 tabular-nums">
              {outOfStockCount} <span className="text-xs font-normal">styles</span>
            </div>
            <div className="text-[11px] text-rose-600 mt-0.5">Hidden from active checkout</div>
          </div>
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inventory by title or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterHealth('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterHealth === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterHealth('low')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterHealth === 'low' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-stone-600'}`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterHealth('out')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterHealth === 'out' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-stone-600'}`}
            >
              Out ({outOfStockCount})
            </button>
          </div>
        </div>

        {lowStockCount > 0 && (
          <button
            onClick={handleQuickRestockAllLow}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restock All Low Stock (+10)</span>
          </button>
        )}
      </div>

      {/* Inventory Stock Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Available Sizes</th>
                <th className="py-3 px-3">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredProducts.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 5;
                return (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-9 h-11 rounded object-cover object-top border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-semibold text-stone-900">{p.title}</div>
                          <div className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-stone-600 text-[11px]">
                        {p.sizes.join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold tabular-nums px-2.5 py-1 rounded text-xs inline-flex items-center gap-1.5 ${
                          isOut 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : isLow 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isOut ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>0 Units (Sold Out)</span>
                            </>
                          ) : isLow ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>{p.stock} Units (Low Stock)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{p.stock} Units Healthy</span>
                            </>
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateStock(p.id, 5)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] transition-colors"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => updateStock(p.id, 10)}
                          className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold text-[11px] transition-colors"
                          title="Add 10 units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => updateStock(p.id, 25)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold text-[11px] transition-colors"
                          title="Add 25 units"
                        >
                          +25
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
