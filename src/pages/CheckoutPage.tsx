import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BANGLADESH_DISTRICTS, toBengaliNumber } from '../data/mockData';
import { ShieldCheck, Truck, AlertCircle, ArrowRight, Lock, CheckCircle2, CreditCard, Banknote } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    createOrder, 
    navigate, 
    showToast, 
    calculateDeliveryFee, 
    deliverySettings,
    storeSettings,
    validateAndApplyCoupon,
    coupons
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState(BANGLADESH_DISTRICTS[0].nameBn);
  const [selectedUpazila, setSelectedUpazila] = useState(BANGLADESH_DISTRICTS[0].upazilas[0]);
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Coupon state on Checkout
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  const currentDistrict = BANGLADESH_DISTRICTS.find(d => d.nameBn === selectedDistrictName) || BANGLADESH_DISTRICTS[0];
  const deliveryFee = calculateDeliveryFee(selectedDistrictName, cartSubtotal);
  const isFreeDelivery = deliveryFee === 0;
  const grandTotal = Math.max(0, cartSubtotal - discount) + deliveryFee;

  const handleApplyCheckoutCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      showToast('কুপন কোড লিখুন');
      return;
    }
    const res = validateAndApplyCoupon(couponCode, cartSubtotal);
    if (res.valid) {
      setDiscount(res.discount);
      setAppliedCouponCode(res.coupon?.code || couponCode.toUpperCase());
      showToast(res.message);
    } else {
      setDiscount(0);
      setAppliedCouponCode(null);
      showToast(res.message);
    }
  };

  const handleDistrictChange = (distName: string) => {
    setSelectedDistrictName(distName);
    const dist = BANGLADESH_DISTRICTS.find(d => d.nameBn === distName);
    if (dist && dist.upazilas.length > 0) {
      setSelectedUpazila(dist.upazilas[0]);
    }
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!customerName.trim()) {
      errs.customerName = 'আপনার পূর্ণ নাম লিখুন';
    }

    // Bangladesh mobile number validation (starts with 01, exactly 11 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errs.phone = 'সঠিক মোবাইল নম্বর লিখুন';
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errs.phone = '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)';
    }

    if (!fullAddress.trim() || fullAddress.trim().length < 5) {
      errs.fullAddress = 'সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা নং, রোড, এলাকা)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('আপনার ব্যাগ খালি! আগে পণ্য যোগ করুন।');
      navigate('products');
      return;
    }

    if (!validateForm()) {
      showToast('অনুগ্রহ করে সঠিক তথ্য দিয়ে ফর্ম পূরণ করুন');
      return;
    }

    setIsSubmitting(true);

    // Realistic order processing delay
    setTimeout(() => {
      const orderItems = cart.map(item => ({
        productId: item.productId,
        productNameBn: item.nameBn,
        variantWeightBn: item.weightBn,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const newOrder = createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        district: currentDistrict.nameBn,
        upazila: selectedUpazila,
        fullAddress: fullAddress.trim(),
        deliveryNotes: deliveryNotes.trim(),
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee,
        discount,
        couponCode: appliedCouponCode || undefined,
        total: grandTotal,
        paymentMethod,
        paymentStatus: 'unpaid', // Notice: never claim paid without verified gateway confirmation!
      });

      setIsSubmitting(false);
      navigate('order-confirmation', { orderId: newOrder.id });
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#14422D] mb-2">আপনার ব্যাগ খালি</h2>
        <p className="text-xs text-[#7A6E5D] mb-6">চেকআউট করার জন্য আগে পণ্য ব্যাগে যুক্ত করুন।</p>
        <button
          onClick={() => navigate('products')}
          className="bg-[#14422D] text-white px-5 py-2.5 rounded-lg text-xs font-semibold"
        >
          পণ্য দেখুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#7A6E5D] mb-2">
          <button onClick={() => navigate('cart')} className="hover:text-[#14422D]">শপিং ব্যাগ</button>
          <span>/</span>
          <span className="text-[#14422D] font-medium">চেকআউট</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14422D]">
          অর্ডার সম্পন্ন করুন (Checkout)
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5043] mt-1">
          ক্যাশ অন ডেলিভারিতে নিশ্চিন্তে কেনাকাটা করুন — পণ্য হাতে পেয়ে টাকা পরিশোধ করবেন।
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customer & Address Information */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE0] text-[#14422D]">
            <Truck className="w-5 h-5 text-[#C59B27]" />
            <h2 className="text-lg font-bold">১. ডেলিভারির তথ্য ও ঠিকানা</h2>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-[#2E2820] mb-1.5">
              আপনার পূর্ণ নাম *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="যেমন: তানভীর হাসান"
              className={`w-full bg-[#FAF8F5] border rounded-lg px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9C9181] focus:outline-none focus:border-[#14422D] ${
                errors.customerName ? 'border-red-500' : 'border-[#E8E3D9]'
              }`}
            />
            {errors.customerName && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.customerName}</span>
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-bold text-[#2E2820] mb-1.5">
              বাংলাদেশি মোবাইল নম্বর * (ডেলিভারির সময় কল করা হবে)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="যেমন: 01712345678"
              className={`w-full bg-[#FAF8F5] border rounded-lg px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9C9181] focus:outline-none focus:border-[#14422D] font-mono ${
                errors.phone ? 'border-red-500' : 'border-[#E8E3D9]'
              }`}
            />
            {errors.phone ? (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            ) : (
              <p className="text-[11px] text-[#7A6E5D] mt-1">
                সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন যাতে ডেলিভারি রাইডার আপনার সাথে যোগাযোগ করতে পারেন।
              </p>
            )}
          </div>

          {/* District & Upazila Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2E2820] mb-1.5">
                জেলা নির্বাচন করুন *
              </label>
              <select
                value={selectedDistrictName}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#14422D]"
              >
                {BANGLADESH_DISTRICTS.map(d => {
                  const fee = calculateDeliveryFee(d.nameBn, cartSubtotal);
                  return (
                    <option key={d.nameEn} value={d.nameBn}>
                      {d.nameBn} — ডেলিভারি চার্জ {fee === 0 ? 'ফ্রি' : `৳${toBengaliNumber(fee)}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E2820] mb-1.5">
                উপজেলা / থানা / এলাকা *
              </label>
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg px-3 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#14422D]"
              >
                {currentDistrict.upazilas.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-bold text-[#2E2820] mb-1.5">
              পূর্ণ ঠিকানা (বাসা/ফ্ল্যাট নং, রোড, এলাকা/গ্রাম) *
            </label>
            <textarea
              rows={3}
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="যেমন: বাড়ি #১২, রোড #০৫, ব্লক-সি, সেক্টর-৩, উত্তরা, ঢাকা"
              className={`w-full bg-[#FAF8F5] border rounded-lg p-3 text-xs text-[#1F2937] placeholder-[#9C9181] focus:outline-none focus:border-[#14422D] ${
                errors.fullAddress ? 'border-red-500' : 'border-[#E8E3D9]'
              }`}
            />
            {errors.fullAddress && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.fullAddress}</span>
              </p>
            )}
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#6B5E4F] mb-1.5">
              ডেলিভারি নোট বা বিশেষ নির্দেশনা (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="যেমন: দুপুরের পর ডেলিভারি দিবেন বা গার্ডের কাছে রাখবেন"
              className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9C9181] focus:outline-none focus:border-[#14422D]"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-[#F0EBE0] space-y-3">
            <h3 className="text-sm font-bold text-[#14422D]">
              ২. মূল্য পরিশোধের মাধ্যম (Payment Method)
            </h3>

            {/* Cash on Delivery option */}
            <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'cod' ? 'border-[#14422D] bg-[#F4F9F6]' : 'border-[#E8E3D9] bg-white'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#14422D] focus:ring-[#14422D]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#14422D]" />
                    <span className="font-bold text-sm text-[#14422D]">
                      ক্যাশ অন ডেলিভারি (Cash on Delivery)
                    </span>
                    <span className="bg-[#EBF4EF] text-[#14422D] text-[10px] font-bold px-2 py-0.5 rounded">
                      জনপ্রিয় ও সবচেয়ে নিরাপদ
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5043] mt-1">
                    পণ্যটি হাতে পাওয়ার পর দেখে শুনে রাইডারের কাছে নগদ মূল্য পরিশোধ করুন।
                  </p>
                </div>
              </div>
            </label>

            {/* Online payment option with clear verification notice */}
            <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${
              paymentMethod === 'online' ? 'border-[#14422D] bg-[#F4F9F6]' : 'border-[#E8E3D9] bg-white'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 text-[#14422D] focus:ring-[#14422D]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#8C8070]" />
                    <span className="font-bold text-sm text-[#1F2937]">
                      অনলাইন পেমেন্ট (বিকাশ / নগদ / ডেবিট-ক্রেডিট কার্ড)
                    </span>
                    <span className="bg-[#F5F1E8] text-[#7A6E5D] text-[10px] font-medium px-2 py-0.5 rounded">
                      গেটওয়ে ইন্টিগ্রেশন মোড
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5043] mt-1">
                    * সিকিউর গেটওয়ে নির্দেশিকা: ভেরিফাইড মার্চেন্ট গেটওয়ে অনুমোদন ব্যতীত সরাসরি টাকা কাটা হবে না।
                  </p>
                  {paymentMethod === 'online' && (
                    <div className="mt-2.5 p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1">
                      <p className="font-bold text-[#14422D]">দোকানের অফিসিয়াল পেমেন্ট নাম্বার:</p>
                      <p className="text-[#2E2820]">বিকাশ: <strong className="font-mono text-[#14422D]">{storeSettings.bkashNumber}</strong></p>
                      <p className="text-[#2E2820]">নগদ: <strong className="font-mono text-[#14422D]">{storeSettings.nagadNumber}</strong></p>
                      <p className="text-[10px] text-[#7A6E5D] pt-1">
                        অর্ডার সাবমিটের পর আমাদের পক্ষ থেকে ফোন করে বিস্তারিত জানিয়ে দেওয়া হবে।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>

        </div>

        {/* Right: Order Summary & Confirmation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E3D9] p-6 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-[#14422D] pb-3 border-b border-[#F0EBE0]">
            আপনার অর্ডার বিবরণী
          </h2>

          {/* Itemized Mini List */}
          <div className="divide-y divide-[#F5F1E8] max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-cover rounded-md border border-[#E8E3D9] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1F2937] truncate leading-tight">
                      {item.nameBn}
                    </p>
                    <p className="text-[11px] text-[#7A6E5D]">
                      {item.weightBn} &times; {toBengaliNumber(item.quantity)} টি
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#14422D] tabular-nums shrink-0">
                  ৳{toBengaliNumber(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Checkout Coupon Code Input */}
          <div className="pt-3 border-t border-[#F0EBE0]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="কুপন কোড (যেমন: BHAWAL50)"
                className="flex-1 bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg px-2.5 py-1.5 text-xs uppercase focus:outline-none focus:border-[#14422D]"
              />
              <button
                type="button"
                onClick={handleApplyCheckoutCoupon}
                className="bg-[#14422D] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0E3020] transition-colors"
              >
                প্রয়োগ
              </button>
            </div>
            {appliedCouponCode && discount > 0 && (
              <p className="text-[11px] text-emerald-700 font-bold">
                ✓ "{appliedCouponCode}" কুপনে ৳{toBengaliNumber(discount)} ছাড় যুক্ত হয়েছে!
              </p>
            )}
          </div>

          {/* Clear Delivery Fee Separation */}
          <div className="space-y-2 pt-3 border-t border-[#F0EBE0] text-xs">
            <div className="flex items-center justify-between text-[#6B5E4F]">
              <span>পণ্যের মোট মূল্য (Subtotal):</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">৳{toBengaliNumber(cartSubtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span>কুপন ডিসকাউন্ট:</span>
                <span className="tabular-nums">-৳{toBengaliNumber(discount)}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-[#14422D] font-semibold bg-[#F5F9F6] p-2.5 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#14422D]" />
                <span>ডেলিভারি চার্জ ({currentDistrict.nameBn}):</span>
              </div>
              {isFreeDelivery ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                  ফ্রি ডেলিভারি (৳০)
                </span>
              ) : (
                <span className="tabular-nums font-bold">৳{toBengaliNumber(deliveryFee)}</span>
              )}
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-3 border-t border-[#E8E3D9] flex items-baseline justify-between">
            <div>
              <span className="text-sm font-bold text-[#14422D]">সর্বমোট প্রদেয় মূল্য:</span>
              <span className="text-[10px] text-[#7A6E5D] block">
                {paymentMethod === 'cod' ? '(ক্যাশ অন ডেলিভারিতে প্রদেয়)' : '(অনলাইন পেমেন্ট)'}
              </span>
            </div>
            <span className="text-2xl font-black text-[#14422D] tabular-nums">
              ৳{toBengaliNumber(grandTotal)}
            </span>
          </div>

          {!storeSettings.isStoreOpen && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold">
              ⚠️ {storeSettings.storeClosedNoticeBn || 'দোকানে নতুন অর্ডার গ্রহণ সাময়িক বন্ধ আছে।'}
            </div>
          )}

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isSubmitting || !storeSettings.isStoreOpen}
            className="w-full bg-[#14422D] hover:bg-[#0E3020] disabled:bg-[#8CA89C] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>অর্ডার প্রক্রিয়াকরণ হচ্ছে...</span>
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#C59B27]" />
                <span>অর্ডার নিশ্চিত করুন (৳{toBengaliNumber(grandTotal)})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-[#7A6E5D] text-center leading-relaxed">
            &quot;অর্ডার নিশ্চিত করুন&quot; বাটনে চাপ দিলে আমাদের প্রতিনিধি আপনার সাথে ফোন করে ঠিকানা ও ডেলিভারির সময় কনফার্ম করবেন।
          </p>
        </div>

      </form>
    </div>
  );
};
