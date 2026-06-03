import { useEffect, useState } from "react";

const links = [
  { href: "#hva", label: "Hva vi er" },
  { href: "#tilbud", label: "Tilbud" },
  { href: "#om", label: "Om oss" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Steng meny ved scroll eller resize til desktop
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-background/95 backdrop-blur-md border-b border-border/60"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a href="#top" className="font-display text-2xl text-ink tracking-tight">
            Rytterbakken
          </a>

          {/* Desktop-lenker */}
          <div className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-normal text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#venteliste"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/90 hover:shadow-card"
            >
              Meld interesse
            </a>

            {/* Hamburgermeny — kun mobil */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Lukk meny" : "Åpne meny"}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
            >
              <span
                className={`block h-px w-5 bg-ink transition-all duration-300 ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-all duration-300 ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Mobil-dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col border-t border-border/60 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
