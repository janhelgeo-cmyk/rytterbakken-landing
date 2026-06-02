import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  getAdminStatus,
  listWaitlist,
  loginAdmin,
  logoutAdmin,
  type WaitlistRow,
} from "@/lib/admin/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Rytterbakken" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type SortKey = "created_at" | "email" | "name" | "source";
type SortDir = "asc" | "desc";

function AdminPage() {
  const status = useServerFn(getAdminStatus);
  const { data: statusData, isLoading: statusLoading, refetch } = useQuery({
    queryKey: ["admin", "status"],
    queryFn: () => status(),
  });

  if (statusLoading) {
    return (
      <Shell>
        <p className="text-sm text-ink-muted">Laster…</p>
      </Shell>
    );
  }

  if (!statusData?.isAdmin) {
    return <LoginView onSuccess={() => refetch()} />;
  }

  return <WaitlistView onLogout={() => refetch()} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  );
}

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(loginAdmin);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ data: { password } });
      if (!res.ok) {
        setError("Feil passord.");
      } else {
        setPassword("");
        onSuccess();
      }
    } catch {
      setError("Innlogging feilet. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl text-ink">Admin-innlogging</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Skriv inn admin-passordet for å se ventelisten.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Logger inn…" : "Logg inn"}
          </button>
        </form>
      </div>
    </Shell>
  );
}

function WaitlistView({ onLogout }: { onLogout: () => void }) {
  const list = useServerFn(listWaitlist);
  const logout = useServerFn(logoutAdmin);
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "waitlist"],
    queryFn: () => list(),
  });

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const all = data?.rows ?? [];
    const q = search.trim().toLowerCase();
    const fromTs = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const toTs = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : null;
    const filtered = all.filter((r) => {
      if (fromTs !== null || toTs !== null) {
        const t = new Date(r.created_at).getTime();
        if (Number.isNaN(t)) return false;
        if (fromTs !== null && t < fromTs) return false;
        if (toTs !== null && t > toTs) return false;
      }
      if (!q) return true;
      return [r.email, r.name ?? "", r.reason ?? "", r.source ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const sorted = [...filtered].sort((a, b) => {
      const av = (a[sortKey] ?? "") as string;
      const bv = (b[sortKey] ?? "") as string;
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [data, search, fromDate, toDate, sortKey, sortDir]);


  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "created_at" ? "desc" : "asc");
    }
  }

  async function handleLogout() {
    await logout();
    onLogout();
    router.invalidate();
  }

  function handleExportCsv() {
    const headers = ["created_at", "email", "name", "source", "reason"] as const;
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ];
    const csv = "\ufeff" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    const rangePart =
      fromDate || toDate ? `_${fromDate || "start"}_${toDate || today}` : "";
    a.href = url;
    a.download = `waitlist-${today}${rangePart}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  return (
    <Shell>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Venteliste</h1>
          <p className="text-sm text-ink-muted">
            {data?.rows.length ?? 0} totalt
            {rows.length !== (data?.rows.length ?? 0) &&
              ` · ${rows.length} treff`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted"
          >
            Oppdater
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={rows.length === 0}
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            Eksporter CSV
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted"
          >
            Logg ut
          </button>
        </div>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Søk på e-post, navn, kilde eller årsak…"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-ink-muted">
          <span>Fra</span>
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-transparent text-sm text-ink focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-ink-muted">
          <span>Til</span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-transparent text-sm text-ink focus:outline-none"
          />
        </label>
        {(fromDate || toDate) && (
          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-ink hover:bg-muted"
          >
            Nullstill
          </button>
        )}
      </div>


      {isLoading && (
        <p className="mt-6 text-sm text-ink-muted">Laster venteliste…</p>
      )}
      {error && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          Klarte ikke å laste: {(error as Error).message}
        </p>
      )}

      {!isLoading && !error && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-ink-muted">
              <tr>
                <Th onClick={() => toggleSort("created_at")} active={sortKey === "created_at"} dir={sortDir}>
                  Dato
                </Th>
                <Th onClick={() => toggleSort("email")} active={sortKey === "email"} dir={sortDir}>
                  E-post
                </Th>
                <Th onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>
                  Navn
                </Th>
                <Th onClick={() => toggleSort("source")} active={sortKey === "source"} dir={sortDir}>
                  Kilde
                </Th>
                <th className="px-4 py-3 font-medium">Årsak</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    Ingen treff.
                  </td>
                </tr>
              ) : (
                rows.map((r) => <Row key={r.id} row={r} />)
              )}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: SortDir;
}) {
  return (
    <th className="px-4 py-3 font-medium">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 transition-colors ${
          active ? "text-ink" : "hover:text-ink"
        }`}
      >
        {children}
        {active && <span aria-hidden>{dir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}

function Row({ row }: { row: WaitlistRow }) {
  const dt = (() => {
    try {
      return new Intl.DateTimeFormat("nb-NO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(row.created_at));
    } catch {
      return row.created_at;
    }
  })();
  return (
    <tr className="border-t border-border/60 align-top">
      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-muted">{dt}</td>
      <td className="px-4 py-3 text-ink">{row.email}</td>
      <td className="px-4 py-3 text-ink-muted">{row.name ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-ink-muted">{row.source ?? "—"}</td>
      <td className="max-w-md px-4 py-3 text-xs text-ink-muted">
        {row.reason ?? "—"}
      </td>
    </tr>
  );
}
