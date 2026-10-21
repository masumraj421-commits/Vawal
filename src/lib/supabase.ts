import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, ProductVariant } from '../types';

// Normalize Supabase URL (strip trailing slashes or /rest/v1 if included)
export function normalizeSupabaseUrl(rawUrl: string): string {
  let cleaned = (rawUrl || '').trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

// 1. Read environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Default fallbacks provided by project configuration
const defaultProjectUrl = 'https://fccgsculspbjkrsvlrlx.supabase.co';
const defaultPublishableKey = 'sb_publishable_nvdg1FpmJGk-B6qgqKnmDA_oxxmz7ai';

export const supabaseUrl: string = normalizeSupabaseUrl(
  (envUrl && envUrl.trim() !== '') ? envUrl : defaultProjectUrl
);

export const supabaseAnonKey: string = (envAnonKey && envAnonKey.trim() !== '')
  ? envAnonKey.trim()
  : defaultPublishableKey;

// 2. Initialize official Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Runtime dynamic credentials helper (allows shop owner to test / switch in UI)
export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const localUrl = localStorage.getItem('bhawal_supabase_url');
  const localKey = localStorage.getItem('bhawal_supabase_anon_key');

  const rawUrl = (envUrl && envUrl.trim() !== '') 
    ? envUrl.trim() 
    : (localUrl?.trim() || defaultProjectUrl);

  const url = normalizeSupabaseUrl(rawUrl);

  const anonKey = (envAnonKey && envAnonKey.trim() !== '') 
    ? envAnonKey.trim() 
    : (localKey?.trim() || defaultPublishableKey);

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10)
  };
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize dynamic Supabase client, falling back to default:', error);
    return supabase;
  }
}

export function saveRuntimeSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem('bhawal_supabase_url', normalizeSupabaseUrl(url));
  if (anonKey) localStorage.setItem('bhawal_supabase_anon_key', anonKey.trim());
  cachedClient = null; // force re-instantiation
}

export function clearRuntimeSupabaseCredentials() {
  localStorage.removeItem('bhawal_supabase_url');
  localStorage.removeItem('bhawal_supabase_anon_key');
  cachedClient = null;
}

export interface SupabaseCategoryRow {
  id: string;
  name_bn?: string;
  name?: string;
  name_en?: string;
  slug?: string;
  is_active?: boolean;
}

export interface SupabaseProductRow {
  id: string;
  name_bn?: string;
  name?: string;
  title?: string;
  name_en?: string;
  category?: string;
  category_id?: string;
  category_bn?: string;
  short_desc_bn?: string;
  short_description?: string;
  description_bn?: string;
  description?: string;
  benefits_bn?: string[] | null;
  benefits?: string[] | null;
  image?: string;
  image_url?: string;
  is_featured?: boolean;
  is_best_seller?: boolean;
  rating?: number;
  reviews_count?: number;
  stock?: number;
  stock_count?: number;
  origin_bn?: string;
  origin?: string;
  is_active?: boolean;
  price?: number;
}

export interface SupabaseVariantRow {
  id: string;
  product_id: string;
  weight?: string;
  weight_bn?: string;
  price: number;
  original_price?: number | null;
  in_stock?: boolean;
  stock_count?: number;
}

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  messageBn: string;
  details?: string;
  categoriesFound?: number;
  productsFound?: number;
}> {
  const client = getSupabaseClient();

  try {
    // 1. Test products table query
    const { data: prodData, error: prodError } = await client
      .from('products')
      .select('*')
      .limit(5);

    if (prodError) {
      return {
        success: false,
        messageBn: `products টেবিলে সংযোগ হয়নি: ${prodError.message}`,
        details: `${prodError.message} (Code: ${prodError.code || 'unknown'})`
      };
    }

    // 2. Test categories table query
    const { data: catData, error: catError } = await client
      .from('categories')
      .select('*')
      .limit(10);

    const prodCount = prodData?.length || 0;
    const catCount = catData?.length || 0;

    return {
      success: true,
      messageBn: `সুপাবেজ সংযোগ সফল! ${prodCount}টি পণ্য এবং ${catCount}টি ক্যাটাগরি পাওয়া গেছে।`,
      productsFound: prodCount,
      categoriesFound: catCount,
      details: catError ? `(ক্যাটাগরি রিড নোট: ${catError.message})` : undefined
    };
  } catch (err: any) {
    return {
      success: false,
      messageBn: 'সার্ভারে সংযোগ করতে সমস্যা হয়েছে। ইন্টারনেট ও সুপাবেজ প্রজেক্ট স্ট্যাটাস পরীক্ষা করুন।',
      details: err?.message || String(err)
    };
  }
}

/**
 * Fetch active products and their variants from Supabase
 * Enforces rule: Do not expose inactive products (is_active !== false)
 */
export async function fetchProductsFromSupabase(): Promise<{
  products: Product[];
  error: string | null;
}> {
  const client = getSupabaseClient();

  try {
    // Fetch products
    const { data: productsData, error: productsError } = await client
      .from('products')
      .select('*');

    if (productsError) {
      return { products: [], error: productsError.message };
    }

    // Fetch product variants
    const { data: variantsData, error: variantsError } = await client
      .from('product_variants')
      .select('*');

    if (variantsError) {
      console.warn('Variants fetch warning:', variantsError.message);
    }

    const variantsByProductId: Record<string, ProductVariant[]> = {};

    (variantsData || []).forEach((row: SupabaseVariantRow) => {
      if (row.in_stock === false) return;

      const v: ProductVariant = {
        id: String(row.id),
        weight: row.weight || '500g',
        weightBn: row.weight_bn || row.weight || '৫০০ গ্রাম',
        price: Number(row.price || 0),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        inStock: row.in_stock === undefined ? true : Boolean(row.in_stock)
      };

      if (!variantsByProductId[row.product_id]) {
        variantsByProductId[row.product_id] = [];
      }
      variantsByProductId[row.product_id].push(v);
    });

    // Transform Supabase rows to application Product interface
    const activeProducts: Product[] = (productsData || [])
      .filter((row: SupabaseProductRow) => row.is_active !== false)
      .map((row: SupabaseProductRow) => {
        const associatedVariants = variantsByProductId[row.id] || [];

        const fallbackPrice = Number(row.price || 450);
        const finalVariants: ProductVariant[] = associatedVariants.length > 0 
          ? associatedVariants 
          : [
              {
                id: `${row.id}-default`,
                weight: '500g',
                weightBn: '৫০০ গ্রাম',
                price: fallbackPrice,
                inStock: true
              }
            ];

        let parsedBenefits: string[] = [
          '১০০% প্রাকৃতিক ও খাঁটি উপাদানের নিশ্চয়তা',
          'স্বাস্থ্যসম্মত এয়ারটাইট ফুড-গ্রেড প্যাকেজিং'
        ];
        const rawBenefits = row.benefits_bn || row.benefits;
        if (Array.isArray(rawBenefits) && rawBenefits.length > 0) {
          parsedBenefits = rawBenefits;
        }

        const categoryVal = (row.category || row.category_id || 'nuts').toLowerCase() as any;
        const nameBnVal = row.name_bn || row.name || row.title || 'প্রাকৃতিক খাদ্য';
        const nameEnVal = row.name_en || row.name || nameBnVal;

        return {
          id: String(row.id),
          nameBn: nameBnVal,
          nameEn: nameEnVal,
          category: categoryVal,
          categoryBn: row.category_bn || 'প্রাকৃতিক পণ্য',
          shortDescBn: row.short_desc_bn || row.short_description || '১০০% প্রাকৃতিক উপাদান সমৃদ্ধ প্রিমিয়াম খাদ্য।',
          descriptionBn: row.description_bn || row.description || 'ভাওয়াল ফ্রেশ ফুডের বাছাইকৃত মানসম্মত পণ্য। কোনো ভেজাল বা প্রিজারভেটিভ ছাড়া সরাসরি সংগ্রহ।',
          benefitsBn: parsedBenefits,
          image: row.image_url || row.image || '',
          isFeatured: Boolean(row.is_featured),
          isBestSeller: Boolean(row.is_best_seller),
          rating: Number(row.rating || 5.0),
          reviewsCount: Number(row.reviews_count || 10),
          stock: Number(row.stock ?? row.stock_count ?? 30),
          originBn: row.origin_bn || row.origin || 'বাংলাদেশ',
          variants: finalVariants
        };
      });

    return { products: activeProducts, error: null };
  } catch (err: any) {
    return { products: [], error: err?.message || 'পণ্য লোড করতে ব্যর্থ হয়েছে' };
  }
}

/**
 * Fetch active categories from Supabase
 */
export async function fetchCategoriesFromSupabase(): Promise<{
  categories: { id: string; nameBn: string; nameEn: string; count: number }[];
  error: string | null;
}> {
  const client = getSupabaseClient();

  try {
    const { data, error } = await client
      .from('categories')
      .select('*');

    if (error) {
      return { categories: [], error: error.message };
    }

    const activeCategories = (data || [])
      .filter((row: SupabaseCategoryRow) => row.is_active !== false)
      .map((row: SupabaseCategoryRow) => ({
        id: String(row.id || row.slug),
        nameBn: row.name_bn || row.name || row.id,
        nameEn: row.name_en || row.name || row.id,
        count: 0
      }));

    return { categories: activeCategories, error: null };
  } catch (err: any) {
    return { categories: [], error: err?.message || 'ক্যাটাগরি লোড ব্যর্থ হয়েছে' };
  }
}

/**
 * Browser-side image compression using HTML5 Canvas.
 * Safely scales down camera or high-res photos to avoid exceeding localStorage limits
 * while maintaining crisp display quality.
 */
export function compressImageFile(file: File, maxWidth: number = 800, quality: number = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Insert new product and its variants into Supabase
 */
export async function insertProductToSupabase(product: Product): Promise<{
  success: boolean;
  insertedId?: string;
  error?: string;
}> {
  const client = getSupabaseClient();
  try {
    const productRow: any = {
      name_bn: product.nameBn,
      name_en: product.nameEn,
      category: product.category,
      category_bn: product.categoryBn,
      short_desc_bn: product.shortDescBn,
      description_bn: product.descriptionBn,
      image: product.image,
      stock: product.stock,
      rating: product.rating,
      origin_bn: product.originBn,
      is_active: true,
      price: product.variants[0]?.price || 0
    };

    const { data: insertedProduct, error: prodError } = await client
      .from('products')
      .insert([productRow])
      .select()
      .single();

    if (prodError) {
      return { success: false, error: prodError.message };
    }

    const newProdId = insertedProduct?.id || product.id;

    if (product.variants && product.variants.length > 0) {
      const variantRows = product.variants.map((v) => ({
        product_id: newProdId,
        weight: v.weight,
        weight_bn: v.weightBn,
        price: v.price,
        original_price: v.originalPrice || null,
        in_stock: v.inStock
      }));

      await client.from('product_variants').insert(variantRows);
    }

    return { success: true, insertedId: String(newProdId) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'সুপাবেজে সেভ করতে ত্রুটি' };
  }
}

/**
 * Update an existing product in Supabase
 */
export async function updateProductInSupabase(product: Product): Promise<{
  success: boolean;
  error?: string;
}> {
  const client = getSupabaseClient();
  try {
    const productRow: any = {
      name_bn: product.nameBn,
      name_en: product.nameEn,
      category: product.category,
      category_bn: product.categoryBn,
      short_desc_bn: product.shortDescBn,
      description_bn: product.descriptionBn,
      image: product.image,
      stock: product.stock,
      price: product.variants[0]?.price || 0
    };

    const { error: updateErr } = await client
      .from('products')
      .update(productRow)
      .eq('id', product.id);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'সুপাবেজে আপডেট করতে ত্রুটি' };
  }
}

