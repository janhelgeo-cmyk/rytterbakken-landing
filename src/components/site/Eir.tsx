export function Eir() {
  return (
    <section className="relative bg-ink py-24 text-background md:py-32" style={{ backgroundColor: "var(--ink)" }}>
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-20">
        <div className="reveal">
          <p className="eyebrow" style={{ color: "oklch(0.78 0.05 70)" }}>
            Din guide mellom samlingene
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-background md:text-5xl">
            Eir — din <em className="italic" style={{ color: "oklch(0.7 0.118 45)" }}>personlige</em> veileder
          </h2>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed" style={{ color: "oklch(0.82 0.022 70)" }}>
            Eir er ikke en chatbot. Hun er en digital veileder som kjenner reisen din — det du har gjort, det du reflekterte over, og hvor du er nå. For de som vil at arbeidet ikke stopper når du drar hjem.
          </p>
          <span className="mt-8 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground">
            Kommer snart
          </span>
        </div>

        <div className="reveal">
          <div
            className="rounded-2xl border p-5 shadow-card"
            style={{
              borderColor: "oklch(0.35 0.02 50)",
              backgroundColor: "oklch(0.28 0.018 50)",
            }}
          >
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "oklch(0.35 0.02 50)" }}>
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="font-display text-sm tracking-wide text-background">Eir</span>
              <span className="ml-auto text-[10px] uppercase tracking-[0.2em]" style={{ color: "oklch(0.65 0.02 70)" }}>
                privat samtale
              </span>
            </div>
            <div className="space-y-4 py-5 text-sm">
              <div
                className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed"
                style={{ backgroundColor: "oklch(0.35 0.02 50)", color: "oklch(0.92 0.022 70)" }}
              >
                Hei Maja. Forrige uke noterte du at pusten roer seg etter morgensekvensen. Vil du fortsette der i dag?
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 leading-relaxed text-primary-foreground">
                Ja. Kan vi legge til 5 minutter regulering før jeg går ut til hagen?
              </div>
              <div
                className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed"
                style={{ backgroundColor: "oklch(0.35 0.02 50)", color: "oklch(0.92 0.022 70)" }}
              >
                Selvsagt. Jeg lager en sekvens basert på det du gjorde på ​gårdsoppholdet i mars.
              </div>
            </div>
            <div
              className="mt-2 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs"
              style={{ borderColor: "oklch(0.35 0.02 50)", color: "oklch(0.65 0.02 70)" }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Skriv til Eir…
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
