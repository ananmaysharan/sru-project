import bivariateData from '$lib/data/map/health-communes-bivariate.json';
import communeLookup from '$lib/data/map/commune-lookup.json';

type MetricType = 'income' | 'poverty' | 'elders' | 'left';
type Year = 2012 | 2014 | 2018 | 2020;
type CellCode = 'A1' | 'B1' | 'C1' | 'A2' | 'B2' | 'C2' | 'A3' | 'B3' | 'C3';

type CellValue = {
	cell: CellCode | null;
	x_bin: number | null;
	y_bin: number | null;
	x_label: 'A' | 'B' | 'C' | null;
	y_label: '1' | '2' | '3' | null;
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

export const YEARS = [2012, 2014, 2018, 2020] as const;

export const BIVARIATE_COLORS: Record<CellCode, string> = {
	A1: '#e8e8e8',
	B1: '#b8d6be',
	C1: '#73ae80',
	A2: '#dfb0d6',
	B2: '#a5add3',
	C2: '#5698b9',
	A3: '#be64ac',
	B3: '#8c62aa',
	C3: '#3b4994'
};

export const METRIC_CONFIG: Record<
	MetricType,
	{
		label: string;
		xAxisLabel: string;
		yAxisLabel: string;
		availableYears: Year[];
	}
> = {
	income: {
		label: 'Income',
		xAxisLabel: 'Lower income → Higher income',
		yAxisLabel: 'Lower SRU exposure → Higher SRU exposure',
		availableYears: [2012, 2018]
	},
	poverty: {
		label: 'Poverty',
		xAxisLabel: 'Lower poverty → Higher poverty',
		yAxisLabel: 'Lower SRU exposure → Higher SRU exposure',
		availableYears: [2012, 2018]
	},
	elders: {
		label: 'Elders',
		xAxisLabel: 'Lower share of elders → Higher share of elders',
		yAxisLabel: 'Lower SRU exposure → Higher SRU exposure',
		availableYears: [2018]
	},
	left: {
		label: 'Left Vote',
		xAxisLabel: 'Lower left vote → Higher left vote',
		yAxisLabel: 'Lower SRU exposure → Higher SRU exposure',
		availableYears: [2014, 2020]
	}
};

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

export class MapState {
	activeMetric: MetricType = $state('income');
	activeYear: Year = $state(2018);
	searchQuery = $state('');
	searchOpen = $state(false);
	searchValue = $state<string | undefined>(undefined);
	activeTerritory: 'mainland' | 'overseas' | null = $state(null);
	activeRegion: string | null = $state(null);
	tooltip: { x: number; y: number; name: string; value: string; label: string } | null =
		$state(null);

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

	metricsForTab = ['income', 'poverty', 'elders', 'left'] as MetricType[];

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
			expr.push(code, BIVARIATE_COLORS[cell]);
		}

		expr.push('#f3f4f6');
		return expr;
	}

	getCommuneTooltip(code: string): { name: string; value: string; label: string } | null {
		const data = (bivariateData as HealthData)[code];
		const cell = data?.years?.[this.activeYear]?.[this.activeMetric];
		if (!cell?.cell) return null;

		return {
			name: '',
			value: '',
			label: ''
		};
	}
}

export const mapState = new MapState();
export { communeLookup };
export type { MetricType, Year, CellCode };
