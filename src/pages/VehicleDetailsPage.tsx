import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Zap, Fuel, DoorClosed, Star, Check, ChevronLeft, ChevronRight,
  MapPin, ShieldCheck, Calendar, ArrowRight, Sparkles
} from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import {
  getFleetVehicles,
  getVehicleLocations,
  getVehicleGalleryViews,
  isRegionalLocation,
  formatLocationPriceLabel,
  regionDestinationHints,
} from '../data/vehicles';
import type { LocationKey } from '../data/vehicles';
import { useCurrency } from '../context/CurrencyContext';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const fleet = getFleetVehicles();
  const vehicle = fleet.find(v => v.id === id);
  const related = fleet.filter(v => v.id !== id).slice(0, 4);

  const [selectedLocation, setSelectedLocation] = useState<LocationKey>('accra');
  const [activeImage, setActiveImage] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [destinationDetails, setDestinationDetails] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    if (!vehicle) return;
    const locs = getVehicleLocations(vehicle);
    if (locs.length && vehicle.pricePerDay[selectedLocation] == null) {
      setSelectedLocation(locs[0].key);
    }
  }, [vehicle, selectedLocation]);

  useEffect(() => {
    if (!isRegionalLocation(selectedLocation)) {
      setDestinationDetails('');
    }
  }, [selectedLocation]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Vehicle Not Found</h2>
          <Link to="/vehicles" className="btn-primary">Browse Fleet</Link>
        </div>
      </div>
    );
  }

  const availableLocations = getVehicleLocations(vehicle);
  const galleryViews = getVehicleGalleryViews(vehicle);

  const pricePerDay = vehicle.pricePerDay[selectedLocation] ?? vehicle.pricePerDay.accra;
  const total = pricePerDay * rentalDays;

  const handleBookNow = () => {
    if (!pickupDate || !returnDate) {
      setBookingError('Please select pickup and return dates to continue.');
      return;
    }
    if (isRegionalLocation(selectedLocation) && !destinationDetails.trim()) {
      setBookingError('Please specify where exactly you are going within the selected region.');
      return;
    }
    setBookingError(null);
    navigate('/checkout', {
      state: {
        vehicle,
        location: selectedLocation,
        destinationDetails: destinationDetails.trim(),
        pickupDate,
        pickupTime,
        returnDate,
        days: rentalDays,
        pricePerDay,
        total,
      },
    });
  };

  const destinationHint = isRegionalLocation(selectedLocation)
    ? regionDestinationHints[selectedLocation]
    : null;

  return (
    <div id="vehicle-top" className="min-h-screen bg-black pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-brand-gray">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/vehicles" className="hover:text-white transition-colors">Vehicles</Link>
            <span>/</span>
            <span className="text-white">{vehicle.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden mb-4 bg-[#0a0a0a] border border-white/5 group"
              style={{
                boxShadow: `0 30px 80px ${vehicle.glowColor}40, inset 0 0 30px ${vehicle.glowColor}10`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={galleryViews[activeImage]}
                  alt={vehicle.name}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-80 object-cover"
                />
              </AnimatePresence>
              {/* Glow overlay */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  background: `radial-gradient(ellipse at bottom, ${vehicle.glowColor}25 0%, transparent 70%)`,
                }}
              />
              {/* Reflection sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ x: ['200%', '-100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                style={{
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                }}
              />
              {galleryViews.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${vehicle.glowColor}60` }}
                    onClick={() => setActiveImage(p => Math.max(0, p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border border-white/10 flex items-center justify-center hover:border-brand-red/50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${vehicle.glowColor}60` }}
                    onClick={() => setActiveImage(p => Math.min(galleryViews.length - 1, p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border border-white/10 flex items-center justify-center hover:border-brand-red/50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </motion.button>
                </>
              )}
            </motion.div>

            {galleryViews.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`grid gap-3 ${
                  galleryViews.length === 2
                    ? 'grid-cols-2'
                    : galleryViews.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                }`}
              >
                {galleryViews.map((img, i) => (
                  <motion.button
                    key={img}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveImage(i)}
                    className={`group bg-[#0a0a0a] border overflow-hidden transition-all duration-300 ${
                      i === activeImage
                        ? 'border-brand-red shadow-[0_0_15px_rgba(174,33,25,0.35)]'
                        : 'border-white/10 hover:border-brand-red/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={vehicle.name}
                      className="w-full h-20 sm:h-24 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Details + Booking */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3 mb-2">
              {vehicle.badge && (
                <span className="bg-brand-red text-white text-xs px-3 py-1 tracking-wider uppercase">{vehicle.badge}</span>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
                <span className="text-white text-sm font-semibold">{vehicle.rating}</span>
                <span className="text-brand-gray text-xs">({vehicle.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="font-heading font-black text-4xl text-white mb-2">{vehicle.name}</h1>
            <p className="text-brand-gray mb-1">{vehicle.model} · {vehicle.year}</p>
            <div className="flex items-center gap-1 text-brand-gray text-sm mb-6">
              <MapPin className="w-4 h-4 text-brand-red" />
              Available in Accra &amp; select regions
            </div>

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-4 gap-4 mb-8 p-5 bg-[#0a0a0a] border border-white/5 hover:border-brand-red/30 transition-colors"
            >
              {[
                { icon: Users, label: 'Seats', value: String(vehicle.seats) },
                { icon: Zap, label: 'Trans.', value: vehicle.transmission },
                { icon: Fuel, label: 'Fuel', value: vehicle.fuelType },
                { icon: DoorClosed, label: 'Doors', value: String(vehicle.doors) },
              ].map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="text-center"
                >
                  <spec.icon className="w-5 h-5 text-brand-red mx-auto mb-2" />
                  <div className="text-white text-sm font-semibold">{spec.value}</div>
                  <div className="text-brand-gray text-xs">{spec.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Location Pricing */}
            <div className="mb-6">
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-3">
                Select Rental Location / Pricing
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableLocations.map(loc => (
                  <button
                    key={loc.key}
                    onClick={() => setSelectedLocation(loc.key)}
                    className={`px-3 py-3 text-xs transition-all border ${
                      selectedLocation === loc.key
                        ? 'border-brand-red bg-brand-red/10 text-white'
                        : 'border-white/10 text-brand-gray hover:border-white/30'
                    }`}
                  >
                    <div className="font-semibold">{loc.label}</div>
                    <div className={selectedLocation === loc.key ? 'text-brand-red' : 'text-brand-gray'}>
                      {formatLocationPriceLabel(loc.key, vehicle.pricePerDay[loc.key]!, format)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {destinationHint && (
              <div className="mb-6 bg-[#0a0a0a] border border-white/5 p-5">
                <label className="text-xs text-brand-gray uppercase tracking-widest block mb-2">
                  {destinationHint.label}
                </label>
                <p className="text-brand-gray text-xs mb-3">
                  Regional rates start from the price shown. Final pricing may vary by exact destination
                  (e.g. {destinationHint.examples}).
                </p>
                <input
                  type="text"
                  value={destinationDetails}
                  onChange={e => setDestinationDetails(e.target.value)}
                  placeholder={destinationHint.placeholder}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/40"
                />
              </div>
            )}

            {/* Rental Days */}
            <div className="mb-6 bg-[#0a0a0a] border border-white/5 p-5">
              <label className="text-xs text-brand-gray uppercase tracking-widest block mb-3">Booking Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="min-w-0">
                  <label className="text-xs text-brand-gray mb-1 block">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full min-w-0 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-brand-red/50 [color-scheme:dark]"
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-xs text-brand-gray mb-1 block">Pickup Time</label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="w-full min-w-0 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-brand-red/50 [color-scheme:dark]"
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-xs text-brand-gray mb-1 block">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={e => {
                      setReturnDate(e.target.value);
                      if (pickupDate && e.target.value) {
                        const diff = Math.ceil((new Date(e.target.value).getTime() - new Date(pickupDate).getTime()) / 86400000);
                        if (diff > 0) setRentalDays(diff);
                      }
                    }}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full min-w-0 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-brand-red/50 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[#0a0a0a] border border-white/5 p-5 mb-6">
              {isRegionalLocation(selectedLocation) && (
                <p className="text-brand-gray text-xs mb-3">
                  Estimated total based on regional starting rate. Final invoice may reflect your exact destination.
                </p>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-brand-gray text-sm">
                  {isRegionalLocation(selectedLocation) ? 'From ' : ''}{format(pricePerDay)} × {rentalDays} day{rentalDays > 1 ? 's' : ''}
                </span>
                <span className="text-white">{format(total)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                <span className="text-white font-semibold">Total{isRegionalLocation(selectedLocation) ? ' (from)' : ''}</span>
                <span className="text-brand-red font-heading font-bold text-2xl">{format(total)}</span>
              </div>
            </div>

            {bookingError && (
              <p className="text-brand-red text-sm mb-4">{bookingError}</p>
            )}

            <motion.button
              onClick={handleBookNow}
              whileHover={{ scale: 1.02, boxShadow: `0 0 40px rgba(174,33,25,0.6)` }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-red hover:bg-brand-red-light text-white font-bold py-4 flex items-center justify-center gap-3 tracking-widest uppercase transition-all duration-300 text-sm relative overflow-hidden group"
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Book Now <ArrowRight className="w-4 h-4" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ pointerEvents: 'none' }}
              />
            </motion.button>
          </div>
        </div>

        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-4">Vehicle Description</h2>
            <p className="text-brand-gray leading-relaxed">{vehicle.description}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-4">Features & Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {vehicle.features.map((feat, i) => (
                <motion.div
                  key={feat}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-brand-red flex-shrink-0" />
                  <span className="text-brand-gray text-sm">{feat}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Rental Terms */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0a0a0a] border border-white/5 p-8 mb-16 hover:border-brand-red/20 transition-colors"
        >
          <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-red" />
            Rental Terms & Conditions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Requirements', items: ['Valid Driver\'s License', 'National ID / Passport', 'Security Deposit'] },
              { title: 'Fuel Policy', items: ['Full-to-Full policy', 'Return with same fuel', 'Fuel surcharge if not filled'] },
              { title: 'Mileage', items: ['300km/day included', 'GHS 2/km extra', 'Weekly unlimited available'] },
              { title: 'Deposit', items: ['GHS 500 – GHS 2000', 'Refundable on return', 'Based on vehicle class'] },
            ].map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="font-heading font-semibold text-white text-sm mb-3 text-brand-red">{section.title}</h4>
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + j * 0.03 }}
                      className="text-brand-gray text-xs flex items-start gap-2"
                    >
                      <span className="text-brand-red mt-0.5">—</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Related Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading font-bold text-2xl text-white mb-8">Related Vehicles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="relative bg-brand-red/10 border-t border-brand-red/20 py-16 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background: `radial-gradient(circle at center, rgba(174,33,25,0.3) 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading font-bold text-3xl text-white mb-4">Ready to Drive?</h3>
            <p className="text-brand-gray mb-8">Book the {vehicle.name} today and experience premium mobility.</p>
            <motion.button
              onClick={handleBookNow}
              whileHover={{ scale: 1.05, boxShadow: `0 0 50px rgba(174,33,25,0.6)` }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center gap-2 relative overflow-hidden group"
            >
              <Sparkles className="w-4 h-4" />
              Book {vehicle.name}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ pointerEvents: 'none' }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
