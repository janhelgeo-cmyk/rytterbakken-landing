import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/min-side/_layout/aktiviteter")({
  head: () => ({ meta: [{ title: "Aktiviteter — Min side" }] }),
  component: Aktiviteter,
});

type Activity = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
};

type MemberActivity = {
  id: string;
  status: string;
  rb_activities: Activity;
};

const TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop",
  retreat: "Retreat",
  kurs: "Kurs",
  gårdsopphold: "Gårdsopphold",
  annet: "Aktivitet",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(iso));
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    deltatt: "bg-accent/15 text-accent",
    påmeldt: "bg-primary/15 text-primary",
    avmeldt: "bg-muted text-ink-muted",
  };
  const labels: Record<string, string> = {
    deltatt: "Deltatt",
    påmeldt: "Påmeldt",
    avmeldt: "Avmeldt",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] ${styles[status] ?? "bg-muted text-ink-muted"}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default function Aktiviteter() {
  const [mine, setMine] = useState<MemberActivity[]>([]);
  const [upcoming, setUpcoming] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const [{ data: memberActs }, { data: allUpcoming }] = await Promise.all([
        supabase
          .from("rb_member_activities")
          .select("id, status, rb_activities(*)")
          .eq("member_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("rb_activities")
          .select("*")
          .gte("starts_at", new Date().toISOString())
          .eq("is_published", true)
          .order("starts_at", { ascending: true }),
      ]);

      setMine((memberActs as MemberActivity[]) ?? []);
      const myIds = new Set(
        (memberActs ?? []).map((ma: any) => ma.rb_activities?.id)
      );
      setUpcoming((allUpcoming ?? []).filter((a) => !myIds.has(a.id)));
      setLoading(false);
    });
  }, []);

  const history = mine.filter(
    (ma) => ma.status === "deltatt" || ma.status === "avmeldt"
  );
  const registered = mine.filter((ma) => ma.status === "påmeldt");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="eyebrow mb-4">Aktiviteter</p>
      <h1 className="font-display text-4xl text-ink">
        Historikk og <em className="italic text-primary">kommende</em>
      </h1>

      {loading ? (
        <p className="mt-10 text-sm text-ink-muted">Laster…</p>
      ) : (
        <>
          {/* Påmeldt */}
          {registered.length > 0 && (
            <section className="mt-10">
              <p className="eyebrow mb-5">Påmeldt</p>
              <Timeline items={registered} />
            </section>
          )}

          {/* Kommende aktiviteter å melde seg på */}
          {upcoming.length > 0 && (
            <section className="mt-10">
              <p className="eyebrow mb-5">Kommende</p>
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-earth">
                          {TYPE_LABELS[a.type] ?? a.type}
                        </p>
                        <p className="mt-1 font-display text-lg text-ink">{a.title}</p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {formatDate(a.starts_at)}
                          {a.location && ` · ${a.location}`}
                        </p>
                        {a.description && (
                          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Historikk */}
          {history.length > 0 && (
            <section className="mt-10">
              <p className="eyebrow mb-5">Historikk</p>
              <Timeline items={history} />
            </section>
          )}

          {mine.length === 0 && upcoming.length === 0 && (
            <p className="mt-10 text-sm text-ink-muted">
              Ingen aktiviteter registrert ennå.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Timeline({ items }: { items: MemberActivity[] }) {
  return (
    <div className="relative border-l border-border/60 pl-6 space-y-6">
      {items.map((ma) => {
        const a = ma.rb_activities;
        return (
          <div key={ma.id} className="relative">
            <div className="absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink-muted">
              {formatDate(a.starts_at)}
            </p>
            <p className="mt-1 font-display text-xl text-ink">{a.title}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs text-ink-muted">
                {TYPE_LABELS[a.type] ?? a.type}
              </span>
              {a.location && (
                <span className="text-xs text-ink-muted/60">· {a.location}</span>
              )}
              <StatusBadge status={ma.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
