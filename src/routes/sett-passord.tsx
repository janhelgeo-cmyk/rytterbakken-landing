import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "./logg-inn";

export const Route = createFileRoute("/sett-passord")({
  head: () => ({ meta: [{ title: "Nytt passord — Rytterbakken" }, { name: "robots", content: "noindex" }] }),
  component: SettPassord,
});

type Status = "idle" | "loading" | "done" | "error";

function SettPassord() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sets a session from the recovery token in the URL hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
      if (!session) setStatus("error");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== password2) { setError("Passordene stemmer ikke overens."); return; }
    if (password.length < 8) { setError("Passord må være minst 8 tegn."); return; }

    setStatus("loading");
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    if (updateErr) {
      setStatus("error");
      setError("Klarte ikke å oppdatere passordet. Lenken kan ha gått ut.");
    } else {
      setStatus("done");
    }
  }

  if (status === "done") {
    return (
      <AuthShell>
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl text-ink">Passord oppdatert.</h1>
          <p className="mt-3 text-sm text-ink-muted">Du kan nå logge inn med det nye passordet ditt.</p>
          <a href="/min-side" className="mt-6 block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Gå til Min side →
          </a>
        </div>
      </AuthShell>
    );
  }

  if (status === "error" && !ready) {
    return (
      <AuthShell>
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl text-ink">Ugyldig lenke.</h1>
          <p className="mt-3 text-sm text-ink-muted">Lenken kan ha gått ut eller allerede blitt brukt.</p>
          <a href="/glemt-passord" className="mt-5 block text-sm text-primary hover:underline">
            Be om ny tilbakestillingslenke →
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-2xl text-ink">Velg nytt passord</h1>
        <p className="mt-2 text-sm text-ink-muted">Minst 8 tegn.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="password" required autoFocus
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Nytt passord" className={inputCls} />
          <input type="password" required
            value={password2} onChange={(e) => setPassword2(e.target.value)}
            placeholder="Gjenta passord" className={inputCls} />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={status === "loading" || !ready} className={btnCls}>
            {status === "loading" ? "Lagrer…" : "Lagre nytt passord →"}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60";
const btnCls = "w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-60";
