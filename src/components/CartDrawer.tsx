import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toBengaliNumber } from '../data/mockData';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    deliverySettings,
    navigate 
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('checkout');
  };

  const handleFullCartClick = () => {
    setIsCartDrawerOpen(false);
    navigate('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer content */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E8E3D9]">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8E3D9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#14422D]" />
              <h2 className="text-lg font-bold text-[#14422D]">আপনার শপিং ব্যাগ</h2>
              <span className="text-xs bg-[#EBF4EF] text-[#14422D] font-semibold px-2 py-0.5 rounded-full tabular-nums">
                {toBengaliNumber(cartCount)} টি পণ্য
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 hover:bg-[#F2EDE2] rounded-lg text-[#6B5E4F] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7A6E5D]">
                <div className="w-16 h-16 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[#9C9181] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-[#2E2820] mb-1">আপনার ব্যাগ বর্তমানে খালি</h3>
                <p className="text-xs text-[#7A6E5D] max-w-xs mb-6">
                  সুন্দরবনের খাঁটি মধু বা প্রিমিয়াম বাদামের সম্ভার থেকে আপনার পছন্দের পণ্যটি যুক্ত করুন।
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('products');
                  }}
                  className="bg-[#14422D] hover:bg-[#0E3020] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  পণ্যসমূহ দেখুন
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-3.5 rounded-xl border border-[#E8E3D9] flex items-center gap-3.5 shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.nameBn}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded-lg border border-[#E8E3D9] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#1F2937] leading-snug truncate">
                      {item.nameBn}
                    </h4>
                    <p className="text-xs text-[#7A6E5D] mt-0.5">
                      পরিমাণ: <span className="font-medium text-[#2E2820]">{item.weightBn}</span>
                    </p>
                    <p className="text-sm font-bold text-[#14422D] mt-1 tabular-nums">
                      ৳{toBengaliNumber(item.price)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end justify-between self-stretch">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#9C9181] hover:text-red-600 p-1 transition-colors"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2 bg-[#F5F1E8] rounded-md px-1.5 py-0.5 border border-[#E8E3D9]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="text-[#5A5043] hover:text-[#14422D] p-0.5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold text-[#14422D] w-4 text-center tabular-nums">
                        {toBengaliNumber(item.quantity)}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="text-[#5A5043] hover:text-[#14422D] p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Subtotal & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8E3D9] bg-white space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B5E4F]">মোট পণ্যের মূল্য (Subtotal):</span>
                <span className="text-lg font-bold text-[#14422D] tabular-nums">
                  ৳{toBengaliNumber(cartSubtotal)}
                </span>
              </div>
              <p className="text-[11px] text-[#8C8070] text-center">
                * ডেলিভারি চার্জ: ঢাকা ও গাজীপুরে ৳{toBengaliNumber(deliverySettings.insideDhakaFee)}, ঢাকার বাইরে ৳{toBengaliNumber(deliverySettings.outsideDhakaFee)}
                {deliverySettings.enableFreeDelivery && ` (৳${toBengaliNumber(deliverySettings.freeDeliveryThreshold)}+ অর্ডারে ডেলিভারি ফ্রি)`}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleFullCartClick}
                  className="w-full bg-[#F5F1E8] hover:bg-[#EAE4D7] text-[#14422D] py-2.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  পূর্ণ কার্ট দেখুন
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#14422D] hover:bg-[#0E3020] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>অর্ডার করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
