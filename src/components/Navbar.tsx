import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Vehicles', path: '/vehicles' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF8F6]/95 backdrop-blur-2xl border-b border-brand-brown/15 py-3 shadow-[0_8px_30px_rgba(63,42,28,0.08)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="flex items-center">
              <motion.img
                src="/photo_2026-05-13_21-54-50-removebg-preview.png"
                alt="Apex Auto Drive"
                className="brand-logo h-10 w-auto object-contain"
              />
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 relative group ${
                  location.pathname === link.path
                    ? 'text-brand-red'
                    : 'text-brand-gray hover:text-brand-red'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-brand-red transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/list-car"
              className="text-sm text-brand-gray hover:text-brand-red transition-colors border border-brand-brown/20 px-4 py-2 hover:border-brand-red/50"
            >
              Share Your Car
            </Link>

            <Link to="/checkout" className="relative">
              <ShoppingCart className="w-5 h-5 text-brand-gray hover:text-brand-red transition-colors" />
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white text-sm px-4 py-2 transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white text-sm px-4 py-2 transition-all duration-300"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-brand-gray"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 border-t border-black/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium py-2 border-b border-black/5 ${
                    location.pathname === link.path ? 'text-brand-red' : 'text-brand-gray'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/list-car"
                className="text-sm text-brand-gray hover:text-brand-red transition-colors border border-brand-brown/20 px-4 py-3 text-center hover:border-brand-red/50"
              >
                Share Your Car
              </Link>

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 border border-brand-brown/20 px-4 py-3 text-brand-gray hover:text-brand-red hover:border-brand-red/50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
              </Link>

              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-light text-white text-sm px-4 py-3 transition-all duration-300"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn-primary text-center">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
