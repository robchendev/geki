import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./lib/supabaseReqResClient";

// * Runs like a layer between frontend and backend, but runs on the backend / server-side
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseReqResClient(req, res);
  await supabase.auth.getSession(); // retrieves cookies in the request
  // TODO: If user is authenticated: optionally modify res to include user details or control access
  return res;
}
