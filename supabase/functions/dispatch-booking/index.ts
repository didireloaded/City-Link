import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { bookingId } = await request.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: job, error } = await supabase.from("dispatch_jobs").upsert({ booking_id: bookingId, status: "queued" }, { onConflict: "booking_id" }).select().single();
  if (error) return Response.json({ error: error.message }, { status: 400, headers: corsHeaders });
  return Response.json({ job }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
