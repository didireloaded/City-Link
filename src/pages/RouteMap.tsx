import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  INTERACTIVE_ROUTES,
  CITY_LINK_INFO,
  type CityLinkRoute,
} from "@/data/trips";
import { TopBar } from "@/components/TopBar";
import {
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  Bus,
  Phone,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Building2,
  Bell,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const RouteMap = () => {
  const [params] = useSearchParams();
  const initialRouteId = params.get("route") || "oshakati-windhoek";
  const [selectedRoute, setSelectedRoute] = useState<CityLinkRoute>(() => {
    const found = INTERACTIVE_ROUTES.find((r) => r.id === initialRouteId);
    return found || INTERACTIVE_ROUTES[0];
  });

  const [discountType, setDiscountType] = useState<string>("none");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0); // 0 to 100%
  const [activeTab, setActiveTab] = useState<"map" | "offices" | "schedule">("map");
  const [selectedStop, setSelectedStop] = useState<{
    name: string;
    x: number;
    y: number;
    isStop?: boolean;
    idx: number;
  } | null>(null);
  const [lastNotifiedTown, setLastNotifiedTown] = useState<string>("");
  const [notifications, setNotifications] = useState<
    { id: string; town: string; time: string; desc: string; isStop: boolean }[]
  >([]);

  // Handle simulation ticker
  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 1.2;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const startSimulation = () => {
    if (simProgress >= 100) setSimProgress(0);
    setIsSimulating(!isSimulating);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimProgress(0);
    setSelectedStop(null);
  };

  // Calculate discounted price
  const basePrice = selectedRoute.priceNAD;
  const activeDiscount = CITY_LINK_INFO.discounts.find((d) => d.type === discountType);
  const discountAmount = activeDiscount
    ? Math.round((basePrice * activeDiscount.percent) / 100)
    : 0;
  const finalPrice = basePrice - discountAmount;

  // Calculate simulated bus coordinates along the pathCoords
  const coords = selectedRoute.pathCoords;
  const getSimCoord = () => {
    if (coords.length < 2) return coords[0] || { x: 50, y: 50 };
    const idxFloat = (simProgress / 100) * (coords.length - 1);
    const idx = Math.floor(idxFloat);
    const nextIdx = Math.min(idx + 1, coords.length - 1);
    const frac = idxFloat - idx;
    const current = coords[idx];
    const next = coords[nextIdx];
    return {
      x: current.x + (next.x - current.x) * frac,
      y: current.y + (next.y - current.y) * frac,
      currentTown: frac > 0.5 ? next.name : current.name,
    };
  };

  const simBus = getSimCoord();

  useEffect(() => {
    if (isSimulating && simBus.currentTown && simBus.currentTown !== lastNotifiedTown) {
      setLastNotifiedTown(simBus.currentTown);
      const stopObj = selectedRoute.pathCoords.find((p) => p.name === simBus.currentTown);
      const isStop = stopObj?.isStop ?? false;
      const desc = isStop
        ? `Coach arrived at ${simBus.currentTown} Terminal. Boarding & alighting now.`
        : `Coach passing through ${simBus.currentTown}. Highway corridor clear.`;

      if (isStop) {
        toast.success(`Arrived at ${simBus.currentTown}`, { description: desc });
      } else {
        toast.info(`Checkpoint: Passing ${simBus.currentTown}`, { description: desc });
      }

      setNotifications((prev) => [
        {
          id: Math.random().toString(),
          town: simBus.currentTown,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          desc,
          isStop,
        },
        ...prev,
      ].slice(0, 5));
    }
  }, [isSimulating, simBus.currentTown, lastNotifiedTown, selectedRoute.pathCoords]);

  return (
    <div className="safe-page bg-background">
      <TopBar title="Interactive Route Map" subtitle="City-Link Highway Corridor" back="/" />

      <main className="mx-auto max-w-md px-4 pt-4 space-y-5">
        {/* Route Selector Pills */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Select Route
            </span>
            <span className="text-xs font-bold text-accent">
              Fixed N${basePrice} Fares
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {INTERACTIVE_ROUTES.map((r) => {
              const active = r.id === selectedRoute.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRoute(r);
                    resetSimulation();
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-extrabold transition-all active:scale-95 ${
                    active
                      ? "border-accent bg-accent text-accent-foreground shadow-[var(--shadow-glow)]"
                      : "border-border bg-card text-primary shadow-sm hover:border-accent/40"
                  }`}
                >
                  <span>{r.origin}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>{r.destination}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-secondary p-1">
          {[
            { id: "map", label: "Interactive Map" },
            { id: "offices", label: "Pick-up Offices" },
            { id: "schedule", label: "Fares & Discounts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`h-10 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === tab.id
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INTERACTIVE ROUTE MAP */}
        {activeTab === "map" && (
          <section className="space-y-4 animate-fade-up">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
              {/* Map Header Status Bar */}
              <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                  </span>
                  <span className="text-xs font-extrabold tracking-wide">
                    {selectedRoute.origin} to {selectedRoute.destination}
                  </span>
                </div>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold">
                  {selectedRoute.durationDisplay}
                </span>
              </div>

              {/* SVG Interactive Highway Corridor Map */}
              <div className="relative h-[340px] w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-background to-secondary/60 p-4">
                {/* Background Compass and Grid Elements */}
                <div className="absolute right-4 top-4 rounded-xl border border-border/50 bg-white/80 px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground shadow-sm backdrop-blur-sm">
                  B1 Highway Corridor
                </div>

                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full overflow-visible"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Highway Background Glow Polyline */}
                  <polyline
                    points={selectedRoute.pathCoords.map((c) => `${c.x},${c.y}`).join(" ")}
                    fill="none"
                    stroke="hsl(var(--primary) / 0.12)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Active Route Colored Line */}
                  <polyline
                    points={selectedRoute.pathCoords.map((c) => `${c.x},${c.y}`).join(" ")}
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="3.2"
                    strokeDasharray={isSimulating ? "6,4" : "none"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Town / Checkpoint Nodes */}
                  {selectedRoute.pathCoords.map((coord, index) => {
                    const isFirst = index === 0;
                    const isLast = index === selectedRoute.pathCoords.length - 1;
                    const isStop = coord.isStop;
                    const isSelected = selectedStop?.name === coord.name;

                    return (
                      <g
                        key={coord.name}
                        onClick={() => {
                          setSelectedStop({ ...coord, idx: index });
                          toast.info(`Inspect stop: ${coord.name}`);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Outer Glow for Origin/Destination or Selected */}
                        {(isFirst || isLast || isSelected) && (
                          <circle
                            cx={coord.x}
                            cy={coord.y}
                            r={isSelected ? "8" : "6"}
                            fill="hsl(var(--accent) / 0.3)"
                            className="animate-pulse"
                          />
                        )}

                        <circle
                          cx={coord.x}
                          cy={coord.y}
                          r={isSelected ? "4.5" : isFirst || isLast ? "4" : isStop ? "2.8" : "1.8"}
                          fill={
                            isSelected || isFirst || isLast
                              ? "hsl(var(--accent))"
                              : isStop
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))"
                          }
                          stroke="white"
                          strokeWidth="1.2"
                          className="transition-all duration-200"
                        />

                        {/* Town Label Banner */}
                        <text
                          x={coord.x + (coord.x > 50 ? -6 : 6)}
                          y={coord.y + 1}
                          textAnchor={coord.x > 50 ? "end" : "start"}
                          fontSize={isSelected || isFirst || isLast ? "4.5" : "3.6"}
                          fontWeight={isSelected || isFirst || isLast ? "800" : "700"}
                          fill={isSelected ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                          className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] transition-all group-hover:scale-110"
                        >
                          {coord.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Simulated Moving Bus Marker */}
                  {simProgress > 0 && (
                    <g
                      transform={`translate(${simBus.x}, ${simBus.y})`}
                      className="transition-transform duration-100 ease-linear"
                    >
                      <circle r="6" fill="hsl(var(--accent) / 0.35)" className="animate-ping" />
                      <circle r="4.5" fill="hsl(var(--primary))" stroke="white" strokeWidth="1.2" />
                      <text x="-2.8" y="1.4" fontSize="3.5" fill="white">
                        🚌
                      </text>
                    </g>
                  )}
                </svg>

                {/* Simulation Floating Control Bar */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-2xl border border-border bg-white/95 p-3 shadow-md backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={startSimulation}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm active:scale-95 transition-transform"
                    >
                      {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={resetSimulation}
                      title="Reset journey view"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold text-primary leading-tight truncate">
                        {simProgress > 0 ? `Near ${simBus.currentTown}` : "Ready to Depart"}
                      </div>
                      <div className="text-[10px] font-semibold text-muted-foreground">
                        {Math.round(simProgress)}% of journey
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
                      Depart / Arrive
                    </span>
                    <span className="text-xs font-extrabold text-primary">
                      {selectedRoute.departureTime} → {selectedRoute.arrivalTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route Summary Details */}
              <div className="grid grid-cols-2 gap-3 border-t border-border p-4 bg-card">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                    Pick-up Office ({selectedRoute.origin})
                  </span>
                  <p className="mt-1 text-xs font-extrabold text-primary leading-snug">
                    {selectedRoute.pickupAddress}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                    Drop-off Office ({selectedRoute.destination})
                  </span>
                  <p className="mt-1 text-xs font-extrabold text-primary leading-snug">
                    {selectedRoute.dropoffAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Stop Explorer Banner */}
            {selectedStop ? (
              <div className="rounded-3xl border border-accent bg-card p-5 shadow-md animate-fade-up space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent font-extrabold text-xl">
                      📍
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent block">
                        {selectedStop.isStop ? "Passenger Terminal & Stop" : "Highway Checkpoint"}
                      </span>
                      <h4 className="text-lg font-extrabold text-primary">{selectedStop.name}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStop(null)}
                    className="rounded-full bg-secondary p-2 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                    title="Close details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                  {selectedStop.isStop
                    ? `${selectedStop.name} is an official City-Link passenger terminal equipped with boarding assistance, ticket desk, and refreshment stop facilities.`
                    : `${selectedStop.name} is a scenic express checkpoint along our highway network. Coaches pass through on schedule with satellite tracking.`}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const targetPercent =
                        (selectedStop.idx / Math.max(1, selectedRoute.pathCoords.length - 1)) * 100;
                      setSimProgress(targetPercent);
                      setIsSimulating(false);
                      toast.success(`Moved coach to ${selectedStop.name}! Click Play to resume journey.`);
                    }}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-secondary text-xs font-extrabold text-primary hover:bg-secondary/80 active:scale-95 transition-all shadow-xs"
                  >
                    <Bus className="h-4 w-4 text-accent shrink-0" />
                    <span>Jump Coach Here</span>
                  </button>
                  <Link
                    to={`/results?from=${encodeURIComponent(selectedRoute.origin)}&to=${encodeURIComponent(
                      selectedStop.name
                    )}`}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-accent text-xs font-extrabold text-accent-foreground hover:bg-accent/90 active:scale-95 transition-all shadow-xs"
                  >
                    <Tag className="h-4 w-4 shrink-0" />
                    <span>Book to {selectedStop.name}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 p-3.5 text-xs font-semibold text-muted-foreground animate-fade-up">
                <span className="flex items-center gap-2.5 text-primary">
                  <MapPin className="h-4 w-4 text-accent animate-bounce shrink-0" />
                  <span>💡 Interactive Map: Click any checkpoint or terminal circle on the map to inspect stop details and jump coach position!</span>
                </span>
              </div>
            )}

            {/* Route Stops Sequence Card */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-primary mb-3">
                Intermediate Checkpoints ({selectedRoute.stops.length} Stops) — Click to Inspect
              </h3>
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                {[selectedRoute.origin, ...selectedRoute.stops, selectedRoute.destination].map(
                  (stop, index, arr) => {
                    const coordObj = selectedRoute.pathCoords.find((p) => p.name === stop) || {
                      name: stop,
                      x: 50,
                      y: 50,
                      isStop: true,
                    };
                    const isSel = selectedStop?.name === stop;
                    return (
                      <div
                        key={stop}
                        onClick={() => {
                          const idx = selectedRoute.pathCoords.findIndex((p) => p.name === stop);
                          setSelectedStop({ ...coordObj, idx: idx >= 0 ? idx : index });
                          toast.info(`Inspect stop: ${stop}`);
                        }}
                        className="flex items-center shrink-0 cursor-pointer group"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-extrabold transition-transform group-hover:scale-110 ${
                              isSel
                                ? "border-accent bg-accent text-accent-foreground ring-4 ring-accent/30"
                                : index === 0 || index === arr.length - 1
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border bg-secondary text-primary"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className={`mt-1 text-[11px] font-bold ${isSel ? "text-accent underline" : "text-primary"}`}>
                            {stop}
                          </span>
                        </div>
                        {index < arr.length - 1 && (
                          <div className="mx-2 h-0.5 w-6 bg-accent/40 rounded" />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Live Transit Checkpoint Feed */}
            {notifications.length > 0 && (
              <div className="rounded-3xl border border-accent/40 bg-accent/5 p-5 shadow-sm space-y-3.5 animate-fade-up">
                <div className="flex items-center justify-between border-b border-accent/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Bell className="h-4 w-4 animate-bounce" />
                    </span>
                    <h3 className="text-sm font-extrabold text-primary">Live Transit Checkpoints</h3>
                  </div>
                  <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-extrabold text-success uppercase">
                    Active Feed
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-2xl border border-border/70 bg-card p-3 shadow-xs flex items-start gap-3 transition-all animate-fade-up"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          n.isStop ? "bg-success/15 text-success" : "bg-secondary text-accent"
                        }`}
                      >
                        {n.isStop ? <CheckCircle2 className="h-4 w-4" /> : <Bus className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-primary">{n.town}</h4>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground leading-tight">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: PICK-UP OFFICES & ADDRESSES */}
        {activeTab === "offices" && (
          <section className="space-y-4 animate-fade-up">
            <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
              <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-extrabold uppercase">
                City-Link physical terminals
              </span>
              <h3 className="mt-3 text-xl font-extrabold">Where the Bus Picks Up & Drops Off</h3>
              <p className="mt-1 text-xs font-semibold text-white/75">
                Please arrive 30 minutes before departure for boarding check-in and luggage tags.
              </p>
            </div>

            <div className="space-y-3">
              {CITY_LINK_INFO.offices.map((off) => (
                <div
                  key={off.city}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-primary">{off.city} Office</h4>
                        <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-extrabold text-success uppercase">
                          Open Daily
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-bold text-muted-foreground leading-snug">
                        {off.address}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs font-bold">
                        <a
                          href={`tel:${CITY_LINK_INFO.contact.phone}`}
                          className="flex items-center gap-1.5 text-accent hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5" /> {CITY_LINK_INFO.contact.phone}
                        </a>
                        <span className="text-muted-foreground">
                          {CITY_LINK_INFO.contact.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: FARES, DISCOUNTS & OPERATING SCHEDULE */}
        {activeTab === "schedule" && (
          <section className="space-y-4 animate-fade-up">
            {/* Price & Discount Card */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Selected Route Fare
                  </span>
                  <h3 className="mt-0.5 text-3xl font-extrabold text-primary">
                    N${finalPrice}
                    {discountAmount > 0 && (
                      <span className="ml-2 text-sm font-bold text-muted-foreground line-through">
                        N${basePrice}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="rounded-2xl bg-secondary p-3 text-center">
                  <span className="block text-[10px] font-extrabold uppercase text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm font-extrabold text-primary">
                    {selectedRoute.durationDisplay}
                  </span>
                </div>
              </div>

              {/* Discount Selector */}
              <div>
                <label className="block text-xs font-extrabold text-primary mb-2">
                  Apply Eligible Passenger Discount:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType("none")}
                    className={`rounded-xl border p-2.5 text-left text-xs font-extrabold transition-all ${
                      discountType === "none"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    Standard Fare (0%)
                  </button>
                  {CITY_LINK_INFO.discounts.map((d) => (
                    <button
                      key={d.type}
                      type="button"
                      onClick={() => setDiscountType(d.type)}
                      className={`rounded-xl border p-2.5 text-left text-xs font-extrabold transition-all ${
                        discountType === d.type
                          ? "border-accent bg-accent/15 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground"
                      }`}
                    >
                      <span className="block truncate">{d.label}</span>
                      <span className="text-[10px] text-accent block mt-0.5">
                        Save {d.percent}% (-N${Math.round((basePrice * d.percent) / 100)})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Operating Days & Boarding Note */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
                <Clock className="h-4 w-4 text-accent" />
                Operating Days & Schedule
              </div>
              <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                {CITY_LINK_INFO.operatingNote}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                  <span
                    key={day}
                    className="rounded-lg bg-success/15 px-2.5 py-1 text-xs font-extrabold text-success"
                  >
                    ✓ {day}
                  </span>
                ))}
                <span className="rounded-lg bg-destructive/15 px-2.5 py-1 text-xs font-extrabold text-destructive">
                  ✕ Saturday (Closed)
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Bar */}
        <div className="rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/10 to-transparent p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-accent">
                Ready to board?
              </span>
              <h4 className="text-base font-extrabold text-primary">
                Book {selectedRoute.origin} to {selectedRoute.destination}
              </h4>
            </div>
            <Link
              to={`/results?from=${selectedRoute.origin}&to=${selectedRoute.destination}&passengers=1&tripType=one-way`}
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-extrabold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
            >
              Reserve Seat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RouteMap;
