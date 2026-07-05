/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `booking_ref` (text, unique short reference shown to customer)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `notes` (text)
      - `vehicle_id` (text)
      - `vehicle_name` (text)
      - `vehicle_image` (text)
      - `pickup_location` (text)
      - `pickup_date` (text)
      - `return_date` (text)
      - `days` (integer)
      - `price_per_day` (numeric)
      - `total_amount` (numeric)
      - `status` (text) — pending | confirmed | cancelled | completed
      - `payment_status` (text) — unpaid | invoiced | paid
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings`
    - Allow anonymous + authenticated INSERT (public booking form)
    - SELECT/UPDATE/DELETE restricted to authenticated users (admins)
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text UNIQUE NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_email text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  notes text DEFAULT '',
  vehicle_id text NOT NULL DEFAULT '',
  vehicle_name text NOT NULL DEFAULT '',
  vehicle_image text DEFAULT '',
  pickup_location text DEFAULT '',
  pickup_date text DEFAULT '',
  return_date text DEFAULT '',
  days integer NOT NULL DEFAULT 1,
  price_per_day numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
