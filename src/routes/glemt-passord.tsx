import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "./logg-inn";

export const Route = createFileRoute("/glemt-passord")({
  head: () => ({ meta: [{ title: "Glemt passord — Rytterbakken" }, { name: "robots", content: "noindex" }] }),
  component: GlemtPassord,
});

type Status = "idle" | "loading" | "sent";

function GlemtPassord() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await fetch("/api/auth/send-reset-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    setStatus("sent"); // alltid sent, uavhengig av om e-post finnes
  }

  if (status === "sent") {
    return (
      <AuthShell>
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="eyebrow mb-4">Sjekk innboksen</p>
          <h1 className="font-display text-2xl text-ink">Lenke er sendt.</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Hvis <strong className="text-ink">{email}</strong> er registrert hos oss, har vi sendt en
            lenke for å tilbakestille passordet. Sjekk søppelpost om du ikke ser den.
          </p>
          <a href="/logg-inn" className="mt-6 block text-sm text-ink-muted hover:text-ink">
            ← Tilbake til innlogging
          </a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
        <h1 className="font-display text-2xl text-ink">Glemt passord?</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Skriv inn e-postadressen din. Vi sender deg en lenke for å sette nytt passord.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email" required autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.no"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button type="submit" disabled={status === "loading"}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90 disabled:opacity-60">
            {status === "loading" ? "Sender…" : "Send tilbakestillingslenke →"}
          </button>
        </form>

        <a href="/logg-inn" className="mt-5 block text-sm text-ink-muted hover:text-ink">
          ← Tilbake til innlogging
        </a>
      </div>
    </AuthShell>
  );
}
