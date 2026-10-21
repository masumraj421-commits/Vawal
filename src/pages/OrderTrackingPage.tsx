import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { toBengaliNumber } from '../data/mockData';
import { Search, CheckCircle2, Clock, Truck, Package, AlertCircle } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orders, trackingQuery, setTrackingQuery, navigate } = useStore();
  const [searchInput, setSearchInput] = useState(trackingQuery || '');
  const [hasSearched, setHasSearched] = useState(!!trackingQuery);

  const matchedOrder = orders.find(o => 
    o.id.toLowerCase() === searchInput.trim().toLowerCase() ||
    o.phone === searchInput.trim()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setTrackingQuery(searchInput.trim());
  };

  const handleSampleClick = (orderId: string) => {
    setSearchInput(orderId);
    setTrackingQuery(orderId);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
          রিয়েল-টাইম তথ্য
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14422D] mt-1 mb-2">
          আপনার অর্ডার ট্র্যাক করুন
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5043]">
          আপনার অর্ডার আইডি (যেমন: BFF-89412) অথবা অর্ডার দেওয়ার সময় ব্যবহৃত মোবাইল নম্বর দিয়ে পার্সেলের বর্তমান অবস্থা জানুন।
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E3D9] shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#8C8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="অর্ডার আইডি (BFF-XXXXX) বা মোবাইল নম্বর লিখুন..."
              className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl text-sm text-[#1F2937] placeholder-[#9C9181] focus:outline-none focus:border-[#14422D]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#14422D] hover:bg-[#0E3020] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-sm shrink-0"
          >
            ট্র্যাক করুন
          </button>
        </form>

        {/* Quick Sample Order Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#F0EBE0] text-xs text-[#7A6E5D]">
          <span>দ্রুত টেস্ট করুন:</span>
          {orders.slice(0, 3).map(o => (
            <button
              key={o.id}
              onClick={() => handleSampleClick(o.id)}
              className="bg-[#F5F1E8] hover:bg-[#EAE4D7] text-[#14422D] px-2.5 py-1 rounded font-mono text-xs font-semibold transition-colors"
            >
              #{o.id}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      {hasSearched && !matchedOrder && (
        <div className="bg-white rounded-2xl border border-[#E8E3D9] p-10 text-center shadow-xs">
          <AlertCircle className="w-12 h-12 text-[#9C9181] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#14422D] mb-1">
            কোনো অর্ডার খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs text-[#7A6E5D] max-w-sm mx-auto">
            &quot;{searchInput}&quot; দিয়ে কোনো সক্রিয় অর্ডার পাওয়া যায়নি। সঠিক অর্ডার আইডি বা মোবাইল নম্বরটি পুনরায় যাচাই করুন।
          </p>
        </div>
      )}

      {matchedOrder && (
        <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-200">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EBE0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#14422D]">
                  অর্ডার #{matchedOrder.id}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  matchedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                  matchedOrder.status === 'shipped' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {matchedOrder.status === 'delivered' ? 'ডেলিভারি সম্পন্ন' :
                   matchedOrder.status === 'shipped' ? 'ডেলিভারিতে বের হয়েছে' :
                   matchedOrder.status === 'processing' ? 'প্যাকেজিং চলছে' : 'অর্ডার নিশ্চিত'}
                </span>
              </div>
              <p className="text-xs text-[#7A6E5D] mt-1">
                গ্রাহক: <strong className="text-[#1F2937]">{matchedOrder.customerName}</strong> ({matchedOrder.phone})
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#7A6E5D] block">সর্বমোট বিল</span>
              <span className="text-xl font-extrabold text-[#14422D] tabular-nums">
                ৳{toBengaliNumber(matchedOrder.total)}
              </span>
            </div>
          </div>

          {/* Tracking Step Progress Bar */}
          <div>
            <h3 className="text-xs font-bold text-[#14422D] uppercase tracking-wider mb-6">
              ডেলিভারি পর্যায়ক্রমিক অগ্রগতি:
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-[#E8E3D9]">
              {matchedOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Step icon node on the left timeline */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-[#14422D] text-white shadow-xs' :
                    step.current ? 'bg-[#C59B27] text-white ring-4 ring-[#C59B27]/20' :
                    'bg-[#F0EBE0] text-[#9C9181]'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : step.current ? (
                      <Truck className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  {/* Step content */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-sm font-bold ${
                        step.completed || step.current ? 'text-[#14422D]' : 'text-[#8C8070]'
                      }`}>
                        {step.titleBn}
                      </h4>
                      <span className="text-[11px] text-[#7A6E5D] font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A5043] mt-1">
                      {step.descBn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Items */}
          <div className="pt-6 border-t border-[#F0EBE0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E3D9]">
              <span className="font-bold text-[#14422D] block mb-1">ডেলিভারি ঠিকানা:</span>
              <p className="text-[#2E2820] leading-snug">{matchedOrder.fullAddress}</p>
              <p className="text-[#7A6E5D] mt-0.5">{matchedOrder.upazila}, {matchedOrder.district}</p>
              {matchedOrder.deliveryNotes && (
                <p className="text-[#8C8070] italic mt-2">নোট: {matchedOrder.deliveryNotes}</p>
              )}
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E3D9]">
              <span className="font-bold text-[#14422D] block mb-1">অর্ডারকৃত পণ্য:</span>
              <ul className="space-y-1">
                {matchedOrder.items.map((it, i) => (
                  <li key={i} className="flex justify-between text-[#2E2820]">
                    <span>{it.productNameBn} ({it.variantWeightBn}) &times; {toBengaliNumber(it.quantity)}</span>
                    <span className="font-semibold tabular-nums">৳{toBengaliNumber(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
