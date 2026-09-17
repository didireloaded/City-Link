import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const provider = request.headers.get("x-provider") || "unknown";
  const payload = await request.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const externalId = String(payload.id || payload.event_id || crypto.randomUUID());
  const { error } = await supabase.from("webhook_events").upsert({ provider, event_type: payload.type || "unknown", external_id: externalId, payload }, { onConflict: "provider,external_id" });
  if (error) return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  return Response.json({ accepted: true, externalId }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
