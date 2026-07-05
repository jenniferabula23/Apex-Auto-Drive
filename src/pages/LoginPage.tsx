import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();

  const initialMode = new URLSearchParams(location.search).get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password, name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-brand-red/30 via-transparent to-orange-500/20 blur-xl opacity-60" />
        <div className="relative bg-black/70 backdrop-blur-2xl border border-white/10 p-10">
          <div className="text-center mb-8">
            <img
              src="/photo_2026-05-13_21-54-50-removebg-preview.png"
              alt="Apex Auto Drive"
              className="h-14 w-auto object-contain mx-auto mb-4"
              style={{ filter: 'drop-shadow(0 0 12px rgba(174,33,25,0.5))' }}
            />
            <span className="font-mono text-xs text-brand-red tracking-[0.4em] uppercase">
              {mode === 'login' ? 'Member Access' : 'Join the Elite'}
            </span>
            <h1 className="font-heading font-black text-4xl text-white mt-3">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-brand-gray text-sm mt-2">
              {mode === 'login'
                ? 'Access your premium driving dashboard.'
                : 'Unlock the Apex Auto Drive experience.'}
            </p>
            <p className="text-brand-gray text-xs mt-3 bg-white/5 border border-white/10 px-3 py-2">
              Local demo: <span className="text-white">user@demo.com</span> / <span className="text-white">demo123</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-brand-gray uppercase tracking-wider mb-2 block">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-brand-gray absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
                    placeholder="Michael Asante"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-brand-gray uppercase tracking-wider mb-2 block">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-gray absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-brand-gray uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-gray absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-light text-white font-medium py-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(174,33,25,0.6)] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-brand-gray">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                className="text-brand-red hover:text-brand-red-light font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
            <Link to="/" className="text-xs text-brand-gray hover:text-white mt-4 inline-block transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
