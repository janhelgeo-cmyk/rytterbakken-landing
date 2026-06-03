import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import heroImg from "@/assets/hero-farm.jpg";

export const Route = createFileRoute("/logg-inn")({
  head: () => ({ meta: [{ title: "Logg inn — Rytterbakken" }, { name: "robots", content: "noindex" }] }),
  component: LoggInn,
});

type Status = "idle" | "loading" | "error";

function LoggInn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.replace("/min-side");
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authErr) {
      setStatus("error");
      setError(
        authErr.message.includes("Invalid")
          ? "Feil e-postadresse eller passord."
          : authErr.message.includes("confirm")
          ? "E-postadressen er ikke bekreftet ennå. Sjekk innboksen din."
          : "Innlogging feilet. Prøv igjen."
      );
    } else {
      window.location.replace("/min-side");
    }
  }

  return (
    <AuthShell>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-2xl text-ink">Min side</h1>
        <p className="mt-2 text-sm text-ink-muted">Logg inn med e-post og passord.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email" required autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            className={inputCls}
          />
          <input
            type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            className={inputCls}
          />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={status === "loading"} className={btnCls}>
            {status === "loading" ? "Logger inn…" : "Logg inn →"}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-2 border-t border-border/60 pt-4 text-sm text-ink-muted">
          <a href="/glemt-passord" className="hover:text-ink">Glemt passord?</a>
          <span>
            Ikke medlem?{" "}
            <a href="/registrer" className="text-primary hover:underline">Opprett konto</a>
          </span>
        </div>
      </div>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav />

      {/* Hero background */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-24">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(244,237,226,0.7) 0%, rgba(244,237,226,0.55) 40%, rgba(244,237,226,0.85) 80%, var(--background) 100%)",
            }}
          />
        </div>

        <div className="relative w-full max-w-sm">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60";
const btnCls = "w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-60";
