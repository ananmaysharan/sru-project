export const INTRO_LINE_BLUE = '#06738b';

export const BRIGHT_CHART_PALETTE = [
	'#1aa6a8',
	'#ef3b7d',
	'#318ce7',
	'#3f9f4a',
	'#f5c400',
	'#00b5d8',
	'#73bf43',
	'#ff6f61',
	'#00a878',
	'#4f8bd6',
	'#d84a8a',
	'#9aa52d',
	'#0072b2',
	'#5da5da',
	'#e15759',
	'#17becf',
	'#757575',
	'#b3a500',
	'#26a69a',
	'#8da000'
];

export const REGION_COLORS: Record<string, string> = {
	'auvergne-rhone-alpes': '#1aa6a8',
	'bourgogne-franche-comte': '#f5c400',
	bretagne: '#3f9f4a',
	'centre-val de loire': '#ef3b7d',
	corse: '#9aa52d',
	'grand est': '#00a878',
	guadeloupe: '#26a69a',
	guyane: '#73bf43',
	'hauts-de-france': '#00b5d8',
	'ile-de-france': '#318ce7',
	'la reunion': '#b3a500',
	martinique: '#d84a8a',
	mayotte: '#757575',
	normandie: '#5da5da',
	'nouvelle-aquitaine': '#e15759',
	occitanie: '#ff6f61',
	'pays de la loire': '#4f8bd6',
	"provence-alpes-cote d'azur": '#0072b2',
	'outre-mer': '#8da000'
};

export function normalizeRegionName(region: string) {
	return region
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();
}

export function colorForRegionName(region: string) {
	return REGION_COLORS[normalizeRegionName(region)] ?? '#6b7280';
}
