import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { toBengaliNumber } from '../data/mockData';
import { Search, SlidersHorizontal, RotateCcw, RefreshCw, AlertCircle, Database } from 'lucide-react';

export const AllProductsPage: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategoryId, 
    isLoadingProducts, 
    supabaseError, 
    reloadFromSupabase, 
    isSupabaseConnected,
    navigate 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId || 'all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = localSearch.trim() === '' || 
        product.nameBn.toLowerCase().includes(localSearch.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(localSearch.toLowerCase()) ||
        product.shortDescBn.includes(localSearch);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.price || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, localSearch, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setLocalSearch('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Header & Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-[#7A6E5D] mb-2">
          <button onClick={() => navigate('home')} className="hover:text-[#14422D]">হোম</button>
          <span>/</span>
          <span className="text-[#14422D] font-medium">সকল পণ্য</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14422D]">
              আমাদের সকল খাদ্য ও ড্রাই ফ্রুটস সম্ভার
            </h1>
            <p className="text-sm text-[#5A5043] mt-1">
              ১০০% ভেজালমুক্ত, সরাসরি প্রাকৃতিক বাগান ও বিশ্বস্ত কৃষকদের নিকট থেকে সংগৃহীত।
            </p>
          </div>

          {/* Database indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {isSupabaseConnected ? (
              <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>সুপাবেজ লাইভ ডেটাবেজ সংযুক্ত</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#F5F1E8] text-[#7A6E5D] border border-[#E8E3D9] px-3 py-1 rounded-full font-medium">
                <Database className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>ডেমো ক্যাটালগ মোড</span>
              </span>
            )}
            
            <button
              onClick={() => reloadFromSupabase()}
              className="p-1.5 hover:bg-[#F5F1E8] text-[#14422D] rounded-lg border border-[#E8E3D9] transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingProducts ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Error Notice (if any) */}
      {supabaseError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl mb-6 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">সুপাবেজ সংযোগ সতর্কতা:</p>
              <p className="text-amber-800 mt-0.5">{supabaseError}</p>
            </div>
          </div>
          <button
            onClick={() => reloadFromSupabase()}
            className="px-3 py-1 bg-amber-800 text-white rounded-md font-medium text-xs hover:bg-amber-900 shrink-0"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E3D9] mb-8 space-y-4 shadow-xs">
        {/* Dynamic Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#14422D] text-white shadow-xs'
                  : 'bg-[#F5F1E8] text-[#5A5043] hover:bg-[#EAE4D7] hover:text-[#14422D]'
              }`}
            >
              {cat.nameBn}
            </button>
          ))}
        </div>

        {/* Search input & Sort dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F0EBE0]">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C8070] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="পণ্য বা উপাদান খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-[#F9F7F2] border border-[#E8E3D9] rounded-lg text-xs text-[#2E2820] placeholder-[#9C9181] focus:outline-none focus:border-[#14422D]"
            />
            {localSearch && (
              <button 
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C8070] hover:text-[#2E2820]"
              >
                মুছুন
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-[#6B5E4F]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>সাজান:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F9F7F2] border border-[#E8E3D9] text-[#2E2820] text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#14422D]"
            >
              <option value="featured">জনপ্রিয়তা ও ফিচার্ড</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
              <option value="rating">সর্বোচ্চ রেটিং</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoadingProducts ? (
        <div className="bg-white rounded-2xl border border-[#E8E3D9] p-16 text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 border-3 border-[#14422D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-[#14422D] mb-1">
            সুপাবেজ থেকে পণ্য লোড করা হচ্ছে...
          </h3>
          <p className="text-xs text-[#7A6E5D]">
            অনুগ্রহ করে অপেক্ষা করুন, ডাটাবেজ থেকে তাজা তথ্য আনা হচ্ছে।
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E3D9] p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F5F1E8] flex items-center justify-center mx-auto text-2xl text-[#8C8070] mb-4">
            🔍
          </div>
          <h3 className="text-base font-bold text-[#14422D] mb-1">
            কোনো পণ্য খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs text-[#7A6E5D] mb-6">
            আপনার অনুসন্ধান ফিল্টারে কোনো ফলাফল নেই অথবা টেবিলে কোনো সক্রিয় পণ্য এন্ট্রি নেই।
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-[#14422D] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#0E3020] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
            <button
              onClick={() => reloadFromSupabase()}
              className="inline-flex items-center gap-2 bg-[#F5F1E8] text-[#14422D] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#EAE4D7] transition-colors border border-[#E8E3D9]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>পুনরায় রিফ্রেশ</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-xs text-[#7A6E5D] mb-4">
            <span>
              মোট <strong className="text-[#14422D] font-bold tabular-nums">{toBengaliNumber(filteredProducts.length)}</strong> টি পণ্য পাওয়া গেছে
            </span>
            <span className="italic">
              {isSupabaseConnected ? '* সুপাবেজ লাইভ ক্যাটালগ' : '* প্রদর্শিত সকল মূল্য এডিটেবল ডেমো মূল্য'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
