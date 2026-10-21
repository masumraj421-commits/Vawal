import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, RefreshCw, Truck, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <button
        onClick={() => navigate('home')}
        className="text-xs font-semibold text-[#14422D] hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>মূল পাতায় ফিরুন</span>
      </button>

      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE0]">
          <ShieldCheck className="w-7 h-7 text-[#14422D]" />
          <div>
            <h1 className="text-2xl font-bold text-[#14422D]">গোপনীয়তা নীতি (Privacy Policy)</h1>
            <p className="text-xs text-[#7A6E5D]">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4A4237] leading-relaxed">
          <p>
            &quot;ভাওয়াল ফ্রেশ ফুড&quot; (Bhawal Fresh Food) এ আপনার গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান অগ্রাধিকার। আপনি যখন আমাদের ওয়েবসাইট থেকে প্রাকৃতিক মধু, বাদাম বা ড্রাই ফ্রুটস অর্ডার করেন, তখন আপনার প্রদত্ত তথ্যের সুরক্ষা নিশ্চিত করতে আমরা প্রতিশ্রুতিবদ্ধ।
          </p>

          <h3 className="text-base font-bold text-[#14422D] pt-2">১. আমরা কোন তথ্য সংগ্রহ করি</h3>
          <p>
            অর্ডার নিশ্চিতকরণ ও হোম ডেলিভারি পৌঁছে দেওয়ার সুবিধার্থে আমরা আপনার নাম, মোবাইল নম্বর, ডেলিভারি ঠিকানা এবং জেলা/উপজেলার তথ্য সংগ্রহ করি।
          </p>

          <h3 className="text-base font-bold text-[#14422D] pt-2">২. তথ্যের ব্যবহার</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>আপনার অর্ডারের পার্সেল সঠিক ঠিকানায় পৌঁছানো।</li>
            <li>ডেলিভারির সময় রাইডারের সাথে সরাসরি যোগাযোগ রাখা।</li>
            <li>কাস্টমার সার্ভিস ও আফটার-সেলস সাপোর্টের উন্নতি সাধন।</li>
          </ul>

          <h3 className="text-base font-bold text-[#14422D] pt-2">৩. তথ্যের সুরক্ষা ও তৃতীয় পক্ষ</h3>
          <p>
            আমরা কখনো কোনো গ্রাহকের ব্যক্তিগত মোবাইল নম্বর বা ঠিকানা কোনো বিজ্ঞাপনদাতা বা অননুমোদিত তৃতীয় পক্ষের কাছে বিক্রি বা হস্তান্তর করি না। কেবল অনুমোদিত লজিস্টিকস ও কুরিয়ার পার্টনাররা ডেলিভারি সম্পন্ন করার জন্য আপনার ঠিকানা ব্যবহারের অনুমতি পায়।
          </p>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
      <button
        onClick={() => navigate('home')}
        className="text-xs font-semibold text-[#14422D] hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>মূল পাতায় ফিরুন</span>
      </button>

      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0EBE0]">
          <RefreshCw className="w-7 h-7 text-[#14422D]" />
          <div>
            <h1 className="text-2xl font-bold text-[#14422D]">রিটার্ন ও রিফান্ড নীতি (Return & Refund Policy)</h1>
            <p className="text-xs text-[#7A6E5D]">সহজ ও ঝামেলামুক্ত গ্রাহক সুবিধা</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4A4237] leading-relaxed">
          <p>
            ভাওয়াল ফ্রেশ ফুড প্রতিটি গ্রাহকের শতভাগ সন্তুষ্টি নিশ্চিত করতে অঙ্গীকারবদ্ধ। আমাদের খাবার সামগ্রী খাদ্য-নিরাপত্তা মানদণ্ড মেনে প্রস্তুত ও প্যাকেটজাত করা হয়। তা সত্ত্বেও যদি কোনো সমস্যা হয়, আমরা দ্রুত সমাধানের নিশ্চয়তা দিচ্ছি।
          </p>

          <h3 className="text-base font-bold text-[#14422D] pt-2">১. ডেলিভারির সময় তাৎক্ষণিক যাচাই</h3>
          <p>
            ক্যাশ অন ডেলিভারিতে পার্সেল পাওয়ার পর রাইডারের উপস্থিতিতে প্যাকেট পরীক্ষা করে নিন। যদি জারের কোনো ফুটো বা পরিবহনে কোনো ভাঙন দেখতে পান, সাথে সাথে ডেলিভারি পার্টনারের কাছে পার্সেল ফেরত দিন। এর জন্য আপনাকে কোনো অতিরিক্ত চার্জ দিতে হবে না।
          </p>

          <h3 className="text-base font-bold text-[#14422D] pt-2">২. ৭ দিনের কোয়ালিটি রিপ্লেসমেন্ট গ্যারান্টি</h3>
          <p>
            পণ্য গ্রহণের পর ৭ দিনের মধ্যে যদি খাঁটি মানের কোনো ব্যত্যয় লক্ষ্য করেন (যেমন: অস্বাভাবিক গন্ধ বা আর্দ্রতাজনিত সমস্যা), তবে আমাদের হটলাইনে (০১৭৪২৫৭৮৬৭৯ / ০১৩০২২৫৭৭৬১) জানান। আমরা সম্পূর্ণ বিনামূল্যে নতুন পণ্য রিপ্লেস করে দেব অথবা সম্পূর্ণ টাকা রিফান্ড করব।
          </p>

          <h3 className="text-base font-bold text-[#14422D] pt-2">৩. রিফান্ড পরিশোধের প্রক্রিয়া</h3>
          <p>
            অনলাইন বা অগ্রিম কোনো পেমেন্ট করা থাকলে পণ্য ফেরতের ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার বিকাশ, নগদ বা ব্যাংক একাউন্টে রিফান্ডের অর্থ সরাসরি প্রেরণ করা হবে।
          </p>
        </div>
      </div>
    </div>
  );
};
