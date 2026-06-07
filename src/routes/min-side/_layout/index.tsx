import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/min-side/_layout/")({
  head: () => ({ meta: [{ title: "Min side — Rytterbakken" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [profile, setProfile] = useState<{ name: string | null } | null>(null);
  const [nextActivity, setNextActivity] = useState<any>(null);
  const [hour] = useState(new Date().getHours());

  const greeting =
    hour < 10 ? "God morgen" : hour < 17 ? "God dag" : "God kveld";

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data: p } = await supabase
        .from("rb_profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(p);

      // Next upcoming activity
      const { data: ma } = await supabase
        .from("rb_member_activities")
        .select("*, rb_activities(*)")
        .eq("member_id", user.id)
        .in("status", ["påmeldt"])
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (ma?.rb_activities) setNextActivity(ma.rb_activities);
    });
  }, []);

  const firstName = profile?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="eyebrow mb-4">{greeting}{firstName ? `, ${firstName}` : ""}</p>

      <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
        Velkommen til <em className="italic text-primary">din side</em>.
      </h1>

      <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-muted">
        Her finner du dine aktiviteter, kan snakke med Eir og oppdatere profilen din.
      </p>

      {/* Cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {nextActivity && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="eyebrow mb-3 text-primary">Neste aktivitet</p>
            <p className="font-display text-xl text-ink">{nextActivity.title}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {new Intl.DateTimeFormat("nb-NO", {
                day: "numeric", month: "long", year: "numeric",
              }).format(new Date(nextActivity.starts_at))}
              {nextActivity.location && ` · ${nextActivity.location}`}
            </p>
          </div>
        )}

        <a
          href="/min-side/eir"
          className="group rounded-2xl border border-border bg-ink p-6 transition-all hover:bg-ink/90"
        >
          <p className="eyebrow mb-3" style={{ color: "oklch(0.78 0.05 70)" }}>
            Din veileder
          </p>
          <p className="font-display text-xl text-background">Snakk med Eir</p>
          <p className="mt-1 text-sm" style={{ color: "oklch(0.75 0.03 70)" }}>
            Hun kjenner reisen din og er klar når du er det.
          </p>
        </a>

        <a
          href="/min-side/aktiviteter"
          className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-card"
        >
          <p className="eyebrow mb-3">Aktiviteter</p>
          <p className="font-display text-xl text-ink">Historikk og kommende</p>
          <p className="mt-1 text-sm text-ink-muted">
            Se hva du har deltatt på og hva som er planlagt.
          </p>
        </a>

        <a
          href="/min-side/profil"
          className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-card"
        >
          <p className="eyebrow mb-3">Profil</p>
          <p className="font-display text-xl text-ink">Dine opplysninger</p>
          <p className="mt-1 text-sm text-ink-muted">
            Oppdater navn og kontaktinformasjon.
          </p>
        </a>
      </div>
    </div>
  );
}
