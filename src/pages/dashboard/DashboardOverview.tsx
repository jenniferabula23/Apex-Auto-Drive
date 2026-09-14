import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Car,
  Calendar,
  MapPin,
  Clock,
  Award,
  Route,
  Heart,
  ArrowRight,
  Sparkles,
  Bell,
  Gift,
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import { supabase } from '../../lib/supabase';
import { fetchUserBookings } from '../../lib/bookings';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../lib/supabase';

function timeRemaining(returnDate: string) {
  if (!returnDate) return null;
  const target = new Date(returnDate).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<number>(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user?.email) return;
    fetchUserBookings(user.id, user.email).then(data => setBookings(data));

    supabase
      .from('favorites')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count }) => setFavorites(count ?? 0));
  }, [user]);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const active = useMemo(
    () => bookings.find(b => b.status === 'pending' || b.status === 'confirmed') ?? bookings[0],
    [bookings]
  );

  const totalDistance = bookings.reduce((sum, b) => sum + b.days * 120, 0);
  const loyaltyPoints = bookings.length * 250;
  const favoriteVehicle = bookings[0]?.vehicle_name ?? 'None yet';

  const remaining = active ? timeRemaining(active.return_date) : null;
  void tick;

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Driver';

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-white border border-black/10 p-8 lg:p-12"
      >
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-brand-red/15 rounded-full blur-[100px]" />
        <motion.div
          className="absolute top-10 right-10 w-2 h-2 bg-orange-400 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-12 right-32 w-1.5 h-1.5 bg-yellow-400 rounded-full"
          animate={{ y: [0, -16, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-red" />
            <span className="font-mono text-xs text-brand-red tracking-[0.4em] uppercase">Member Hub</span>
          </div>
          <h1 className="font-heading font-black text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
            Welcome Back, <span className="text-brand-red">{displayName}</span>
          </h1>
          <p className="text-brand-gray text-lg">Your premium driving experience awaits.</p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-6 py-3 text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(174,33,25,0.6)]"
            >
              Browse Fleet <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard/rentals"
              className="inline-flex items-center gap-2 border border-black/10 hover:border-brand-red/50 text-gray-900 px-6 py-3 text-sm transition-all"
            >
              View Rentals
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Active Rental */}
      {active ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-brand-red/30 via-orange-500/10 to-transparent blur-xl opacity-60 pointer-events-none" />
          <div className="relative bg-white border border-black/10 overflow-hidden">
            <div className="grid lg:grid-cols-5">
              <div className="lg:col-span-2 relative h-64 lg:h-auto overflow-hidden">
                <motion.img
                  src={active.vehicle_image}
                  alt={active.vehicle_name}
                  className="w-full h-full object-cover"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-brand-red/20 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-brand-red/90 text-white text-[10px] tracking-widest uppercase font-bold">
                  Active
                </div>
              </div>

              <div className="lg:col-span-3 p-8 lg:p-10">
                <p className="font-mono text-xs text-brand-red tracking-[0.4em] uppercase mb-2">Current Rental</p>
                <h3 className="font-heading font-black text-3xl text-gray-900 mb-1">{active.vehicle_name}</h3>
                <p className="text-brand-gray text-sm mb-6">Booking {active.booking_ref}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-brand-red mt-1" />
                    <div>
                      <p className="text-xs text-brand-gray uppercase tracking-wider">Pickup</p>
                      <p className="text-gray-900 text-sm">{active.pickup_date || 'TBC'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-brand-red mt-1" />
                    <div>
                      <p className="text-xs text-brand-gray uppercase tracking-wider">Return</p>
                      <p className="text-gray-900 text-sm">{active.return_date || 'TBC'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-red mt-1" />
                    <div>
                      <p className="text-xs text-brand-gray uppercase tracking-wider">Location</p>
                      <p className="text-gray-900 text-sm">{active.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-brand-red mt-1" />
                    <div>
                      <p className="text-xs text-brand-gray uppercase tracking-wider">Duration</p>
                      <p className="text-gray-900 text-sm">{active.days} day{active.days > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Countdown */}
                <div className="border-t border-black/10 pt-5 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-brand-gray uppercase tracking-widest">Time Remaining</span>
                  </div>
                  {remaining ? (
                    <motion.div
                      key={`${remaining.days}-${remaining.hours}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="font-heading font-black text-3xl text-gray-900 drop-shadow-[0_0_10px_rgba(174,33,25,0.6)]">
                        {remaining.days}
                      </span>
                      <span className="text-xs text-brand-gray uppercase tracking-widest">Days</span>
                      <span className="font-heading font-black text-3xl text-gray-900 ml-3 drop-shadow-[0_0_10px_rgba(174,33,25,0.6)]">
                        {remaining.hours}
                      </span>
                      <span className="text-xs text-brand-gray uppercase tracking-widest">Hours</span>
                    </motion.div>
                  ) : (
                    <span className="text-sm text-brand-gray">No active timer</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        <div className="bg-white border border-black/10 p-10 text-center">
          <Car className="w-10 h-10 text-brand-red mx-auto mb-4" />
          <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">No Active Rentals</h3>
          <p className="text-brand-gray text-sm mb-6">Book a vehicle to start your premium driving experience.</p>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-6 py-3 text-sm transition-all hover:shadow-[0_0_30px_rgba(174,33,25,0.6)]"
          >
            Browse Fleet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Car} label="Total Rentals" value={String(bookings.length)} delay={0.1} />
        <StatsCard icon={Award} label="Loyalty Points" value={loyaltyPoints.toLocaleString()} hint="Elite" delay={0.2} />
        <StatsCard icon={Heart} label="Favorite Vehicles" value={String(favorites)} delay={0.3} />
        <StatsCard icon={Route} label="Distance Driven" value={`${totalDistance.toLocaleString()} km`} delay={0.4} />
      </section>

      {/* Notifications */}
      <section className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-black/10 p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-brand-red" />
            <h4 className="font-heading font-semibold text-gray-900">Notifications</h4>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Booking confirmed', body: 'Your booking is being processed.', tone: 'red' },
              { title: 'Loyalty milestone', body: 'Earn double points this weekend.', tone: 'orange' },
              { title: 'New arrivals', body: 'Three new luxury vehicles added.', tone: 'yellow' },
            ].map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-50 border border-black/5 hover:border-brand-red/30 transition-colors"
              >
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    n.tone === 'red' ? 'bg-brand-red shadow-[0_0_10px_rgba(174,33,25,0.8)]'
                      : n.tone === 'orange' ? 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]'
                      : 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                  }`}
                />
                <div>
                  <p className="text-sm text-gray-900">{n.title}</p>
                  <p className="text-xs text-brand-gray">{n.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-br from-brand-red/20 via-black to-black border border-brand-red/30 p-6"
        >
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <Gift className="w-8 h-8 text-brand-red mb-3" />
            <h4 className="font-heading font-bold text-2xl text-white mb-2">Elite Member Reward</h4>
            <p className="text-brand-gray text-sm mb-1">Favorite vehicle</p>
            <p className="text-white font-semibold mb-4">{favoriteVehicle}</p>
            <p className="text-brand-gray text-sm mb-5">
              Unlock 15% off your next premium booking. Valid for the next 14 days.
            </p>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-brand-red text-white px-4 py-2 text-xs transition-colors"
            >
              Redeem <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
