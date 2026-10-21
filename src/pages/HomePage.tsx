import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, heroBannerImg } from '../data/mockData';
import { ArrowRight, CheckCircle2, Sparkles, Shield, HeartHandshake, PhoneCall } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, navigate } = useStore();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'honey': return '🍯';
      case 'nuts': return '🥜';
      case 'dates': return '🌴';
      case 'raisins': return '🍇';
      case 'seeds': return '🌱';
      default: return '🍃';
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section: Campaign Focal Point */}
      <section className="relative overflow-hidden bg-[#F4EFE6] border-b border-[#E8E3D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Natural kicker (Anti-slop: clean text with separator) */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#14422D] tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>প্রকৃতির বিশুদ্ধ উপহার</span>
                <span aria-hidden="true">·</span>
                <span>ভাওয়াল গড় ও সুন্দরবনের ঐতিহ্য</span>
              </div>

              {/* Headline with balanced wrap */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14422D] leading-[1.25] tracking-tight">
                খাঁটি মধু, পুষ্টিকর বাদাম ও ড্রাই ফ্রুটসের বিশ্বস্ত সমাহার
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#5A5043] leading-relaxed max-w-xl">
                কোনো ভেজাল বা রাসায়নিক প্রিজারভেটিভ ছাড়া শতভাগ প্রাকৃতিক উপায়ে সংগৃহীত সুন্দরবনের কাঁচা মধু, ক্যালিফোর্নিয়া কাঠবাদাম, রোস্টেড কাজুবাদাম ও মদিনার রসালো খেজুর।
              </p>

              {/* Hero Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('products')}
                  className="bg-[#14422D] hover:bg-[#0E3020] text-white px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
                >
                  <span>সকল পণ্য দেখুন</span>
                  <ArrowRight className="w-4 h-4 text-[#C59B27]" />
                </button>
                <button
                  onClick={() => navigate('category', { categoryId: 'honey' })}
                  className="bg-white hover:bg-[#EFEAE0] text-[#14422D] border border-[#D8D0C0] px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-colors"
                >
                  সুন্দরবনের মধু সংগ্রহ
                </button>
              </div>

              {/* Trust badges strip */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#5A5043] border-t border-[#E5DEC7]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14422D]" />
                  <span>ল্যাব টেস্টে শতভাগ খাঁটি</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14422D]" />
                  <span>ক্যাশ অন ডেলিভারি সুবিধা</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14422D]" />
                  <span>সারা বাংলাদেশে দ্রুত হোম ডেলিভারি</span>
                </div>
              </div>

            </div>

            {/* Right Media Hero Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#D8D0C0] shadow-lg bg-white group">
                <img
                  src={heroBannerImg}
                  alt="ভাওয়াল ফ্রেশ ফুড প্রাকৃতিক মধু, কাঠবাদাম ও ড্রাই ফ্রুটস"
                  referrerPolicy="no-referrer"
                  className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-xs font-semibold text-[#E9C46A] uppercase tracking-wider block">
                      বিশেষ সংগ্রহ ২০২৬
                    </span>
                    <p className="text-sm font-medium mt-1 text-slate-100">
                      সুন্দরবনের খাঁটি কাঁচা খলিশা ফুলের মধু এবং তাজা রোস্টেড কাজুবাদাম
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Product Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-3 border-b border-[#E8E3D9]">
          <div>
            <span className="text-xs font-semibold text-[#8C7B65] uppercase tracking-wider">
              শ্রেণিবিভাগ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14422D] mt-1">
              পণ্য ক্যাটাগরি সমূহ
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-sm font-semibold text-[#14422D] hover:underline flex items-center gap-1"
          >
            <span>সব ক্যাটাগরি ব্রাউজ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('category', { categoryId: cat.id })}
              className="bg-white p-4 rounded-xl border border-[#E8E3D9] hover:border-[#14422D] text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] group-hover:bg-[#14422D] group-hover:text-white flex items-center justify-center text-[#14422D] font-bold text-sm mb-3 transition-colors">
                {getCategoryIcon(cat.id)}
              </div>
              <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#14422D] leading-snug">
                {cat.nameBn}
              </h3>
              <p className="text-xs text-[#7A6E5D] mt-1">
                {cat.nameEn}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-3 border-b border-[#E8E3D9]">
          <div>
            <span className="text-xs font-semibold text-[#8C7B65] uppercase tracking-wider">
              বিশেষ অফার ও সেরা পণ্য
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14422D] mt-1">
              আমাদের নির্বাচিত পণ্যসমূহ
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-sm font-semibold text-[#14422D] hover:underline flex items-center gap-1"
          >
            <span>সকল পণ্য দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Brand Philosophy / Craftsmanship Rest Section */}
      <section className="bg-[#14422D] text-[#FDFBF7] py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
              ভাওয়াল ফ্রেশ ফুডের প্রতিশ্রুতি
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FDFBF7] leading-snug">
              খাদ্যে কোনো আপস নয় — সরাসরি কৃষকের মাঠ ও প্রাকৃতিক বনভূমি থেকে আপনার ঘরে
            </h2>
            <p className="text-sm sm:text-base text-[#C2DDD0] leading-relaxed">
              আমরা বিশ্বাস করি সুস্থ জীবনের ভিত্তি হচ্ছে খাঁটি খাদ্য। বর্তমান বাজারে যখন রাসায়নিক ও কৃত্রিম মিশ্রণে বাজার সয়লাব, তখন ভাওয়াল ফ্রেশ ফুড নিয়ে এসেছে শতভাগ দায়িত্বশীল ও বিশ্বস্ত সোর্সিং। সুন্দরবনের খাঁটি মধু ও উন্নতমানের ড্রাই ফ্রুটস এখন আপনার হাতের মুঠোয়।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="border border-[#235C42] rounded-xl p-3.5 bg-[#1B4D36]">
                <h4 className="text-sm font-bold text-[#C59B27]">১০০% প্রাকৃতিক</h4>
                <p className="text-xs text-[#A8C9B9] mt-1">কোনো প্রকার প্রিজারভেটিভ বা চিনি মুক্ত</p>
              </div>
              <div className="border border-[#235C42] rounded-xl p-3.5 bg-[#1B4D36]">
                <h4 className="text-sm font-bold text-[#C59B27]">পরিচ্ছন্ন প্যাকেজিং</h4>
                <p className="text-xs text-[#A8C9B9] mt-1">ফুড-গ্রেড ও এয়ারটাইট স্বাস্থ্যসম্মত জার</p>
              </div>
              <div className="border border-[#235C42] rounded-xl p-3.5 bg-[#1B4D36]">
                <h4 className="text-sm font-bold text-[#C59B27]">৭ দিনের রিপ্লেসমেন্ট</h4>
                <p className="text-xs text-[#A8C9B9] mt-1">পণ্য অপছন্দ হলে দ্রুত ফেরত বা বদল সুবিধা</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1B4D36] border border-[#235C42] p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C59B27]/20 text-[#C59B27] flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">ফোনে অর্ডার করতে চান?</h3>
            <p className="text-xs text-[#C2DDD0]">
              আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে কথা বলে সরাসরি অর্ডার কনফার্ম করুন:
            </p>
            <a
              href="tel:01742578679"
              className="inline-block bg-[#C59B27] hover:bg-[#b0871d] text-[#14422D] font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              কল করুন: ০১৭৪২৫৭৮৬৭৯
            </a>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-3 border-b border-[#E8E3D9]">
          <div>
            <span className="text-xs font-semibold text-[#8C7B65] uppercase tracking-wider">
              গ্রাহকদের সর্বাধিক পছন্দের
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14422D] mt-1">
              বেস্ট সেলার পণ্যসমূহ
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-sm font-semibold text-[#14422D] hover:underline flex items-center gap-1"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Attributable Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#8C7B65] uppercase tracking-wider">
            গ্রাহক প্রতিক্রিয়া
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14422D] mt-1">
            সম্মানিত ক্রেতাদের বাস্তব মতামত
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E8E3D9] shadow-xs flex flex-col justify-between">
            <p className="text-sm text-[#4A4237] leading-relaxed italic mb-4">
              &quot;সুন্দরবনের খলিশা মধুর ঘ্রাণ ও স্বাদ অসাধারণ। এর আগে বাজারে অনেক মধু কিনে প্রতারিত হয়েছি, কিন্তু ভাওয়াল ফ্রেশ ফুডের মধু ১০০% খাঁটি কাঁচা মধুর প্রমাণ দিয়েছে।&quot;
            </p>
            <div className="border-t border-[#F0EBE0] pt-3 flex items-center justify-between text-xs text-[#7A6E5D]">
              <span className="font-bold text-[#14422D]">নাজমুল আরেফিন</span>
              <span>উত্তরা, ঢাকা</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E3D9] shadow-xs flex flex-col justify-between">
            <p className="text-sm text-[#4A4237] leading-relaxed italic mb-4">
              &quot;রোস্টেড কাজু এবং ক্যালিফোর্নিয়া বাদামের কম্বো প্যাকটা অসম্ভব ক্রাঞ্চি। প্যাকেজিং অনেক পরিচ্ছন্ন ছিল। ঢাকার বাইরে ৩ দিনের মধ্যেই ডেলিভারি পেয়েছি।&quot;
            </p>
            <div className="border-t border-[#F0EBE0] pt-3 flex items-center justify-between text-xs text-[#7A6E5D]">
              <span className="font-bold text-[#14422D]">ফাহমিদা সুলতানা</span>
              <span>পাঁচলাইশ, চট্টগ্রাম</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E3D9] shadow-xs flex flex-col justify-between">
            <p className="text-sm text-[#4A4237] leading-relaxed italic mb-4">
              &quot;মদিনার আজওয়া খেজুরগুলো খুবই নরম ও ফ্রেশ। মা-বাবার জন্য নিয়মিত নিচ্ছি। ক্যাশ অন ডেলিভারিতে চেক করে নেওয়ার সুযোগ থাকায় পুরোপুরি নিশ্চিন্ত।&quot;
            </p>
            <div className="border-t border-[#F0EBE0] pt-3 flex items-center justify-between text-xs text-[#7A6E5D]">
              <span className="font-bold text-[#14422D]">ইশতিয়াক মাহমুদ</span>
              <span>জয়দেবপুর, গাজীপুর</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
