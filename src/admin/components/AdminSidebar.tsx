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
      <div className="absolute -inset-1 bg-gradient-to-b from-brand-red/10 via-transparent to-orange-500/5 blur-xl opacity-60 pointer-events-none" />

      <div className="relative flex-1 bg-surface-paper/95 border border-brand-brown/15 shadow-xl flex flex-col overflow-hidden accent-brown-bar">
        <AdminSidebarNav showCollapseToggle />
      </div>
    </motion.aside>
  );
}