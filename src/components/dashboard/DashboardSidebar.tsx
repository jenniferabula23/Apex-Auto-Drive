import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  History,
  Heart,
  CreditCard,
  ShieldCheck,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardSidebar } from '../../context/DashboardSidebarContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/rentals', label: 'My Rentals', icon: Car },
  { to: '/dashboard/history', label: 'Booking History', icon: History },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { to: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { to: '/dashboard/verification', label: 'Verification', icon: ShieldCheck },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

export default function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const { collapsed, toggleCollapsed } = useDashboardSidebar();
  const navigate = useNavigate();

  const initials = (user?.user_metadata?.full_name as string | undefined)
    ?.split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || (user?.email?.[0] ?? 'U').toUpperCase();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email?.split('@')[0] || 'Driver';

  const navLinkClass = (isActive: boolean) =>
    `group relative flex items-center gap-3 py-3 my-1 text-sm transition-all duration-300 ${
      collapsed ? 'justify-center px-3 mx-2' : 'px-6 mx-3'
    } ${
      isActive
        ? 'bg-brand-red/15 text-gray-900 border-l-2 border-brand-red'
        : 'text-brand-gray hover:text-gray-900 hover:bg-black/5 border-l-2 border-transparent'
    }`;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 288 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:flex fixed top-24 left-6 bottom-6 z-40 flex-col"
    >
      <div className="absolute -inset-1 bg-gradient-to-b from-brand-red/20 via-transparent to-orange-500/10 blur-xl opacity-60 pointer-events-none" />
      <div className="relative flex-1 bg-surface-paper/95 border border-brand-brown/15 flex flex-col overflow-hidden accent-brown-bar">
        {/* User card */}
        <div className={`pb-6 border-b border-black/5 relative ${collapsed ? 'px-2 pt-4' : 'px-6 pt-6'}`}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/60 to-transparent" />
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-brand-red/40 blur-lg" />
              <div
                className={`relative bg-gradient-to-br from-brand-red to-[#7a1610] flex items-center justify-center font-heading font-bold text-white ${
                  collapsed ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'
                }`}
              >
                {initials}
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-gray-900 font-semibold truncate">{displayName}</p>
                <p className="text-xs text-brand-gray truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  {isActive && !collapsed && (
                    <motion.span
                      layoutId="user-sidebar-glow"
                      className="absolute inset-0 bg-gradient-to-r from-brand-red/20 to-transparent pointer-events-none"
                    />
                  )}
                  {isActive && collapsed && (
                    <span className="absolute inset-0 bg-brand-red/15 pointer-events-none" />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 shrink-0 transition-colors ${isActive ? 'text-brand-red' : ''}`} />
                  {!collapsed && (
                    <span className="relative z-10 font-medium tracking-wide truncate">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className={`border-t border-black/5 ${collapsed ? 'p-2' : 'p-4'}`}>
          <button
            type="button"
            title={collapsed ? 'Logout' : undefined}
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className={`w-full flex items-center text-sm text-brand-gray hover:text-gray-900 hover:bg-brand-red/10 transition-all duration-300 group ${
              collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:text-brand-red transition-colors" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Side collapse toggle */}
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-6 h-12 bg-white border border-black/10 text-brand-gray hover:text-gray-900 hover:border-brand-red/40 hover:bg-brand-red/10 transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
