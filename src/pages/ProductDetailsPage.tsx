import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { toBengaliNumber } from '../data/mockData';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, ArrowRight, Minus, Plus, Heart, Share2, Check } from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { products, selectedProductId, addToCart, navigate, showToast } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-base text-[#5A5043]">পণ্যটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('products')}
          className="mt-4 bg-[#14422D] text-white px-4 py-2 rounded-lg text-xs"
        >
          সকল পণ্য দেখুন
        </button>
      </div>
    );
  }

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = () => {
    addToCart(product, selectedVariantId, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariantId, quantity);
    navigate('checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('পণ্যের লিংক কপি করা হয়েছে!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Related products in same category
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#7A6E5D] mb-6">
        <button onClick={() => navigate('home')} className="hover:text-[#14422D]">হোম</button>
        <span>/</span>
        <button onClick={() => navigate('products')} className="hover:text-[#14422D]">সকল পণ্য</button>
        <span>/</span>
        <button onClick={() => navigate('category', { categoryId: product.category })} className="hover:text-[#14422D]">{product.categoryBn}</button>
        <span>/</span>
        <span className="text-[#14422D] font-medium truncate max-w-[200px]">{product.nameBn}</span>
      </div>

      {/* Main PDP Grid: Gallery Left, Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
        
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#E8E3D9] shadow-sm">
            <img
              src={product.image}
              alt={product.nameBn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.isBestSeller && (
              <div className="absolute top-3 left-3 bg-[#14422D] text-white text-xs font-semibold px-2.5 py-1 rounded">
                বেস্ট সেলার
              </div>
            )}
          </div>

          {/* Trust strip below image */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-[#E8E3D9] shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#14422D] mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-[#14422D] block">১০০% অর্গানিক</span>
              <span className="text-[10px] text-[#7A6E5D]">পরীক্ষিত খাঁটি মান</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E8E3D9] shadow-xs">
              <Truck className="w-5 h-5 text-[#14422D] mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-[#14422D] block">দ্রুত ডেলিভারি</span>
              <span className="text-[10px] text-[#7A6E5D]">সারা বাংলাদেশে</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E8E3D9] shadow-xs">
              <RefreshCw className="w-5 h-5 text-[#14422D] mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-[#14422D] block">৭ দিনে রিটার্ন</span>
              <span className="text-[10px] text-[#7A6E5D]">সহজ পরিবর্তন</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3D9] shadow-sm space-y-6">
          
          <div>
            {/* Category & Origin */}
            <div className="flex items-center justify-between text-xs text-[#7A6E5D] mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#14422D]">{product.categoryBn}</span>
                <span aria-hidden="true">·</span>
                <span>উৎস: {product.originBn}</span>
              </div>
              <button
                onClick={handleShare}
                className="hover:text-[#14422D] flex items-center gap-1 text-xs"
                title="শেয়ার করুন"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'কপি হয়েছে' : 'শেয়ার'}</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#14422D] leading-snug">
              {product.nameBn}
            </h1>
            <p className="text-xs text-[#8C8070] mt-0.5">{product.nameEn}</p>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-3 mt-3 pb-4 border-b border-[#F0EBE0] text-xs">
              <div className="flex items-center gap-1 text-[#C59B27]">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#1F2937] tabular-nums">{toBengaliNumber(product.rating)}</span>
                <span className="text-[#7A6E5D]">({toBengaliNumber(product.reviewsCount)} টি কাস্টমার রিভিউ)</span>
              </div>
              <span className="text-[#8C8070]">·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                ইন স্টক ({toBengaliNumber(product.stock)} টি অবশিষ্ট)
              </span>
            </div>
          </div>

          {/* Price Container */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E3D9]">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-[#14422D] tabular-nums">
                ৳{toBengaliNumber(currentVariant.price)}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-sm text-[#9C9181] line-through tabular-nums">
                  ৳{toBengaliNumber(currentVariant.originalPrice)}
                </span>
              )}
              {currentVariant.originalPrice && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  সাশ্রয় ৳{toBengaliNumber(currentVariant.originalPrice - currentVariant.price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7A6E5D] mt-1">
              * ভ্যাট অন্তর্ভুক্ত। ডেলিভারি চার্জ চেকআউটে যুক্ত হবে। (প্রদর্শিত দাম এডিটেবল ডেমো মূল্য)
            </p>
          </div>

          {/* Weight Variants Selector */}
          <div>
            <label className="block text-xs font-bold text-[#14422D] uppercase tracking-wider mb-2">
              ওজন / প্যাকেজের পরিমাণ নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedVariantId === v.id
                      ? 'border-[#14422D] bg-[#14422D] text-white shadow-xs font-bold'
                      : 'border-[#E8E3D9] bg-[#FAF8F5] text-[#2E2820] hover:border-[#14422D]'
                  }`}
                >
                  <span className="text-sm block">{v.weightBn}</span>
                  <span className={`text-xs block mt-0.5 tabular-nums ${selectedVariantId === v.id ? 'text-[#E9C46A]' : 'text-[#7A6E5D]'}`}>
                    ৳{toBengaliNumber(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls */}
          <div>
            <label className="block text-xs font-bold text-[#14422D] uppercase tracking-wider mb-2">
              পরিমাণ (Quantity):
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#FAF8F5] border border-[#E8E3D9] rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#5A5043] hover:text-[#14422D] hover:bg-white rounded-lg transition-colors"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#14422D] tabular-nums">
                  {toBengaliNumber(quantity)}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-[#5A5043] hover:text-[#14422D] hover:bg-white rounded-lg transition-colors"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-[#7A6E5D]">
                মোট: <strong className="text-[#14422D] tabular-nums">৳{toBengaliNumber(currentVariant.price * quantity)}</strong>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FAF8F5] hover:bg-[#EFEAE0] text-[#14422D] border border-[#14422D] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#14422D]" />
              <span>ব্যাগে যোগ করুন</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#14422D] hover:bg-[#0E3020] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>সরাসরি অর্ডার করুন</span>
              <ArrowRight className="w-4 h-4 text-[#C59B27]" />
            </button>
          </div>

        </div>

      </div>

      {/* Description & Health Benefits */}
      <div className="bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-10 mb-16 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#14422D] mb-3">
            পণ্যের বিবরণ ও খাঁটি মান
          </h2>
          <p className="text-sm sm:text-base text-[#4A4237] leading-relaxed">
            {product.descriptionBn}
          </p>
        </div>

        {/* Benefits */}
        <div className="pt-4 border-t border-[#F0EBE0]">
          <h3 className="text-base font-bold text-[#14422D] mb-3">
            পুষ্টিগুণ ও স্বাস্থ্য উপকারিতা:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {product.benefitsBn.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A4237]">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#14422D] mb-6 pb-2 border-b border-[#E8E3D9]">
            সংশ্লিষ্ট আরও পণ্য
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
