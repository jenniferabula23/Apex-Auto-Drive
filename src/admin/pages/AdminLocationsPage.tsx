import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, MapPin } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { PickupLocation } from '../types';
import {
  adminAlert,
  adminInput,
  adminPanel,
} from '../components/adminUi';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState(() =>
    adminStore.getPickupLocations(),
  );

  const [draft, setDraft] = useState<PickupLocation>(
    locations[0],
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    adminStore.savePickupLocation(draft);
    setLocations(adminStore.getPickupLocations());
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Pickup"
        title="Locations"
        description="Pickup is in Accra only for now. All vehicles are collected from Accra and delivered across Ghana."
      />

      <div className={`${adminAlert} flex gap-3`}>
        <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />

        <p className="text-gray-500 text-sm">
          Regional pricing on vehicles applies to the destination region, not the pickup point. Pickup remains Accra.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${adminPanel} p-6 space-y-4`}
      >
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
            Location name
          </label>

          <input
            value={draft.name}
            onChange={e =>
              setDraft(prev => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className={adminInput}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
            City
          </label>

          <input
            value={draft.city}
            onChange={e =>
              setDraft(prev => ({
                ...prev,
                city: e.target.value,
              }))
            }
            className={adminInput}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
            Note
          </label>

          <textarea
            rows={3}
            value={draft.note}
            onChange={e =>
              setDraft(prev => ({
                ...prev,
                note: e.target.value,
              }))
            }
            className={adminInput}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={e =>
              setDraft(prev => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
            className="accent-brand-red"
          />
          Active pickup location
        </label>

        <button
          type="button"
          onClick={handleSave}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved' : 'Save location'}
        </button>
      </motion.div>
    </div>
  );
}