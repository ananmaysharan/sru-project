export type SocialHousingStockYear = {
	year: number;
	units: number;
};

// Total stock of social housing (parc Hlm/parc locatif social) in
// France métropolitaine, au 1er janvier de chaque année.
// Sources:
//   2000–2007: Fondation Abbé Pierre, RML 2011, Tableau 29 (EPLS)
//   2008–2015: Fondation Abbé Pierre, RML 2016, Tableau 26 (EPLS→RPLS)
//   2016–2024: Fondation Abbé Pierre, RML 2025, Tableau 2.5 (RPLS)
// Underlying data: MEEDDM, DGALN/DHUP, CGDD/SOeS — EPLS then RPLS from 2010.
export const socialHousingStock: SocialHousingStockYear[] = [
	{ year: 2000, units: 3_998_000 },
	{ year: 2001, units: 4_054_500 },
	{ year: 2002, units: 4_077_900 },
	{ year: 2003, units: 4_113_500 },
	{ year: 2004, units: 4_152_000 },
	{ year: 2005, units: 4_180_700 },
	{ year: 2006, units: 4_199_000 },
	{ year: 2007, units: 4_244_000 },
	{ year: 2008, units: 4_437_000 },
	{ year: 2009, units: 4_450_000 },
	{ year: 2010, units: 4_508_500 },
	{ year: 2011, units: 4_576_100 },
	{ year: 2012, units: 4_652_300 },
	{ year: 2013, units: 4_728_000 },
	{ year: 2014, units: 4_685_800 },
	{ year: 2015, units: 4_760_500 },
	{ year: 2016, units: 4_840_000 },
	{ year: 2017, units: 4_915_000 },
	{ year: 2018, units: 5_004_000 },
	{ year: 2019, units: 5_090_000 },
	{ year: 2020, units: 5_154_000 },
	{ year: 2021, units: 5_028_000 },
	{ year: 2022, units: 5_268_000 },
	{ year: 2023, units: 5_324_000 },
	{ year: 2024, units: 5_367_000 }
];
