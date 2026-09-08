#!/usr/bin/env node

import {gunzipSync} from 'node:zlib';
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(scriptDirectory, '..');
const staticDirectory = join(projectRoot, 'static');
const sourceBase = 'https://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2022/geojson';

async function downloadGzippedGeoJson(filename) {
    const url = `${sourceBase}/${filename}.gz`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Could not download ${url}: ${response.status} ${response.statusText}`);
    return JSON.parse(gunzipSync(Buffer.from(await response.arrayBuffer())).toString('utf8'));
}

const sruData = JSON.parse(
    readFileSync(join(projectRoot, 'src/lib/data/map/sru-communes.json'), 'utf8'),
);
const sruCodes = new Set(Object.keys(sruData));

console.log('Downloading official 2022 administrative boundaries...');
const [allCommunes, departments] = await Promise.all([
    downloadGzippedGeoJson('communes-50m.geojson'),
    downloadGzippedGeoJson('departements-100m.geojson'),
]);

const communeFeatures = allCommunes.features.filter((feature) =>
    sruCodes.has(String(feature.properties?.code)),
);
const matchedCodes = new Set(communeFeatures.map((feature) => String(feature.properties.code)));
const missingCodes = [...sruCodes].filter((code) => !matchedCodes.has(code));

if (communeFeatures.length === 0) throw new Error('The filtered commune fallback is empty.');
if (!Array.isArray(departments.features) || departments.features.length < 100) {
    throw new Error('The department fallback does not contain the expected nationwide coverage.');
}

const filteredCommunes = {type: 'FeatureCollection', features: communeFeatures};
const communeOutput = join(staticDirectory, 'communes_2022_sru.geojson');
const departmentOutput = join(staticDirectory, 'departments_2022_outre_mer_100m.geojson');
writeFileSync(communeOutput, `${JSON.stringify(filteredCommunes)}\n`);
writeFileSync(departmentOutput, `${JSON.stringify(departments)}\n`);

const sizeMiB = (value) => (Buffer.byteLength(JSON.stringify(value)) / 1024 / 1024).toFixed(2);
console.log(`Wrote ${communeFeatures.length} SRU commune boundaries (${sizeMiB(filteredCommunes)} MiB).`);
console.log(`Wrote ${departments.features.length} department boundaries (${sizeMiB(departments)} MiB).`);
if (missingCodes.length > 0) {
    console.log(`${missingCodes.length} SRU data codes have no matching feature in the official 2022 boundary file.`);
}
