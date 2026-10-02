import { Bell } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export default function Notifications() {
  return <div className="safe-page bg-background"><TopBar title="Notifications" back="/" /><main className="mx-auto max-w-md px-5 py-12 text-center"><Bell className="mx-auto h-10 w-10 text-accent" /><h1 className="mt-5 text-xl font-extrabold text-primary">You're all caught up</h1><p className="mt-2 text-sm text-muted-foreground">Ride updates and driver messages will appear here.</p></main></div>;
}
