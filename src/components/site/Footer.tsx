export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-display text-2xl text-ink">Rytterbakken</div>
          <p className="mt-2 text-sm italic text-ink-muted">
            Jord · Helse · Læring · Teknologi
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
          <a href="#hva" className="hover:text-ink">Hva vi er</a>
          <a href="#tilbud" className="hover:text-ink">Tilbud</a>
          <a href="#om" className="hover:text-ink">Om oss</a>
          <a href="mailto:post@mindmatter.no" className="hover:text-ink">Kontakt</a>
        </div>
        <div className="text-sm text-ink-muted">
          <div>post@mindmatter.no</div>
          <div className="mt-1">Elverum, Norge</div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-6 text-xs text-ink-muted/70">
        © {new Date().getFullYear()} Rytterbakken. Alle rettigheter forbeholdt.
      </div>
    </footer>
  );
}
