import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { Provider } from '../types';
import { adminCard, adminInput, adminPanel } from '../components/adminUi';
import AdminStatusBadge from '../components/AdminStatusBadge';

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState(() => adminStore.getProviders());
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    vehicleCount: 0,
    status: 'active' as Provider['status'],
    city: 'Accra',
  });

  const refresh = () => setProviders(adminStore.getProviders());

  const handleAdd = () => {
    if (!form.companyName || !form.contactName) return;
    adminStore.addProvider(form);
    setForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      vehicleCount: 0,
      status: 'active',
      city: 'Accra',
    });
    setFormOpen(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    adminStore.deleteProvider(id);
    refresh();
  };

  const toggleStatus = (provider: Provider) => {
    adminStore.saveProvider({
      ...provider,
      status: provider.status === 'active' ? 'inactive' : 'active',
    });
    refresh();
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Partners"
        title="Providers"
        description="Third-party fleet and service providers."
      />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setFormOpen(v => !v)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add provider
        </button>
        <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {formOpen && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 grid sm:grid-cols-2 gap-4`}>
          <input placeholder="Company name" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} className={adminInput} />
          <input placeholder="Contact name" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className={adminInput} />
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={adminInput} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={adminInput} />
          <input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={adminInput} />
          <input
            placeholder="Vehicle count"
            type="number"
            min={0}
            value={form.vehicleCount}
            onChange={e => setForm(f => ({ ...f, vehicleCount: Number(e.target.value) }))}
            className={adminInput}
          />
          <button type="button" onClick={handleAdd} className="sm:col-span-2 btn-primary">
            Save provider
          </button>
        </motion.div>
      )}

      <div className="space-y-4">
        {providers.map((provider, i) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${adminCard} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900 font-semibold">{provider.companyName}</h3>
                <AdminStatusBadge label={provider.status} tone={provider.status === 'active' ? 'green' : 'gray'} />
              </div>
              <p className="text-brand-gray text-sm">{provider.contactName} · {provider.city}</p>
              <p className="text-brand-gray text-sm">{provider.email} · {provider.phone}</p>
              <p className="text-brand-gray text-xs mt-1">{provider.vehicleCount} vehicles</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => toggleStatus(provider)} className="btn-outline text-xs px-4 py-2">
                {provider.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" onClick={() => handleDelete(provider.id)} className="p-3 border border-gray-200 text-brand-gray hover:text-brand-red hover:border-brand-red/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
