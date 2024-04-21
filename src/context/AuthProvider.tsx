"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseFrontendClient } from "@/lib/supabaseFrontendClient";
import { Session } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  handleSignUp: (email: string, password: string) => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleSignInDiscord: () => Promise<void>;
}

export interface User {
  id: string;
  email: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createSupabaseFrontendClient();

  // Sets user accordingly, whenever supabase.auth changes through the handle functions below
  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      console.log(data);
      if (error) {
        console.error("Error getting session:", error);
        setSession(null);
        return;
      }
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setSession(session);
      } else {
        setSession(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // * Email

  const handleSignUp = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    router.refresh();
  };

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  const handleSignOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    setSession(null);
    router.refresh();
  };

  // * OAuth

  async function handleSignInDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        handleSignInDiscord,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
