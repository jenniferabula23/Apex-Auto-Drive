import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { Driver, DriverStatus } from '../types';
import { adminCard, adminInput, adminPanel } from '../components/adminUi';
import AdminStatusBadge from '../components/AdminStatusBadge';

const statusTone = (status: DriverStatus) => {
  if (status === 'available') return 'green';
  if (status === 'on_trip') return 'orange';
  return 'gray';
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState(() => adminStore.getDrivers());
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    status: 'available' as DriverStatus,
  });

  const refresh = () => setDrivers(adminStore.getDrivers());

  const handleAdd = () => {
    if (!form.name || !form.phone || !form.licenseNumber) return;
    adminStore.addDriver(form);
    setForm({ name: '', phone: '', licenseNumber: '', status: 'available' });
    setFormOpen(false);
    refresh();
  };

  const handleStatusChange = (id: string, status: DriverStatus) => {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;
    adminStore.saveDriver({ ...driver, status });
    refresh();
  };

  const handleDelete = (id: string) => {
    adminStore.deleteDriver(id);
    refresh();
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Team"
        title="Drivers"
        description="Manage chauffeurs and driver availability for chauffeur and airport modules."
      />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setFormOpen(v => !v)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add driver
        </button>
        <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {formOpen && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 grid sm:grid-cols-2 gap-4`}>
          <input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={adminInput} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={adminInput} />
          <input placeholder="License number" value={form.licenseNumber} onChange={e => setForm(f => ({ ...f, licenseNumber: e.target.value }))} className={adminInput} />
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as DriverStatus }))} className={adminInput}>
            <option value="available">Available</option>
            <option value="on_trip">On trip</option>
            <option value="off_duty">Off duty</option>
          </select>
          <button type="button" onClick={handleAdd} className="sm:col-span-2 btn-primary">
            Save driver
          </button>
        </motion.div>
      )}

      <div className="space-y-4">
        {drivers.map((driver, i) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${adminCard} p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between`}
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-semibold">{driver.name}</h3>
                <AdminStatusBadge label={driver.status.replace('_', ' ')} tone={statusTone(driver.status)} />
              </div>
              <p className="text-brand-gray text-sm">{driver.phone} · {driver.licenseNumber}</p>
              <p className="text-brand-gray text-xs mt-1">
                {driver.tripsCompleted} trips · ★ {driver.rating.toFixed(1)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={driver.status}
                onChange={e => handleStatusChange(driver.id, e.target.value as DriverStatus)}
                className={`${adminInput} w-auto min-w-[8rem]`}
              >
                <option value="available">Available</option>
                <option value="on_trip">On trip</option>
                <option value="off_duty">Off duty</option>
              </select>
              <button type="button" onClick={() => handleDelete(driver.id)} className="p-3 border border-white/10 text-brand-gray hover:text-brand-red hover:border-brand-red/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
