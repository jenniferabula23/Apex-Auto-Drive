import { supabase } from '../../lib/supabase';
import type { Customer, Reservation } from '../types';

const mapPaymentStatus = (status: Reservation['paymentStatus']) =>
  status === 'not_required' ? 'not_required' : status;

export const syncReservationToSupabase = async (
  reservation: Reservation,
  customer: Customer,
): Promise<{ id: string | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_ref: reservation.bookingRef,
      customer_name: reservation.customerName,
      customer_email: reservation.customerEmail,
      customer_phone: reservation.customerPhone,
      notes: reservation.notes,
      vehicle_id: reservation.vehicleId,
      vehicle_name: reservation.vehicleName,
      vehicle_image: reservation.vehicleImage,
      pickup_location: reservation.pickupLocation,
      pickup_date: reservation.pickupDate,
      pickup_time: reservation.pickupTime ?? '',
      return_date: reservation.returnDate,
      return_time: reservation.returnTime ?? '',
      days: reservation.days,
      price_per_day: reservation.pricePerDay,
      total_amount: reservation.totalAmount,
      status: reservation.status,
      payment_status: mapPaymentStatus(reservation.paymentStatus),
      rental_module: reservation.rentalModule,
      admin_reservation_id: reservation.id,
      user_id: customer.linkedUserId ?? null,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      const { data: existing, error: lookupError } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_ref', reservation.bookingRef)
        .maybeSingle();

      if (lookupError || !existing) {
        return { id: null, error: error.message };
      }
      return syncReservationUpdateToSupabase(reservation, customer, existing.id);
    }
    return { id: null, error: error.message };
  }

  return { id: data?.id ?? null, error: null };
};

export const syncReservationUpdateToSupabase = async (
  reservation: Reservation,
  customer: Customer,
  supabaseBookingId?: string,
): Promise<{ id: string | null; error: string | null }> => {
  const bookingId = supabaseBookingId ?? reservation.supabaseBookingId;
  if (!bookingId) {
    return syncReservationToSupabase(reservation, customer);
  }

  const { error } = await supabase
    .from('bookings')
    .update({
      status: reservation.status,
      payment_status: mapPaymentStatus(reservation.paymentStatus),
      pickup_date: reservation.pickupDate,
      pickup_time: reservation.pickupTime ?? '',
      return_date: reservation.returnDate,
      return_time: reservation.returnTime ?? '',
      total_amount: reservation.totalAmount,
      user_id: customer.linkedUserId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  return { id: bookingId, error: error?.message ?? null };
};
