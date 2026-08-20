import bivariateData from '$lib/data/map/health-communes-bivariate.json';
import communeLookup from '$lib/data/map/commune-lookup.json';
import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';

type MetricType = 'income' | 'poverty' | 'elders' | 'left' | 'dpe' | 'heat' | 'green' | 'health';
type Year = 2012 | 2014 | 2017 | 2018 | 2020 | 2021;
type CellCode = 'A1' | 'B1' | 'C1' | 'A2' | 'B2' | 'C2' | 'A3' | 'B3' | 'C3';

type CellValue = {
	cell: CellCode | null;
	x_bin: number | null;
	y_bin: number | null;
	x_label: 'A' | 'B' | 'C' | null;
	y_label: '1' | '2' | '3' | null;
	x_value: number | null;
	y_value: number | null;
};

type HealthData = Record<string, { years: Partial<Record<Year, Partial<Record<MetricType, CellValue>>>> }>;

export const OVERSEAS_REGIONS = [
	{ name: 'Guadeloupe', center: [-61.4, 16.18] as [number, number], zoom: 8 },
	{ name: 'Martinique', center: [-61.03, 14.64] as [number, number], zoom: 10 },
	{ name: 'Guyane', center: [-53.11, 3.93] as [number, number], zoom: 7 },
	{ name: 'La Réunion', center: [55.53, -21.13] as [number, number], zoom: 8 },
	{ name: 'Mayotte', center: [45.17, -12.84] as [number, number], zoom: 10 }
];

export const MAINLAND_CENTER: [number, number] = [2.2, 46.6];
export const MAINLAND_ZOOM = 5;

export const REGION_LOOKUP: { name: string; center: [number, number]; zoom: number }[] = [
	{ name: 'Auvergne-Rhône-Alpes', center: [4.5, 45.5], zoom: 7 },
	{ name: 'Bourgogne-Franche-Comté', center: [5.0, 47.0], zoom: 7 },
	{ name: 'Bretagne', center: [-3.0, 48.2], zoom: 7 },
	{ name: 'Centre-Val de Loire', center: [1.7, 47.5], zoom: 7 },
	{ name: 'Corse', center: [9.1, 42.1], zoom: 8 },
	{ name: 'Grand Est', center: [5.7, 48.6], zoom: 7 },
	{ name: 'Hauts-de-France', center: [2.8, 49.9], zoom: 7 },
	{ name: 'Île-de-France', center: [2.5, 48.8], zoom: 9 },
	{ name: 'Normandie', center: [-0.4, 49.0], zoom: 7 },
	{ name: 'Nouvelle-Aquitaine', center: [0.5, 45.5], zoom: 7 },
	{ name: 'Occitanie', center: [2.5, 43.7], zoom: 7 },
	{ name: 'Pays de la Loire', center: [-1.0, 47.5], zoom: 7 },
	{ name: "Provence-Alpes-Côte d'Azur", center: [5.8, 43.9], zoom: 7 },
	...OVERSEAS_REGIONS.map((r) => ({ name: r.name, center: r.center, zoom: r.zoom }))
];

export const COMMUNES_PMTILES_URL =
	'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/16395d00-80e7-47d4-9a56-68718a2c1682.pmtiles';
export const REGIONS_PMTILES_URL =
	'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/36a02713-e1cf-45bc-8124-a43588c50443.pmtiles';

export const YEARS = [2012, 2014, 2017, 2018, 2020, 2021] as const;

export const BIVARIATE_COLORS: Record<CellCode, string> = {
	A1: '#e2eceb',
	B1: '#f7ddbb',
	C1: GRAPHICS_COLORS.focus,
	A2: '#bfd3d6',
	B2: '#c7b7ad',
	C2: '#b77968',
	A3: GRAPHICS_COLORS.primary,
	B3: '#7b7885',
	C3: GRAPHICS_COLORS.plum
};

type CornerCells = 'A1' | 'A3' | 'C1' | 'C3';

// The corner-only view reuses the same semantic colors as the full matrix so
// readers do not need to relearn the encoding between the paired maps.
export const CORNER_COLORS: Partial<Record<CellCode, string>> = {
	C3: BIVARIATE_COLORS.C3,
	A3: BIVARIATE_COLORS.A3
};
export const CORNER_NEUTRAL = GRAPHICS_COLORS.noData;

export const METRIC_CONFIG: Record<
	MetricType,
	{
		label: string;
		shortName: string;
		description: string;
		xAxisLabel: string;
		yAxisLabel: string;
		xLow: string;
		xHigh: string;
		availableYears: Year[];
		insights: Record<CornerCells, { title: string; body: string }>;
	}
> = {
	income: {
		label: 'Median household income',
		shortName: 'Median income',
		description:
			'Median annual household income (€/year) in each commune, taken from INSEE’s FiloSoFi tax records. This provides a snapshot of the typical economic resources available to residents.',
		xAxisLabel: 'Lower income → Higher income',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Low income',
		xHigh: 'High income',
		availableYears: [2012, 2018],
		insights: {
			A1: { title: 'Rural / struggling', body: 'Low income + low growth — stagnant policy.' },
			A3: { title: 'Redistributive', body: 'Low income + high growth — investing despite a low tax base.' },
			C1: { title: 'Exclusionary', body: 'High income + low growth — wealthy but supply-constrained.' },
			C3: { title: 'Inclusive growth', body: 'High income + high growth — prosperous areas expanding affordable housing.' }
		}
	},
	poverty: {
		label: 'Share of residents in poverty',
		shortName: 'Poverty rate',
		description:
			'Share of the population living on less than 60% of the national median income—Europe’s standard threshold for monetary poverty. Higher values indicate communes where a larger proportion of residents are in income poverty.',
		xAxisLabel: 'Lower poverty → Higher poverty',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Low poverty',
		xHigh: 'High poverty',
		availableYears: [2012, 2018],
		insights: {
			A1: { title: 'Expected low-need', body: 'Low poverty + low growth — limited demand pressure.' },
			A3: { title: 'Inclusive expansion', body: 'Low poverty + high growth — building beyond local need.' },
			C1: { title: 'Crisis zone', body: 'High poverty + low growth — need without response.' },
			C3: { title: 'Strong response', body: 'High poverty + high growth — investment matching need.' }
		}
	},
	elders: {
		label: 'Older adult share (65+)',
		shortName: 'Share of elders',
		description:
			'Share of the population aged 65 and over at the commune level. This indicator helps identify places with more residents who are generally more vulnerable to housing conditions, energy insecurity, and extreme temperatures.',
		xAxisLabel: 'Fewer elders → More elders',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Few elders',
		xHigh: 'Many elders',
		availableYears: [2018],
		insights: {
			A1: { title: 'Younger, stable', body: 'Few elders + low growth — limited demographic pressure.' },
			A3: { title: 'Family-oriented growth', body: 'Few elders + high growth — building for incoming households.' },
			C1: { title: 'Aging without renewal', body: 'Many elders + low growth — older stock, no replenishment.' },
			C3: { title: 'Aging with investment', body: 'Many elders + high growth — adapting stock for older residents.' }
		}
	},
	left: {
		label: 'Municipal political leadership',
		shortName: 'Municipal election winner',
		description:
			'Political orientation of the winning party or coalition in the most recent municipal election, coded as Left, Center, or Right. This gives a rough proxy for local political priorities that may shape housing policy and implementation of the SRU law.',
		xAxisLabel: 'Left → Center → Right',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Left',
		xHigh: 'Right',
		availableYears: [2014, 2020],
		insights: {
			A1: { title: 'Rhetoric without delivery', body: 'Left winner + low growth.' },
			A3: { title: 'Left prioritizing housing', body: 'Left winner + high growth.' },
			C1: { title: 'Market-oriented', body: 'Right winner + low growth — limited intervention.' },
			C3: { title: 'Consensus policy', body: 'Right winner + high growth — Right also expanding.' }
		}
	},
	dpe: {
		label: 'DPE energy-efficient building share (A-C)',
		shortName: 'Building energy efficiency',
		description:
			'Share of residential buildings in each commune rated A, B, or C in France’s DPE (Diagnostic de performance énergétique) energy‑performance database. Higher values indicate a larger proportion of relatively energy‑efficient housing, with implications for both emissions and indoor comfort.',
		xAxisLabel: 'Lower efficiency → Higher efficiency',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Low efficiency',
		xHigh: 'High efficiency',
		availableYears: [2021],
		insights: {
			A1: { title: 'Dual vulnerability', body: 'Low efficiency + low growth — both lagging.' },
			A3: { title: 'Retrofit opportunity', body: 'Low efficiency + high growth — new stock replacing old.' },
			C1: { title: 'Mature efficient stock', body: 'High efficiency + low growth — already well-equipped.' },
			C3: { title: 'Green & inclusive', body: 'High efficiency + high growth — best of both.' }
		}
	},
	heat: {
		label: 'Urban heat island exposure',
		shortName: 'Urban heat-island intensity',
		description:
			'Share of the commune’s surface area classified as an urban heat island in the MAPUCE 2017 dataset. We define heat‑island zones as areas where the temperature anomaly is more than 1 K (≈1°C) above the surrounding rural baseline—an indicator of residents’ exposure to urban overheating.',
		xAxisLabel: 'Cooler → Hotter',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Cool',
		xHigh: 'Hot',
		availableYears: [2017],
		insights: {
			A1: { title: 'Comfortable, limited need', body: 'Low heat + low growth.' },
			A3: { title: 'Greenfield development', body: 'Low heat + high growth — building in cool peripheries.' },
			C1: { title: 'Environmental injustice', body: 'High heat + low growth — exposed without response.' },
			C3: { title: 'Compensatory policy', body: 'High heat + high growth — investment in hot areas.' }
		}
	},
	health: {
		label: 'Proximity to healthcare and hospital infrastructure',
		shortName: 'Healthcare proximity',
		description:
			'Measures the average distance or travel time from social housing to nearby healthcare services, including clinics, hospitals, and emergency care facilities.',
		xAxisLabel: 'Fewer facilities → More facilities',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Low access',
		xHigh: 'High access',
		availableYears: [2021],
		insights: {
			A1: { title: 'Underserved & static', body: 'Low facility access + low growth — limited services, no expansion.' },
			A3: { title: 'Building into gaps', body: 'Low facility access + high growth — adding housing where health access lags.' },
			C1: { title: 'Well-served, exclusionary', body: 'High facility access + low growth — amenity-rich areas not expanding social housing.' },
			C3: { title: 'Access & inclusion', body: 'High facility access + high growth — expanding housing near health services.' }
		}
	},
	green: {
		label: 'Proximity to green spaces',
		shortName: 'Green space proximity',
		description:
			'Measures the average distance or travel time from social housing to nearby public green areas (parks, gardens, forests, and other green spaces).',
		xAxisLabel: 'Less green → More green',
		yAxisLabel: 'Lower social-housing growth → Higher social-housing growth',
		xLow: 'Less green',
		xHigh: 'More green',
		availableYears: [2021],
		insights: {
			A1: { title: 'Grey & static', body: 'Little green + low growth — built-up areas not expanding social housing.' },
			A3: { title: 'Dense expansion', body: 'Little green + high growth — adding housing in low-green areas.' },
			C1: { title: 'Green & exclusionary', body: 'Lots of green + low growth — leafy areas resisting social housing.' },
			C3: { title: 'Green & inclusive', body: 'Lots of green + high growth — expanding housing while keeping green space.' }
		}
	}
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'EUR',
	maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 1
});

function getNearestAvailableYear(metric: MetricType, year: Year): Year {
	const availableYears = METRIC_CONFIG[metric].availableYears;
	if (availableYears.includes(year)) return year;

	return availableYears.reduce((closest, candidate) =>
		Math.abs(candidate - year) < Math.abs(closest - year) ? candidate : closest
	);
}

function getYearIndex(year: Year): number {
	return YEARS.findIndex((value) => value === year);
}

function formatSignedNumber(value: number): string {
	const formatted = numberFormatter.format(value);
	return value > 0 ? `+${formatted}` : formatted;
}

function formatMetricValue(metric: MetricType, value: number): string {
	if (metric === 'income') return currencyFormatter.format(value);
	if (metric === 'health') return `${numberFormatter.format(value)} per 10k`;
	if (metric === 'elders' || metric === 'left') {
		const percent = Math.abs(value) <= 1 ? value * 100 : value;
		return `${percentFormatter.format(percent)}%`;
	}
	return `${percentFormatter.format(value)}%`;
}

export class MapState {
	cornerMode: boolean;

	constructor(opts: { cornerMode?: boolean } = {}) {
		this.cornerMode = opts.cornerMode ?? false;
	}

	activeMetric: MetricType = $state('income');
	activeYear: Year = $state(2018);
	searchQuery = $state('');
	searchOpen = $state(false);
	searchValue = $state<string | undefined>(undefined);
	activeTerritory: 'mainland' | 'overseas' | null = $state(null);
	activeRegion: string | null = $state(null);
	tooltip: {
		x: number;
		y: number;
		name: string;
		metricLabel: string;
		metricValue: string;
		socialHousingLabel: string;
		socialHousingValue: string;
	} | null = $state(null);

	currentConfig = $derived(METRIC_CONFIG[this.activeMetric]);
	availableYears = $derived(this.currentConfig.availableYears);
	activeYearIndex = $derived(getYearIndex(this.activeYear));
	availableYearIndex = $derived(this.availableYears.findIndex((year) => year === this.activeYear));

	filteredRegions = $derived(
		this.searchQuery.length >= 2
			? REGION_LOOKUP.filter((r) =>
					r.name.toLowerCase().includes(this.searchQuery.toLowerCase())
				)
			: []
	);

	filteredCommunes = $derived(
		this.searchQuery.length >= 2
			? communeLookup
					.filter(
						(c: { name: string; code: string }) =>
							c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
							c.code.includes(this.searchQuery)
					)
					.slice(0, 20)
			: []
	);

	metricsForTab = ['income', 'poverty', 'elders', 'left', 'dpe', 'heat', 'green', 'health'] as MetricType[];

	switchMetric(metric: MetricType) {
		this.activeMetric = metric;
		const nextYear = getNearestAvailableYear(metric, this.activeYear);
		this.activeYear = nextYear;
	}

	setActiveYear(year: Year) {
		this.activeYear = getNearestAvailableYear(this.activeMetric, year);
	}

	setActiveYearByIndex(index: number) {
		const requestedYear = this.availableYears[Math.max(0, Math.min(this.availableYears.length - 1, index))];
		const nextYear = getNearestAvailableYear(this.activeMetric, requestedYear);
		this.activeYear = nextYear;
	}

	buildChoroplethExpression(): any[] {
		const data = bivariateData as HealthData;
		const expr: any[] = ['match', ['get', 'code']];

		for (const [code, info] of Object.entries(data)) {
			const cell = info.years?.[this.activeYear]?.[this.activeMetric]?.cell;
			if (!cell) continue;
			if (this.cornerMode) {
				const color = CORNER_COLORS[cell];
				if (!color) continue;
				expr.push(code, color);
			} else {
				expr.push(code, BIVARIATE_COLORS[cell]);
			}
		}

		// Guarantee at least one match/output pair so the `match` expression
		// stays valid even if no commune falls in a corner cell this year.
		expr.push('__none__', GRAPHICS_COLORS.noData);
		expr.push(GRAPHICS_COLORS.noData);
		return expr;
	}

	getCommuneTooltip(
		code: string
	): { metricLabel: string; metricValue: string; socialHousingLabel: string; socialHousingValue: string } | null {
		const data = (bivariateData as HealthData)[code];
		const cell = data?.years?.[this.activeYear]?.[this.activeMetric];
		if (!cell?.cell) return null;

		return {
			metricLabel: this.currentConfig.label,
			metricValue: cell.x_value === null ? '' : formatMetricValue(this.activeMetric, cell.x_value),
			socialHousingLabel: 'Social housing change',
			socialHousingValue: cell.y_value === null ? '' : `${formatSignedNumber(cell.y_value)} pp`
		};
	}
}

export const mapState = new MapState();
export { communeLookup };
export type { MetricType, Year, CellCode };
