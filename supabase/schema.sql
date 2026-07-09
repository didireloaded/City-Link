-- ============================================================================
-- CityLink Namibia — Complete Database Schema (Supabase / PostgreSQL)
-- Luxury Intercity Coach & Parcel Logistics Platform
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & WALLETS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Passenger',
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  wallet_balance_nad NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  loyalty_points INTEGER NOT NULL DEFAULT 150,
  vip_tier TEXT NOT NULL DEFAULT 'Platinum Member',
  saved_passengers JSONB DEFAULT '[]'::JSONB,
  saved_routes JSONB DEFAULT '[]'::JSONB,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. COACH FLEET & BUSES
CREATE TABLE IF NOT EXISTS public.buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fleet_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  seating_capacity INTEGER NOT NULL DEFAULT 49,
  amenities JSONB DEFAULT '["Wi-Fi", "USB Charging", "220V Sockets", "Climate AC", "Reclining Sleeper Seats"]'::JSONB,
  rating NUMERIC(3, 1) NOT NULL DEFAULT 4.9,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SCHEDULED TRIPS & TIMETABLES
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  bus_id UUID REFERENCES public.buses(id) ON DELETE SET NULL,
  route_origin TEXT NOT NULL,
  route_destination TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  duration TEXT NOT NULL,
  price_nad NUMERIC(10, 2) NOT NULL,
  pickup_terminal TEXT NOT NULL,
  dropoff_terminal TEXT NOT NULL,
  badge TEXT,
  booked_seats TEXT[] DEFAULT '{}'::TEXT[],
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PASSENGER BOOKINGS & TICKETS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id TEXT REFERENCES public.trips(id) ON DELETE RESTRICT,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  seats TEXT[] NOT NULL,
  travel_date DATE NOT NULL,
  subtotal_nad NUMERIC(10, 2) NOT NULL,
  luggage_fee_nad NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  service_fee_nad NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
  total_paid_nad NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  reminder_active BOOLEAN NOT NULL DEFAULT TRUE,
  rated BOOLEAN NOT NULL DEFAULT FALSE,
  delay_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PARCEL LOGISTICS & WAYBILLS
CREATE TABLE IF NOT EXISTS public.parcels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_code TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  origin_office TEXT NOT NULL,
  destination_office TEXT NOT NULL,
  parcel_size TEXT NOT NULL CHECK (parcel_size IN ('small', 'medium', 'large')),
  weight_kg NUMERIC(6, 2) NOT NULL,
  description TEXT NOT NULL,
  price_nad NUMERIC(10, 2) NOT NULL,
  current_status TEXT NOT NULL CHECK (current_status IN ('booked', 'dropped_off', 'in_transit', 'arrived', 'received', 'expired')),
  current_location TEXT NOT NULL,
  receiver_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  receiver_confirmed_at TIMESTAMPTZ,
  sender_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  sender_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PARCEL TRACKING EVENTS TIMELINE
CREATE TABLE IF NOT EXISTS public.parcel_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  note TEXT NOT NULL,
  logged_by_user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VIP LOUNGE ACCESS PASSES
CREATE TABLE IF NOT EXISTS public.lounge_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pass_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  terminal_location TEXT NOT NULL DEFAULT 'Windhoek Platinum Lounge',
  valid_until TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'redeemed', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_trips_route ON public.trips(route_origin, route_destination);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_parcels_tracking ON public.parcels(tracking_code);
CREATE INDEX IF NOT EXISTS idx_parcel_events_parcel ON public.parcel_events(parcel_id);

-- ============================================================================
-- SEED DATA (INITIAL NAMIBIAN ROUTES & FLEET)
-- ============================================================================
INSERT INTO public.buses (id, fleet_number, name, model, seating_capacity, rating, active) VALUES
('b1111111-1111-1111-1111-111111111111', 'CL-01', 'CityLink Platinum Coach', 'Marcopolo G8 1800 DD', 49, 4.9, true),
('b2222222-2222-2222-2222-222222222222', 'CL-02', 'Northern Express Sleeper', 'Scania K460 Touring', 49, 4.8, true),
('b3333333-3333-3333-3333-333333333333', 'CL-03', 'Coastal Executive Cruiser', 'Volvo 9700 Luxury Coach', 49, 5.0, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (id, route_origin, route_destination, departure_time, arrival_time, duration, price_nad, pickup_terminal, dropoff_terminal, badge) VALUES
('t1', 'Windhoek', 'Oshakati', '06:30', '14:30', '8h 00m', 350.00, 'CityLink Windhoek Terminal', 'Oshakati Open Market', 'Most Popular'),
('t2', 'Windhoek', 'Oshakati', '13:00', '21:00', '8h 00m', 350.00, 'CityLink Windhoek Terminal', 'Oshakati Open Market', 'Afternoon Express'),
('t3', 'Windhoek', 'Oshakati', '18:30', '02:30', '8h 00m', 365.00, 'CityLink Windhoek Terminal', 'Oshakati Open Market', 'Night Sleeper'),
('t4', 'Windhoek', 'Swakopmund', '07:00', '11:45', '4h 45m', 320.00, 'CityLink Windhoek Terminal', 'Swakopmund Central Coach Station', 'Coastal Express'),
('t5', 'Windhoek', 'Walvis Bay', '07:00', '12:15', '5h 15m', 330.00, 'CityLink Windhoek Terminal', 'Walvis Bay Civic Centre Terminal', 'Direct Run'),
('t6', 'Oshakati', 'Windhoek', '06:30', '14:30', '8h 00m', 350.00, 'Oshakati Open Market', 'CityLink Windhoek Terminal', 'Return Express')
ON CONFLICT DO NOTHING;
