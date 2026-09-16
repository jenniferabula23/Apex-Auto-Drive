import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, ArrowRight } from 'lucide-react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const channels = [
  { icon: MessageSquare, title: 'Live Chat', desc: 'Get instant answers from our concierge team.', cta: 'Start Chat' },
  { icon: Phone, title: 'Call Concierge', desc: '+233 24 000 0000 — 24/7 elite support line.', cta: 'Call Now' },
  { icon: Mail, title: 'Email Support', desc: 'support@apexautodrive.com — response within 1 hour.', cta: 'Send Email' },
];

const faqs = [
  { q: 'How do I extend my rental?', a: 'Visit My Rentals or contact concierge for instant extensions.' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 24 hours before your pickup time.' },
  { q: 'Can I change pickup location?', a: 'Yes — modifications are possible up to 12 hours prior.' },
  { q: 'Are insurance and roadside assistance included?', a: 'All bookings include premium insurance and 24/7 roadside support.' },
];

export default function Support() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        eyebrow="Concierge"
        title="Support"
        description="We're here around the clock — wherever the road takes you."
      />

      <div className="grid sm:grid-cols-3 gap-4">
        {channels.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="relative group"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-brand-red/30 to-orange-500/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className="relative bg-surface-paper border border-brand-brown/20 p-6 h-full flex flex-col shadow-sm">
              <div className="w-11 h-11 bg-brand-red/10 border border-brand-red/30 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-brand-red" />
              </div>
              <h4 className="font-heading font-bold text-gray-900 mb-1">{c.title}</h4>
              <p className="text-sm text-brand-gray mb-5 flex-1">{c.desc}</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-brand-red border border-brand-brown/30 bg-surface-paper px-3 py-2 hover:border-brand-red/50 hover:bg-brand-red/5 transition-colors shadow-sm">
                {c.cta} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="font-heading font-semibold text-gray-900 mb-4">Frequently Asked</h3>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-black/10 group [&[open]]:border-brand-red/40"
            >
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-gray-900 text-sm">
                {f.q}
                <ArrowRight className="w-4 h-4 text-brand-red transition-transform group-open:rotate-90" />
              </summary>
              <p className="px-5 pb-4 text-sm text-brand-gray">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </div>
  );
}
