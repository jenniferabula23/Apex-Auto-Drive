import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Globe, User, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency, type Currency } from '../context/CurrencyContext';

const navLinks = [
  { label: 'Vehicles', path: '/vehicles' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const currencies: Currency[] = ['GHS', 'USD', 'EUR', 'GBP'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileCurrencyOpen, setMobileCurrencyOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileCurrencyOpen(false);
    setCurrencyOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-2xl border-b border-white/5 py-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
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
                className="h-10 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 6px rgba(174,33,25,0.35))' }}
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
                    : 'text-brand-gray hover:text-white'
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
              className="text-sm text-brand-gray hover:text-white transition-colors border border-white/10 px-4 py-2 hover:border-brand-red/50"
            >
              Share Your Car
            </Link>

            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 text-sm text-brand-gray hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                {currency}
                <ChevronDown className={`w-3 h-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 bg-black border border-white/10 min-w-[80px]"
                  >
                    {currencies.map(c => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-brand-red/20 ${
                          c === currency ? 'text-brand-red' : 'text-brand-gray'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/checkout" className="relative">
              <ShoppingCart className="w-5 h-5 text-brand-gray hover:text-white transition-colors" />
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white text-sm px-4 py-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,33,25,0.5)]"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white text-sm px-4 py-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(174,33,25,0.5)]"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-white"
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
            className="lg:hidden bg-black/95 border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium py-2 border-b border-white/5 ${
                    location.pathname === link.path ? 'text-brand-red' : 'text-brand-gray'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/list-car"
                className="text-sm text-brand-gray hover:text-white transition-colors border border-white/10 px-4 py-3 text-center hover:border-brand-red/50"
              >
                Share Your Car
              </Link>

              <div className="border border-white/10">
                <button
                  onClick={() => setMobileCurrencyOpen(!mobileCurrencyOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm text-brand-gray hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Currency: {currency}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCurrencyOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileCurrencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/5 overflow-hidden"
                    >
                      {currencies.map(c => (
                        <button
                          key={c}
                          onClick={() => { setCurrency(c); setMobileCurrencyOpen(false); }}
                          className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-brand-red/20 ${
                            c === currency ? 'text-brand-red' : 'text-brand-gray'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 border border-white/10 px-4 py-3 text-brand-gray hover:text-white hover:border-brand-red/50 transition-colors"
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
