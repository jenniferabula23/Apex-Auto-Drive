import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Loader2 } from 'lucide-react';
import { fetchUserBookings } from '../../lib/bookings';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../lib/supabase';
import { useCurrency } from '../../context/CurrencyContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const statusStyles: Record<string, string> = {
  pending: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  confirmed: 'border-brand-red/40 text-brand-red bg-brand-red/10',
  completed: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10',
  cancelled: 'border-white/20 text-brand-gray bg-white/5',
};

export default function BookingHistory() {
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

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Archive"
        title="Booking History"
        description="A record of every premium drive you've experienced with us."
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-red animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 text-center text-brand-gray">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              className="grid md:grid-cols-[80px_1fr_auto_auto] gap-5 items-center bg-black/50 backdrop-blur-xl border border-white/10 hover:border-brand-red/40 p-4 transition-colors"
            >
              <img src={b.vehicle_image} alt={b.vehicle_name} className="w-20 h-16 object-cover" />
              <div>
                <p className="font-heading font-semibold text-white">{b.vehicle_name}</p>
                <p className="text-[10px] text-brand-gray uppercase tracking-widest mb-1">{b.booking_ref}</p>
                <div className="flex flex-wrap gap-3 text-xs text-brand-gray">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.pickup_date} → {b.return_date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.pickup_location}</span>
                </div>
              </div>
              <p className="text-brand-red font-bold font-heading">{format(Number(b.total_amount))}</p>
              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest border ${statusStyles[b.status] ?? statusStyles.pending}`}>
                {b.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
