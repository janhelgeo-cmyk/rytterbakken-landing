import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/min-side/_layout")({
  component: MinSideLayout,
});

const nav = [
  { to: "/min-side", label: "Hjem", icon: "○" },
  { to: "/min-side/aktiviteter", label: "Aktiviteter", icon: "◈" },
  { to: "/min-side/eir", label: "Eir", icon: "◇" },
  { to: "/min-side/profil", label: "Profil", icon: "◉" },
];

function MinSideLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<"loading" | "ok" | "out">("loading");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState("out");
        window.location.replace("/logg-inn");
      } else {
        setUser(session.user);
        setAuthState("ok");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (!session) {
          setAuthState("out");
          window.location.replace("/logg-inn");
        } else {
          setUser(session.user);
          setAuthState("ok");
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  if (authState === "loading" || authState === "out") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display text-lg italic text-ink-muted">Laster…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border/60 bg-surface md:flex md:flex-col">
        <div className="px-6 py-7">
          <a
            href="/"
            className="block font-display text-xl tracking-tight text-ink"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Rytterbakken
          </a>
          <p className="mt-0.5 text-xs text-ink-muted">Min side</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </nav>

        <div className="border-t border-border/60 px-4 py-5">
          <p className="truncate text-xs text-ink-muted">{user?.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-2 text-xs text-ink-muted/70 transition-colors hover:text-ink-muted"
          >
            Logg ut
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-border/60 bg-surface px-5 py-4 md:hidden">
          <a
            href="/"
            className="font-display text-lg tracking-tight text-ink"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Rytterbakken
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-ink-muted"
          >
            Logg ut
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="flex border-t border-border/60 bg-surface md:hidden">
          {nav.map((item) => (
            <MobileNavLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </nav>
      </div>
    </div>
  );
}

function NavLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const router = useRouterState();
  const active = router.location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-background font-medium text-ink shadow-soft"
          : "text-ink-muted hover:bg-background/60 hover:text-ink"
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  const router = useRouterState();
  const active = router.location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] transition-colors ${
        active ? "text-primary" : "text-ink-muted"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </Link>
  );
}
