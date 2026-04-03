export const socialMixPolicies = [
	{
		iso3: 'DNK',
		country: 'Denmark',
		policyName: 'Ghetto Laws (Ét Danmark uden parallelsamfund)',
		description:
			'Danish "parallel society" legislation aims to eliminate neighborhoods with over 50% non-Western residents, high unemployment, or high crime by 2030 through forced relocations, demolitions, and reducing public housing to 40%. Legislation identifies three types of areas: deprived areas, "ghettos" and "hard ghettos" (renamed in 2021 to "parallel societies" and "restructuring areas"). Key tools include demolishing or selling off parts of social housing estates, converting rental units to private ownership, and limiting new tenants who receive social benefits.',
		differenceFromSru:
			'Instead of focusing on bringing affordability into exclusive wealthy enclaves, the Ghetto Laws seek the opposite: to insert middle- and upper-income Danes into predominantly immigrant neighborhoods to induce social mixing and preserve Danish culture. The law has faced significant criticism and its legality is currently under review by the European Court of Justice.',
		category: 'National Mandate',
		years: '2018, 2021'
	},
	{
		iso3: 'ESP',
		country: 'Spain',
		policyName: 'Spanish Housing Act (Ley 12/2023)',
		description:
			'The Housing Act increases minimum percentages of social housing reserve land: from 30% to 40% for new developments in rural areas, and from 10% to 20% for renewal or renovation in urban areas. The land classification as social housing reserve land may not be amended except in exceptional cases. Regions are required to establish the percentage of reserve land available for lease, generally not less than 50%.',
		differenceFromSru:
			'Requires set-aside of minimum percentages of land for social housing exclusive zoning — does not directly mandate social housing units or construction.',
		category: null,
		years: '2023'
	},
	{
		iso3: 'IRL',
		country: 'Ireland',
		policyName: 'Part V',
		description:
			'Part V of the Planning and Development Act 2000 allows local authorities to obtain up to 10% of land zoned for housing development at "existing use value" rather than "development value." It applies to any residential development of 9 or more units or on a site exceeding 0.1 hectares. The aim is to promote social integration and avoid a return to the traditional "council estate."',
		differenceFromSru:
			'It is up to the municipality to administer Part V requirements, and there are no national level mandates on municipalities to deliver quotas of social housing.',
		category: 'Inclusionary Zoning',
		years: '2000, amended multiple times'
	},
	{
		iso3: 'GBR',
		country: 'United Kingdom',
		policyName: 'Section 106 (S106) Agreements',
		description:
			'Under Section 106 of the Town and Country Planning Act, planning authorities can require developers to provide a proportion of affordable units or make in-lieu contributions. Many local plans set explicit percentage targets for affordable housing in new developments. S106 contributions allow alternatives such as producing affordable units at a different location, paying cash in lieu, or donating land for future affordable housing.',
		differenceFromSru:
			'Not as relevant since the spatial aspect is avoidable and this is a focus on ownership rather than social housing.',
		category: 'Inclusionary Zoning',
		years: null
	},
	{
		iso3: 'BEL',
		country: 'Belgium',
		policyName: 'Binding Social Objective',
		description:
			'The Flemish government set an objective of producing 54,000 social housing units by 2042, imposed on municipalities through a binding social objective. Every developer building at least 10 residential houses or 50 apartments is subject to a "social housing obligation" of normally 20% (up to 40%) to obtain a building permit. Units must be transferred at maximum prices to social housing companies. The government aims to increase social housing to 15% in each municipality.',
		differenceFromSru:
			'Generally a similar but less comprehensive model of the SRU and a hybrid with inclusionary zoning as mandates filter down to real estate developers. Individual municipalities do not have clear social housing targets and financial consequences are not clear.',
		category: 'National Mandate',
		years: '2009 (renewed 2025)'
	},
	{
		iso3: 'NLD',
		country: 'Netherlands',
		policyName: 'Proposed Housing Governance Strengthening Act (Wet Versterking Regie Volkshuisvesting)',
		description:
			'Under this law, two-thirds of all new housing built within a region must meet national affordability standards, with 30% reserved for social housing (maximum monthly rent of roughly €900). These national targets build on existing local agreements — for instance, Amsterdam has applied the "40-40-20" rule since 2017. The shared goal is to keep the housing market accessible to low- and middle-income households.',
		differenceFromSru:
			'Similar to SRU with nationally set percentage expectations, but framed around new construction rather than total stock. There are no financial penalties for not meeting set goals, though municipalities are responsible for setting their own affordability goals.',
		category: null,
		years: 'Proposal, not yet law'
	}
];
