import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { linkBookingsByEmail } from '../lib/bookings';
import {
  isNetworkAuthError,
  localUserAuth,
  localUserToSupabaseUser,
} from '../lib/localUserAuth';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLocalAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalAuth, setIsLocalAuth] = useState(false);

  useEffect(() => {
    const init = async () => {
      const localSession = localUserAuth.getSession();
      if (localSession) {
        setUser(localUserToSupabaseUser(localSession));
        setIsLocalAuth(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          setSession(data.session);
          setUser(data.session.user);
          setIsLocalAuth(false);
        }
      } catch {
        // Supabase unavailable — user can sign in locally.
      } finally {
        setLoading(false);
      }
    };

    void init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (localUserAuth.getSession()) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLocalAuth(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id || !user.email) return;
    void linkBookingsByEmail(user.id, user.email);
  }, [user?.id, user?.email]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        setIsLocalAuth(false);
        return { error: null };
      }
      if (isNetworkAuthError(error.message)) {
        const local = localUserAuth.signIn(email, password);
        if (!local.error && local.session) {
          setUser(localUserToSupabaseUser(local.session));
          setSession(null);
          setIsLocalAuth(true);
        }
        return { error: local.error };
      }
      return { error: error.message };
    } catch {
      const local = localUserAuth.signIn(email, password);
      if (!local.error && local.session) {
        setUser(localUserToSupabaseUser(local.session));
        setSession(null);
        setIsLocalAuth(true);
      }
      return { error: local.error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (!error) {
        setIsLocalAuth(false);
        return { error: null };
      }
      if (isNetworkAuthError(error.message)) {
        const local = localUserAuth.signUp(email, password, name);
        if (!local.error && local.session) {
          setUser(localUserToSupabaseUser(local.session));
          setSession(null);
          setIsLocalAuth(true);
        }
        return { error: local.error };
      }
      return { error: error.message };
    } catch {
      const local = localUserAuth.signUp(email, password, name);
      if (!local.error && local.session) {
        setUser(localUserToSupabaseUser(local.session));
        setSession(null);
        setIsLocalAuth(true);
      }
      return { error: local.error };
    }
  };

  const signOut = async () => {
    if (isLocalAuth || localUserAuth.getSession()) {
      localUserAuth.signOut();
      setUser(null);
      setSession(null);
      setIsLocalAuth(false);
      return;
    }
    await supabase.auth.signOut();
    setIsLocalAuth(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isLocalAuth, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
