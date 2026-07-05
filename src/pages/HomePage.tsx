import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight, Star, Users, Shield, Clock, Zap,
  MapPin, ChevronDown, ChevronUp, Check, ArrowRight, Car,
  Search, ClipboardCheck, KeyRound
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import VehicleCard from '../components/VehicleCard';
import { getFleetVehicles, getVehicleById } from '../data/vehicles';

// ─── Hero Car Showcase ──────────────────────────────────────────────────────

const heroCars = [
  {
    image: '/ChatGPT_Image_May_13,_2026,_10_25_47_PM.png',
    name: 'Electric Blue Hypercar',
    subtitle: 'Neon-Lit Performance',
    glow: '#0088FF',
  },
  {
    image: '/ChatGPT_Image_May_13,_2026,_10_26_47_PM.png',
    name: 'Crimson Apex GT',
    subtitle: 'Pure Italian Fury',
    glow: '#CC0000',
  },
  {
    image: '/ChatGPT_Image_May_13,_2026,_10_30_05_PM.png',
    name: 'Rolls-Royce Wraith',
    subtitle: 'Midnight Black Edition',
    glow: '#888888',
  },
  {
    image: '/ChatGPT_Image_May_13,_2026,_10_31_08_PM.png',
    name: 'Rolls-Royce Ghost',
    subtitle: 'Emerald Prestige',
    glow: '#00AA44',
  },
  {
    image: '/ChatGPT_Image_May_13,_2026,_10_33_52_PM.png',
    name: 'Mercedes-AMG G63',
    subtitle: 'Stealth Luxury SUV',
    glow: '#AAAAAA',
  },
];

// Animated SVG background graphics
function AnimatedBackgroundGraphics() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'url(#blur)' }}>
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
        <linearGradient id="gradLine1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(174,33,25,0)" />
          <stop offset="50%" stopColor="rgba(174,33,25,0.3)" />
          <stop offset="100%" stopColor="rgba(174,33,25,0)" />
        </linearGradient>
        <radialGradient id="bubble1">
          <stop offset="0%" stopColor="rgba(174,33,25,0.4)" />
          <stop offset="100%" stopColor="rgba(174,33,25,0)" />
        </radialGradient>
      </defs>

      {/* Animated gradient lines */}
      <motion.line
        x1="0" y1="30%" x2="100%" y2="30%"
        stroke="url(#gradLine1)"
        strokeWidth="2"
        animate={{ x1: ['-100%', '100%'], x2: ['0', '200%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.line
        x1="0" y1="70%" x2="100%" y2="70%"
        stroke="url(#gradLine1)"
        strokeWidth="2"
        animate={{ x1: ['100%', '-100%'], x2: ['200%', '0'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }}
      />

      {/* Floating bubbles */}
      {[...Array(4)].map((_, i) => (
        <motion.circle
          key={i}
          cx={`${25 + i * 20}%`}
          cy="50%"
          r={`${30 + i * 15}`}
          fill={`url(#bubble1)`}
          animate={{
            cy: ['40%', '60%', '40%'],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Gradient waves */}
      <motion.path
        d="M0,50 Q25,40 50,50 T100,50"
        stroke="rgba(174,33,25,0.2)"
        strokeWidth="1"
        fill="none"
        animate={{ d: ['M0,50 Q25,40 50,50 T100,50', 'M0,50 Q25,60 50,50 T100,50', 'M0,50 Q25,40 50,50 T100,50'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function HeroSection() {
  const [currentCar, setCurrentCar] = useState(0);
  const [entering, setEntering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setEntering(true);
      setTimeout(() => {
        setCurrentCar(prev => (prev + 1) % heroCars.length);
        setEntering(false);
      }, 500);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
    });
  };

  const car = heroCars[currentCar];

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-lines opacity-40" />

      {/* Dynamic glow background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 70% 50%, ${car.glow}15 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent speed-line"
            style={{
              top: `${15 + i * 15}%`,
              left: 0,
              right: 0,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.5 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — Typography */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2 mb-6">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
                Premium Car Rental In Accra
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-heading font-black text-5xl md:text-7xl lg:text-[5.5rem] leading-none mb-6"
            >
              Drive{' '}
              <span className="text-brand-red" style={{ textShadow: '0 0 40px rgba(174,33,25,0.6)' }}>
                with Confidence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-brand-gray text-lg max-w-lg leading-relaxed mb-10"
            >
              We provide reliable self-drive and chauffeur-driven car rental services in Accra for business travel, airport transfers, corporate transportation, tours, events, and everyday mobility.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/vehicles"
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white font-semibold px-8 py-4 transition-all duration-300 hover:shadow-[0_0_40px_rgba(174,33,25,0.6)] group"
              >
                Book Your Ride
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/vehicles"
                className="flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 hover:border-brand-red/50 hover:bg-brand-red/5 transition-all duration-300 group relative overflow-hidden"
              >
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative z-10"
                >
                  <Car className="w-4 h-4" />
                </motion.span>
                <span>Explore Fleet</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-red/20 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ pointerEvents: 'none' }}
                />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mt-14 pt-8 border-t border-white/10"
            >
              {[
                { value: '50+', label: 'Vehicles Available' },
                { value: '1,000+', label: 'Successful Rentals' },
                { value: '98%', label: 'Customer Satisfaction' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                  <div className="text-brand-gray text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Car Showcase */}
          <div className="relative" style={{ minHeight: '480px' }}>
            {/* Background graphic animations */}
            <AnimatedBackgroundGraphics />

            {/* Gradient radial background */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`grad-${currentCar}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0"
                style={{
                  background: `radial-gradient(circle at 60% 40%, ${car.glow}25 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }}
              />
            </AnimatePresence>

            {/* Car SVG - transparent background, fills column */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCar}
                  initial={{ x: 200, opacity: 0, scale: 0.85 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -200, opacity: 0, scale: 0.85 }}
                  transition={{
                    x: { type: 'spring', stiffness: 60, damping: 15 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                  }}
                  className="relative w-full flex items-center justify-center"
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full object-contain rounded-2xl"
                    style={{
                      maxHeight: '460px',
                      filter: `drop-shadow(0 30px 60px ${car.glow}55)`,
                    }}
                  />
                  {/* Cinematic underglow */}
                  <div
                    className="absolute -bottom-4 left-0 right-0 h-20 blur-3xl -z-10"
                    style={{
                      background: `radial-gradient(ellipse at center, ${car.glow}70 0%, transparent 70%)`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Car info overlay */}
            <div className="absolute bottom-8 left-6 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${currentCar}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-white/50 text-xs tracking-widest uppercase">{car.subtitle}</p>
                  <p className="text-white font-heading font-bold text-xl">{car.name}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Car indicators */}
            <div className="absolute bottom-8 right-6 flex items-center justify-center gap-2 z-20">
              {heroCars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentCar(i)}
                  className={`transition-all duration-300 ${
                    i === currentCar
                      ? 'w-8 h-1.5 bg-brand-red shadow-[0_0_15px_rgba(174,33,25,0.6)]'
                      : 'w-2 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Form + mini previews */}
        <div className="mt-16">
          <BookingForm />
          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
            {getFleetVehicles().slice(0, 3).map((vehicle, i) => (
              <Link
                key={vehicle.id}
                to={`/vehicles/${vehicle.id}`}
                className="group bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-brand-red/40 transition-all duration-300"
              >
                <div className="relative h-20 sm:h-24 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="p-3">
                  <p className="text-white text-xs sm:text-sm font-semibold truncate">{vehicle.name}</p>
                  <p className="text-brand-gray text-[10px] sm:text-xs mt-0.5">{vehicle.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-gray/50 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </div>
  );
}

// ─── Stats Marquee ──────────────────────────────────────────────────────────

function StatsMarquee() {
  const stats = [
    { value: '50+', label: 'Vehicles Available' },
    { value: '1,000+', label: 'Successful Rentals' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '100%', label: 'Transportation Experience' },
  ];

  return (
    <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center px-4 py-4"
          >
            <div className="text-3xl md:text-4xl font-heading font-black text-brand-red drop-shadow-[0_0_20px_rgba(174,33,25,0.5)]">
              {stat.value}
            </div>
            <div className="text-xs text-brand-gray uppercase tracking-wider mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Choose Your Vehicle',
      desc: 'Browse our fleet of sedans, SUVs, buses, pickups, and minivans to find your perfect vehicle.',
    },
    {
      num: '02',
      icon: ClipboardCheck,
      title: 'Confirm Your Booking',
      desc: 'Submit your reservation details and our team will quickly confirm availability, rental terms, and payment instructions.',
    },
    {
      num: '03',
      icon: KeyRound,
      title: 'Pick Up & Drive',
      desc: 'Your vehicle will be delivered to your preferred location, ready for a smooth, comfortable drive.',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
            Simple Process
          </span>
          <h2 className="section-heading text-white mt-6">
            Rent A Vehicle In{' '}
            <span className="text-brand-red">3 Simple Steps</span>
          </h2>
          <p className="text-brand-gray mt-4 max-w-xl mx-auto">
            A fast, convenient, and stress-free booking process designed to get you moving with confidence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 hover:border-brand-red/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-brand-red" />
                </div>
                <span className="text-brand-red text-xs font-bold tracking-widest">STEP {step.num}</span>
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-3">{step.title}</h3>
              <p className="text-brand-gray text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Fleet Section ─────────────────────────────────────────────────────────

const categories = ['All Vehicles', 'SUV', 'Economy', 'Luxury', 'Van'];

function FleetSection() {
  const [activeCategory, setActiveCategory] = useState('All Vehicles');

  const fleet = getFleetVehicles();
  const filtered = activeCategory === 'All Vehicles'
    ? fleet
    : fleet.filter(v => v.category === activeCategory);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-15" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
            Our Fleet
          </span>
          <h2 className="section-heading text-white mt-6">
            Explore Our Premium{' '}
            <span className="text-brand-red">Fleet</span>
          </h2>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(174,33,25,0.4)]'
                  : 'border border-white/10 text-brand-gray hover:border-brand-red/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/vehicles"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white font-semibold px-8 py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(174,33,25,0.5)]"
          >
            View All Vehicles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ──────────────────────────────────────────────────────────

function WhyChooseUs() {
  const showcaseVehicle = getVehicleById('toyota-prado');

  const features = [
    { icon: Shield, title: 'Fully Insured Vehicles', desc: 'Drive with peace of mind knowing every vehicle comes with comprehensive insurance coverage for added protection and confidence.' },
    { icon: Zap, title: 'Fast & Easy Booking', desc: 'Reserve your preferred vehicle quickly through our simple and convenient booking process designed to save you time.' },
    { icon: Clock, title: 'Reliable Customer Support', desc: 'Our dedicated support team is always available to assist with bookings, inquiries, vehicle selection, and rental support.' },
    { icon: Users, title: 'Transparent Pricing', desc: 'Enjoy fair and competitive pricing with no hidden charges — what you see is exactly what you pay.' },
  ];

  const stats = [
    { value: '50+', label: 'Vehicles Available' },
    { value: '1,000+', label: 'Successful Rentals' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '100%', label: 'Transportation Experience' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
              Why Choose Us
            </span>
            <h2 className="section-heading text-white mt-6 mb-4">
              The Apex Auto Drive{' '}
              <span className="text-brand-red">Advantage</span>
            </h2>
            <p className="text-brand-gray leading-relaxed mb-10">
              At Apex Auto Drive, we go beyond standard car rentals by delivering reliable transportation solutions built around comfort, safety, professionalism, and customer satisfaction. Every vehicle in our fleet is carefully maintained to ensure a smooth and confident driving experience.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-brand-red" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white text-sm mb-1">{f.title}</h4>
                    <p className="text-brand-gray text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {stats.map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-heading font-bold text-brand-red">{s.value}</div>
                  <div className="text-brand-gray text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Link to={`/vehicles/${showcaseVehicle?.id ?? 'toyota-prado'}`} className="block relative overflow-hidden group">
              <img
                src={showcaseVehicle?.image ?? '/Cars/Prado 2020/prado 2020 (1).jpg'}
                alt={showcaseVehicle?.name ?? 'Toyota Prado'}
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-brand-red/30 via-transparent to-transparent" />
              <div className="absolute inset-0 border border-brand-red/20" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/70 text-xs tracking-widest uppercase">Featured Fleet</p>
                <p className="text-white font-heading font-bold text-lg">{showcaseVehicle?.name}</p>
              </div>
            </Link>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-brand-red p-6 shadow-[0_0_40px_rgba(174,33,25,0.5)]">
              <div className="text-3xl font-heading font-black text-white">5★</div>
              <div className="text-white/70 text-xs">Rated Service</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Promotions ─────────────────────────────────────────────────────────────

function PromotionsSection() {
  const [active, setActive] = useState(0);

  const promos = [
    {
      vehicleId: 'elantra-2019',
      title: 'Weekend Travel Deal',
      desc: 'Enjoy special weekend discounts on selected sedans and SUVs perfect for business trips, family travel, city rides, and weekend getaways.',
      badge: 'SAVE 30%',
      cta: 'Book Now',
      color: '#AE2119',
    },
    {
      vehicleId: 'outlander-2019',
      title: 'Family & Tour Package',
      desc: 'Book an SUV or minivan for multiple days and enjoy complimentary travel support options for a more comfortable and convenient journey.',
      badge: 'FREE ADD-ONS',
      cta: 'Reserve Your Vehicle',
      color: '#F5C518',
    },
    {
      vehicleId: 'chevrolet-tahoe',
      title: 'Corporate Rental Package',
      desc: 'Flexible long-term vehicle rental solutions for businesses, organizations, and executive transportation at competitive corporate rates.',
      badge: 'SAVE MORE',
      cta: 'View Vehicle',
      color: '#FF6B35',
    },
  ].map(promo => {
    const vehicle = getVehicleById(promo.vehicleId);
    return {
      ...promo,
      image: vehicle?.image ?? '',
      vehicleName: vehicle?.name ?? '',
      link: `/vehicles/${promo.vehicleId}`,
    };
  });

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % promos.length), 4000);
    return () => clearInterval(t);
  }, [promos.length]);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-15" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
            Special Offers
          </span>
          <h2 className="section-heading text-white mt-6">
            Exclusive Deals &{' '}
            <span className="text-brand-red">Rental Offers</span>
          </h2>
          <p className="text-brand-gray mt-4 max-w-2xl mx-auto">
            Enjoy flexible rental packages, seasonal promotions, and affordable transportation deals designed to give you more value every time you drive with Apex Auto Drive.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className="relative overflow-hidden group cursor-pointer border transition-all duration-500"
              style={{
                borderColor: active === i ? promo.color : 'rgba(255,255,255,0.05)',
                boxShadow: active === i ? `0 0 40px ${promo.color}40, inset 0 0 20px ${promo.color}20` : 'none',
              }}
            >
              {/* Image container with enhanced effects */}
              <div className="h-56 overflow-hidden relative">
                <motion.img
                  src={promo.image}
                  alt={promo.vehicleName || promo.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: active === i ? 1.1 : 1 }}
                  transition={{ duration: 0.6 }}
                />
                {/* Gradient overlay that changes on hover */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: active === i
                      ? `linear-gradient(to top, black 0%, ${promo.color}40 50%, transparent 100%)`
                      : 'linear-gradient(to top, black 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                  }}
                  transition={{ duration: 0.5 }}
                />
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  animate={{ x: active === i ? ['-100%', '100%'] : '-100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${promo.color}30 50%, transparent 100%)`,
                  }}
                />
              </div>

              {/* Badge */}
              <motion.div
                className="absolute top-4 right-4 text-xs font-black px-4 py-2 tracking-widest uppercase"
                animate={{ scale: active === i ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: promo.color,
                  color: '#fff',
                  boxShadow: `0 0 20px ${promo.color}60`,
                }}
              >
                {promo.badge}
              </motion.div>

              {/* Content */}
              <div className="p-6 bg-[#0a0a0a]">
                {promo.vehicleName && (
                  <p className="text-brand-red text-xs uppercase tracking-widest mb-1">{promo.vehicleName}</p>
                )}
                <h3 className="font-heading font-bold text-white mb-2 text-lg">{promo.title}</h3>
                <p className="text-brand-gray text-sm mb-4 leading-relaxed">{promo.desc}</p>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: active === i ? promo.color : '#AE2119' }}
                >
                  <Link to={promo.link}>{promo.cta}</Link> <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12 text-center"
    >
      <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
        Explore Ghana With Apex Auto Drive
      </span>
      <h3 className="font-heading font-bold text-white text-2xl mt-4 mb-3">
        Book To Any Location Across Ghana
      </h3>
      <p className="text-brand-gray text-sm max-w-2xl mx-auto">
        Accra, Kumasi, Cape Coast, Koforidua, Aburi and more — reliable car rental and chauffeur services for every destination.
      </p>
    </motion.div>
  );
}

function LocationsSection() {
  const locs = [
    {
      name: 'Cape Coast Castle',
      city: 'Cape Coast, Ghana',
      copy: 'Discover one of Ghana\'s most historic landmarks with comfortable transportation services designed for tourists, families, schools, and group excursions.',
      cta: 'Plan Your Visit',
      image: 'capecoast1.jpg',
    },
    {
      name: 'Kakum National Park',
      city: 'Central Region, Ghana',
      copy: 'Experience Ghana\'s famous rainforest canopy walkway and nature reserve with reliable travel rentals perfect for adventure and eco-tourism trips.',
      cta: 'Book Your Trip',
      image: 'Kakum-National-Park-suspension-bridge-with-hiker.jpg',
    },
    {
      name: 'Mole National Park',
      city: 'Northern Region, Ghana',
      copy: 'Travel confidently to Ghana\'s largest wildlife reserve and enjoy comfortable long-distance transportation for safari and tour experiences.',
      cta: 'Explore Mole Park',
      image: 'Mole.jpeg',
    },
    {
      name: 'Wli Waterfalls',
      city: 'Volta Region, Ghana',
      copy: 'Enjoy scenic road trips to Ghana\'s highest waterfall with spacious SUVs and comfortable travel vehicles designed for tours and outdoor adventures.',
      cta: 'Start Your Journey',
      image: 'Wli Waterfalls.jpeg',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <LocationBanner />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
            Tourist Destinations
          </span>
          <h2 className="section-heading text-white mt-6">
            Popular Tourist Destinations{' '}
            <span className="text-brand-red">In Ghana</span>
          </h2>
          <p className="text-brand-gray mt-4 max-w-2xl mx-auto">
            Travel comfortably to some of Ghana&apos;s most visited tourist attractions with reliable car rental and chauffeur services from Apex Auto Drive.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locs.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden group cursor-pointer h-72"
            >
              <motion.img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover transition-transform duration-700"
                whileHover={{ scale: 1.15 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-brand-red/60 transition-all duration-500" />
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center gap-1 text-brand-red text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  {loc.city}
                </div>
                <p className="text-white font-heading font-semibold mb-2">{loc.name}</p>
                <p className="text-brand-gray text-xs leading-relaxed line-clamp-2">{loc.copy}</p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Link to="/vehicles" className="bg-brand-red text-white text-sm px-5 py-2 font-semibold tracking-wider">
                  {loc.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────

function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const testimonials = [
    {
      name: 'Kwame Asante',
      role: 'Business Executive',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'Apex Auto Drive made my business trip incredibly smooth. The vehicle was clean, comfortable, and professionally maintained, while the customer service was excellent from start to finish.',
      rating: 5,
      highlight: 'Professional & Reliable Service',
    },
    {
      name: 'Abena Mensah',
      role: 'Travel Enthusiast',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'We rented an SUV for a weekend trip to Cape Coast and the entire experience was seamless. The booking process was easy, the vehicle was in excellent condition, and the ride was very comfortable.',
      rating: 5,
      highlight: 'Smooth Travel Experience',
    },
    {
      name: 'Kofi Boateng',
      role: 'Corporate Client',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
      text: 'Our company relies on Apex Auto Drive for executive transportation and airport pickups. Their professionalism, punctuality, and reliability have been outstanding.',
      rating: 5,
      highlight: 'Trusted Transportation Partner',
    },
  ];

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-15" />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
            Testimonials
          </span>
          <h2 className="section-heading text-white mt-6">
            What Our <span className="text-brand-red">Clients Say</span>
          </h2>
          <p className="text-brand-gray mt-4 max-w-2xl mx-auto">
            See why individuals, tourists, and businesses across Ghana trust Apex Auto Drive for reliable, comfortable, and professional transportation services.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial, i) => (
            <motion.button
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className={`text-left p-6 transition-all duration-300 border ${
                i === active
                  ? 'border-brand-red bg-brand-red/5 shadow-[0_0_40px_rgba(174,33,25,0.3)]'
                  : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                ))}
              </div>

              {/* Highlight badge */}
              <div className="inline-block bg-brand-red/20 text-brand-red text-xs px-2 py-1 mb-3 border border-brand-red/40 font-semibold">
                {testimonial.highlight}
              </div>

              {/* Quote */}
              <p className="text-brand-gray text-sm leading-relaxed mb-5 line-clamp-4 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-heading font-semibold text-white text-sm">{testimonial.name}</p>
                  <p className="text-brand-gray text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              animate={{ width: i === active ? 32 : 8 }}
              className={`h-2 transition-all duration-300 rounded-full ${
                i === active ? 'bg-brand-red shadow-[0_0_15px_rgba(174,33,25,0.6)]' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: 'How do I book a vehicle?', a: 'You can easily book a vehicle by contacting Apex Auto Drive through our website, phone, or WhatsApp. Simply choose your preferred vehicle, rental duration, and service type, and our team will assist you with the reservation process.' },
    { q: 'What documents are required for rental?', a: 'Customers may be required to provide a valid driver\'s license, national ID or passport, and additional verification details depending on the rental service selected.' },
    { q: 'What payment methods do you accept?', a: 'We accept convenient payment options including mobile money, bank transfers, and other approved payment methods arranged during booking confirmation.' },
    { q: 'Can I cancel or reschedule my booking?', a: 'Yes. Customers can request cancellations or schedule changes based on our rental terms and booking policy. Our support team is available to assist with adjustments.' },
    { q: 'Are your vehicles insured?', a: 'Yes. Our vehicles come with insurance coverage to provide additional peace of mind and safety for customers during their rental period.' },
    { q: 'Do you offer airport pickup and drop-off services?', a: 'Absolutely. Apex Auto Drive provides reliable airport pickup and drop-off services for individuals, families, tourists, and corporate clients traveling through Accra.' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2">
            FAQ
          </span>
          <h2 className="section-heading text-white mt-6">
            Frequently Asked{' '}
            <span className="text-brand-red">Questions</span>
          </h2>
          <p className="text-brand-gray mt-4 max-w-xl mx-auto">
            Find answers to common questions about our car rental services, booking process, payment options, and transportation solutions.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <motion.button
                onClick={() => setOpen(open === i ? null : i)}
                animate={{
                  backgroundColor: open === i ? 'rgba(174,33,25,0.1)' : 'rgba(10,10,10,1)',
                  borderColor: open === i ? 'rgba(174,33,25,0.4)' : 'rgba(255,255,255,0.05)',
                }}
                transition={{ duration: 0.2 }}
                className="w-full flex items-center justify-between p-5 text-left border"
              >
                <span className="font-heading font-medium text-white text-sm">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {open === i ? (
                    <ChevronUp className="w-5 h-5 text-brand-red flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-brand-gray group-hover:text-white flex-shrink-0 transition-colors" />
                  )}
                </motion.div>
              </motion.button>
              <AnimatePresence mode="wait">
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-brand-red/20 bg-brand-red/2"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: 0.1 }}
                      className="px-5 py-4 text-brand-gray text-sm leading-relaxed"
                    >
                      {faq.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/3752194/pexels-photo-3752194.jpeg?auto=compress&cs=tinysrgb&w=1400)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 grid-lines opacity-20" />

        {/* Animated circles */}
        <motion.div
          className="absolute top-20 right-1/4 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl"
          animate={{ y: [30, -30, 30] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div className="mb-4">
            <span className="text-brand-red text-xs tracking-widest uppercase border border-brand-red/30 px-4 py-2 inline-block">
              Ready to Go?
            </span>
          </motion.div>

          <h2 className="font-heading font-black text-5xl md:text-7xl text-white mb-6 leading-tight">
            Book Your Perfect{' '}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-red to-brand-red"
              animate={{ backgroundPosition: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                textShadow: '0 0 60px rgba(174,33,25,0.8)',
                filter: 'drop-shadow(0 0 40px rgba(174,33,25,0.4))',
              }}
            >
              Ride Today
            </motion.span>
          </h2>

          <p className="text-brand-gray text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            From weekend escapes to business trips — find the perfect premium vehicle for every journey. Book in minutes, drive with confidence.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/vehicles"
                className="btn-primary flex items-center gap-2 inline-flex text-base px-10 py-5 shadow-[0_0_40px_rgba(174,33,25,0.3)]"
              >
                <Car className="w-5 h-5" />
                Browse Fleet Now
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" className="btn-outline inline-flex items-center gap-2 text-base px-10 py-5">
                Get in Touch
              </Link>
            </motion.div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-brand-gray">
            {[
              { icon: Shield, label: '100% Secure' },
              { icon: Clock, label: '24/7 Available' },
              { icon: Check, label: 'Premium Fleet' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-2"
              >
                <item.icon className="w-4 h-4 text-brand-red" />
                {item.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-black">
      <HeroSection />
      <StatsMarquee />
      <HowItWorksSection />
      <FleetSection />
      <WhyChooseUs />
      <PromotionsSection />
      <LocationsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
