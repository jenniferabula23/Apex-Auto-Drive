import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { RentalModuleKey } from '../types';
import { adminInput, adminPanel } from '../components/adminUi';

export default function AdminRentalTermsPage() {
  const [terms, setTerms] = useState(() => adminStore.getRentalTerms());
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(terms.map(t => [t.key, t.content])) as Record<RentalModuleKey, string>,
  );
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (key: RentalModuleKey) => {
    adminStore.updateRentalTerm(key, drafts[key]);
    setTerms(adminStore.getRentalTerms());
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Policies"
        title="Rental Terms"
        description="Update terms for each rental module — Self Drive, Chauffeur, and Airport Pickup & Drop-off."
      />

      <div className="space-y-6">
        {terms.map((term, i) => (
          <motion.div
            key={term.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${adminPanel} p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-white">{term.title}</h2>
              <span className="text-brand-gray text-xs">
                Updated {new Date(term.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <textarea
              rows={5}
              value={drafts[term.key]}
              onChange={e => setDrafts(prev => ({ ...prev, [term.key]: e.target.value }))}
              className={`${adminInput} resize-y`}
            />
            <button
              type="button"
              onClick={() => handleSave(term.key)}
              className="mt-4 btn-primary inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saved === term.key ? 'Saved' : 'Save terms'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
