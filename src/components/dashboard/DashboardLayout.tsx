import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import { DashboardSidebarProvider, useDashboardSidebar } from '../../context/DashboardSidebarContext';
import { Loader2 } from 'lucide-react';

function DashboardLayoutContent() {
  const { user, loading } = useAuth();
  const { collapsed } = useDashboardSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-32 -left-32 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[140px]"
          animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <DashboardSidebar />

      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? '5.5rem' : '19rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="px-4 lg:pr-8 relative z-10 max-lg:!ml-0"
      >
        <div className="max-w-6xl">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardSidebarProvider>
      <DashboardLayoutContent />
    </DashboardSidebarProvider>
  );
}
