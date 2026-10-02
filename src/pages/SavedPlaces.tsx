import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/TopBar";
import { useProfile } from "@/hooks/useProfile";
import { ROUTES } from "@/data/trips";
import { savedPlaceSchema } from "../../contracts/places";

export default function SavedPlaces() {
  const { profile, save, isSaving, isLoading } = useProfile();
  const [label, setLabel] = useState("Home");
  const [locality, setLocality] = useState("Windhoek");
  const [address, setAddress] = useState("");
  const places = profile.preferences?.savedPlaces || [];
  const persist = async (next: typeof places) => {
    try { await save({ preferences: { ...profile.preferences!, savedPlaces: next } }); return true; }
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not save places."); return false; }
  };
  return <div className="safe-page bg-background"><TopBar title="Saved places" back="/profile" /><main className="mx-auto max-w-md space-y-5 px-4 py-5">
    <section className="grid grid-cols-2 gap-3" aria-label="Saved places">
      {isLoading && <p role="status">Loading places...</p>}
      {places.map(place => <article key={place.id} className="rounded-lg border border-border bg-card p-3"><div className="flex items-center justify-between gap-2"><h2 className="break-words font-bold">{place.label}</h2><button disabled={isSaving} aria-label={"Delete " + place.label} onClick={async () => { if (await persist(places.filter(item => item.id !== place.id))) toast.success("Place removed."); }}><Trash2 className="h-4 w-4" /></button></div><p className="mt-2 break-words text-xs text-muted-foreground">{place.address}</p><p className="mt-1 text-xs">{place.locality}</p></article>)}
    </section>
    <form className="space-y-3" onSubmit={async event => { event.preventDefault(); const result = savedPlaceSchema.safeParse({ id: crypto.randomUUID(), label, locality, address }); if (!result.success) { toast.error("Add a label and address."); return; } if (places.length >= 20) { toast.error("You can save up to 20 places."); return; } if (await persist([...places, result.data])) { setAddress(""); toast.success("Place saved."); } }}>
      <h2 className="font-bold">Add a place</h2>
      <label className="block text-sm">Label<input required maxLength={40} value={label} onChange={e => setLabel(e.target.value)} list="place-labels" className="mt-1 h-12 w-full rounded-lg border border-border bg-input px-3" /></label><datalist id="place-labels"><option value="Home" /><option value="Work" /><option value="Hotel" /></datalist>
      <label className="block text-sm">Area<select value={locality} onChange={e => setLocality(e.target.value)} className="mt-1 h-12 w-full rounded-lg border border-border bg-input px-3">{ROUTES.filter(route => route !== "Current Location").map(route => <option key={route}>{route}</option>)}</select></label>
      <label className="block text-sm">Address<input required maxLength={255} value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, hotel and entrance" className="mt-1 h-12 w-full rounded-lg border border-border bg-input px-3" /></label>
      <button disabled={isSaving || isLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-white"><MapPin className="h-4 w-4" />{isSaving ? "Saving..." : "Save place"}</button>
    </form>
  </main></div>;
}
