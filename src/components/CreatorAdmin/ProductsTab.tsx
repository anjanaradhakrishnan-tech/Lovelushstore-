import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  Instagram, 
  AlertCircle, 
  Check, 
  X,
  Image as ImageIcon,
  UploadCloud,
  Camera,
  FolderOpen,
  RefreshCw,
  Upload
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Category } from '../../types/store';

const CATEGORIES: Category[] = [
  'Kurta Sets',
  'Dresses',
  'Skirts',
  'Sarees',
  'Co-ords',
  'Tops & Shirts',
  'Bodycon',
];

const PRESET_IMAGES = [
  { label: 'Yellow Chiffon Dress', url: '/src/assets/images/lovelush_yellow_dress_1793610732834.jpg' },
  { label: 'Ethnic Kurta Set', url: '/src/assets/images/lovelush_kurta_set_1793610733491.jpg' },
  { label: 'Rose Gold Bodycon', url: '/src/assets/images/lovelush_bodycon_gown_1793610735256.jpg' },
  { label: 'Champagne Satin Skirt', url: '/src/assets/images/lovelush_satin_skirt_1793610734338.jpg' },
  { label: 'Buttercup Midi Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Leather Skirt Set', url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80' },
  { label: 'Floral Boho Shrug', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Black Sculpt Slip', url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Azure Resort Shirt', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Brown Milkmaid Dress', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80' },
];

export const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateStock, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Dresses');
  const [discountedPrice, setDiscountedPrice] = useState<number>(999);
  const [originalPrice, setOriginalPrice] = useState<number>(1999);
  const [stock, setStock] = useState<number>(15);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [reelCaption, setReelCaption] = useState('these birthday dresses >>>');
  const [instagramCode, setInstagramCode] = useState('LOVE105');
  const [description, setDescription] = useState('');
  const [sizesInput, setSizesInput] = useState('XS, S, M, L, XL');

  // Device Image Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageTab, setImageTab] = useState<'device' | 'presets' | 'url'>('device');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch = (p.title?.toLowerCase().includes(term) ?? false) || 
                          (p.sku?.toLowerCase().includes(term) ?? false) ||
                          (p.instagramCode?.toLowerCase().includes(term) ?? false);
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Dresses');
    setDiscountedPrice(999);
    setOriginalPrice(1999);
    setStock(15);
    setImage('');
    setUploadFileName('');
    setImageTab('device');
    setReelCaption('new viral drop ✨');
    setInstagramCode(`LOVE${Math.floor(100 + Math.random() * 900)}`);
    setDescription('Trending boutique fashion piece, high quality fabric tailored for modern aesthetics.');
    setSizesInput('XS, S, M, L, XL');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setDiscountedPrice(p.discountedPrice ?? p.price);
    setOriginalPrice(p.originalPrice ?? p.mrp ?? p.price);
    setStock(p.stock);
    setImage(p.image);
    setUploadFileName(p.image.startsWith('data:') ? 'Uploaded image from device' : '');
    setImageTab(p.image.startsWith('data:') ? 'device' : 'presets');
    setReelCaption(p.reelCaption || '');
    setInstagramCode(p.instagramCode);
    setDescription(p.description);
    setSizesInput(p.sizes.join(', '));
    setIsModalOpen(true);
  };

  // Device File Upload Handler with client-side canvas optimization
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    setIsProcessingImage(true);
    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimize image to maximum 1200px dimension
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
          setImage(compressedDataUrl);
          setIsProcessingImage(false);
          showToast(`Photo "${file.name}" loaded from device ✨`);
        } else {
          setImage(e.target?.result as string);
          setIsProcessingImage(false);
          showToast(`Photo "${file.name}" loaded from device ✨`);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      showToast('Please upload an image from your device or pick a photo');
      return;
    }

    const discount = originalPrice > discountedPrice ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
    const sizes = sizesInput.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        category,
        price: discountedPrice,
        discountedPrice,
        originalPrice,
        mrp: originalPrice,
        discountPercent: discount,
        stock,
        image,
        reelCaption,
        instagramCode: instagramCode.toUpperCase(),
        description,
        sizes,
      });
    } else {
      addProduct({
        title,
        category,
        price: discountedPrice,
        discountedPrice,
        originalPrice,
        mrp: originalPrice,
        discountPercent: discount,
        rating: 4.8,
        reviewsCount: 1,
        stock,
        sku: `LL-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        image,
        reelCaption,
        instagramCode: instagramCode.toUpperCase(),
        description,
        features: ['Premium comfort fabric', 'Quality stitching & lining', 'True to Indian sizing'],
        sizes,
        isViralReel: true,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-900">Product Catalog Management</h3>
          <p className="text-xs text-stone-500">
            Upload new fashion items from your device gallery, edit pricing & stock, configure Instagram comment tags, and delete items.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[#ff3b60] hover:bg-[#e62e51] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, SKU, or Instagram code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-stone-900"
        >
          <option value="All">All Categories ({products.length})</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price & MRP</th>
                <th className="py-3 px-3">Inventory Stock</th>
                <th className="py-3 px-3">Instagram Trigger</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Title & Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-10 h-12 rounded object-cover object-top border border-stone-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 max-w-xs">
                        <div className="font-semibold text-stone-900 truncate">{p.title}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          SKU: {p.sku} {p.reelCaption && `· "${p.reelCaption}"`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 tabular-nums">
                    {(() => {
                      const salePrice = p.discountedPrice ?? p.price;
                      const origPrice = p.originalPrice ?? p.mrp ?? salePrice;
                      const hasDiscount = origPrice > salePrice;
                      return (
                        <div>
                          <div className="font-bold text-stone-900">₹{salePrice.toLocaleString('en-IN')}</div>
                          {hasDiscount && (
                            <div className="text-[10px] text-stone-400 line-through">
                              ₹{origPrice.toLocaleString('en-IN')} ({p.discountPercent}% off)
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </td>

                  {/* Stock with quick +/- buttons */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold tabular-nums px-2 py-0.5 rounded text-xs ${
                        p.stock === 0 
                          ? 'bg-rose-100 text-rose-700' 
                          : p.stock <= 5 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.stock} units
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => updateStock(p.id, 1)}
                          className="w-4 h-4 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] flex items-center justify-center font-bold"
                          title="Increase stock"
                        >
                          +
                        </button>
                        <button
                          onClick={() => updateStock(p.id, -1)}
                          disabled={p.stock <= 0}
                          className="w-4 h-4 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] flex items-center justify-center font-bold disabled:opacity-40"
                          title="Decrease stock"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Instagram Trigger code */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                      <Instagram className="w-3 h-3 text-rose-500" />
                      <span>{p.instagramCode}</span>
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 text-stone-400 hover:text-stone-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload & Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-rose-500" />
                <span>{editingProduct ? `Edit Product: ${editingProduct.title}` : 'Upload New Product & Lookbook Outfit'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Product Image Section with Device Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>Product Photo *</span>
                    <span className="text-rose-500 font-normal">(Device Upload Supported)</span>
                  </label>
                  
                  {/* Image source tabs */}
                  <div className="flex bg-stone-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageTab('device')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${imageTab === 'device' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      From Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${imageTab === 'presets' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      Preset Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2.5 py-1 rounded-md transition-colors ${imageTab === 'url' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      Web URL
                    </button>
                  </div>
                </div>

                {/* Tab 1: Direct Device Upload */}
                {imageTab === 'device' && (
                  <div className="space-y-3">
                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {image ? (
                      /* Image Preview Card */
                      <div className="relative border-2 border-stone-200 rounded-xl p-3 bg-stone-50 flex items-center gap-4">
                        <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-200 border border-stone-300 shrink-0 shadow-xs">
                          <img
                            src={image}
                            alt="Preview"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Image Ready
                          </span>
                          <p className="text-xs font-semibold text-stone-900 truncate mt-1">
                            {uploadFileName || 'Selected Device Photo'}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Optimized for crisp mobile & desktop lookbook display.
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Change Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImage('');
                                setUploadFileName('');
                              }}
                              className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop / Tap to Upload Zone */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                          isDragging 
                            ? 'border-rose-500 bg-rose-50/70 scale-[0.99]' 
                            : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2.5 shadow-2xs">
                          {isProcessingImage ? (
                            <RefreshCw className="w-6 h-6 animate-spin text-rose-600" />
                          ) : (
                            <UploadCloud className="w-6 h-6" />
                          )}
                        </div>

                        <div className="text-xs font-bold text-stone-900">
                          {isProcessingImage ? 'Optimizing photo...' : 'Tap to choose photo from device or Camera'}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                          Supports phone gallery photos, JPG, PNG, WEBP (automatically optimized).
                        </p>

                        <div className="mt-3.5 flex items-center justify-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-[11px] font-semibold shadow-2xs">
                            <FolderOpen className="w-3.5 h-3.5 text-rose-500" /> Browse Files
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-[11px] font-semibold shadow-2xs">
                            <Camera className="w-3.5 h-3.5 text-stone-600" /> Take Photo
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Preset Photos */}
                {imageTab === 'presets' && (
                  <div>
                    <p className="text-[11px] text-stone-500 mb-2">
                      Choose from curated high-fashion lookbook presets:
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => {
                            setImage(preset.url);
                            setUploadFileName(preset.label);
                          }}
                          className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            image === preset.url ? 'border-rose-500 ring-2 ring-rose-200' : 'border-stone-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Direct Web URL */}
                {imageTab === 'url' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Paste image web link (https://...)"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setUploadFileName('Custom Web URL');
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pastel Organza Ruched Flutter Dress"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Inventory Stock Units *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Original Price / MRP (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Shown struck-through to shoppers
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discounted Sale Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-stone-900 font-bold text-stone-900"
                  />
                  {originalPrice > discountedPrice && (
                    <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
                      Save ₹{originalPrice - discountedPrice} ({Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% off)
                    </span>
                  )}
                </div>
              </div>

              {/* Instagram Auto-Link Trigger Code */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <Instagram className="w-4 h-4 text-rose-500" />
                  <span>Instagram Automated Comment Trigger</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Trigger Shortcode (e.g. LOVE101)
                    </label>
                    <input
                      type="text"
                      required
                      value={instagramCode}
                      onChange={(e) => setInstagramCode(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                      Lookbook Reel Caption
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. these birthday dresses >>>"
                      value={reelCaption}
                      onChange={(e) => setReelCaption(e.target.value)}
                      className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Available Sizes (Comma separated)</label>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="XS, S, M, L, XL"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 cursor-pointer shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
