import aboutImg from "@/assets/about-soil.jpg";

export function About() {
  return (
    <section id="om" className="relative border-t border-border/60 bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:gap-20">
        <div className="reveal">
          <p className="eyebrow">Om stedet og menneskene</p>
          <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
            Bygget av <em className="italic text-primary">Aina Mumbi</em> — og av jorda her.
          </h2>
          <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-ink-muted">
            <p>
              Rytterbakken ligger like utenfor Elverum, omkranset av skog og åpne jorder. Aina Mumbi har samlet flere tiår med erfaring fra nervesystem-regulering, pust og regenerativt jordbruk — og bygger nå et sted der disse trådene møtes i praksis.
            </p>
            <p>
              Metodikken er enkel, men ikke lett: vi tester, måler og deler. Det som fungerer for kropp og jord blir til kurs, ​gårdsopphold og verktøy du tar med deg hjem.
            </p>
          </div>

          <figure className="mt-10 rounded-2xl border-l-2 border-primary bg-surface/70 px-7 py-6">
            <blockquote className="font-display text-xl italic leading-snug text-ink md:text-2xl">
              "Vi bygger et sted der det er mulig å se at det fungerer."
            </blockquote>
            <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-earth">
              Aina Mumbi · Grunnlegger
            </figcaption>
          </figure>
        </div>

        <div className="reveal relative">
          <div className="relative overflow-hidden rounded-2xl shadow-card">
            <img
              src={aboutImg}
              alt="Hender planter små grønne spirer i mørk, fruktbar jord"
              width={1200}
              height={1400}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl bg-accent md:block" />
        </div>
      </div>
    </section>
  );
}
