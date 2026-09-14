import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, UserCheck, Plane, Building2, Crown, Calendar, ArrowRight, Check, Zap, Clock, Shield, Users } from 'lucide-react';

const services = [
  {
    icon: Car,
    title: 'Self-Drive Car Rental',
    desc: 'Enjoy flexible and convenient vehicle rentals for personal travel, business trips, vacations, and everyday transportation needs across Ghana.',
    features: ['Daily, weekly, and monthly rental plans', 'Sedans, SUVs, buses, pickups, and minivans', 'Flexible pickup and drop-off options', 'Affordable and transparent pricing'],
  },
  {
    icon: UserCheck,
    title: 'Chauffeur Services',
    desc: 'Travel comfortably with professional drivers available for executive transportation, business meetings, airport transfers, events, and private travel.',
    features: ['Experienced professional chauffeurs', 'Comfortable and reliable transportation', 'Corporate and personal travel solutions', 'Available for short and long-distance trips'],
  },
  {
    icon: Plane,
    title: 'Airport Pickup & Drop-Off',
    desc: 'Reliable airport transportation services designed to provide smooth, safe, and timely transfers for travellers arriving in or departing from Accra.',
    features: ['Airport pickup and drop-off services', 'Professional driver assistance', 'Comfortable travel experience', 'Timely and reliable transportation'],
  },
  {
    icon: Building2,
    title: 'Corporate Vehicle Rental',
    desc: 'Professional transportation solutions for companies, NGOs, executives, conferences, projects, and staff mobility requirements.',
    features: ['Flexible corporate rental packages', 'Dedicated business support', 'Executive transportation services', 'Long-term fleet solutions'],
  },
  {
    icon: Crown,
    title: 'Travel & Tour Rentals',
    desc: 'Explore Ghana comfortably with reliable transportation services designed for tours, vacations, road trips, family travel, and group adventures.',
    features: ['Comfortable long-distance travel', 'Spacious vehicles for groups and families', 'Tour-friendly transportation options', 'Flexible travel arrangements'],
  },
  {
    icon: Calendar,
    title: 'Long-Term Vehicle Rental',
    desc: 'Affordable long-term rental solutions for businesses, organizations, expatriates, and individuals who require dependable transportation over extended periods.',
    features: ['Weekly and monthly rental plans', 'Cost-effective transportation solutions', 'Fleet maintenance included', 'Flexible upgrade options'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div
          className="absolute inset-0 opacity-12"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=1400)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-sm text-brand-gray mb-4">
              <a href="/" className="hover:text-brand-red transition-colors">Home</a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Services</span>
            </div>
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              What We Offer
            </span>
            <h1 className="font-heading font-black text-6xl text-gray-900 mt-6 mb-4">
              Our Transportation <span className="text-brand-red">Services</span>
            </h1>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto leading-relaxed">
              Reliable car rental and transportation solutions designed for individuals, businesses, tourists, events, and corporate travel across Ghana.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Introduction */}
      <section className="py-16 border-b border-black/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl text-gray-900 mb-4">
              Professional Mobility Solutions For <span className="text-brand-red">Every Journey</span>
            </h2>
            <p className="text-brand-gray leading-relaxed">
              Apex Auto Drive provides flexible and dependable transportation services tailored to meet different travel needs across Ghana. Whether you require a self-drive rental, chauffeur service, airport transfer, corporate transportation, or long-term vehicle solution, we are committed to delivering comfort, reliability, and professionalism every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Our Offerings
            </span>
            <h2 className="section-heading text-gray-900 mt-6">
              What We <span className="text-brand-red">Do</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-black/10 p-8 hover:border-brand-red/30 transition-all duration-400 group hover:shadow-[0_20px_60px_rgba(174,33,25,0.1)]"
              >
                <div className="w-14 h-14 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mb-6 group-hover:bg-brand-red/20 transition-colors">
                  <service.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-xl mb-3">{service.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed mb-5">{service.desc}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-brand-gray text-xs">
                      <Check className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/vehicles" className="text-brand-red text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              The Process
            </span>
            <h2 className="section-heading text-gray-900 mt-6">
              How It <span className="text-brand-red">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', icon: Car, title: 'Choose Your Service', desc: 'Select the transportation service or vehicle that best fits your travel needs and schedule.' },
              { num: '02', icon: Calendar, title: 'Make Your Reservation', desc: 'Provide your booking details, preferred dates, pickup location, and transportation requirements.' },
              { num: '03', icon: Check, title: 'Confirm Your Booking', desc: 'Our team will confirm your reservation, vehicle availability, and payment instructions promptly.' },
              { num: '04', icon: Crown, title: 'Enjoy The Journey', desc: 'Receive your vehicle or chauffeur service and travel comfortably with Apex Auto Drive.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white border border-black/10 p-7 text-center group hover:border-brand-red/30 transition-all"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-red text-white text-xs font-bold px-3 py-1">{step.num}</div>
                <div className="w-12 h-12 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mx-auto mt-4 mb-4">
                  <step.icon className="w-5 h-5 text-brand-red" />
                </div>
                <h4 className="font-heading font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-brand-gray text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">Why Choose Us</span>
              <h2 className="section-heading text-gray-900 mt-6 mb-6">
                Why Our Services <span className="text-brand-red">Stand Out</span>
              </h2>
              <p className="text-brand-gray mb-8">
                We are committed to delivering reliable, customer-focused transportation services built around comfort, convenience, and professionalism.
              </p>
              <div className="space-y-5">
                {[
                  { icon: Shield, title: 'Reliable Transportation', desc: 'Dependable services designed to ensure safe, smooth, and timely travel experiences.' },
                  { icon: Zap, title: 'Fast Booking Process', desc: 'Quick and convenient reservations with responsive customer support.' },
                  { icon: Users, title: 'Professional Team', desc: 'Experienced staff dedicated to delivering excellent customer service and transportation support.' },
                  { icon: Clock, title: 'Flexible Availability', desc: 'Transportation services available for business trips, airport transfers, events, tours, and long-term rentals.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                      <p className="text-brand-gray text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3752194/pexels-photo-3752194.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Apex Auto Drive services"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/20 to-transparent" />
                <div className="absolute inset-0 border border-brand-red/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Easy Booking', desc: 'Reserve your vehicle quickly and conveniently.' },
              { icon: Crown, title: 'Premium Fleet', desc: 'Professionally maintained vehicles for every journey.' },
              { icon: Shield, title: 'Transparent Pricing', desc: 'Affordable rates with no hidden charges.' },
              { icon: Clock, title: 'Reliable Support', desc: 'Dedicated assistance whenever you need us.' },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 bg-white border border-black/10"
              >
                <div className="w-10 h-10 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-4 h-4 text-brand-red" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{b.title}</p>
                  <p className="text-brand-gray text-xs">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg?auto=compress&cs=tinysrgb&w=1400)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading font-black text-5xl text-gray-900 mb-4">
            Find The Perfect Transportation<br />
            <span className="text-brand-red">Solution</span>
          </h2>
          <p className="text-brand-gray mb-8">
            Whether for business, travel, airport pickups, events, or everyday movement, we are ready to provide safe, reliable, and professional transportation services across Ghana.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/vehicles" className="btn-primary inline-flex items-center gap-2">
              Book Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
