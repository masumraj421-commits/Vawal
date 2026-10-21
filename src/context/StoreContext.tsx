import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, OrderStatus, DeliverySettings, Coupon, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, CATEGORIES } from '../data/mockData';
import { 
  getSupabaseCredentials, 
  fetchProductsFromSupabase, 
  fetchCategoriesFromSupabase,
  insertProductToSupabase,
  updateProductInSupabase
} from '../lib/supabase';

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  insideDhakaFee: 70,
  outsideDhakaFee: 130,
  enableFreeDelivery: true,
  freeDeliveryThreshold: 2000,
  customNoticeBn: 'বীর উজলী, কাপাসিয়া ও গাজীপুর সদরে দ্রুততম হোম ডেলিভারি!'
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  shopNameBn: 'ভাওয়াল ফ্রেশ ফুড',
  shopNameEn: 'Bhawal Fresh Food',
  taglineBn: 'খাঁটি খাদ্য সম্ভার · কাপাসিয়া, গাজীপুর',
  phonePrimary: '01742578679',
  phoneSecondary: '01302257761',
  whatsappNumber: '01742578679',
  email: 'Masumraj421@gmail.com',
  addressBn: 'বীর উজলী বাজার, কাপাসিয়া, গাজীপুর-১৭৩০, বাংলাদেশ',
  bkashNumber: '01742578679 (পার্সোনাল / মার্চেন্ট)',
  nagadNumber: '01302257761 (পার্সোনাল)',
  announcementNoticeBn: 'বীর উজলী, কাপাসিয়া ও গাজীপুর সদরে দ্রুততম হোম ডেলিভারি!',
  isAnnouncementActive: true,
  isStoreOpen: true,
  storeClosedNoticeBn: 'বর্তমানে সাময়িক বিরতি চলছে। খুব শীঘ্রই আমরা পুনরায় অর্ডার নেয়া শুরু করব। তথ্যের জন্য কল করুন: ০১৭৪২৫৭৮৬৭৯',
  adminPin: '1234'
};

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'BHAWAL50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 500,
    isActive: true,
    usageCount: 14,
    descriptionBn: 'প্রথম অর্ডারে ৳৫০ ডিসকাউন্ট (ন্যূনতম ৳৫০০ অর্ডারে)'
  },
  {
    id: 'c2',
    code: 'EID100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 1000,
    isActive: true,
    usageCount: 8,
    descriptionBn: 'স্পেশাল ৳১০০ ডিসকাউন্ট ভাউচার (ন্যূনতম ৳১০০০ অর্ডারে)'
  },
  {
    id: 'c3',
    code: 'FRESH10',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 1500,
    isActive: true,
    usageCount: 5,
    descriptionBn: '১০% মেগা ডিসকাউন্ট (ন্যূনতম ৳১৫০০ অর্ডারে)'
  }
];


export type PageName = 
  | 'home' 
  | 'products' 
  | 'category' 
  | 'product-details' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation' 
  | 'tracking' 
  | 'about' 
  | 'contact' 
  | 'privacy' 
  | 'refund' 
  | 'admin';

export interface CategoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  count?: number;
}

interface StoreContextType {
  products: Product[];
  categories: CategoryItem[];
  orders: Order[];
  cart: CartItem[];
  activePage: PageName;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  lastConfirmedOrder: Order | null;
  searchQuery: string;
  trackingQuery: string;
  isCartDrawerOpen: boolean;
  toast: string | null;

  // Delivery Settings
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (settings: DeliverySettings) => void;
  calculateDeliveryFee: (districtName: string, subtotal: number) => number;

  // Supabase states
  isSupabaseConnected: boolean;
  isLoadingProducts: boolean;
  supabaseError: string | null;
  reloadFromSupabase: () => Promise<void>;
  
  // Actions
  navigate: (page: PageName, params?: { productId?: string; categoryId?: string; orderId?: string }) => void;
  setSearchQuery: (query: string) => void;
  setTrackingQuery: (query: string) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingSteps'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  updateProduct: (product: Product) => void;
  addNewProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  showToast: (message: string) => void;

  // Store Settings (contact, numbers, notices)
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: StoreSettings) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  validateAndApplyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string; coupon?: Coupon };

  // Admin PIN Protection
  isAdminUnlocked: boolean;
  verifyAdminPin: (pin: string) => boolean;
  lockAdmin: () => void;
  updateAdminPin: (newPin: string) => void;

  // Computed
  cartSubtotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if Supabase credentials exist
  const creds = getSupabaseCredentials();
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(creds.isConfigured);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Categories list
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);

  // Load products: either from Supabase (if configured) or localStorage / fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bhawal_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bhawal_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhawal_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Navigation state
  const [activePage, setActivePage] = useState<PageName>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Delivery settings state (shop owner customizable)
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(() => {
    try {
      const saved = localStorage.getItem('bhawal_delivery_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_DELIVERY_SETTINGS;
  });

  const updateDeliverySettings = (newSettings: DeliverySettings) => {
    setDeliverySettings(newSettings);
    try {
      localStorage.setItem('bhawal_delivery_settings', JSON.stringify(newSettings));
    } catch {}
    showToast('ডেলিভারি চার্জের নতুন রেট সফলভাবে সংরক্ষিত হয়েছে');
  };

  // Store Profile & Payment Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('bhawal_store_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STORE_SETTINGS;
  });

  const updateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    try {
      localStorage.setItem('bhawal_store_settings', JSON.stringify(newSettings));
    } catch {}
    showToast('দোকানের সেটিংস ও যোগাযোগের তথ্য সংরক্ষিত হয়েছে');
  };

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('bhawal_coupons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_COUPONS;
  });

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => {
      const updated = [coupon, ...prev];
      try {
        localStorage.setItem('bhawal_coupons', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`"${coupon.code}" কুপনটি সফলভাবে তৈরি হয়েছে`);
  };

  const updateCoupon = (updatedCoupon: Coupon) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.id === updatedCoupon.id ? updatedCoupon : c);
      try {
        localStorage.setItem('bhawal_coupons', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`"${updatedCoupon.code}" কুপন আপডেট হয়েছে`);
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.id !== couponId);
      try {
        localStorage.setItem('bhawal_coupons', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('কুপনটি মুছে ফেলা হয়েছে');
  };

  const validateAndApplyCoupon = (code: string, subtotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const matched = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!matched) {
      return { valid: false, discount: 0, message: 'কুপন কোডটি সঠিক নয়! অনুগ্রহ করে সঠিক কোড দিন।' };
    }
    if (!matched.isActive) {
      return { valid: false, discount: 0, message: 'দুঃখিত, এই কুপনটি বর্তমানে স্থগিত বা মেয়াদোত্তীর্ণ।' };
    }
    if (subtotal < matched.minOrderAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `এই কুপন ব্যবহার করতে ন্যূনতম ৳${matched.minOrderAmount} টাকার পণ্য কিনতে হবে।` 
      };
    }

    let calculatedDiscount = 0;
    if (matched.discountType === 'percent') {
      calculatedDiscount = Math.round((subtotal * matched.discountValue) / 100);
    } else {
      calculatedDiscount = matched.discountValue;
    }
    calculatedDiscount = Math.min(calculatedDiscount, subtotal);

    return {
      valid: true,
      discount: calculatedDiscount,
      message: `অভিনন্দন! "${matched.code}" কুপনে ৳${calculatedDiscount} ডিসকাউন্ট প্রয়োগ হয়েছে।`,
      coupon: matched
    };
  };

  // Admin PIN Protection (Default PIN: 1234)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bhawal_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const verifyAdminPin = (enteredPin: string): boolean => {
    const isCorrect = enteredPin.trim() === storeSettings.adminPin;
    if (isCorrect) {
      setIsAdminUnlocked(true);
      try {
        sessionStorage.setItem('bhawal_admin_unlocked', 'true');
      } catch {}
      showToast('অ্যাডমিন ড্যাশবোর্ডে প্রবেশ সফল হয়েছে');
      return true;
    } else {
      showToast('ভুল অ্যাডমিন পিন কোড! অনুগ্রহ করে আবার চেষ্টা করুন।');
      return false;
    }
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('bhawal_admin_unlocked');
    } catch {}
    showToast('অ্যাডমিন ড্যাশবোর্ড লক করা হয়েছে');
  };

  const updateAdminPin = (newPin: string) => {
    if (newPin.length < 4) {
      showToast('পিন কোড কমপক্ষে ৪ ডিজিটের হতে হবে');
      return;
    }
    const updated = { ...storeSettings, adminPin: newPin };
    updateStoreSettings(updated);
    showToast('নতুন অ্যাডমিন পিন সফলভাবে সংরক্ষিত হয়েছে');
  };

  const calculateDeliveryFee = useCallback((districtName: string, subtotal: number): number => {
    if (deliverySettings.enableFreeDelivery && subtotal >= deliverySettings.freeDeliveryThreshold) {
      return 0;
    }
    const isInside = districtName.includes('ঢাকা') || 
                     districtName.includes('গাজীপুর') || 
                     districtName.includes('নারায়ণগঞ্জ') || 
                     districtName.toLowerCase().includes('dhaka') ||
                     districtName.toLowerCase().includes('gazipur') ||
                     districtName.toLowerCase().includes('narayanganj');

    return isInside ? deliverySettings.insideDhakaFee : deliverySettings.outsideDhakaFee;
  }, [deliverySettings]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // Function to reload products and categories directly from Supabase
  const reloadFromSupabase = useCallback(async () => {
    const currentCreds = getSupabaseCredentials();
    if (!currentCreds.isConfigured) {
      setIsSupabaseConnected(false);
      return;
    }

    setIsLoadingProducts(true);
    setSupabaseError(null);

    try {
      // 1. Fetch categories
      const { categories: fetchedCategories, error: catError } = await fetchCategoriesFromSupabase();
      if (!catError && fetchedCategories.length > 0) {
        setCategories([
          { id: 'all', nameBn: 'সকল পণ্য', nameEn: 'All Products' },
          ...fetchedCategories
        ]);
      }

      // 2. Fetch products & variants
      const { products: fetchedProducts, error: prodError } = await fetchProductsFromSupabase();

      if (prodError) {
        setSupabaseError(prodError);
        setIsSupabaseConnected(false);
      } else {
        setIsSupabaseConnected(true);
        if (fetchedProducts.length > 0) {
          // Replace demo data with real Supabase products
          setProducts(fetchedProducts);
          try {
            localStorage.setItem('bhawal_products', JSON.stringify(fetchedProducts));
          } catch {}
          showToast(`সুপাবেজ থেকে ${fetchedProducts.length}টি লাইভ পণ্য লোড হয়েছে`);
        } else {
          // Connected, but table currently has 0 rows
          setSupabaseError('সুপাবেজ টেবিলে কোনো সক্রিয় পণ্য পাওয়া যায়নি। অনুগ্রহ করে products টেবিলে রো যুক্ত করুন।');
        }
      }
    } catch (err: any) {
      setSupabaseError(err?.message || 'সুপাবেজ থেকে তথ্য লোড করতে সমস্যা হয়েছে');
      setIsSupabaseConnected(false);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch on mount if configured
  useEffect(() => {
    const currentCreds = getSupabaseCredentials();
    if (currentCreds.isConfigured) {
      reloadFromSupabase();
    }
  }, [reloadFromSupabase]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bhawal_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bhawal_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const navigate = (page: PageName, params?: { productId?: string; categoryId?: string; orderId?: string }) => {
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.categoryId) setSelectedCategoryId(params.categoryId);
    if (params?.orderId) {
      setTrackingQuery(params.orderId);
      const matched = orders.find(o => o.id === params.orderId);
      if (matched) setLastConfirmedOrder(matched);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, variantId?: string, quantity: number = 1) => {
    const selectedVariant = variantId 
      ? product.variants.find(v => v.id === variantId) || product.variants[0]
      : product.variants[0];

    const cartItemId = `${product.id}-${selectedVariant.id}`;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === cartItemId);
      if (existing) {
        return prevCart.map(item => 
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            variantId: selectedVariant.id,
            nameBn: product.nameBn,
            weightBn: selectedVariant.weightBn,
            price: selectedVariant.price,
            originalPrice: selectedVariant.originalPrice,
            quantity,
            image: product.image,
          }
        ];
      }
    });

    showToast(`"${product.nameBn} (${selectedVariant.weightBn})" ব্যাগে যোগ করা হয়েছে`);
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('পণ্যটি ব্যাগ থেকে সরানো হয়েছে');
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingSteps'>): Order => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `BFF-${randomDigits}`;
    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'pending',
      createdAt: dateFormatted,
      trackingSteps: [
        {
          titleBn: 'অর্ডার জমা হয়েছে',
          descBn: 'আপনার অর্ডারটি সিস্টেম গ্রহণ করেছে। আমাদের টিম শীঘ্রই যোগাযোগ করবে।',
          timestamp: 'এইমাত্র',
          completed: true,
          current: true
        },
        {
          titleBn: 'যাচাই ও কনফার্মেশন',
          descBn: 'ফোন কলের মাধ্যমে অর্ডার কনফার্ম করে প্যাকেজিং শুরু হবে।',
          timestamp: 'অপেক্ষমাণ',
          completed: false,
          current: false
        },
        {
          titleBn: 'কুরিয়ারে হস্তান্তর',
          descBn: 'ডেলিভারি পার্টনারের নিকট পার্সেল পৌঁছানো হবে।',
          timestamp: 'অপেক্ষমাণ',
          completed: false,
          current: false
        },
        {
          titleBn: 'ডেলিভারি সম্পন্ন',
          descBn: 'পণ্য বুঝে নিয়ে ক্যাশ পরিশোধ করবেন।',
          timestamp: 'অপেক্ষমাণ',
          completed: false,
          current: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);

    // If coupon was used, increment usage count
    if (orderData.couponCode) {
      setCoupons(prev => prev.map(c => 
        c.code.toUpperCase() === orderData.couponCode?.toUpperCase()
          ? { ...c, usageCount: (c.usageCount || 0) + 1 }
          : c
      ));
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedSteps = [...order.trackingSteps];
      if (newStatus === 'confirmed' || newStatus === 'processing') {
        updatedSteps[0].completed = true; updatedSteps[0].current = false;
        updatedSteps[1].completed = true; updatedSteps[1].current = true;
      } else if (newStatus === 'shipped') {
        updatedSteps[0].completed = true; updatedSteps[0].current = false;
        updatedSteps[1].completed = true; updatedSteps[1].current = false;
        updatedSteps[2].completed = true; updatedSteps[2].current = true;
      } else if (newStatus === 'delivered') {
        updatedSteps.forEach(s => { s.completed = true; s.current = false; });
        if (updatedSteps[3]) {
          updatedSteps[3].completed = true;
          updatedSteps[3].current = true;
        }
      }

      return {
        ...order,
        status: newStatus,
        paymentStatus: newStatus === 'delivered' ? 'verified' : order.paymentStatus,
        trackingSteps: updatedSteps
      };
    }));

    showToast(`অর্ডার #${orderId} এর স্ট্যাটাস আপডেট হয়েছে: ${newStatus}`);
  };

  const updateProduct = async (updatedProduct: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      try {
        localStorage.setItem('bhawal_products', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });

    const creds = getSupabaseCredentials();
    if (creds.isConfigured) {
      try {
        await updateProductInSupabase(updatedProduct);
      } catch (e) {
        console.warn('Supabase product update error:', e);
      }
    }

    showToast('পণ্য ও ছবি সফলভাবে আপডেট হয়েছে');
  };

  const addNewProduct = async (product: Product) => {
    setProducts(prev => {
      const updated = [product, ...prev];
      try {
        localStorage.setItem('bhawal_products', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });

    const creds = getSupabaseCredentials();
    if (creds.isConfigured) {
      try {
        const { success, error } = await insertProductToSupabase(product);
        if (success) {
          showToast(`"${product.nameBn}" পণ্য ও ছবি সুপাবেজ ডাটাবেজে যুক্ত হয়েছে`);
          return;
        } else if (error) {
          console.warn('Supabase insert note:', error);
        }
      } catch (err: any) {
        console.warn('Supabase sync error:', err);
      }
    }

    showToast(`"${product.nameBn}" নতুন পণ্যটি ছবি সহ সফলভাবে যুক্ত হয়েছে`);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      try {
        localStorage.setItem('bhawal_products', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('পণ্যটি তালিকা থেকে মুছে ফেলা হয়েছে');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        activePage,
        selectedProductId,
        selectedCategoryId,
        lastConfirmedOrder,
        searchQuery,
        trackingQuery,
        isCartDrawerOpen,
        toast,
        deliverySettings,
        updateDeliverySettings,
        calculateDeliveryFee,
        storeSettings,
        updateStoreSettings,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateAndApplyCoupon,
        isAdminUnlocked,
        verifyAdminPin,
        lockAdmin,
        updateAdminPin,
        isSupabaseConnected,
        isLoadingProducts,
        supabaseError,
        reloadFromSupabase,
        navigate,
        setSearchQuery,
        setTrackingQuery,
        setIsCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
        updateProduct,
        addNewProduct,
        deleteProduct,
        showToast,
        cartSubtotal,
        cartCount
      }}
    >
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
