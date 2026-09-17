import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { providers } from "../_shared/providers.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const input = await request.json();
    const from = await providers.maps.geocode(input.from);
    const to = await providers.maps.geocode(input.to);
    if (!from || !to) return Response.json({ error: "Locations could not be resolved" }, { status: 400, headers: corsHeaders });
    const route = await providers.maps.route(from, to);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: request.headers.get("Authorization") || "" } } });
    const { data: rules } = await supabase.from("pricing_rules").select("starting_rate_nad").ilike("origin", `%${input.from}%`).ilike("destination", `%${input.to}%");
    const base = rules?.[0]?.starting_rate_nad || 450;
    return Response.json({ route, quote: { amountNad: Number(base), quoteRequired: !rules?.length, currency: "NAD" } }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Unable to create quote" }, { status: 400, headers: corsHeaders }); }
});
