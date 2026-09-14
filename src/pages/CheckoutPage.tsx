import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Car, Calendar, MapPin, User, Mail, Phone, ChevronRight, AlertCircle } from 'lucide-react';
import type { Vehicle } from '../data/vehicles';
import { locations, formatPickupLocation } from '../data/vehicles';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

interface BookingState {
  vehicle: Vehicle;
  location: string;
  destinationDetails?: string;
  pickupDate: string;
  pickupTime?: string;
  returnDate: string;
  days: number;
  pricePerDay: number;
  total: number;
}

type Step = 'summary' | 'details' | 'confirm' | 'success';

export default function CheckoutPage() {
  const { state } = useLocation() as { state: BookingState | null };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { format } = useCurrency();

  const [step, setStep] = useState<Step>('summary');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [bookingRef] = useState(`AAD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const vehicle = state?.vehicle;
  const locationLabel = locations.find(l => l.key === state?.location)?.label || state?.location || 'Accra';
  const pickupLocation = formatPickupLocation(locationLabel, state?.destinationDetails);

  if (!vehicle || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-brand-red mx-auto mb-4" />
          <h2 className="text-gray-900 text-2xl mb-2">No Booking Found</h2>
          <p className="text-brand-gray mb-6">Please select a vehicle first.</p>
          <Link to="/vehicles" className="btn-primary">
            Browse Fleet
          </Link>
        </div>
      </div>
    );
  }

  // Checkout charges
  const baseTotal = Number(state.total) || 0;
  const securityDeposit = baseTotal * 0.25;
  const deliveryFee = 200;
  const grandTotal = baseTotal + securityDeposit + deliveryFee;

  const steps: { key: Step; label: string }[] = [
    { key: 'summary', label: 'Summary' },
    { key: 'details', label: 'Your Details' },
    { key: 'confirm', label: 'Confirm' },
    { key: 'success', label: 'Confirmed' },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  const handleSubmit = async () => {
    if (step === 'summary') {
      setStep('details');
      return;
    }

    if (step === 'details') {
      setStep('confirm');
      return;
    }

    if (step === 'confirm' && agreeTerms) {
      setSubmitting(true);
      setSubmitError(null);

      const { error } = await supabase.from('bookings').insert({
        booking_ref: bookingRef,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        notes: form.notes,
        vehicle_id: String(vehicle.id),
        vehicle_name: vehicle.name,
        vehicle_image: vehicle.image,
        pickup_location: pickupLocation,
        pickup_date: state.pickupDate || '',
        pickup_time: state.pickupTime || '',
        return_date: state.returnDate || '',
        return_time: '',
        days: state.days,
        price_per_day: state.pricePerDay,
        total_amount: grandTotal,
        user_id: user?.id ?? null,
      });

      setSubmitting(false);

      if (error) {
        setSubmitError(error.message || 'Failed to submit booking. Please try again.');
        return;
      }

      setStep('success');
    }
  };

  void navigate;

  const orderSummaryCard = (
    <div className="bg-white border border-black/10 p-6">
      <h3 className="font-heading font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">
        Order Summary
      </h3>

      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="w-full h-36 object-cover mb-4"
      />

      <p className="font-heading font-bold text-gray-900 mb-1">
        {vehicle.name}
      </p>

      <p className="text-brand-gray text-xs mb-4">
        {pickupLocation}
      </p>

      <div className="border-t border-black/10 pt-4 space-y-3">

        <div className="flex justify-between text-sm">
          <span className="text-brand-gray">Rate</span>
          <span className="text-gray-900">
            {format(state.pricePerDay)}/day
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-brand-gray">Duration</span>
          <span className="text-gray-900">
            {state.days} day{state.days > 1 ? 's' : ''}
          </span>
        </div>

        <div className="border-t border-black/10 pt-3 flex justify-between text-sm">
          <span className="text-brand-gray">Booking Total</span>
          <span className="text-gray-900">
            {format(baseTotal)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-brand-gray">
            Security Deposit (25%)
          </span>
          <span className="text-gray-900">
            {format(securityDeposit)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-brand-gray">Delivery Fee</span>
          <span className="text-gray-900">
            {format(deliveryFee)}
          </span>
        </div>

        <div className="border-t border-black/10 pt-3 flex justify-between">
          <span className="text-gray-900 font-semibold text-sm">
            Total to Pay
          </span>

          <span className="text-brand-red font-bold font-heading">
            {format(grandTotal)}
          </span>
        </div>

      </div>
    </div>
  );

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-lg mx-auto px-4 text-center">

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="w-24 h-24 bg-brand-red/10 border-2 border-brand-red flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(174,33,25,0.4)]">
              <Check className="w-10 h-10 text-brand-red" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-heading font-black text-4xl text-gray-900 mb-4">
              Booking Submitted!
            </h2>

            <p className="text-brand-gray mb-6 leading-relaxed">
              Your booking is pending confirmation. Our team will contact you shortly with payment details and invoice.
            </p>

            <div className="bg-white border border-black/10 p-6 mb-8 text-left space-y-3">

              <div className="flex justify-between">
                <span className="text-brand-gray text-sm">
                  Booking Reference
                </span>

                <span className="text-brand-red font-bold font-heading">
                  {bookingRef}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-gray text-sm">
                  Vehicle
                </span>

                <span className="text-gray-900 text-sm">
                  {vehicle.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-gray text-sm">
                  Location
                </span>

                <span className="text-gray-900 text-sm text-right max-w-[60%]">
                  {pickupLocation}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-gray text-sm">
                  Booking Total
                </span>

                <span className="text-gray-900 text-sm">
                  {format(baseTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-gray text-sm">
                  Security Deposit (25%)
                </span>

                <span className="text-gray-900 text-sm">
                  {format(securityDeposit)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-gray text-sm">
                  Delivery Fee
                </span>

                <span className="text-gray-900 text-sm">
                  {format(deliveryFee)}
                </span>
              </div>

              <div className="border-t border-black/10 pt-3 flex justify-between">
                <span className="text-gray-900 font-semibold text-sm">
                  Total Amount
                </span>

                <span className="text-brand-red font-bold">
                  {format(grandTotal)}
                </span>
              </div>

            </div>

            <div className="bg-brand-red/10 border border-brand-red/20 p-4 mb-8 text-left">
              <p className="text-gray-900 text-sm font-semibold mb-1">
                Payment Instructions
              </p>

              <p className="text-brand-gray text-xs leading-relaxed">
                Our team will send an invoice to your email within 2 hours. Payment can be made via bank transfer or mobile money. Booking is confirmed once payment is verified.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/vehicles" className="btn-primary">
                Browse More Vehicles
              </Link>

              <Link to="/" className="btn-outline">
                Back to Home
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="border-b border-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">

          <div className="flex items-center justify-between">

            <div className="text-sm text-brand-gray">
              <Link to="/" className="hover:text-brand-red">
                Home
              </Link>

              <span className="mx-2">/</span>

              <span className="text-gray-900">
                Checkout
              </span>
            </div>

            {/* Progress steps */}
            <div className="hidden sm:flex items-center gap-2">
              {steps.slice(0, -1).map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">

                  <div
                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-all ${
                      i < stepIndex
                        ? 'bg-brand-red text-white'
                        : i === stepIndex
                        ? 'bg-brand-red text-white'
                        : 'border border-black/10 text-brand-gray'
                    }`}
                  >
                    {i < stepIndex ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>

                  <span
                    className={`text-xs ${
                      i === stepIndex
                        ? 'text-gray-900'
                        : 'text-brand-gray'
                    }`}
                  >
                    {s.label}
                  </span>

                  {i < steps.length - 2 && (
                    <ChevronRight className="w-3 h-3 text-brand-gray/40" />
                  )}

                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">

            <AnimatePresence mode="wait">

              {/* SUMMARY */}
              {step === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >

                  <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
                    Booking Summary
                  </h2>

                  <div className="bg-white border border-black/10 p-6 space-y-6">

                    <div className="flex gap-5">

                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-32 h-24 object-cover flex-shrink-0"
                      />

                      <div>
                        <h3 className="font-heading font-bold text-gray-900 text-lg">
                          {vehicle.name}
                        </h3>

                        <p className="text-brand-gray text-sm">
                          {vehicle.model} · {vehicle.year}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">

                          <span className="text-xs border border-black/10 px-2 py-1 text-brand-gray">
                            {vehicle.transmission}
                          </span>

                          <span className="text-xs border border-black/10 px-2 py-1 text-brand-gray">
                            {vehicle.seats} seats
                          </span>

                          <span className="text-xs border border-black/10 px-2 py-1 text-brand-gray">
                            {vehicle.fuelType}
                          </span>

                        </div>
                      </div>
                    </div>

                    <div className="border-t border-black/10 pt-4 space-y-4">

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-brand-red mt-0.5 flex-shrink-0" />

                        <div>
                          <span className="text-brand-gray text-sm block">
                            Pickup Location
                          </span>

                          <span className="text-gray-900 text-sm font-semibold">
                            {pickupLocation}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-brand-red" />

                        <span className="text-brand-gray text-sm">
                          Pickup:
                        </span>

                        <span className="text-gray-900 text-sm">
                          {state.pickupDate || 'TBC'}
                          {state.pickupTime
                            ? ` at ${state.pickupTime}`
                            : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-brand-red" />

                        <span className="text-brand-gray text-sm">
                          Return:
                        </span>

                        <span className="text-gray-900 text-sm">
                          {state.returnDate || 'TBC'}
                        </span>
                      </div>

                    </div>

                    {/* PRICE BREAKDOWN */}
                    <div className="border-t border-black/10 pt-4 space-y-3">

                      <div className="flex justify-between text-sm">
                        <span className="text-brand-gray">
                          Booking Total
                        </span>

                        <span className="text-gray-900">
                          {format(baseTotal)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-brand-gray">
                          Security Deposit (25%)
                        </span>

                        <span className="text-gray-900">
                          {format(securityDeposit)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-brand-gray">
                          Delivery Fee
                        </span>

                        <span className="text-gray-900">
                          {format(deliveryFee)}
                        </span>
                      </div>

                      <div className="border-t border-black/10 pt-3 flex justify-between">

                        <span className="text-gray-900 font-semibold">
                          Total to Pay
                        </span>

                        <span className="text-brand-red font-heading font-bold text-xl">
                          {format(grandTotal)}
                        </span>

                      </div>

                    </div>

                  </div>
                </motion.div>
              )}

              {/* DETAILS */}
              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >

                  <div className="lg:hidden mb-6">
                    {orderSummaryCard}
                  </div>

                  <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
                    Your Details
                  </h2>

                  <div className="space-y-4">

                    <div>
                      <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">
                        Full Name *
                      </label>

                      <div className="relative">

                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />

                        <input
                          type="text"
                          value={form.name}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Your full name"
                          className="w-full bg-white border border-black/10 text-gray-900 pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/40"
                        />

                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">
                        Email Address *
                      </label>

                      <div className="relative">

                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />

                        <input
                          type="email"
                          value={form.email}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your@email.com"
                          className="w-full bg-white border border-black/10 text-gray-900 pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/40"
                        />

                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">
                        Phone Number *
                      </label>

                      <div className="relative">

                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-red" />

                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e =>
                            setForm(f => ({
                              ...f,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+233 XX XXX XXXX"
                          className="w-full bg-white border border-black/10 text-gray-900 pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/40"
                        />

                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-brand-gray uppercase tracking-widest mb-2 block">
                        Special Requests (Optional)
                      </label>

                      <textarea
                        value={form.notes}
                        onChange={e =>
                          setForm(f => ({
                            ...f,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Any special requirements or notes..."
                        rows={3}
                        className="w-full bg-white border border-black/10 text-gray-900 px-4 py-3 text-sm outline-none focus:border-brand-red/50 placeholder-brand-gray/40 resize-none"
                      />

                    </div>

                  </div>
                </motion.div>
              )}

              {/* CONFIRM */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >

                  <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
                    Confirm Booking
                  </h2>

                  {/* Full summary */}
                  <div className="bg-white border border-black/10 p-6 mb-6 space-y-3">

                    <h3 className="font-heading font-semibold text-gray-900 mb-4">
                      Booking Overview
                    </h3>

                    {[
                      ['Vehicle', vehicle.name],
                      ['Location', pickupLocation],
                      ['Pickup Date', state.pickupDate || 'TBC'],
                      ['Return Date', state.returnDate || 'TBC'],
                      ['Duration', `${state.days} day${state.days > 1 ? 's' : ''}`],
                      ['Price/Day', format(state.pricePerDay)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">

                        <span className="text-brand-gray text-sm">
                          {label}
                        </span>

                        <span className="text-gray-900 text-sm">
                          {value}
                        </span>

                      </div>
                    ))}

                    {/* FINAL PRICE BREAKDOWN */}
                    <div className="border-t border-black/10 pt-3 space-y-3">

                      <div className="flex justify-between">
                        <span className="text-brand-gray text-sm">
                          Booking Total
                        </span>

                        <span className="text-gray-900 text-sm">
                          {format(baseTotal)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-brand-gray text-sm">
                          Security Deposit (25%)
                        </span>

                        <span className="text-gray-900 text-sm">
                          {format(securityDeposit)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-brand-gray text-sm">
                          Delivery Fee
                        </span>

                        <span className="text-gray-900 text-sm">
                          {format(deliveryFee)}
                        </span>
                      </div>

                      <div className="border-t border-black/10 pt-3 flex justify-between">

                        <span className="text-gray-900 font-semibold">
                          Total to Pay
                        </span>

                        <span className="text-brand-red font-heading font-bold text-xl">
                          {format(grandTotal)}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Payment note */}
                  <div className="bg-white border border-brand-red/20 p-5 mb-6">

                    <p className="text-gray-900 text-sm font-semibold mb-2 flex items-center gap-2">

                      <AlertCircle className="w-4 h-4 text-brand-red" />

                      Offline Payment Required

                    </p>

                    <p className="text-brand-gray text-xs leading-relaxed">
                      After confirming, our admin team will receive your booking and send an invoice to your email. Payment is processed offline via bank transfer or mobile money. Your booking is confirmed once payment is verified.
                    </p>

                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">

                    <div
                      onClick={() => setAgreeTerms(!agreeTerms)}
                      className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        agreeTerms
                          ? 'bg-brand-red border-brand-red'
                          : 'border-black/20'
                      }`}
                    >
                      {agreeTerms && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>

                    <span className="text-brand-gray text-sm leading-relaxed">
                      I have read and agree to the{' '}

                      <a
                        href="#"
                        className="text-brand-red hover:underline"
                      >
                        Terms & Conditions
                      </a>

                      {' '}and{' '}

                      <a
                        href="#"
                        className="text-brand-red hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>

                  </label>

                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">

              {step !== 'summary' && (
                <button
                  onClick={() =>
                    setStep(
                      step === 'confirm'
                        ? 'details'
                        : 'summary'
                    )
                  }
                  className="btn-outline"
                >
                  Back
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={
                  (step === 'confirm' && !agreeTerms) ||
                  submitting
                }
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Submitting...'
                  : step === 'summary'
                  ? 'Continue'
                  : step === 'details'
                  ? 'Review Booking'
                  : 'Confirm Booking'}

                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

            {submitError && (
              <p className="text-brand-red text-sm mt-3">
                {submitError}
              </p>
            )}

          </div>

          {/* Sidebar Summary — desktop only; mobile uses unified summary in main column */}
          <div className="hidden lg:block lg:col-span-1">

            <div className="sticky top-28">
              {orderSummaryCard}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}