import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from '../context/AdminSidebarContext';
import { adminStore } from '../store/adminStore';

function AdminLayoutContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed } = useAdminSidebar();

  useEffect(() => {
    adminStore.init();
  }, []);

  return (
    <div className="min-h-screen pt-4 pb-12 relative text-gray-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-32 -left-32 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px]" />

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />

        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[140px]"
          animate={{
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <AdminMobileNav
        open={mobileOpen}
        onToggle={() => setMobileOpen(v => !v)}
        onClose={() => setMobileOpen(false)}
      />

      <AdminSidebar />

      <motion.main
        initial={false}
        animate={{
          marginLeft: collapsed ? '5.5rem' : '19rem',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="px-4 lg:pr-8 relative z-10 pt-16 lg:pt-6 max-lg:!ml-0"
      >
        <div className="max-w-6xl">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminSidebarProvider>
      <AdminLayoutContent />
    </AdminSidebarProvider>
  );
}