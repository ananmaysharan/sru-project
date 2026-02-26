import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = resolve(__dirname, '../sru_files/Total_social_housing_2004_2022.csv');
const outPath = resolve(__dirname, '../src/lib/data/sru-communes.json');

const csv = readFileSync(csvPath, 'utf-8');
const lines = csv.trim().split('\n');
const header = lines[0].split(',');

const years = [];
for (let y = 2004; y <= 2022; y++) years.push(String(y));

const result = {};

for (let i = 1; i < lines.length; i++) {
	const cols = lines[i].split(',');
	const row = {};
	for (let j = 0; j < header.length; j++) {
		row[header[j].trim()] = cols[j]?.trim() ?? '';
	}

	const cod = row.cod;
	if (!cod) continue;

	const entry = { category: row.category || '', years: {} };

	for (const y of years) {
		const social = parseFloat(row[`social_units_${y}`]) || 0;
		const total = parseFloat(row[`Total_unit_${y}`]) || 0;
		entry.years[y] = { social, total };
	}

	result[cod] = entry;
}

writeFileSync(outPath, JSON.stringify(result), 'utf-8');
console.log(`Written ${Object.keys(result).length} communes to ${outPath}`);
