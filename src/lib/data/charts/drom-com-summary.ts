export type DromComTerritory = {
	name: string;
	location: string;
	status: string;
	bounds: [[number, number], [number, number]];
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
		bounds: [[-54.602, 2.113], [-51.626, 5.749]],
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
		bounds: [[-61.806, 15.84], [-61.002, 16.51]],
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
		bounds: [[-61.227, 14.398], [-60.824, 14.877]],
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
		bounds: [[45.042, -13], [45.296, -12.673]],
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
		bounds: [[55.217, -21.389], [55.837, -20.872]],
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
		bounds: [[-153.951, -27.632], [-134.936, -7.955]],
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
		bounds: [[-178.182, -14.353], [-176.162, -13.219]],
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
		bounds: [[-63.091, 18.049], [-63.019, 18.124]],
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
		bounds: [[-62.866, 17.878], [-62.798, 17.916]],
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
		bounds: [[-56.406, 46.758], [-56.154, 47.103]],
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
		bounds: [[163.574, -22.695], [168.133, -19.544]],
		population: 271407,
		popYear: 2019,
		socialHousingRate: 16.8,
		socialHousingYear: 2019,
		socialHousingUnits: 15264,
		principalResidences: 90813
	}
];
