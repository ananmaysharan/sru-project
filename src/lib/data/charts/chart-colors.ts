/**
 * Shared graphics palette.
 *
 * Color is assigned by meaning rather than by component: teal carries the SRU
 * story, orange directs attention, warm colors communicate repeated risk, and
 * neutrals provide context. Keep categorical comparisons to four colors or
 * fewer and use direct labels wherever possible. Region-comparison graphics
 * are the deliberate exception: each region keeps one stable identity color
 * across the scatterplot, donut, and regional bars.
 */
export const GRAPHICS_COLORS = {
	ink: '#121212',
	secondaryText: '#5f5f5f',
	grid: '#dadad7',
	context: '#e6e6e2',
	contextStrong: '#a8a8a5',
	noData: '#efede8',
	surface: '#f7f6f2',
	canvas: '#ffffff',
	primary: '#497380',
	primaryDark: '#315a67',
	primaryMid: '#7ea0a8',
	primaryLight: '#bfd2d5',
	focus: '#d97f18',
	plum: '#785171',
	blue: '#3b64a1',
	alert: '#bc3939'
} as const;

/** Low to high values for ordinary SRU quantities. */
export const SRU_SEQUENTIAL_SCALE = [
	'#eff4f4',
	'#d8e5e5',
	'#bcd3d5',
	'#93b7bc',
	'#6a969f',
	GRAPHICS_COLORS.primary,
	GRAPHICS_COLORS.primaryDark
] as const;

/** Low to high recurrence or risk. */
export const RISK_SEQUENTIAL_SCALE = [
	'#fff2d8',
	'#ffcc83',
	'#ff9750',
	'#d84a3c',
	'#992d3c'
] as const;

/** Maximum four simultaneous comparison series. */
export const COMPARISON_PALETTE = [
	GRAPHICS_COLORS.primary,
	GRAPHICS_COLORS.focus,
	GRAPHICS_COLORS.plum,
	GRAPHICS_COLORS.blue
] as const;

/** Stable regional identities for graphics whose subject is the regions. */
export const REGION_COLORS: Record<string, string> = {
	'auvergne-rhone-alpes': GRAPHICS_COLORS.primary,
	'bourgogne-franche-comte': '#b58b28',
	bretagne: '#4f7c5d',
	'centre-val de loire': '#a8556f',
	corse: '#7c7a3c',
	'grand est': '#2f7d72',
	guadeloupe: '#3f8f8b',
	guyane: '#6f8c3d',
	'hauts-de-france': '#4f88a3',
	'ile-de-france': GRAPHICS_COLORS.blue,
	'la reunion': '#a98a2f',
	martinique: GRAPHICS_COLORS.plum,
	mayotte: '#6f6f6c',
	normandie: '#6b8fac',
	'nouvelle-aquitaine': '#b84b4b',
	occitanie: GRAPHICS_COLORS.focus,
	'pays de la loire': '#6766a5',
	"provence-alpes-cote d'azur": GRAPHICS_COLORS.primaryDark,
	'outre-mer': '#8b7740'
};

export function normalizeRegionName(region: string) {
	return region
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();
}

export function colorForRegionName(region: string) {
	return REGION_COLORS[normalizeRegionName(region)] ?? GRAPHICS_COLORS.contextStrong;
}

/** Tonal rather than categorical: labels and interaction identify pie slices. */
export const PIE_TONAL_PALETTE = [
	GRAPHICS_COLORS.primaryDark,
	GRAPHICS_COLORS.primary,
	GRAPHICS_COLORS.primaryMid,
	'#9db7bc',
	GRAPHICS_COLORS.primaryLight,
	'#d3e0e2',
	GRAPHICS_COLORS.contextStrong
] as const;

// Compatibility name retained for the two long-form stock charts.
export const INTRO_LINE_BLUE = GRAPHICS_COLORS.primary;
