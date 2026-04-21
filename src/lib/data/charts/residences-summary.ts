export type ResidenceRow = {
	year: string;
	socialRental: number;
	privateRental: number;
	ownerMortgaged: number;
	ownerMortgageFree: number;
};

export const residencesByYear: ResidenceRow[] = [
	{ year: '1984', socialRental: 3.3, privateRental: 6.6, ownerMortgaged: 5.0, ownerMortgageFree: 5.8 },
	{ year: '1988', socialRental: 3.7, privateRental: 6.1, ownerMortgaged: 5.6, ownerMortgageFree: 6.2 },
	{ year: '1992', socialRental: 4.2, privateRental: 6.0, ownerMortgaged: 5.3, ownerMortgageFree: 7.0 },
	{ year: '1996', socialRental: 4.6, privateRental: 6.1, ownerMortgaged: 5.2, ownerMortgageFree: 7.8 },
	{ year: '2000', socialRental: 4.7, privateRental: 6.2, ownerMortgaged: 5.2, ownerMortgageFree: 8.6 },
	{ year: '2004', socialRental: 4.9, privateRental: 6.4, ownerMortgaged: 5.2, ownerMortgageFree: 9.6 },
	{ year: '2008', socialRental: 5.0, privateRental: 6.7, ownerMortgaged: 5.4, ownerMortgageFree: 10.4 },
	{ year: '2012', socialRental: 5.1, privateRental: 6.9, ownerMortgaged: 5.6, ownerMortgageFree: 10.8 },
	{ year: '2016', socialRental: 5.3, privateRental: 7.2, ownerMortgaged: 5.9, ownerMortgageFree: 11.1 },
	{ year: '2020', socialRental: 5.5, privateRental: 7.5, ownerMortgaged: 6.1, ownerMortgageFree: 11.3 },
	{ year: '2023', socialRental: 5.7, privateRental: 7.7, ownerMortgaged: 6.3, ownerMortgageFree: 11.5 }
];
