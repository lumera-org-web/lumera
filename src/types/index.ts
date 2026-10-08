export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  cloudinary_public_id?: string | null;
  description?: string | null;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar?: string | null;
  slug: string;
  parent_id?: string | null;
  description?: string | null;
  description_ar?: string | null;
  image_url?: string | null;
  cloudinary_public_id?: string | null;
  display_order: number;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  cloudinary_public_id?: string | null;
  alt_text?: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  size?: string | null;
  color?: string | null;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  sku?: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string | null;
  slug: string;
  brand_id?: string | null;
  category_id?: string | null;
  brand?: Brand | null;
  category?: Category | null;
  description?: string | null;
  description_ar?: string | null;
  short_description?: string | null;
  price: number;
  compare_at_price?: number | null;
  sku?: string | null;
  stock: number;
  is_bestseller: boolean;
  is_trending: boolean;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  fragrance_notes?: {
    top?: string;
    middle?: string;
    base?: string;
  } | null;
  how_to_use?: string | null;
  ingredients?: string | null;
  delivery_info?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at?: string;
}

export interface Banner {
  id: string;
  section_type: 'announcement' | 'hero' | 'fragrance_editorial' | 'makeup_editorial' | 'skincare_editorial';
  title?: string | null;
  title_ar?: string | null;
  subtitle?: string | null;
  subtitle_ar?: string | null;
  description?: string | null;
  description_ar?: string | null;
  cta_text?: string | null;
  cta_text_ar?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
  mobile_image_url?: string | null;
  cloudinary_public_id?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email?: string | null;
  rating: number;
  comment: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface CartItem {
  id: string; // unique item key
  productId: string;
  name: string;
  name_ar?: string;
  brandName?: string;
  slug: string;
  price: number;
  imageUrl?: string;
  variantId?: string;
  variantTitle?: string;
  size?: string;
  quantity: number;
}

export interface SaudiAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string; // e.g. "Jeddah", "Riyadh", "Dammam", "Mecca", "Medina"
  district?: string;
  postalCode?: string;
  saveForLater?: boolean;
}

export type PaymentMethod = 'card' | 'apple_pay' | 'tabby' | 'tamara' | 'stc_pay' | 'cod';

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: SaudiAddress;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'authorized' | 'paid' | 'failed';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string | null;
  courier?: string | null;
  items?: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  product_image?: string | null;
  variant_title?: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}
