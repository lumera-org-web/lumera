-- ============================================================
-- LUMÉRA — INITIAL SEED DATA FOR SUPABASE
-- Matches the LUMÉRA visual reference design exactly
-- Run this in Supabase SQL Editor after running schema.sql
-- ============================================================

-- 1. BRANDS
INSERT INTO public.brands (id, name, slug, description) VALUES
('b1000000-0000-0000-0000-000000000001', 'Lattafa', 'lattafa', 'Iconic luxury Arabian perfume house renowned for opulent scents.'),
('b1000000-0000-0000-0000-000000000002', 'YSL Beauty', 'ysl-beauty', 'Parisian couture beauty and iconic fragrance statements.'),
('b1000000-0000-0000-0000-000000000003', 'Dior', 'dior', 'Haute perfumery and French luxury cosmetics.'),
('b1000000-0000-0000-0000-000000000004', 'Amouage', 'amouage', 'The Gift of Kings — international luxury high perfumery.'),
('b1000000-0000-0000-0000-000000000005', 'Medicube', 'medicube', 'Clinical derma-cosmetics formulated for visible pore refinement.'),
('b1000000-0000-0000-0000-000000000006', 'Biodance', 'biodance', 'Viral Korean bio-collagen hydrogel skin overnight treatments.'),
('b1000000-0000-0000-0000-000000000007', 'Huda Beauty', 'huda-beauty', 'Groundbreaking Middle Eastern-founded high glam complexion and lip artistry.'),
('b1000000-0000-0000-0000-000000000008', 'The Ordinary', 'the-ordinary', 'Clinical formulations with integrity and targeted active ingredients.'),
('b1000000-0000-0000-0000-000000000009', 'Beauty of Joseon', 'beauty-of-joseon', 'Traditional Korean Hanbang herbal medicine skincare rituals.')
ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, name_ar, slug, description, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Fragrance', 'العطور', 'fragrance', 'From Arabian treasures to modern niche icons.', 1),
('c1000000-0000-0000-0000-000000000002', 'Makeup', 'المكياج', 'makeup', 'Elevated beauty essentials for your most confident self.', 2),
('c1000000-0000-0000-0000-000000000003', 'Skincare', 'العناية بالبشرة', 'skincare', 'The Skin Ritual: Brighten, Hydrate, Repair, Protect.', 3),
('c1000000-0000-0000-0000-000000000004', 'Trending', 'الأكثر رواجاً', 'trending', 'The beauty discoveries everyone in Saudi Arabia is talking about.', 4),
('c1000000-0000-0000-0000-000000000005', 'New Arrivals', 'وصل حديثاً', 'new-arrivals', 'Fresh luxury curation and newly released formulas.', 5)
ON CONFLICT (id) DO NOTHING;

-- Subcategories (Fragrance families)
INSERT INTO public.categories (id, name, name_ar, slug, parent_id, display_order) VALUES
('c1000000-0000-0000-0000-000000000010', 'Arabian', 'شرقي عربي', 'arabian', 'c1000000-0000-0000-0000-000000000001', 1),
('c1000000-0000-0000-0000-000000000011', 'Floral', 'زهري', 'floral', 'c1000000-0000-0000-0000-000000000001', 2),
('c1000000-0000-0000-0000-000000000012', 'Woody', 'خشبي', 'woody', 'c1000000-0000-0000-0000-000000000001', 3),
('c1000000-0000-0000-0000-000000000013', 'Musk', 'مسك', 'musk', 'c1000000-0000-0000-0000-000000000001', 4),
('c1000000-0000-0000-0000-000000000014', 'Amber', 'عنبر', 'amber', 'c1000000-0000-0000-0000-000000000001', 5),
('c1000000-0000-0000-0000-000000000015', 'Fresh', 'منعش', 'fresh', 'c1000000-0000-0000-0000-000000000001', 6),
-- Makeup Subcategories
('c1000000-0000-0000-0000-000000000020', 'Lips', 'الشفاه', 'lips', 'c1000000-0000-0000-0000-000000000002', 1),
('c1000000-0000-0000-0000-000000000021', 'Blush', 'أحمر الخدود', 'blush', 'c1000000-0000-0000-0000-000000000002', 2),
('c1000000-0000-0000-0000-000000000022', 'Complexion', 'البشرة والأساس', 'complexion', 'c1000000-0000-0000-0000-000000000002', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. BANNERS
INSERT INTO public.banners (id, section_type, title, title_ar, subtitle, description, cta_text, cta_link, display_order, is_active) VALUES
('a1000000-0000-0000-0000-000000000001', 'announcement', 'COMPLIMENTARY SAUDI DELIVERY', 'توصيل مجاني داخل المملكة', 'AUTHENTIC PRODUCTS', 'EASY RETURNS', NULL, NULL, 1, TRUE),
('a1000000-0000-0000-0000-000000000002', 'hero', 'BEAUTY AFTER DARK', 'الجمال بعد الغروب', 'Discover fragrance, makeup and skincare curated for unforgettable rituals.', 'Curated for the Saudi lifestyle with fast delivery in Jeddah and nationwide.', 'SHOP THE EDIT →', '/shop', 1, TRUE),
('a1000000-0000-0000-0000-000000000003', 'fragrance_editorial', 'SCENTS THAT STAY', 'عطور تأسر الحواس وتدوم', 'FRAGRANCE', 'From Arabian treasures to modern icons, find a scent that becomes part of you.', 'EXPLORE FRAGRANCES →', '/category/fragrance', 1, TRUE),
('a1000000-0000-0000-0000-000000000004', 'makeup_editorial', 'BEAUTY IN EVERY DETAIL', 'جمال يبرز في كل تفصيلة', 'MAKEUP', 'Elevated essentials for your most confident self.', 'EXPLORE MAKEUP →', '/category/makeup', 1, TRUE),
('a1000000-0000-0000-0000-000000000005', 'skincare_editorial', 'THE SKIN RITUAL', 'طقوس العناية المتكاملة بالبشرة', 'SKINCARE', 'Brighten. Hydrate. Repair. Protect.', 'EXPLORE SKINCARE →', '/category/skincare', 1, TRUE)
ON CONFLICT (id) DO NOTHING;
