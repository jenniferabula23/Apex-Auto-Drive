import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';

export default function BookingForm() {
  const [location, setLocation] = useState('Accra');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/vehicles');
  };

  const inputClass =
    'w-full min-w-0 max-w-full box-border bg-white border border-black/10 text-gray-900 text-sm outline-none focus:border-brand-red/50 transition-colors [color-scheme:light]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.7 }}
      className="relative group w-full min-w-0"
    >
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-brand-red/20 to-transparent rounded-sm opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div
        className="relative w-full min-w-0 overflow-hidden bg-white/75 backdrop-blur-2xl border border-black/10 p-4 sm:p-6 md:p-8 hover:border-black/20 transition-colors duration-300"
        style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <form onSubmit={handleSearch} className="w-full min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 w-full min-w-0">
            <div className="min-w-0 w-full">
              <label className="block text-xs text-brand-gray uppercase tracking-widest mb-2">Pickup Location</label>
              <div className="relative w-full min-w-0">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red pointer-events-none z-10" />
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className={`${inputClass} pl-10 pr-4 py-3 appearance-none cursor-pointer`}
                >
                  <option value="Accra" className="bg-white">Accra</option>
                </select>
              </div>
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-xs text-brand-gray uppercase tracking-widest mb-2">Pickup Date</label>
              <div className="relative w-full min-w-0">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red pointer-events-none z-10" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${inputClass} pl-10 pr-3 py-3`}
                />
              </div>
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-xs text-brand-gray uppercase tracking-widest mb-2">Pickup Time</label>
              <div className="relative w-full min-w-0">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red pointer-events-none z-10" />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  className={`${inputClass} pl-10 pr-3 py-3`}
                />
              </div>
            </div>

            <div className="min-w-0 w-full sm:col-span-2 lg:col-span-1">
              <label className="block text-xs text-brand-gray uppercase tracking-widest mb-2">Return Date</label>
              <div className="relative w-full min-w-0">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red pointer-events-none z-10" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  min={pickupDate || new Date().toISOString().split('T')[0]}
                  className={`${inputClass} pl-10 pr-3 py-3`}
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-brand-red hover:bg-brand-red-light text-white font-semibold py-4 flex items-center justify-center gap-3 tracking-widest uppercase text-sm transition-all duration-300 hover:shadow-[0_0_50px_rgba(174,33,25,0.7)] group relative overflow-hidden"
          >
            <Search className="w-4 h-4" />
            <span>Search Available Vehicles</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
