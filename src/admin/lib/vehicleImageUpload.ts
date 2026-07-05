import { supabase } from '../../lib/supabase';
import { compressImageFile } from './compressImage';

const BUCKET = 'vehicle-images';

const extensionFromType = (type: string) => {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
};

const uploadToStorage = async (file: File, folder: string): Promise<string | null> => {
  const ext = extensionFromType(file.type);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return null;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadVehicleImage = async (file: File, vehicleSlug: string): Promise<string> => {
  const compressedDataUrl = await compressImageFile(file);
  const blob = await fetch(compressedDataUrl).then(r => r.blob());
  const uploadFile = new File([blob], file.name, { type: blob.type || 'image/jpeg' });

  const publicUrl = await uploadToStorage(uploadFile, vehicleSlug);
  if (publicUrl) return publicUrl;

  return compressedDataUrl;
};
