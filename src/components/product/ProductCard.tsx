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

  return (
    <div
      className={`product-card-root ${isLight ? 'theme-light' : 'theme-dark'} ${
        isHorizontal ? 'layout-horizontal' : 'layout-vertical'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        backgroundColor: isLight ? '#FFFFFF' : '#160E0B',
        borderRadius: '3px',
        overflow: 'hidden',
        border: isLight
          ? isHovered
            ? '1px solid rgba(200, 162, 101, 0.55)'
            : '1px solid rgba(200, 162, 101, 0.22)'
          : isHovered
          ? '1px solid rgba(200, 162, 101, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: isLight
          ? isHovered
            ? '0 12px 28px rgba(36, 22, 17, 0.09)'
            : '0 2px 10px rgba(36, 22, 17, 0.04)'
          : 'none',
        transition: 'all 0.28s ease',
      }}
    >
      {/* Visual Image Area */}
      <Link
        href={`/product/${product.slug}`}
        style={{
          position: 'relative',
          width: isHorizontal ? '42%' : '100%',
          paddingTop: isHorizontal ? '0' : '115%', // Portrait proportion for vertical, auto for horizontal
          height: isHorizontal ? '100%' : 'auto',
          minHeight: isHorizontal ? '175px' : 'auto',
          flexShrink: 0,
          backgroundColor: isLight ? '#F8F4EE' : '#18100C',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        {/* Soft Ambient Radial Spotlight Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isLight
              ? 'radial-gradient(circle at 50% 50%, rgba(200, 162, 101, 0.16) 0%, rgba(248, 244, 238, 0.6) 60%, transparent 80%)'
              : 'radial-gradient(circle at 50% 50%, rgba(200, 162, 101, 0.08) 0%, rgba(24, 16, 12, 0.4) 60%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />

        {primaryUrl ? (
          <div className="product-image-frame">
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <Image
                src={isHovered && secondaryUrl ? secondaryUrl : primaryUrl}
                alt={displayName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.2)',
              backgroundColor: '#1A100C',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-gold-400)', opacity: 0.6 }}>
              LUMÉRA
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
              HAUTE EDIT
            </div>
          </div>
        )}

        {/* Top Badge */}
        {badgeText && (
          <div
            className="product-badge-wrap"
            style={{
              position: 'absolute',
              zIndex: 2,
            }}
          >
            <span className={`badge-lumera ${badgeClass}`}>{badgeText}</span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Save to wishlist"
          className="product-wishlist-btn"
          style={{
            position: 'absolute',
            zIndex: 3,
            borderRadius: '50%',
            backgroundColor: isFavorited
              ? 'var(--color-gold-400)'
              : isLight
              ? 'rgba(255, 255, 255, 0.92)'
              : 'rgba(20, 12, 9, 0.65)',
            border: isLight ? '1px solid rgba(200, 162, 101, 0.3)' : 'none',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            backdropFilter: 'blur(4px)',
            color: isFavorited ? '#0D0705' : isLight ? '#140C09' : '#FAF7F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart size={14} fill={isFavorited ? (isLight ? '#140C09' : '#0D0705') : 'none'} strokeWidth={1.75} />
        </button>

        {/* Desktop Quick Add Bar on Hover */}
        <div
          className="desktop-quick-add"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0.65rem',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(20, 12, 9, 0.85)',
            backdropFilter: 'blur(8px)',
            transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.25s ease',
            zIndex: 4,
            display: 'none',
          }}
        >
          <button
            onClick={handleQuickAdd}
            style={{
              width: '100%',
              padding: '0.55rem',
              backgroundColor: isLight ? '#140C09' : 'var(--color-gold-400)',
              color: isLight ? '#FAF7F2' : '#0D0705',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              borderRadius: '2px',
              transition: 'background-color 0.2s ease',
            }}
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
        className="product-card-body"
        style={{
          width: isHorizontal ? '58%' : '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isHorizontal ? 'center' : 'flex-start',
        }}
      >
        {/* Brand */}
        {product.brand && (
          <span
            style={{
              fontSize: 'clamp(0.575rem, 1.2vw, 0.675rem)',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: isLight ? 'var(--color-gold-600)' : 'var(--color-gold-400)',
              marginBottom: '0.15rem',
              display: 'block',
            }}
          >
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          style={{
            fontSize: isHorizontal ? 'clamp(0.8rem, 1.4vw, 0.9rem)' : 'clamp(0.75rem, 1.5vw, 0.85rem)',
            fontWeight: 500,
            lineHeight: 1.35,
            color: isLight ? '#140C09' : '#FFFFFF',
            marginBottom: '0.25rem',
            display: '-webkit-box',
            WebkitLineClamp: isHorizontal ? 2 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: isHorizontal ? 'auto' : '2.05rem',
          }}
        >
          {displayName}
        </Link>

        {/* Rating */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            marginBottom: '0.4rem',
            fontSize: 'clamp(0.625rem, 1.2vw, 0.725rem)',
          }}
        >
          <span style={{ color: isLight ? '#D48806' : '#F5A623', fontWeight: 600 }}>★ {product.rating || '4.9'}</span>
          <span style={{ color: isLight ? '#8C7B72' : '#8E7D74', fontSize: 'clamp(0.575rem, 1vw, 0.675rem)' }}>
            ({product.reviews_count || 124})
          </span>
        </div>

        {/* Price & Mobile Add */}
        <div
          style={{
            marginTop: isHorizontal ? '0.35rem' : 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 'clamp(0.825rem, 1.6vw, 0.9rem)',
                fontWeight: 600,
                color: isLight ? '#140C09' : '#FFFFFF',
                letterSpacing: '0.02em',
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span
                style={{
                  fontSize: 'clamp(0.675rem, 1.2vw, 0.75rem)',
                  color: isLight ? '#9E8E85' : '#9E8E85',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Mobile + Add Button */}
          <button
            onClick={handleQuickAdd}
            aria-label="Add to bag"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '2px',
              backgroundColor: isLight ? 'rgba(200, 162, 101, 0.15)' : 'rgba(200, 162, 101, 0.15)',
              border: isLight ? '1px solid rgba(200, 162, 101, 0.35)' : '1px solid var(--border-gold)',
              color: isLight ? 'var(--color-gold-700)' : 'var(--color-gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            className="mobile-add-btn"
          >
            {addedNotice ? <Check size={13} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card-root:hover {
          border-color: rgba(200, 162, 101, 0.4);
          transform: translateY(-2px);
        }
        .product-image-frame {
          position: absolute;
          inset: 0;
          padding: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-badge-wrap {
          top: 0.5rem;
          left: 0.5rem;
        }
        .product-wishlist-btn {
          top: 0.5rem;
          right: 0.5rem;
          width: 28px;
          height: 28px;
        }
        .product-card-body {
          padding: 0.65rem 0.55rem 0.75rem 0.55rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        @media (min-width: 768px) {
          .product-image-frame {
            padding: 1.15rem;
          }
          .product-badge-wrap {
            top: 0.75rem;
            left: 0.75rem;
          }
          .product-wishlist-btn {
            top: 0.65rem;
            right: 0.65rem;
            width: 32px;
            height: 32px;
          }
          .product-card-body {
            padding: 0.9rem;
          }
        }
        .layout-horizontal .product-image-frame {
          padding: 0.65rem;
        }
        .layout-horizontal .product-card-body {
          padding: 0.75rem 0.95rem;
        }
        @media (min-width: 860px) {
          .desktop-quick-add {
            display: block !important;
          }
          .mobile-add-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
