import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, Fuel, Star, Heart } from 'lucide-react';
import type { Vehicle } from '../data/vehicles';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { supabase } from '../lib/supabase';

interface Props {
  vehicle: Vehicle;
  index?: number;
}

export default function VehicleCard({ vehicle, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();
  const { format } = useCurrency();
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!user) { setFavorited(false); return; }
    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('vehicle_id', String(vehicle.id))
      .maybeSingle()
      .then(({ data }) => setFavorited(!!data));
  }, [user, vehicle.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || favLoading) return;
    setFavLoading(true);
    if (favorited) {
      await supabase.from('favorites').delete().match({ user_id: user.id, vehicle_id: String(vehicle.id) });
      setFavorited(false);
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        vehicle_id: String(vehicle.id),
        vehicle_name: vehicle.name,
        vehicle_image: vehicle.image,
        vehicle_price: vehicle.pricePerDay.accra,
      });
      setFavorited(true);
    }
    setFavLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8 }}
      className="card-vehicle group cursor-pointer relative"
      style={{
        boxShadow: hovered ? `0 30px 80px ${vehicle.glowColor}40, 0 0 0 1px ${vehicle.glowColor}60, inset 0 0 30px ${vehicle.glowColor}10` : '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Favorite */}
      {user && (
        <button
          onClick={toggleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center transition-all duration-300 ${
            favorited
              ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(174,33,25,0.6)]'
              : 'bg-black/60 backdrop-blur text-white border border-white/20 hover:border-brand-red/60 hover:text-brand-red'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Badge */}
      {vehicle.badge && (
        <div className="absolute top-4 left-4 z-10 bg-brand-red text-white text-xs font-semibold px-3 py-1 tracking-wider uppercase">
          {vehicle.badge}
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden h-52 bg-gradient-to-b from-black/20 to-black/5">
        <motion.img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ duration: 0.6, type: 'tween' }}
        />
        {/* Dynamic glow overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: hovered ? 1 : 0,
            background: hovered ? `radial-gradient(ellipse 60% 50% at center 30%, ${vehicle.glowColor}40 0%, transparent 60%)` : 'transparent',
          }}
          transition={{ duration: 0.4 }}
        />
        {/* Reflection sweep animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: hovered ? ['200%', '-100%'] : '-100%' }}
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0, repeatDelay: 2 }}
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          }}
        />
        {/* Bottom glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 blur-2xl"
          animate={{
            opacity: hovered ? 0.8 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(ellipse at center, ${vehicle.glowColor}50 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-brand-gray text-xs uppercase tracking-widest mb-1">{vehicle.category}</p>
            <h3 className="font-heading font-bold text-white text-lg leading-tight">{vehicle.name}</h3>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1">
            <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
            <span className="text-white text-xs font-medium">{vehicle.rating}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-brand-gray text-xs">
            <Users className="w-3.5 h-3.5" />
            {vehicle.seats} seats
          </div>
          <div className="flex items-center gap-1.5 text-brand-gray text-xs">
            <Zap className="w-3.5 h-3.5" />
            {vehicle.transmission}
          </div>
          <div className="flex items-center gap-1.5 text-brand-gray text-xs">
            <Fuel className="w-3.5 h-3.5" />
            {vehicle.fuelType}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <motion.div
            animate={{ y: hovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-brand-red font-bold text-xl font-heading drop-shadow-[0_0_10px_rgba(174,33,25,0.4)]">
                {format(vehicle.pricePerDay.accra)}
              </span>
              <span className="text-brand-gray text-xs">/day</span>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={`/vehicles/${vehicle.id}`}
              className="bg-brand-red hover:bg-brand-red-light text-white text-xs font-semibold px-5 py-2.5 tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(174,33,25,0.6)] block relative overflow-hidden group"
            >
              <motion.span
                animate={{ x: hovered ? [0, 2, 0] : 0 }}
                transition={{ duration: 0.8, repeat: hovered ? Infinity : 0, repeatDelay: 2 }}
              >
                Rent Now
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
