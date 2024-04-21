import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

function createSupabaseAppServerClient(isServerComponent: boolean) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookies().get(name)?.value;
      },
      set(name, value, options) {
        if (isServerComponent) return; // avoid setting cookies on server component
        cookies().set(name, value, options);
      },
      remove(name, options) {
        if (isServerComponent) return; // avoid removing cookies on server component
        cookies().set(name, "", options);
      },
    },
  });
}

// * Used in SSR operations: getServerSideProps, getStaticProps, API routes
export function createSupabaseServerClient() {
  return createSupabaseAppServerClient(false);
}

// * Used in server components or utility functions that are used on the server side
export function createSupabaseServerComponentClient() {
  return createSupabaseAppServerClient(true);
}
