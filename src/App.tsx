import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BookingPortal from "./pages/BookingPortal.tsx";
import NotFound from "./pages/NotFound.tsx";
import Results from "./pages/Results.tsx";
import Booking from "./pages/Booking.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import Parcel from "./pages/Parcel.tsx";
import Track from "./pages/Track.tsx";
import Trips from "./pages/Trips.tsx";
import Profile from "./pages/Profile.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { BottomNav } from "./components/BottomNav.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Auth from "./pages/Auth.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [entry, setEntry] = useState<"checking" | "onboarding" | "auth" | "app">("checking");
  useEffect(() => { setEntry(localStorage.getItem("citycab_session") ? "app" : localStorage.getItem("citycab_onboarded") ? "auth" : "onboarding"); }, []);
  if (entry === "checking") return null;
  if (entry === "onboarding") return <Onboarding onComplete={() => { localStorage.setItem("citycab_onboarded", "true"); setEntry("auth"); }} />;
  if (entry === "auth") return <Auth onComplete={() => setEntry("app")} />;
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<BookingPortal />} />
          <Route path="/results" element={<Results />} />
          <Route path="/book/:tripId" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/parcels" element={<Parcel />} />
          <Route path="/parcel" element={<Parcel />} />
          <Route path="/track" element={<Track />} />
          <Route path="/tickets" element={<Trips />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
