-- ============================================================================
-- Windhoek City Cab -- Supabase / PostgreSQL Schema
-- Private passenger transfers in Windhoek and across Namibia
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  surname TEXT,
  name TEXT NOT NULL DEFAULT 'Passenger',
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  wallet_balance_nad NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  saved_passengers JSONB DEFAULT '[]'::JSONB,
  saved_places JSONB DEFAULT '[]'::JSONB,
  transfer_preferences JSONB DEFAULT '{}'::JSONB,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.vehicle_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  model_hint TEXT,
  passenger_capacity INTEGER NOT NULL,
  luggage_capacity INTEGER NOT NULL,
  amenities JSONB DEFAULT '["AC", "Smoke Free", "Luggage Help", "Private"]'::JSONB,
  airport_windhoek_starting_rate_nad NUMERIC(10, 2),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.vehicle_categories(id) ON DELETE SET NULL,
  registration_number TEXT UNIQUE NOT NULL,
  make_model TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  vehicle_category_id UUID REFERENCES public.vehicle_categories(id) ON DELETE SET NULL,
  pickup_location TEXT NOT NULL,
  pickup_lat NUMERIC(10, 7),
  pickup_lng NUMERIC(10, 7),
  destination TEXT NOT NULL,
  destination_lat NUMERIC(10, 7),
  destination_lng NUMERIC(10, 7),
  pickup_at TIMESTAMPTZ NOT NULL,
  is_return BOOLEAN NOT NULL DEFAULT FALSE,
  return_pickup_at TIMESTAMPTZ,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage_count INTEGER NOT NULL DEFAULT 0,
  child_seat_requested BOOLEAN NOT NULL DEFAULT FALSE,
  special_instructions TEXT,
  quoted_price_nad NUMERIC(10, 2),
  quote_required BOOLEAN NOT NULL DEFAULT FALSE,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  booking_status TEXT NOT NULL DEFAULT 'booking_confirmed' CHECK (booking_status IN ('booking_confirmed', 'driver_assigned', 'driver_heading_to_pickup', 'driver_arrived', 'passenger_onboard', 'on_the_way', 'arrived', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flight_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  flight_number TEXT,
  airline TEXT,
  movement TEXT CHECK (movement IN ('arrival', 'departure')),
  name_board_text TEXT,
  meet_and_greet BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.driver_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  eta_minutes INTEGER,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.booking_status_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount_nad NUMERIC(10, 2) NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (label IN ('Home', 'Work', 'Hotel', 'Custom')),
  address TEXT NOT NULL,
  lat NUMERIC(10, 7),
  lng NUMERIC(10, 7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  vehicle_category_id UUID REFERENCES public.vehicle_categories(id) ON DELETE CASCADE,
  starting_rate_nad NUMERIC(10, 2) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_status_events_booking ON public.booking_status_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_profile ON public.saved_places(profile_id);

INSERT INTO public.services (name, description) VALUES
('Airport Transfers', 'Private transfers to and from Hosea Kutako International Airport.'),
('City Transfers', 'Point-to-point private transport inside Windhoek.'),
('Lodge Transfers', 'Private transfers to hotels, lodges and resorts across Namibia.'),
('Safari Transfers', 'Long-distance tourism transfers between safari destinations.'),
('Executive Transfers', 'Chauffeur transport for meetings, errands and airport transfers.'),
('Staff Transportation', 'Employee and company transport.')
ON CONFLICT DO NOTHING;

INSERT INTO public.vehicle_categories (name, model_hint, passenger_capacity, luggage_capacity, airport_windhoek_starting_rate_nad) VALUES
('Sedan', 'Toyota Corolla Quest or similar', 3, 2, 450.00),
('Compact SUV', 'Toyota Urban Cruiser or similar', 4, 4, 700.00),
('SUV', 'Toyota Fortuner or similar', 4, 6, 900.00),
('Mini Bus', 'Toyota Quantum or similar', 10, 10, 1200.00)
ON CONFLICT DO NOTHING;
