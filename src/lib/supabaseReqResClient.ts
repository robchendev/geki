import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "cookies-next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// * Used in middleware.ts
export function createSupabaseReqResClient(req: NextRequest, res: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return getCookie(name, { req, res });
      },
      set(name, value, options) {
        setCookie(name, value, { req, res, ...options });
      },
      remove(name, options) {
        setCookie(name, "", { req, res, ...options });
      },
    },
  });
}
