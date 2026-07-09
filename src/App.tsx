import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Results from "./pages/Results.tsx";
import Booking from "./pages/Booking.tsx";
import Confirmation from "./pages/Confirmation.tsx";
import Parcel from "./pages/Parcel.tsx";
import Track from "./pages/Track.tsx";
import Trips from "./pages/Trips.tsx";
import Profile from "./pages/Profile.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import RouteMap from "./pages/RouteMap.tsx";
import Lounge from "./pages/Lounge.tsx";
import Support from "./pages/Support.tsx";
import { BottomNav } from "./components/BottomNav.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book" element={<Index />} />
          <Route path="/results" element={<Results />} />
          <Route path="/book/:tripId" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/parcels" element={<Parcel />} />
          <Route path="/parcel" element={<Parcel />} />
          <Route path="/track" element={<Track />} />
          <Route path="/tickets" element={<Trips />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/route-map" element={<RouteMap />} />
          <Route path="/lounge" element={<Lounge />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
