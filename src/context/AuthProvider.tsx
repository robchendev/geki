"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseFrontendClient } from "@/lib/supabaseFrontendClient";

export interface AuthContextType {
  user: User | null;
  handleSignUp: (email: string, password: string) => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignOut: (email: string, password: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createSupabaseFrontendClient();

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setUser(null);
        return;
      }

      if (data.session && data.session.user) {
        const { id, email } = data.session.user;
        setUser({
          id: id,
          email: email || "",
        });
      } else {
        setUser(null);
      }
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignUp = async (email: string, password: string): Promise<void> => {
    await supabase.auth.signUp({
      email,
      password,
    });
    router.refresh();
  };

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  const handleSignOut = async (email: string, password: string): Promise<void> => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleSignUp,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
