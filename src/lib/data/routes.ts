export type SiteRoute =
	| '/'
	| '/supply'
	| '/lived-experiences'
	| '/health-outcomes'
	| '/resources'
	| '/bibliography';

export const siteRoutes: { href: SiteRoute; label: string }[] = [
	{ href: '/', label: 'Introduction' },
	{ href: '/supply', label: 'The Numbers' },
	{ href: '/lived-experiences', label: 'Lived Experiences' },
	{ href: '/health-outcomes', label: 'Health Outcomes' },
	{ href: '/resources', label: 'Resources' },
	{ href: '/bibliography', label: 'Bibliography' }
];
