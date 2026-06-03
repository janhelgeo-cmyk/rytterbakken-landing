const offerings = [
  {
    no: "01",
    title: "Workshops",
    body: "Halvdags- og heldagssamlinger i permakultur, pust og kosthold. Konkret, kroppslig, lokalt.",
  },
  {
    no: "02",
    title: "Gårdsopphold",
    body: "2–4 dager på gården. Ro, fellesskap og tid til å kjenne etter. Noe du merker lenge etter.",
  },
  {
    no: "03",
    title: "Kurs og fordypning",
    body: "Digitale og fysiske moduler. Gå din egen vei, med Eir som støtte underveis.",
  },
  {
    no: "04",
    title: "Medlemskap (kommer)",
    body: "Personlig oppfølging og tilgang til Eir. Åpner høst 2026 for de første som er inne.",
  },
];

export function Offerings() {
  return (
    <section id="tilbud" className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow reveal">Tilbud</p>
            <h2 className="reveal mt-5 font-display text-4xl leading-tight md:text-5xl">
              Fire veier <em className="italic text-primary">inn</em>.
            </h2>
          </div>
          <p className="reveal max-w-md text-ink-muted">
            Velg det formatet som passer akkurat nå — alle bygger på samme grunnmur.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {offerings.map((o) => (
            <div
              key={o.no}
              className="reveal group relative overflow-hidden rounded-2xl border border-border bg-background p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-card md:p-10"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-sm text-earth">{o.no}</span>
                <span className="h-px w-12 bg-border transition-all duration-500 group-hover:w-20 group-hover:bg-primary" />
              </div>
              <h3 className="mt-8 font-display text-3xl text-ink">{o.title}</h3>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{o.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
