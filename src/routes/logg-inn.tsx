import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/logg-inn")({
  head: () => ({
    meta: [
      { title: "Logg inn — Rytterbakken" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoggInn,
});

type Status = "idle" | "loading" | "sent" | "error";

function LoggInn() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.replace("/min-side");
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setStatus("error");
      setMessage("Noe gikk galt. Prøv igjen om litt.");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6"
      style={{ fontFamily: "'Inter Tight', sans-serif" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <a
          href="/"
          className="mb-10 block font-display text-2xl tracking-tight text-ink"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Rytterbakken
        </a>

        {status === "sent" ? (
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="eyebrow mb-4">Sjekk innboksen</p>
            <h1 className="font-display text-2xl text-ink">
              Vi har sendt deg en innloggingslenke.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Klikk lenken i e-posten for å logge inn. Sjekk søppelpost om du
              ikke ser den innen et par minutter.
            </p>
            <button
              onClick={() => { setStatus("idle"); setMessage(""); }}
              className="mt-6 text-sm text-ink-muted underline-offset-2 hover:underline"
            >
              Prøv en annen e-postadresse
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <h1 className="font-display text-2xl text-ink">Min side</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Skriv inn e-postadressen din. Vi sender deg en innloggingslenke —
              ingen passord trengs.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-3">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                disabled={status === "loading"}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />

              {message && (
                <p className="text-sm text-destructive">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-60"
              >
                {status === "loading" ? "Sender…" : "Send innloggingslenke →"}
              </button>
            </form>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-ink-muted/60">
          <a href="/" className="hover:text-ink-muted">← Tilbake til forsiden</a>
        </p>
      </div>
    </div>
  );
}
