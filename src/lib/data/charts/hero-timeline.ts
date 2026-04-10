export type SupplyMilestone = {
	year: number;
	total: number;
	label: string;
	xPct: number;
	yPct: number;
};

export type PeriodBuild = {
	startYear: number;
	endYear: number;
	units: number;
	label: string;
	xPct: number;
	yPct: number;
};

export type TimelineYear = {
	year: number;
	highlighted: boolean;
	legislation?: string;
};

export const supplyMilestones: SupplyMilestone[] = [
	{ year: 2000, total: 3998000, label: '3,998,000', xPct: 1.3, yPct: 58.3 },
	{ year: 2007, total: 4508500, label: '4,508,500', xPct: 39, yPct: 41.5 },
	{ year: 2013, total: 4761000, label: '4,761,000', xPct: 59.5, yPct: 32.9 },
	{ year: 2019, total: 5154000, label: '5,154,000', xPct: 79.3, yPct: 20.3 },
	{ year: 2022, total: 5367000, label: '5,367,000', xPct: 95.4, yPct: 12.2 }
];

export const periodBuilds: PeriodBuild[] = [
	{ startYear: 2002, endYear: 2004, units: 87000, label: '87,000 units', xPct: 14.6, yPct: 76.8 },
	{ startYear: 2005, endYear: 2007, units: 95000, label: '95,000 units', xPct: 25.1, yPct: 72.9 },
	{ startYear: 2008, endYear: 2010, units: 130500, label: '130,500 units', xPct: 36.4, yPct: 67 },
	{ startYear: 2011, endYear: 2013, units: 140000, label: '140,000 units', xPct: 47.2, yPct: 62.1 },
	{ startYear: 2014, endYear: 2016, units: 188587, label: '188,587 units', xPct: 59.6, yPct: 57.4 },
	{ startYear: 2017, endYear: 2019, units: 211000, label: '211,000 units', xPct: 73, yPct: 49.8 },
	{ startYear: 2020, endYear: 2022, units: 276508, label: '276,508 units', xPct: 86.2, yPct: 43.2 }
];

export type Legislation = {
	year: number;
	name: string;
	fullName: string;
	date: string;
	objectives: string;
	sanctions: string;
};

export const legislations: Legislation[] = [
	{
		year: 2000,
		name: 'Loi SRU',
		fullName: 'Solidarité et renouvellement urbain',
		date: 'December 13, 2000',
		objectives: 'Large municipalities required to devote 20% of their total housing stock to social housing',
		sanctions: 'Fine up to 5% of municipal revenue, plus additional financial penalties (PFL) of approximately €150 per missing unit'
	},
	{
		year: 2006,
		name: 'Loi ENL',
		fullName: 'Engagement national pour le logement',
		date: 'July 13, 2006',
		objectives: 'Required communes to show construction of at least 30% social rental housing (starts) to offset new housing builds',
		sanctions: 'Generalized penalty calculations'
	},
	{
		year: 2007,
		name: 'Loi DALO',
		fullName: 'Droit au logement opposable',
		date: 'March 5, 2007',
		objectives: 'Extended scope of SRU obligations to include communes in metropolitan areas with more than 50,000 inhabitants',
		sanctions: ''
	},
	{
		year: 2013,
		name: 'Loi Duflot I',
		fullName: 'Mobilisation du foncier public en faveur du logement',
		date: 'January 18, 2013',
		objectives: 'Raised requirement from 20% to 25%, with 2025 deadline for most communes, and shifted focus to deeply affordable housing',
		sanctions: 'Fine increased up to 7.5% of municipal revenue, plus an increase on financial penalties (PFL) of municipalities'
	},
	{
		year: 2014,
		name: 'Loi ALUR',
		fullName: 'Accès au logement et urbanisme rénové',
		date: 'March 24, 2014',
		objectives: 'Empowered prefects to take control of construction permits from noncompliant communes',
		sanctions: ''
	},
	{
		year: 2017,
		name: 'Loi LEC',
		fullName: "L'égalité et la citoyenneté",
		date: 'January 21, 2017',
		objectives: 'Empowered prefects to select and control attribution of social housing units to residents from outside communes',
		sanctions: 'Sanctions increased for non-complying municipalities'
	},
	{
		year: 2018,
		name: 'Loi ELAN',
		fullName: "L'évolution du logement, de l'aménagement et du numérique",
		date: 'November 23, 2018',
		objectives: 'Communes only subjected to the 20% (not 25%) were granted longer adjustment periods, incentives broadened to include intermediate housing',
		sanctions: ''
	},
	{
		year: 2022,
		name: 'Loi 3DS',
		fullName: 'Différenciation, la décentralisation, la déconcentration',
		date: 'February 21, 2022',
		objectives: 'Removed 2025 deadline, allowing the law to remain legally until modified; loosened the definition of SRU-eligible social housing to include 26-30% rent brackets in France',
		sanctions: ''
	}
];

export const timelineYears: TimelineYear[] = Array.from({ length: 26 }, (_, i) => {
	const year = 2000 + i;
	const highlightedYears: Record<number, string | undefined> = {
		2000: 'Loi SRU',
		2006: 'Loi ENL',
		2007: 'Loi DALO',
		2013: 'Loi Duflot I',
		2014: 'Loi ALUR',
		2017: 'Loi LEC',
		2018: 'Loi ELAN',
		2022: 'Loi 3DS'
	};
	return {
		year,
		highlighted: year in highlightedYears,
		legislation: highlightedYears[year]
	};
});
