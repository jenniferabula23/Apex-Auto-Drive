import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import RegionalPricingForm from '../components/RegionalPricingForm';
import VehicleImageUploadSection from '../components/VehicleImageUploadSection';
import { adminStore, emptyVehicleDraft } from '../store/adminStore';
import type { AdminVehicleDraft } from '../types';
import { adminInput, adminPanel } from '../components/adminUi';

const steps = ['Details', 'Images', 'Pricing', 'Review'] as const;

export default function AdminAddVehiclePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const existing = isEdit
    ? adminStore.getVehicles().find(v => v.id === id)
    : undefined;

  const [step, setStep] = useState(0);

  const [draft, setDraft] = useState<AdminVehicleDraft>(() =>
    existing ? { ...existing } : emptyVehicleDraft(),
  );

  const [featuresText, setFeaturesText] = useState(
    () => existing?.features.join(', ') ?? '',
  );

  const [gallery, setGallery] = useState<string[]>(
    () => existing?.gallery ?? [],
  );

  const categories = adminStore.getCategories();

  const patch = (partial: Partial<AdminVehicleDraft>) =>
    setDraft(prev => ({ ...prev, ...partial }));

  const vehicleSlug =
    draft.id ??
    [draft.brand, draft.model, draft.year]
      .filter(Boolean)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

  const handleSave = () => {
    if (!draft.name || !draft.brand || !draft.pricePerDay.accra) {
      alert('Name, brand, and Accra price are required.');
      return;
    }

    const image = draft.image || gallery[0] || '';

    const saved = adminStore.saveVehicle({
      ...draft,
      id: existing?.id,
      image,
      gallery: gallery.length
        ? gallery
        : image
          ? [image]
          : [],
      features: featuresText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    });

    navigate(`/admin/vehicles/${saved.id}/edit`, {
      replace: true,
    });

    alert(
      isEdit
        ? 'Vehicle updated.'
        : 'Vehicle added to fleet.',
    );
  };

  return (
    <div className="space-y-8">
      <Link
        to="/admin/vehicles"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to vehicles
      </Link>

      <DashboardHeader
        eyebrow="Fleet"
        title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        description="Set Accra as the fixed pickup rate and add optional regional from-pricing for other destinations."
      />

      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
              step === i
                ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(174,33,25,0.25)]'
                : 'border border-gray-200 text-gray-500 hover:border-brand-red/30 hover:text-gray-900'
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${adminPanel} p-6 space-y-4`}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Name *
              </label>

              <input
                className={adminInput}
                value={draft.name}
                onChange={e =>
                  patch({ name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Brand *
              </label>

              <input
                className={adminInput}
                value={draft.brand}
                onChange={e =>
                  patch({ brand: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Model
              </label>

              <input
                className={adminInput}
                value={draft.model}
                onChange={e =>
                  patch({ model: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Year
              </label>

              <input
                type="number"
                className={adminInput}
                value={draft.year}
                onChange={e =>
                  patch({
                    year: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Category
              </label>

              <select
                className={adminInput}
                value={draft.category}
                onChange={e =>
                  patch({
                    category: e.target.value,
                  })
                }
              >
                {categories.map(category => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-500 mt-2">
                Categories can be added or removed from Vehicle Categories.
              </p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Seats
              </label>

              <input
                type="number"
                className={adminInput}
                value={draft.seats}
                onChange={e =>
                  patch({
                    seats: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
              Description
            </label>

            <textarea
              rows={3}
              className={adminInput}
              value={draft.description}
              onChange={e =>
                patch({
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
              Features (comma-separated)
            </label>

            <input
              className={adminInput}
              value={featuresText}
              onChange={e =>
                setFeaturesText(e.target.value)
              }
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-primary"
          >
            Continue to images
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${adminPanel} p-6 space-y-4`}
        >
          <VehicleImageUploadSection
            coverImage={draft.image}
            gallery={gallery}
            vehicleSlug={vehicleSlug}
            onCoverChange={image =>
              patch({ image })
            }
            onGalleryChange={setGallery}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn-outline"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary"
            >
              Continue to pricing
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${adminPanel} p-6`}
        >
          <RegionalPricingForm
            value={draft.pricePerDay}
            onChange={pricePerDay =>
              patch({ pricePerDay })
            }
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-outline"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-primary"
            >
              Review
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${adminPanel} p-6 space-y-4`}
        >
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">
                Name:
              </span>

              <span className="text-gray-900 ml-2">
                {draft.name}
              </span>
            </div>

            <div>
              <span className="text-gray-500">
                Category:
              </span>

              <span className="text-gray-900 ml-2">
                {draft.category}
              </span>
            </div>

            <div>
              <span className="text-gray-500">
                Accra rate:
              </span>

              <span className="text-brand-red ml-2 font-semibold">
                GHS {draft.pricePerDay.accra}/day
              </span>
            </div>

            <div>
              <span className="text-gray-500">
                Regional rates:
              </span>

              <span className="text-gray-900 ml-2">
                {Object.entries(draft.pricePerDay).filter(
                  ([k, v]) =>
                    k !== 'accra' && v,
                ).length || 'None'}
              </span>
            </div>

            <div>
              <span className="text-gray-500">
                Images:
              </span>

              <span className="text-gray-900 ml-2">
                {gallery.length ||
                  (draft.image ? 1 : 0)}
              </span>
            </div>
          </div>

          {draft.image && (
            <img
              src={draft.image}
              alt={draft.name}
              className="w-full max-h-48 object-cover"
            />
          )}

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.slice(0, 4).map(url => (
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="h-16 object-cover border border-gray-200"
                />
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-outline"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save vehicle
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}