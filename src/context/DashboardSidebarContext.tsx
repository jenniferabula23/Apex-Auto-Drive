import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const STORAGE_KEY = 'aad_user_sidebar_collapsed';

type DashboardSidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

export function DashboardSidebarProvider({ children }: { children: ReactNode }) {
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
    <DashboardSidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      {children}
    </DashboardSidebarContext.Provider>
  );
}

export const useDashboardSidebar = () => {
  const ctx = useContext(DashboardSidebarContext);
  if (!ctx) throw new Error('useDashboardSidebar must be used within DashboardSidebarProvider');
  return ctx;
};
