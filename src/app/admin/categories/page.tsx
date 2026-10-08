'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Upload, Trash2, Edit2, X, Check, RefreshCw, Sparkles, Layers } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (data) setCategories(data as Category[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setNameAr('');
    setSlug('');
    setParentId('');
    setDescription('');
    setDescriptionAr('');
    setImageUrl('');
    setDisplayOrder('1');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setNameAr(c.name_ar || '');
    setSlug(c.slug);
    setParentId(c.parent_id || '');
    setDescription(c.description || '');
    setDescriptionAr(c.description_ar || '');
    setImageUrl(c.image_url || '');
    setDisplayOrder((c.display_order || 1).toString());
    setIsActive(c.is_active ?? true);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImageUrl(data.secure_url);
    } catch (err: any) {
      alert(`Cloudinary Upload Error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      alert('Please fill Category Name and Slug');
      return;
    }

    try {
      const supabase = createClient();
      const payload: any = {
        name,
        name_ar: nameAr || null,
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        parent_id: parentId || null,
        description: description || null,
        description_ar: descriptionAr || null,
        image_url: imageUrl || null,
        display_order: parseInt(displayOrder, 10) || 1,
        is_active: isActive,
      };

      if (editingId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowModal(false);
      await loadCategories();
    } catch (err: any) {
      alert(`Error saving category: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const supabase = createClient();
      await supabase.from('categories').delete().eq('id', id);
      await loadCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSeedCategories = async () => {
    if (!confirm('Populate all default categories & subcategories into Supabase?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const mainCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => !!c.parent_id);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Category & Merchandising Manager
          </h1>
          <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Manage main departments (Fragrance, Makeup, Skincare) and arched subcategories (Arabian, Floral, Lips, etc.).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleSeedCategories}
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
            <span>1-Click Load Categories</span>
          </button>

          <button onClick={openNewModal} className="btn-lumera-primary">
            <Plus size={16} />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(62, 237, 139, 0.12)', border: '1px solid #3EED8B', color: '#B4F8D3', borderRadius: '3px', marginBottom: '2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Check size={18} />
          <span>Category updated successfully!</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9E8E85' }}>
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#190F0C', borderRadius: '3px', border: '1px dashed rgba(200, 162, 101, 0.2)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem', fontWeight: 600 }}>
            No Categories Configured
          </div>
          <p style={{ color: '#9E8E85', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Click &quot;1-Click Load Categories&quot; to populate all reference categories (Fragrance, Makeup, Skincare, Arabian, Floral, Lips, etc.).
          </p>
          <button onClick={handleSeedCategories} className="btn-lumera-primary">
            <Sparkles size={15} /> Populate Reference Categories
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Main Departments */}
          <div>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold-400)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 700 }}>
              Primary Departments ({mainCategories.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {mainCategories.map((cat) => (
                <div key={cat.id} style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>{cat.name}</h3>
                      {cat.name_ar && <div style={{ fontSize: '0.85rem', color: 'var(--color-gold-400)', marginTop: '0.15rem' }}>{cat.name_ar}</div>}
                    </div>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', backgroundColor: '#221510', color: '#9E8E85', borderRadius: '2px' }}>
                      order #{cat.display_order}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#9E8E85', lineHeight: 1.4, margin: '0 0 1rem 0', flex: 1 }}>
                    {cat.description || 'No description provided.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => openEditModal(cat)}
                      style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--color-gold-400)', color: 'var(--color-espresso-950)', border: 'none', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{ color: '#E05A47', padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold-400)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 700 }}>
              Curated Subcategories & Arched Cards ({subCategories.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {subCategories.map((sub) => {
                const parent = categories.find((c) => c.id === sub.parent_id);
                return (
                  <div key={sub.id} style={{ backgroundColor: '#160E0B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    {sub.image_url && (
                      <div style={{ position: 'relative', width: '100%', height: '110px', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.75rem', backgroundColor: '#20130E' }}>
                        <Image src={sub.image_url} alt="" fill sizes="260px" style={{ objectFit: 'cover' }} />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>{sub.name}</h4>
                        {sub.name_ar && <div style={{ fontSize: '0.8rem', color: 'var(--color-gold-400)' }}>{sub.name_ar}</div>}
                      </div>
                      {parent && (
                        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(200, 162, 101, 0.1)', color: 'var(--color-gold-400)', borderRadius: '2px' }}>
                          {parent.name}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => openEditModal(sub)}
                        style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--color-gold-400)', color: 'var(--color-espresso-950)', border: 'none', borderRadius: '2px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(sub.id)}
                        style={{ color: '#E05A47', padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#140C09', border: '1px solid var(--border-gold)', borderRadius: '3px', width: '100%', maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {editingId ? 'Edit Category' : 'Create Category'}
                </h2>
                <p style={{ color: '#9E8E85', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Updating this category updates storefront navigation and filters.
                </p>
              </div>

              <button onClick={() => setShowModal(false)} style={{ color: '#9E8E85', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Name EN & AR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Name (English) *</label>
                  <input required type="text" placeholder="e.g. Fragrance" value={name} onChange={(e) => { setName(e.target.value); if (!editingId) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Name (Arabic / بالعربية)</label>
                  <input type="text" placeholder="e.g. العطور" value={nameAr} onChange={(e) => setNameAr(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', textAlign: 'right', fontSize: '0.85rem' }} />
                </div>
              </div>

              {/* Slug & Parent */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Slug (URL) *</label>
                  <input required type="text" placeholder="fragrance" value={slug} onChange={(e) => setSlug(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Parent Department (Optional)</label>
                  <select value={parentId} onChange={(e) => setParentId(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}>
                    <option value="">None (Top-Level Department)</option>
                    {mainCategories.filter((c) => c.id !== editingId).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Description</label>
                <textarea rows={2} placeholder="Brief summary of category..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }} />
              </div>

              {/* Image */}
              <div style={{ padding: '1rem', backgroundColor: '#1A0F0B', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gold-400)', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Category Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {imageUrl ? (
                    <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '2px', overflow: 'hidden' }}>
                      <Image src={imageUrl} alt="" fill sizes="70px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : null}
                  <div style={{ flex: 1 }}>
                    <input type="text" placeholder="Image URL (https://...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ width: '100%', padding: '0.6rem', backgroundColor: '#140C09', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.8rem' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.85rem 1.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#FAF7F2', fontSize: '0.8rem', borderRadius: '2px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-lumera-primary" style={{ padding: '0.85rem 2rem' }}>
                  <Check size={16} />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
