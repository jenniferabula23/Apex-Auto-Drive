import type { User } from '@supabase/supabase-js';
import { adminStore } from '../admin/store/adminStore';
import type { Booking } from './supabase';

const USERS_KEY = 'aad_local_users';
const SESSION_KEY = 'aad_user_session';

export type LocalUserRecord = {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
};

export type LocalUserSession = {
  userId: string;
  email: string;
  name: string;
  loggedInAt: string;
};

const readUsers = (): LocalUserRecord[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as LocalUserRecord[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: LocalUserRecord[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const seedUsers = (): LocalUserRecord[] => [
  {
    id: 'local-user-david',
    email: 'david.okoro@email.com',
    password: 'demo123',
    name: 'David Okoro',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'local-user-demo',
    email: 'user@demo.com',
    password: 'demo123',
    name: 'Demo User',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const allUsers = (): LocalUserRecord[] => {
  const stored = readUsers();
  const seeded = seedUsers();
  const merged = [...seeded];
  stored.forEach(user => {
    if (!merged.some(item => item.email.toLowerCase() === user.email.toLowerCase())) {
      merged.push(user);
    }
  });
  return merged;
};

export const localUserToSupabaseUser = (session: LocalUserSession): User =>
  ({
    id: session.userId,
    email: session.email,
    user_metadata: { full_name: session.name },
    app_metadata: { provider: 'local' },
    aud: 'authenticated',
    created_at: session.loggedInAt,
  }) as User;

export const isNetworkAuthError = (message: string) =>
  /failed to fetch|unable to fetch|network|fetch error/i.test(message);

export const localUserAuth = {
  getSession: (): LocalUserSession | null => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as LocalUserSession) : null;
    } catch {
      return null;
    }
  },

  signIn: (email: string, password: string): { error: string | null; session?: LocalUserSession } => {
    const normalized = email.trim().toLowerCase();
    const match = allUsers().find(
      user => user.email.toLowerCase() === normalized && user.password === password,
    );
    if (!match) {
      return {
        error: 'Invalid email or password. Demo: user@demo.com / demo123',
      };
    }

    const session: LocalUserSession = {
      userId: match.id,
      email: match.email,
      name: match.name,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    adminStore.init();
    adminStore.linkCustomerByEmail(match.id, match.email);
    return { error: null, session };
  },

  signUp: (email: string, password: string, name: string): { error: string | null; session?: LocalUserSession } => {
    const normalized = email.trim().toLowerCase();
    if (allUsers().some(user => user.email.toLowerCase() === normalized)) {
      return { error: 'An account with this email already exists.' };
    }

    const record: LocalUserRecord = {
      id: `local-user-${Date.now()}`,
      email: email.trim(),
      password,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    writeUsers([...readUsers(), record]);

    const session: LocalUserSession = {
      userId: record.id,
      email: record.email,
      name: record.name,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    adminStore.init();
    adminStore.linkCustomerByEmail(record.id, record.email);
    return { error: null, session };
  },

  signOut: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  isLocalUser: (userId: string) => userId.startsWith('local-user-'),

  updateName: (userId: string, name: string) => {
    const session = localUserAuth.getSession();
    if (session?.userId === userId) {
      const next = { ...session, name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    }
    const stored = readUsers().map(user => (user.id === userId ? { ...user, name } : user));
    writeUsers(stored);
  },
};

const reservationToBooking = (reservation: ReturnType<typeof adminStore.getReservations>[number]): Booking => ({
  id: reservation.supabaseBookingId ?? reservation.id,
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
  return_date: reservation.returnDate,
  pickup_time: reservation.pickupTime,
  return_time: reservation.returnTime,
  days: reservation.days,
  price_per_day: reservation.pricePerDay,
  total_amount: reservation.totalAmount,
  status: reservation.status,
  payment_status: reservation.paymentStatus,
  rental_module: reservation.rentalModule,
  user_id: reservation.customerId ?? null,
  created_at: reservation.createdAt,
  updated_at: reservation.createdAt,
});

export const fetchLocalUserBookings = (
  email: string,
  options: { statuses?: Booking['status'][] } = {},
): Booking[] => {
  adminStore.init();
  const normalized = email.trim().toLowerCase();
  let bookings = adminStore
    .getReservations()
    .filter(reservation => reservation.customerEmail.trim().toLowerCase() === normalized)
    .map(reservationToBooking);

  if (options.statuses?.length) {
    bookings = bookings.filter(booking => options.statuses!.includes(booking.status));
  }

  return bookings.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
};
