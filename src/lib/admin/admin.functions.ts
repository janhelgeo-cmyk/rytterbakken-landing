import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAdminSession } from "./admin-session.server";

// ── Types ─────────────────────────────────────────────────────────────────────

export type WaitlistRow = {
  id: string;
  email: string;
  name: string | null;
  reason: string | null;
  source: string | null;
  created_at: string;
  confirmed_at: string | null;
};

export type ActivityRow = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  max_participants: number | null;
  is_published: boolean;
  created_at: string;
};

export type MemberRow = {
  id: string;
  email: string;
  name: string | null;
  onboarding_completed: boolean;
  last_active: string | null;
  created_at: string | null;
  email_confirmed: boolean;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ password: z.string().min(1).max(500) }).parse(data),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD er ikke konfigurert.");
    const a = Buffer.from(data.password);
    const b = Buffer.from(expected);
    const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!ok) return { ok: false as const };
    const session = await getAdminSession();
    await session.update({ isAdmin: true, loggedInAt: new Date().toISOString() });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return { isAdmin: Boolean(session.data.isAdmin) };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.isAdmin) throw new Error("Unauthorized");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ── Venteliste ────────────────────────────────────────────────────────────────

export const listWaitlist = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ rows: WaitlistRow[] }> => {
    const db = await requireAdmin();
    const { data, error } = await db
      .from("waitlist")
      .select("id, email, name, reason, source, created_at, confirmed_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { rows: (data ?? []) as WaitlistRow[] };
  },
);

export const createWaitlistEntry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      email: z.string().email(),
      name: z.string().optional(),
      reason: z.string().optional(),
      source: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await requireAdmin();
    const { error } = await db.from("waitlist").insert({
      email: data.email.toLowerCase(),
      name: data.name || null,
      reason: data.reason || null,
      source: data.source || "admin",
      confirmed_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateWaitlistEntry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
      reason: z.string().optional(),
      source: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await requireAdmin();
    const { error } = await db
      .from("waitlist")
      .update({ name: data.name || null, reason: data.reason || null, source: data.source || null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteWaitlistEntry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await requireAdmin();
    const { error } = await db.from("waitlist").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ── Aktiviteter ───────────────────────────────────────────────────────────────

export const listActivities = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ rows: ActivityRow[] }> => {
    const db = await requireAdmin();
    const { data, error } = await db
      .from("rb_activities")
      .select("*")
      .order("starts_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: (data ?? []) as ActivityRow[] };
  },
);

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["workshop", "gårdsopphold", "kurs", "retreat", "annet"]),
  location: z.string().optional(),
  starts_at: z.string(),
  ends_at: z.string().optional(),
  max_participants: z.number().int().positive().optional(),
  is_published: z.boolean().default(true),
});

export const createActivity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => activitySchema.parse(d))
  .handler(async ({ data }) => {
    const db = await requireAdmin();
    const { error } = await db.from("rb_activities").insert({
      ...data,
      description: data.description || null,
      location: data.location || null,
      ends_at: data.ends_at || null,
      max_participants: data.max_participants ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateActivity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => activitySchema.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const db = await requireAdmin();
    const { error } = await db.from("rb_activities").update({
      ...rest,
      description: rest.description || null,
      location: rest.location || null,
      ends_at: rest.ends_at || null,
      max_participants: rest.max_participants ?? null,
    }).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteActivity = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await requireAdmin();
    const { error } = await db.from("rb_activities").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ── Medlemmer ─────────────────────────────────────────────────────────────────

export const listMembers = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ rows: MemberRow[] }> => {
    const db = await requireAdmin();
    const { data: users, error } = await db.auth.admin.listUsers({ perPage: 500 });
    if (error) throw new Error(error.message);

    const ids = users.users.map((u) => u.id);
    const { data: profiles } = ids.length
      ? await db.from("rb_profiles").select("id, name, onboarding_completed, last_active").in("id", ids)
      : { data: [] };

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    const rows: MemberRow[] = users.users.map((u) => {
      const p = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        name: p?.name ?? (u.user_metadata?.name as string | null) ?? null,
        onboarding_completed: p?.onboarding_completed ?? false,
        last_active: p?.last_active ?? null,
        created_at: u.created_at,
        email_confirmed: !!u.email_confirmed_at,
      };
    });

    return { rows: rows.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")) };
  },
);

export const deleteMember = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const db = await requireAdmin();
    const { error } = await db.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
