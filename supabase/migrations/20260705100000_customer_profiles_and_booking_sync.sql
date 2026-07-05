/*
  # Customer profiles + booking sync fields

  1. New table `customer_profiles` — ID verification for signed-up users
  2. Booking columns — pickup_time, return_time, rental_module, admin_reservation_id
  3. RLS — users can view bookings by user_id OR matching email; claim unlinked bookings on login
*/

CREATE TABLE IF NOT EXISTS customer_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  license_number text NOT NULL DEFAULT '',
  document_type text NOT NULL DEFAULT 'national_id',
  document_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'pickup_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN pickup_time text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'return_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN return_time text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'rental_module'
  ) THEN
    ALTER TABLE bookings ADD COLUMN rental_module text NOT NULL DEFAULT 'self_drive';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'admin_reservation_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN admin_reservation_id text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS bookings_customer_email_idx ON bookings (lower(customer_email));
CREATE INDEX IF NOT EXISTS bookings_admin_reservation_id_idx ON bookings (admin_reservation_id);

DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR (
      user_id IS NULL
      AND lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  WITH CHECK (auth.uid() = user_id);
