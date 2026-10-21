import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ShieldAlert, 
  KeyRound, 
  Terminal, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveRuntimeSupabaseCredentials, 
  clearRuntimeSupabaseCredentials,
  testSupabaseConnection 
} from '../lib/supabase';
import { useStore } from '../context/StoreContext';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const { reloadFromSupabase, showToast } = useStore();
  const currentCreds = getSupabaseCredentials();

  const [urlInput, setUrlInput] = useState(currentCreds.url);
  const [keyInput, setKeyInput] = useState(currentCreds.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    messageBn: string;
    productsFound?: number;
    categoriesFound?: number;
    details?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'connect' | 'sql' | 'security'>('connect');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      setTestResult({
        success: false,
        messageBn: 'অনুগ্রহ করে Project URL এবং Public Anon Key উভয় ফিল্ড পূরণ করুন।'
      });
      return;
    }

    // Save temporarily to test
    saveRuntimeSupabaseCredentials(urlInput.trim(), keyInput.trim());
    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection();
    setTesting(false);
    setTestResult(result);

    if (result.success) {
      showToast('সুপাবেজ সংযোগ সফল! লাইভ ডাটা লোড করা হচ্ছে...');
      await reloadFromSupabase();
    }
  };

  const handleClear = () => {
    clearRuntimeSupabaseCredentials();
    setUrlInput('');
    setKeyInput('');
    setTestResult(null);
    showToast('সুপাবেজ ক্রেডেনশিয়াল মুছে ডেমো মোডে ফেরত যাওয়া হয়েছে');
  };

  const envConfig = `# .env or environment variable configuration
# 1. Project URL from: Supabase Dashboard -> Project Settings -> API
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# 2. Public Anon Key from: Supabase Dashboard -> Project Settings -> API -> Project API Keys ("anon" "public")
# WARNING: NEVER USE "service_role" OR DATABASE PASSWORD!
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const sqlSchema = `-- ========================================================
-- Bhawal Fresh Food (ভাওয়াল ফ্রেশ ফুড)
-- Production PostgreSQL Tables & RLS Security
-- ========================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY, -- e.g. 'honey', 'nuts', 'dates', 'raisins', 'seeds'
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category TEXT NOT NULL, -- or category_id
    category_bn TEXT NOT NULL,
    short_desc_bn TEXT,
    description_bn TEXT,
    benefits_bn TEXT[],
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    stock INT DEFAULT 50,
    origin_bn TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Variants Table (Weights & Prices)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    weight TEXT NOT NULL, -- e.g. '250g', '500g', '1kg'
    weight_bn TEXT NOT NULL, -- '২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    in_stock BOOLEAN DEFAULT true,
    stock_count INT DEFAULT 50
);

-- 4. Orders Table (Protected: No public unrestricted read!)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. BFF-89412
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    district TEXT NOT NULL,
    upazila TEXT NOT NULL,
    full_address TEXT NOT NULL,
    delivery_notes TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL, -- 'cod' | 'online'
    payment_status TEXT DEFAULT 'unpaid',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id),
    product_name_bn TEXT NOT NULL,
    variant_weight_bn TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL,
    image_url TEXT
);

-- ========================================================
-- Row Level Security (RLS) - CRITICAL FOR PRODUCTION
-- ========================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Rule 1: Public can ONLY view ACTIVE products
CREATE POLICY "Public can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);

-- Rule 2: Public can ONLY view active variants
CREATE POLICY "Public can view in-stock variants" 
ON public.product_variants FOR SELECT 
USING (in_stock = true);

-- Rule 3: Public can view active categories
CREATE POLICY "Public can view active categories" 
ON public.categories FOR SELECT 
USING (is_active = true);

-- Rule 4: PROTECT ORDERS & ADDRESSES
-- Never allow open public SELECT * on orders!
CREATE POLICY "Admins only or authenticated user can view orders" 
ON public.orders FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid() IS NOT NULL);`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-2xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-[#E8E3D9] flex flex-col overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E3D9] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#14422D] flex items-center justify-center text-emerald-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#14422D]">
                সুপাবেজ (Supabase) ডেটাবেজ ইন্টিগ্রেশন
              </h3>
              <p className="text-xs text-[#7A6E5D]">
                অফিসিয়াল জাভাস্ক্রিপ্ট ক্লায়েন্ট (@supabase/supabase-js) দিয়ে রিয়েল ডাটা রিডিং
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F0EBE0] rounded-lg text-[#6B5E4F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[#E8E3D9] bg-white text-xs">
          <button
            onClick={() => setActiveTab('connect')}
            className={`pb-3 font-bold border-b-2 transition-colors ${
              activeTab === 'connect' ? 'border-[#14422D] text-[#14422D]' : 'border-transparent text-[#7A6E5D] hover:text-[#1F2937]'
            }`}
          >
            ১. লাইভ কানেকশন ও টেস্ট
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 font-bold border-b-2 transition-colors ${
              activeTab === 'sql' ? 'border-[#14422D] text-[#14422D]' : 'border-transparent text-[#7A6E5D] hover:text-[#1F2937]'
            }`}
          >
            ২. ডাটাবেজ স্কিমা (SQL)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 font-bold border-b-2 transition-colors ${
              activeTab === 'security' ? 'border-[#14422D] text-[#14422D]' : 'border-transparent text-[#7A6E5D] hover:text-[#1F2937]'
            }`}
          >
            ৩. সিকিউরিটি ও অর্ডার পলিসি
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#2E2820]">
          
          {/* TAB 1: CONNECT & TEST */}
          {activeTab === 'connect' && (
            <div className="space-y-5">
              {/* Security Warning Box */}
              <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl flex items-start gap-3 text-xs">
                <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-red-900">কঠোর নিরাপত্তা সতর্কতা (Strict Security Rule):</p>
                  <p className="text-red-800 leading-relaxed">
                    কখনোই আপনার <strong>Database Password</strong>, <strong>service_role secret key</strong> অথবা পেমেন্ট সিক্রেট ফ্রন্টএন্ড কোডে দেবেন না। কেবল Supabase এর <strong>Public Anon Key</strong> ব্যবহার করবেন যা ব্রাউজার ক্লায়েন্টের জন্য নিরাপদ।
                  </p>
                </div>
              </div>

              {/* Form Input fields for Supabase */}
              <div className="bg-white p-5 rounded-xl border border-[#E8E3D9] space-y-4">
                <h4 className="font-bold text-sm text-[#14422D]">
                  সুপাবেজ প্রজেক্ট ক্রেডেনশিয়াল প্রদান করুন:
                </h4>

                <div>
                  <label className="block text-xs font-bold text-[#2E2820] mb-1">
                    Supabase Project URL *
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#14422D]"
                  />
                  <span className="text-[10px] text-[#7A6E5D] mt-1 block">
                    কোথায় পাবেন: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2820] mb-1">
                    Supabase Public Anon Key (Publishable) *
                  </label>
                  <textarea
                    rows={2}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#14422D]"
                  />
                  <span className="text-[10px] text-[#7A6E5D] mt-1 block">
                    কোথায় পাবেন: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API Keys &gt; <strong>anon (public)</strong>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="bg-[#14422D] hover:bg-[#0E3020] disabled:bg-[#8CA89C] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    {testing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>কানেকশন টেস্ট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4 text-[#C59B27]" />
                        <span>সংযোগ পরীক্ষা ও ডাটা রিড করুন</span>
                      </>
                    )}
                  </button>

                  {currentCreds.isConfigured && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-xs text-red-600 hover:underline px-2 py-1"
                    >
                      ক্রেডেনশিয়াল মুছুন
                    </button>
                  )}
                </div>
              </div>

              {/* Test Result Message Box */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {testResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold">{testResult.messageBn}</p>
                      {testResult.productsFound !== undefined && (
                        <p className="text-emerald-800">
                          &bull; products টেবিলে পাওয়া গেছে: <strong>{testResult.productsFound}টি</strong> সক্রিয় পণ্য
                        </p>
                      )}
                      {testResult.categoriesFound !== undefined && (
                        <p className="text-emerald-800">
                          &bull; categories টেবিলে পাওয়া গেছে: <strong>{testResult.categoriesFound}টি</strong> ক্যাটাগরি
                        </p>
                      )}
                      {testResult.details && (
                        <p className="font-mono text-[11px] text-[#7A6E5D] mt-1">
                          {testResult.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Permanent Vite Env configuration box */}
              <div className="bg-white p-4 rounded-xl border border-[#E8E3D9] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#14422D] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>স্থায়ী কনফিগারেশন (.env ফাইলে যোগ করতে পারেন)</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(envConfig, 'env')}
                    className="text-[11px] bg-[#FAF8F5] hover:bg-[#EAE4D7] px-2.5 py-1 rounded border border-[#E8E3D9] flex items-center gap-1"
                  >
                    {copiedSection === 'env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'env' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>
                <div className="bg-[#1A1A1A] text-emerald-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{envConfig}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#14422D]">
                    আপনার Supabase SQL Editor-এ রান করার জন্য স্কিমা:
                  </h4>
                  <p className="text-xs text-[#7A6E5D]">
                    categories, products, product_variants, orders, order_items এবং RLS পলিসি
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(sqlSchema, 'sql')}
                  className="px-3 py-1.5 bg-[#14422D] hover:bg-[#0E3020] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'sql' ? 'কপি সম্পন্ন' : 'সম্পূর্ণ SQL কপি'}</span>
                </button>
              </div>

              <div className="bg-[#1A1A1A] text-slate-200 p-4 rounded-xl font-mono text-xs max-h-72 overflow-y-auto">
                <pre>{sqlSchema}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ORDERS */}
          {activeTab === 'security' && (
            <div className="bg-white p-5 rounded-xl border border-[#E8E3D9] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#14422D]">
                <Lock className="w-4 h-4 text-[#C59B27]" />
                <h4>অর্ডার ও গ্রাহকের তথ্য সুরক্ষার বাধ্যতামূলক নীতি</h4>
              </div>

              <div className="space-y-3 text-xs text-[#4A4237] leading-relaxed">
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E3D9]">
                  <strong className="text-[#14422D] block mb-0.5">১. পাবলিক রিড এক্সেস নিষেধাজ্ঞা:</strong>
                  <span>
                    কোনো সাধারণ ভিজিটর যেন অন্য কারো ফোন নম্বর, ঠিকানা বা অর্ডার তালিকা দেখতে না পারে, সেজন্য <code className="bg-[#EAE4D7] px-1 rounded">orders</code> টেবিলে সরাসরি ওপেন পাবলিক SELECT সম্পূর্ণ নিষিদ্ধ রাখা হয়েছে।
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E3D9]">
                  <strong className="text-[#14422D] block mb-0.5">২. নিষ্ক্রিয় পণ্য গোপন রাখা:</strong>
                  <span>
                    যেসব পণ্যের <code className="bg-[#EAE4D7] px-1 rounded">is_active = false</code>, RLS পলিসি ও কোড ফিল্টারের মাধ্যমে সেগুলো কোনো সাধারণ ক্রেতার কাছে প্রদর্শিত হবে না।
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E3D9]">
                  <strong className="text-[#14422D] block mb-0.5">৩. সার্ভার-সাইড অর্ডার ভ্যালিডেশন (Next Step):</strong>
                  <span>
                    প্রোডাকশনে সরাসরি ব্রাউজার থেকে মূল্যের টেবিল বা পেমেন্ট স্ট্যাটাস ওভাররাইট রোধে Supabase Edge Function বা Database RPC ব্যবহার করে মোট টাকা যাচাই করা হবে। ততক্ষণ পর্যন্ত ক্লায়েন্টে প্রদর্শিত অর্ডারটি সুরক্ষিত প্রোটোটাইপ হিসেবে সংরক্ষিত থাকবে।
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E3D9] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#14422D] hover:bg-[#0E3020] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
