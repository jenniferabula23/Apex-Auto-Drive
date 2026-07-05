import { motion } from 'framer-motion';
import AdminSidebarNav from './AdminSidebarNav';
import { useAdminSidebar } from '../context/AdminSidebarContext';

export default function AdminSidebar() {
  const { collapsed } = useAdminSidebar();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:flex fixed top-24 left-6 bottom-6 z-40 flex-col"
    >
      <div className="absolute -inset-1 bg-gradient-to-b from-brand-red/20 via-transparent to-orange-500/10 blur-xl opacity-60 pointer-events-none" />
      <div className="relative flex-1 bg-black/60 backdrop-blur-2xl border border-white/10 flex flex-col overflow-hidden">
        <AdminSidebarNav showCollapseToggle />
      </div>
    </motion.aside>
  );
}
