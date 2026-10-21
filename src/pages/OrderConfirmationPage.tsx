import React from 'react';
import { useStore } from '../context/StoreContext';
import { toBengaliNumber } from '../data/mockData';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, PhoneCall, MapPin, Truck } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lastConfirmedOrder, navigate } = useStore();

  if (!lastConfirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#14422D] mb-2">কোনো সাম্প্রতিক অর্ডার পাওয়া যায়নি</h2>
        <p className="text-xs text-[#7A6E5D] mb-6">আপনার যদি কোনো পূর্ববর্তী অর্ডার থাকে তবে ট্র্যাক করতে পারেন।</p>
        <button
          onClick={() => navigate('tracking')}
          className="bg-[#14422D] text-white px-5 py-2.5 rounded-lg text-xs font-semibold"
        >
          অর্ডার ট্র্যাক করুন
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
      {/* Success Badge */}
      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-10 shadow-sm text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
          ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14422D] mt-1 mb-2">
          অর্ডার আইডি: #{lastConfirmedOrder.id}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5043] max-w-lg mx-auto leading-relaxed">
          আমাদের প্রতিনিধি খুব দ্রুত আপনার মোবাইল নম্বরে ({lastConfirmedOrder.phone}) যোগাযোগ করে অর্ডারটি কনফার্ম করবেন।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-[#F0EBE0]">
          <button
            onClick={() => navigate('tracking', { orderId: lastConfirmedOrder.id })}
            className="bg-[#14422D] hover:bg-[#0E3020] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Truck className="w-4 h-4 text-[#C59B27]" />
            <span>অর্ডারের বর্তমান অবস্থা ট্র্যাক করুন</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#F5F1E8] hover:bg-[#EAE4D7] text-[#14422D] border border-[#D8D0C0] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>ইনভয়েস প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Invoice Details Container */}
      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE0]">
          <div>
            <h2 className="text-base font-bold text-[#14422D]">অর্ডার রসিদ বিবরণী</h2>
            <p className="text-xs text-[#7A6E5D]">তারিখ: {lastConfirmedOrder.createdAt}</p>
          </div>
          <span className="bg-[#EBF4EF] text-[#14422D] text-xs font-bold px-2.5 py-1 rounded">
            ক্যাশ অন ডেলিভারি (COD)
          </span>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#4A4237] p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3D9]">
          <div className="space-y-1">
            <p className="font-bold text-[#14422D]">গ্রাহকের নাম ও ফোন:</p>
            <p className="text-sm font-semibold text-[#1F2937]">{lastConfirmedOrder.customerName}</p>
            <p className="font-mono text-[#5A5043]">{lastConfirmedOrder.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-[#14422D]">ডেলিভারি ঠিকানা:</p>
            <p className="leading-snug">{lastConfirmedOrder.fullAddress}</p>
            <p className="text-[#7A6E5D]">{lastConfirmedOrder.upazila}, {lastConfirmedOrder.district}</p>
          </div>
        </div>

        {/* Itemized List */}
        <div>
          <h3 className="text-xs font-bold text-[#14422D] uppercase tracking-wider mb-3">
            অর্ডারকৃত পণ্যসমূহ:
          </h3>
          <div className="divide-y divide-[#F0EBE0]">
            {lastConfirmedOrder.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productNameBn}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg border border-[#E8E3D9]"
                  />
                  <div>
                    <p className="font-semibold text-[#1F2937]">{item.productNameBn}</p>
                    <p className="text-[#7A6E5D]">
                      {item.variantWeightBn} &times; {toBengaliNumber(item.quantity)} টি
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#14422D] tabular-nums">
                  ৳{toBengaliNumber(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Table */}
        <div className="pt-4 border-t border-[#F0EBE0] space-y-2 text-xs">
          <div className="flex justify-between text-[#6B5E4F]">
            <span>পণ্যের মূল্য:</span>
            <span className="tabular-nums">৳{toBengaliNumber(lastConfirmedOrder.subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#6B5E4F]">
            <span>ডেলিভারি চার্জ:</span>
            <span className="tabular-nums">৳{toBengaliNumber(lastConfirmedOrder.deliveryFee)}</span>
          </div>
          {lastConfirmedOrder.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>ডিসকাউন্ট:</span>
              <span className="tabular-nums">-৳{toBengaliNumber(lastConfirmedOrder.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-[#14422D] pt-2 border-t border-[#E8E3D9]">
            <span>সর্বমোট প্রদেয় বিল:</span>
            <span className="tabular-nums">৳{toBengaliNumber(lastConfirmedOrder.total)}</span>
          </div>
        </div>

      </div>

      {/* Return to shop */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate('home')}
          className="text-xs font-semibold text-[#14422D] hover:underline"
        >
          &larr; মূল পাতায় ফিরে যান
        </button>
      </div>
    </div>
  );
};
