#!/usr/bin/env node
/**
 * Generates src/lib/data/commune-lookup.json from the full GeoJSON,
 * filtered to only communes present in sru-communes.json.
 * Each entry: { code, name, center: [lng, lat] }
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load SRU commune codes
const sruData = JSON.parse(readFileSync(join(root, 'src/lib/data/sru-communes.json'), 'utf8'));
const sruCodes = new Set(Object.keys(sruData));
console.log(`SRU communes: ${sruCodes.size}`);

// Load GeoJSON (trim trailing garbage character)
let raw = readFileSync(join(root, 'static/communes_2022_outre_mer.geojson'), 'utf8');
const lastBrace = raw.lastIndexOf('}');
raw = raw.slice(0, lastBrace + 1);
const geojson = JSON.parse(raw);
console.log(`GeoJSON features: ${geojson.features.length}`);

function centroid(geometry) {
  let coords;
  if (geometry.type === 'Polygon') {
    coords = geometry.coordinates[0]; // outer ring
  } else if (geometry.type === 'MultiPolygon') {
    // Use the largest polygon's outer ring
    let maxLen = 0;
    for (const poly of geometry.coordinates) {
      if (poly[0].length > maxLen) {
        maxLen = poly[0].length;
        coords = poly[0];
      }
    }
  } else {
    return null;
  }

  let sumLng = 0, sumLat = 0;
  for (const [lng, lat] of coords) {
    sumLng += lng;
    sumLat += lat;
  }
  const n = coords.length;
  return [Math.round(sumLng / n * 100000) / 100000, Math.round(sumLat / n * 100000) / 100000];
}

const lookup = [];
for (const feature of geojson.features) {
  const code = feature.properties.code;
  if (!sruCodes.has(code)) continue;
  const center = centroid(feature.geometry);
  if (!center) continue;
  lookup.push({ code, name: feature.properties.nom, center });
}

lookup.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

console.log(`Matched communes: ${lookup.length}`);

const outPath = join(root, 'src/lib/data/commune-lookup.json');
writeFileSync(outPath, JSON.stringify(lookup));
console.log(`Written to ${outPath} (${(Buffer.byteLength(JSON.stringify(lookup)) / 1024).toFixed(1)} KB)`);
