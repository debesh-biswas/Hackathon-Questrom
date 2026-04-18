import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Development-only bypass: set `VITE_DEV_AUTH=true` in your dev env to enable a fake session.
const DEV_AUTH = import.meta.env.VITE_DEV_AUTH === "true";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ session: null, user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_AUTH) {
      // Create a harmless mock session for local development only
      const mock: unknown = {
        user: {
          id: "dev-user",
          email: "dev@example.com",
          user_metadata: { restaurant_name: "Dev Restaurant" },
        },
      };
      setSession(mock as Session);
      setLoading(false);
      return;
    }

    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    // THEN fetch existing
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider value={{
      session, user: session?.user ?? null, loading,
      signOut: async () => {
        if (DEV_AUTH) {
          setSession(null);
        } else {
          await supabase.auth.signOut();
        }
      },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
