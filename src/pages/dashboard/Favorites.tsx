import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Loader2, ArrowRight, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { localUserAuth } from '../../lib/localUserAuth';
import { useCurrency } from '../../context/CurrencyContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

type Favorite = {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_image: string;
  vehicle_price: number;
};

export default function Favorites() {
  const { user } = useAuth();
  const { format } = useCurrency();
  const [items, setItems] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (localUserAuth.isLocalUser(user.id)) {
      setItems([]);
      setLoading(false);
      return;
    }
    supabase
      .from('favorites')
      .select('id, vehicle_id, vehicle_name, vehicle_image, vehicle_price')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    await supabase.from('favorites').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Saved"
        title="Favorites"
        description="Your hand-picked collection of dream machines."
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand-red animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-black/10 p-10 text-center">
          <Heart className="w-10 h-10 text-brand-red mx-auto mb-4" />
          <p className="text-gray-900 mb-2">No favorites yet</p>
          <p className="text-brand-gray text-sm mb-6">Tap the heart icon on any vehicle to save it here.</p>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-5 py-2.5 text-sm transition-all hover:shadow-[0_0_30px_rgba(174,33,25,0.6)]"
          >
            Browse Fleet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, rotateZ: -0.4 }}
              className="relative group"
            >
              <div className="absolute -inset-px bg-gradient-to-br from-brand-red/40 to-orange-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
              <div className="relative bg-white border border-black/10 overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <motion.img
                    src={f.vehicle_image}
                    alt={f.vehicle_name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button
                    onClick={() => remove(f.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 border border-black/10 hover:border-brand-red/60 flex items-center justify-center text-brand-gray hover:text-brand-red transition-all"
                    aria-label="Remove favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  <h4 className="font-heading font-bold text-gray-900">{f.vehicle_name}</h4>
                  {f.vehicle_price > 0 && (
                    <p className="text-brand-red text-sm font-semibold mt-1">
                      {format(Number(f.vehicle_price))} <span className="text-brand-gray text-xs">/ day</span>
                    </p>
                  )}
                  <Link
                    to={`/vehicles/${f.vehicle_id}`}
                    className="inline-flex items-center gap-1 text-xs text-gray-900 hover:text-brand-red mt-3 transition-colors"
                  >
                    View vehicle <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
