import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ChevronDown, MapPin, ArrowRight, Map as MapIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bookingLink } from "@/lib/transfer-service";

const destinations = [
  { name: "Hosea Kutako", service: "Airport", center: [17.4709, -22.4799] },
  { name: "Windhoek West", service: "City", center: [17.067, -22.561] },
  { name: "Sossusvlei", service: "Lodge", center: [15.291, -24.727] },
  { name: "Etosha National Park", service: "Safari", center: [15.92, -19.18] },
] as const;

export default function HomeMap({ service = "All" }: { service?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const [message, setMessage] = useState(token ? "Loading map..." : "Map preview will be available soon.");
  const navigate = useNavigate();
  const visible = destinations.filter(destination => service === "All" || destination.service === service);

  useEffect(() => {
    if (!token?.startsWith("pk.") || !container.current) return;
    let instance: mapboxgl.Map;
    let resizeObserver: ResizeObserver | undefined;
    try {
      instance = new mapboxgl.Map({ container: container.current, accessToken: token, style: "mapbox://styles/mapbox/streets-v12", center: [17.0832, -22.5609], zoom: 12, cooperativeGestures: true, scrollZoom: false });
      map.current = instance;
      resizeObserver = new ResizeObserver(() => instance.resize());
      resizeObserver.observe(container.current);
      instance.on("load", () => setMessage(""));
      instance.on("error", () => setMessage("Map unavailable. You can still choose a destination below."));
      instance.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      const locate = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: false, maximumAge: 15000, timeout: 10000 }, trackUserLocation: false, showUserLocation: true });
      instance.addControl(locate, "top-right");
      locate.on("error", () => setMessage("Location unavailable. Showing Windhoek; choose your pickup when booking."));
      locate.on("geolocate", () => setMessage(""));
    } catch {
      setMessage("Map unavailable on this device. Choose a destination below.");
      return;
    }
    return () => { resizeObserver?.disconnect(); instance.remove(); map.current = null; };
  }, [token]);

  useEffect(() => {
    const instance = map.current;
    if (!instance) return;
    const markers = visible.map(destination => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "destination-map-pin";
      button.textContent = destination.name;
      button.setAttribute("aria-label", `Select ${destination.name}`);
      button.onclick = () => selectDestination(destination);
      return new mapboxgl.Marker({ element: button }).setLngLat([...destination.center]).addTo(instance);
    });
    return () => { markers.forEach(marker => marker.remove()); };
  }, [service, token]);

  function selectDestination(destination: typeof destinations[number]) {
    setSelected(destination.name);
    setExpanded(true);
    map.current?.flyTo({ center: [...destination.center], zoom: 10, essential: false, padding: { bottom: 220, top: 30, left: 20, right: 20 } });
  }

  return <section aria-label="Explore destinations on the map" className="home-map-surface relative mt-4 min-h-[380px] h-[max(420px,calc(100svh-330px))] overflow-hidden">
    <div ref={container} className="home-map-feather" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    {message && <div role="status" className="absolute left-4 right-16 top-4 rounded-xl bg-card p-3 text-xs font-semibold text-primary">{!token && <MapIcon className="mb-2 h-6 w-6 text-accent" />}{message}</div>}
    <div className="glass home-destination-sheet rounded-2xl p-3 shadow-lg">
      <button aria-expanded={expanded} aria-controls="destination-grid" onClick={() => setExpanded(!expanded)} className="flex w-full flex-col items-center gap-2 pb-1 text-primary"><span className="h-1 w-9 rounded-full bg-primary/20" /><span className="flex w-full items-center justify-between text-sm font-extrabold">Popular destinations<ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} /></span></button>
      {expanded && <div id="destination-grid" className="mt-3 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">{visible.map(destination => <div key={destination.name} className={`rounded-xl border p-2 ${selected === destination.name ? "border-accent bg-accent/20" : "border-white/60 bg-white/50"}`}><button aria-pressed={selected === destination.name} onClick={() => selectDestination(destination)} className="w-full text-left"><MapPin className="mb-2 h-4 w-4 text-primary" /><span className="block text-xs font-bold text-primary">{destination.name}</span><span className="text-[10px] text-muted-foreground">{destination.service} transfer</span></button>{selected === destination.name && <button onClick={() => navigate(bookingLink(destination.service))} className="mt-2 flex min-h-9 w-full items-center justify-between rounded-lg bg-primary px-2 text-xs font-bold text-white">Book ride<ArrowRight className="h-3 w-3" /></button>}</div>)}</div>}
    </div>
  </section>;
}
