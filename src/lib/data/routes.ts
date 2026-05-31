export type SiteRoute =
  | "/"
  | "/supply"
  | "/post-occupancy-evaluation"
  | "/health-outcomes"
  | "/resources"
  | "/bibliography";

export const siteRoutes: { href: SiteRoute; label: string }[] = [
  { href: "/", label: "Introduction" },
  { href: "/supply", label: "The Numbers" },
  { href: "/post-occupancy-evaluation", label: "Post Occupancy Evaluation" },
  { href: "/health-outcomes", label: "Health Outcomes" },
  { href: "/resources", label: "Resources" },
  { href: "/bibliography", label: "Bibliography" },
];
