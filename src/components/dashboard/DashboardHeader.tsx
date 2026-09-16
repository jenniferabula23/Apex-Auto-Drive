import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function DashboardHeader({ eyebrow, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-brand-brown/15 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div>
        <span className="font-mono text-[10px] sm:text-xs text-brand-red tracking-widest uppercase">{eyebrow}</span>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mt-3 break-words">{title}</h1>
        {description && <p className="text-brand-gray text-sm mt-2 max-w-2xl">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
