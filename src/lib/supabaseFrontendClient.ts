import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// * Used in frontend, such as React components, contexts, hooks.
export function createSupabaseFrontendClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}