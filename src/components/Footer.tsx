import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useStore();

  return (
    <footer className="bg-[#14422D] text-[#E8F3EE] mt-20 border-t border-[#1C523B]">
      {/* Trust Highlights Section */}
      <div className="border-b border-[#1E573E] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#205D42] flex items-center justify-center shrink-0 text-[#C59B27]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FDFBF7]">১০০% খাঁটি ও ফ্রেশ</h4>
              <p className="text-xs text-[#A3C4B5] mt-0.5">প্রাকৃতিক ও কেমিক্যালমুক্ত নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#205D42] flex items-center justify-center shrink-0 text-[#C59B27]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FDFBF7]">দ্রুত ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-[#A3C4B5] mt-0.5">সারা বাংলাদেশে বিশ্বস্ত পৌঁছানো</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#205D42] flex items-center justify-center shrink-0 text-[#C59B27]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FDFBF7]">সহজ রিপ্লেসমেন্ট</h4>
              <p className="text-xs text-[#A3C4B5] mt-0.5">পণ্য অপছন্দে ৭ দিনে সহজ ফেরত</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#205D42] flex items-center justify-center shrink-0 text-[#C59B27]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FDFBF7]">সুরক্ষিত কেনাকাটা</h4>
              <p className="text-xs text-[#A3C4B5] mt-0.5">পণ্য দেখে মূল্য পরিশোধের সুবিধা</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Story */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-[#C59B27] text-[#14422D] font-bold flex items-center justify-center text-sm">
              ভা
            </div>
            <span className="text-xl font-bold tracking-tight text-[#FDFBF7]">
              ভাওয়াল ফ্রেশ ফুড
            </span>
          </div>
          <p className="text-xs text-[#B4D1C3] leading-relaxed mb-4">
            ভাওয়াল গড়ের প্রাচীন ঐতিহ্য ও প্রাকৃতিক উৎস থেকে সরাসরি সংগৃহীত খাঁটি মধু, প্রিমিয়াম বাদাম, রসালো খেজুর ও অর্গানিক ড্রাই ফ্রুটসের নির্ভরযোগ্য ঠিকানা।
          </p>
          <p className="text-[11px] text-[#86AB9A] italic">
            * প্রদর্শিত সকল মূল্য এডিটেবল ডেমো মূল্য (Editable Demo Prices)।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-[#FDFBF7] uppercase tracking-wider mb-3">
            গুরুত্বপূর্ণ লিংক
          </h4>
          <ul className="space-y-2 text-xs text-[#B4D1C3]">
            <li>
              <button 
                onClick={() => navigate('products')} 
                className="hover:text-[#C59B27] transition-colors"
              >
                সকল পণ্য সম্ভার
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('category', { categoryId: 'honey' })} 
                className="hover:text-[#C59B27] transition-colors"
              >
                সুন্দরবনের খাঁটি মধু
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('category', { categoryId: 'nuts' })} 
                className="hover:text-[#C59B27] transition-colors"
              >
                কাজুবাদাম ও কাঠবাদাম
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('tracking')} 
                className="hover:text-[#C59B27] transition-colors"
              >
                অর্ডার ট্র্যাক করুন
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('admin')} 
                className="hover:text-[#C59B27] transition-colors font-medium text-emerald-200"
              >
                অ্যাডমিন ম্যানেজমেন্ট পোর্টাল
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <h4 className="text-sm font-semibold text-[#FDFBF7] uppercase tracking-wider mb-3">
            গ্রাহক সেবা ও নীতি
          </h4>
          <ul className="space-y-2 text-xs text-[#B4D1C3]">
            <li>
              <button 
                onClick={() => navigate('about')} 
                className="hover:text-[#C59B27] transition-colors"
              >
                আমাদের সম্পর্কে ও লক্ষ্য
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('contact')} 
                className="hover:text-[#C59B27] transition-colors"
              >
                যোগাযোগ ও পরামর্শ
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('refund')} 
                className="hover:text-[#C59B27] transition-colors"
              >
                রিটার্ন ও রিফান্ড পলিসি
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('privacy')} 
                className="hover:text-[#C59B27] transition-colors"
              >
                গোপনীয়তা নীতিমালা
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold text-[#FDFBF7] uppercase tracking-wider mb-3">
            যোগাযোগের ঠিকানা
          </h4>
          <div className="space-y-2.5 text-xs text-[#B4D1C3]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
              <span>বীর উজলী বাজার, কাপাসিয়া, গাজীপুর-১৭৩০, বাংলাদেশ</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
              <div className="space-x-1 tabular-nums">
                <a href="tel:01742578679" className="hover:text-[#C59B27]">০১৭৪২৫৭৮৬৭৯</a>
                <span>/</span>
                <a href="tel:01302257761" className="hover:text-[#C59B27]">০১৩০২২৫৭৭৬১</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
              <a href="mailto:Masumraj421@gmail.com" className="hover:text-[#C59B27]">
                Masumraj421@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#1C523B] py-4 bg-[#0E3020] text-center text-[11px] text-[#86AB9A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ভাওয়াল ফ্রেশ ফুড (Bhawal Fresh Food). সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-2">
            <span>ক্যাশ অন ডেলিভারি &middot; বিকাশ &middot; নগদ</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
