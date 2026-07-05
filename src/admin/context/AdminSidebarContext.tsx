import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const STORAGE_KEY = 'aad_admin_sidebar_collapsed';

type AdminSidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const toggleCollapsed = () => setCollapsed(prev => !prev);

  return (
    <AdminSidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export const useAdminSidebar = () => {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  return ctx;
};
