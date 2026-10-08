'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ totalCount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
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
      {/* Filter Quick Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        {['Brand', 'Price', 'Rating', 'Availability'].map((filterName) => (
          <div
            key={filterName}
            style={{
              padding: '0.4rem 0.85rem',
              backgroundColor: '#190F0C',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              fontSize: '0.725rem',
              letterSpacing: '0.06em',
              color: '#D8C7B2',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <span>{filterName}</span>
            <ChevronDown size={14} color="#7E6F67" />
          </div>
        ))}
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
