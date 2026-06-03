import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "./logg-inn";

export const Route = createFileRoute("/registrer")({
  head: () => ({ meta: [{ title: "Opprett konto — Rytterbakken" }, { name: "robots", content: "noindex" }] }),
  component: Registrer,
});

type Status = "idle" | "loading" | "sent" | "error";

function Registrer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.replace("/min-side");
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("Passordene stemmer ikke overens.");
      return;
    }
    if (password.length < 8) {
      setError("Passord må være minst 8 tegn.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, name: name.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setStatus("error");
        setError("Denne e-postadressen er allerede registrert. Prøv å logge inn.");
      } else if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "Noe gikk galt. Prøv igjen.");
      } else {
        setStatus("sent");
      }
    } catch {
      setStatus("error");
      setError("Ingen kontakt med serveren.");
    }
  }

  if (status === "sent") {
    return (
      <AuthShell>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="eyebrow mb-4">Sjekk innboksen</p>
          <h1 className="font-display text-2xl text-ink">Bekreft e-postadressen din.</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Vi har sendt en bekreftelseslenke til <strong className="text-ink">{email}</strong>.
            Klikk lenken for å aktivere kontoen og logge inn.
          </p>
          <p className="mt-3 text-xs text-ink-muted/70">Sjekk søppelpost om du ikke ser den innen et par minutter.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-2xl text-ink">Opprett konto</h1>
        <p className="mt-2 text-sm text-ink-muted">Bli medlem på Rytterbakken Min side.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="text"
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Navn (valgfritt)"
            className={inputCls}
          />
          <input
            type="email" required autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            className={inputCls}
          />
          <input
            type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord (minst 8 tegn)"
            className={inputCls}
          />
          <input
            type="password" required
            value={password2} onChange={(e) => setPassword2(e.target.value)}
            placeholder="Gjenta passord"
            className={inputCls}
          />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={status === "loading"} className={btnCls}>
            {status === "loading" ? "Oppretter konto…" : "Opprett konto →"}
          </button>
        </form>

        <p className="mt-5 border-t border-border/60 pt-4 text-sm text-ink-muted">
          Har du allerede konto?{" "}
          <a href="/logg-inn" className="text-primary hover:underline">Logg inn</a>
        </p>
      </div>
    </AuthShell>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60";
const btnCls = "w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-60";
