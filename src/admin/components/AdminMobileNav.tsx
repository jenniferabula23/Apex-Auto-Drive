import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AdminSidebarNav from './AdminSidebarNav';

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export default function AdminMobileNav({
  open,
  onToggle,
  onClose,
}: Props) {
  return (
    <>
      <div className="lg:hidden fixed top-[5.5rem] left-0 right-0 z-50 px-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-sm px-4 py-2.5 text-sm text-gray-900"
          aria-label="Open admin menu"
        >
          {open ? (
            <X className="w-4 h-4 text-brand-red" />
          ) : (
            <Menu className="w-4 h-4 text-brand-red" />
          )}
          Admin menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-24 z-40 bg-gray-900/30 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 320,
              }}
              className="lg:hidden fixed top-24 left-0 bottom-0 w-[min(20rem,85vw)] z-50 bg-white border-r border-gray-200 shadow-xl flex flex-col overflow-hidden"
            >
              <AdminSidebarNav
                onNavigate={onClose}
                forceExpanded
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}