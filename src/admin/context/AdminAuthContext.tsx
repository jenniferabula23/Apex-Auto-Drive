import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AdminSession } from '../types';

const SESSION_KEY = 'aad_admin_session';

type AdminAuthContextValue = {
  session: AdminSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const DEMO_EMAIL = 'admin@apexautodrive.co';
const DEMO_PASSWORD = 'admin123';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      setSession(raw ? (JSON.parse(raw) as AdminSession) : null);
    } catch {
      setSession(null);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const next: AdminSession = {
        email,
        name: 'Administrator',
        role: 'super_admin',
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
      return { error: null };
    }
    return { error: 'Invalid admin credentials. Use demo: admin@apexautodrive.co / admin123' };
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
