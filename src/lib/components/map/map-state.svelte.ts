import sruData from '$lib/data/map/sru-communes.json';
import deptData from '$lib/data/map/sru-departements.json';
import communeLookup from '$lib/data/map/commune-lookup.json';
import departementLookup from '$lib/data/map/departement-lookup.json';

// --- Types ---
export type MetricType =
	| 'rate'
	| 'units'
	| 'social_per_10k'
	| 'single_family_pct'
	| 'multi_family_pct'
	| 'avg_rent_per_sqm';

export type TabType = 'communes' | 'departments';

type CommuneData = Record<
	string,
	{ category: string; years: Record<string, { social: number; total: number }> }
>;
type DeptYearData = {
	social: number;
	total: number;
	social_per_10k?: number;
	single_family_pct?: number;
	multi_family_pct?: number;
	avg_rent_per_sqm?: number;
};
type DeptData = Record<string, { name: string; years: Record<string, DeptYearData> }>;

// --- Constants ---
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

export const YEAR_MIN = 2004;
export const YEAR_MAX = 2022;
export const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i);

export const COMMUNES_PMTILES_URL =
	'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/16395d00-80e7-47d4-9a56-68718a2c1682.pmtiles';
export const REGIONS_PMTILES_URL =
	'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/36a02713-e1cf-45bc-8124-a43588c50443.pmtiles';
export const DEPARTEMENTS_PMTILES_URL =
	'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/268922a5-a53f-44c8-a54c-4930a268d72c.pmtiles';

export const DEPT_ONLY_METRICS: MetricType[] = [
	'social_per_10k',
	'single_family_pct',
	'multi_family_pct',
	'avg_rent_per_sqm'
];

export type MetricConfig = {
	breaks: number[];
	colors: string[];
	label: string;
	suffix: string;
};

const BLUE_SCALE = ['#f7fbff', '#c6dbef', '#6baed6', '#3182bd', '#1d6aaf', '#08519c', '#08306b'];

export const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
	rate: {
		breaks: [0, 5, 10, 15, 20, 25, 30],
		colors: BLUE_SCALE,
		label: 'SRU Rate (%)',
		suffix: '%'
	},
	units: {
		breaks: [0, 50, 200, 500, 1000, 3000, 5000],
		colors: BLUE_SCALE,
		label: 'Social Units',
		suffix: ''
	},
	social_per_10k: {
		breaks: [0, 200, 400, 600, 800, 1000, 1400],
		colors: BLUE_SCALE,
		label: 'Social housing units by 10,000 residents',
		suffix: ''
	},
	single_family_pct: {
		breaks: [0, 5, 10, 20, 30, 40, 50],
		colors: BLUE_SCALE,
		label: 'Share of single-family social housing (%)',
		suffix: '%'
	},
	multi_family_pct: {
		breaks: [50, 60, 70, 80, 90, 95, 100],
		colors: BLUE_SCALE,
		label: 'Share of multi-family social housing (%)',
		suffix: '%'
	},
	avg_rent_per_sqm: {
		breaks: [0, 5, 5.5, 6, 6.5, 7, 8],
		colors: BLUE_SCALE,
		label: 'Average rent per square meter (\u20AC)',
		suffix: '\u20AC'
	}
};

// --- Reactive state class ---
export class MapState {
	activeTab: TabType = $state('communes');
	activeMetric: MetricType = $state('rate');
	activeYear = $state(2022);
	searchQuery = $state('');
	searchOpen = $state(false);
	searchValue = $state<string | undefined>(undefined);
	activeTerritory: 'mainland' | 'overseas' | null = $state(null);
	activeRegion: string | null = $state(null);
	tooltip: { x: number; y: number; name: string; value: string; label: string } | null =
		$state(null);

	yearSliderDisabled = $derived(DEPT_ONLY_METRICS.includes(this.activeMetric));

	currentConfig = $derived(METRIC_CONFIG[this.activeMetric]);

	filteredRegions = $derived(
		this.searchQuery.length >= 2
			? REGION_LOOKUP.filter((r) =>
					r.name.toLowerCase().includes(this.searchQuery.toLowerCase())
				)
			: []
	);

	filteredDepartements = $derived(
		this.searchQuery.length >= 2
			? departementLookup.filter(
					(d: { name: string; code: string }) =>
						d.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
						d.code.includes(this.searchQuery)
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

	metricsForTab = $derived.by(() => {
		if (this.activeTab === 'communes') {
			return ['rate', 'units'] as MetricType[];
		}
		return [
			'rate',
			'units',
			'social_per_10k',
			'single_family_pct',
			'multi_family_pct',
			'avg_rent_per_sqm'
		] as MetricType[];
	});

	switchTab(tab: TabType) {
		this.activeTab = tab;
		if (tab === 'communes' && DEPT_ONLY_METRICS.includes(this.activeMetric)) {
			this.activeMetric = 'rate';
		}
		if (tab === 'departments' && DEPT_ONLY_METRICS.includes(this.activeMetric)) {
			this.activeYear = 2022;
		}
	}

	switchMetric(metric: MetricType) {
		this.activeMetric = metric;
		if (DEPT_ONLY_METRICS.includes(metric)) {
			this.activeYear = 2022;
		}
	}

	buildChoroplethExpression(): any[] {
		if (this.activeTab === 'communes') {
			return this.buildCommuneExpression();
		}
		return this.buildDeptExpression();
	}

	private buildCommuneExpression(): any[] {
		const data = sruData as CommuneData;
		const { breaks, colors } = this.currentConfig;
		const metric = this.activeMetric;
		const year = String(this.activeYear);

		const expr: any[] = ['match', ['get', 'code']];
		for (const [code, info] of Object.entries(data)) {
			const yearData = info.years[year];
			if (!yearData) continue;
			const value =
				metric === 'rate'
					? yearData.total > 0
						? (yearData.social / yearData.total) * 100
						: 0
					: yearData.social;
			expr.push(code, valueToColor(value, breaks, colors));
		}
		expr.push('transparent');
		return expr;
	}

	private buildDeptExpression(): any[] {
		const data = deptData as DeptData;
		const { breaks, colors } = this.currentConfig;
		const metric = this.activeMetric;
		const year = DEPT_ONLY_METRICS.includes(metric) ? '2022' : String(this.activeYear);

		const expr: any[] = ['match', ['get', 'code']];
		for (const [code, info] of Object.entries(data)) {
			const yearData = info.years[year];
			if (!yearData) continue;
			let value: number;
			if (metric === 'rate') {
				value = yearData.total > 0 ? (yearData.social / yearData.total) * 100 : 0;
			} else if (metric === 'units') {
				value = yearData.social;
			} else {
				value = (yearData as any)[metric] ?? 0;
			}
			expr.push(code, valueToColor(value, breaks, colors));
		}
		expr.push('transparent');
		return expr;
	}

	getCommuneTooltip(code: string): { name: string; value: string; label: string } | null {
		const data = sruData as CommuneData;
		const info = data[code];
		if (!info) return null;
		const yearData = info.years[String(this.activeYear)];
		if (!yearData) return null;
		const rate =
			yearData.total > 0 ? ((yearData.social / yearData.total) * 100).toFixed(1) : '0.0';
		return {
			name: '',
			value: `Rate: ${rate}% | Units: ${yearData.social.toLocaleString()}`,
			label: ''
		};
	}

	getDeptTooltip(code: string): { name: string; value: string; label: string } | null {
		const data = deptData as DeptData;
		const info = data[code];
		if (!info) return null;
		const year = DEPT_ONLY_METRICS.includes(this.activeMetric)
			? '2022'
			: String(this.activeYear);
		const yearData = info.years[year];
		if (!yearData) return null;

		const metric = this.activeMetric;
		const config = this.currentConfig;
		let formatted: string;
		if (metric === 'rate') {
			const rate =
				yearData.total > 0
					? ((yearData.social / yearData.total) * 100).toFixed(1)
					: '0.0';
			formatted = `${rate}%`;
		} else if (metric === 'units') {
			formatted = yearData.social.toLocaleString();
		} else {
			const val = (yearData as any)[metric] ?? 0;
			formatted = `${val}${config.suffix}`;
		}

		return {
			name: info.name,
			value: formatted,
			label: config.label
		};
	}
}

function valueToColor(value: number, breaks: number[], colors: string[]): string {
	for (let i = breaks.length - 1; i >= 1; i--) {
		if (value >= breaks[i]) return colors[i];
	}
	return colors[0];
}

export const mapState = new MapState();
export { communeLookup, departementLookup };
