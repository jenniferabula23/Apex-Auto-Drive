import type { LocationKey } from '../../data/vehicles';
import { locations } from '../../data/vehicles';
import type { RegionalPricing } from '../types';
import { adminAlert, adminInput, adminPanel } from './adminUi';

type Props = {
  value: RegionalPricing;
  onChange: (next: RegionalPricing) => void;
};

const regionalKeys = locations.filter(l => l.key !== 'accra');

export default function RegionalPricingForm({ value, onChange }: Props) {
  const setAccra = (accra: number) => onChange({ ...value, accra });
  const setRegional = (key: LocationKey, price: number | undefined) =>
    onChange({ ...value, [key]: price });

  return (
    <div className="space-y-6">
      <div className={adminAlert}>
        <p className="text-white text-sm font-semibold mb-1">Accra — fixed pickup rate</p>
        <p className="text-brand-gray text-xs mb-3">
          All vehicles are picked up in Accra. This is the fixed daily rate for Accra rentals.
        </p>
        <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">
          Accra price (GHS/day) *
        </label>
        <input
          type="number"
          min={0}
          value={value.accra || ''}
          onChange={e => setAccra(Number(e.target.value))}
          className={`${adminInput} max-w-xs`}
        />
      </div>

      <div>
        <p className="text-white text-sm font-semibold mb-1">Regional pricing (from rates)</p>
        <p className="text-brand-gray text-xs mb-4">
          Optional higher rates when the vehicle travels outside Accra. Shown as &quot;From&quot; on the vehicle detail page.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {regionalKeys.map(region => (
            <div key={region.key} className={`${adminPanel} p-4`}>
              <label className="text-sm text-white block mb-2">{region.label}</label>
              <div className="flex items-center gap-2">
                <span className="text-brand-gray text-xs">From GHS</span>
                <input
                  type="number"
                  min={0}
                  value={value[region.key] ?? ''}
                  onChange={e => {
                    const raw = e.target.value;
                    setRegional(region.key, raw === '' ? undefined : Number(raw));
                  }}
                  placeholder="Not offered"
                  className={`${adminInput} flex-1`}
                />
                <span className="text-brand-gray text-xs">/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
