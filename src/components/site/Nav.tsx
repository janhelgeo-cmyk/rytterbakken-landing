import { useEffect, useState } from "react";

const links = [
  { href: "#hva", label: "Hva vi er" },
  { href: "#tilbud", label: "Tilbud" },
  { href: "#om", label: "Om oss" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="font-display text-2xl text-ink tracking-tight">
          Rytterbakken
        </a>
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
        <a
          href="#venteliste"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-all duration-300 hover:bg-primary/90 hover:shadow-card"
        >
          Meld interesse
        </a>
      </nav>
    </header>
  );
}
