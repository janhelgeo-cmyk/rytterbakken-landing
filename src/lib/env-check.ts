// Validerer at nødvendige Supabase-variabler er tilgjengelige i klient-bundlen.
// Kjøres ved app-oppstart fra src/routes/__root.tsx.

const REQUIRED_CLIENT_ENV = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_PROJECT_ID",
] as const;

export type EnvCheckResult =
  | { ok: true }
  | { ok: false; missing: string[] };

export function checkRequiredEnv(): EnvCheckResult {
  const env = import.meta.env as Record<string, string | undefined>;
  const missing = REQUIRED_CLIENT_ENV.filter((key) => {
    const value = env[key];
    return !value || value.trim() === "";
  });
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}
