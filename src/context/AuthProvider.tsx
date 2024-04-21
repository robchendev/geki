import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { createSupabaseFrontendClient } from "@/lib/supabaseFrontendClient";

export interface AuthContextType {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  user: User | null;
  handleSignUp: () => Promise<void>;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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

  const handleSignUp = async (): Promise<void> => {
    await supabase.auth.signUp({
      email,
      password,
    });
    router.reload();
  };

  const handleSignIn = async (): Promise<void> => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.reload();
  };

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
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
