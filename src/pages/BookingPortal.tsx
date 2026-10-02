import { TopBar } from "@/components/TopBar";
import { SearchCard } from "@/components/SearchCard";
export default function BookingPortal() {
  return <div className="safe-page bg-background"><TopBar title="Book a Ride" back="/" /><main className="mx-auto max-w-md px-4 pt-4"><SearchCard compact /></main></div>;
}
