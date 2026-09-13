import { useState } from "react";
import { SkyBoundShell } from "@/components/SkyBoundShell";
import { CityCabHeader } from "@/components/CityCabHeader";
import { SkyBoundHero } from "@/components/SkyBoundHero";
import { SkyBoundBookingBar } from "@/components/SkyBoundBookingBar";
import { CategoryRow } from "@/components/CategoryRow";
import { PopularRoutesSection } from "@/components/PopularRoutesSection";
import { FleetSection } from "@/components/FleetSection";
import { AirportSpotlight } from "@/components/AirportSpotlight";
import { DestinationsSection } from "@/components/DestinationsSection";
import { CorporateSection } from "@/components/CorporateSection";
import { TrustAndReviews } from "@/components/TrustAndReviews";
import { CityCabFooter } from "@/components/CityCabFooter";
import { ProgressiveBookingModal } from "@/components/ProgressiveBookingModal";

export default function Index() {
  const [activeNavTab, setActiveNavTab] = useState("Airport");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCriteria, setBookingCriteria] = useState<{
    pickup?: string;
    destination?: string;
    date?: string;
    time?: string;
    passengers?: number;
  }>({
    pickup: "Hosea Kutako International Airport",
    destination: "Windhoek (Any Hotel or Address)",
    date: new Date().toISOString().slice(0, 10),
    time: "14:30",
    passengers: 2,
  });

  const handleBookingSearch = (criteria: {
    pickup: string;
    destination: string;
    date: string;
    time: string;
    passengers: number;
  }) => {
    setBookingCriteria(criteria);
    setIsBookingOpen(true);
  };

  const handleSelectCategory = (catId: string) => {
    setActiveNavTab(catId);
    if (catId === "Airport") {
      setBookingCriteria((prev) => ({
        ...prev,
        pickup: "Hosea Kutako International Airport",
        destination: "Windhoek (Any Hotel or Address)",
      }));
    } else if (catId === "City") {
      setBookingCriteria((prev) => ({
        ...prev,
        pickup: "Windhoek City Center",
        destination: "Windhoek West / Central Hotel",
      }));
    } else if (catId === "Lodge") {
      setBookingCriteria((prev) => ({
        ...prev,
        pickup: "Windhoek City",
        destination: "Sossusvlei / Namib Desert",
      }));
    } else if (catId === "Safari") {
      setBookingCriteria((prev) => ({
        ...prev,
        pickup: "Windhoek City",
        destination: "Etosha National Park Lodges",
      }));
    }
    setIsBookingOpen(true);
  };

  const handleRouteSelect = (from: string, to: string) => {
    setBookingCriteria((prev) => ({
      ...prev,
      pickup: from,
      destination: to,
    }));
    setIsBookingOpen(true);
  };

  const handleVehicleSelect = (vehicleName: string) => {
    setIsBookingOpen(true);
  };

  const handleDestinationSelect = (destName: string) => {
    setBookingCriteria((prev) => ({
      ...prev,
      pickup: "Windhoek City",
      destination: destName,
    }));
    setIsBookingOpen(true);
  };

  return (
    <SkyBoundShell>
      {/* Top Header */}
      <CityCabHeader
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Hero Viewport */}
      <SkyBoundHero
        onQuickRouteSelect={(route) => handleRouteSelect(route.from, route.to)}
      />

      {/* Booking Search Bar overlapping hero bottom */}
      <SkyBoundBookingBar
        onSearch={handleBookingSearch}
      />

      {/* Category Row with circular navigation buttons */}
      <CategoryRow
        selectedCategory={activeNavTab}
        onSelectCategory={handleSelectCategory}
      />

      {/* Popular Routes Section */}
      <PopularRoutesSection
        onSelectRoute={handleRouteSelect}
      />

      {/* Dedicated Fleet Section */}
      <FleetSection
        onSelectVehicle={handleVehicleSelect}
      />

      {/* Flagship Airport Spotlight */}
      <AirportSpotlight
        onBookAirport={() => {
          handleRouteSelect("Hosea Kutako International Airport", "Windhoek (Any Hotel or Address)");
        }}
      />

      {/* Key Namibia Destinations */}
      <DestinationsSection
        onBookDestination={handleDestinationSelect}
      />

      {/* Corporate & Executive Section */}
      <CorporateSection
        onRequestCorporate={() => setIsBookingOpen(true)}
      />

      {/* Trust, History & Reviews */}
      <TrustAndReviews />

      {/* Editorial Footer */}
      <CityCabFooter />

      {/* 6-Step Progressive Booking Modal */}
      <ProgressiveBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialCriteria={bookingCriteria}
      />
    </SkyBoundShell>
  );
}
