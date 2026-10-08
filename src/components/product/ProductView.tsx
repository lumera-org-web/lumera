'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShieldCheck, Truck, Lock, Minus, Plus, Heart, ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getCloudinaryUrl } from '@/services/cloudinary';
import { useLocale } from '@/context/LocaleContext';

interface ProductViewProps {
  product: Product;
}

export const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { locale, t } = useLocale();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.variants?.[0]?.size || '100ml');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [addedNotice, setAddedNotice] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [];
  const activeImage = images[selectedImageIndex] || images[0];

  const activeImageUrl = activeImage?.image_url
    ? getCloudinaryUrl(activeImage.image_url, { width: 1000, height: 1200, crop: 'limit' })
    : '';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: locale === 'ar' && product.name_ar ? product.name_ar : product.name,
      brandName: product.brand?.name || '',
      slug: product.slug,
      price: product.price,
      imageUrl: activeImageUrl,
      size: selectedSize,
      quantity,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const displayName = locale === 'ar' && product.name_ar ? product.name_ar : product.name;
  const displayDesc =
    locale === 'ar' && product.description_ar ? product.description_ar : product.description;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem',
        alignItems: 'flex-start',
      }}
    >
      {/* LEFT: Product Gallery */}
      <div style={{ display: 'flex', gap: '1.25rem', flexDirection: 'row-reverse' }} className="gallery-container">
        {/* Main Display Image */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            aspectRatio: '4 / 5',
            backgroundColor: '#18100C',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Ambient Studio Lighting Glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(200, 162, 101, 0.1) 0%, rgba(24, 16, 12, 0.4) 50%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />

          {activeImageUrl ? (
            <div style={{ position: 'absolute', inset: 0, padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={activeImageUrl}
                  alt={displayName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'contain' }}
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
                color: 'rgba(255, 255, 255, 0.25)',
                backgroundColor: '#1A100C',
              }}
            >
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-gold-400)', opacity: 0.6 }}>
                LUMÉRA
              </div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', marginTop: '0.5rem' }}>
                HAUTE CURATION
              </div>
            </div>
          )}

          {/* Wishlist Button floating on image */}
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Save to wishlist"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isFavorited ? 'var(--color-gold-400)' : 'rgba(20, 12, 9, 0.7)',
              backdropFilter: 'blur(6px)',
              color: isFavorited ? '#0D0705' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Heart size={18} fill={isFavorited ? '#0D0705' : 'none'} strokeWidth={1.8} />
          </button>
        </div>

        {/* Vertical Thumbnails List */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              width: '74px',
              flexShrink: 0,
            }}
          >
            {images.map((img, idx) => {
              const thumbUrl = getCloudinaryUrl(img.image_url, { width: 200, height: 240, crop: 'limit' });
              const isSelected = idx === selectedImageIndex;
              return (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '4 / 5',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: isSelected ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: '#18100C',
                    opacity: isSelected ? 1 : 0.6,
                    transition: 'all 0.2s',
                    padding: '4px',
                  }}
                >
                  <Image src={thumbUrl} alt="" fill sizes="74px" style={{ objectFit: 'contain', padding: '4px' }} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT: Product Details & Controls */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        {product.brand && (
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-400)',
              marginBottom: '0.4rem',
            }}
          >
            {product.brand.name}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '0.75rem',
          }}
        >
          {displayName}
        </h1>

        {/* Star Rating & Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', color: 'var(--color-gold-400)', gap: '0.15rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} fill="currentColor" />
            ))}
          </div>
          <span style={{ fontSize: '0.775rem', color: '#9E8E85' }}>
            ({product.reviews_count || 124} reviews)
          </span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '0.02em' }}>
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span style={{ fontSize: '1rem', color: '#9E8E85', textDecoration: 'line-through' }}>
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Short Summary Description */}
        <p style={{ fontSize: '0.9rem', color: '#D8C7B2', lineHeight: 1.6, marginBottom: '2rem' }}>
          {product.short_description || displayDesc || 'A captivating luxury statement curated for unforgettable rituals.'}
        </p>

        {/* Size Selection */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.725rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9E8E85',
              marginBottom: '0.65rem',
            }}
          >
            {t('product.size')}
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['50ml', '100ml'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '2px',
                  fontSize: '0.775rem',
                  letterSpacing: '0.05em',
                  border: selectedSize === size ? '1px solid var(--color-gold-400)' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: selectedSize === size ? 'rgba(200, 162, 101, 0.1)' : 'transparent',
                  color: selectedSize === size ? 'var(--color-gold-400)' : '#FAF7F2',
                  transition: 'all 0.2s',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.725rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9E8E85',
              marginBottom: '0.65rem',
            }}
          >
            {t('product.quantity')}
          </label>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '2px',
              backgroundColor: '#190F0C',
            }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ padding: '0.5rem 0.85rem', color: '#D8C7B2' }}
            >
              <Minus size={14} />
            </button>
            <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{ padding: '0.5rem 0.85rem', color: '#D8C7B2' }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Action Buttons: Add to Bag & Buy Now */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
          <button
            onClick={handleAddToCart}
            className="btn-lumera-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '0.8rem', fontWeight: 700 }}
          >
            {addedNotice ? (
              <>
                <Check size={16} /> Added to Bag
              </>
            ) : (
              t('product.addToBag')
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="btn-lumera-outline"
            style={{ width: '100%', padding: '1rem', fontSize: '0.8rem', fontWeight: 600 }}
          >
            {t('product.buyNow')}
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            padding: '1.25rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '2.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={20} color="var(--color-gold-400)" />
            <span style={{ fontSize: '0.675rem', letterSpacing: '0.05em', color: '#D8C7B2' }}>
              {t('product.authenticBadge')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={20} color="var(--color-gold-400)" />
            <span style={{ fontSize: '0.675rem', letterSpacing: '0.05em', color: '#D8C7B2' }}>
              {t('product.fastSaudiDelivery')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={20} color="var(--color-gold-400)" />
            <span style={{ fontSize: '0.675rem', letterSpacing: '0.05em', color: '#D8C7B2' }}>
              {t('product.secureCheckout')}
            </span>
          </div>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Description */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => toggleAccordion('description')}
              style={{
                width: '100%',
                padding: '1rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FAF7F2',
                fontWeight: 600,
              }}
            >
              <span>Description</span>
              <ChevronDown
                size={16}
                style={{
                  transform: openAccordion === 'description' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            {openAccordion === 'description' && (
              <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: '#B5A59D', lineHeight: 1.6 }}>
                {displayDesc || 'Exquisite luxury formulation crafted with precision and authentic heritage.'}
              </div>
            )}
          </div>

          {/* Fragrance Notes */}
          {product.fragrance_notes && (
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => toggleAccordion('notes')}
                style={{
                  width: '100%',
                  padding: '1rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FAF7F2',
                  fontWeight: 600,
                }}
              >
                <span>Fragrance Notes</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'notes' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {openAccordion === 'notes' && (
                <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: '#B5A59D', lineHeight: 1.6 }}>
                  {typeof product.fragrance_notes === 'string'
                    ? product.fragrance_notes
                    : (
                      <div>
                        {product.fragrance_notes.top && <p><strong>Top:</strong> {product.fragrance_notes.top}</p>}
                        {product.fragrance_notes.middle && <p><strong>Heart:</strong> {product.fragrance_notes.middle}</p>}
                        {product.fragrance_notes.base && <p><strong>Base:</strong> {product.fragrance_notes.base}</p>}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* How To Use */}
          {product.how_to_use && (
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => toggleAccordion('how_to_use')}
                style={{
                  width: '100%',
                  padding: '1rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FAF7F2',
                  fontWeight: 600,
                }}
              >
                <span>How To Use</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'how_to_use' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {openAccordion === 'how_to_use' && (
                <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: '#B5A59D', lineHeight: 1.6 }}>
                  {product.how_to_use}
                </div>
              )}
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => toggleAccordion('ingredients')}
                style={{
                  width: '100%',
                  padding: '1rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#FAF7F2',
                  fontWeight: 600,
                }}
              >
                <span>Ingredients</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openAccordion === 'ingredients' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {openAccordion === 'ingredients' && (
                <div style={{ paddingBottom: '1.25rem', fontSize: '0.825rem', color: '#B5A59D', lineHeight: 1.6 }}>
                  {product.ingredients}
                </div>
              )}
            </div>
          )}

          {/* Delivery & Returns */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => toggleAccordion('delivery')}
              style={{
                width: '100%',
                padding: '1rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FAF7F2',
                fontWeight: 600,
              }}
            >
              <span>Delivery & Returns</span>
              <ChevronDown
                size={16}
                style={{
                  transform: openAccordion === 'delivery' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            {openAccordion === 'delivery' && (
              <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: '#B5A59D', lineHeight: 1.6 }}>
                {product.delivery_info ||
                  'Complimentary delivery across Saudi Arabia for orders above SAR 200. Express delivery within Jeddah in 24 hours. Enjoy hassle-free 14-day luxury returns.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
