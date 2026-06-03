import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Redirect to password reset page — session is set, user can update password
        window.location.replace("/sett-passord");
      } else if (event === "SIGNED_IN" && session) {
        window.location.replace("/min-side");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.replace("/min-side");
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-display text-lg italic text-ink-muted">Logger inn…</p>
    </div>
  );
}
