export interface ProductVariant {
  id: string;
  weight: string;
  weightBn: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'honey' | 'nuts' | 'dates' | 'raisins' | 'seeds' | 'oils';
  categoryBn: string;
  shortDescBn: string;
  descriptionBn: string;
  benefitsBn: string[];
  image: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  stock: number;
  variants: ProductVariant[];
  originBn: string;
}

export interface CartItem {
  id: string; // product.id + '-' + variant.id
  productId: string;
  variantId: string;
  nameBn: string;
  weightBn: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export interface OrderItem {
  productId: string;
  productNameBn: string;
  variantWeightBn: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface TrackingStep {
  titleBn: string;
  descBn: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  district: string;
  upazila: string;
  fullAddress: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'unpaid' | 'verified' | 'pending_verification';
  status: OrderStatus;
  createdAt: string;
  trackingSteps: TrackingStep[];
}

export interface DistrictOption {
  nameBn: string;
  nameEn: string;
  deliveryFee: number; // 70 for Dhaka, 130 for outside Dhaka
  upazilas: string[];
}

export interface DeliverySettings {
  insideDhakaFee: number;
  outsideDhakaFee: number;
  enableFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  customNoticeBn?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  usageCount: number;
  descriptionBn: string;
}

export interface StoreSettings {
  shopNameBn: string;
  shopNameEn: string;
  taglineBn: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  addressBn: string;
  bkashNumber: string;
  nagadNumber: string;
  announcementNoticeBn: string;
  isAnnouncementActive: boolean;
  isStoreOpen: boolean;
  storeClosedNoticeBn: string;
  adminPin: string;
}


