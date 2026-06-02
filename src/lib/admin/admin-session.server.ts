// Server-only: admin session-cookie konfigurasjon.
// Brukes av admin.functions.ts. Aldri importer fra klientkode.

import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = {
  isAdmin?: boolean;
  loggedInAt?: string;
};

export function getAdminSessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET må være satt og minst 32 tegn lang.",
    );
  }
  return {
    password,
    name: "rb_admin_session",
    maxAge: 60 * 60 * 8, // 8 timer
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSessionData>(getAdminSessionConfig());
}
