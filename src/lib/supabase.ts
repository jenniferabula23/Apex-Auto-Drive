import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgjrjgrnltxcynfxqxeg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nanJqZ3JubHR4Y3luZnhxeGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDE4MDIsImV4cCI6MjA5NDI3NzgwMn0.Zaa6h5clOQ1Tz1PSGVvKxOBN6s0oSVu7MQxTSLWAuhE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Booking = {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_image: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  days: number;
  price_per_day: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'invoiced' | 'paid' | 'not_required';
  pickup_time?: string;
  return_time?: string;
  rental_module?: string;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
};
