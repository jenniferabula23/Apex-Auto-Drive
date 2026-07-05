import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  delay?: number;
};

export default function StatsCard({ icon: Icon, label, value, hint, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <div className="absolute -inset-px bg-gradient-to-br from-brand-red/30 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 p-6 overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/10 rounded-full blur-3xl group-hover:bg-brand-red/20 transition-colors duration-500" />
        <div className="relative flex items-start justify-between mb-6">
          <div className="w-11 h-11 bg-brand-red/10 border border-brand-red/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-red" />
          </div>
          {hint && <span className="text-[10px] text-brand-gray uppercase tracking-widest">{hint}</span>}
        </div>
        <p className="font-heading font-black text-3xl text-white mb-1">{value}</p>
        <p className="text-xs text-brand-gray uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}
