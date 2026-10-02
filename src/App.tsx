import SavedPlaces from "./pages/SavedPlaces";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BookingPortal from "./pages/BookingPortal.tsx";
import NotFound from "./pages/NotFound.tsx";
import Results from "./pages/Results.tsx";
import VehicleDetails from "./pages/VehicleDetails";
import Booking from "./pages/Booking.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import Parcel from "./pages/Parcel.tsx";
import ParcelServices from "./pages/ParcelServices.tsx";
import Track from "./pages/Track.tsx";
import Trips from "./pages/Trips.tsx";
import Profile from "./pages/Profile.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Lounge from "./pages/Lounge.tsx";
import RouteMap from "./pages/RouteMap.tsx";
import Support from "./pages/Support.tsx";
import Notifications from "./pages/Notifications";
import Onboarding from "./pages/Onboarding.tsx";
import { BottomNav } from "./components/BottomNav.tsx";

const ONBOARDED_KEY = "citylink_onboarded";

const App = () => {
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDED_KEY) === "true",
  );

  if (!onboarded) {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem(ONBOARDED_KEY, "true");
          setOnboarded(true);
        }}
      />
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/book" element={<BookingPortal />} />
        <Route path="/vehicles/:vehicleId" element={<VehicleDetails />} />
        <Route path="/results" element={<Results />} />
        <Route path="/book/:tripId" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/parcels" element={<Parcel />} />
        <Route path="/parcel" element={<Parcel />} />
        <Route path="/parcels/track" element={<ParcelServices />} />
        <Route path="/track" element={<Track />} />
        <Route path="/tickets" element={<Trips />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/profile/places" element={<SavedPlaces />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lounge" element={<Lounge />} />
        <Route path="/route-map" element={<RouteMap />} />
        <Route path="/support" element={<Support />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </TooltipProvider>
  );
};

export default App;
