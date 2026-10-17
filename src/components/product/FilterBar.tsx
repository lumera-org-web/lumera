'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface FilterBarProps {
  totalCount: number;
}

const DEFAULT_BRANDS = [
  { name: 'Lattafa', slug: 'lattafa' },
  { name: 'YSL Beauty', slug: 'ysl-beauty' },
  { name: 'Dior', slug: 'dior' },
  { name: 'Amouage', slug: 'amouage' },
  { name: 'Medicube', slug: 'medicube' },
  { name: 'Biodance', slug: 'biodance' },
  { name: 'Huda Beauty', slug: 'huda-beauty' },
  { name: 'The Ordinary', slug: 'the-ordinary' },
  { name: 'Beauty of Joseon', slug: 'beauty-of-joseon' },
];

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under 250 SAR', value: 'under-250', min: undefined, max: 250 },
  { label: '250 - 500 SAR', value: '250-500', min: 250, max: 500 },
  { label: '500 - 1,000 SAR', value: '500-1000', min: 500, max: 1000 },
  { label: 'Over 1,000 SAR', value: 'above-1000', min: 1000, max: undefined },
];

const RATING_OPTIONS = [
  { label: 'All Ratings', value: 'all' },
  { label: '4.5 & Above ★', value: '4.5' },
  { label: '4.0 & Above ★', value: '4.0' },
  { label: '3.5 & Above ★', value: '3.5' },
  { label: '3.0 & Above ★', value: '3.0' },
];

const AVAILABILITY_OPTIONS = [
  { label: 'All Items', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
];

type FilterType = 'Brand' | 'Price' | 'Rating' | 'Availability';

export const FilterBar: React.FC<FilterBarProps> = ({ totalCount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [openDropdown, setOpenDropdown] = useState<FilterType | null>(null);
  const [brands, setBrands] = useState<{ name: string; slug: string }[]>(DEFAULT_BRANDS);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get('sort') || 'featured';
  const currentBrand = searchParams.get('brand') || '';
  const currentPrice = searchParams.get('price') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentAvailability = searchParams.get('availability') || '';

  // Fetch dynamic brands from Supabase if available
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('brands')
          .select('name, slug')
          .order('name');
        if (!error && data && data.length > 0) {
          setBrands(data);
        }
      } catch {
        // Fallback to DEFAULT_BRANDS
      }
    };
    fetchBrands();
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectFilter = (type: FilterType, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === 'Brand') {
      if (!value || value === 'all') {
        params.delete('brand');
      } else {
        params.set('brand', value);
      }
    } else if (type === 'Price') {
      if (!value || value === 'all') {
        params.delete('price');
        params.delete('minPrice');
        params.delete('maxPrice');
      } else {
        params.set('price', value);
        const selectedRange = PRICE_RANGES.find((r) => r.value === value);
        if (selectedRange?.min !== undefined) {
          params.set('minPrice', selectedRange.min.toString());
        } else {
          params.delete('minPrice');
        }
        if (selectedRange?.max !== undefined) {
          params.set('maxPrice', selectedRange.max.toString());
        } else {
          params.delete('maxPrice');
        }
      }
    } else if (type === 'Rating') {
      if (!value || value === 'all') {
        params.delete('rating');
      } else {
        params.set('rating', value);
      }
    } else if (type === 'Availability') {
      if (!value || value === 'all') {
        params.delete('availability');
      } else {
        params.set('availability', value);
      }
    }

    setOpenDropdown(null);
    router.push(`${pathname}?${params.toString()}`);
  };

  const isFilterActive = (type: FilterType): boolean => {
    switch (type) {
      case 'Brand':
        return !!currentBrand;
      case 'Price':
        return !!currentPrice;
      case 'Rating':
        return !!currentRating;
      case 'Availability':
        return !!currentAvailability;
      default:
        return false;
    }
  };

  const getActiveLabel = (type: FilterType): string | null => {
    switch (type) {
      case 'Brand': {
        const found = brands.find((b) => b.slug === currentBrand);
        return found ? found.name : currentBrand || null;
      }
      case 'Price': {
        const found = PRICE_RANGES.find((p) => p.value === currentPrice);
        return found && found.value !== 'all' ? found.label : null;
      }
      case 'Rating': {
        return currentRating ? `${currentRating}★+` : null;
      }
      case 'Availability': {
        const found = AVAILABILITY_OPTIONS.find((a) => a.value === currentAvailability);
        return found && found.value !== 'all' ? found.label : null;
      }
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.25rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '2.5rem',
      }}
    >
      {/* Filter Quick Pills with Working Dropdowns */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        {(['Brand', 'Price', 'Rating', 'Availability'] as FilterType[]).map((filterName) => {
          const isOpen = openDropdown === filterName;
          const active = isFilterActive(filterName);
          const activeLabel = getActiveLabel(filterName);

          return (
            <div key={filterName} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setOpenDropdown(isOpen ? null : filterName)}
                aria-expanded={isOpen}
                style={{
                  padding: '0.4rem 0.85rem',
                  backgroundColor: active || isOpen ? '#221410' : '#190F0C',
                  border:
                    isOpen
                      ? '1px solid rgba(200, 162, 101, 0.6)'
                      : active
                      ? '1px solid rgba(200, 162, 101, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '2px',
                  fontSize: '0.725rem',
                  letterSpacing: '0.06em',
                  color: active || isOpen ? '#E8CCA4' : '#D8C7B2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
              >
                <span>{activeLabel ? `${filterName}: ${activeLabel}` : filterName}</span>
                <ChevronDown
                  size={14}
                  color={active || isOpen ? '#C8A265' : '#7E6F67'}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    zIndex: 50,
                    minWidth: '200px',
                    maxHeight: '270px',
                    overflowY: 'auto',
                    backgroundColor: '#160E0B',
                    border: '1px solid rgba(200, 162, 101, 0.28)',
                    borderRadius: '3px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(200, 162, 101, 0.15)',
                    padding: '0.35rem 0',
                  }}
                >
                  {filterName === 'Brand' && (
                    <>
                      <div
                        onClick={() => handleSelectFilter('Brand', 'all')}
                        style={{
                          padding: '0.55rem 0.9rem',
                          fontSize: '0.75rem',
                          color: !currentBrand ? '#E8CCA4' : '#A8978B',
                          backgroundColor: !currentBrand ? 'rgba(200, 162, 101, 0.12)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(200, 162, 101, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = !currentBrand ? 'rgba(200, 162, 101, 0.12)' : 'transparent';
                        }}
                      >
                        <span>All Brands</span>
                        {!currentBrand && <Check size={13} color="#C8A265" />}
                      </div>

                      {brands.map((b) => {
                        const isSelected = currentBrand === b.slug;
                        return (
                          <div
                            key={b.slug}
                            onClick={() => handleSelectFilter('Brand', b.slug)}
                            style={{
                              padding: '0.55rem 0.9rem',
                              fontSize: '0.75rem',
                              color: isSelected ? '#E8CCA4' : '#FAF7F2',
                              backgroundColor: isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(200, 162, 101, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent';
                            }}
                          >
                            <span>{b.name}</span>
                            {isSelected && <Check size={13} color="#C8A265" />}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {filterName === 'Price' &&
                    PRICE_RANGES.map((item) => {
                      const isSelected = (!currentPrice && item.value === 'all') || currentPrice === item.value;
                      return (
                        <div
                          key={item.value}
                          onClick={() => handleSelectFilter('Price', item.value)}
                          style={{
                            padding: '0.55rem 0.9rem',
                            fontSize: '0.75rem',
                            color: isSelected ? '#E8CCA4' : item.value === 'all' ? '#A8978B' : '#FAF7F2',
                            backgroundColor: isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(200, 162, 101, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent';
                          }}
                        >
                          <span>{item.label}</span>
                          {isSelected && <Check size={13} color="#C8A265" />}
                        </div>
                      );
                    })}

                  {filterName === 'Rating' &&
                    RATING_OPTIONS.map((item) => {
                      const isSelected = (!currentRating && item.value === 'all') || currentRating === item.value;
                      return (
                        <div
                          key={item.value}
                          onClick={() => handleSelectFilter('Rating', item.value)}
                          style={{
                            padding: '0.55rem 0.9rem',
                            fontSize: '0.75rem',
                            color: isSelected ? '#E8CCA4' : item.value === 'all' ? '#A8978B' : '#FAF7F2',
                            backgroundColor: isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(200, 162, 101, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent';
                          }}
                        >
                          <span>{item.label}</span>
                          {isSelected && <Check size={13} color="#C8A265" />}
                        </div>
                      );
                    })}

                  {filterName === 'Availability' &&
                    AVAILABILITY_OPTIONS.map((item) => {
                      const isSelected = (!currentAvailability && item.value === 'all') || currentAvailability === item.value;
                      return (
                        <div
                          key={item.value}
                          onClick={() => handleSelectFilter('Availability', item.value)}
                          style={{
                            padding: '0.55rem 0.9rem',
                            fontSize: '0.75rem',
                            color: isSelected ? '#E8CCA4' : item.value === 'all' ? '#A8978B' : '#FAF7F2',
                            backgroundColor: isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(200, 162, 101, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isSelected ? 'rgba(200, 162, 101, 0.12)' : 'transparent';
                          }}
                        >
                          <span>{item.label}</span>
                          {isSelected && <Check size={13} color="#C8A265" />}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sort By Dropdown & Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#9E8E85' }}>
          {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.725rem', color: '#9E8E85', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sort by:
          </span>
          <select
            value={currentSort}
            onChange={handleSortChange}
            style={{
              backgroundColor: '#190F0C',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FAF7F2',
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest Releases</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};
