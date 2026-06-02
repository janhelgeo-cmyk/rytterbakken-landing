import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import ogImage from "../assets/og-rytterbakken.jpg";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { checkRequiredEnv } from "../lib/env-check";

const siteUrl = import.meta.env.VITE_SITE_URL ?? "";

function MissingEnvScreen({ missing }: { missing: string[] }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg rounded-lg border border-destructive/30 bg-card p-6 text-left shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          Konfigurasjon mangler
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Appen kan ikke starte fordi følgende miljøvariabler ikke er satt i{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code>:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground">
          {missing.map((key) => (
            <li key={key}>
              <code className="rounded bg-muted px-1 py-0.5 text-xs">{key}</code>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Kopier <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.example</code>{" "}
          til <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code>, fyll
          inn verdiene (se README), og restart dev-serveren.
        </p>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#F4EDE2" },
      { property: "og:site_name", content: "Rytterbakken" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "nb_NO" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Rytterbakken" },
      { property: "og:title", content: "Rytterbakken" },
      { name: "twitter:title", content: "Rytterbakken" },
      { name: "description", content: "Rytterbakken is a physical-digital test lab for regenerative living and nutrition development." },
      { property: "og:description", content: "Rytterbakken is a physical-digital test lab for regenerative living and nutrition development." },
      { name: "twitter:description", content: "Rytterbakken is a physical-digital test lab for regenerative living and nutrition development." },
      { property: "og:image", content: `${siteUrl}${ogImage}` },
      { name: "twitter:image", content: `${siteUrl}${ogImage}` },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Rytterbakken",
          url: siteUrl || "https://rytterbakken.no",
          description:
            "Fysisk testlaboratorium for regenerativ livs- og næringsutvikling i Elverum. Tilbyr workshops, gårdsopphold og fordypningskurs der jord, helse og læring vokser sammen, støttet av Eir — en digital veileder for medlemmer.",
          email: "post@mindmatter.no",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Elverum",
            addressCountry: "NO",
          },
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "post@mindmatter.no",
              areaServed: "NO",
              availableLanguage: ["Norwegian", "English"],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const envCheck = checkRequiredEnv();

  if (!envCheck.ok) {
    if (typeof console !== "undefined") {
      console.error(
        `[env-check] Mangler miljøvariabler: ${envCheck.missing.join(", ")}`,
      );
    }
    return <MissingEnvScreen missing={envCheck.missing} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
