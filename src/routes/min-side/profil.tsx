import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/min-side/profil")({
  head: () => ({ meta: [{ title: "Profil — Min side" }] }),
  component: Profil,
});

function Profil() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data } = await supabase
        .from("rb_profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.name) setName(data.name);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setSaved(false);

    await supabase.from("rb_profiles").upsert({
      id: userId,
      name: name.trim() || null,
      onboarding_completed: true,
      last_active: new Date().toISOString(),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <p className="eyebrow mb-4">Profil</p>
      <h1 className="font-display text-4xl text-ink">Dine opplysninger</h1>

      <form onSubmit={save} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
            Navn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fullt navn"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
            E-post
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-ink-muted"
          />
          <p className="mt-1.5 text-xs text-ink-muted/60">
            E-post kan ikke endres her. Logg inn med ny adresse om ønskelig.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Lagrer…" : "Lagre"}
          </button>
          {saved && (
            <span className="text-sm text-accent">Lagret ✓</span>
          )}
        </div>
      </form>

      <div className="mt-12 border-t border-border/60 pt-8">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
          Konto
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-3 text-sm text-ink-muted underline-offset-2 hover:underline"
        >
          Logg ut av denne enheten
        </button>
      </div>
    </div>
  );
}
