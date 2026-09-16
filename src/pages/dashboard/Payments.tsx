import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, Receipt, Plus } from 'lucide-react';
import { fetchUserBookings } from '../../lib/bookings';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../lib/supabase';
import { useCurrency } from '../../context/CurrencyContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export default function Payments() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    fetchUserBookings(user.id, user.email).then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, [user]);

  const totalSpent = bookings.reduce((sum, b) => sum + Number(b.total_amount), 0);

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Billing"
        title="Payments"
        description="Manage payment methods and review transaction history."
      />

      {/* Premium card */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden h-56 group"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-brand-red/40 via-orange-500/10 to-transparent blur-xl opacity-70" />
          <div className="relative h-full bg-gradient-to-br from-[#1a0606] via-black to-[#0a0606] border border-brand-red/30 p-7 flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-red/30 rounded-full blur-3xl" />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-[10px] text-brand-gray uppercase tracking-wide">Apex Auto Drive</p>
                <p className="text-xs text-brand-gray mt-1">Elite Member Card</p>
              </div>
              <CreditCard className="w-7 h-7 text-brand-red" />
            </div>
            <div className="relative">
              <p className="font-mono text-base sm:text-xl text-white tracking-[0.2em] sm:tracking-[0.3em]">•••• •••• •••• 4729</p>
              <div className="flex justify-between mt-4">
                <div>
                  <p className="text-[10px] text-brand-gray uppercase tracking-widest">Holder</p>
                  <p className="text-sm text-white truncate max-w-[180px]">{user?.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-gray uppercase tracking-widest">Expires</p>
                  <p className="text-sm text-white">12/29</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-black/10 p-7 flex flex-col justify-between"
        >
          <div>
            <p className="text-[10px] text-brand-gray uppercase tracking-wide">Lifetime Spend</p>
            <p className="font-heading font-black text-4xl text-gray-900 mt-3">
              {format(totalSpent)}
            </p>
            <p className="text-brand-gray text-sm mt-1">{bookings.length} total bookings</p>
          </div>
          <button className="mt-6 inline-flex items-center justify-center gap-2 border border-brand-brown/35 bg-surface-paper text-gray-900 hover:border-brand-red/50 hover:bg-brand-red/5 px-4 py-2.5 text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Payment Method
          </button>
        </motion.div>
      </div>

      {/* Transaction list */}
      <div>
        <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-brand-red" /> Transactions
        </h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-brand-red animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-black/10 p-8 text-center text-brand-gray">No transactions yet.</div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center bg-white border border-black/10 hover:border-brand-red/30 px-4 py-3 transition-colors"
              >
                <div>
                  <p className="text-gray-900 text-sm font-medium">{b.vehicle_name}</p>
                  <p className="text-xs text-brand-gray">{b.booking_ref} · {new Date(b.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest border ${
                  b.payment_status === 'paid' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' :
                  b.payment_status === 'invoiced' ? 'border-orange-500/40 text-orange-400 bg-orange-500/10' :
                  'border-black/20 text-brand-gray'
                }`}>
                  {b.payment_status}
                </span>
                <p className="text-brand-red font-bold font-heading">{format(Number(b.total_amount))}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
