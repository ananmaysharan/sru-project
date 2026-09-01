export type SiteRoute =
  | "/"
  | "/supply"
  | "/post-occupancy-evaluation"
  | "/health-outcomes"
  | "/resources"
  | "/bibliography";

import type { Language } from "$lib/i18n";

export type SiteRouteDefinition = {
  href: SiteRoute;
  label: Record<Language, string>;
};

export const siteRoutes: SiteRouteDefinition[] = [
  { href: "/", label: { fr: "Introduction", en: "Introduction" } },
  { href: "/supply", label: { fr: "Chiffres", en: "The Numbers" } },
  { href: "/health-outcomes", label: { fr: "Indicateurs de santé", en: "Health Outcomes" } },
  {
    href: "/post-occupancy-evaluation",
    label: { fr: "Évaluation de l’usage des bâtiments", en: "Post-Occupancy Evaluation" },
  },
  { href: "/resources", label: { fr: "Revue de presse", en: "News Sources" } },
  { href: "/bibliography", label: { fr: "Bibliographie", en: "Bibliography" } },
];
