import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { localUserAuth } from '../../lib/localUserAuth';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export default function SettingsPage() {
  const { user, isLocalAuth } = useAuth();
  const [name, setName] = useState((user?.user_metadata?.full_name as string | undefined) || '');
  const [password, setPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    if (isLocalAuth && user) {
      localUserAuth.updateName(user.id, name);
      setSavingProfile(false);
      setProfileMsg('Profile updated.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    setSavingProfile(false);
    setProfileMsg(error ? error.message : 'Profile updated.');
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPwd(true);
    setPwdMsg(null);

    if (isLocalAuth) {
      setSavingPwd(false);
      setPwdMsg('Password changes are available after backend integration.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setSavingPwd(false);
    setPwdMsg(error ? error.message : 'Password updated.');
    if (!error) setPassword('');
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Account"
        title="Settings"
        description="Update your display name and password."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.form
          onSubmit={saveProfile}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-black/10 p-6 space-y-5"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-red" />
            <h3 className="font-heading font-semibold text-gray-900">Username</h3>
          </div>
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Display name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full bg-gray-50 border border-black/10 text-brand-gray px-4 py-3 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-5 py-2.5 text-sm transition-all hover:shadow-[0_0_25px_rgba(174,33,25,0.6)] disabled:opacity-50"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save name</>}
          </button>
          {profileMsg && <p className="text-xs text-brand-gray">{profileMsg}</p>}
        </motion.form>

        <motion.form
          onSubmit={savePassword}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-black/10 p-6 space-y-5"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-red" />
            <h3 className="font-heading font-semibold text-gray-900">Password</h3>
          </div>
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">New password</label>
            <input
              type="password"
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={savingPwd || password.length < 6}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-5 py-2.5 text-sm transition-all hover:shadow-[0_0_25px_rgba(174,33,25,0.6)] disabled:opacity-40"
          >
            {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Update password</>}
          </button>
          {pwdMsg && <p className="text-xs text-brand-gray">{pwdMsg}</p>}
        </motion.form>
      </div>
    </div>
  );
}
