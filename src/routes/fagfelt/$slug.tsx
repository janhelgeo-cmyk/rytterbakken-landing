import { createFileRoute, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getFagfelt } from "@/lib/fagfelt-data";

export const Route = createFileRoute("/fagfelt/$slug")({
  component: FagfeltPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-ink-muted">Side ikke funnet.</p>
    </div>
  ),
});

function FagfeltPage() {
  const { slug } = Route.useParams();
  const entry = getFagfelt(slug);

  if (!entry) {
    throw notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Header */}
      <div className="border-b border-border/60 bg-surface pt-32 pb-16">
        <div className="mx-auto max-w-3xl px-6">
          <a
            href="/#aina"
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink mb-8 block"
          >
            ← Tilbake til Grunnleggeren
          </a>
          <p className="eyebrow mb-4">Fagfelt</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">
            {entry.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted max-w-2xl">
            {entry.intro}
          </p>
        </div>
      </div>

      {/* Innhold */}
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="space-y-14">
          {entry.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl text-ink md:text-3xl">
                {s.heading}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-ink-muted whitespace-pre-line">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        {/* Ainas note */}
        <figure className="mt-16 rounded-2xl border-l-2 border-primary bg-surface px-7 py-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-earth">
            Ainas perspektiv
          </p>
          <blockquote className="font-display text-xl italic leading-snug text-ink md:text-2xl">
            "{entry.ainas_note}"
          </blockquote>
          <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-earth">
            Aina Mumbi · Grunnlegger, Rytterbakken
          </figcaption>
        </figure>

        <div className="mt-16 border-t border-border/60 pt-10">
          <a
            href="/#venteliste"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:bg-primary/90"
          >
            Meld interesse for Rytterbakken →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
