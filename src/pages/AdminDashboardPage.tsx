import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, DeliverySettings, ProductVariant, Coupon, StoreSettings } from '../types';
import { 
  toBengaliNumber, 
  honeyImg, 
  mixedNutsImg, 
  datesRaisinsImg, 
  seedsImg, 
  heroBannerImg 
} from '../data/mockData';
import { compressImageFile } from '../lib/supabase';
import { SupabaseGuideModal } from '../components/SupabaseGuideModal';
import { 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Database, 
  Search, 
  Check, 
  X, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  Truck, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Info, 
  MapPin, 
  ArrowRight,
  Phone,
  Printer,
  Download,
  Tag,
  Settings,
  BarChart3,
  Lock,
  Unlock,
  Key,
  MessageCircle,
  ExternalLink,
  Eye,
  Percent,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface VariantDraft {
  id: string;
  weight: string;
  weightBn: string;
  price: number;
  originalPrice?: number;
}

export const AdminDashboardPage: React.FC = () => {
  const { 
    products, 
    orders, 
    updateProduct, 
    addNewProduct, 
    deleteProduct, 
    updateOrderStatus,
    deliverySettings,
    updateDeliverySettings,
    storeSettings,
    updateStoreSettings,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    isAdminUnlocked,
    verifyAdminPin,
    lockAdmin,
    updateAdminPin,
    isSupabaseConnected,
    isLoadingProducts,
    supabaseError,
    reloadFromSupabase,
    showToast 
  } = useStore();

  // Navigation tab for the all-in-one control center
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'delivery' | 'coupons' | 'settings' | 'analytics'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Invoice modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // PIN lock screen state
  const [enteredPin, setEnteredPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  // Delivery Settings Form State (Synced with StoreContext)
  const [insideDhakaFee, setInsideDhakaFee] = useState<number>(deliverySettings.insideDhakaFee);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState<number>(deliverySettings.outsideDhakaFee);
  const [enableFreeDelivery, setEnableFreeDelivery] = useState<boolean>(deliverySettings.enableFreeDelivery);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(deliverySettings.freeDeliveryThreshold);
  const [customNoticeBn, setCustomNoticeBn] = useState<string>(
    deliverySettings.customNoticeBn || 'বীর উজলী, কাপাসিয়া ও গাজীপুর সদরে দ্রুততম হোম ডেলিভারি!'
  );
  const [deliverySavedNotice, setDeliverySavedNotice] = useState(false);

  useEffect(() => {
    setInsideDhakaFee(deliverySettings.insideDhakaFee);
    setOutsideDhakaFee(deliverySettings.outsideDhakaFee);
    setEnableFreeDelivery(deliverySettings.enableFreeDelivery);
    setFreeDeliveryThreshold(deliverySettings.freeDeliveryThreshold);
    if (deliverySettings.customNoticeBn) {
      setCustomNoticeBn(deliverySettings.customNoticeBn);
    }
  }, [deliverySettings]);

  // Store Settings Form State
  const [storeForm, setStoreForm] = useState<StoreSettings>(storeSettings);

  useEffect(() => {
    setStoreForm(storeSettings);
  }, [storeSettings]);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditUploading, setIsEditUploading] = useState(false);

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdNameBn, setNewProdNameBn] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'honey' | 'nuts' | 'dates' | 'raisins' | 'seeds' | 'oils'>('nuts');
  const [newProdStock, setNewProdStock] = useState(30);
  const [newProdOrigin, setNewProdOrigin] = useState('বীর উজলী বাজার, কাপাসিয়া, গাজীপুর');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState<string>(honeyImg);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Multi-variants draft for new product
  const [newVariants, setNewVariants] = useState<VariantDraft[]>([
    { id: '1', weight: '250g', weightBn: '২৫০ গ্রাম', price: 380, originalPrice: 420 },
    { id: '2', weight: '500g', weightBn: '৫০০ গ্রাম', price: 720, originalPrice: 790 },
    { id: '3', weight: '1kg', weightBn: '১ কেজি', price: 1390, originalPrice: 1550 },
  ]);

  // Coupon Creation State
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percent'>('fixed');
  const [newCouponValue, setNewCouponValue] = useState(50);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(500);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Preset Product Images for Quick 1-Click selection
  const PRESET_IMAGES = [
    { label: 'খাঁটি মধু', img: honeyImg },
    { label: 'কাজু ও কাঠবাদাম', img: mixedNutsImg },
    { label: 'মরিয়ম খেজুর', img: datesRaisinsImg },
    { label: 'চিয়া সিড ও তিসি', img: seedsImg },
    { label: 'প্রিমিয়াম ফুডস ব্যানার', img: heroBannerImg },
  ];

  // Handle local image file upload & client-side compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন');
      return;
    }

    if (isEditMode) {
      setIsEditUploading(true);
    } else {
      setIsUploadingImage(true);
    }

    try {
      const dataUrl = await compressImageFile(file, 850, 0.82);
      if (isEditMode && editingProduct) {
        setEditingProduct({ ...editingProduct, image: dataUrl });
        showToast('পণ্যের নতুন ছবি সফলভাবে লোড হয়েছে');
      } else {
        setNewProdImage(dataUrl);
        showToast('নতুন পণ্যের ছবি সফলভাবে লোড হয়েছে');
      }
    } catch {
      showToast('ছবি লোড করতে সমস্যা হয়েছে, অন্য একটি ছবি চেষ্টা করুন');
    } finally {
      if (isEditMode) {
        setIsEditUploading(false);
      } else {
        setIsUploadingImage(false);
      }
    }
  };

  // Metrics overview
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.nameBn.includes(productSearch) || 
      p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryBn.includes(productSearch) ||
      (p.originBn && p.originBn.includes(productSearch));
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = 
      orderSearchQuery === '' ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery) ||
      o.district.includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  // CSV Export for Courier Logistics
  const handleExportOrdersToCSV = () => {
    if (orders.length === 0) {
      showToast('এক্সপোর্ট করার মতো কোনো অর্ডার নেই');
      return;
    }
    const headers = [
      'Order_ID', 
      'Date_Time', 
      'Customer_Name', 
      'Phone', 
      'District', 
      'Upazila', 
      'Full_Address', 
      'Items_Description', 
      'COD_Amount_BDT', 
      'Delivery_Fee', 
      'Payment_Method', 
      'Status'
    ];

    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${o.createdAt}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.district}"`,
      `"${o.upazila}"`,
      `"${o.fullAddress.replace(/"/g, '""')}"`,
      `"${o.items.map(it => `${it.productNameBn} (${it.variantWeightBn}) x${it.quantity}`).join('; ')}"`,
      o.total,
      o.deliveryFee,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.status.toUpperCase()}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bhawal_fresh_food_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('অর্ডারের কুরিয়ার বুকিং CSV ফাইল সফলভাবে ডাউনলোড হয়েছে');
  };

  // WhatsApp Order Confirmation Helper
  const getWhatsAppUrl = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const internationalPhone = cleanPhone.startsWith('0') ? `88${cleanPhone}` : cleanPhone;
    const itemsText = order.items.map(it => `${it.productNameBn} (${it.variantWeightBn}) × ${toBengaliNumber(it.quantity)}টি`).join(', ');
    const msg = `আসসালামু আলাইকুম ${order.customerName},\n\nভাওয়াল ফ্রেশ ফুড (বীর উজলী বাজার, কাপাসিয়া, গাজীপুর) থেকে আপনার অর্ডার #${order.id} নিশ্চিত করতে যোগাযোগ করছি।\n\nঅর্ডারকৃত পণ্য: ${itemsText}\nমোট মূল্য: ৳${toBengaliNumber(order.total)} (ডেলিভারি চার্জ সহ)\nঠিকানা: ${order.fullAddress}, ${order.upazila}, ${order.district}।\n\nআমরা কি পার্সেলটি কুরিয়ারে বুকিং করব? আপনার উত্তর দিন। ধন্যবাদ!`;
    return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Variant helpers for New Product
  const handleAddVariantRow = () => {
    const nextId = String(Date.now());
    setNewVariants(prev => [
      ...prev,
      { id: nextId, weight: '500g', weightBn: '৫০০ গ্রাম', price: 500, originalPrice: 550 }
    ]);
  };

  const handleUpdateVariantRow = (index: number, field: keyof VariantDraft, value: any) => {
    setNewVariants(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveVariantRow = (index: number) => {
    if (newVariants.length <= 1) {
      showToast('কমপক্ষে ১টি ভ্যারিয়েন্ট বা ওজন থাকতে হবে');
      return;
    }
    setNewVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Create new product
  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameBn.trim()) {
      showToast('পণ্যের বাংলা নাম লিখুন');
      return;
    }
    if (!newProdImage) {
      showToast('অনুগ্রহ করে পণ্যের ছবি নির্বাচন করুন');
      return;
    }

    const randomId = `bff-${Math.floor(100 + Math.random() * 900)}`;
    const categoryBnMap: Record<string, string> = {
      honey: 'প্রাকৃতিক মধু',
      nuts: 'বাদাম সম্ভার',
      dates: 'প্রিমিয়াম খেজুর',
      raisins: 'কিশমিশ',
      seeds: 'বীজ ও সুপারফুড',
      oils: 'খাঁটি তেল'
    };

    const finalVariants: ProductVariant[] = newVariants.map((v, i) => ({
      id: `${randomId}-v${i + 1}`,
      weight: v.weight || '500g',
      weightBn: v.weightBn.trim() || '৫০০ গ্রাম',
      price: Number(v.price) || 0,
      originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
      inStock: true
    }));

    const newProduct: Product = {
      id: randomId,
      nameBn: newProdNameBn.trim(),
      nameEn: newProdNameEn.trim() || newProdNameBn.trim(),
      category: newProdCategory,
      categoryBn: categoryBnMap[newProdCategory] || 'অন্যান্য',
      shortDescBn: newProdDesc.trim() || 'উচ্চমানের তাজা ও খাঁটি প্রাকৃতিক খাদ্য।',
      descriptionBn: newProdDesc.trim() || 'ভাওয়াল ফ্রেশ ফুডের বাছাইকৃত প্রিমিয়াম প্রাকৃতিক পণ্য। কোনো ভেজাল বা ক্ষতিকর প্রিজারভেটিভ ছাড়া সরাসরি সংগ্রহ।',
      benefitsBn: [
        '১০০% খাঁটি ও প্রাকৃতিক উপাদানের নিশ্চয়তা',
        'স্বাস্থ্যসম্মত নিরাপদ এয়ারটাইট প্যাকেজিং',
        'ভাওয়াল ফ্রেশ ফুডের প্রিমিয়াম কোয়ালিটি'
      ],
      image: newProdImage,
      isFeatured: false,
      isBestSeller: false,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProdStock),
      originBn: newProdOrigin.trim() || 'বীর উজলী বাজার, কাপাসিয়া, গাজীপুর',
      variants: finalVariants
    };

    addNewProduct(newProduct);
    setIsAddModalOpen(false);

    // Reset Form
    setNewProdNameBn('');
    setNewProdNameEn('');
    setNewProdDesc('');
    setNewProdImage(honeyImg);
    setNewVariants([
      { id: '1', weight: '250g', weightBn: '২৫০ গ্রাম', price: 380, originalPrice: 420 },
      { id: '2', weight: '500g', weightBn: '৫০০ গ্রাম', price: 720, originalPrice: 790 },
      { id: '3', weight: '1kg', weightBn: '১ কেজি', price: 1390, originalPrice: 1550 },
    ]);
  };

  // Save product edits
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Save delivery charges settings
  const handleSaveDeliverySettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DeliverySettings = {
      insideDhakaFee: Number(insideDhakaFee),
      outsideDhakaFee: Number(outsideDhakaFee),
      enableFreeDelivery,
      freeDeliveryThreshold: Number(freeDeliveryThreshold),
      customNoticeBn: customNoticeBn.trim()
    };
    updateDeliverySettings(updated);
    setDeliverySavedNotice(true);
    setTimeout(() => setDeliverySavedNotice(false), 3000);
  };

  // Quick Preset Delivery Rates
  const applyDeliveryPreset = (inside: number, outside: number, threshold: number, desc: string) => {
    setInsideDhakaFee(inside);
    setOutsideDhakaFee(outside);
    setEnableFreeDelivery(true);
    setFreeDeliveryThreshold(threshold);
    showToast(`প্রিসেট প্রয়োগ হয়েছে: ${desc}`);
  };

  // Save Store Settings Form
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(storeForm);
  };

  // Handle Add New Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase();
    if (!cleanCode) {
      showToast('কুপন কোড লিখুন');
      return;
    }
    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      showToast('এই নামের কুপন ইতিমধ্যে বিদ্যমান আছে');
      return;
    }

    const newC: Coupon = {
      id: `cp-${Date.now()}`,
      code: cleanCode,
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderAmount: Number(newCouponMinOrder),
      isActive: true,
      usageCount: 0,
      descriptionBn: newCouponDesc.trim() || `${cleanCode} স্পেশাল অফার কুপন`
    };

    addCoupon(newC);
    setIsAddCouponModalOpen(false);
    setNewCouponCode('');
    setNewCouponValue(50);
    setNewCouponMinOrder(500);
    setNewCouponDesc('');
  };

  // Handle PIN verify
  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAdminPin(enteredPin);
    setEnteredPin('');
  };

  // Handle Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      showToast('পিন কোড কমপক্ষে ৪ ডিজিটের হতে হবে');
      return;
    }
    updateAdminPin(newPinInput);
    setIsChangingPin(false);
    setNewPinInput('');
  };

  // If locked, show secure PIN unlock screen
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E3D9] p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#14422D] text-[#C59B27] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-black text-[#14422D]">
              ভাওয়াল ফ্রেশ ফুড · অ্যাডমিন লগইন
            </h1>
            <p className="text-xs text-[#7A6E5D] mt-1">
              দোকানের সম্পূর্ণ ড্যাশবোর্ড ও সেটিংস নিয়ন্ত্রণে পিন কোড দিন
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="space-y-4">
            <div className="relative">
              <Key className="w-5 h-5 text-[#8C8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={8}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="অ্যাডমিন পিন (ডিফল্ট: 1234)"
                autoFocus
                className="w-full bg-[#FAF8F5] border-2 border-[#E8E3D9] rounded-2xl pl-11 pr-4 py-3 text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-[#14422D]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#14422D] hover:bg-[#0E3020] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Unlock className="w-4 h-4 text-[#C59B27]" />
              <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
            </button>
          </form>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9] text-[11px] text-[#7A6E5D]">
            💡 শপ ওনার পিন: <strong className="font-mono text-[#14422D]">1234</strong> (ভিতরে প্রবেশ করে সেটিংস থেকে যেকোনো সময় পিন পরিবর্তন করতে পারবেন)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#14422D] flex items-center justify-center text-[#C59B27] shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#14422D]">
                  {storeSettings.shopNameBn} · সর্বাঙ্গীন অ্যাডমিন কন্ট্রোল
                </h1>
                <span className="bg-[#EBF4EF] text-[#14422D] text-[11px] font-bold px-2 py-0.5 rounded border border-[#CDE3D5]">
                  মালিকানা ড্যাশবোর্ড
                </span>
              </div>
              <p className="text-xs text-[#7A6E5D] mt-0.5">
                {storeSettings.addressBn} | {storeSettings.email} | {storeSettings.phonePrimary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isSupabaseConnected ? (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-bold border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>সুপাবেজ ক্লাউড সিঙ্ক</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg font-bold border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>লোকাল ডাটা মোড</span>
              </span>
            )}

            <button
              onClick={() => reloadFromSupabase()}
              className="p-2 hover:bg-[#F5F1E8] text-[#14422D] rounded-lg border border-[#E8E3D9] transition-colors"
              title="ডাটাবেজ রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="bg-[#14422D] hover:bg-[#0E3020] text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Database className="w-4 h-4 text-[#C59B27]" />
              <span>সুপাবেজ স্ট্যাটাস</span>
            </button>

            <button
              onClick={lockAdmin}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors text-xs font-bold flex items-center gap-1"
              title="ড্যাশবোর্ড লক করুন"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লক</span>
            </button>
          </div>
        </div>

        {/* Live Quick Info Strip */}
        <div className="mt-4 pt-4 border-t border-[#F0EBE0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE4D7]">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#524436]">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#14422D]" />
              <span><strong>ডেলিভারি চার্জ:</strong> ঢাকা ও গাজীপুর ৳{toBengaliNumber(deliverySettings.insideDhakaFee)} / বাইরে ৳{toBengaliNumber(deliverySettings.outsideDhakaFee)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#C59B27]" />
              <span><strong>সক্রিয় কুপন:</strong> {toBengaliNumber(coupons.filter(c => c.isActive).length)} টি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${storeSettings.isStoreOpen ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span><strong>দোকান স্ট্যাটাস:</strong> {storeSettings.isStoreOpen ? 'অর্ডার গ্রহণ চালু' : 'অর্ডার গ্রহণ বন্ধ'}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="text-xs font-bold text-[#14422D] bg-white border border-[#D8D0C0] hover:bg-[#EBF4EF] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>দোকান সেটিংস এডিট</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E3D9] shadow-xs cursor-pointer hover:border-[#14422D] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#7A6E5D] mb-1">
            <span>মোট অর্ডার</span>
            <ShoppingBag className="w-4 h-4 text-[#14422D]" />
          </div>
          <div className="text-2xl font-black text-[#14422D] tabular-nums">
            {toBengaliNumber(orders.length)}
          </div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 block">
            {toBengaliNumber(pendingOrdersCount)} টি অর্ডার অপেক্ষমাণ
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('analytics')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E3D9] shadow-xs cursor-pointer hover:border-[#14422D] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#7A6E5D] mb-1">
            <span>মোট বিক্রয় আয়</span>
            <DollarSign className="w-4 h-4 text-[#C59B27]" />
          </div>
          <div className="text-2xl font-black text-[#14422D] tabular-nums">
            ৳{toBengaliNumber(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {toBengaliNumber(deliveredOrdersCount)} টি সফল ডেলিভারি
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('products')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E3D9] shadow-xs cursor-pointer hover:border-[#14422D] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#7A6E5D] mb-1">
            <span>সক্রিয় খাদ্য পণ্য</span>
            <Layers className="w-4 h-4 text-[#14422D]" />
          </div>
          <div className="text-2xl font-black text-[#14422D] tabular-nums">
            {toBengaliNumber(products.length)}
          </div>
          <span className="text-[11px] text-[#7A6E5D] mt-1 block">
            ছবি ও স্টক সহ শপে প্রদর্শিত
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('delivery')}
          className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E3D9] shadow-xs cursor-pointer hover:border-[#14422D] transition-all"
        >
          <div className="flex items-center justify-between text-xs text-[#7A6E5D] mb-1">
            <span>ডেলিভারি চার্জ</span>
            <Truck className="w-4 h-4 text-[#14422D]" />
          </div>
          <div className="text-lg font-black text-[#14422D] tabular-nums">
            ৳{toBengaliNumber(deliverySettings.insideDhakaFee)} / ৳{toBengaliNumber(deliverySettings.outsideDhakaFee)}
          </div>
          <span className="text-[11px] text-[#14422D] font-bold mt-1 block">
            রেট পরিবর্তন করতে ক্লিক করুন &rarr;
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#E8E3D9] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#14422D] text-white shadow-xs'
              : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>পণ্য ও স্টক ({toBengaliNumber(products.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#14422D] text-white shadow-xs'
              : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার ও কুরিয়ার ({toBengaliNumber(orders.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'delivery'
              ? 'bg-[#14422D] text-white shadow-xs'
              : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>ডেলিভারি চার্জ</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'coupons'
              ? 'bg-[#14422D] text-white shadow-xs'
              : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>কুপন ও ডিসকাউন্ট ({toBengaliNumber(coupons.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-[#14422D] text-white shadow-xs'
              : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>দোকান সেটিংস</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-[#14422D] text-white shadow-xs'
              : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>রিপোর্ট ও সেলস</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCTS & INVENTORY CONTROL */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E8E3D9]">
            <div className="flex flex-1 items-center gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C8070] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="পণ্য, ক্যাটাগরি বা এলাকা দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg text-xs focus:outline-none focus:border-[#14422D]"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg px-2.5 py-2 text-xs text-[#2E2820]"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                <option value="honey">প্রাকৃতিক মধু</option>
                <option value="nuts">বাদাম সম্ভার</option>
                <option value="dates">প্রিমিয়াম খেজুর</option>
                <option value="raisins">কিশমিশ</option>
                <option value="seeds">বীজ ও সুপারফুড</option>
                <option value="oils">খাঁটি তেল</option>
              </select>
            </div>
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#14422D] hover:bg-[#0E3020] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-1px] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#C59B27]" />
              <span>ছবি সহ নতুন পণ্য যুক্ত করুন</span>
            </button>
          </div>

          {/* Product Catalog Table */}
          <div className="bg-white rounded-xl border border-[#E8E3D9] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2E2820]">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E3D9] text-[#6B5E4F] font-semibold">
                  <tr>
                    <th className="p-3.5">পণ্যের ছবি ও নাম</th>
                    <th className="p-3.5">ক্যাটাগরি ও সংগ্রহস্থল</th>
                    <th className="p-3.5">ওজন ও বিক্রয় মূল্য (BDT)</th>
                    <th className="p-3.5">মজুদ (Stock)</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#E8E3D9] shrink-0 bg-[#F5F1E8]">
                          <img
                            src={p.image}
                            alt={p.nameBn}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#14422D] line-clamp-1">{p.nameBn}</p>
                          <span className="text-[10px] text-[#8C8070] font-mono">{p.id}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-[#14422D] block">{p.categoryBn}</span>
                        <span className="text-[10px] text-[#8C8070] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#C59B27]" />
                          <span>{p.originBn || 'কাপাসিয়া, গাজীপুর'}</span>
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          {p.variants.map((v) => (
                            <div key={v.id} className="text-[11px] tabular-nums text-[#1F2937]">
                              {v.weightBn}: <strong>৳{toBengaliNumber(v.price)}</strong>
                              {v.originalPrice && (
                                <span className="line-through text-[#8C8070] ml-1.5 text-[10px]">
                                  ৳{toBengaliNumber(v.originalPrice)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold tabular-nums px-2.5 py-1 rounded text-[11px] ${
                            p.stock <= 5 ? 'bg-red-100 text-red-800' :
                            p.stock < 20 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {toBengaliNumber(p.stock)} টি
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="p-1.5 hover:bg-[#F0EBE0] text-[#14422D] rounded-lg transition-colors border border-transparent hover:border-[#D8D0C0]"
                            title="ছবি, মূল্য ও বিবরণ এডিট করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`আপনি কি "${p.nameBn}" পণ্যটি তালিকা থেকে মুছে ফেলতে চান?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDERS, COURIER & INVOICE MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E8E3D9]">
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C8070] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="অর্ডার আইডি, কাস্টমার নাম বা মোবাইল..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg text-xs focus:outline-none focus:border-[#14422D]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E8E3D9] text-xs">
                {(['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-[#14422D] text-white shadow-xs'
                        : 'text-[#6B5E4F] hover:bg-[#EAE4D7]'
                    }`}
                  >
                    {st === 'all' ? 'সব' :
                     st === 'pending' ? 'পেন্ডিং' :
                     st === 'confirmed' ? 'কনফার্মড' :
                     st === 'shipped' ? 'শিপড' :
                     st === 'delivered' ? 'ডেলিভার্ড' : 'বাতিল'}
                  </button>
                ))}
              </div>

              {/* Courier CSV Export Button */}
              <button
                onClick={handleExportOrdersToCSV}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Steadfast / Pathao কুরিয়ার বুকিংয়ের জন্য CSV ডাউনলোড"
              >
                <Download className="w-4 h-4" />
                <span>কুরিয়ার শিট (CSV)</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-[#E8E3D9] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2E2820]">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E3D9] text-[#6B5E4F] font-semibold">
                  <tr>
                    <th className="p-3.5">অর্ডার নং ও সময়</th>
                    <th className="p-3.5">গ্রাহক ও যোগাযোগ</th>
                    <th className="p-3.5">ঠিকানা</th>
                    <th className="p-3.5">পণ্য তালিকা</th>
                    <th className="p-3.5">বিল ও ডেলিভারি</th>
                    <th className="p-3.5">বর্তমান স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">অ্যাকশন ও ইনভয়েস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE0]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#7A6E5D]">
                        কোনো অর্ডার খুঁজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold text-[#14422D] block font-mono">#{order.id}</span>
                          <span className="text-[10px] text-[#8C8070]">{order.createdAt}</span>
                          {order.couponCode && (
                            <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              কুপন: {order.couponCode}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-[#1F2937] block">{order.customerName}</span>
                          <span className="font-mono text-[11px] text-[#5A5043]">{order.phone}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`tel:${order.phone.replace(/[^0-9]/g, '')}`}
                              className="text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold"
                              title="সরাসরি কল দিন"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>কল</span>
                            </a>
                            <a
                              href={getWhatsAppUrl(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1 font-bold"
                              title="হোয়াটসঅ্যাপে অর্ডার কনফার্ম বার্তা পাঠান"
                            >
                              <MessageCircle className="w-2.5 h-2.5 text-emerald-700" />
                              <span>হোয়াটসঅ্যাপ</span>
                            </a>
                          </div>
                        </td>
                        <td className="p-3.5 max-w-[180px]">
                          <p className="line-clamp-2 text-[#4A4237] leading-tight">{order.fullAddress}</p>
                          <p className="text-[10px] text-[#8C8070]">{order.upazila}, {order.district}</p>
                        </td>
                        <td className="p-3.5 max-w-[200px]">
                          <div className="space-y-0.5">
                            {order.items.map((it, i) => (
                              <p key={i} className="text-[11px] truncate text-[#2E2820]">
                                {it.productNameBn} ({it.variantWeightBn}) &times; {toBengaliNumber(it.quantity)}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-[#14422D] block tabular-nums text-sm">
                            ৳{toBengaliNumber(order.total)}
                          </span>
                          <span className="text-[10px] text-[#7A6E5D] block">
                            ডেলিভারি ফি: ৳{toBengaliNumber(order.deliveryFee)}
                          </span>
                          {order.discount > 0 && (
                            <span className="text-[10px] text-emerald-700 font-semibold block">
                              ছাড়: -৳{toBengaliNumber(order.discount)}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-bold rounded-lg px-2 py-1.5 border focus:outline-none ${
                              order.status === 'delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                              order.status === 'shipped' ? 'bg-blue-50 border-blue-300 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-50 border-red-300 text-red-800' :
                              'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="pending">পেন্ডিং (নতুন)</option>
                            <option value="confirmed">কনফার্মড</option>
                            <option value="processing">প্যাকিং হচ্ছে</option>
                            <option value="shipped">কুরিয়ারে শিপড</option>
                            <option value="delivered">ডেলিভার্ড সম্পন্ন</option>
                            <option value="cancelled">অর্ডার বাতিল</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="bg-[#14422D] hover:bg-[#0E3020] text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto shadow-xs"
                            title="কাস্টমার মেমো / ইনভয়েস প্রিন্ট করুন"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#C59B27]" />
                            <span>মেমো দেখুন</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CUSTOM DELIVERY SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'delivery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE0]">
              <div className="w-10 h-10 rounded-xl bg-[#14422D] text-[#C59B27] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#14422D]">ডেলিভারি চার্জ নির্ধারণ (নিজস্ব রেট)</h2>
                <p className="text-xs text-[#7A6E5D]">
                  আপনার এলাকার কুরিয়ার খরচ অনুযায়ী রেট পরিবর্তন করুন
                </p>
              </div>
            </div>

            {/* Quick 1-Click Rate Presets */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E3D9] space-y-2">
              <span className="text-[11px] font-bold text-[#14422D] block">
                ⚡ দ্রুত প্রিসেট থেকে নির্বাচন করুন:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyDeliveryPreset(70, 130, 2000, 'স্ট্যান্ডার্ড রেট (৭০৳/১৩০৳)')}
                  className="bg-white hover:bg-[#EBF4EF] border border-[#D8D0C0] p-2 rounded-lg text-left transition-colors"
                >
                  <p className="font-bold text-xs text-[#14422D]">স্ট্যান্ডার্ড রেট</p>
                  <p className="text-[10px] text-[#7A6E5D]">ঢাকা ও গাজীপুর ৭০৳ | বাইরে ১৩০৳</p>
                </button>

                <button
                  type="button"
                  onClick={() => applyDeliveryPreset(50, 120, 1500, 'সাশ্রয়ী অফার (৫০৳/১২০৳)')}
                  className="bg-white hover:bg-[#EBF4EF] border border-[#D8D0C0] p-2 rounded-lg text-left transition-colors"
                >
                  <p className="font-bold text-xs text-[#14422D]">সাশ্রয়ী অফার</p>
                  <p className="text-[10px] text-[#7A6E5D]">ঢাকা ও গাজীপুর ৫০৳ | বাইরে ১২০৳</p>
                </button>

                <button
                  type="button"
                  onClick={() => applyDeliveryPreset(60, 100, 1200, 'স্পেশাল রেট (৬০৳/১০০৳)')}
                  className="bg-white hover:bg-[#EBF4EF] border border-[#D8D0C0] p-2 rounded-lg text-left transition-colors"
                >
                  <p className="font-bold text-xs text-[#14422D]">স্পেশাল রেট</p>
                  <p className="text-[10px] text-[#7A6E5D]">ঢাকা ও গাজীপুর ৬০৳ | বাইরে ১০০৳</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveDeliverySettings} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-[#2E2820] mb-1.5">
                  ঢাকা, গাজীপুর ও নারায়ণগঞ্জ ডেলিভারি চার্জ (টাকায়) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6B5E4F] text-sm">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={insideDhakaFee}
                    onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-[#14422D] focus:outline-none focus:border-[#14422D]"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#7A6E5D] mt-1">
                  বীর উজলী বাজার, কাপাসিয়া ও গাজীপুর স্থানীয় ক্রেতারা এই রেটে হোম ডেলিভারি পাবেন।
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1.5">
                  ঢাকার বাইরে অন্যান্য সকল জেলায় ডেলিভারি চার্জ (টাকায়) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6B5E4F] text-sm">৳</span>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={outsideDhakaFee}
                    onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-[#14422D] focus:outline-none focus:border-[#14422D]"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EBE0] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#14422D]">ফ্রি ডেলিভারি অফার সুবিধা</h3>
                    <p className="text-[11px] text-[#7A6E5D]">
                      গ্রাহক নির্দিষ্ট টাকার বেশি কিনলে ডেলিভারি ফ্রি হবে
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableFreeDelivery}
                      onChange={(e) => setEnableFreeDelivery(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14422D]"></div>
                  </label>
                </div>

                {enableFreeDelivery && (
                  <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                    <label className="block font-bold text-[#2E2820] mb-1">
                      ন্যূনতম কত টাকার অর্ডারে ফ্রি ডেলিভারি কার্যকর হবে? (টাকায়)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6B5E4F] text-sm">৳</span>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={freeDeliveryThreshold}
                        onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                        className="w-full bg-white border border-[#E8E3D9] rounded-lg pl-8 pr-3 py-2 text-sm font-bold text-[#14422D] focus:outline-none focus:border-[#14422D]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#F0EBE0]">
                <label className="block font-bold text-[#2E2820] mb-1">
                  শপের ডেলিভারি স্পেশাল নোটিশ (গ্রাহক দেখতে পাবেন)
                </label>
                <input
                  type="text"
                  value={customNoticeBn}
                  onChange={(e) => setCustomNoticeBn(e.target.value)}
                  placeholder="যেমন: বীর উজলী, কাপাসিয়া ও গাজীপুর সদরে দ্রুততম হোম ডেলিভারি!"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl p-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#14422D]"
                />
              </div>

              {deliverySavedNotice && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>নতুন ডেলিভারি চার্জ রেট সফলভাবে সংরক্ষিত ও কার্যকর করা হয়েছে!</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F0EBE0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInsideDhakaFee(70);
                    setOutsideDhakaFee(130);
                    setEnableFreeDelivery(true);
                    setFreeDeliveryThreshold(2000);
                  }}
                  className="text-xs text-[#7A6E5D] hover:text-[#14422D] flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ডিফল্ট মানে রিসেট</span>
                </button>

                <button
                  type="submit"
                  className="bg-[#14422D] hover:bg-[#0E3020] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
                >
                  <Save className="w-4 h-4 text-[#C59B27]" />
                  <span>ডেলিভারি চার্জ সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preview Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3D9] p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#14422D]">
                <Sparkles className="w-4 h-4 text-[#C59B27]" />
                <span>গ্রাহকের চেকআউট লাইভ প্রিভিউ</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E8E3D9] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#14422D]">
                  <span>ঢাকা ও গাজীপুর:</span>
                  <span className="text-sm font-black tabular-nums">৳{toBengaliNumber(insideDhakaFee)}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-[#14422D]">
                  <span>ঢাকার বাইরে (অন্যান্য জেলা):</span>
                  <span className="text-sm font-black tabular-nums">৳{toBengaliNumber(outsideDhakaFee)}</span>
                </div>
                {enableFreeDelivery && (
                  <p className="text-[11px] text-emerald-700 font-bold pt-1 border-t border-[#F0EBE0]">
                    ✓ ৳{toBengaliNumber(freeDeliveryThreshold)}+ অর্ডারে ফ্রি ডেলিভারি সক্রিয়
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COUPONS & DISCOUNTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E8E3D9]">
            <div>
              <h2 className="text-base font-bold text-[#14422D]">প্রমোশনাল কুপন ও ভাউচার</h2>
              <p className="text-xs text-[#7A6E5D]">
                ক্রেতাদের জন্য স্পেশাল ডিসকাউন্ট কোড তৈরি ও নিয়ন্ত্রণ করুন
              </p>
            </div>
            
            <button
              onClick={() => setIsAddCouponModalOpen(true)}
              className="bg-[#14422D] hover:bg-[#0E3020] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#C59B27]" />
              <span>নতুন কুপন তৈরি করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div 
                key={c.id} 
                className={`p-5 rounded-2xl border transition-all ${
                  c.isActive 
                    ? 'bg-white border-[#E8E3D9] shadow-xs' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black px-2.5 py-1 bg-[#14422D] text-[#C59B27] rounded-lg tracking-wider">
                      {c.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {c.isActive ? 'সক্রিয়' : 'স্থগিত'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`আপনি কি "${c.code}" কুপনটি মুছে ফেলতে চান?`)) {
                        deleteCoupon(c.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-[#2E2820]">
                  <p className="font-bold text-sm text-[#14422D]">
                    {c.discountType === 'percent' ? `${toBengaliNumber(c.discountValue)}% ডিসকাউন্ট` : `৳${toBengaliNumber(c.discountValue)} নগদ ছাড়`}
                  </p>
                  <p className="text-[11px] text-[#7A6E5D]">{c.descriptionBn}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#6B5E4F] pt-2 border-t border-[#F0EBE0]">
                    <span>ন্যূনতম ক্রয়: <strong>৳{toBengaliNumber(c.minOrderAmount)}</strong></span>
                    <span>ব্যবহার হয়েছে: <strong>{toBengaliNumber(c.usageCount || 0)} বার</strong></span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#F0EBE0] flex items-center justify-between">
                  <span className="text-[11px] text-[#7A6E5D]">কুপন স্ট্যাটাস:</span>
                  <button
                    onClick={() => updateCoupon({ ...c, isActive: !c.isActive })}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                      c.isActive 
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                  >
                    {c.isActive ? 'স্থগিত করুন' : 'পুনরায় চালু করুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STORE PROFILE, PAYMENTS & ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE0]">
              <div className="w-10 h-10 rounded-xl bg-[#14422D] text-[#C59B27] flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#14422D]">দোকানের প্রোফাইল ও যোগাযোগের তথ্য</h2>
                <p className="text-xs text-[#7A6E5D]">
                  মোবাইল নম্বর, ঠিকানা, বিকাশ/নগদ মার্চেন্ট এবং ব্যানার নোটিশ নিয়ন্ত্রণ করুন
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
              
              {/* Store Open / Closed Switch */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#14422D]">দোকানে অর্ডার গ্রহণ স্ট্যাটাস</h3>
                  <p className="text-[11px] text-[#7A6E5D]">
                    দোকান বন্ধ রাখলে গ্রাহক কার্ট বা চেকআউট পেজে নোটিশ দেখতে পাবেন
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={storeForm.isStoreOpen}
                    onChange={(e) => setStoreForm({ ...storeForm, isStoreOpen: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#14422D]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">দোকানের নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={storeForm.shopNameBn}
                    onChange={(e) => setStoreForm({ ...storeForm, shopNameBn: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">দোকানের নাম (ইংরেজি)</label>
                  <input
                    type="text"
                    value={storeForm.shopNameEn}
                    onChange={(e) => setStoreForm({ ...storeForm, shopNameEn: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">প্রধান মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    value={storeForm.phonePrimary}
                    onChange={(e) => setStoreForm({ ...storeForm, phonePrimary: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">বিকল্প মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={storeForm.phoneSecondary}
                    onChange={(e) => setStoreForm({ ...storeForm, phoneSecondary: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">হোয়াটসঅ্যাপ নম্বর</label>
                  <input
                    type="text"
                    value={storeForm.whatsappNumber}
                    onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">অফিসিয়াল ইমেইল</label>
                  <input
                    type="email"
                    value={storeForm.email}
                    onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">ঠিকানা (বাংলা)</label>
                  <input
                    type="text"
                    value={storeForm.addressBn}
                    onChange={(e) => setStoreForm({ ...storeForm, addressBn: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                    required
                  />
                </div>
              </div>

              {/* Payment Accounts */}
              <div className="pt-3 border-t border-[#F0EBE0] space-y-3">
                <h3 className="font-bold text-sm text-[#14422D]">গ্রাহক পেমেন্ট গ্রহণ নম্বর (অনলাইন মোড)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#2E2820] mb-1">বিকাশ পার্সোনাল / মার্চেন্ট নম্বর</label>
                    <input
                      type="text"
                      value={storeForm.bkashNumber}
                      onChange={(e) => setStoreForm({ ...storeForm, bkashNumber: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#2E2820] mb-1">নগদ নম্বর</label>
                    <input
                      type="text"
                      value={storeForm.nagadNumber}
                      onChange={(e) => setStoreForm({ ...storeForm, nagadNumber: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Bar */}
              <div className="pt-3 border-t border-[#F0EBE0] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#2E2820]">ওয়েবসাইট টপ অ্যানাউন্সমেন্ট ব্যানার</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={storeForm.isAnnouncementActive}
                      onChange={(e) => setStoreForm({ ...storeForm, isAnnouncementActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#14422D]"></div>
                  </label>
                </div>
                <input
                  type="text"
                  value={storeForm.announcementNoticeBn}
                  onChange={(e) => setStoreForm({ ...storeForm, announcementNoticeBn: e.target.value })}
                  placeholder="যেমন: বীর উজলী, কাপাসিয়া ও গাজীপুর সদরে দ্রুততম হোম ডেলিভারি!"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                />
              </div>

              <div className="pt-4 border-t border-[#F0EBE0] flex justify-end">
                <button
                  type="submit"
                  className="bg-[#14422D] hover:bg-[#0E3020] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4 text-[#C59B27]" />
                  <span>দোকান সেটিংস সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Security & PIN Settings Box */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8E3D9] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBE0]">
              <Key className="w-5 h-5 text-[#C59B27]" />
              <h3 className="font-bold text-sm text-[#14422D]">অ্যাডমিন পিন কোড ও নিরাপত্তা</h3>
            </div>

            <p className="text-xs text-[#7A6E5D]">
              বর্তমান অ্যাডমিন পিন কোড দিয়ে ড্যাশবোর্ড সুরক্ষিত রাখা হয়েছে। প্রয়োজনে নতুন পিন সেট করতে পারেন:
            </p>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7A6E5D] block">বর্তমান পিন</span>
                <span className="font-mono text-base font-black tracking-widest text-[#14422D]">
                  {storeSettings.adminPin}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingPin(!isChangingPin)}
                className="text-xs font-bold text-[#14422D] hover:underline"
              >
                {isChangingPin ? 'বাতিল' : 'পিন পরিবর্তন'}
              </button>
            </div>

            {isChangingPin && (
              <form onSubmit={handleChangePin} className="space-y-2 pt-2 border-t border-[#F0EBE0]">
                <label className="block text-[11px] font-bold text-[#2E2820]">নতুন ৪ ডিজিটের পিন লিখুন:</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="যেমন: 5678"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2 font-mono text-sm tracking-widest text-center"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#14422D] hover:bg-[#0E3020] text-white py-2 rounded-lg text-xs font-bold transition-colors"
                >
                  নতুন পিন নিশ্চিত করুন
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-[#F0EBE0]">
              <button
                onClick={lockAdmin}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-red-200 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>এখনই ড্যাশবোর্ড লক করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SALES REPORT & ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3D9] shadow-xs">
            <h2 className="text-lg font-bold text-[#14422D] mb-1">বিক্রয় রিপোর্ট ও পারফরম্যান্স ওভারভিউ</h2>
            <p className="text-xs text-[#7A6E5D] mb-6">
              ভাওয়াল ফ্রেশ ফুডের সাম্প্রতিক অর্ডার, বিক্রয় এবং এলাকার পরিসংখ্যান
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                <span className="text-xs text-[#7A6E5D] block">মোট বিক্রয়</span>
                <span className="text-xl font-black text-[#14422D] tabular-nums mt-1 block">
                  ৳{toBengaliNumber(totalRevenue)}
                </span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                <span className="text-xs text-[#7A6E5D] block">গড় অর্ডার ভ্যালু (AOV)</span>
                <span className="text-xl font-black text-[#14422D] tabular-nums mt-1 block">
                  ৳{toBengaliNumber(averageOrderValue)}
                </span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                <span className="text-xs text-[#7A6E5D] block">ডেলিভারি সম্পন্ন</span>
                <span className="text-xl font-black text-emerald-800 tabular-nums mt-1 block">
                  {toBengaliNumber(deliveredOrdersCount)} টি
                </span>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                <span className="text-xs text-[#7A6E5D] block">পেন্ডিং যাচাই বাকি</span>
                <span className="text-xl font-black text-amber-700 tabular-nums mt-1 block">
                  {toBengaliNumber(pendingOrdersCount)} টি
                </span>
              </div>
            </div>
          </div>

          {/* Top Selling Products Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3D9] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#14422D] pb-2 border-b border-[#F0EBE0]">
                সর্বাধিক জনপ্রিয় খাদ্য পণ্য
              </h3>
              <div className="space-y-3">
                {products.slice(0, 5).map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E8E3D9] flex items-center justify-center font-bold text-[10px] text-[#14422D]">
                        {toBengaliNumber(idx + 1)}
                      </span>
                      <img src={p.image} alt={p.nameBn} className="w-9 h-9 object-cover rounded-lg border border-[#E8E3D9]" />
                      <span className="font-semibold text-[#1F2937]">{p.nameBn}</span>
                    </div>
                    <span className="font-mono text-[#7A6E5D]">
                      ৳{toBengaliNumber(p.variants[0]?.price || 0)}+
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E3D9] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#14422D] pb-2 border-b border-[#F0EBE0]">
                অঞ্চল ভিত্তিক অর্ডার বিতরণ
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                  <div>
                    <strong className="text-[#14422D] block">গাজীপুর ও ঢাকা অঞ্চল</strong>
                    <span className="text-[11px] text-[#7A6E5D]">বীর উজলী, কাপাসিয়া, গাজীপুর ও ঢাকা সিটি</span>
                  </div>
                  <span className="font-bold text-sm text-[#14422D]">
                    {toBengaliNumber(orders.filter(o => o.district.includes('ঢাকা') || o.district.includes('গাজীপুর')).length)} টি
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
                  <div>
                    <strong className="text-[#14422D] block">অন্যান্য জেলা (সারাদেশ)</strong>
                    <span className="text-[11px] text-[#7A6E5D]">চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা ইত্যাদি</span>
                  </div>
                  <span className="font-bold text-sm text-[#14422D]">
                    {toBengaliNumber(orders.filter(o => !o.district.includes('ঢাকা') && !o.district.includes('গাজীপুর')).length)} টি
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW PRODUCT WITH COMPRESSED PHOTO */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#E8E3D9] space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#14422D] text-[#C59B27] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#14422D]">ছবি সহ নতুন খাদ্য পণ্য যোগ করুন</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="text-[#8C8070] hover:text-[#1F2937] p-1 rounded-lg hover:bg-[#F5F1E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct} className="space-y-4 text-xs">
              
              {/* IMAGE SELECTION BOX */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E3D9] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#14422D] flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-[#C59B27]" />
                    <span>পণ্যের ছবি নির্বাচন বা আপলোড করুন *</span>
                  </label>
                  <span className="text-[10px] text-[#7A6E5D]">মোবাইল ক্যামেরা / গ্যালারি</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-lg border border-[#E8E3D9]">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`py-1.5 rounded-md text-center font-bold transition-colors ${
                      imageInputMode === 'upload' ? 'bg-[#14422D] text-white shadow-xs' : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
                    }`}
                  >
                    ফাইল আপলোড
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('preset')}
                    className={`py-1.5 rounded-md text-center font-bold transition-colors ${
                      imageInputMode === 'preset' ? 'bg-[#14422D] text-white shadow-xs' : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
                    }`}
                  >
                    রেডিমেড ছবি
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`py-1.5 rounded-md text-center font-bold transition-colors ${
                      imageInputMode === 'url' ? 'bg-[#14422D] text-white shadow-xs' : 'text-[#6B5E4F] hover:bg-[#F5F1E8]'
                    }`}
                  >
                    ইমেজ লিংক (URL)
                  </button>
                </div>

                {imageInputMode === 'upload' && (
                  <div>
                    <input
                      type="file"
                      ref={addFileInputRef}
                      onChange={(e) => handleFileUpload(e, false)}
                      accept="image/*"
                      className="hidden"
                    />
                    <div 
                      onClick={() => addFileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#C59B27]/60 hover:border-[#14422D] bg-white rounded-xl p-4 text-center cursor-pointer transition-colors group"
                    >
                      <Upload className="w-7 h-7 text-[#14422D] group-hover:scale-110 transition-transform mx-auto mb-1" />
                      <p className="font-bold text-[#14422D]">
                        {isUploadingImage ? 'ছবি অপ্টিমাইজ হচ্ছে...' : 'মোবাইল বা পিসি থেকে ছবি বাছুন'}
                      </p>
                      <p className="text-[10px] text-[#7A6E5D] mt-0.5">
                        সরাসরি ক্যামেরা দিয়ে তোলা ছবিও সিলেক্ট করতে পারেন
                      </p>
                    </div>
                  </div>
                )}

                {imageInputMode === 'preset' && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {PRESET_IMAGES.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setNewProdImage(item.img)}
                        className={`p-1.5 rounded-lg border text-center cursor-pointer transition-all ${
                          newProdImage === item.img ? 'border-[#14422D] ring-2 ring-[#14422D]/30 bg-emerald-50' : 'border-[#E8E3D9] bg-white hover:border-[#14422D]'
                        }`}
                      >
                        <img src={item.img} alt={item.label} className="w-full h-12 object-cover rounded" />
                        <span className="text-[10px] text-[#2E2820] mt-1 block font-bold truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {imageInputMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full bg-white border border-[#E8E3D9] rounded-lg p-2.5 text-xs font-mono"
                    />
                  </div>
                )}

                {newProdImage && (
                  <div className="flex items-center gap-3 pt-2 border-t border-[#E8E3D9] bg-white p-2.5 rounded-lg">
                    <img
                      src={newProdImage}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-[#E8E3D9] bg-[#F5F1E8] shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>পণ্যের ছবি যুক্ত হয়েছে</span>
                      </span>
                      <p className="text-[10px] text-[#7A6E5D]">এই ছবিটি শপ ক্যাটালগ ও কার্ডে দেখানো হবে</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addFileInputRef.current?.click()}
                      className="text-xs text-[#14422D] font-bold hover:underline"
                    >
                      পরিবর্তন
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">পণ্যের বাংলা নাম *</label>
                  <input
                    type="text"
                    value={newProdNameBn}
                    onChange={(e) => setNewProdNameBn(e.target.value)}
                    placeholder="যেমন: সুন্দরবনের খলিশা মধু"
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 focus:outline-none focus:border-[#14422D]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">ক্যাটাগরি *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 focus:outline-none focus:border-[#14422D]"
                  >
                    <option value="honey">প্রাকৃতিক মধু</option>
                    <option value="nuts">বাদাম সম্ভার</option>
                    <option value="dates">প্রিমিয়াম খেজুর</option>
                    <option value="raisins">কিশমিশ</option>
                    <option value="seeds">বীজ ও সুপারফুড</option>
                    <option value="oils">খাঁটি তেল</option>
                  </select>
                </div>
              </div>

              {/* VARIANTS BUILDER */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E3D9] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-[#14422D] block">
                      ওজন ভ্যারিয়েন্ট ও বিক্রয় মূল্য (BDT) *
                    </label>
                    <span className="text-[10px] text-[#7A6E5D]">
                      পণ্যটির যতগুলো ওজনের সাইজ ও দাম আছে তা এখানে সেট করুন
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="bg-white hover:bg-[#EBF4EF] text-[#14422D] border border-[#D8D0C0] px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ আরও সাইজ যোগ</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {newVariants.map((variant, idx) => (
                    <div key={variant.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E8E3D9]">
                      <div className="w-1/3">
                        <label className="text-[10px] text-[#7A6E5D] block mb-0.5">ওজন / প্যাক</label>
                        <input
                          type="text"
                          value={variant.weightBn}
                          onChange={(e) => handleUpdateVariantRow(idx, 'weightBn', e.target.value)}
                          placeholder="যেমন: ৫০০ গ্রাম"
                          className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded p-1.5 text-xs font-semibold"
                          required
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-[10px] text-[#7A6E5D] block mb-0.5">বিক্রয় মূল্য (৳)</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleUpdateVariantRow(idx, 'price', Number(e.target.value))}
                          placeholder="টাকা"
                          className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded p-1.5 text-xs font-bold font-mono text-[#14422D]"
                          required
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-[10px] text-[#7A6E5D] block mb-0.5">পূর্বের মূল্য (ঐচ্ছিক)</label>
                        <input
                          type="number"
                          value={variant.originalPrice || ''}
                          onChange={(e) => handleUpdateVariantRow(idx, 'originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="ডিসকাউন্ট দেখাতে"
                          className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded p-1.5 text-xs font-mono text-[#7A6E5D]"
                        />
                      </div>

                      {newVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="text-red-500 hover:text-red-700 p-1.5 mt-3.5"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">মজুদ সংখ্যা (Stock)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">সংগ্রহস্থল / অরিজিন</label>
                  <input
                    type="text"
                    value={newProdOrigin}
                    onChange={(e) => setNewProdOrigin(e.target.value)}
                    placeholder="বীর উজলী বাজার, কাপাসিয়া, গাজীপুর"
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1">পণ্যের বিবরণ / বিশেষত্ব</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="১০০% প্রাকৃতিক উপাদান, কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EBE0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F5F1E8] text-[#5A5043] rounded-xl font-semibold hover:bg-[#EAE4D7] transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#14422D] hover:bg-[#0E3020] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
                >
                  <Plus className="w-4 h-4 text-[#C59B27]" />
                  <span>পণ্য তালিকায় যুক্ত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT PRODUCT & PHOTO */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#E8E3D9] space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#14422D]" />
                <h3 className="font-bold text-base text-[#14422D]">পণ্য ও ছবি এডিট করুন</h3>
              </div>
              <button 
                onClick={() => setEditingProduct(null)} 
                className="text-[#8C8070] hover:text-[#1F2937] p-1 rounded-lg hover:bg-[#F5F1E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              
              {/* Product Image Changer */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E3D9] space-y-3">
                <label className="block font-bold text-[#14422D]">পণ্যের ছবি পরিবর্তন করুন</label>
                
                <div className="flex items-center gap-4">
                  <img
                    src={editingProduct.image}
                    alt="Current"
                    className="w-16 h-16 object-cover rounded-xl border border-[#E8E3D9] bg-white shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={(e) => handleFileUpload(e, true)}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="bg-white hover:bg-[#F0EBE0] text-[#14422D] border border-[#D8D0C0] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-[#C59B27]" />
                      <span>{isEditUploading ? 'আপলোড হচ্ছে...' : 'নতুন ছবি আপলোড / বাছুন'}</span>
                    </button>
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="অথবা সরাসরি ইমেজ লিংক (URL) দিন"
                      className="w-full bg-white border border-[#E8E3D9] rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1">পণ্যের বাংলা নাম</label>
                <input
                  type="text"
                  value={editingProduct.nameBn}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 focus:outline-none focus:border-[#14422D]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1">ভ্যারিয়েন্ট ওজন ও বিক্রয় মূল্য (BDT)</label>
                <div className="space-y-2">
                  {editingProduct.variants.map((v, i) => (
                    <div key={v.id} className="flex items-center gap-2 bg-[#FAF8F5] p-2 rounded-lg border border-[#E8E3D9]">
                      <input
                        type="text"
                        value={v.weightBn}
                        onChange={(e) => {
                          const updated = [...editingProduct.variants];
                          updated[i].weightBn = e.target.value;
                          setEditingProduct({ ...editingProduct, variants: updated });
                        }}
                        className="w-28 bg-white border border-[#E8E3D9] rounded p-1.5 font-semibold text-xs"
                      />
                      <span className="text-[#6B5E4F] font-bold">৳</span>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => {
                          const updated = [...editingProduct.variants];
                          updated[i].price = Number(e.target.value);
                          setEditingProduct({ ...editingProduct, variants: updated });
                        }}
                        className="flex-1 bg-white border border-[#E8E3D9] rounded p-1.5 font-mono font-bold text-xs text-[#14422D]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">মজুদ সংখ্যা (Stock)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">সংগ্রহস্থল / অরিজিন</label>
                  <input
                    type="text"
                    value={editingProduct.originBn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originBn: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EBE0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-[#F5F1E8] text-[#5A5043] rounded-xl font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#14422D] hover:bg-[#0E3020] text-white rounded-xl font-bold transition-colors"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW PROMO COUPON */}
      {/* ========================================================================= */}
      {isAddCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E3D9] space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C59B27]" />
                <h3 className="font-bold text-base text-[#14422D]">নতুন কুপন ভাউচার তৈরি</h3>
              </div>
              <button 
                onClick={() => setIsAddCouponModalOpen(false)} 
                className="text-[#8C8070] hover:text-[#1F2937] p-1 rounded-lg hover:bg-[#F5F1E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2E2820] mb-1">কুপন কোড (ইংরেজি বড় অক্ষরে) *</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="যেমন: BHAWAL50, EID100"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono font-bold uppercase focus:outline-none focus:border-[#14422D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">ডিসকাউন্ট টাইপ</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-semibold"
                  >
                    <option value="fixed">টাকায় ফিক্সড ছাড় (৳)</option>
                    <option value="percent">শতাংশ হারে ছাড় (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#2E2820] mb-1">ছাড়ের পরিমাণ *</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono font-bold text-[#14422D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1">ন্যূনতম অর্ডারের পরিমাণ (টাকায়) *</label>
                <input
                  type="number"
                  min="0"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  placeholder="যেমন: 500"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1">কুপনের বিবরণ (বাংলায়)</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="যেমন: প্রথম অর্ডারে ৳৫০ ডিসকাউন্ট"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EBE0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddCouponModalOpen(false)}
                  className="px-4 py-2 bg-[#F5F1E8] text-[#5A5043] rounded-xl font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14422D] hover:bg-[#0E3020] text-white rounded-xl font-bold shadow-xs"
                >
                  কুপন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CUSTOMER INVOICE / MEMO VIEW */}
      {/* ========================================================================= */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E3D9] space-y-6 my-8 print:shadow-none print:border-none print:p-0">
            
            {/* Action Bar (hidden when printing) */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0] print:hidden">
              <span className="text-xs font-bold text-[#14422D] flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-[#C59B27]" />
                <span>কাস্টমার ক্যাশ মেমো / ইনভয়েস প্রিভিউ</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#14422D] hover:bg-[#0E3020] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="text-[#8C8070] hover:text-[#1F2937] p-1.5 rounded-lg hover:bg-[#F5F1E8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Memo Content */}
            <div className="space-y-6 text-[#2E2820]">
              {/* Memo Header */}
              <div className="text-center pb-4 border-b-2 border-[#14422D]">
                <h2 className="text-2xl font-black text-[#14422D]">{storeSettings.shopNameBn}</h2>
                <p className="text-xs font-semibold text-[#7A6E5D] uppercase tracking-wider">{storeSettings.shopNameEn}</p>
                <p className="text-xs text-[#524436] mt-1">{storeSettings.addressBn}</p>
                <p className="text-xs font-mono text-[#524436]">
                  মোবাইল: {storeSettings.phonePrimary} | {storeSettings.phoneSecondary} | {storeSettings.email}
                </p>
              </div>

              {/* Order & Customer Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E3D9]">
                <div>
                  <p><strong>ইনভয়েস নং:</strong> <span className="font-mono font-bold text-[#14422D]">#{selectedInvoiceOrder.id}</span></p>
                  <p><strong>অর্ডারের তারিখ:</strong> {selectedInvoiceOrder.createdAt}</p>
                  <p><strong>পেমেন্ট মাধ্যম:</strong> {selectedInvoiceOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন পেমেন্ট'}</p>
                </div>
                <div>
                  <p><strong>গ্রাহকের নাম:</strong> {selectedInvoiceOrder.customerName}</p>
                  <p><strong>মোবাইল:</strong> <span className="font-mono">{selectedInvoiceOrder.phone}</span></p>
                  <p><strong>ঠিকানা:</strong> {selectedInvoiceOrder.fullAddress}, {selectedInvoiceOrder.upazila}, {selectedInvoiceOrder.district}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left border-collapse border border-[#E8E3D9]">
                <thead className="bg-[#FAF8F5] text-[#14422D] font-bold">
                  <tr>
                    <th className="border border-[#E8E3D9] p-2 text-center w-10">নং</th>
                    <th className="border border-[#E8E3D9] p-2">পণ্য বিবরণী</th>
                    <th className="border border-[#E8E3D9] p-2">ওজন</th>
                    <th className="border border-[#E8E3D9] p-2 text-center">পরিমাণ</th>
                    <th className="border border-[#E8E3D9] p-2 text-right">একক মূল্য</th>
                    <th className="border border-[#E8E3D9] p-2 text-right">মোট (৳)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx} className="divide-x divide-[#E8E3D9]">
                      <td className="border border-[#E8E3D9] p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-[#E8E3D9] p-2 font-semibold">{it.productNameBn}</td>
                      <td className="border border-[#E8E3D9] p-2">{it.variantWeightBn}</td>
                      <td className="border border-[#E8E3D9] p-2 text-center font-mono">{toBengaliNumber(it.quantity)}</td>
                      <td className="border border-[#E8E3D9] p-2 text-right font-mono">৳{toBengaliNumber(it.price)}</td>
                      <td className="border border-[#E8E3D9] p-2 text-right font-mono font-bold">৳{toBengaliNumber(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#7A6E5D]">
                    <span>উপমোট (Subtotal):</span>
                    <span className="font-mono font-bold text-[#1F2937]">৳{toBengaliNumber(selectedInvoiceOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#7A6E5D]">
                    <span>ডেলিভারি চার্জ:</span>
                    <span className="font-mono font-bold text-[#1F2937]">৳{toBengaliNumber(selectedInvoiceOrder.deliveryFee)}</span>
                  </div>
                  {selectedInvoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>কুপন ডিসকাউন্ট:</span>
                      <span className="font-mono">-৳{toBengaliNumber(selectedInvoiceOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t-2 border-[#14422D] text-sm font-black text-[#14422D]">
                    <span>সর্বমোট প্রদেয়:</span>
                    <span className="font-mono">৳{toBengaliNumber(selectedInvoiceOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Memo Footer */}
              <div className="pt-6 border-t border-[#E8E3D9] text-center text-[11px] text-[#7A6E5D]">
                <p className="font-bold text-[#14422D]">ভাওয়াল ফ্রেশ ফুডের সাথে থাকার জন্য ধন্যবাদ!</p>
                <p>পণ্য গ্রহণের সময় অবশ্যই যাচাই করে মূল্য পরিশোধ করুন। কোনো অভিযোগের জন্য সরাসরি কল করুন: {storeSettings.phonePrimary}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Integration Guide Modal */}
      <SupabaseGuideModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};
