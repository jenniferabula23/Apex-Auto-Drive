import { supabase } from '../../lib/supabase';
import { compressImageFile } from './compressImage';

const BUCKET = 'customer-documents';

const uploadToStorage = async (file: File, customerId: string): Promise<string | null> => {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${customerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return null;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadCustomerDocument = async (file: File, customerId: string): Promise<string> => {
  const isImage = file.type.startsWith('image/');
  const payload = isImage ? await compressImageFile(file) : await readFileAsDataUrl(file);
  const blob = await fetch(payload).then(r => r.blob());
  const uploadFile = new File([blob], file.name, { type: blob.type || file.type });

  const publicUrl = await uploadToStorage(uploadFile, customerId);
  if (publicUrl) return publicUrl;

  return payload;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read document'));
    reader.readAsDataURL(file);
  });
