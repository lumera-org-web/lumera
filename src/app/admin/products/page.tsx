'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Upload, Trash2, Edit2, Sparkles, RefreshCw, X, Check, Search, Filter, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Product, Category, Brand } from '@/types';
import { formatPrice } from '@/utils/formatters';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('25');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [notesTop, setNotesTop] = useState('');
  const [notesMiddle, setNotesMiddle] = useState('');
  const [notesBase, setNotesBase] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Uploaded Cloudinary Image or Direct URL
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const [prodRes, catRes, brandRes] = await Promise.all([
        supabase
          .from('products')
          .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
      ]);

      if (prodRes.data) setProducts(prodRes.data as Product[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
      if (brandRes.data) setBrands(brandRes.data as Brand[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setNameAr('');
    setSlug('');
    setBrandId(brands[0]?.id || '');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setComparePrice('');
    setSku(`LUM-${Math.floor(1000 + Math.random() * 9000)}`);
    setStock('35');
    setShortDesc('');
    setDescription('');
    setNotesTop('');
    setNotesMiddle('');
    setNotesBase('');
    setIsTrending(false);
    setIsBestseller(false);
    setIsNew(true);
    setIsFeatured(false);
    setUploadedImageUrl('');
    setCloudinaryPublicId('');
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setNameAr(p.name_ar || '');
    setSlug(p.slug);
    setBrandId(p.brand_id || '');
    setCategoryId(p.category_id || '');
    setPrice(p.price.toString());
    setComparePrice(p.compare_at_price ? p.compare_at_price.toString() : '');
    setSku(p.sku || '');
    setStock(p.stock.toString());
    setShortDesc(p.short_description || '');
    setDescription(p.description || '');

    const notes = p.fragrance_notes;
    if (notes && typeof notes === 'object') {
      setNotesTop((notes as any).top || '');
      setNotesMiddle((notes as any).middle || '');
      setNotesBase((notes as any).base || '');
    } else {
      setNotesTop('');
      setNotesMiddle('');
      setNotesBase('');
    }

    setIsTrending(p.is_trending);
    setIsBestseller(p.is_bestseller);
    setIsNew(p.is_new);
    setIsFeatured(p.is_featured);

    const firstImg = p.images?.[0];
    setUploadedImageUrl(firstImg?.image_url || '');
    setCloudinaryPublicId(firstImg?.cloudinary_public_id || '');
    setShowModal(true);
  };

  // 1-Click Preset Templates
  const applyPreset = (preset: 'perfume' | 'skincare' | 'makeup') => {
    if (preset === 'perfume') {
      setName('Amber Imperial Eau de Parfum');
      setNameAr('عنبر إمبريال أو دو بارفان');
      setSlug(`amber-imperial-edp-${Date.now().toString().slice(-4)}`);
      const fragranceCat = categories.find((c) => c.slug === 'fragrance') || categories[0];
      if (fragranceCat) setCategoryId(fragranceCat.id);
      setPrice('320.00');
      setComparePrice('380.00');
      setStock('45');
      setIsBestseller(true);
      setIsTrending(true);
      setNotesTop('Pink Pepper, Cardamom, Bergamot');
      setNotesMiddle('Ambergris, Taif Rose, Smoky Vanilla');
      setNotesBase('Cambodian Oud, Atlas Cedar, Musk');
      setShortDesc('A transcendent royal Arabian amber composition crafted for unforgettable Jeddah evenings.');
      setDescription('Amber Imperial unfolds with precious resins and sun-warmed spices before settling into a warm, lingering sillage.');
      setUploadedImageUrl('');
    } else if (preset === 'skincare') {
      setName('Peptide Cellular Renewal Serum');
      setNameAr('سيروم الببتيد لتجديد خلايا البشرة');
      setSlug(`peptide-renewal-serum-${Date.now().toString().slice(-4)}`);
      const skinCat = categories.find((c) => c.slug === 'skincare') || categories[0];
      if (skinCat) setCategoryId(skinCat.id);
      setPrice('165.00');
      setComparePrice('195.00');
      setStock('60');
      setIsNew(true);
      setIsTrending(true);
      setNotesTop('');
      setNotesMiddle('');
      setNotesBase('');
      setShortDesc('Clinically formulated multi-peptide booster targeting skin firmness, elasticity, and luminous hydration.');
      setDescription('Infused with 5 bio-active peptides, copper tripeptide, and fermented bifida filtrate to restore barrier resilience under desert climate.');
      setUploadedImageUrl('');
    } else if (preset === 'makeup') {
      setName('Velvet Satin Couture Lipstick');
      setNameAr('أحمر شفاه كوتور ساتان مخملي');
      setSlug(`velvet-satin-lipstick-${Date.now().toString().slice(-4)}`);
      const makeCat = categories.find((c) => c.slug === 'makeup') || categories[0];
      if (makeCat) setCategoryId(makeCat.id);
      setPrice('145.00');
      setComparePrice('170.00');
      setStock('50');
      setIsTrending(true);
      setNotesTop('');
      setNotesMiddle('');
      setNotesBase('');
      setShortDesc('Ultra-pigmented, featherweight satin lipstick drenched in nourishing jojoba and argan oils.');
      setDescription('Delivers rich couture color in a single glide with comfortable all-day wear that never dries out lips.');
      setUploadedImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setUploadedImageUrl(data.secure_url);
      setCloudinaryPublicId(data.public_id);
    } catch (err: any) {
      alert(`Cloudinary Upload Error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !slug) {
      alert('Please fill Name, Slug, and Price.');
      return;
    }

    try {
      const supabase = createClient();

      const productPayload: any = {
        name,
        name_ar: nameAr || null,
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        brand_id: brandId || null,
        category_id: categoryId || null,
        price: parseFloat(price),
        compare_at_price: comparePrice ? parseFloat(comparePrice) : null,
        sku: sku || `LUM-${Date.now().toString().slice(-4)}`,
        stock: parseInt(stock, 10) || 0,
        short_description: shortDesc,
        description,
        is_trending: isTrending,
        is_bestseller: isBestseller,
        is_new: isNew,
        is_featured: isFeatured,
        is_active: true,
        fragrance_notes: {
          top: notesTop,
          middle: notesMiddle,
          base: notesBase,
        },
      };

      let targetId = editingId;

      if (editingId) {
        // UPDATE existing product
        const { error: updateErr } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingId);

        if (updateErr) throw updateErr;
      } else {
        // CREATE new product
        const { data: newProd, error: prodErr } = await supabase
          .from('products')
          .insert(productPayload)
          .select()
          .single();

        if (prodErr) throw prodErr;
        targetId = newProd?.id;
      }

      // Save/Update image if present
      if (uploadedImageUrl && targetId) {
        const { data: existingImgs } = await supabase
          .from('product_images')
          .select('id')
          .eq('product_id', targetId);

        if (existingImgs && existingImgs.length > 0) {
          await supabase
            .from('product_images')
            .update({
              image_url: uploadedImageUrl,
              cloudinary_public_id: cloudinaryPublicId || null,
            })
            .eq('id', existingImgs[0].id);
        } else {
          await supabase.from('product_images').insert({
            product_id: targetId,
            image_url: uploadedImageUrl,
            cloudinary_public_id: cloudinaryPublicId || null,
            is_primary: true,
            display_order: 1,
          });
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      const supabase = createClient();
      await supabase.from('products').delete().eq('id', id);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePopulateDefaultProducts = async () => {
    if (!confirm('Populate all 9 reference products (Lattafa Khamrah, YSL Libre, Dior, Amouage, Medicube, etc.) into Supabase?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.name_ar && p.name_ar.includes(searchQuery)) ||
        (p.brand?.name && p.brand.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategoryFilter === 'all' ||
        p.category_id === selectedCategoryFilter ||
        p.category?.slug === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Product Catalog Management
          </h1>
          <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            {products.length} Products in catalog. Click &quot;Edit&quot; on any item to update SAR price, stock, notes, or image.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handlePopulateDefaultProducts}
            disabled={seeding}
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'rgba(200, 162, 101, 0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--color-gold-400)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {seeding ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>1-Click Load Reference Products</span>
          </button>

          <button onClick={openNewModal} className="btn-lumera-primary">
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(62, 237, 139, 0.12)', border: '1px solid #3EED8B', color: '#B4F8D3', borderRadius: '3px', marginBottom: '2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Check size={18} />
          <span>Product updated successfully! The storefront UI has updated immediately.</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#9E8E85" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products by title, Arabic name, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.6rem',
              backgroundColor: '#160E0B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              borderRadius: '2px',
              fontSize: '0.85rem',
            }}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#160E0B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              borderRadius: '2px',
              fontSize: '0.85rem',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9E8E85' }}>
          Loading catalog from Supabase...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#190F0C',
            borderRadius: '3px',
            border: '1px dashed rgba(200, 162, 101, 0.2)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem', fontWeight: 600 }}>
            No Products Found
          </div>
          <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            {products.length === 0
              ? 'Click "1-Click Load Reference Products" to populate all 9 reference beauty items with pictures and details!'
              : 'No items match your search or category filter.'}
          </p>
          {products.length === 0 && (
            <button onClick={handlePopulateDefaultProducts} className="btn-lumera-primary">
              <Sparkles size={15} /> Populate Reference Products Now
            </button>
          )}
        </div>
      ) : (
        <div style={{ backgroundColor: '#190F0C', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#9E8E85', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Product</th>
                <th style={{ padding: '1rem 1rem' }}>Category</th>
                <th style={{ padding: '1rem 1rem' }}>Price (SAR)</th>
                <th style={{ padding: '1rem 1rem' }}>Stock</th>
                <th style={{ padding: '1rem 1rem' }}>Badges</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const img = p.images?.[0]?.image_url;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '52px', height: '65px', backgroundColor: '#221510', borderRadius: '2px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          {img ? (
                            <Image src={img} alt="" fill sizes="52px" style={{ objectFit: 'cover' }} />
                          ) : (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--color-gold-400)', textAlign: 'center' }}>
                              LUMÉRA
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{p.name}</div>
                          {p.name_ar && <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', direction: 'rtl', textAlign: 'left' }}>{p.name_ar}</div>}
                          {p.brand && <div style={{ fontSize: '0.7rem', color: '#9E8E85', marginTop: '0.15rem' }}>{p.brand.name}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1rem', color: '#D8C7B2' }}>{p.category?.name || '—'}</td>
                    <td style={{ padding: '1rem 1rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {formatPrice(p.price)}
                      {p.compare_at_price && (
                        <div style={{ fontSize: '0.7rem', color: '#9E8E85', textDecoration: 'line-through' }}>
                          {formatPrice(p.compare_at_price)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1rem', color: p.stock > 0 ? '#3EED8B' : '#E05A47' }}>{p.stock} units</td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {p.is_trending && <span className="badge-lumera badge-trending">TRENDING</span>}
                        {p.is_bestseller && <span className="badge-lumera badge-bestseller">BESTSELLER</span>}
                        {p.is_new && <span className="badge-lumera badge-new">NEW</span>}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.65rem' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            backgroundColor: 'var(--color-gold-400)',
                            color: 'var(--color-espresso-950)',
                            border: 'none',
                            borderRadius: '2px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            cursor: 'pointer',
                          }}
                          title="Edit Product"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ color: '#E05A47', padding: '0.45rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#140C09', border: '1px solid var(--border-gold)', borderRadius: '3px', width: '100%', maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p style={{ color: '#9E8E85', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  Changes will be instantly reflected on the LUMÉRA storefront.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ color: '#9E8E85', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Quick Presets if creating new */}
            {!editingId && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#1C100C', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  ⚡ 1-Click Pre-fill Template (Only edit what you want):
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => applyPreset('perfume')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#281711', color: '#FAF7F2', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    Luxury Perfume Preset
                  </button>
                  <button type="button" onClick={() => applyPreset('skincare')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#281711', color: '#FAF7F2', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    Skincare Serum Preset
                  </button>
                  <button type="button" onClick={() => applyPreset('makeup')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#281711', color: '#FAF7F2', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    Couture Lipstick Preset
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Image Upload or URL */}
              <div style={{ padding: '1.25rem', backgroundColor: '#1A0F0B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gold-400)', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Product Photo (Cloudinary or Direct URL)
                </label>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {uploadedImageUrl ? (
                    <div style={{ position: 'relative', width: '80px', height: '100px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-gold)' }}>
                      <Image src={uploadedImageUrl} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '80px', height: '100px', borderRadius: '2px', border: '1px dashed rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A554A', fontSize: '0.7rem' }}>
                      No photo
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(200, 162, 101, 0.15)', border: '1px solid var(--border-gold)', color: 'var(--color-gold-400)', fontSize: '0.75rem', fontWeight: 700, borderRadius: '2px', cursor: 'pointer' }}>
                        <Upload size={13} />
                        <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image to Cloudinary'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste direct image URL (https://...)"
                      value={uploadedImageUrl}
                      onChange={(e) => setUploadedImageUrl(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', backgroundColor: '#140C09', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Title & Arabic Title */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Name (English) *</label>
                  <input required type="text" placeholder="e.g. Khamrah Eau de Parfum" value={name} onChange={(e) => { setName(e.target.value); if (!editingId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Name (Arabic / بالعربية)</label>
                  <input type="text" placeholder="e.g. خمرة أو دو بارفان" value={nameAr} onChange={(e) => setNameAr(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', textAlign: 'right', fontSize: '0.85rem' }} />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Product Slug (URL) *</label>
                <input required type="text" placeholder="lattafa-khamrah-edp" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
              </div>

              {/* Category & Brand */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}>
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Brand</label>
                  <select value={brandId} onChange={(e) => setBrandId(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}>
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Compare Price & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Price (SAR) *</label>
                  <input required type="number" step="0.01" placeholder="219" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Compare Price (SAR)</label>
                  <input type="number" step="0.01" placeholder="260" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Stock Quantity</label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
                </div>
              </div>

              {/* Badges Toggle */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem', backgroundColor: '#190F0C', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} style={{ accentColor: 'var(--color-gold-400)' }} />
                  <span>Trending Now</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} style={{ accentColor: 'var(--color-gold-400)' }} />
                  <span>Bestseller</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} style={{ accentColor: 'var(--color-gold-400)' }} />
                  <span>New Arrival</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ accentColor: 'var(--color-gold-400)' }} />
                  <span>Featured</span>
                </label>
              </div>

              {/* Fragrance Notes */}
              <div style={{ padding: '1rem', backgroundColor: '#190F0C', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Fragrance Notes (Top, Heart, Base)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <input type="text" placeholder="Top: Cinnamon, Nutmeg" value={notesTop} onChange={(e) => setNotesTop(e.target.value)} style={{ padding: '0.6rem', backgroundColor: '#130A08', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.8rem', borderRadius: '2px' }} />
                  <input type="text" placeholder="Heart: Dates, Praline" value={notesMiddle} onChange={(e) => setNotesMiddle(e.target.value)} style={{ padding: '0.6rem', backgroundColor: '#130A08', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.8rem', borderRadius: '2px' }} />
                  <input type="text" placeholder="Base: Vanilla, Amber" value={notesBase} onChange={(e) => setNotesBase(e.target.value)} style={{ padding: '0.6rem', backgroundColor: '#130A08', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.8rem', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Short Summary Highlight</label>
                <input type="text" placeholder="One sentence highlight..." value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Full Description</label>
                <textarea rows={3} placeholder="Full product details..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.85rem 1.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#FAF7F2', fontSize: '0.8rem', borderRadius: '2px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lumera-primary" style={{ padding: '0.85rem 2rem' }}>
                  <Check size={16} />
                  <span>{editingId ? 'Save Product Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
