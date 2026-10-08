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
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { locale, t } = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Images
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const secondaryImage = product.images?.[1];

  const primaryUrl = primaryImage?.image_url
    ? getCloudinaryUrl(primaryImage.image_url, { width: 600, height: 750, crop: 'fill' })
    : '';

  const secondaryUrl = secondaryImage?.image_url
    ? getCloudinaryUrl(secondaryImage.image_url, { width: 600, height: 750, crop: 'fill' })
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
      className="product-card-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#160E0B',
        borderRadius: '3px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
      }}
    >
      {/* Visual Image Area */}
      <Link
        href={`/product/${product.slug}`}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '120%', // 4:5 aspect ratio
          backgroundColor: '#1E120D',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        {primaryUrl ? (
          <Image
            src={isHovered && secondaryUrl ? secondaryUrl : primaryUrl}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
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
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
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
          style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            zIndex: 3,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: isFavorited ? 'var(--color-gold-400)' : 'rgba(20, 12, 9, 0.65)',
            backdropFilter: 'blur(4px)',
            color: isFavorited ? '#0D0705' : '#FAF7F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart size={15} fill={isFavorited ? '#0D0705' : 'none'} strokeWidth={1.75} />
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
            backgroundColor: 'rgba(20, 12, 9, 0.85)',
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
              backgroundColor: 'var(--color-gold-400)',
              color: '#0D0705',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              borderRadius: '2px',
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
        style={{
          padding: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Brand */}
        {product.brand && (
          <span
            style={{
              fontSize: '0.675rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-400)',
              marginBottom: '0.2rem',
            }}
          >
            {product.brand.name}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: '#FFFFFF',
            marginBottom: '0.35rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4rem',
          }}
        >
          {displayName}
        </Link>

        {/* Rating matching Reference Image 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', fontSize: '0.725rem' }}>
          <span style={{ color: '#F5A623', fontWeight: 600 }}>★ {product.rating || '4.9'}</span>
          <span style={{ color: '#8E7D74', fontSize: '0.675rem' }}>({product.reviews_count || 124} reviews)</span>
        </div>

        {/* Price & Mobile Add */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
              }}
            >
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#9E8E85',
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
              width: '28px',
              height: '28px',
              borderRadius: '2px',
              backgroundColor: 'rgba(200, 162, 101, 0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--color-gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-add-btn"
          >
            {addedNotice ? <Check size={14} /> : <Plus size={15} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card-root:hover {
          border-color: rgba(200, 162, 101, 0.4);
          transform: translateY(-2px);
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
