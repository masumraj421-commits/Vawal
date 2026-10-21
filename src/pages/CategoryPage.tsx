import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { toBengaliNumber } from '../data/mockData';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { products, categories, selectedCategoryId, navigate } = useStore();
  const [currentCatId, setCurrentCatId] = useState<string>(selectedCategoryId || 'honey');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const currentCategory = categories.find(c => c.id === currentCatId) || categories[1] || categories[0];

  const categoryProducts = useMemo(() => {
    return products
      .filter(p => p.category === currentCatId)
      .sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, currentCatId, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Back and Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7A6E5D] mb-6">
        <button onClick={() => navigate('home')} className="hover:text-[#14422D]">হোম</button>
        <span>/</span>
        <button onClick={() => navigate('products')} className="hover:text-[#14422D]">সকল পণ্য</button>
        <span>/</span>
        <span className="text-[#14422D] font-medium">{currentCategory.nameBn}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#F5F1E8] rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 mb-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
            ক্যাটাগরি স্পেশাল
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14422D] mt-1 mb-2">
            {currentCategory.nameBn} ({currentCategory.nameEn})
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5043] leading-relaxed">
            ১০০% খাঁটি ও প্রাকৃতিক উপাদানের নিশ্চয়তা। স্বাস্থ্যকর জীবনের প্রতিদিনের পুষ্টি চাহিদায় বিশ্বস্ত পণ্য।
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-[#E8E3D9] scrollbar-none">
          {categories.filter(c => c.id !== 'all').map((c) => (
            <button
              key={c.id}
              onClick={() => setCurrentCatId(c.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                currentCatId === c.id
                  ? 'bg-[#14422D] text-white shadow-xs'
                  : 'bg-white text-[#5A5043] hover:bg-[#EAE4D7]'
              }`}
            >
              {c.nameBn}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D9] mb-6 text-xs text-[#7A6E5D]">
        <span>
          মোট <strong className="text-[#14422D] font-bold tabular-nums">{toBengaliNumber(categoryProducts.length)}</strong> টি পণ্য পাওয়া গেছে
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[#6B5E4F] hidden sm:inline">সাজান:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#E8E3D9] text-[#2E2820] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="featured">জনপ্রিয়তা</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {categoryProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E3D9] p-12 text-center">
          <p className="text-sm text-[#7A6E5D]">এই ক্যাটাগরিতে বর্তমানে নতুন স্টক যোগ করার কাজ চলছে।</p>
          <button
            onClick={() => navigate('products')}
            className="mt-4 bg-[#14422D] text-white px-4 py-2 rounded-lg text-xs"
          >
            অন্যান্য পণ্য দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
