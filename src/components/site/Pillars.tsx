const pillars = [
  {
    icon: "🌱",
    title: "Regenerativt jordbruk",
    body: "Vi dyrker, eksperimenterer og dokumenterer — for å vise at det er mulig å leve og produsere i balanse med naturen.",
  },
  {
    icon: "🫁",
    title: "Helse og regulering",
    body: "Pust, bevegelse og nervesystem-regulering. Vi tilbyr deg verktøy du kan bruke resten av livet.",
  },
  {
    icon: "📚",
    title: "Læring og fellesskap",
    body: "Workshops, ​gårdsopphold og fordypningskurs. Kunnskap som gjøres praktisk, lokalt og tilgjengelig — og som fortsetter mellom samlingene.",
  },
];

export function Pillars() {
  return (
    <section id="hva" className="relative border-t border-border/60 bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="eyebrow reveal">Hva er Rytterbakken</p>
          <h2 className="reveal mt-5 font-display text-4xl leading-tight md:text-5xl">
            Tre <em className="italic text-primary">fundamenter</em> som henger sammen.
          </h2>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="reveal group relative bg-background p-8 transition-colors duration-500 hover:bg-surface md:p-10"
            >
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-6 font-display text-2xl text-ink">{p.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
