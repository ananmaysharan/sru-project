export type HousingStockYear = {
	year: number;
	units: number;
};

// Approximated from the infographic "Evolution of national French social
// housing stock (1920-2022)" (Source: RPLS 2023). Values derived from the
// pixel widths of the bars in the source SVG, calibrated against the two
// known anchors (1944 ≈ 0, 1971 ≈ just over 120,000) at a scale of
// roughly 740 units per pixel, then rounded to the nearest 100.
export const nationalHousingStock: HousingStockYear[] = [
	{ year: 1920, units: 9800 },
	{ year: 1923, units: 4900 },
	{ year: 1926, units: 9800 },
	{ year: 1929, units: 25300 },
	{ year: 1932, units: 16700 },
	{ year: 1935, units: 12600 },
	{ year: 1938, units: 4200 },
	{ year: 1941, units: 4200 },
	{ year: 1944, units: 0 },
	{ year: 1947, units: 5000 },
	{ year: 1950, units: 8400 },
	{ year: 1953, units: 9200 },
	{ year: 1956, units: 40300 },
	{ year: 1959, units: 79600 },
	{ year: 1962, units: 65600 },
	{ year: 1965, units: 92300 },
	{ year: 1968, units: 94800 },
	{ year: 1971, units: 122000 },
	{ year: 1974, units: 105200 },
	{ year: 1977, units: 94800 },
	{ year: 1980, units: 79600 },
	{ year: 1983, units: 72900 },
	{ year: 1986, units: 75000 },
	{ year: 1989, units: 59600 },
	{ year: 1992, units: 61600 },
	{ year: 1995, units: 79600 },
	{ year: 1998, units: 59600 },
	{ year: 2001, units: 53600 },
	{ year: 2004, units: 53600 },
	{ year: 2007, units: 61600 },
	{ year: 2010, units: 84100 },
	{ year: 2013, units: 84100 },
	{ year: 2016, units: 94800 },
	{ year: 2019, units: 79600 },
	{ year: 2022, units: 67100 }
];
