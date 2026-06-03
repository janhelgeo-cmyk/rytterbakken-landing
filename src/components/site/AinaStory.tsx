const specialties = [
  "Ketaminbehandling",
  "Cannabismedisin",
  "Funksjonell medisin",
  "5 Element Akupunktur",
  "Polyvagalteori",
  "Internal Family Systems",
  "Somatic Experiencing",
  "Pustearbeid",
  "Dyreterapi",
  "Trening som medisin",
];

const doors = [
  {
    no: "01",
    title: "Mikroklinikken",
    location: "Oslo sentrum",
    body: "Her begynner det for de fleste: en konsultasjon, en samtale, et første møte med en annen måte å tenke helse på.",
  },
  {
    no: "02",
    title: "Workshops",
    location: "I by og skog",
    body: "Der teorien blir kroppslig. Pust, stillhet, nervesystem, natur. Korte nok til å passe inn i et travelt liv, dype nok til å merkes lenge etter.",
  },
  {
    no: "03",
    title: "Rytterbakken",
    location: "Elverum",
    body: "For dem som vil hele veien. Lengre retreats og personlige forløp der det eldste og det nyeste møtes — ild og nevrobiologi, jord og pust, seremoni og medisinsk trygghet.",
  },
];

export function AinaStory() {
  return (
    <>
      {/* ── Historien ─────────────────────────────────────────────────── */}
      <section className="relative border-t border-border/60 bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">

          <p className="eyebrow reveal">Grunnleggeren</p>

          {/* Åpningssitat som visuelt anker */}
          <h2 className="reveal mt-5 max-w-3xl font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
            Hun begynte ikke i medisinen.{" "}
            <em className="italic text-primary">Hun begynte i undergrunnen.</em>
          </h2>

          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
            {/* Prosa */}
            <div className="reveal space-y-6 text-[15px] leading-relaxed text-ink-muted">
              <p>
                I kulturhuset hun drev i Oslo sentrum — platebutikk, pizzabakeri, lydstudio, til slutt nattklubb — lærte hun mer om mennesker på fem år enn alt hun hadde lært før. Det var der hun oppdaget instinktet sitt: en evne til å se bruddlinjene i folk, det som har gått i stykker og det som fortsatt holder.
              </p>
              <p>
                I 2005 gikk hun inn i medisinen for å bli bedre til nettopp det. Det hun fant var et fag som er glimrende på det akutte og det målbare — og nesten blindt for alt annet. Etter studiet, en fødsel og sin egen runddans med døden, satt hun igjen med en pragmatisk sannhet: det meste av det som gjør mennesker syke, lar seg ikke reduseres til én årsak og én pille.
              </p>
              <p>
                Siden har hun beveget seg i én eneste retning — mot det medisinen helst ikke vil snakke om.
              </p>
              <p className="text-ink">
                Hun er legen som tror fullt og helt på vitenskapen — og ikke er redd for det vitenskapen ennå ikke har ord for. Norsk, jordnær, presis. Tørr humor, ingen unnskyldninger, ingen importert amerikansk glød. Hun sier de ubehagelige tingene høyt.
              </p>
            </div>

            {/* Fagprofil */}
            <div className="reveal">
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-earth">
                Fagfelt og tilnærminger
              </p>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border bg-background px-4 py-1.5 text-sm text-ink-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-border bg-background p-7">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-earth">
                  Om Eikaklinikken
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                  Da Helsetilsynet kom etter autorisasjonen hennes, var det pasientene som slo ring om henne. De kalte seg <em className="text-ink">Eikakrigerne</em>. Hun fikk autorisasjonen tilbake, uten merknader.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Human Sustainability ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink py-20 md:py-28">
        {/* Dekorativt bakgrunnselement */}
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, oklch(0.555 0.118 45), transparent 70%)" }}
        />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p
            className="reveal eyebrow"
            style={{ color: "oklch(0.555 0.118 45)" }}
          >
            Filosofien
          </p>
          <h3
            className="reveal mt-6 font-display text-4xl leading-snug md:text-5xl"
            style={{ color: "oklch(0.953 0.025 80)" }}
          >
            <em className="italic">Human Sustainability</em>
          </h3>
          <p
            className="reveal mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed"
            style={{ color: "oklch(0.75 0.03 70)" }}
          >
            Ikke et wellness-ord, men et fremtidsord: evnen til å forbli menneskelig, jordet og regulert i en verden som akselererer bort fra det menneskelige. Det eneste territoriet ingen teknologi kan kolonisere, sier hun, er innsiden av kroppen din.
          </p>
        </div>
      </section>

      {/* ── Tre dører ─────────────────────────────────────────────────── */}
      <section className="relative border-t border-border/60 bg-background py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <p className="eyebrow reveal">Slik møter du henne</p>
            <h2 className="reveal mt-5 font-display text-4xl leading-tight md:text-5xl">
              Tre dører <em className="italic text-primary">inn</em>.
            </h2>
            <p className="reveal mt-5 text-[15px] leading-relaxed text-ink-muted">
              For deg som har prøvd alt det andre — og kjenner at det er på tide med noe annet.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {doors.map((d) => (
              <div
                key={d.no}
                className="reveal group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm text-earth">{d.no}</span>
                  <span className="h-px w-12 bg-border transition-all duration-500 group-hover:w-20 group-hover:bg-primary" />
                </div>
                <h3 className="mt-8 font-display text-2xl text-ink">{d.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-earth">{d.location}</p>
                <p className="mt-5 text-[14px] leading-relaxed text-ink-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
