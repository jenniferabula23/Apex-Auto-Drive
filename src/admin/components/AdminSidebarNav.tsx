import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { adminNavLinks } from '../config/adminNav';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminSidebar } from '../context/AdminSidebarContext';

type Props = {
  onNavigate?: () => void;
  showCollapseToggle?: boolean;
  forceExpanded?: boolean;
};

export default function AdminSidebarNav({
  onNavigate,
  showCollapseToggle = false,
  forceExpanded = false,
}: Props) {
  const navigate = useNavigate();
  const { session, signOut } = useAdminAuth();
  const { collapsed, toggleCollapsed } = useAdminSidebar();

  const isCollapsed = forceExpanded ? false : collapsed;

  const navLinkClass = (isActive: boolean) =>
    `group relative flex items-center gap-3 py-3 my-1 text-sm transition-all duration-300 ${
      isCollapsed
        ? 'justify-center px-3 mx-2'
        : 'px-6 mx-3'
    } ${
      isActive
        ? 'bg-brand-red/10 text-gray-900 border-l-2 border-brand-red'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent'
    }`;

  return (
    <>
      {showCollapseToggle && (
        <div
          className={`pt-4 pb-2 flex ${
            isCollapsed
              ? 'justify-center px-2'
              : 'justify-end px-4'
          }`}
        >
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={
              isCollapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            title={
              isCollapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
            className="shrink-0 flex items-center justify-center w-8 h-8 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-brand-red/40 hover:bg-brand-red/5 transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      <div
        className={`pb-6 border-b border-gray-100 relative ${
          isCollapsed
            ? 'px-2 pt-2'
            : 'px-6 pt-6'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />

        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-brand-red/20 blur-lg" />

            <div
              className={`relative bg-gradient-to-br from-brand-red to-[#7a1610] flex items-center justify-center font-heading font-bold text-white ${
                isCollapsed
                  ? 'w-10 h-10 text-base'
                  : 'w-12 h-12 text-lg'
              }`}
            >
              {(session?.name ?? 'A').charAt(0)}
            </div>
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-gray-900 font-semibold truncate">
                {session?.name ?? 'Administrator'}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {session?.email ?? 'Operations panel'}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        {adminNavLinks.map(
          ({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              title={
                isCollapsed
                  ? label
                  : undefined
              }
              className={({ isActive }) =>
                navLinkClass(isActive)
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && !isCollapsed && (
                    <motion.span
                      layoutId="admin-sidebar-glow"
                      className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-transparent pointer-events-none"
                    />
                  )}

                  {isActive && isCollapsed && (
                    <span className="absolute inset-0 bg-brand-red/10 pointer-events-none" />
                  )}

                  <Icon
                    className={`w-4 h-4 relative z-10 shrink-0 transition-colors ${
                      isActive
                        ? 'text-brand-red'
                        : ''
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="relative z-10 font-medium tracking-wide truncate">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ),
        )}
      </nav>

      <div
        className={`border-t border-gray-100 space-y-1 ${
          isCollapsed
            ? 'p-2'
            : 'p-4'
        }`}
      >
        <NavLink
          to="/"
          onClick={onNavigate}
          title={
            isCollapsed
              ? 'Back to website'
              : undefined
          }
          className={`w-full flex items-center text-sm text-gray-500 hover:text-gray-900 hover:bg-brand-red/5 transition-all duration-300 group ${
            isCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-4 py-3'
          }`}
        >
          <ArrowLeft className="w-4 h-4 shrink-0 group-hover:text-brand-red transition-colors" />

          {!isCollapsed && (
            <span>Back to website</span>
          )}
        </NavLink>

        <button
          type="button"
          title={
            isCollapsed
              ? 'Sign out'
              : undefined
          }
          onClick={() => {
            signOut();
            onNavigate?.();
            navigate('/admin/login');
          }}
          className={`w-full flex items-center text-sm text-gray-500 hover:text-gray-900 hover:bg-brand-red/5 transition-all duration-300 group ${
            isCollapsed
              ? 'justify-center p-3'
              : 'gap-3 px-4 py-3'
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-brand-red transition-colors" />

          {!isCollapsed && (
            <span>Sign out</span>
          )}
        </button>
      </div>
    </>
  );
}