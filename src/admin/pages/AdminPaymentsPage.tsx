import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { adminStore } from '../store/adminStore';
import type { Payment, PaymentStatus } from '../types';
import { adminCard, adminInput } from '../components/adminUi';
import AdminStatusBadge from '../components/AdminStatusBadge';
import { paymentStatusLabel } from '../lib/statusLabels';
import { formatCurrency } from '../../utils/currency';

const tone = (status: PaymentStatus) => {
  if (status === 'paid') return 'green';
  if (status === 'invoiced') return 'orange';
  return 'red';
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(() => adminStore.getPayments());
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');

  const refresh = () => setPayments(adminStore.getPayments());

  const filtered = useMemo(
    () => payments.filter(p => filter === 'all' || p.status === filter),
    [payments, filter],
  );

  const totals = useMemo(() => {
    const paid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
    return { paid, pending };
  }, [payments]);

  const markPaid = (id: string) => {
    adminStore.updatePayment(id, {
      status: 'paid',
      paidAt: new Date().toISOString(),
      reference: `MM-${Date.now().toString().slice(-7)}`,
    });
    const payment = adminStore.getPayments().find(p => p.id === id);
    if (payment) {
      adminStore.updateReservation(payment.reservationId, { paymentStatus: 'paid' });
    }
    refresh();
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Finance"
        title="Payments"
        description="Track invoices, mobile money, and bank transfer confirmations."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className={`${adminCard} p-5`}>
          <p className="text-brand-gray text-xs uppercase tracking-widest mb-1">Collected</p>
          <p className="text-2xl font-heading font-bold text-green-400">{formatCurrency(totals.paid)}</p>
        </div>
        <div className={`${adminCard} p-5`}>
          <p className="text-brand-gray text-xs uppercase tracking-widest mb-1">Outstanding</p>
          <p className="text-2xl font-heading font-bold text-orange-400">{formatCurrency(totals.pending)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filter} onChange={e => setFilter(e.target.value as PaymentStatus | 'all')} className={`${adminInput} w-auto min-w-[10rem]`}>
          <option value="all">All payments</option>
          <option value="paid">Paid</option>
          <option value="invoiced">Invoice Sent</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <button type="button" onClick={refresh} className="btn-outline inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((payment, i) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`${adminCard} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-brand-red">{payment.bookingRef}</span>
                <AdminStatusBadge label={paymentStatusLabel[payment.status]} tone={tone(payment.status)} />
              </div>
              <p className="text-gray-900 font-medium">{payment.customerName}</p>
              <p className="text-brand-gray text-sm capitalize">{payment.method.replace('_', ' ')} · {payment.reference}</p>
              {payment.paidAt && (
                <p className="text-brand-gray text-xs mt-1">Paid {new Date(payment.paidAt).toLocaleString()}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <p className="text-gray-900 font-heading font-bold text-lg">{formatCurrency(payment.amount)}</p>
              {payment.status !== 'paid' && (
                <button type="button" onClick={() => markPaid(payment.id)} className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark paid
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
