import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, UserPlus } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { AdminUser } from '../types';
import { adminAlert, adminCard, adminInput, adminPanel } from '../components/adminUi';

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState(() => adminStore.getAdmins());
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: AdminUser['role'];
  }>({ name: '', email: '', phone: '', role: 'admin' });

  const refresh = () => setAdmins(adminStore.getAdmins());

  const handleInvite = () => {
    if (!form.name || !form.email) return;
    adminStore.inviteAdmin(form);
    setForm({ name: '', email: '', phone: '', role: 'admin' });
    setInviteOpen(false);
    refresh();
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Access"
        title="User Management"
        description="Manage administrators — no public admin registration."
      />

      <div className={adminAlert}>
        <p className="text-gray-900 text-sm font-semibold mb-1">Admin Invitation System</p>
        <p className="text-brand-gray text-xs">
          Administrators cannot register publicly. They must be invited via email. API email delivery can be connected later.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setInviteOpen(v => !v)} className="btn-primary inline-flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Admin
        </button>
        <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {inviteOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${adminPanel} p-6 grid sm:grid-cols-2 gap-4`}
        >
          <input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={adminInput} />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={adminInput} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={adminInput} />
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminUser['role'] }))} className={adminInput}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button type="button" onClick={handleInvite} className="sm:col-span-2 btn-primary">
            Send invitation (local)
          </button>
        </motion.div>
      )}

      <div>
        <h2 className="font-heading font-semibold text-gray-900 mb-4">Current Administrators</h2>
        <div className="space-y-4">
          {admins.map((admin, i) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${adminCard} p-5 flex flex-wrap items-center gap-4 justify-between`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 bg-gradient-to-br from-brand-red to-[#7a1610] flex items-center justify-center text-white font-bold font-heading">
                  {admin.name[0]}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">{admin.name}</p>
                  <p className="text-brand-gray text-sm">{admin.email}</p>
                  <p className="text-brand-gray text-xs">{admin.phone}</p>
                </div>
                <span className="text-[10px] px-2 py-1 uppercase tracking-widest border border-brand-red/40 text-brand-red bg-brand-red/10">
                  {admin.role}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`text-[10px] px-3 py-1.5 uppercase tracking-widest border ${
                  admin.onDuty
                    ? 'border-green-500/40 text-green-400 bg-green-500/10'
                    : 'border-gray-200 text-brand-gray bg-gray-50'
                }`}>
                  {admin.onDuty ? 'On Duty' : 'Off Duty'}
                </span>
                <button
                  type="button"
                  onClick={() => { adminStore.updateAdmin(admin.id, { onDuty: !admin.onDuty }); refresh(); }}
                  className="btn-outline text-xs px-3 py-1.5"
                >
                  Set {admin.onDuty ? 'Off' : 'On'} Duty
                </button>
                <button
                  type="button"
                  onClick={() => { adminStore.updateAdmin(admin.id, { status: admin.status === 'active' ? 'blocked' : 'active' }); refresh(); }}
                  className="btn-outline text-xs px-3 py-1.5"
                >
                  {admin.status === 'active' ? 'Block' : 'Unblock'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
