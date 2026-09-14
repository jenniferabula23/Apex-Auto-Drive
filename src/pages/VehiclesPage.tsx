import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import BookingForm from '../components/BookingForm';
import { getFleetVehicles, getVehicleCategories } from '../data/vehicles';
import { useCurrency } from '../context/CurrencyContext';

const transmissionOptions = ['All', 'Automatic', 'Manual'];
const fuelOptions = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];

export default function VehiclesPage() {
  const { format } = useCurrency();
  const fleet = getFleetVehicles();
  const categoryOptions = ['All', ...getVehicleCategories()];
  const [category, setCategory] = useState('All');
  const [transmission, setTransmission] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('recommended');
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = fleet
    .filter(v => category === 'All' || v.category === category)
    .filter(v => transmission === 'All' || v.transmission === transmission)
    .filter(v => fuel === 'All' || v.fuelType === fuel)
    .filter(v => (v.pricePerDay?.accra ?? 0) <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.pricePerDay?.accra ?? 0) - (b.pricePerDay?.accra ?? 0);
      if (sortBy === 'price-desc') return (b.pricePerDay?.accra ?? 0) - (a.pricePerDay?.accra ?? 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const clearFilters = () => {
    setCategory('All');
    setTransmission('All');
    setFuel('All');
    setMaxPrice(5000);
  };

  const hasActiveFilters = category !== 'All' || transmission !== 'All' || fuel !== 'All' || maxPrice !== 5000;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1400)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-brand-gray text-sm"
          >
            <a href="/" className="hover:text-brand-red transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Vehicles</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-black text-5xl text-gray-900 mb-4"
          >
            Find Your <span className="text-brand-red" style={{ textShadow: '0 0 40px rgba(174,33,25,0.6)' }}>Perfect Ride</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-brand-gray max-w-lg"
          >
            Browse our curated fleet of {fleet.length}+ premium vehicles available across Ghana. Filter, sort, and book in seconds.
          </motion.p>
        </div>
      </div>

      {/* Booking Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-8">
        <BookingForm />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 flex-shrink-0`}>
            {/* Mobile filter toggle */}
            <button
              className="lg:hidden w-full flex items-center justify-between bg-white border border-black/10 px-4 py-3 mb-4 hover:border-brand-red/50 transition-colors"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span className="flex items-center gap-2 text-gray-900 font-semibold"><Filter className="w-4 h-4 text-brand-red" /> Filters</span>
              <span className="text-brand-gray text-xs">{filterOpen ? 'Hide' : 'Show'}</span>
            </button>

            <motion.div
              initial={false}
              animate={{ height: filterOpen ? 'auto' : 0, opacity: filterOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-6 lg:!h-auto lg:!opacity-100 lg:overflow-visible"
            >
              <div className="bg-white border border-black/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-red" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={clearFilters}
                      className="text-brand-red text-xs flex items-center gap-1 hover:text-brand-red transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </motion.button>
                  )}
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="text-xs text-brand-gray uppercase tracking-widest mb-3 block font-semibold">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map(opt => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(opt)}
                        className={`px-3 py-1.5 text-xs transition-all ${
                          category === opt
                            ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(174,33,25,0.4)]'
                            : 'border border-black/10 text-brand-gray hover:border-black/30 hover:text-brand-red'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-xs text-brand-gray uppercase tracking-widest mb-3 flex justify-between font-semibold">
                    <span>Max Price</span>
                    <span className="text-gray-900">{format(maxPrice)}</span>
                  </label>
                  <input
                    type="range"
                    min={200}
                    max={5000}
                    step={100}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-brand-red cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-brand-gray mt-2">
                    <span>{format(200)}</span>
                    <span>{format(5000)}</span>
                  </div>
                </div>

                {/* Transmission */}
                <div className="mb-6">
                  <label className="text-xs text-brand-gray uppercase tracking-widest mb-3 block font-semibold">Transmission</label>
                  <div className="space-y-2">
                    {transmissionOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <motion.div
                          onClick={() => setTransmission(opt)}
                          whileHover={{ scale: 1.1 }}
                          className={`w-4 h-4 border flex items-center justify-center cursor-pointer transition-all ${
                            transmission === opt ? 'border-brand-red bg-brand-red' : 'border-black/10 group-hover:border-black/30'
                          }`}
                        >
                          {transmission === opt && <div className="w-2 h-2 bg-white" />}
                        </motion.div>
                        <span className="text-sm text-brand-gray group-hover:text-brand-red transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fuel */}
                <div>
                  <label className="text-xs text-brand-gray uppercase tracking-widest mb-3 block font-semibold">Fuel Type</label>
                  <div className="space-y-2">
                    {fuelOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <motion.div
                          onClick={() => setFuel(opt)}
                          whileHover={{ scale: 1.1 }}
                          className={`w-4 h-4 border flex items-center justify-center cursor-pointer transition-all ${
                            fuel === opt ? 'border-brand-red bg-brand-red' : 'border-black/10 group-hover:border-black/30'
                          }`}
                        >
                          {fuel === opt && <div className="w-2 h-2 bg-white" />}
                        </motion.div>
                        <span className="text-sm text-brand-gray group-hover:text-brand-red transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results header with animations */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/10"
            >
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-brand-gray text-sm"
                >
                  <span className="text-gray-900 font-heading text-2xl font-bold">{filtered.length}</span>
                  <span className="ml-2">premium vehicles available</span>
                </motion.p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-brand-gray text-xs uppercase tracking-widest">Sort</span>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-white border border-black/10 text-gray-900 text-sm pl-10 pr-4 py-2.5 outline-none focus:border-brand-red/50 focus:shadow-[0_0_15px_rgba(174,33,25,0.2)] transition-all cursor-pointer appearance-none hover:border-black/20"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </motion.div>
              </div>
            </motion.div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-brand-gray text-lg mb-4">No vehicles match your filters.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filtered.slice(0, visibleCount).map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <VehicleCard vehicle={v} index={i} />
                    </motion.div>
                  ))}
                </motion.div>
                {visibleCount < filtered.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-12"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVisibleCount(c => c + 4)}
                      className="btn-outline px-10 py-3 font-semibold"
                    >
                      Load More Vehicles
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
