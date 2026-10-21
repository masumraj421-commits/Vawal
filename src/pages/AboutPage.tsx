import React from 'react';
import { useStore } from '../context/StoreContext';
import { heroBannerImg } from '../data/mockData';
import { Award, Leaf, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
          ঐতিহ্য ও বিশুদ্ধতা
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14422D] mt-1 mb-3">
          ভাওয়াল ফ্রেশ ফুডের গল্প
        </h1>
        <p className="text-sm sm:text-base text-[#5A5043] leading-relaxed">
          আমরা বিশ্বাস করি প্রতিটি পরিবার সুস্থ, খাঁটি এবং কেমিক্যালমুক্ত খাদ্য পাওয়ার অধিকার রাখে।
        </p>
      </div>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden border border-[#E8E3D9] shadow-sm">
        <img
          src={heroBannerImg}
          alt="ভাওয়াল ফ্রেশ ফুড প্রাকৃতিক মধু ও ড্রাই ফ্রুটস"
          referrerPolicy="no-referrer"
          className="w-full h-64 sm:h-96 object-cover"
        />
      </div>

      {/* Main Story Content */}
      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#14422D] mb-3">
            আমাদের উৎপত্তি ও যাত্রা
          </h2>
          <p className="text-sm sm:text-base text-[#4A4237] leading-relaxed mb-4">
            গাজীপুরের ঐতিহাসিক ভাওয়াল গড়ের সবুজ শ্যামল পরিবেশ ও সমৃদ্ধ কৃষি ঐতিহ্যের অনুপ্রেরণায় &quot;ভাওয়াল ফ্রেশ ফুড&quot; (Bhawal Fresh Food) এর যাত্রা শুরু। বাজারে যখন বিভিন্ন সিন্ডিকেটের কৃত্রিম চিনি মেশানো মধু এবং প্রিজারভেটিভযুক্ত ড্রাই ফ্রুটস সয়লাব, তখন আমরা সরাসরি প্রকৃতি থেকে বিশুদ্ধ খাবার সংগ্রহের দৃঢ় অঙ্গীকার গ্রহণ করি।
          </p>
          <p className="text-sm sm:text-base text-[#4A4237] leading-relaxed">
            সুন্দরবনের গভীর অরণ্যের মৌয়ালদের থেকে কাঁচা মধু সংগ্রহ, আফগানিস্তানের ঐতিহ্যবাহী সোনালি কিশমিশ, ক্যালিফোর্নিয়া থেকে সরাসরি প্রিমিয়াম বাদাম এবং মদিনা মোনাওয়ারা থেকে মিষ্টি রসালো খেজুর আমদানি করে আমরা কোনো প্রকার কেমিক্যাল বা অতিরিক্ত রিফাইনিং ছাড়া গ্রাহকদের দোরগোড়ায় পৌঁছে দিচ্ছি।
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#F0EBE0]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14422D]">১০০% প্রাকৃতিক সোর্সিং</h3>
              <p className="text-xs text-[#5A5043] mt-1 leading-relaxed">
                কোনো প্রকার চিনি, রিফাইনড তেল, কৃত্রিম রং বা ক্ষতিকর প্রিজারভেটিভ মেশানো হয় না।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14422D]">ল্যাব টেস্ট ও গুণগত মান</h3>
              <p className="text-xs text-[#5A5043] mt-1 leading-relaxed">
                প্রতিটি ব্যাচ সুনির্দিষ্ট আর্দ্রতা ও বিশুদ্ধতা যাচাইয়ের পর ফুড-গ্রেড প্যাকেজিংয়ে সিল করা হয়।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14422D]">ন্যায্য ও নৈতিক মূল্য</h3>
              <p className="text-xs text-[#5A5043] mt-1 leading-relaxed">
                কৃষক ও মৌয়ালদের ন্যায্য পারিশ্রমিক নিশ্চিত করে গ্রাহকদের জন্য সর্বোত্তম সাশ্রয়ী মূল্য প্রদান।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14422D]">৭ দিনের সহজ রিটার্ন নিশ্চয়তা</h3>
              <p className="text-xs text-[#5A5043] mt-1 leading-relaxed">
                পণ্যের মান নিয়ে বিন্দুমাত্র অসন্তুষ্টি থাকলে বিনাবাক্যে ফেরত কিংবা সম্পূর্ণ রিপ্লেসমেন্ট প্রদান।
              </p>
            </div>
          </div>
        </div>

        {/* Action banner */}
        <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E8E3D9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#14422D]">আপনার পরিবারের সুস্বাস্থ্য আজই নিশ্চিত করুন</h4>
            <p className="text-xs text-[#7A6E5D] mt-0.5">আমাদের সম্পূর্ণ প্রাকৃতিক মধু ও ড্রাই ফ্রুটসের সম্ভার ঘুরে দেখুন।</p>
          </div>
          <button
            onClick={() => navigate('products')}
            className="bg-[#14422D] hover:bg-[#0E3020] text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <span>পণ্যসমূহ ব্রাউজ করুন</span>
            <ArrowRight className="w-4 h-4 text-[#C59B27]" />
          </button>
        </div>

      </div>
    </div>
  );
};
