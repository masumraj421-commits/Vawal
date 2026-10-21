import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { toBengaliNumber } from '../data/mockData';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    deliverySettings,
    validateAndApplyCoupon,
    coupons,
    navigate,
    showToast 
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showToast('কুপন কোড লিখুন');
      return;
    }
    const result = validateAndApplyCoupon(couponCode, cartSubtotal);
    if (result.valid) {
      setDiscount(result.discount);
      setAppliedCouponName(result.coupon?.code || couponCode.toUpperCase());
      showToast(result.message);
    } else {
      setDiscount(0);
      setAppliedCouponName(null);
      showToast(result.message);
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - discount);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-white border border-[#E8E3D9] flex items-center justify-center mx-auto text-[#8C8070] mb-4 shadow-xs">
          <ShoppingBag className="w-10 h-10 text-[#14422D]" />
        </div>
        <h1 className="text-2xl font-bold text-[#14422D] mb-2">আপনার শপিং ব্যাগ সম্পূর্ণ খালি</h1>
        <p className="text-sm text-[#7A6E5D] max-w-md mx-auto mb-6">
          আপনার প্রয়োজনীয় খাঁটি মধু, রোস্টেড কাজুবাদাম, কাঠবাদাম কিংবা মদিনার খেজুর ব্যাগে যোগ করুন।
        </p>
        <button
          onClick={() => navigate('products')}
          className="bg-[#14422D] hover:bg-[#0E3020] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          কেনাকাটা শুরু করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D9] mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14422D]">
            শপিং ব্যাগ
          </h1>
          <p className="text-xs text-[#7A6E5D] mt-1">
            মোট {toBengaliNumber(cart.length)} টি আইটেম ব্যাগে রয়েছে
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>ব্যাগ খালি করুন</span>
        </button>
      </div>

      {/* Cart Layout: Left Table/List, Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E3D9] p-4 sm:p-6 shadow-xs divide-y divide-[#F0EBE0]">
          {cart.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.image}
                  alt={item.nameBn}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E8E3D9] shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#1F2937] leading-snug">
                    {item.nameBn}
                  </h3>
                  <p className="text-xs text-[#7A6E5D] mt-0.5">
                    প্যাকেজ: <span className="font-semibold text-[#14422D]">{item.weightBn}</span>
                  </p>
                  <p className="text-xs text-[#8C8070] mt-0.5 tabular-nums">
                    একক মূল্য: ৳{toBengaliNumber(item.price)}
                  </p>
                </div>
              </div>

              {/* Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#F5F1E8]">
                {/* Stepper */}
                <div className="flex items-center bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-1">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-white text-[#5A5043] rounded"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#14422D] tabular-nums">
                    {toBengaliNumber(item.quantity)}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-white text-[#5A5043] rounded"
                    aria-label="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <span className="text-base font-bold text-[#14422D] tabular-nums">
                    ৳{toBengaliNumber(item.price * item.quantity)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-[#9C9181] hover:text-red-600 p-1"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right: Order Summary Box */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8E3D9] p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-[#14422D] pb-3 border-b border-[#F0EBE0]">
            অর্ডার সামারি
          </h2>

          {/* Coupon Code Section */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-semibold text-[#6B5E4F] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>ডিসকাউন্ট কুপন কোড:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="যেমন: BHAWAL50"
                className="flex-1 bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#14422D]"
              />
              <button
                type="submit"
                className="bg-[#14422D] hover:bg-[#0E3020] text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                প্রয়োগ
              </button>
            </div>
            {appliedCouponName && discount > 0 && (
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span>✓ "{appliedCouponName}" কুপন প্রয়োগ হয়েছে (-৳{toBengaliNumber(discount)})</span>
              </p>
            )}

            {/* Available coupons hint */}
            {coupons.filter(c => c.isActive).length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="text-[#7A6E5D]">উপলব্ধ কুপন:</span>
                {coupons.filter(c => c.isActive).map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCouponCode(c.code);
                      const res = validateAndApplyCoupon(c.code, cartSubtotal);
                      if (res.valid) {
                        setDiscount(res.discount);
                        setAppliedCouponName(c.code);
                        showToast(res.message);
                      } else {
                        showToast(res.message);
                      }
                    }}
                    className="bg-[#FAF8F5] hover:bg-[#EBF4EF] border border-[#D8D0C0] text-[#14422D] font-mono font-bold px-1.5 py-0.5 rounded text-[10px] transition-colors"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Price Breakdown */}
          <div className="space-y-2.5 pt-3 border-t border-[#F0EBE0] text-xs">
            <div className="flex items-center justify-between text-[#6B5E4F]">
              <span>পণ্যের মোট মূল্য:</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">৳{toBengaliNumber(cartSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>কুপন ডিসকাউন্ট:</span>
                <span className="tabular-nums">-৳{toBengaliNumber(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[#6B5E4F]">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-semibold text-[#14422D]">
                ঢাকা/গাজীপুর: ৳{toBengaliNumber(deliverySettings.insideDhakaFee)} | অন্যান্য: ৳{toBengaliNumber(deliverySettings.outsideDhakaFee)}
              </span>
            </div>
            {deliverySettings.enableFreeDelivery && (
              <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E3D9] text-[11px]">
                {cartSubtotal >= deliverySettings.freeDeliveryThreshold ? (
                  <span className="text-emerald-700 font-bold block">
                    🎉 আপনার অর্ডার ফ্রি ডেলিভারির জন্য যোগ্য!
                  </span>
                ) : (
                  <span className="text-[#7A6E5D] block">
                    আর মাত্র <strong className="text-[#14422D]">৳{toBengaliNumber(deliverySettings.freeDeliveryThreshold - cartSubtotal)}</strong> টাকার পণ্য কিনলে ফ্রি ডেলিভারি!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Final Row */}
          <div className="pt-3 border-t border-[#E8E3D9] flex items-baseline justify-between">
            <span className="text-sm font-bold text-[#14422D]">সর্বমোট (ডেলিভারি ছাড়া):</span>
            <span className="text-2xl font-black text-[#14422D] tabular-nums">
              ৳{toBengaliNumber(finalTotal)}
            </span>
          </div>

          {/* Action */}
          <button
            onClick={() => navigate('checkout')}
            className="w-full bg-[#14422D] hover:bg-[#0E3020] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>চেকআউট পেজে যান</span>
            <ArrowRight className="w-4 h-4 text-[#C59B27]" />
          </button>

          <button
            onClick={() => navigate('products')}
            className="w-full text-center text-xs font-semibold text-[#14422D] hover:underline"
          >
            &larr; আরও কেনাকাটা করুন
          </button>

          {/* Trust notes */}
          <div className="pt-4 border-t border-[#F0EBE0] flex items-center gap-2 text-[11px] text-[#7A6E5D]">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>ক্যাশ অন ডেলিভারিতে পণ্য যাচাই করে মূল্য পরিশোধ করতে পারবেন।</span>
          </div>
        </div>

      </div>
    </div>
  );
};
