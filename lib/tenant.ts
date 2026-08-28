import { createClient } from "@/lib/supabase/server";

export async function getTenantContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesión no válida");
  const { data: profile, error } = await supabase.from("profiles").select("tenant_id,display_name").eq("id", user.id).single();
  if (error || !profile) throw new Error("El usuario no tiene un tenant asignado");
  return { supabase, user, tenantId: profile.tenant_id as string, displayName: profile.display_name as string };
}
