import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import { uploadVehicleImage } from '../lib/vehicleImageUpload';
import type { HeroSlide } from '../../data/hero';
import { adminInput, adminPanel } from '../components/adminUi';

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>(() =>
    adminStore.getHeroSlides(),
  );
  const [selectedId, setSelectedId] = useState(
    () => slides[0]?.id ?? '',
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selected =
    slides.find(s => s.id === selectedId) ?? slides[0] ?? null;

  const persist = (next: HeroSlide[]) => {
    try {
      const savedSlides = adminStore.saveHeroSlides(next);
      setSlides(savedSlides);
      setError('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return savedSlides;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save slides.',
      );
      return null;
    }
  };

  const patchSelected = (partial: Partial<HeroSlide>) => {
    if (!selected) return;
    const next = slides.map(s =>
      s.id === selected.id ? { ...s, ...partial } : s,
    );
    setSlides(next);
  };

  const handleSaveSelected = () => {
    if (!selected) return;
    if (!selected.name.trim() || !selected.image) {
      setError('Name and image are required.');
      return;
    }
    persist(slides);
  };

  const handleAdd = () => {
    const slide: HeroSlide = {
      id: `hero-${Date.now()}`,
      image: '',
      name: 'New Hero Car',
      subtitle: 'Subtitle',
      glow: '#AE2119',
    };
    const next = [...slides, slide];
    setSlides(next);
    setSelectedId(slide.id);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this hero slide?')) return;
    try {
      const next = adminStore.deleteHeroSlide(id);
      setSlides(next);
      setSelectedId(next[0]?.id ?? '');
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to remove slide.',
      );
    }
  };

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !selected) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadVehicleImage(file, 'homepage-hero');
      const next = slides.map(s =>
        s.id === selected.id ? { ...s, image: url } : s,
      );
      setSlides(next);
      persist(next);
    } catch {
      setError('Image upload failed. Try another file.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Homepage"
        title="Hero Images"
        description="Manage the rotating car showcase on the homepage hero."
      />

      {error && (
        <p className="text-sm text-brand-red bg-brand-red/10 border border-brand-red/20 px-4 py-3">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3">
          Hero slides saved. Refresh the homepage to preview.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleAdd} className="btn-outline inline-flex items-center gap-2">
          <ImagePlus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <div className={`${adminPanel} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
            Slides
          </div>
          <div className="divide-y divide-gray-100">
            {slides.map(slide => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setSelectedId(slide.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  selected?.id === slide.id
                    ? 'bg-brand-red/10'
                    : 'hover:bg-gray-50'
                }`}
              >
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt=""
                    className="w-12 h-10 object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-10 bg-gray-100 border border-gray-200" />
                )}
                <span className="text-sm text-gray-900 truncate">
                  {slide.name || 'Untitled'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className={`${adminPanel} p-6 space-y-5`}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading font-semibold text-gray-900">
                Edit Slide
              </h2>
              <button
                type="button"
                onClick={() => handleDelete(selected.id)}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>

            <div className="border border-dashed border-gray-300 p-4 text-center">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleUpload(e.target.files)}
              />
              {selected.image ? (
                <div className="space-y-3">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full max-h-56 object-contain mx-auto border border-gray-200 bg-gray-50"
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="btn-outline text-xs inline-flex items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Upload className="w-3 h-3" />
                    )}
                    Replace image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-10 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-brand-red" />
                  ) : (
                    <Upload className="w-5 h-5 text-brand-red" />
                  )}
                  Upload hero image
                </button>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Name
              </label>
              <input
                value={selected.name}
                onChange={e => patchSelected({ name: e.target.value })}
                className={adminInput}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Subtitle
              </label>
              <input
                value={selected.subtitle}
                onChange={e =>
                  patchSelected({ subtitle: e.target.value })
                }
                className={adminInput}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Glow color
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={selected.glow}
                  onChange={e => patchSelected({ glow: e.target.value })}
                  className="w-12 h-12 border border-gray-200 bg-white cursor-pointer"
                />
                <input
                  value={selected.glow}
                  onChange={e => patchSelected({ glow: e.target.value })}
                  className={adminInput}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSelected}
              className="btn-primary"
            >
              Save slide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
