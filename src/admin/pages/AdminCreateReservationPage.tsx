import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, User } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import {
  formatLocationPriceLabel,
  formatPickupLocation,
  getVehicleLocations,
  isRegionalLocation,
  locations,
  regionDestinationHints,
} from '../../data/vehicles';
import type { LocationKey } from '../../data/vehicles';
import { useCurrency } from '../../context/CurrencyContext';
import { adminStore } from '../store/adminStore';
import { syncReservationToSupabase } from '../lib/bookingSync';
import type { AdminReservationDraft, RentalModuleKey } from '../types';
import { adminCard, adminInput, adminPanel } from '../components/adminUi';
import { paymentStatusLabel } from '../lib/statusLabels';
import { formatCurrency } from '../../utils/currency';

const steps = [
  'Select User',
  'Select Vehicle',
  'Destination',
  'Pickup Date',
  'Return Date',
  'Times',
  'Rate',
  'Review',
] as const;

const rentalModules: { key: RentalModuleKey; label: string }[] = [
  { key: 'self_drive', label: 'Self Drive' },
  { key: 'chauffeur', label: 'Chauffeur' },
  { key: 'airport_pickup', label: 'Airport Pickup' },
];

const emptyDraft = (): AdminReservationDraft => ({
  customerId: '',
  vehicleId: '',
  locationKey: 'accra',
  destinationDetails: '',
  pickupDate: '',
  pickupTime: '09:00',
  returnDate: '',
  returnTime: '17:00',
  pricePerDay: 0,
  rentalModule: 'self_drive',
  notes: '',
  status: 'confirmed',
  paymentStatus: 'invoiced',
});

export default function AdminCreateReservationPage() {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const customers = useMemo(() => adminStore.getCustomers().filter(c => c.status === 'active'), []);
  const vehicles = useMemo(() => adminStore.getVehicles(), []);

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<AdminReservationDraft>(emptyDraft);
  const [customerQuery, setCustomerQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const patch = (partial: Partial<AdminReservationDraft>) =>
    setDraft(prev => ({ ...prev, ...partial }));

  const selectedCustomer = customers.find(c => c.id === draft.customerId);
  const selectedVehicle = vehicles.find(v => v.id === draft.vehicleId);
  const locationKey = draft.locationKey as LocationKey;
  const availableLocations = selectedVehicle ? getVehicleLocations(selectedVehicle) : locations;
  const destinationHint = isRegionalLocation(locationKey)
    ? regionDestinationHints[locationKey]
    : null;

  const rentalDays = useMemo(() => {
    if (!draft.pickupDate || !draft.returnDate) return 1;
    const pickup = new Date(`${draft.pickupDate}T00:00:00`);
    const returnDay = new Date(`${draft.returnDate}T00:00:00`);
    return Math.max(
      1,
      Math.ceil((returnDay.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)) || 1,
    );
  }, [draft.pickupDate, draft.returnDate]);

  const rateOptions = useMemo(() => {
    if (!selectedVehicle) return [];
    return availableLocations
      .map(loc => {
        const price = selectedVehicle.pricePerDay[loc.key];
        if (price == null) return null;
        return {
          key: loc.key,
          label: loc.label,
          price,
          display: formatLocationPriceLabel(loc.key, price, format),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [selectedVehicle, availableLocations, format]);

  const totalAmount = draft.pricePerDay * rentalDays;
  const regionLabel = locations.find(loc => loc.key === locationKey)?.label ?? locationKey;
  const pickupLocation = formatPickupLocation(regionLabel, draft.destinationDetails);

  const filteredCustomers = customers.filter(c => {
    const q = customerQuery.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const goNext = () => {
    setError(null);
    if (step === 0 && !draft.customerId) {
      setError('Please select a customer.');
      return;
    }
    if (step === 1 && !draft.vehicleId) {
      setError('Please select a vehicle.');
      return;
    }
    if (step === 2) {
      if (isRegionalLocation(locationKey) && !draft.destinationDetails.trim()) {
        setError('Please enter the destination within the selected region.');
        return;
      }
    }
    if (step === 3) {
      if (!draft.pickupDate) {
        setError('Pickup date is required.');
        return;
      }
    }
    if (step === 4) {
      if (!draft.returnDate) {
        setError('Return date is required.');
        return;
      }
      if (new Date(draft.returnDate) < new Date(draft.pickupDate)) {
        setError('Return date must be on or after pickup date.');
        return;
      }
    }
    if (step === 5) {
      if (!draft.pickupTime || !draft.returnTime) {
        setError('Pickup and return times are required.');
        return;
      }
    }
    if (step === 6 && !draft.pricePerDay) {
      setError('Please select a daily rate.');
      return;
    }
    setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const created = adminStore.createReservation(draft);
      const customer = adminStore.getCustomerById(draft.customerId);
      if (customer) {
        const { id: supabaseBookingId, error: syncError } = await syncReservationToSupabase(created, customer);
        if (syncError) {
          console.warn('Supabase sync failed:', syncError);
        }
        if (supabaseBookingId) {
          adminStore.updateReservation(created.id, { supabaseBookingId });
        }
      }
      navigate('/admin/reservations', {
        state: { createdRef: created.bookingRef },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reservation');
    }
  };

  const selectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;
    const locs = getVehicleLocations(vehicle);
    const firstLoc = locs[0]?.key ?? 'accra';
    const price = vehicle.pricePerDay[firstLoc] ?? vehicle.pricePerDay.accra;
    patch({
      vehicleId,
      locationKey: firstLoc,
      destinationDetails: '',
      pricePerDay: price,
    });
  };

  const selectLocation = (key: LocationKey) => {
    if (!selectedVehicle) return;
    const price = selectedVehicle.pricePerDay[key] ?? selectedVehicle.pricePerDay.accra;
    patch({
      locationKey: key,
      destinationDetails: isRegionalLocation(key) ? draft.destinationDetails : '',
      pricePerDay: price,
    });
  };

  return (
    <div className="space-y-8">
      <Link
        to="/admin/reservations"
        className="inline-flex items-center gap-2 text-brand-gray hover:text-gray-900 text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to reservations
      </Link>

      <DashboardHeader
        eyebrow="Bookings"
        title="New Reservation"
        description="Create a booking manually for clients who cannot book from the website."
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
                  ? 'border border-brand-red/30 text-gray-900 hover:bg-brand-red/10'
                  : 'border border-gray-200 text-brand-gray'
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-brand-gray text-sm">Choose an existing customer or add a new one.</p>
            <Link to="/admin/users/new" className="btn-outline text-xs inline-flex items-center gap-2 justify-center">
              <User className="w-3.5 h-3.5" />
              Add new user
            </Link>
          </div>
          <input
            className={adminInput}
            placeholder="Search by name, email, or phone…"
            value={customerQuery}
            onChange={e => setCustomerQuery(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {filteredCustomers.map(customer => (
              <button
                key={customer.id}
                type="button"
                onClick={() => patch({ customerId: customer.id })}
                className={`${adminCard} p-4 text-left transition-all ${
                  draft.customerId === customer.id
                    ? 'border-brand-red ring-1 ring-brand-red/40'
                    : 'hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-red/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{customer.name}</p>
                    <p className="text-brand-gray text-xs">{customer.email}</p>
                    <p className="text-brand-gray text-xs">{customer.phone}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredCustomers.length === 0 && (
            <p className="text-brand-gray text-sm text-center py-6">No customers match your search.</p>
          )}
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6`}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[28rem] overflow-y-auto">
            {vehicles.map(vehicle => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => selectVehicle(vehicle.id)}
                className={`${adminCard} overflow-hidden text-left transition-all ${
                  draft.vehicleId === vehicle.id
                    ? 'border-brand-red ring-1 ring-brand-red/40'
                    : 'hover:border-gray-200'
                }`}
              >
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <p className="text-gray-900 font-medium text-sm">{vehicle.name}</p>
                  <p className="text-brand-gray text-xs">{vehicle.category} · {vehicle.seats} seats</p>
                  <p className="text-brand-red text-sm font-semibold mt-1">
                    From {formatCurrency(vehicle.pricePerDay.accra)}/day
                  </p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          {!selectedVehicle ? (
            <p className="text-brand-gray text-sm">Select a vehicle first.</p>
          ) : (
            <>
              <div>
                <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Destination region</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {availableLocations.map(loc => (
                    <button
                      key={loc.key}
                      type="button"
                      onClick={() => selectLocation(loc.key)}
                      className={`px-4 py-3 text-sm text-left border transition-all ${
                        locationKey === loc.key
                          ? 'border-brand-red bg-brand-red/10 text-gray-900'
                          : 'border-gray-200 text-brand-gray hover:border-gray-200 hover:text-gray-900'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>
              {destinationHint && (
                <div>
                  <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">
                    {destinationHint.label}
                  </label>
                  <input
                    className={adminInput}
                    value={draft.destinationDetails}
                    onChange={e => patch({ destinationDetails: e.target.value })}
                    placeholder={destinationHint.placeholder}
                  />
                  <p className="text-brand-gray text-xs mt-2">e.g. {destinationHint.examples}</p>
                </div>
              )}
              <div>
                <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Rental module</label>
                <select
                  className={adminInput}
                  value={draft.rentalModule}
                  onChange={e => patch({ rentalModule: e.target.value as RentalModuleKey })}
                >
                  {rentalModules.map(m => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Notes (optional)</label>
                <textarea
                  rows={2}
                  className={adminInput}
                  value={draft.notes}
                  onChange={e => patch({ notes: e.target.value })}
                  placeholder="Flight details, special requests…"
                />
              </div>
            </>
          )}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6`}>
          <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Pickup date *</label>
          <input
            type="date"
            className={`${adminInput} max-w-sm`}
            value={draft.pickupDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => patch({ pickupDate: e.target.value })}
          />
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6`}>
          <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Return date *</label>
          <input
            type="date"
            className={`${adminInput} max-w-sm`}
            value={draft.returnDate}
            min={draft.pickupDate || new Date().toISOString().split('T')[0]}
            onChange={e => patch({ returnDate: e.target.value })}
          />
          {draft.pickupDate && draft.returnDate && (
            <p className="text-brand-gray text-sm mt-4">
              Rental duration: <span className="text-gray-900 font-medium">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
            </p>
          )}
        </motion.div>
      )}

      {step === 5 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6`}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Pickup time *</label>
              <input
                type="time"
                className={adminInput}
                value={draft.pickupTime}
                onChange={e => patch({ pickupTime: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Return time *</label>
              <input
                type="time"
                className={adminInput}
                value={draft.returnTime}
                onChange={e => patch({ returnTime: e.target.value })}
              />
            </div>
          </div>
        </motion.div>
      )}

      {step === 6 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          {!selectedVehicle ? (
            <p className="text-brand-gray text-sm">Select a vehicle first.</p>
          ) : (
            <>
              <p className="text-brand-gray text-sm">
                Select the daily rate for <span className="text-gray-900">{regionLabel}</span>
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {rateOptions.map(rate => (
                  <button
                    key={rate.key}
                    type="button"
                    onClick={() => patch({ pricePerDay: rate.price, locationKey: rate.key })}
                    className={`${adminCard} p-4 text-left transition-all ${
                      draft.pricePerDay === rate.price && locationKey === rate.key
                        ? 'border-brand-red ring-1 ring-brand-red/40'
                        : 'hover:border-gray-200'
                    }`}
                  >
                    <p className="text-gray-900 font-medium">{rate.label}</p>
                    <p className="text-brand-red font-bold text-lg mt-1">{rate.display}</p>
                  </button>
                ))}
              </div>
              {draft.pricePerDay > 0 && (
                <div className="border-t border-gray-200 pt-4 text-sm">
                  <p className="text-brand-gray">
                    Estimated total:{' '}
                    <span className="text-gray-900 font-bold text-xl">{formatCurrency(totalAmount)}</span>
                    <span className="text-brand-gray ml-2">
                      ({formatCurrency(draft.pricePerDay)} × {rentalDays} days)
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {step === 7 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${adminPanel} p-6 space-y-4`}>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-brand-gray">Customer:</span> <span className="text-gray-900 ml-2">{selectedCustomer?.name}</span></div>
            <div><span className="text-brand-gray">Vehicle:</span> <span className="text-gray-900 ml-2">{selectedVehicle?.name}</span></div>
            <div><span className="text-brand-gray">Destination:</span> <span className="text-gray-900 ml-2">{pickupLocation}</span></div>
            <div><span className="text-brand-gray">Module:</span> <span className="text-gray-900 ml-2">{draft.rentalModule.replace('_', ' ')}</span></div>
            <div>
              <span className="text-brand-gray">Pickup:</span>{' '}
              <span className="text-gray-900 ml-2">{draft.pickupDate} at {draft.pickupTime}</span>
            </div>
            <div>
              <span className="text-brand-gray">Return:</span>{' '}
              <span className="text-gray-900 ml-2">{draft.returnDate} at {draft.returnTime}</span>
            </div>
            <div><span className="text-brand-gray">Rate:</span> <span className="text-brand-red ml-2 font-semibold">{formatCurrency(draft.pricePerDay)}/day</span></div>
            <div><span className="text-brand-gray">Total:</span> <span className="text-gray-900 ml-2 font-bold text-lg">{formatCurrency(totalAmount)}</span></div>
          </div>
          {selectedVehicle && (
            <img src={selectedVehicle.image} alt={selectedVehicle.name} className="w-full max-h-40 object-cover border border-gray-200" />
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Booking status</label>
              <select className={adminInput} value={draft.status} onChange={e => patch({ status: e.target.value as AdminReservationDraft['status'] })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">Payment status</label>
              <select className={adminInput} value={draft.paymentStatus} onChange={e => patch({ paymentStatus: e.target.value as AdminReservationDraft['paymentStatus'] })}>
                {(Object.entries(paymentStatusLabel) as [AdminReservationDraft['paymentStatus'], string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
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
            Create reservation
          </button>
        )}
      </div>
    </div>
  );
}
