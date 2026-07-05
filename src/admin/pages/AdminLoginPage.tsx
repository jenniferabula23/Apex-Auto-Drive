import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Shield } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminCard, adminInput } from '../components/adminUi';

export default function AdminLoginPage() {
  const { session, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [email, setEmail] = useState('admin@apexautodrive.co');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${adminCard} w-full max-w-md p-8`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-red/20 border border-brand-red/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-brand-red" />
          </div>
          <div>
            <p className="font-mono text-xs text-brand-red tracking-[0.3em] uppercase">Secure Access</p>
            <h1 className="font-heading font-bold text-2xl text-white">Admin Login</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`${adminInput} pl-10`}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${adminInput} pl-10`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-brand-gray text-xs mt-6 text-center">
          Demo: <span className="text-white">admin@apexautodrive.co</span> / <span className="text-white">admin123</span>
        </p>
        <p className="text-center mt-4">
          <Link to="/" className="text-sm text-brand-gray hover:text-brand-red transition-colors">
            ← Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
