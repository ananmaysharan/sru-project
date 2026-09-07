export type SiteRoute =
  | "/"
  | "/supply"
  | "/post-occupancy-evaluation"
  | "/health-outcomes"
  | "/resources"
  | "/bibliography";

export type SiteRouteDefinition = {
  href: SiteRoute;
};

export const siteRoutes: SiteRouteDefinition[] = [
  { href: "/" },
  { href: "/supply" },
  { href: "/health-outcomes" },
  { href: "/post-occupancy-evaluation" },
  { href: "/resources" },
  { href: "/bibliography" },
];
