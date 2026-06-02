import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getAdminSession } from "./admin-session.server";

export type WaitlistRow = {
  id: string;
  email: string;
  name: string | null;
  reason: string | null;
  source: string | null;
  created_at: string;
};

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ password: z.string().min(1).max(500) }).parse(data),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      throw new Error("ADMIN_PASSWORD er ikke konfigurert på serveren.");
    }
    const a = Buffer.from(data.password);
    const b = Buffer.from(expected);
    const ok =
      a.length === b.length &&
      crypto.timingSafeEqual(a, b);
    if (!ok) {
      return { ok: false as const };
    }
    const session = await getAdminSession();
    await session.update({ isAdmin: true, loggedInAt: new Date().toISOString() });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await getAdminSession();
    await session.clear();
    return { ok: true as const };
  },
);

export const getAdminStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getAdminSession();
    return { isAdmin: Boolean(session.data.isAdmin) };
  },
);

export const listWaitlist = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ rows: WaitlistRow[] }> => {
    const session = await getAdminSession();
    if (!session.data.isAdmin) {
      throw new Error("Unauthorized");
    }
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("waitlist")
      .select("id, email, name, reason, source, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { rows: (data ?? []) as WaitlistRow[] };
  },
);
