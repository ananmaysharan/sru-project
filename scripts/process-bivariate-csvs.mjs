import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const HOME = process.env.HOME || '';
const DPE_CSV = join(HOME, 'Downloads/dpe_social_bivariate.csv');
const HEAT_CSV = join(HOME, 'Downloads/heat_islands_bivariate.csv');
const TARGET = join(ROOT, 'src/lib/data/map/health-communes-bivariate.json');

const X_LABELS = { A: 0, B: 1, C: 2 };
const Y_LABELS = { 1: 0, 2: 1, 3: 2 };

function parseCsv(text) {
	const lines = text.trim().split(/\r?\n/);
	const header = lines.shift().split(',');
	return lines.map((line) => {
		const values = line.split(',');
		const row = {};
		header.forEach((h, i) => (row[h] = values[i]));
		return row;
	});
}

function toCellRecord(cell) {
	if (!cell || cell === 'NA' || cell.length !== 2) return null;
	const x = cell[0];
	const y = cell[1];
	if (!(x in X_LABELS) || !(y in Y_LABELS)) return null;
	return {
		cell,
		x_bin: X_LABELS[x],
		y_bin: Y_LABELS[y],
		x_label: x,
		y_label: y
	};
}

async function main() {
	const existing = JSON.parse(await readFile(TARGET, 'utf-8'));

	const dpeRows = parseCsv(await readFile(DPE_CSV, 'utf-8'));
	const heatRows = parseCsv(await readFile(HEAT_CSV, 'utf-8'));

	let dpeAdded = 0;
	let heatAdded = 0;

	for (const row of dpeRows) {
		const code = row.INSEE_C?.padStart(5, '0');
		const record = toCellRecord(row.bivariate_dpe_social);
		if (!code || !record) continue;
		existing[code] ??= { years: {} };
		existing[code].years ??= {};
		existing[code].years['2021'] ??= {};
		existing[code].years['2021'].dpe = record;
		dpeAdded++;
	}

	for (const row of heatRows) {
		const code = row.INSEE_C?.padStart(5, '0');
		const record = toCellRecord(row.bivariate_hot_social);
		if (!code || !record) continue;
		existing[code] ??= { years: {} };
		existing[code].years ??= {};
		existing[code].years['2017'] ??= {};
		existing[code].years['2017'].heat = record;
		heatAdded++;
	}

	await writeFile(TARGET, JSON.stringify(existing, null, 2) + '\n');
	console.log(`DPE entries added: ${dpeAdded}`);
	console.log(`Heat-island entries added: ${heatAdded}`);
	console.log(`Wrote → ${TARGET}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
