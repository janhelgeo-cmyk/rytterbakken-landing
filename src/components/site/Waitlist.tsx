import { useState, useEffect } from "react";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Vennligst skriv inn en gyldig e-postadresse." })
    .max(255),
  name: z
    .string()
    .trim()
    .min(1, { message: "Vennligst skriv inn navnet ditt." })
    .max(120),
  reason: z
    .string()
    .trim()
    .min(1, { message: "Vennligst si litt om hvorfor dette er interessant." })
    .max(2000),
});

type Status = "idle" | "loading" | "success" | "error" | "email_failed";

function formatSentAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("nb-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Map fra `email_send_log.metadata.source`-verdier til vennlige etiketter
 * og beskrivelser som vises på suksesskortet.
 *
 * Nøklene må samsvare med verdiene serveren skriver til
 * `email_send_log.metadata.source` (se `WAITLIST_SOURCE` i
 * `src/routes/api/public/waitlist.ts`).
 */
const SOURCE_LABELS: Record<string, { label: string; description: string }> = {
  landing: {
    label: "Landingsside",
    description: "Fra forsiden",
  },
  waitlist: {
    label: "Venteliste",
    description: "Fra ventelisten",
  },
  newsletter: {
    label: "Nyhetsbrev",
    description: "Fra nyhetsbrevet",
  },
  admin: {
    label: "Manuell påmelding",
    description: "Fra teamet",
  },
  import: {
    label: "Importert",
    description: "Fra tidligere liste",
  },
  api: {
    label: "API",
    description: "Fra integrasjon",
  },
};

function formatSource(source: string): { label: string; description: string | null } {
  const key = source.trim().toLowerCase();
  const known = SOURCE_LABELS[key];
  if (known) return { label: known.label, description: known.description };
  const fallback = key
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
  return { label: fallback || "Ukjent kilde", description: null };
}


export function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [emailReused, setEmailReused] = useState(false);
  const [emailSentAt, setEmailSentAt] = useState<string | null>(null);
  const [emailSource, setEmailSource] = useState<string | null>(null);

  // Show confirmed state if user arrives from email verification link
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    if (verified === "true") {
      setStatus("success");
      setMessage("E-postadressen er bekreftet. Du er på listen.");
      window.history.replaceState({}, "", window.location.pathname + "#venteliste");
    } else if (verified === "expired") {
      setStatus("error");
      setMessage("Lenken har gått ut (gyldig 24 timer). Meld deg på igjen så sender vi en ny.");
    } else if (verified === "invalid") {
      setStatus("error");
      setMessage("Ugyldig bekreftelseslenke.");
    }
  }, []);



  async function submit() {
    setMessage("");
    setEmailReused(false);
    setEmailSentAt(null);
    setEmailSource(null);


    const parsed = schema.safeParse({ email, name, reason });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Ugyldig skjema.");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/public/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(
          data?.error ??
            "Vi klarte ikke å lagre påmeldingen din akkurat nå. Prøv igjen om et øyeblikk.",
        );
        return;
      }

      if (data?.status === "already_confirmed") {
        setStatus("success");
        setMessage("Du er allerede bekreftet på listen.");
        return;
      }

      if (data?.status === "verification_sent") {
        setStatus("success");
        setMessage("Sjekk innboksen — vi har sendt deg en bekreftelseslenke. Klikk på den for å fullføre påmeldingen.");
        setEmail("");
        setName("");
        setReason("");
        return;
      }
      setEmail("");
      setName("");
      setReason("");

    } catch {
      setStatus("error");
      setMessage(
        "Vi fikk ikke kontakt med serveren. Sjekk nettforbindelsen og prøv igjen — feltene dine er fortsatt lagret.",
      );
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void submit();
  }


  return (
    <section id="venteliste" className="relative border-t border-border/60 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="eyebrow reveal">Venteliste</p>
        <h2 className="reveal mt-5 font-display text-4xl leading-tight md:text-5xl">
          Bli en del av <em className="italic text-primary">det første kullet</em>.
        </h2>
        <p className="reveal mx-auto mt-6 max-w-lg text-ink-muted">
          Vi åpner gradvis og på ordentlig. Skriv deg på listen — så hører du fra oss når det er klart.
        </p>

        {status === "success" ? (
          <div
            role="status"
            aria-live="polite"
            className="mx-auto mt-10 w-full max-w-md rounded-3xl border border-accent/30 bg-accent/10 p-8 text-left shadow-soft is-visible"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div className="flex-1">
                <h3 className="font-display text-2xl leading-tight text-ink">
                  {emailReused ? "Bekreftelsen er allerede sendt" : "Du er på listen!"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {message}
                </p>
                {emailReused ? (
                  <div className="mt-3 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed text-ink-muted">
                    <p>
                      <span className="font-medium text-ink">Ingen ny e-post ble sendt.</span>{" "}
                      Vi gjenbruker bekreftelsen fra forrige forsøk for å
                      unngå duplikater i innboksen din.
                    </p>
                    {emailSentAt && (
                      <p className="mt-1.5">
                        Sendt på{" "}
                        <time
                          dateTime={emailSentAt}
                          className="font-medium text-ink"
                        >
                          {formatSentAt(emailSentAt)}
                        </time>
                        .
                      </p>
                    )}
                    {emailSource && (() => {
                      const { label, description } = formatSource(emailSource);
                      return (
                        <div className="mt-2">
                          <p className="flex flex-wrap items-center gap-1.5">
                            <span>Kilde:</span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-[11px] font-medium text-ink">
                              <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 rounded-full bg-accent"
                              />
                              {label}
                              <span className="font-mono text-[10px] text-ink-muted/70">
                                ({emailSource})
                              </span>
                            </span>
                          </p>
                          {description && (
                            <p className="mt-1 text-[11px] text-ink-muted/80">
                              {description}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    <p className="mt-1.5">
                      Finner du den ikke? Sjekk søppelpost-mappen, eller
                      kontakt oss så hjelper vi deg.
                    </p>
                  </div>
                ) : (

                  <p className="mt-3 text-xs text-ink-muted/80">
                    Sjekk innboksen din – og søppelpost om du ikke ser den
                    innen et par minutter.
                  </p>
                )}


                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                    setEmailReused(false);
                  }}
                  className="mt-5 inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-xs font-medium text-ink transition-colors hover:bg-muted"
                >
                  Meld på en annen
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <form
              onSubmit={onSubmit}
              aria-busy={status === "loading"}
              className="is-visible mx-auto mt-10 flex w-full max-w-md flex-col gap-3 text-left"
            >
              <fieldset disabled={status === "loading"} className="contents">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Navn"
                  className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                  aria-label="Navn"
                  autoComplete="name"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.no"
                  className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                  aria-label="E-postadresse"
                  autoComplete="email"
                />
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Hva synes du er interessant med dette?"
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                  aria-label="Hvorfor synes du dette er interessant?"
                />
                <button
                  type="submit"
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/90 hover:shadow-card disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 animate-spin"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeOpacity="0.25"
                          strokeWidth="3"
                        />
                        <path
                          d="M22 12a10 10 0 0 0-10-10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Sender bekreftelse…
                    </>
                  ) : (
                    "Meld interesse"
                  )}
                </button>
              </fieldset>
            </form>

            {(status === "error" || status === "email_failed") && message && (
              <div
                role="alert"
                aria-live="assertive"
                className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-left"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">
                      {status === "email_failed"
                        ? "Bekreftelsesmailen ble ikke sendt"
                        : "Vi fikk ikke registrert deg"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {message}
                    </p>
                    <p className="mt-2 text-xs text-ink-muted/80">
                      Feltene dine er fortsatt fylt ut — du kan prøve igjen
                      med en gang.
                    </p>
                    <button
                      type="button"
                      onClick={() => void submit()}
                      disabled={(status as Status) === "loading"}
                      className="mt-3 inline-flex items-center justify-center rounded-full border border-destructive/40 bg-card px-5 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                    >
                      {emailReused
                        ? "Se at bekreftelsen er sendt"
                        : status === "email_failed"
                          ? "Send bekreftelsen på nytt"
                          : "Prøv igjen"}

                    </button>
                  </div>
                </div>
              </div>
            )}


            <p className="reveal mt-6 text-xs text-ink-muted/80">
              Ingen spam. Vi bruker e-posten din kun til å holde deg oppdatert om Mindmatter.
            </p>
          </>
        )}

      </div>
    </section>
  );
}
