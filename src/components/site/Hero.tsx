import heroImg from "@/assets/hero-farm.jpg";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 md:pt-40">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImg}
          alt="Tåkete morgenlys over jorder og gårdsbygninger i Elverum"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(244,237,226,0.55) 0%, rgba(244,237,226,0.35) 35%, rgba(244,237,226,0.92) 78%, var(--background) 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 text-center md:pb-40 md:pt-28">
        <p className="eyebrow reveal">Elverum · Regenerativt testlaboratorium</p>
        <h1 className="reveal mt-6 font-display text-5xl leading-[1.05] text-ink md:text-7xl lg:text-[5.5rem]">
          Et sted der jord, helse og <em className="italic text-primary">læring</em> vokser sammen.
        </h1>
        <p className="reveal mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
          Rytterbakken er et fysisk testlaboratorium for regenerativ livs- og næringsutvikling — der vi kobler naturen, kroppen og kunnskapen i ett.
        </p>
        <div className="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#tilbud"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/90 hover:shadow-card"
          >
            Se hva vi tilbyr →
          </a>
          <a
            href="#venteliste"
            className="inline-flex items-center justify-center rounded-full border border-ink/25 bg-transparent px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:border-ink/60 hover:bg-ink/5"
          >
            Meld deg på venteliste
          </a>
        </div>
      </div>
    </section>
  );
}
