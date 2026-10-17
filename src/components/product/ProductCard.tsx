'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getCloudinaryUrl } from '@/services/cloudinary';
import { useLocale } from '@/context/LocaleContext';

interface ProductCardProps {
  product: Product;
  variant?: 'dark' | 'light';
  layout?: 'vertical' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'dark',
  layout = 'vertical',
}) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { locale, t } = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isLight = variant === 'light';
  const isHorizontal = layout === 'horizontal';
  const isFavorited = isInWishlist(product.id);

  // Images
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const secondaryImage = product.images?.[1];

  const primaryUrl = primaryImage?.image_url
    ? getCloudinaryUrl(primaryImage.image_url, { width: 800, height: 1000, crop: 'limit' })
    : '';

  const secondaryUrl = secondaryImage?.image_url
    ? getCloudinaryUrl(secondaryImage.image_url, { width: 800, height: 1000, crop: 'limit' })
    : primaryUrl;

  // Badge logic
  let badgeText = '';
  let badgeClass = '';
  if (product.is_bestseller) {
    badgeText = 'BESTSELLER';
    badgeClass = 'badge-bestseller';
  } else if (product.is_trending) {
    badgeText = 'TRENDING';
    badgeClass = 'badge-trending';
  } else if (product.is_new) {
    badgeText = 'NEW';
    badgeClass = 'badge-new';
  } else if (product.compare_at_price && product.compare_at_price > product.price) {
    badgeText = 'SALE';
    badgeClass = 'badge-sale';
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: locale === 'ar' && product.name_ar ? product.name_ar : product.name,
      brandName: product.brand?.name || '',
      slug: product.slug,
      price: product.price,
      imageUrl: primaryUrl,
      size: product.variants?.[0]?.size || (product.category?.slug === 'fragrance' || product.category_id === 'c1000000-0000-0000-0000-000000000001' ? '100ml' : undefined),
      quantity: 1,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const displayName = locale === 'ar' && product.name_ar ? product.name_ar : product.name;

  const rootTheme = isLight
    ? 'bg-white border-[rgba(200,162,101,0.22)] hover:border-[rgba(200,162,101,0.55)] shadow-[0_2px_10px_rgba(36,22,17,0.04)] hover:shadow-[0_12px_28px_rgba(36,22,17,0.09)]'
    : 'bg-[#160E0B] border-white/[0.06] hover:border-[rgba(200,162,101,0.4)]';

  const glow = isLight
    ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(200,162,101,0.16)_0%,rgba(248,244,238,0.6)_60%,transparent_80%)]'
    : 'bg-[radial-gradient(circle_at_50%_50%,rgba(200,162,101,0.08)_0%,rgba(24,16,12,0.4)_60%,transparent_80%)]';

  const wishlistTheme = isFavorited
    ? 'bg-[#DEC197] text-[#0D0705]'
    : isLight
    ? 'bg-white/[0.92] text-[#140C09]'
    : 'bg-[rgba(20,12,9,0.65)] text-[#FAF7F2]';

  return (
    <div
      className={`relative flex overflow-hidden rounded-[3px] border transition-all duration-[280ms] ease-[ease] hover:-translate-y-0.5 ${
        isHorizontal ? 'flex-row' : 'flex-col'
      } ${rootTheme}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Area */}
      <Link
        href={`/product/${product.slug}`}
        className={`relative block shrink-0 overflow-hidden ${
          isHorizontal ? 'h-full min-h-[175px] w-[42%] pt-0' : 'h-auto w-full pt-[115%]'
        } ${isLight ? 'bg-[#F8F4EE]' : 'bg-[#18100C]'}`}
      >
        {/* Soft Ambient Radial Spotlight Glow */}
        <div className={`pointer-events-none absolute inset-0 ${glow}`} />

        {primaryUrl ? (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              isHorizontal ? 'p-[0.65rem]' : 'p-[0.85rem] md:p-[1.15rem]'
            }`}
          >
            <div
              className={`relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            >
              <Image
                src={isHovered && secondaryUrl ? secondaryUrl : primaryUrl}
                alt={displayName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A100C] p-4 text-center text-white/20">
            <div className="font-serif text-[1.25rem] text-gold-400 opacity-60">LUMÉRA</div>
            <div className="mt-1 text-[0.65rem] tracking-[0.1em]">HAUTE EDIT</div>
          </div>
        )}

        {/* Top Badge */}
        {badgeText && (
          <div className="absolute left-2 top-2 z-[2] md:left-3 md:top-3">
            <span className={`badge-lumera ${badgeClass}`}>{badgeText}</span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to wishlist"
          className={`absolute right-2 top-2 z-[3] flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-[4px] transition-all duration-200 ease-[ease] md:right-[0.65rem] md:top-[0.65rem] md:h-8 md:w-8 ${wishlistTheme} ${
            isLight ? 'border border-[rgba(200,162,101,0.3)] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : ''
          }`}
        >
          <Heart size={14} fill={isFavorited ? (isLight ? '#140C09' : '#0D0705') : 'none'} strokeWidth={1.75} />
        </button>

        {/* Desktop Quick Add Bar on Hover */}
        <div
          className={`absolute inset-x-0 bottom-0 z-[4] hidden p-[0.65rem] backdrop-blur-[8px] transition-transform duration-[250ms] ease-[ease] min-[860px]:block ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          } ${isLight ? 'bg-white/[0.92]' : 'bg-[rgba(20,12,9,0.85)]'}`}
        >
          <button
            onClick={handleQuickAdd}
            className={`flex w-full items-center justify-center gap-[0.4rem] rounded-[2px] p-[0.55rem] text-[0.65rem] font-bold uppercase tracking-[0.14em] transition-colors duration-200 ease-[ease] ${
              isLight ? 'bg-[#140C09] text-[#FAF7F2]' : 'bg-[#DEC197] text-[#0D0705]'
            }`}
          >
            {addedNotice ? (
              <>
                <Check size={14} /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> {t('product.addToBag')}
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div
        className={`flex flex-1 flex-col ${
          isHorizontal
            ? 'w-[58%] justify-center px-[0.95rem] py-3'
            : 'w-full justify-start p-[0.65rem_0.55rem_0.75rem_0.55rem] md:p-[0.9rem]'
        }`}
      >
        {/* Brand */}
        {product.brand && (
          <span
            className={`mb-[0.15rem] block text-[clamp(0.575rem,1.2vw,0.675rem)] font-semibold uppercase tracking-[0.12em] ${
              isLight ? 'text-[#A88143]' : 'text-[#DEC197]'
            }`}
          >
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className={`mb-1 line-clamp-2 font-medium leading-[1.35] ${
            isHorizontal
              ? 'min-h-0 text-[clamp(0.8rem,1.4vw,0.9rem)]'
              : 'min-h-[2.05rem] text-[clamp(0.75rem,1.5vw,0.85rem)]'
          } ${isLight ? 'text-[#140C09]' : 'text-white'}`}
        >
          {displayName}
        </Link>

        {/* Rating */}
        <div className="mb-[0.4rem] flex items-center gap-[0.3rem] text-[clamp(0.625rem,1.2vw,0.725rem)]">
          <span className={`font-semibold ${isLight ? 'text-[#D48806]' : 'text-[#F5A623]'}`}>
            ★ {product.rating || '4.9'}
          </span>
          <span
            className={`text-[clamp(0.575rem,1vw,0.675rem)] ${
              isLight ? 'text-[#8C7B72]' : 'text-[#8E7D74]'
            }`}
          >
            ({product.reviews_count || 124})
          </span>
        </div>

        {/* Price & Mobile Add */}
        <div
          className={`flex items-center justify-between pt-1 ${isHorizontal ? 'mt-[0.35rem]' : 'mt-auto'}`}
        >
          <div className="flex flex-wrap items-baseline gap-[0.4rem]">
            <span
              className={`text-[clamp(0.825rem,1.6vw,0.9rem)] font-semibold tracking-[0.02em] ${
                isLight ? 'text-[#140C09]' : 'text-white'
              }`}
            >
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-[clamp(0.675rem,1.2vw,0.75rem)] text-[#9E8E85] line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Mobile + Add Button */}
          <button
            onClick={handleQuickAdd}
            aria-label="Add to bag"
            className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[2px] border bg-[rgba(200,162,101,0.15)] min-[860px]:hidden ${
              isLight
                ? 'border-[rgba(200,162,101,0.35)] text-[#7E5F2B]'
                : 'border-[rgba(200,162,101,0.25)] text-[#DEC197]'
            }`}
          >
            {addedNotice ? <Check size={13} /> : <Plus size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
