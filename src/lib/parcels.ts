import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type SupabaseParcelStatus =
  | "booked"
  | "dropped_off"
  | "in_transit"
  | "arrived"
  | "ready_for_collection"
  | "collected"
  | "expired"
  | "cancelled";

export type ParcelStage = "received" | "loaded" | "transit" | "arrived";

export const STATUS_STEPS: { key: SupabaseParcelStatus; label: string; desc: string }[] = [
  { key: "booked", label: "Booked", desc: "Parcel registered on CityLink system" },
  { key: "dropped_off", label: "Dropped off", desc: "Handed in at origin terminal counter" },
  { key: "in_transit", label: "In transit", desc: "Traveling along B1 Highway corridor" },
  { key: "arrived", label: "Arrived", desc: "Coach arrived at destination terminal" },
  { key: "ready_for_collection", label: "Ready for collection", desc: "Sorted and waiting at desk" },
  { key: "collected", label: "Collected", desc: "Successfully handed over to receiver" },
];

export interface ParcelEvent {
  id?: string;
  stage: ParcelStage;
  status: SupabaseParcelStatus;
  at: string;
  location?: string;
  note?: string;
}

export interface Parcel {
  id: string; // uuid or tracking_code
  trackingCode: string;
  createdAt: string;
  sender: { name: string; phone: string };
  receiver: { name: string; phone: string };
  from: string; // origin_office
  to: string; // destination_office
  type: string; // parcel_size ('small', 'medium', 'large')
  weight: number;
  description?: string;
  declaredValue?: number;
  price: number;
  status: SupabaseParcelStatus;
  currentLocation?: string;
  events: ParcelEvent[];
  receiverConfirmed?: boolean;
  receiverConfirmedAt?: string;
  senderConfirmed?: boolean;
  senderConfirmedAt?: string;
}

const KEY = "citylink_parcels";

export const STAGE_LABELS: Record<ParcelStage, { label: string; desc: string }> = {
  received: { label: "Dropped Off", desc: "Parcel received at CityLink office counter" },
  loaded: { label: "Coach Loaded", desc: "Loaded onto luxury sleeper coach" },
  transit: { label: "In Transit", desc: "On B1 Highway route towards destination" },
  arrived: { label: "Ready for Collection", desc: "Arrived at destination office terminal" },
};

export const STAGE_ORDER: ParcelStage[] = ["received", "loaded", "transit", "arrived"];

export function mapSupabaseStatusToStage(status: SupabaseParcelStatus): ParcelStage {
  switch (status) {
    case "booked":
    case "dropped_off":
      return "received";
    case "in_transit":
      return "transit";
    case "arrived":
    case "ready_for_collection":
    case "collected":
      return "arrived";
    case "cancelled":
      return "received";
    default:
      return "received";
  }
}

const seedParcels = (): Parcel[] => {
  const now = Date.now();
  return [
    {
      id: "22222222-2222-2222-2222-222222222222",
      trackingCode: "CP-2026-8842",
      createdAt: new Date(now - 86400000).toISOString(),
      sender: { name: "Ndeshi Amutenya", phone: "0811234567" },
      receiver: { name: "Josef Shilongo", phone: "0817654321" },
      from: "Ongwediva",
      to: "Windhoek",
      type: "small",
      weight: 0.5,
      description: "Documents envelope",
      price: 80.00,
      status: "in_transit",
      currentLocation: "On CL-01, en route to Windhoek",
      events: [
        {
          id: "evt-1",
          stage: "received",
          status: "booked",
          at: new Date(now - 86400000).toISOString(),
          location: "Ongwediva office",
          note: "Booked in terminal",
        },
        {
          id: "evt-2",
          stage: "received",
          status: "dropped_off",
          at: new Date(now - 72000000).toISOString(),
          location: "Ongwediva office",
          note: "Received at counter",
        },
        {
          id: "evt-3",
          stage: "transit",
          status: "in_transit",
          at: new Date(now - 3600000).toISOString(),
          location: "On CL-01, en route to Windhoek",
          note: "Departed Northern terminal on express run",
        },
      ],
    },
    {
      id: "CP-2026-1049",
      trackingCode: "CP-2026-1049",
      createdAt: new Date(now - 172800000).toISOString(),
      sender: { name: "John Mwafangeyo", phone: "0818767676" },
      receiver: { name: "Maria Mwafangeyo", phone: "0815550130" },
      from: "Windhoek",
      to: "Oshakati",
      type: "medium",
      weight: 6.0,
      description: "Care package & electronics",
      price: 130.00,
      status: "ready_for_collection",
      currentLocation: "Oshakati Ekuku Mall Unit 10",
      events: [
        {
          stage: "received",
          status: "dropped_off",
          at: new Date(now - 172800000).toISOString(),
          location: "Windhoek Bahnhof Street",
          note: "Received at counter",
        },
        {
          stage: "transit",
          status: "in_transit",
          at: new Date(now - 86400000).toISOString(),
          location: "On CL-03, en route North",
          note: "Passed Otjiwarongo checkpoint",
        },
        {
          stage: "arrived",
          status: "ready_for_collection",
          at: new Date(now - 14400000).toISOString(),
          location: "Oshakati Ekuku Mall Unit 10",
          note: "Ready for collection by Josef Shilongo",
        },
      ],
    },
  ];
};

export const loadParcels = (): Parcel[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    return saved?.length ? saved : seedParcels();
  } catch {
    return seedParcels();
  }
};

export const saveParcels = (list: Parcel[]) => {
  localStorage.setItem(KEY, JSON.stringify(list));
};

export const getParcelLocal = (idOrCode: string): Parcel | undefined => {
  const normalized = idOrCode.trim().toUpperCase();
  return loadParcels().find(
    (parcel) =>
      parcel.id.toUpperCase() === normalized ||
      parcel.trackingCode.toUpperCase() === normalized
  );
};

export async function getParcelFromSupabaseOrLocal(idOrCode: string): Promise<Parcel | undefined> {
  const localMatch = getParcelLocal(idOrCode);
  if (!supabase) return localMatch;

  const code = idOrCode.trim().toUpperCase();

  try {
    // Look up via public_parcel_tracking view exactly according to user specs
    const { data: vData, error: vErr } = await supabase
      .from("public_parcel_tracking")
      .select("*")
      .eq("tracking_code", code)
      .single();

    if (vErr || !vData) {
      // Fallback query base table if authorized or local
      const { data: pData } = await supabase
        .from("parcels")
        .select("*")
        .or(`tracking_code.ilike.${code},id.eq.${code}`)
        .single();
      if (!pData) return localMatch;
    }

    const trackingCode = vData?.tracking_code || code;

    // Fetch events via join or direct lookup
    const { data: eventData } = await supabase
      .from("parcel_events")
      .select("status, location, note, created_at, parcels!inner(tracking_code)")
      .eq("parcels.tracking_code", trackingCode)
      .order("created_at", { ascending: true });

    const events: ParcelEvent[] = (eventData || []).map((ev: any) => ({
      stage: mapSupabaseStatusToStage(ev.status),
      status: ev.status,
      at: ev.created_at,
      location: ev.location || vData?.current_location,
      note: ev.note || `Status: ${ev.status}`,
    }));

    if (events.length === 0) {
      events.push({
        stage: mapSupabaseStatusToStage((vData?.status as SupabaseParcelStatus) || "booked"),
        status: (vData?.status as SupabaseParcelStatus) || "booked",
        at: vData?.created_at || new Date().toISOString(),
        location: vData?.current_location || vData?.origin_office || "Terminal",
        note: "Initial booking logged",
      });
    }

    return {
      id: trackingCode,
      trackingCode,
      createdAt: vData?.created_at || new Date().toISOString(),
      sender: { name: "Confidential · Privacy Protected", phone: "081 ••• ••••" },
      receiver: { name: "Verified CityLink Client", phone: "081 ••• ••••" },
      from: vData?.origin_office || "Origin Office",
      to: vData?.destination_office || "Destination Office",
      type: "Small/Medium",
      weight: 1.0,
      description: vData?.description || "CityLink Parcel",
      price: 80,
      status: (vData?.status as SupabaseParcelStatus) || "in_transit",
      currentLocation: vData?.current_location || "En route",
      events,
    };
  } catch (err) {
    console.warn("Supabase public tracking query fallback:", err);
    return localMatch;
  }
}

// ------------------------------------------------------------
// Staff-side: log a new parcel event (drop-off, in-transit, etc.)
// Use this in admin dashboard or simulation, gated behind staff role or demo
// ------------------------------------------------------------
export async function logParcelEvent({
  parcelId,
  trackingCode,
  status,
  location,
  note,
  staffUserId,
}: {
  parcelId?: string;
  trackingCode?: string;
  status: SupabaseParcelStatus;
  location?: string;
  note?: string;
  staffUserId?: string;
}) {
  if (supabase) {
    let targetParcelId = parcelId;
    if (!targetParcelId && trackingCode) {
      const { data: p } = await supabase
        .from("parcels")
        .select("id")
        .eq("tracking_code", trackingCode)
        .single();
      if (p) targetParcelId = p.id;
    }

    if (targetParcelId) {
      const { data, error } = await supabase
        .from("parcel_events")
        .insert({
          parcel_id: targetParcelId,
          status,
          location,
          note,
          created_by: staffUserId || null,
        })
        .select()
        .single();
      if (!error && data) return data;
    }
  }

  // Standalone simulation update for local parcels
  const list = loadParcels();
  const target = list.find(
    (p) =>
      p.id === parcelId ||
      p.trackingCode.toUpperCase() === (trackingCode || "").toUpperCase()
  );
  if (target) {
    target.status = status;
    if (location) target.currentLocation = location;
    target.events.push({
      stage: mapSupabaseStatusToStage(status),
      status,
      at: new Date().toISOString(),
      location: location || target.currentLocation,
      note: note || `Staff event update: ${status}`,
    });
    saveParcels(list);
    return target;
  }
  return null;
}

export async function confirmParcelHandover({
  trackingCode,
  party,
}: {
  trackingCode: string;
  party: "receiver" | "sender";
}) {
  const clean = trackingCode.trim().toUpperCase();
  const list = loadParcels();
  const target = list.find((p) => (p.trackingCode || p.id).toUpperCase() === clean);
  const now = new Date().toISOString();

  if (target) {
    if (party === "receiver") {
      target.receiverConfirmed = true;
      target.receiverConfirmedAt = now;
    } else {
      target.senderConfirmed = true;
      target.senderConfirmedAt = now;
    }

    if (target.receiverConfirmed && target.senderConfirmed) {
      target.status = "expired";
      target.events.push({
        stage: "arrived",
        status: "expired",
        at: now,
        location: target.currentLocation || "Destination Office",
        note: "Delivery mutually confirmed by both Sender and Receiver. For privacy and security, this shareable tracking link has expired and live GPS is now closed.",
      });
    } else {
      target.events.push({
        stage: "arrived",
        status: target.status,
        at: now,
        location: target.currentLocation || "Terminal Office Counter",
        note: `${party === "receiver" ? "Receiver" : "Sender"} confirmed handover on ${new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      });
    }
    saveParcels(list);
    return target;
  }
  return null;
}

export async function createParcelInSupabaseOrLocal(
  newParcel: Omit<
    Parcel,
    "id" | "trackingCode" | "createdAt" | "events" | "status" | "currentLocation"
  > & { trackingCode?: string }
) {
  const code = newParcel.trackingCode || `CP-2026-${Math.floor(1000 + Math.random() * 8999)}`;
  const now = new Date().toISOString();
  const sizeClass = newParcel.type.toLowerCase().includes("large")
    ? "large"
    : newParcel.type.toLowerCase().includes("medium")
    ? "medium"
    : "small";

  if (supabase) {
    try {
      const { data: insertedParcel, error: pErr } = await supabase
        .from("parcels")
        .insert({
          tracking_code: code,
          sender_name: newParcel.sender.name,
          sender_phone: newParcel.sender.phone,
          receiver_name: newParcel.receiver.name,
          receiver_phone: newParcel.receiver.phone,
          route_id: `${newParcel.from.toLowerCase()}-${newParcel.to.toLowerCase()}`,
          description: newParcel.description || `${newParcel.type} (${newParcel.weight}kg)`,
          weight_kg: newParcel.weight,
          parcel_size: sizeClass,
          price_nad: newParcel.price,
          status: "dropped_off",
          current_location: `${newParcel.from} Office Counter`,
          origin_office: newParcel.from,
          destination_office: newParcel.to,
        })
        .select()
        .single();

      if (!pErr && insertedParcel) {
        await supabase.from("parcel_events").insert({
          parcel_id: insertedParcel.id,
          status: "dropped_off",
          location: `${newParcel.from} Office Counter`,
          note: "Received at counter and booked onto next departing luxury coach",
        });

        const fullParcel: Parcel = {
          id: insertedParcel.id,
          trackingCode: insertedParcel.tracking_code || code,
          createdAt: insertedParcel.created_at || now,
          sender: newParcel.sender,
          receiver: newParcel.receiver,
          from: newParcel.from,
          to: newParcel.to,
          type: sizeClass,
          weight: newParcel.weight,
          description: newParcel.description,
          price: newParcel.price,
          status: "dropped_off",
          currentLocation: `${newParcel.from} Office Counter`,
          events: [
            {
              stage: "received",
              status: "dropped_off",
              at: now,
              location: `${newParcel.from} Office Counter`,
              note: "Received at counter and booked onto next departing luxury coach",
            },
          ],
        };
        addParcelLocal(fullParcel);
        return fullParcel;
      }
    } catch (err) {
      console.warn("Supabase insert failed, saving locally:", err);
    }
  }

  const fallbackId = `CP-${Math.floor(100000 + Math.random() * 899999)}`;
  const fallbackParcel: Parcel = {
    id: fallbackId,
    trackingCode: code,
    createdAt: now,
    sender: newParcel.sender,
    receiver: newParcel.receiver,
    from: newParcel.from,
    to: newParcel.to,
    type: sizeClass,
    weight: newParcel.weight,
    description: newParcel.description,
    price: newParcel.price,
    status: "dropped_off",
    currentLocation: `${newParcel.from} Office Counter`,
    events: [
      {
        stage: "received",
        status: "dropped_off",
        at: now,
        location: `${newParcel.from} Office Counter`,
        note: "Received at counter and booked onto next departing luxury coach",
      },
    ],
  };
  addParcelLocal(fallbackParcel);
  return fallbackParcel;
}

export const addParcelLocal = (parcel: Parcel) => {
  const list = loadParcels();
  const existingIndex = list.findIndex(
    (p) => p.id === parcel.id || p.trackingCode === parcel.trackingCode
  );
  if (existingIndex >= 0) {
    list[existingIndex] = parcel;
  } else {
    list.unshift(parcel);
  }
  saveParcels(list);
};

export const currentStage = (parcel: Parcel): ParcelStage => {
  if (parcel.events && parcel.events.length) {
    return parcel.events[parcel.events.length - 1].stage;
  }
  return mapSupabaseStatusToStage(parcel.status || "dropped_off");
};

export const calcParcelPrice = (weightKg: number): number =>
  Math.max(50, Math.round(weightKg) * 8 + 50);
