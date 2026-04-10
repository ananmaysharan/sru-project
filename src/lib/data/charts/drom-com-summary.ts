export type DromComTerritory = {
	name: string;
	location: string;
	status: string;
	center: [number, number];
	zoom: number;
	population: number;
	popYear: number;
	socialHousingRate: number | null;
	socialHousingYear: number;
	socialHousingUnits: number | null;
	principalResidences: number | null;
};

export const dromComTerritories: DromComTerritory[] = [
	{
		name: 'Guyane (French Guiana)',
		location: 'South America',
		status: 'Overseas department and region',
		center: [-53.11, 3.93],
		zoom: 7,
		population: 292354,
		popYear: 2025,
		socialHousingRate: 23.5,
		socialHousingYear: 2022,
		socialHousingUnits: 20310,
		principalResidences: 86398
	},
	{
		name: 'Guadeloupe',
		location: 'Atlantic Ocean',
		status: 'Overseas department and region',
		center: [-61.4, 16.18],
		zoom: 8,
		population: 380387,
		popYear: 2025,
		socialHousingRate: 21.0,
		socialHousingYear: 2022,
		socialHousingUnits: 37380,
		principalResidences: 177918
	},
	{
		name: 'Martinique',
		location: 'Atlantic Ocean',
		status: 'Overseas department and region',
		center: [-61.03, 14.64],
		zoom: 10,
		population: 355459,
		popYear: 2025,
		socialHousingRate: 20.2,
		socialHousingYear: 2022,
		socialHousingUnits: 34413,
		principalResidences: 170722
	},
	{
		name: 'Mayotte',
		location: 'Indian Ocean',
		status: 'Overseas department and region',
		center: [45.17, -12.84],
		zoom: 10,
		population: 329282,
		popYear: 2025,
		socialHousingRate: 3.2,
		socialHousingYear: 2022,
		socialHousingUnits: 2015,
		principalResidences: 63129
	},
	{
		name: 'La Réunion',
		location: 'Indian Ocean',
		status: 'Overseas department and region',
		center: [55.53, -21.13],
		zoom: 8,
		population: 896175,
		popYear: 2025,
		socialHousingRate: 22.8,
		socialHousingYear: 2022,
		socialHousingUnits: 80739,
		principalResidences: 353422
	},
	{
		name: 'Polynésie française',
		location: 'Pacific Ocean',
		status: 'Overseas collectivity',
		center: [-140.0, -15.0],
		zoom: 5,
		population: 278786,
		popYear: 2022,
		socialHousingRate: 4.4,
		socialHousingYear: 2022,
		socialHousingUnits: 3628,
		principalResidences: 82143
	},
	{
		name: 'Wallis-et-Futuna',
		location: 'Pacific Ocean',
		status: 'Overseas collectivity',
		center: [-176.2, -13.3],
		zoom: 10,
		population: 11151,
		popYear: 2023,
		socialHousingRate: null,
		socialHousingYear: 2018,
		socialHousingUnits: null,
		principalResidences: 3468
	},
	{
		name: 'Saint-Martin',
		location: 'Atlantic Ocean',
		status: 'Overseas collectivity',
		center: [-63.0619, 18.0859],
		zoom: 12,
		population: 31496,
		popYear: 2025,
		socialHousingRate: 13.9,
		socialHousingYear: 2018,
		socialHousingUnits: 1847,
		principalResidences: 13329
	},
	{
		name: 'Saint-Barthélemy',
		location: 'Atlantic Ocean',
		status: 'Overseas collectivity',
		center: [-62.8333, 17.9],
		zoom: 13,
		population: 10562,
		popYear: 2025,
		socialHousingRate: 0.02,
		socialHousingYear: 2022,
		socialHousingUnits: 1,
		principalResidences: 4336
	},
	{
		name: 'Saint Pierre-et-Miquelon',
		location: 'Atlantic Ocean',
		status: 'Overseas collectivity',
		center: [-56.2711, 46.9419],
		zoom: 10,
		population: 5819,
		popYear: 2025,
		socialHousingRate: 0.7,
		socialHousingYear: 2022,
		socialHousingUnits: 19,
		principalResidences: 2693
	},
	{
		name: 'Nouvelle-Calédonie',
		location: 'Pacific Ocean',
		status: 'Sui generis collectivity',
		center: [165.5, -21.5],
		zoom: 7,
		population: 271407,
		popYear: 2019,
		socialHousingRate: 16.8,
		socialHousingYear: 2019,
		socialHousingUnits: 15264,
		principalResidences: 90813
	}
];
