import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Car, Loader2 } from 'lucide-react';
import { fetchUserBookings } from '../../lib/bookings';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../lib/supabase';
import { useCurrency } from '../../context/CurrencyContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export default function MyRentals() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    fetchUserBookings(user.id, user.email, { statuses: ['pending', 'confirmed'] }).then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Active & Upcoming"
        title="My Rentals"
        description="Track your active and upcoming premium rentals in real time."
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-red animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-black/10 p-10 text-center">
          <Car className="w-10 h-10 text-brand-red mx-auto mb-4" />
          <p className="text-gray-900">No active rentals.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="relative group"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-brand-red/30 to-orange-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
              <div className="relative grid md:grid-cols-[200px_1fr_auto] gap-6 bg-white border border-black/10 p-5 items-center">
                <img src={b.vehicle_image} alt={b.vehicle_name} className="w-full h-32 object-cover" />
                <div>
                  <h4 className="font-heading font-bold text-xl text-gray-900">{b.vehicle_name}</h4>
                  <p className="text-xs text-brand-gray mb-3">{b.booking_ref}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-brand-gray">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-red" />{b.pickup_date} → {b.return_date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-red" />{b.pickup_location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-black text-2xl text-brand-red">{format(Number(b.total_amount))}</p>
                  <span className="inline-block mt-2 px-3 py-1 text-[10px] uppercase tracking-widest border border-brand-red/40 text-brand-red bg-brand-red/10">
                    {b.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
