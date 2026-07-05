import { supabase } from './supabase';
import { compressImageFile } from '../admin/lib/compressImage';
import { isNetworkAuthError, localUserAuth } from './localUserAuth';

export type DocumentType = 'national_id' | 'passport' | 'drivers_license' | 'other';

export type CustomerProfile = {
  user_id: string;
  phone: string;
  address: string;
  license_number: string;
  document_type: DocumentType;
  document_url: string | null;
  updated_at: string;
};

export type CustomerProfileDraft = {
  phone: string;
  address: string;
  license_number: string;
  document_type: DocumentType;
  document_url?: string | null;
};

const BUCKET = 'customer-documents';
const LOCAL_PROFILES_KEY = 'aad_local_customer_profiles';

const readLocalProfiles = (): Record<string, CustomerProfile> => {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, CustomerProfile>) : {};
  } catch {
    return {};
  }
};

const writeLocalProfiles = (profiles: Record<string, CustomerProfile>) => {
  localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read document'));
    reader.readAsDataURL(file);
  });

export const uploadUserDocument = async (file: File, userId: string): Promise<string> => {
  const isImage = file.type.startsWith('image/');
  const payload = isImage ? await compressImageFile(file) : await readFileAsDataUrl(file);

  if (localUserAuth.isLocalUser(userId)) {
    return payload;
  }

  try {
    const blob = await fetch(payload).then(r => r.blob());
    const uploadFile = new File([blob], file.name, { type: blob.type || file.type });
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, uploadFile, {
      cacheControl: '3600',
      upsert: false,
    });

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    }
  } catch {
    return payload;
  }

  return payload;
};

const fetchLocalCustomerProfile = (userId: string): CustomerProfile | null =>
  readLocalProfiles()[userId] ?? null;

const saveLocalCustomerProfile = (
  userId: string,
  draft: CustomerProfileDraft,
): { error: string | null } => {
  const existing = fetchLocalCustomerProfile(userId);
  const profile: CustomerProfile = {
    user_id: userId,
    phone: draft.phone,
    address: draft.address,
    license_number: draft.license_number,
    document_type: draft.document_type,
    document_url: draft.document_url ?? existing?.document_url ?? null,
    updated_at: new Date().toISOString(),
  };
  const profiles = readLocalProfiles();
  profiles[userId] = profile;
  writeLocalProfiles(profiles);
  return { error: null };
};

export const fetchCustomerProfile = async (userId: string): Promise<CustomerProfile | null> => {
  if (localUserAuth.isLocalUser(userId)) {
    return fetchLocalCustomerProfile(userId);
  }

  try {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (isNetworkAuthError(error.message)) {
        return fetchLocalCustomerProfile(userId);
      }
      console.warn('Failed to fetch customer profile:', error.message);
      return null;
    }
    return data;
  } catch {
    return fetchLocalCustomerProfile(userId);
  }
};

export const saveCustomerProfile = async (
  userId: string,
  draft: CustomerProfileDraft,
): Promise<{ error: string | null }> => {
  if (localUserAuth.isLocalUser(userId)) {
    return saveLocalCustomerProfile(userId, draft);
  }

  try {
    const existing = await fetchCustomerProfile(userId);
    const payload = {
      user_id: userId,
      phone: draft.phone,
      address: draft.address,
      license_number: draft.license_number,
      document_type: draft.document_type,
      document_url: draft.document_url ?? existing?.document_url ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = existing
      ? await supabase.from('customer_profiles').update(payload).eq('user_id', userId)
      : await supabase.from('customer_profiles').insert(payload);

    if (error) {
      if (isNetworkAuthError(error.message)) {
        return saveLocalCustomerProfile(userId, draft);
      }
      return { error: error.message };
    }
    return { error: null };
  } catch {
    return saveLocalCustomerProfile(userId, draft);
  }
};
