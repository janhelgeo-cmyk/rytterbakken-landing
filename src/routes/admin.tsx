import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getAdminStatus, loginAdmin, logoutAdmin,
  listWaitlist, createWaitlistEntry, updateWaitlistEntry, deleteWaitlistEntry,
  listActivities, createActivity, updateActivity, deleteActivity,
  listMembers, deleteMember,
  type WaitlistRow, type ActivityRow, type MemberRow,
} from "@/lib/admin/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Rytterbakken" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

type Tab = "venteliste" | "aktiviteter" | "medlemmer";

function AdminPage() {
  const status = useServerFn(getAdminStatus);
  const { data, isLoading, refetch } = useQuery({ queryKey: ["admin", "status"], queryFn: () => status() });

  if (isLoading) return <Shell><p className="text-sm text-ink-muted">Laster…</p></Shell>;
  if (!data?.isAdmin) return <LoginView onSuccess={() => refetch()} />;
  return <AdminView onLogout={() => refetch()} />;
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────

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
      if (!res.ok) setError("Feil passord.");
      else { setPassword(""); onSuccess(); }
    } catch { setError("Innlogging feilet."); }
    finally { setLoading(false); }
  }

  return (
    <Shell>
      <div className="mx-auto mt-10 max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl text-ink">Admin-innlogging</h1>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input type="password" required autoFocus value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Passord"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
            {loading ? "Logger inn…" : "Logg inn"}
          </button>
        </form>
      </div>
    </Shell>
  );
}

// ── Main admin view ───────────────────────────────────────────────────────────

function AdminView({ onLogout }: { onLogout: () => void }) {
  const logout = useServerFn(logoutAdmin);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("venteliste");

  async function handleLogout() {
    await logout();
    onLogout();
    router.invalidate();
  }

  return (
    <Shell>
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <button onClick={handleLogout}
          className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted">
          Logg ut
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/60 mb-6">
        {(["venteliste", "aktiviteter", "medlemmer"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-primary text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "venteliste" && <WaitlistTab />}
      {tab === "aktiviteter" && <AktiviteterTab />}
      {tab === "medlemmer" && <MedlemmerTab />}
    </Shell>
  );
}

// ── Venteliste Tab ────────────────────────────────────────────────────────────

function WaitlistTab() {
  const qc = useQueryClient();
  const list = useServerFn(listWaitlist);
  const createFn = useServerFn(createWaitlistEntry);
  const updateFn = useServerFn(updateWaitlistEntry);
  const deleteFn = useServerFn(deleteWaitlistEntry);

  const { data, isLoading } = useQuery({ queryKey: ["admin", "waitlist"], queryFn: () => list() });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WaitlistRow | null>(null);

  const rows = (data?.rows ?? []).filter((r) => {
    const q = search.toLowerCase();
    return !q || [r.email, r.name ?? "", r.reason ?? ""].join(" ").toLowerCase().includes(q);
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "waitlist"] }),
  });

  function exportCsv() {
    const headers = ["created_at", "email", "name", "source", "reason", "confirmed_at"] as const;
    const esc = (v: unknown) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const csv = "﻿" + [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" })), download: `waitlist-${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Søk…"
          className="flex-1 min-w-48 rounded-xl border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <span className="text-sm text-ink-muted">{rows.length} treff</span>
        <button onClick={exportCsv} className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">CSV</button>
        <button onClick={() => { setShowForm(true); setEditing(null); }}
          className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted">+ Legg til</button>
      </div>

      {(showForm || editing) && (
        <WaitlistForm
          initial={editing}
          onSave={async (d) => {
            if (editing) await updateFn({ data: { id: editing.id, ...d } });
            else await createFn({ data: d });
            qc.invalidateQueries({ queryKey: ["admin", "waitlist"] });
            setShowForm(false); setEditing(null);
          }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {isLoading ? <p className="text-sm text-ink-muted">Laster…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">Dato</th>
                <th className="px-4 py-3">E-post</th>
                <th className="px-4 py-3">Navn</th>
                <th className="px-4 py-3">Bekreftet</th>
                <th className="px-4 py-3">Årsak</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-muted">Ingen treff.</td></tr>
              ) : rows.map((r) => (
                <tr key={r.id} className="border-t border-border/60 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-muted">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-ink">{r.email}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{r.confirmed_at ? <span className="text-accent">✓</span> : <span className="text-ink-muted/50">—</span>}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-ink-muted">{r.reason ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(r); setShowForm(false); }} className="text-ink-muted hover:text-ink">Rediger</button>
                      <button onClick={() => { if (confirm(`Slett ${r.email}?`)) del.mutate(r.id); }} className="text-destructive hover:text-destructive/70">Slett</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WaitlistForm({ initial, onSave, onCancel }: { initial: WaitlistRow | null; onSave: (d: any) => Promise<void>; onCancel: () => void }) {
  const [email, setEmail] = useState(initial?.email ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [reason, setReason] = useState(initial?.reason ?? "");
  const [source, setSource] = useState(initial?.source ?? "admin");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await onSave({ email, name: name || undefined, reason: reason || undefined, source: source || undefined });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="mb-4 rounded-2xl border border-border bg-card p-5 space-y-3">
      <h3 className="font-medium text-ink">{initial ? "Rediger oppføring" : "Ny oppføring"}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {!initial && <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post" className={inp} />}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Navn" className={inp} />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Kilde" className={inp} />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Årsak" className={`${inp} sm:col-span-2`} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{saving ? "Lagrer…" : "Lagre"}</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted">Avbryt</button>
      </div>
    </form>
  );
}

// ── Aktiviteter Tab ───────────────────────────────────────────────────────────

const TYPE_OPTS = ["workshop", "gårdsopphold", "kurs", "retreat", "annet"] as const;

function AktiviteterTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(listActivities);
  const createFn = useServerFn(createActivity);
  const updateFn = useServerFn(updateActivity);
  const deleteFn = useServerFn(deleteActivity);

  const { data, isLoading } = useQuery({ queryKey: ["admin", "activities"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<ActivityRow | "new" | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "activities"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-muted">{data?.rows.length ?? 0} aktiviteter</p>
        <button onClick={() => setEditing("new")} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted">+ Ny aktivitet</button>
      </div>

      {editing && (
        <ActivityForm
          initial={editing === "new" ? null : editing}
          onSave={async (d) => {
            if (editing !== "new") await updateFn({ data: { id: (editing as ActivityRow).id, ...d } });
            else await createFn({ data: d });
            qc.invalidateQueries({ queryKey: ["admin", "activities"] });
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {isLoading ? <p className="text-sm text-ink-muted">Laster…</p> : (
        <div className="space-y-3">
          {(data?.rows ?? []).map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase tracking-[0.1em] text-earth">{a.type}</span>
                  {!a.is_published && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-ink-muted">Utkast</span>}
                </div>
                <p className="font-display text-lg text-ink">{a.title}</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {fmtDate(a.starts_at)}{a.ends_at ? ` – ${fmtDate(a.ends_at)}` : ""}
                  {a.location ? ` · ${a.location}` : ""}
                  {a.max_participants ? ` · maks ${a.max_participants}` : ""}
                </p>
                {a.description && <p className="mt-2 text-sm text-ink-muted line-clamp-2">{a.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(a)} className="text-xs text-ink-muted hover:text-ink">Rediger</button>
                <button onClick={() => { if (confirm(`Slett "${a.title}"?`)) del.mutate(a.id); }} className="text-xs text-destructive hover:text-destructive/70">Slett</button>
              </div>
            </div>
          ))}
          {(data?.rows ?? []).length === 0 && <p className="text-sm text-ink-muted">Ingen aktiviteter ennå.</p>}
        </div>
      )}
    </div>
  );
}

function ActivityForm({ initial, onSave, onCancel }: { initial: ActivityRow | null; onSave: (d: any) => Promise<void>; onCancel: () => void }) {
  const [f, setF] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    type: (initial?.type ?? "workshop") as typeof TYPE_OPTS[number],
    location: initial?.location ?? "Rytterbakken, Elverum",
    starts_at: initial?.starts_at ? initial.starts_at.slice(0, 16) : "",
    ends_at: initial?.ends_at ? initial.ends_at.slice(0, 16) : "",
    max_participants: initial?.max_participants ?? "",
    is_published: initial?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await onSave({
      ...f,
      starts_at: new Date(f.starts_at).toISOString(),
      ends_at: f.ends_at ? new Date(f.ends_at).toISOString() : undefined,
      max_participants: f.max_participants ? Number(f.max_participants) : undefined,
    });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="mb-4 rounded-2xl border border-border bg-card p-5 space-y-3">
      <h3 className="font-medium text-ink">{initial ? "Rediger aktivitet" : "Ny aktivitet"}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={f.title} onChange={set("title")} placeholder="Tittel" className={`${inp} sm:col-span-2`} />
        <textarea value={f.description} onChange={set("description")} placeholder="Beskrivelse" rows={2} className={`${inp} sm:col-span-2`} />
        <select value={f.type} onChange={set("type")} className={inp}>
          {TYPE_OPTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input value={f.location} onChange={set("location")} placeholder="Sted" className={inp} />
        <div><label className="mb-1 block text-xs text-ink-muted">Start</label><input required type="datetime-local" value={f.starts_at} onChange={set("starts_at")} className={inp} /></div>
        <div><label className="mb-1 block text-xs text-ink-muted">Slutt (valgfritt)</label><input type="datetime-local" value={f.ends_at} onChange={set("ends_at")} className={inp} /></div>
        <input type="number" value={f.max_participants} onChange={set("max_participants")} placeholder="Maks deltakere" className={inp} />
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={f.is_published} onChange={set("is_published")} className="h-4 w-4" />
          Publisert
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">{saving ? "Lagrer…" : "Lagre"}</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-ink hover:bg-muted">Avbryt</button>
      </div>
    </form>
  );
}

// ── Medlemmer Tab ─────────────────────────────────────────────────────────────

function MedlemmerTab() {
  const qc = useQueryClient();
  const listFn = useServerFn(listMembers);
  const deleteFn = useServerFn(deleteMember);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["admin", "members"], queryFn: () => listFn() });

  const rows = (data?.rows ?? []).filter((r) => {
    const q = search.toLowerCase();
    return !q || [r.email, r.name ?? ""].join(" ").toLowerCase().includes(q);
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "members"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Søk…"
          className="flex-1 min-w-48 rounded-xl border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none" />
        <span className="text-sm text-ink-muted">{rows.length} medlemmer</span>
      </div>

      {isLoading ? <p className="text-sm text-ink-muted">Laster…</p> : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">Opprettet</th>
                <th className="px-4 py-3">E-post</th>
                <th className="px-4 py-3">Navn</th>
                <th className="px-4 py-3">Bekreftet</th>
                <th className="px-4 py-3">Sist aktiv</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-muted">Ingen treff.</td></tr>
              ) : rows.map((m) => (
                <tr key={m.id} className="border-t border-border/60 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-muted">{fmtDate(m.created_at ?? "")}</td>
                  <td className="px-4 py-3 text-ink">{m.email}</td>
                  <td className="px-4 py-3 text-ink-muted">{m.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{m.email_confirmed ? <span className="text-accent">✓</span> : <span className="text-ink-muted/50">Nei</span>}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{m.last_active ? fmtDate(m.last_active) : "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    <button onClick={() => { if (confirm(`Slett bruker ${m.email}? Dette kan ikke angres.`)) del.mutate(m.id); }}
                      className="text-destructive hover:text-destructive/70">Slett</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("nb-NO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
  } catch { return iso; }
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
