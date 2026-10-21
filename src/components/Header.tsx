import React, { useState } from 'react';
import { useStore, PageName } from '../context/StoreContext';
import { ShoppingBag, Search, Menu, X, ShieldCheck, PhoneCall, ChevronRight } from 'lucide-react';
import { toBengaliNumber } from '../data/mockData';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    activePage, 
    navigate, 
    setIsCartDrawerOpen, 
    searchQuery, 
    setSearchQuery,
    products,
    deliverySettings,
    storeSettings
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Search filtered items preview
  const searchResults = searchQuery.trim() === '' ? [] : products.filter(p => 
    p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryBn.includes(searchQuery)
  ).slice(0, 5);

  const handleNavClick = (page: PageName, params?: { categoryId?: string; productId?: string }) => {
    navigate(page, params);
    setMobileMenuOpen(false);
    setShowSearchModal(false);
  };

  return (
    <>
      {/* Store Closed Banner if paused */}
      {!storeSettings.isStoreOpen && (
        <div className="bg-amber-600 text-white text-xs py-2 px-4 text-center font-bold">
          ⚠️ {storeSettings.storeClosedNoticeBn || 'বর্তমানে আমাদের অর্ডার গ্রহণ সাময়িক বন্ধ আছে। বিস্তারিত জানতে কল করুন।'}
        </div>
      )}

      {/* Top micro bar for phone order & trust notice */}
      <div className="bg-[#14422D] text-[#E8F3EE] text-xs py-1.5 px-4 sm:px-8 border-b border-[#1D543C]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C59B27] font-semibold">১০০% প্রাকৃতিক খাদ্য</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="hidden md:inline">
              {storeSettings.isAnnouncementActive && storeSettings.announcementNoticeBn
                ? storeSettings.announcementNoticeBn
                : (deliverySettings.customNoticeBn || `ঢাকা ও গাজীপুরে ডেলিভারি ৳${toBengaliNumber(deliverySettings.insideDhakaFee)}`)}
            </span>
            {deliverySettings.enableFreeDelivery && (
              <span className="hidden sm:inline bg-[#205D42] text-[#C59B27] px-2 py-0.5 rounded text-[10px] font-bold">
                ৳{toBengaliNumber(deliverySettings.freeDeliveryThreshold)}+ অর্ডারে ফ্রি ডেলিভারি
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${storeSettings.phonePrimary.replace(/[^0-9]/g, '')}`} 
              className="flex items-center gap-1 hover:text-[#C59B27] transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C59B27]" />
              <span className="tabular-nums">{storeSettings.phonePrimary}</span>
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-xs transition-colors hover:text-[#C59B27] flex items-center gap-1 ${activePage === 'admin' ? 'text-[#C59B27] font-semibold' : 'text-emerald-100/80'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>শপ কন্ট্রোল অ্যাডমিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar strictly obeying the 3-zone contract */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E3D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#14422D] flex items-center justify-center text-[#FDFBF7] font-bold text-lg shadow-sm group-hover:bg-[#0E3020] transition-colors">
              ভা
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#14422D] leading-none">
                ভাওয়াল ফ্রেশ ফুড
              </span>
              <span className="text-[10px] tracking-wider text-[#7A6E5D] font-medium uppercase mt-0.5">
                Bhawal Fresh Food · খাঁটি খাদ্য সম্ভার
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#4A4237]">
            <button 
              onClick={() => handleNavClick('home')}
              className={`whitespace-nowrap transition-colors hover:text-[#14422D] pb-0.5 ${activePage === 'home' ? 'text-[#14422D] font-bold border-b-2 border-[#14422D]' : ''}`}
            >
              হোম
            </button>
            <button 
              onClick={() => handleNavClick('products')}
              className={`whitespace-nowrap transition-colors hover:text-[#14422D] pb-0.5 ${activePage === 'products' ? 'text-[#14422D] font-bold border-b-2 border-[#14422D]' : ''}`}
            >
              সকল পণ্য
            </button>
            <button 
              onClick={() => handleNavClick('category', { categoryId: 'honey' })}
              className={`whitespace-nowrap transition-colors hover:text-[#14422D] pb-0.5 ${activePage === 'category' ? 'text-[#14422D] font-bold border-b-2 border-[#14422D]' : ''}`}
            >
              ক্যাটাগরি
            </button>
            <button 
              onClick={() => handleNavClick('tracking')}
              className={`whitespace-nowrap transition-colors hover:text-[#14422D] pb-0.5 ${activePage === 'tracking' ? 'text-[#14422D] font-bold border-b-2 border-[#14422D]' : ''}`}
            >
              অর্ডার ট্র্যাকিং
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`whitespace-nowrap transition-colors hover:text-[#14422D] pb-0.5 ${activePage === 'about' ? 'text-[#14422D] font-bold border-b-2 border-[#14422D]' : ''}`}
            >
              আমাদের গল্প
            </button>
          </nav>

          {/* Zone 3: 1 primary action zone with search trigger & cart button */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-[#4A4237] hover:text-[#14422D] hover:bg-[#EAE4D7]/50 rounded-lg transition-colors flex items-center gap-1.5 text-sm"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 text-[#5A5043]" />
              <span className="hidden md:inline text-xs text-[#7A6E5D]">অনুসন্ধান</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-[#14422D] hover:bg-[#0E3020] text-white px-3.5 py-2 rounded-lg font-medium text-sm shadow-sm transition-all whitespace-nowrap"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
              <span className="hidden sm:inline">ব্যাগ</span>
              <span className="bg-[#C59B27] text-[#14422D] text-xs font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center tabular-nums">
                {toBengaliNumber(cartCount)}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden text-[#4A4237] hover:bg-[#EAE4D7]/50 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-[#E8E3D9] px-6 py-4 animate-in fade-in duration-150">
            <nav className="flex flex-col gap-3 font-medium text-base text-[#2E2820]">
              <button 
                onClick={() => handleNavClick('home')}
                className="text-left py-2 border-b border-[#F0ECE1] flex items-center justify-between"
              >
                <span>হোম</span>
                <ChevronRight className="w-4 h-4 text-[#8C8070]" />
              </button>
              <button 
                onClick={() => handleNavClick('products')}
                className="text-left py-2 border-b border-[#F0ECE1] flex items-center justify-between"
              >
                <span>সকল পণ্য</span>
                <ChevronRight className="w-4 h-4 text-[#8C8070]" />
              </button>
              <button 
                onClick={() => handleNavClick('category', { categoryId: 'honey' })}
                className="text-left py-2 border-b border-[#F0ECE1] flex items-center justify-between"
              >
                <span>ক্যাটাগরি সমূহ</span>
                <ChevronRight className="w-4 h-4 text-[#8C8070]" />
              </button>
              <button 
                onClick={() => handleNavClick('tracking')}
                className="text-left py-2 border-b border-[#F0ECE1] flex items-center justify-between"
              >
                <span>অর্ডার ট্র্যাকিং</span>
                <ChevronRight className="w-4 h-4 text-[#8C8070]" />
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className="text-left py-2 border-b border-[#F0ECE1] flex items-center justify-between"
              >
                <span>আমাদের সম্পর্কে</span>
                <ChevronRight className="w-4 h-4 text-[#8C8070]" />
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className="text-left py-2 border-b border-[#F0ECE1] flex items-center justify-between"
              >
                <span>যোগাযোগ ও সহায়তা</span>
                <ChevronRight className="w-4 h-4 text-[#8C8070]" />
              </button>
              <button 
                onClick={() => handleNavClick('admin')}
                className="text-left py-2 text-[#14422D] font-semibold flex items-center justify-between"
              >
                <span>অ্যাডমিন প্যানেল</span>
                <ShieldCheck className="w-4 h-4 text-[#14422D]" />
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Quick Search Overlay Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FAF8F5] rounded-xl max-w-xl w-full shadow-2xl border border-[#E8E3D9] overflow-hidden">
            <div className="p-4 border-b border-[#E8E3D9] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#8C8070]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মধু, কাজুবাদাম, কাঠবাদাম, খেজুর বা কিশমিশ খুঁজুন..."
                className="w-full bg-transparent outline-none text-[#1F2937] text-base placeholder-[#9C9181]"
                autoFocus
              />
              <button 
                onClick={() => { setShowSearchModal(false); setSearchQuery(''); }}
                className="p-1 hover:bg-[#EAE4D7] rounded text-[#5A5043]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-6 text-center text-sm text-[#7A6E5D]">
                  <p className="font-medium text-[#2E2820] mb-1">জনপ্রিয় অনুসন্ধান:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {['খলিশা মধু', 'কাজুবাদাম', 'মদিনার খেজুর', 'কাঠবাদাম', 'চিয়া সিড'].map(term => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-xs bg-[#EAE4D7] hover:bg-[#DFD8C9] text-[#2E2820] px-3 py-1 rounded transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#7A6E5D]">
                  <p>দুঃখিত, &quot;{searchQuery}&quot; দিয়ে কোনো পণ্য পাওয়া যায়নি।</p>
                </div>
              ) : (
                <div className="divide-y divide-[#EAE4D7]">
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleNavClick('product-details', { productId: p.id })}
                      className="w-full p-3 text-left hover:bg-[#EFEAE0] flex items-center gap-3 rounded-lg transition-colors group"
                    >
                      <img 
                        src={p.image} 
                        alt={p.nameBn} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded border border-[#E8E3D9]" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#14422D] truncate group-hover:underline">
                          {p.nameBn}
                        </p>
                        <p className="text-xs text-[#7A6E5D] truncate">
                          {p.categoryBn} · {p.originBn}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#14422D] tabular-nums shrink-0">
                        ৳{toBengaliNumber(p.variants[0].price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {searchQuery.trim() !== '' && searchResults.length > 0 && (
              <div className="p-3 bg-[#F2EDE2] border-t border-[#E8E3D9] text-center">
                <button
                  onClick={() => handleNavClick('products')}
                  className="text-xs font-semibold text-[#14422D] hover:underline"
                >
                  সকল ফলাফলে দেখুন &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
