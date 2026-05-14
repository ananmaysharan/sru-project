export type Headline = {
	id: string;
	thumb: string;
	full: string;
	caption: string;
	date: Date;
	frac: number;
};

const MONTHS: Record<string, number> = {
	January: 0,
	February: 1,
	March: 2,
	April: 3,
	May: 4,
	June: 5,
	July: 6,
	August: 7,
	September: 8,
	October: 9,
	November: 10,
	December: 11
};

function parseFilename(file: string): Date {
	// Filenames look like "March 2015" or "April 2016 2" (where trailing
	// integer is a duplicate marker, not part of the date).
	const [monthName, yearStr] = file.trim().split(/\s+/);
	const month = MONTHS[monthName];
	const year = parseInt(yearStr, 10);
	return new Date(year, month, 15);
}

function fractionalYear(d: Date): number {
	const y = d.getFullYear();
	const start = new Date(y, 0, 1).getTime();
	const end = new Date(y + 1, 0, 1).getTime();
	return y + (d.getTime() - start) / (end - start);
}

const headlineFiles: string[] = [
	'March 2015',
	'September 2015',
	'October 2015',
	'April 2016',
	'April 2016 2',
	'July 2016',
	'April 2018',
	'September 2018',
	'December 2018',
	'January 2019',
	'September 2019',
	'November 2019',
	'December 2020',
	'December 2020 2',
	'November 2022',
	'November 2022 2',
	'March 2023',
	'January 2024',
	'February 2024',
	'April 2024',
	'April 2024 2',
	'June 2024',
	'October 2024'
];

export const headlines: Headline[] = headlineFiles.map((file) => {
	const date = parseFilename(file);
	return {
		id: file,
		thumb: `/headlines/optimized/${file}-thumb.webp`,
		full: `/headlines/optimized/${file}-full.webp`,
		caption: file.trim().split(/\s+/).slice(0, 2).join(' '),
		date,
		frac: fractionalYear(date)
	};
});
