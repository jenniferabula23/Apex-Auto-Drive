import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Save, ShieldCheck, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCustomerProfile,
  saveCustomerProfile,
  uploadUserDocument,
  type CustomerProfileDraft,
  type DocumentType,
} from '../../lib/customerProfile';

const documentTypes: { key: DocumentType; label: string }[] = [
  { key: 'national_id', label: 'National ID (Ghana Card)' },
  { key: 'passport', label: 'Passport' },
  { key: 'drivers_license', label: "Driver's License" },
  { key: 'other', label: 'Other ID Document' },
];

const emptyDraft = (): CustomerProfileDraft => ({
  phone: '',
  address: '',
  license_number: '',
  document_type: 'national_id',
  document_url: null,
});

export default function IdentityVerification() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<CustomerProfileDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchCustomerProfile(user.id).then(profile => {
      if (profile) {
        setDraft({
          phone: profile.phone,
          address: profile.address,
          license_number: profile.license_number,
          document_type: profile.document_type as DocumentType,
          document_url: profile.document_url,
        });
      }
      setLoading(false);
    });
  }, [user]);

  const patch = (partial: Partial<CustomerProfileDraft>) =>
    setDraft(prev => ({ ...prev, ...partial }));

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !user) return;

    setError(null);
    setUploading(true);
    try {
      const url = await uploadUserDocument(file, user.id);
      patch({ document_url: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!draft.phone.trim() || !draft.address.trim() || !draft.license_number.trim()) {
      setError('Phone, address, and license number are required.');
      return;
    }
    if (!draft.document_url) {
      setError('Please upload your identification document.');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    const { error: saveError } = await saveCustomerProfile(user.id, draft);
    setSaving(false);
    if (saveError) {
      setError(saveError);
      return;
    }
    setMessage('Verification details saved. Our team will review your documents.');
  };

  const isVerified = Boolean(draft.document_url && draft.license_number);

  if (loading) {
    return (
      <div className="bg-white border border-black/10 p-6 flex justify-center">
        <Loader2 className="w-5 h-5 text-brand-red animate-spin" />
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white border border-black/10 p-6 space-y-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-red" />
          <h3 className="font-heading font-semibold text-gray-900">Identity Verification</h3>
        </div>
        {isVerified && (
          <span className="text-[10px] uppercase tracking-widest border border-green-500/40 text-green-400 bg-green-500/10 px-3 py-1">
            Document on file
          </span>
        )}
      </div>

      <p className="text-brand-gray text-sm">
        Upload your ID and license details so we can verify your account for rentals and chauffeur services.
      </p>

      {error && (
        <p className="text-brand-red text-xs bg-brand-red/10 border border-brand-red/20 px-3 py-2">{error}</p>
      )}
      {message && (
        <p className="text-green-400 text-xs bg-green-400/10 border border-green-400/20 px-3 py-2">{message}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Phone *</label>
          <input
            type="tel"
            value={draft.phone}
            onChange={e => patch({ phone: e.target.value })}
            className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
            placeholder="+233 …"
          />
        </div>
        <div>
          <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">License number *</label>
          <input
            value={draft.license_number}
            onChange={e => patch({ license_number: e.target.value })}
            className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
            placeholder="e.g. GH-DL-123456"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Address *</label>
        <textarea
          rows={2}
          value={draft.address}
          onChange={e => patch({ address: e.target.value })}
          className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
          placeholder="Street, city, region"
        />
      </div>

      <div>
        <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Document type *</label>
        <select
          value={draft.document_type}
          onChange={e => patch({ document_type: e.target.value as DocumentType })}
          className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 focus:outline-none focus:border-brand-red transition-colors"
        >
          {documentTypes.map(doc => (
            <option key={doc.key} value={doc.key}>{doc.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Upload document *</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={e => handleUpload(e.target.files)}
        />
        <div className="border border-dashed border-black/15 p-5">
          {draft.document_url ? (
            <div className="space-y-3 text-center">
              {draft.document_url.startsWith('data:application/pdf') ? (
                <FileText className="w-12 h-12 text-brand-red mx-auto" />
              ) : (
                <img src={draft.document_url} alt="ID document" className="max-h-40 mx-auto border border-black/10" />
              )}
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-brand-gray hover:text-gray-900 transition-colors"
              >
                Replace document
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 flex flex-col items-center gap-2 text-brand-gray hover:text-gray-900 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              ) : (
                <Upload className="w-8 h-8 text-brand-red/70" />
              )}
              <span className="text-xs uppercase tracking-widest">Upload ID document</span>
              <span className="text-[10px] text-brand-gray">JPG, PNG, or PDF</span>
            </button>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-5 py-2.5 text-sm transition-all hover:shadow-[0_0_25px_rgba(174,33,25,0.6)] disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save verification</>}
      </button>
    </motion.form>
  );
}
