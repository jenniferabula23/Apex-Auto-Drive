import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Clock, Users, Star, Award, Heart, TrendingUp, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Maxwell Antwi',
      role: 'General Manager',
      image: '/team/maxwell-antwi.png',
      imageFocus: 'center 12%',
      bio: 'Oversees daily operations and ensures Apex Auto Drive consistently delivers professional, reliable, and customer-focused transportation services.',
    },
    {
      name: 'Nehemiah Amoh Antwi',
      role: 'Fleet Manager',
      image: '/team/nehemiah-amoh-antwi.png',
      imageFocus: 'center 8%',
      bio: 'Responsible for fleet maintenance, vehicle inspections, and ensuring every vehicle is prepared for safe, comfortable, and dependable travel.',
    },
    {
      name: 'Clara Obeng',
      role: 'Customer Support Specialist',
      image: '/team/clara-obeng.png',
      imageFocus: 'center 10%',
      bio: 'Dedicated to assisting customers with bookings, inquiries, and support while delivering a smooth and professional customer experience.',
    },
  ];

  const values = [
    { icon: Heart, title: 'Customer-Focused Service', desc: 'We prioritize customer satisfaction by delivering professional support and dependable transportation experiences.' },
    { icon: Shield, title: 'Reliability', desc: 'Our clients trust us for punctual service, quality vehicles, and consistent transportation solutions.' },
    { icon: TrendingUp, title: 'Excellence', desc: 'We continuously maintain high service standards across our fleet, operations, and customer interactions.' },
    { icon: Star, title: 'Transparency', desc: 'Clear communication, honest pricing, and professional service with no hidden surprises.' },
  ];

  const partners = [
    { name: 'Toyota Ghana', desc: 'Authorized service partner' },
    { name: 'Allianz Insurance', desc: 'Premium coverage provider' },
    { name: 'Shell Ghana', desc: 'Fuel & maintenance partner' },
    { name: 'Accra Airport Services', desc: 'Airport logistics partner' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div
          className="absolute inset-0 opacity-12"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1400)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Our Story
            </span>
            <h1 className="font-heading font-black text-6xl text-gray-900 mt-6 mb-4">
              About <span className="text-brand-red">Apex Auto Drive</span>
            </h1>
            <p className="text-brand-gray text-lg max-w-2xl mx-auto leading-relaxed">
              Reliable car rental and transportation services in Ghana built on professionalism, trust, comfort, and customer satisfaction.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Who We Are */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
                Who We Are
              </span>
              <h2 className="section-heading text-gray-900 mt-6 mb-6">
                More Than Just<br />
                <span className="text-brand-red">Car Rentals</span>
              </h2>
              <p className="text-brand-gray leading-relaxed mb-6">
                Founded in Accra, Apex Auto Drive was created with a vision to provide dependable, comfortable, and professional transportation services for individuals, businesses, tourists, and organizations across Ghana. We believe every journey should be safe, smooth, and stress-free — whether it is a business trip, airport transfer, family outing, tour adventure, corporate assignment, or special event.
              </p>
              <p className="text-brand-gray leading-relaxed mb-8">
                Our fleet includes sedans, SUVs, buses, pickups, and minivans carefully maintained to deliver reliability, comfort, and performance. Beyond vehicle rentals, we focus on creating exceptional travel experiences through quality service, flexible rental options, and customer-first support.
              </p>
              <div className="flex flex-wrap gap-8">
                {[{ v: '100+', l: 'Vehicles Available' }, { v: '5K+', l: 'Satisfied Clients' }, { v: '9+', l: 'Service Locations' }].map(s => (
                  <div key={s.l}>
                    <div className="text-3xl font-heading font-black text-brand-red">{s.v}</div>
                    <div className="text-brand-gray text-sm mt-1">{s.l}</div>
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
              <div className="relative overflow-hidden group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src="https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Apex Auto Drive fleet"
                  className="w-full h-[450px] object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tl from-brand-red/20 to-transparent"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 border border-brand-red/20 group-hover:border-brand-red/40 transition-colors"
                  style={{
                    boxShadow: `inset 0 0 40px rgba(174,33,25,0.15)`,
                  }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -left-6 bg-[#2a1810] border border-brand-red/30 p-5 shadow-[0_0_30px_rgba(174,33,25,0.3)]"
              >
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-white text-sm font-semibold">Rated #1 in Ghana</p>
                <p className="text-brand-gray text-xs">Premium Car Rentals</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Why Us
            </span>
            <h2 className="section-heading text-gray-900 mt-6">Why Choose <span className="text-brand-red">Apex Auto Drive</span></h2>
            <p className="text-brand-gray mt-4 max-w-2xl mx-auto">
              We provide reliable transportation solutions designed to give every client confidence, convenience, and peace of mind.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Comprehensive Vehicle Insurance', desc: 'Every vehicle comes with insurance coverage to provide added safety and confidence throughout your rental period.' },
              { icon: Zap, title: 'Fast & Convenient Booking', desc: 'Reserve your preferred vehicle quickly through our simple and efficient booking process.' },
              { icon: Clock, title: 'Reliable Customer Support', desc: 'Our support team is available to assist with bookings, rental inquiries, and transportation support whenever needed.' },
              { icon: Users, title: 'Professional Chauffeur Services', desc: 'Experienced and professional drivers available for business travel, airport transfers, tours, and executive transportation.' },
              { icon: Award, title: 'Well-Maintained Fleet', desc: 'Every vehicle is professionally serviced and inspected to ensure safety, comfort, and reliable performance.' },
              { icon: TrendingUp, title: 'Flexible Rental Options', desc: 'Choose from daily, weekly, monthly, and long-term rental packages designed around your schedule and transportation needs.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-black/10 p-7 hover:border-brand-red/30 transition-all duration-400 group"
              >
                <div className="w-12 h-12 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mb-5 group-hover:bg-brand-red/20 transition-colors">
                  <item.icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Our Values
            </span>
            <h2 className="section-heading text-gray-900 mt-6">Core <span className="text-brand-red">Values</span></h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 border border-black/10 bg-white hover:border-brand-red/30 transition-all group"
              >
                <div className="w-14 h-14 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-red/20 transition-colors">
                  <v.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-brand-gray text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              The Team
            </span>
            <h2 className="section-heading text-gray-900 mt-6">Meet Our <span className="text-brand-red">Team</span></h2>
            <p className="text-brand-gray mt-4 max-w-2xl mx-auto">
              A dedicated team committed to delivering reliable transportation services and exceptional customer experiences across Ghana.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-black/10 overflow-hidden hover:border-brand-red/30 transition-colors duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 border-b border-black/5">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ objectPosition: member.imageFocus }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-5 bg-white">
                  <p className="text-gray-900 font-heading font-bold text-lg">{member.name}</p>
                  <p className="text-brand-red text-xs uppercase tracking-wider mt-1">{member.role}</p>
                  <p className="text-brand-gray text-sm leading-relaxed mt-3">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Trusted Partners
            </span>
            <h2 className="section-heading text-gray-900 mt-6">Our <span className="text-brand-red">Partners</span></h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {partners.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-black/10 p-6 text-center hover:border-brand-red/30 transition-all"
              >
                <div className="w-12 h-12 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-5 h-5 text-brand-red" />
                </div>
                <h4 className="font-heading font-bold text-gray-900 mb-1">{p.name}</h4>
                <p className="text-brand-gray text-xs">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-red/10 border-t border-brand-red/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="font-heading font-bold text-4xl text-gray-900 mb-4">
            Ready To Drive with <span className="text-brand-red">Confidence?</span>
          </h3>
          <p className="text-brand-gray mb-8">
            Book reliable car rental and transportation services with Apex Auto Drive and enjoy safe, comfortable, and professional travel experiences across Ghana.
          </p>
          <Link to="/vehicles" className="btn-primary inline-flex items-center gap-2">
            Explore Our Fleet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
