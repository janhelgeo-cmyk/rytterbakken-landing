import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { Offerings } from "@/components/site/Offerings";
import { About } from "@/components/site/About";
import { Eir } from "@/components/site/Eir";
import { Waitlist } from "@/components/site/Waitlist";
import { Footer } from "@/components/site/Footer";
import { useReveal } from "@/hooks/use-reveal";

import ogImg from "@/assets/og-rytterbakken.jpg";

const TITLE = "Rytterbakken — Regenerativt testlaboratorium i Elverum";
const DESCRIPTION =
  "Rytterbakken er et fysisk testlaboratorium for regenerativ livs- og næringsutvikling i Elverum. Workshops, ​gårdsopphold og fordypningskurs der jord, helse og læring vokser sammen.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Rytterbakken, regenerativt jordbruk, permakultur, ​gårdsopphold, Elverum, pust, nervesystem-regulering, workshops" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: ogImg },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Rytterbakken — Jord, Helse, Læring, Teknologi. Regenerativt utviklingslaboratorium i Elverum." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: ogImg },
      { name: "twitter:image:alt", content: "Rytterbakken — Jord, Helse, Læring, Teknologi. Regenerativt utviklingslaboratorium i Elverum." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://rytterbakken-landing.lovable.app/#website",
              url: "https://rytterbakken-landing.lovable.app/",
              name: "Rytterbakken",
              inLanguage: "nb-NO",
              description: DESCRIPTION,
              publisher: { "@id": "https://rytterbakken-landing.lovable.app/#organization" },
            },
            {
              "@type": "Organization",
              "@id": "https://rytterbakken-landing.lovable.app/#organization",
              name: "Rytterbakken",
              url: "https://rytterbakken-landing.lovable.app/",
              email: "post@mindmatter.no",
              description:
                "Regenerativt testlaboratorium i Elverum for livs- og næringsutvikling, med workshops, gårdsopphold og fordypningskurs.",
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
            },
            {
              "@type": "SoftwareApplication",
              "@id": "https://rytterbakken-landing.lovable.app/#eir",
              name: "Eir",
              alternateName: "Eir — digital veileder",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              inLanguage: "nb-NO",
              description:
                "Eir er en digital veileder for medlemmer av Rytterbakken. Hun kjenner medlemmets reise — kursene de har tatt, refleksjonene de har gjort, og hvor de er nå — og støtter videre læring og praksis innen regenerativ livsutvikling, pust og nervesystem-regulering.",
              creator: { "@id": "https://rytterbakken-landing.lovable.app/#organization" },
              provider: { "@id": "https://rytterbakken-landing.lovable.app/#organization" },
              audience: {
                "@type": "Audience",
                audienceType: "Medlemmer av Rytterbakken",
              },
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/PreOrder",
                description: "Tilgjengelig for medlemmer — åpner høst 2026.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Pillars />
      <Offerings />
      <About />
      <Eir />
      <Waitlist />
      <Footer />
    </main>
  );
}
