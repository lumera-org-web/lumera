import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/**
 * Direct public client for reads (products, categories, banners)
 * Does NOT touch cookies, allowing static optimization and ISR without DYNAMIC_SERVER_USAGE warnings.
 */
export const getPublicClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

/**
 * Contextual server client with cookies for session management and user operations.
 */
export const createClient = async () => {
  try {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored if called from Server Component
          }
        },
      },
    });
  } catch {
    // If called outside request context (e.g., sitemap build)
    return getPublicClient() as any;
  }
};
