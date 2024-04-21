import { createSupabaseServerClient } from "@/lib/supabaseAppRouterClient";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Might be useless, as this is only used for OAuth callbacks.
export async function GET(request: NextRequest) {
  console.log("/src/app/auth/callback/route.ts");
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
