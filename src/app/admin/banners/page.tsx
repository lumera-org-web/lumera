'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Upload, Trash2, Edit2, X, Check, RefreshCw, Sparkles, Layers, Sliders, Eye } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Banner, Category } from '@/types';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<'all' | 'hero' | 'fragrance' | 'makeup' | 'skincare' | 'announcement'>('all');

  // Banner Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalTitleText, setModalTitleText] = useState('Edit Section');
  const [sectionType, setSectionType] = useState<'hero' | 'announcement' | 'fragrance_editorial' | 'makeup_editorial' | 'skincare_editorial'>('hero');
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [ctaText, setCtaText] = useState('SHOP THE EDIT →');
  const [ctaTextAr, setCtaTextAr] = useState('تسوق التشكيلة ←');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  // Category Modal State (for Fragrance Arches & Makeup Panels)
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catNameAr, setCatNameAr] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catSectionName, setCatSectionName] = useState('');
  const [uploadingCatImage, setUploadingCatImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const [bannersRes, catsRes] = await Promise.all([
        supabase.from('banners').select('*').order('display_order', { ascending: true }),
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
      ]);

      if (bannersRes.data) setBanners(bannersRes.data as Banner[]);
      if (catsRes.data) setCategories(catsRes.data as Category[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter banners in storefront visual sequence
  const heroSlides = banners
    .filter((b) => b.section_type === 'hero')
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const fragranceSection = banners.find((b) => b.section_type === 'fragrance_editorial');
  const makeupSection = banners.find((b) => b.section_type === 'makeup_editorial');
  const skincareSection = banners.find((b) => b.section_type === 'skincare_editorial');
  const announcementSection = banners.find((b) => b.section_type === 'announcement');

  // Fragrance 6 Arched Category Families
  const fragranceFamilySlugs = ['arabian', 'floral', 'woody', 'musk', 'amber', 'fresh'];
  const fragranceFamilies = fragranceFamilySlugs.map((slug) => {
    const found = categories.find((c) => c.slug === slug);
    if (found) return found;
    // Default fallback definition matching DB schema
    const defaultNames: Record<string, { en: string; ar: string }> = {
      arabian: { en: 'Arabian', ar: 'شرقي عربي' },
      floral: { en: 'Floral', ar: 'زهري' },
      woody: { en: 'Woody', ar: 'خشبي' },
      musk: { en: 'Musk', ar: 'مسك' },
      amber: { en: 'Amber', ar: 'عنبر' },
      fresh: { en: 'Fresh', ar: 'منعش' },
    };
    return {
      id: `c1000000-0000-0000-0000-0000000000${10 + fragranceFamilySlugs.indexOf(slug)}`,
      name: defaultNames[slug]?.en || slug.toUpperCase(),
      name_ar: defaultNames[slug]?.ar || '',
      slug,
      image_url: null,
      display_order: fragranceFamilySlugs.indexOf(slug) + 1,
      is_active: true,
    } as Category;
  });

  // Makeup 3 Showcase Panels
  const makeupPanelSlugs = ['lips', 'blush', 'complexion'];
  const makeupPanels = makeupPanelSlugs.map((slug) => {
    const found = categories.find((c) => c.slug === slug);
    if (found) return found;
    const defaultNames: Record<string, { en: string; ar: string }> = {
      lips: { en: 'LIPS', ar: 'الشفاه' },
      blush: { en: 'BLUSH', ar: 'أحمر الخدود' },
      complexion: { en: 'COMPLEXION', ar: 'البشرة والأساس' },
    };
    return {
      id: `c1000000-0000-0000-0000-0000000000${20 + makeupPanelSlugs.indexOf(slug)}`,
      name: defaultNames[slug]?.en || slug.toUpperCase(),
      name_ar: defaultNames[slug]?.ar || '',
      slug,
      image_url: null,
      display_order: makeupPanelSlugs.indexOf(slug) + 1,
      is_active: true,
    } as Category;
  });

  // Open Banner Modal
  const openEditModal = (b: Banner, customLabel?: string) => {
    setEditingId(b.id);
    setModalTitleText(customLabel || `Edit ${b.section_type}`);
    setSectionType(b.section_type as any);
    setTitle(b.title || '');
    setTitleAr(b.title_ar || '');
    setSubtitle(b.subtitle || '');
    setDescription(b.description || '');
    setDescriptionAr(b.description_ar || '');
    setCtaText(b.cta_text || 'SHOP THE EDIT →');
    setCtaTextAr(b.cta_text_ar || 'تسوق التشكيلة ←');
    setCtaLink(b.cta_link || '/shop');
    setImageUrl(b.image_url || '');
    setMobileImageUrl(b.mobile_image_url || '');
    setPublicId(b.cloudinary_public_id || '');
    setDisplayOrder((b.display_order ?? 1).toString());
    setIsActive(b.is_active ?? true);
    setShowModal(true);
  };

  const openNewHeroSlideModal = () => {
    setEditingId(null);
    setModalTitleText(`Create New Hero Slide (Slide ${heroSlides.length + 1})`);
    setSectionType('hero');
    setTitle('HAUTE BEAUTY CURATION');
    setTitleAr('مختارات الجمال الفاخرة');
    setSubtitle(`LUMÉRA HAUTE EDIT · SLIDE 0${heroSlides.length + 1}`);
    setDescription('Curated couture beauty statements crafted for unforgettable Saudi evenings.');
    setDescriptionAr('طقوس جمال فاخرة مختارة بعناية لأمسيات لا تُنسى.');
    setCtaText('SHOP THE EDIT →');
    setCtaTextAr('تسوق التشكيلة ←');
    setCtaLink('/shop');
    setImageUrl('');
    setMobileImageUrl('');
    setPublicId('');
    setDisplayOrder((heroSlides.length + 1).toString());
    setIsActive(true);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'banners');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImageUrl(data.secure_url);
      setPublicId(data.public_id);
    } catch (err: any) {
      alert(`Cloudinary Upload Error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMobileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMobileImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'banners_mobile');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMobileImageUrl(data.secure_url);
    } catch (err: any) {
      alert(`Cloudinary Mobile Upload Error: ${err.message}`);
    } finally {
      setUploadingMobileImage(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && sectionType !== 'announcement') {
      alert('Please fill out the Title');
      return;
    }

    try {
      const supabase = createClient();
      const payload: any = {
        section_type: sectionType,
        title,
        title_ar: titleAr || null,
        subtitle: subtitle || null,
        description: description || null,
        description_ar: descriptionAr || null,
        cta_text: ctaText || null,
        cta_text_ar: ctaTextAr || null,
        cta_link: ctaLink || null,
        image_url: imageUrl || null,
        mobile_image_url: mobileImageUrl || null,
        cloudinary_public_id: publicId || null,
        display_order: parseInt(displayOrder, 10) || 1,
        is_active: isActive,
      };

      if (editingId) {
        const { error } = await supabase.from('banners').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('banners').insert(payload);
        if (error) throw error;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      alert(`Error saving banner: ${err.message}`);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to remove this banner?')) return;
    try {
      const supabase = createClient();
      await supabase.from('banners').delete().eq('id', id);
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Open Category Modal (for Fragrance arched family or Makeup panel)
  const openEditCatModal = (cat: Category, sectionLabel: string) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatNameAr(cat.name_ar || '');
    setCatImageUrl(cat.image_url || '');
    setCatSlug(cat.slug);
    setCatSectionName(sectionLabel);
    setShowCatModal(true);
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCatImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setCatImageUrl(data.secure_url);
    } catch (err: any) {
      alert(`Cloudinary Upload Error: ${err.message}`);
    } finally {
      setUploadingCatImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: editingCatId,
          name: catName,
          name_ar: catNameAr || null,
          slug: catSlug,
          image_url: catImageUrl || null,
          is_active: true,
        }, { onConflict: 'id' });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setShowCatModal(false);
      await loadData();
    } catch (err: any) {
      alert(`Error updating category image: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '6rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-400)', fontWeight: 700 }}>
            STOREFRONT HOMEPAGE CMS
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
          Homepage Content & Image Manager
        </h1>
        <p style={{ color: '#D8C7B2', fontSize: '0.9rem', marginTop: '0.4rem', maxWidth: '750px', lineHeight: 1.5 }}>
          Manage and upload authentic Cloudinary images for all 5 homepage sections in exact visual order. When an image is not uploaded yet, a luxury ambient dark radial gradient displays seamlessly with zero broken images.
        </p>
      </div>

      {saveSuccess && (
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(200, 162, 101, 0.15)', border: '1px solid var(--border-gold)', color: 'var(--color-gold-400)', borderRadius: '2px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
          <Check size={18} />
          <span>Section saved successfully! Live storefront updated.</span>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'all', label: 'All Homepage Sections' },
          { id: 'hero', label: '1. Hero Carousel (3 Slides)' },
          { id: 'fragrance', label: '2. Fragrance ("SCENTS THAT STAY")' },
          { id: 'makeup', label: '3. Makeup ("BEAUTY IN EVERY DETAIL")' },
          { id: 'skincare', label: '4. Skincare ("THE SKIN RITUAL")' },
          { id: 'announcement', label: '5. Announcement Ribbon' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveStepTab(tab.id as any)}
            style={{
              padding: '0.6rem 1.1rem',
              backgroundColor: activeStepTab === tab.id ? 'var(--color-gold-400)' : '#160E0B',
              color: activeStepTab === tab.id ? 'var(--color-espresso-950)' : '#D8C7B2',
              border: '1px solid',
              borderColor: activeStepTab === tab.id ? 'var(--color-gold-400)' : 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              fontSize: '0.75rem',
              fontWeight: activeStepTab === tab.id ? 700 : 500,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9E8E85' }}>
          Loading CMS sections...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* ========================================================================= */}
          {/* STEP 1: HERO SECTION (3 BANNERS / SLIDES) */}
          {/* ========================================================================= */}
          {(activeStepTab === 'all' || activeStepTab === 'hero') && (
            <div style={{ backgroundColor: '#140C09', border: '1px solid rgba(200, 162, 101, 0.25)', borderRadius: '4px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', backgroundColor: 'var(--color-gold-400)', color: 'var(--color-espresso-950)', fontWeight: 800, borderRadius: '2px' }}>
                      STEP 1 · STOREFRONT HERO
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                      Cinematic Carousel ({heroSlides.length} Slides)
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                    Hero Slider: 3 Main Slides
                  </h2>
                  <p style={{ color: '#9E8E85', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                    The top interactive full-width banner on the homepage. Customers cycle through Slide 01, 02, and 03.
                  </p>
                </div>

                <button onClick={openNewHeroSlideModal} className="btn-lumera-outline" style={{ fontSize: '0.75rem', padding: '0.6rem 1.2rem' }}>
                  <Plus size={14} />
                  <span>Add Another Hero Slide</span>
                </button>
              </div>

              {/* 3 Hero Slides Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    style={{
                      backgroundColor: '#190F0C',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Slide Photo Preview */}
                    <div style={{ position: 'relative', width: '100%', height: '170px', backgroundColor: '#0D0705', display: 'flex' }}>
                      {/* Desktop Image Preview */}
                      <div style={{ position: 'relative', flex: slide.mobile_image_url ? 2 : 1, height: '100%', borderRight: slide.mobile_image_url ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                        {slide.image_url ? (
                          <Image src={slide.image_url} alt="" fill sizes="350px" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#7E6F67', fontSize: '0.75rem', padding: '1rem', textAlign: 'center', background: 'radial-gradient(circle at 65% 45%, rgba(68, 38, 30, 0.45) 0%, rgba(20, 12, 9, 0.95) 70%, #0D0705 100%)' }}>
                            <span style={{ color: 'var(--color-gold-400)', fontWeight: 600, marginBottom: '0.25rem' }}>✦ Ambient Gradient</span>
                            <span>No Desktop Image</span>
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(0,0,0,0.85)', color: 'var(--color-gold-400)', fontSize: '0.65rem', fontWeight: 700, borderRadius: '2px', letterSpacing: '0.08em' }}>
                          SLIDE 0{idx + 1} · 🖥 DESKTOP
                        </div>
                      </div>

                      {/* Mobile Dedicated Image Preview */}
                      {slide.mobile_image_url && (
                        <div style={{ position: 'relative', width: '95px', height: '100%' }}>
                          <Image src={slide.mobile_image_url} alt="" fill sizes="95px" style={{ objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: '8px', right: '8px', padding: '0.2rem 0.45rem', backgroundColor: 'rgba(0,0,0,0.85)', color: '#6EE7B7', fontSize: '0.65rem', fontWeight: 700, borderRadius: '2px', letterSpacing: '0.05em' }}>
                            📱 MOBILE
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Slide Details */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-gold-400)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {slide.subtitle || `SLIDE 0${idx + 1}`}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.35rem 0', whiteSpace: 'pre-line' }}>
                        {slide.title}
                      </h3>
                      {slide.title_ar && (
                        <div style={{ fontSize: '0.85rem', color: '#D8C7B2', marginBottom: '0.5rem', direction: 'rtl', textAlign: 'left' }}>
                          {slide.title_ar}
                        </div>
                      )}
                      <p style={{ fontSize: '0.75rem', color: '#9E8E85', lineHeight: 1.4, margin: '0 0 1rem 0', flex: 1 }}>
                        {slide.description}
                      </p>

                      <div style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', marginBottom: '1rem', fontWeight: 600 }}>
                        Button: &quot;{slide.cta_text}&quot; → {slide.cta_link}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.85rem', marginTop: 'auto' }}>
                        <button
                          onClick={() => openEditModal(slide, `Edit Hero Slide 0${idx + 1}`)}
                          style={{
                            flex: 1,
                            padding: '0.6rem',
                            backgroundColor: 'var(--color-gold-400)',
                            color: 'var(--color-espresso-950)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={13} />
                          <span>{slide.image_url ? `Edit Slide 0${idx + 1}` : `Upload Image / Edit 0${idx + 1}`}</span>
                        </button>

                        {heroSlides.length > 1 && (
                          <button
                            onClick={() => handleDeleteBanner(slide.id)}
                            style={{ padding: '0.6rem 0.8rem', backgroundColor: 'transparent', color: '#E05A47', border: '1px solid rgba(224,90,71,0.2)', borderRadius: '2px', cursor: 'pointer' }}
                            title="Delete Slide"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: FRAGRANCE SECTION ("SCENTS THAT STAY") */}
          {/* ========================================================================= */}
          {(activeStepTab === 'all' || activeStepTab === 'fragrance') && fragranceSection && (
            <div style={{ backgroundColor: '#140C09', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', backgroundColor: '#221510', color: 'var(--color-gold-400)', fontWeight: 800, borderRadius: '2px', border: '1px solid var(--border-gold)' }}>
                      STEP 2 · FRAGRANCE EDITORIAL
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Homepage Section 2</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                    Fragrance: &quot;SCENTS THAT STAY&quot;
                  </h2>
                  <p style={{ color: '#9E8E85', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                    Controls the editorial header, description, and the 6 arched fragrance families shown below.
                  </p>
                </div>

                <button
                  onClick={() => openEditModal(fragranceSection, 'Edit Fragrance Section ("SCENTS THAT STAY")')}
                  className="btn-lumera-primary"
                  style={{ fontSize: '0.75rem', padding: '0.65rem 1.4rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit Editorial Header</span>
                </button>
              </div>

              {/* Fragrance Section Header Preview Card */}
              <div style={{ backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '3px', padding: '1.75rem', display: 'grid', gridTemplateColumns: fragranceSection.image_url ? '180px 1fr' : '1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                {fragranceSection.image_url && (
                  <div style={{ position: 'relative', width: '180px', height: '130px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#0D0705' }}>
                    <Image src={fragranceSection.image_url} alt="" fill sizes="180px" style={{ objectFit: 'cover' }} />
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase' }}>
                    TAG: {fragranceSection.subtitle || 'FRAGRANCE'}
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: '0.3rem 0', fontFamily: 'var(--font-display)' }}>
                    {fragranceSection.title}
                  </div>
                  {fragranceSection.title_ar && (
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-gold-400)', direction: 'rtl', textAlign: 'left', marginBottom: '0.4rem' }}>
                      {fragranceSection.title_ar}
                    </div>
                  )}
                  <p style={{ color: '#D8C7B2', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.75rem 0', maxWidth: '680px' }}>
                    {fragranceSection.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                    Button: &quot;{fragranceSection.cta_text}&quot; → {fragranceSection.cta_link}
                  </div>
                </div>
              </div>

              {/* Fragrance Arched Category Families Grid */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      6 Fragrance Family Arched Cards
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#9E8E85', margin: '0.2rem 0 0 0' }}>
                      Click any card to upload an authentic Cloudinary image. If empty, the ambient gold star arch displays automatically.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  {fragranceFamilies.map((cat) => (
                    <div
                      key={cat.id || cat.slug}
                      style={{
                        backgroundColor: '#190F0C',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                      }}
                    >
                      {/* Arched Thumbnail */}
                      <div
                        style={{
                          position: 'relative',
                          height: '140px',
                          backgroundColor: '#120A08',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {cat.image_url ? (
                          <>
                            <Image src={cat.image_url} alt={cat.name} fill sizes="160px" style={{ objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,12,9,0.1) 0%, rgba(20,12,9,0.7) 100%)' }} />
                          </>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold-400)' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(200, 162, 101, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
                              ✦
                            </div>
                            <span style={{ fontSize: '0.65rem', color: '#9E8E85' }}>Ambient Gold Arch</span>
                          </div>
                        )}
                      </div>

                      {/* Name & Upload Button */}
                      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {cat.name}
                          </div>
                          {cat.name_ar && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', marginTop: '0.15rem' }}>
                              {cat.name_ar}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => openEditCatModal(cat, 'Fragrance Arched Family')}
                          style={{
                            marginTop: '0.85rem',
                            padding: '0.5rem',
                            backgroundColor: cat.image_url ? '#251712' : 'var(--color-gold-400)',
                            color: cat.image_url ? 'var(--color-gold-400)' : 'var(--color-espresso-950)',
                            border: cat.image_url ? '1px solid var(--border-gold)' : 'none',
                            borderRadius: '2px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Upload size={12} />
                          <span>{cat.image_url ? 'Change Image' : 'Upload Image'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: MAKEUP SECTION ("BEAUTY IN EVERY DETAIL") */}
          {/* ========================================================================= */}
          {(activeStepTab === 'all' || activeStepTab === 'makeup') && makeupSection && (
            <div style={{ backgroundColor: '#140C09', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', backgroundColor: '#221510', color: 'var(--color-gold-400)', fontWeight: 800, borderRadius: '2px', border: '1px solid var(--border-gold)' }}>
                      STEP 3 · MAKEUP SHOWCASE
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Homepage Section 3</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                    Makeup: &quot;BEAUTY IN EVERY DETAIL&quot;
                  </h2>
                  <p style={{ color: '#9E8E85', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                    Controls the editorial header, description, and the 3 luxury showcase panels (Lips, Blush, Complexion) below.
                  </p>
                </div>

                <button
                  onClick={() => openEditModal(makeupSection, 'Edit Makeup Section ("BEAUTY IN EVERY DETAIL")')}
                  className="btn-lumera-primary"
                  style={{ fontSize: '0.75rem', padding: '0.65rem 1.4rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit Editorial Header</span>
                </button>
              </div>

              {/* Makeup Section Header Preview Card */}
              <div style={{ backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '3px', padding: '1.75rem', display: 'grid', gridTemplateColumns: makeupSection.image_url ? '180px 1fr' : '1fr', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                {makeupSection.image_url && (
                  <div style={{ position: 'relative', width: '180px', height: '130px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#0D0705' }}>
                    <Image src={makeupSection.image_url} alt="" fill sizes="180px" style={{ objectFit: 'cover' }} />
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase' }}>
                    TAG: {makeupSection.subtitle || 'MAKEUP'}
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: '0.3rem 0', fontFamily: 'var(--font-display)' }}>
                    {makeupSection.title}
                  </div>
                  {makeupSection.title_ar && (
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-gold-400)', direction: 'rtl', textAlign: 'left', marginBottom: '0.4rem' }}>
                      {makeupSection.title_ar}
                    </div>
                  )}
                  <p style={{ color: '#D8C7B2', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.75rem 0', maxWidth: '680px' }}>
                    {makeupSection.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                    Button: &quot;{makeupSection.cta_text}&quot; → {makeupSection.cta_link}
                  </div>
                </div>
              </div>

              {/* 3 Makeup Showcase Panels Grid */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      3 Makeup Showcase Panels (Lips · Blush · Complexion)
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#9E8E85', margin: '0.2rem 0 0 0' }}>
                      Upload images for the 3 visual editorial panels. If empty, the luxury ambient warm radial gradient displays seamlessly.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  {makeupPanels.map((panel) => (
                    <div
                      key={panel.id || panel.slug}
                      style={{
                        backgroundColor: '#190F0C',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Panel Thumbnail */}
                      <div
                        style={{
                          position: 'relative',
                          height: '180px',
                          backgroundColor: '#221510',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {panel.image_url ? (
                          <>
                            <Image src={panel.image_url} alt={panel.name} fill sizes="280px" style={{ objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,12,9,0.2) 0%, rgba(20,12,9,0.85) 100%)' }} />
                          </>
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%, rgba(163, 107, 66, 0.25) 0%, rgba(20, 12, 9, 0.95) 85%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
                            <span style={{ color: 'var(--color-gold-400)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{panel.name}</span>
                            <span style={{ fontSize: '0.7rem', color: '#9E8E85' }}>Ambient Warm Shading Active</span>
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '10px', left: '12px', zIndex: 2 }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em' }}>{panel.name}</span>
                          {panel.name_ar && <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', display: 'block' }}>{panel.name_ar}</span>}
                        </div>
                      </div>

                      {/* Upload Button */}
                      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <button
                          onClick={() => openEditCatModal(panel, 'Makeup Showcase Panel')}
                          style={{
                            width: '100%',
                            padding: '0.65rem',
                            backgroundColor: panel.image_url ? '#251712' : 'var(--color-gold-400)',
                            color: panel.image_url ? 'var(--color-gold-400)' : 'var(--color-espresso-950)',
                            border: panel.image_url ? '1px solid var(--border-gold)' : 'none',
                            borderRadius: '2px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <Upload size={13} />
                          <span>{panel.image_url ? `Change Image for ${panel.name}` : `Upload Image for ${panel.name}`}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: SKINCARE SECTION ("THE SKIN RITUAL") */}
          {/* ========================================================================= */}
          {(activeStepTab === 'all' || activeStepTab === 'skincare') && skincareSection && (
            <div style={{ backgroundColor: '#140C09', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', backgroundColor: '#221510', color: 'var(--color-gold-400)', fontWeight: 800, borderRadius: '2px', border: '1px solid var(--border-gold)' }}>
                      STEP 4 · SKINCARE RITUAL
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Homepage Section 4</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                    Skincare: &quot;THE SKIN RITUAL&quot;
                  </h2>
                  <p style={{ color: '#9E8E85', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                    Controls the warm ivory clinical derma block headline, description, button, and visual showcase photo.
                  </p>
                </div>

                <button
                  onClick={() => openEditModal(skincareSection, 'Edit Skincare Section ("THE SKIN RITUAL")')}
                  className="btn-lumera-primary"
                  style={{ fontSize: '0.75rem', padding: '0.65rem 1.4rem' }}
                >
                  <Edit2 size={14} />
                  <span>{skincareSection.image_url ? 'Edit Content & Image' : 'Upload Image / Edit'}</span>
                </button>
              </div>

              {/* Skincare Section Preview Card */}
              <div style={{ backgroundColor: '#190F0C', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '3px', padding: '1.75rem', display: 'grid', gridTemplateColumns: skincareSection.image_url ? '220px 1fr' : '1fr', gap: '2rem', alignItems: 'center' }}>
                {skincareSection.image_url ? (
                  <div style={{ position: 'relative', width: '220px', height: '150px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#EDE5D8', border: '1px solid var(--border-gold)' }}>
                    <Image src={skincareSection.image_url} alt="" fill sizes="220px" style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem', backgroundColor: '#EDE5D8', borderRadius: '3px', textAlign: 'center', color: '#2E1B15', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', letterSpacing: '0.1em', fontWeight: 700 }}>LUMÉRA</div>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7E5F4B', marginTop: '0.2rem' }}>
                      Ivory Luxury Ambient Card Active
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase' }}>
                    TAG: {skincareSection.subtitle || 'SKINCARE'}
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: '0.3rem 0', fontFamily: 'var(--font-display)' }}>
                    {skincareSection.title}
                  </div>
                  {skincareSection.title_ar && (
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-gold-400)', direction: 'rtl', textAlign: 'left', marginBottom: '0.4rem' }}>
                      {skincareSection.title_ar}
                    </div>
                  )}
                  <p style={{ color: '#D8C7B2', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 0.75rem 0', maxWidth: '680px' }}>
                    {skincareSection.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 600 }}>
                    Button: &quot;{skincareSection.cta_text}&quot; → {skincareSection.cta_link}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: TOP ANNOUNCEMENT BAR */}
          {/* ========================================================================= */}
          {(activeStepTab === 'all' || activeStepTab === 'announcement') && announcementSection && (
            <div style={{ backgroundColor: '#140C09', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', backgroundColor: '#221510', color: 'var(--color-gold-400)', fontWeight: 800, borderRadius: '2px', border: '1px solid var(--border-gold)' }}>
                      STEP 5 · TOP ANNOUNCEMENT BAR
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#9E8E85' }}>Header Ribbon</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0.4rem 0 0 0' }}>
                    Announcement Ribbon
                  </h2>
                  <p style={{ color: '#9E8E85', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                    The topmost notification bar displayed across all storefront pages.
                  </p>
                </div>

                <button
                  onClick={() => openEditModal(announcementSection, 'Edit Top Announcement Ribbon')}
                  className="btn-lumera-primary"
                  style={{ fontSize: '0.75rem', padding: '0.65rem 1.4rem' }}
                >
                  <Edit2 size={14} />
                  <span>Edit Announcement Bar</span>
                </button>
              </div>

              {/* Announcement Bar Preview */}
              <div style={{ backgroundColor: '#0D0705', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 600 }}>
                    {announcementSection.title}
                  </div>
                  {announcementSection.title_ar && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', direction: 'rtl', textAlign: 'left', marginTop: '0.25rem' }}>
                      {announcementSection.title_ar}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#9E8E85', textTransform: 'uppercase' }}>
                  <span>{announcementSection.subtitle || 'AUTHENTIC PRODUCTS'}</span>
                  <span>·</span>
                  <span>{announcementSection.description || 'EASY RETURNS'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* BANNER EDIT / CREATE MODAL */}
      {/* ========================================================================= */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#140C09', border: '1px solid var(--border-gold)', borderRadius: '3px', width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  {modalTitleText}
                </h2>
                <p style={{ color: '#9E8E85', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Upload image or update content. Changes will be live immediately on the storefront.
                </p>
              </div>

              <button onClick={() => setShowModal(false)} style={{ color: '#9E8E85', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Title EN & AR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Headline / Title (English) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. BEAUTY AFTER DARK"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Headline / Title (Arabic / بالعربية)
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="e.g. الجمال بعد الغروب"
                    dir="rtl"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Subtitle / Tag */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Subtitle / Category Tag (e.g. &quot;FRAGRANCE&quot;, &quot;LUMÉRA HAUTE EDIT&quot;)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="LUMÉRA HAUTE EDIT"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Description EN & AR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Editorial summary or promotional text..."
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Description (Arabic / بالعربية)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="الوصف باللغة العربية..."
                    dir="rtl"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* CTA button text & link */}
              {sectionType !== 'announcement' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Button Text (EN)</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="SHOP THE EDIT →"
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Button Text (AR)</label>
                    <input
                      type="text"
                      value={ctaTextAr}
                      onChange={(e) => setCtaTextAr(e.target.value)}
                      placeholder="تسوق التشكيلة ←"
                      dir="rtl"
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Destination Link</label>
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      placeholder="/shop or /category/fragrance"
                      style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {/* Desktop Banner Image (16:9 / Landscape) */}
              <div style={{ padding: '1.25rem', backgroundColor: '#1A0F0B', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-gold-400)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    🖥 Desktop Banner Image (16:9 / Landscape)
                  </label>
                  <span style={{ fontSize: '0.65rem', color: '#9E8E85' }}>Used on Laptops & Desktops</span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {imageUrl ? (
                    <div style={{ position: 'relative', width: '140px', height: '90px', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-gold)' }}>
                      <Image src={imageUrl} alt="" fill sizes="140px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '140px', height: '90px', borderRadius: '2px', border: '1px dashed rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A554A', fontSize: '0.75rem' }}>
                      No image
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: 'rgba(200, 162, 101, 0.15)', border: '1px solid var(--border-gold)', color: 'var(--color-gold-400)', fontSize: '0.75rem', fontWeight: 700, borderRadius: '2px', cursor: 'pointer' }}>
                        <Upload size={14} />
                        <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Desktop Image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or enter direct image URL (https://...)"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: '#140C09', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated Mobile Responsive Banner Image (Portrait 9:16 or 4:5) */}
              <div style={{ padding: '1.25rem', backgroundColor: '#141210', borderRadius: '3px', border: '1px solid rgba(110, 231, 183, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>📱 Dedicated Mobile Responsive Image (Portrait / 9:16)</span>
                  </label>
                  <span style={{ fontSize: '0.65rem', color: '#A7F3D0', backgroundColor: 'rgba(110, 231, 183, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '2px', fontWeight: 600 }}>
                    Separate Mobile Upload
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', color: '#9E8E85', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  Upload a vertical photo specifically formatted for smartphones. When added, mobile users will see this tailored vertical crop for perfect responsiveness.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {mobileImageUrl ? (
                    <div style={{ position: 'relative', width: '70px', height: '110px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid #6EE7B7' }}>
                      <Image src={mobileImageUrl} alt="Mobile preview" fill sizes="70px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '70px', height: '110px', borderRadius: '3px', border: '1px dashed rgba(110, 231, 183, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6A554A', fontSize: '0.65rem', textAlign: 'center', padding: '0.25rem' }}>
                      <span>No Mobile Image</span>
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: 'rgba(110, 231, 183, 0.12)', border: '1px solid rgba(110, 231, 183, 0.4)', color: '#6EE7B7', fontSize: '0.75rem', fontWeight: 700, borderRadius: '2px', cursor: 'pointer' }}>
                        <Upload size={14} />
                        <span>{uploadingMobileImage ? 'Uploading Mobile...' : 'Upload Mobile Image (Cloudinary)'}</span>
                        <input type="file" accept="image/*" onChange={handleMobileImageUpload} disabled={uploadingMobileImage} style={{ display: 'none' }} />
                      </label>

                      {mobileImageUrl && (
                        <button
                          type="button"
                          onClick={() => setMobileImageUrl('')}
                          style={{ padding: '0.65rem 0.85rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#D8C7B2', fontSize: '0.725rem', borderRadius: '2px', cursor: 'pointer' }}
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={mobileImageUrl}
                        onChange={(e) => setMobileImageUrl(e.target.value)}
                        placeholder="Or enter direct mobile image URL (https://...)"
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: '#140C09', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order & Active */}
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: '160px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>Display Order (Slide #)</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold-400)' }}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '0.85rem', color: '#FAF7F2', cursor: 'pointer' }}>
                    Active & Visible on Storefront
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.85rem 1.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#FAF7F2', fontSize: '0.8rem', borderRadius: '2px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lumera-primary" style={{ padding: '0.85rem 2rem' }}>
                  <Check size={16} />
                  <span>Save & Publish to Storefront</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY IMAGE UPLOAD MODAL (Fragrance Tiles & Makeup Panels) */}
      {/* ========================================================================= */}
      {showCatModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#140C09', border: '1px solid var(--border-gold)', borderRadius: '3px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-400)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {catSectionName}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', margin: '0.25rem 0 0 0' }}>
                  Upload Image: {catName}
                </h2>
                <p style={{ color: '#9E8E85', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Upload an authentic image for this section tile. Once saved, it updates immediately on the live storefront.
                </p>
              </div>

              <button onClick={() => setShowCatModal(false)} style={{ color: '#9E8E85', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Names EN & AR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Display Label (English)
                  </label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9E8E85', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Display Label (Arabic / بالعربية)
                  </label>
                  <input
                    type="text"
                    value={catNameAr}
                    onChange={(e) => setCatNameAr(e.target.value)}
                    dir="rtl"
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#190F0C', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Cloudinary Image Upload */}
              <div style={{ padding: '1.5rem', backgroundColor: '#1A0F0B', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gold-400)', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Tile / Panel Photo (Cloudinary)
                </label>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {catImageUrl ? (
                    <div style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-gold)' }}>
                      <Image src={catImageUrl} alt={catName} fill sizes="130px" style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '130px', height: '130px', borderRadius: '3px', border: '1px dashed rgba(255, 255, 255, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#7E6F67', fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center' }}>
                      <span>No image yet</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-400)', marginTop: '0.2rem' }}>✦ Luxury Gradient Active</span>
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem', backgroundColor: 'rgba(200, 162, 101, 0.15)', border: '1px solid var(--border-gold)', color: 'var(--color-gold-400)', fontSize: '0.8rem', fontWeight: 700, borderRadius: '2px', cursor: 'pointer' }}>
                        <Upload size={15} />
                        <span>{uploadingCatImage ? 'Uploading to Cloudinary...' : 'Upload Image to Cloudinary'}</span>
                        <input type="file" accept="image/*" onChange={handleCatImageUpload} disabled={uploadingCatImage} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={catImageUrl}
                        onChange={(e) => setCatImageUrl(e.target.value)}
                        placeholder="Or paste direct image URL (https://...)"
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: '#140C09', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '2px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  style={{ padding: '0.85rem 1.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#FAF7F2', fontSize: '0.8rem', borderRadius: '2px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lumera-primary" style={{ padding: '0.85rem 2rem' }}>
                  <Check size={16} />
                  <span>Save Tile Image</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
