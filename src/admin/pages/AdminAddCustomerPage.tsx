import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Loader2, Save, Upload } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { AdminCustomerDraft, DocumentType } from '../types';
import { adminCard, adminInput, adminPanel } from '../components/adminUi';
import { uploadCustomerDocument } from '../lib/customerDocumentUpload';

const steps = ['Full Name', 'Contact Details', 'Document Type', 'Upload Document', 'Review'] as const;

const documentTypes: { key: DocumentType; label: string }[] = [
  { key: 'national_id', label: 'National ID (Ghana Card)' },
  { key: 'passport', label: 'Passport' },
  { key: 'drivers_license', label: "Driver's License" },
  { key: 'other', label: 'Other ID Document' },
];

const emptyDraft = (): AdminCustomerDraft => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  licenseNumber: '',
  documentType: 'national_id',
  documentUrl: '',
});

export default function AdminAddCustomerPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<AdminCustomerDraft>(emptyDraft);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (partial: Partial<AdminCustomerDraft>) =>
    setDraft(prev => ({ ...prev, ...partial }));

  const customerId = `cus-${draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'new'}`;

  const goNext = () => {
    setError(null);
    if (step === 0 && !draft.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (step === 1) {
      if (!draft.email.trim() || !draft.phone.trim()) {
        setError('Email and phone are required.');
        return;
      }
      if (!draft.address.trim() || !draft.licenseNumber.trim()) {
        setError('Address and license number are required.');
        return;
      }
    }
    if (step === 3 && !draft.documentUrl) {
      setError('Please upload an identification document.');
      return;
    }
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const url = await uploadCustomerDocument(file, customerId);
      patch({ documentUrl: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Document upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    setError(null);
    try {
      const created = adminStore.addCustomer(draft);
      navigate('/admin/users', { state: { createdName: created.name } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer');
    }
  };

  const selectedDocLabel = documentTypes.find(d => d.key === draft.documentType)?.label;

  return (
    <div className="space-y-8">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-brand-gray hover:text-white text-sm">
        <ChevronLeft className="w-4 h-4" />
        Back to users
      </Link>

      <DashboardHeader
        eyebrow="Customers"
        title="Add User"
        description="Register clients who cannot sign up or book online themselves."
      />

      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => i < step && setStep(i)}
            className={`px-3 py-2 text-[10px] sm:text-xs tracking-wider uppercase transition-all ${
              step === i
                ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(174,33,25,0.4)]'
                : i < step
                  ? 'border border-brand-red/30 text-white hover:bg-brand-red/10'
                  : 'border border-white/10 text-brand-gray'
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-brand-red text-sm bg-brand-red/10 border border-brand-red/20 px-4 py-3">{error}</p>
      )}

      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6`}>
          <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Full name *</label>
          <input
            className={adminInput}
            value={draft.name}
            onChange={e => patch({ name: e.target.value })}
            placeholder="e.g. Kwame Asante"
            autoFocus
          />
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Email *</label>
              <input type="email" className={adminInput} value={draft.email} onChange={e => patch({ email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Phone *</label>
              <input className={adminInput} value={draft.phone} onChange={e => patch({ phone: e.target.value })} placeholder="+233 …" />
            </div>
          </div>
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Address *</label>
            <textarea rows={2} className={adminInput} value={draft.address} onChange={e => patch({ address: e.target.value })} placeholder="Street, city, region" />
          </div>
          <div>
            <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">License number *</label>
            <input className={adminInput} value={draft.licenseNumber} onChange={e => patch({ licenseNumber: e.target.value })} placeholder="e.g. GH-DL-123456" />
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6`}>
          <label className="text-xs text-brand-gray uppercase tracking-widest block mb-3">Document type *</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {documentTypes.map(doc => (
              <button
                key={doc.key}
                type="button"
                onClick={() => patch({ documentType: doc.key })}
                className={`${adminCard} p-4 text-left transition-all ${
                  draft.documentType === doc.key
                    ? 'border-brand-red ring-1 ring-brand-red/40'
                    : 'hover:border-white/20'
                }`}
              >
                <FileText className="w-5 h-5 text-brand-red mb-2" />
                <p className="text-white text-sm font-medium">{doc.label}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          <p className="text-brand-gray text-sm">
            Upload <span className="text-white">{selectedDocLabel}</span> for {draft.name || 'this customer'}.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
          <div className="border border-dashed border-white/15 p-6 text-center">
            {draft.documentUrl ? (
              <div className="space-y-4">
                {draft.documentUrl.startsWith('data:application/pdf') ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <FileText className="w-12 h-12 text-brand-red" />
                    <p className="text-white text-sm">PDF document uploaded</p>
                  </div>
                ) : (
                  <img src={draft.documentUrl} alt="ID document" className="max-h-48 mx-auto border border-white/10" />
                )}
                <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="btn-outline text-xs">
                  Replace document
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-10 flex flex-col items-center gap-2 text-brand-gray hover:text-white transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
                ) : (
                  <Upload className="w-8 h-8 text-brand-red/70" />
                )}
                <span className="text-xs uppercase tracking-widest">Upload identification document</span>
                <span className="text-[10px] text-brand-gray">JPG, PNG, or PDF</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-brand-gray">Name:</span> <span className="text-white ml-2">{draft.name}</span></div>
            <div><span className="text-brand-gray">Email:</span> <span className="text-white ml-2">{draft.email}</span></div>
            <div><span className="text-brand-gray">Phone:</span> <span className="text-white ml-2">{draft.phone}</span></div>
            <div><span className="text-brand-gray">License:</span> <span className="text-white ml-2">{draft.licenseNumber}</span></div>
            <div className="sm:col-span-2"><span className="text-brand-gray">Address:</span> <span className="text-white ml-2">{draft.address}</span></div>
            <div><span className="text-brand-gray">Document:</span> <span className="text-white ml-2">{selectedDocLabel}</span></div>
            <div><span className="text-brand-gray">Uploaded:</span> <span className="text-white ml-2">{draft.documentUrl ? 'Yes' : 'No'}</span></div>
          </div>
          {draft.documentUrl && !draft.documentUrl.startsWith('data:application/pdf') && (
            <img src={draft.documentUrl} alt="Document preview" className="max-h-32 border border-white/10" />
          )}
        </motion.div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={goBack} className="btn-outline inline-flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={goNext} className="btn-primary inline-flex items-center gap-2">
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save user
          </button>
        )}
      </div>
    </div>
  );
}
