import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { uploadVehicleImage } from '../lib/vehicleImageUpload';
import { adminInput } from './adminUi';

type VehicleImageUploadSectionProps = {
  coverImage: string;
  gallery: string[];
  vehicleSlug: string;
  onCoverChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
};

export default function VehicleImageUploadSection({
  coverImage,
  gallery,
  vehicleSlug,
  onCoverChange,
  onGalleryChange,
}: VehicleImageUploadSectionProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = vehicleSlug.trim() || 'new-vehicle';

  const handleCoverUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setError(null);
    setUploadingCover(true);
    try {
      const url = await uploadVehicleImage(file, slug);
      onCoverChange(url);
      if (!gallery.includes(url)) {
        onGalleryChange([url, ...gallery.filter(u => u !== url)]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cover upload failed');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setError(null);
    setUploadingGallery(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(file => uploadVehicleImage(file, slug)),
      );
      onGalleryChange([...gallery, ...uploaded.filter(url => !gallery.includes(url))]);
      if (!coverImage && uploaded[0]) onCoverChange(uploaded[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gallery upload failed');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (url: string) => {
    const next = gallery.filter(item => item !== url);
    onGalleryChange(next);
    if (coverImage === url) onCoverChange(next[0] ?? '');
  };

  const setAsCover = (url: string) => onCoverChange(url);

  return (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      <div>
        <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-widest mb-1">Car Images</h3>
        <p className="text-brand-gray text-xs">
          Upload photos of the vehicle. Images are compressed and stored for the fleet listing.
        </p>
      </div>

      {error && (
        <p className="text-brand-red text-xs bg-brand-red/10 border border-brand-red/20 px-3 py-2">{error}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className={`border border-dashed border-gray-300 p-5 text-center ${coverImage ? 'bg-gray-50' : ''}`}>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleCoverUpload(e.target.files)}
          />
          {coverImage ? (
            <div className="space-y-3">
              <img src={coverImage} alt="Cover" className="w-full h-40 object-cover border border-gray-200" />
              <p className="text-xs text-brand-gray uppercase tracking-widest">Cover image</p>
              <button
                type="button"
                disabled={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
                className="btn-outline text-xs w-full inline-flex items-center justify-center gap-2"
              >
                {uploadingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                Replace cover
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploadingCover}
              onClick={() => coverInputRef.current?.click()}
              className="w-full py-8 flex flex-col items-center gap-2 text-brand-gray hover:text-gray-900 transition-colors"
            >
              {uploadingCover ? (
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              ) : (
                <ImagePlus className="w-8 h-8 text-brand-red/70" />
              )}
              <span className="text-xs uppercase tracking-widest">Upload cover image</span>
            </button>
          )}
        </div>

        <div className="border border-dashed border-gray-300 p-5">
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleGalleryUpload(e.target.files)}
          />
          <button
            type="button"
            disabled={uploadingGallery}
            onClick={() => galleryInputRef.current?.click()}
            className="w-full py-8 flex flex-col items-center gap-2 text-brand-gray hover:text-gray-900 transition-colors"
          >
            {uploadingGallery ? (
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
            ) : (
              <Upload className="w-8 h-8 text-brand-red/70" />
            )}
            <span className="text-xs uppercase tracking-widest">Add gallery images</span>
            <span className="text-[10px] text-brand-gray">Select multiple files</span>
          </button>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gallery.map(url => (
            <div key={url} className="relative group border border-gray-200">
              <img src={url} alt="" className="h-24 w-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {coverImage !== url && (
                  <button
                    type="button"
                    title="Set as cover"
                    onClick={() => setAsCover(url)}
                    className="p-1.5 bg-white/10 hover:bg-brand-red/80 text-white"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove"
                  onClick={() => removeGalleryImage(url)}
                  className="p-1.5 bg-white/10 hover:bg-brand-red text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {coverImage === url && (
                <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider bg-brand-red text-white px-1.5 py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 border-t border-gray-100 pt-4">
        <p className="text-xs text-brand-gray uppercase tracking-widest">Or paste image URLs</p>
        <div>
          <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Cover image URL</label>
          <input
            className={adminInput}
            value={coverImage}
            onChange={e => onCoverChange(e.target.value)}
            placeholder="/Cars/... or https://..."
          />
        </div>
        <div>
          <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Gallery URLs (one per line)</label>
          <textarea
            rows={3}
            className={adminInput}
            value={gallery.join('\n')}
            onChange={e =>
              onGalleryChange(
                e.target.value
                  .split('\n')
                  .map(s => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
