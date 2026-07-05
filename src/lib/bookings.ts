import { supabase } from './supabase';
import type { Booking } from './supabase';
import { adminStore } from '../admin/store/adminStore';
import { fetchLocalUserBookings, isNetworkAuthError, localUserAuth } from './localUserAuth';

type BookingQueryOptions = {
  statuses?: Booking['status'][];
  ascending?: boolean;
};

export const fetchUserBookings = async (
  userId: string,
  email: string,
  options: BookingQueryOptions = {},
): Promise<Booking[]> => {
  if (localUserAuth.isLocalUser(userId)) {
    return fetchLocalUserBookings(email, options);
  }

  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .or(`user_id.eq.${userId},customer_email.ilike.${email}`)
      .order('created_at', { ascending: options.ascending ?? false });

    if (options.statuses?.length) {
      query = query.in('status', options.statuses);
    }

    const { data, error } = await query;
    if (error) {
      if (isNetworkAuthError(error.message)) {
        return fetchLocalUserBookings(email, options);
      }
      console.warn('Failed to fetch bookings:', error.message);
      return fetchLocalUserBookings(email, options);
    }
    return data ?? [];
  } catch {
    return fetchLocalUserBookings(email, options);
  }
};

export const linkBookingsByEmail = async (userId: string, email: string) => {
  adminStore.init();
  adminStore.linkCustomerByEmail(userId, email);

  if (localUserAuth.isLocalUser(userId)) {
    return;
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ user_id: userId })
      .eq('customer_email', email)
      .is('user_id', null);

    if (error && !isNetworkAuthError(error.message)) {
      console.warn('Failed to link bookings by email:', error.message);
    }
  } catch {
    // Local linking already handled above.
  }
};
