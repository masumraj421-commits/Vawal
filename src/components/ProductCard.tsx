import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { toBengaliNumber } from '../data/mockData';
import { ShoppingBag, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, navigate } = useStore();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');
  const [imgError, setImgError] = useState(false);

  const currentVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariantId, 1);
  };

  const handleCardClick = () => {
    navigate('product-details', { productId: product.id });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-[#E8E3D9] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.nameBn}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EFE9DC] text-[#7A6E5D] p-4 text-center">
            <span className="text-2xl mb-1">🍯</span>
            <span className="text-xs font-medium">{product.nameBn}</span>
          </div>
        )}

        {/* Quiet Trust Tag (Anti-pill: simple text badge on image corner) */}
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 bg-[#14422D]/90 text-[#FDFBF7] text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
            জনপ্রিয় পণ্য
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 pointer-events-none">
          <span className="bg-white/95 text-[#14422D] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>বিস্তারিত দেখুন</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Origin (Unboxed clean text with · separator) */}
          <div className="flex items-center gap-1.5 text-xs text-[#7A6E5D] mb-1.5">
            <span>{product.categoryBn}</span>
            <span aria-hidden="true">·</span>
            <span>{product.originBn}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-[15px] font-semibold text-[#1F2937] group-hover:text-[#14422D] transition-colors leading-snug line-clamp-2 mb-2">
            {product.nameBn}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-[#7A6E5D] mb-3">
            <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
            <span className="font-semibold text-[#2E2820] tabular-nums">{toBengaliNumber(product.rating)}</span>
            <span>({toBengaliNumber(product.reviewsCount)} রিভিউ)</span>
          </div>

          {/* Variant Selector Tabs */}
          {product.variants.length > 1 && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center gap-1 p-1 bg-[#F5F1E8] rounded-lg mb-3"
            >
              {product.variants.map(variant => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`flex-1 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
                    selectedVariantId === variant.id
                      ? 'bg-white text-[#14422D] shadow-xs font-semibold'
                      : 'text-[#6B5E4F] hover:text-[#14422D]'
                  }`}
                >
                  {variant.weightBn}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#F0EBE0] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#14422D] tabular-nums">
                ৳{toBengaliNumber(currentVariant.price)}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-xs text-[#9C9181] line-through tabular-nums">
                  ৳{toBengaliNumber(currentVariant.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#9C9181] block">
              {currentVariant.weightBn} · ডেমো মূল্য
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-[#14422D] hover:bg-[#0E3020] text-white p-2.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
            title="ব্যাগে যোগ করুন"
          >
            <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
            <span className="hidden sm:inline">ব্যাগে নিন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
