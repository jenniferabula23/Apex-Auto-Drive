import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Get In Touch
            </span>
            <h1 className="font-heading font-black text-6xl text-gray-900 mt-6 mb-4">
              Contact <span className="text-brand-red">Us</span>
            </h1>
            <p className="text-brand-gray text-lg max-w-xl mx-auto">
              Our team is ready to help you find the perfect vehicle and answer any questions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl text-gray-900 mb-8">
              Let's Start a <span className="text-brand-red">Conversation</span>
            </h2>

            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, title: 'Our Office', info: 'Dansoman Roundabout (GU-537-3000)' },
                { icon: Phone, title: 'Phone', info: '0544 124 090 / 0544 123 796' },
                { icon: Mail, title: 'Email', info: 'info@apexautodrive.co' },
                { icon: Clock, title: 'Business Hours', info: 'Mon–Fri: 8:00 AM – 4:00 PM · Sat: 9:00 AM – 3:00 PM' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-11 h-11 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-brand-red" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                    <p className="text-brand-gray text-sm">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative h-64 bg-white border border-black/10 overflow-hidden">
              <div className="absolute inset-0 grid-lines opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-brand-red mx-auto mb-2" />
                  <p className="text-brand-gray text-sm">Accra, Ghana</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-white border border-black/10 p-8">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-red to-transparent" />

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-brand-red/10 border border-brand-red flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(174,33,25,0.3)]">
                    <Check className="w-7 h-7 text-brand-red" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-xl mb-2">Message Sent!</h3>
                  <p className="text-brand-gray text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-heading font-bold text-gray-900 text-xl mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/30"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/30"
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/30"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/30 resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
