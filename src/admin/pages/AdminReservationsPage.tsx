import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, RefreshCw, Search, Settings2 } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import { syncReservationToSupabase, syncReservationUpdateToSupabase } from '../lib/bookingSync';
import type { PaymentStatus, Reservation, ReservationStatus } from '../types';
import { adminCard, adminInput } from '../components/adminUi';
import AdminStatusBadge from '../components/AdminStatusBadge';
import { paymentStatusLabel, reservationStatusLabel } from '../lib/statusLabels';
import { formatCurrency } from '../../utils/currency';

const statusTone = (status: ReservationStatus) => {
  if (status === 'confirmed') return 'green';
  if (status === 'pending') return 'yellow';
  if (status === 'cancelled') return 'red';
  return 'gray';
};

const paymentTone = (status: PaymentStatus) => {
  if (status === 'paid') return 'green';
  if (status === 'invoiced') return 'orange';
  if (status === 'not_required') return 'purple';
  return 'red';
};

function ReservationManagePanel({
  reservation,
  onUpdate,
}: {
  reservation: Reservation;
  onUpdate: () => void;
}) {
  const syncToSupabase = (updated: Reservation) => {
    if (!reservation.customerId) return;
    const customer = adminStore.getCustomerById(reservation.customerId);
    if (!customer) return;
    void syncReservationUpdateToSupabase(updated, customer, updated.supabaseBookingId);
  };

  const updateBookingStatus = (status: ReservationStatus) => {
    adminStore.updateReservation(reservation.id, { status });
    const updated = adminStore.getReservations().find(r => r.id === reservation.id);
    if (updated) syncToSupabase(updated);
    onUpdate();
  };

  const updatePaymentStatus = (paymentStatus: PaymentStatus) => {
    adminStore.updateReservationPaymentStatus(reservation.id, paymentStatus);
    const updated = adminStore.getReservations().find(r => r.id === reservation.id);
    if (updated) syncToSupabase(updated);
    onUpdate();
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <p className="text-[10px] text-brand-gray uppercase tracking-widest">Booking status</p>
        <p className="text-xs text-brand-gray mb-2">
          Current: <AdminStatusBadge label={reservationStatusLabel[reservation.status]} tone={statusTone(reservation.status)} />
        </p>
        <select
          value={reservation.status}
          onChange={e => updateBookingStatus(e.target.value as ReservationStatus)}
          className={`${adminInput} text-sm`}
        >
          {(Object.entries(reservationStatusLabel) as [ReservationStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] text-brand-gray uppercase tracking-widest">Payment status</p>
        <p className="text-xs text-brand-gray mb-2">
          Current: <AdminStatusBadge label={paymentStatusLabel[reservation.paymentStatus]} tone={paymentTone(reservation.paymentStatus)} />
        </p>
        <select
          value={reservation.paymentStatus}
          onChange={e => updatePaymentStatus(e.target.value as PaymentStatus)}
          className={`${adminInput} text-sm`}
        >
          {(Object.entries(paymentStatusLabel) as [PaymentStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function AdminReservationsPage() {
  const location = useLocation();
  const createdRef = (location.state as { createdRef?: string } | null)?.createdRef;
  const [reservations, setReservations] = useState(() => adminStore.getReservations());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = () => setReservations(adminStore.getReservations());

  const filtered = useMemo(
    () =>
      reservations.filter(r => {
        const matchesFilter = filter === 'all' || r.status === filter;
        const q = query.toLowerCase();
        const matchesQuery =
          !q ||
          r.bookingRef.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.vehicleName.toLowerCase().includes(q);
        return matchesFilter && matchesQuery;
      }),
    [reservations, query, filter],
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Bookings"
        title="Reservations"
        description="View and manage customer bookings. Create manual reservations for clients who cannot book online."
        action={
          <Link to="/admin/reservations/new" className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            New reservation
          </Link>
        }
      />

      {createdRef && (
        <p className="text-sm text-green-800 bg-green-50 border border-green-700/20 px-4 py-3">
          Reservation <span className="font-mono">{createdRef}</span> created successfully.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
          <input
            placeholder="Search ref, customer, vehicle…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={`${adminInput} pl-10`}
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as ReservationStatus | 'all')} className={`${adminInput} sm:w-44`}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2 justify-center">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className={`${adminCard} p-8 text-center text-brand-gray text-sm`}>No reservations match your filters.</div>
        ) : (
          filtered.map((res, i) => {
            const isExpanded = expandedId === res.id;
            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`${adminCard} p-5`}
              >
                <div className="flex flex-col lg:flex-row gap-5">
                  <img src={res.vehicleImage} alt={res.vehicleName} className="w-full lg:w-32 h-24 object-cover border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-brand-red">{res.bookingRef}</span>
                      <AdminStatusBadge label={reservationStatusLabel[res.status]} tone={statusTone(res.status)} />
                      <AdminStatusBadge label={paymentStatusLabel[res.paymentStatus]} tone={paymentTone(res.paymentStatus)} />
                    </div>
                    <h3 className="text-gray-900 font-semibold">{res.customerName}</h3>
                    <p className="text-brand-gray text-sm">{res.vehicleName} · {res.rentalModule.replace('_', ' ')}</p>
                    <p className="text-brand-gray text-xs mt-1">
                      {res.pickupLocation} · {res.pickupDate}
                      {res.pickupTime ? ` ${res.pickupTime}` : ''} → {res.returnDate}
                      {res.returnTime ? ` ${res.returnTime}` : ''} ({res.days}d)
                    </p>
                    {res.notes && <p className="text-brand-gray text-xs mt-2 italic">{res.notes}</p>}
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <p className="text-gray-900 font-heading font-bold text-xl">{formatCurrency(res.totalAmount)}</p>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : res.id)}
                      className="btn-outline inline-flex items-center gap-2 text-xs"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Update status
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <ReservationManagePanel reservation={res} onUpdate={refresh} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
