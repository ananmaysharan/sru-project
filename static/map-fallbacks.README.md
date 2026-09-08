# Map fallback files

The interactive maps normally use the official remote PMTiles sources. These local GeoJSON files are loaded only when PMTiles metadata cannot be reached:

- `communes_2022_sru.geojson` contains only commune boundaries that have records in `src/lib/data/map/sru-communes.json`.
- `departments_2022_outre_mer_100m.geojson` contains the nationwide 2022 department boundaries.
- `regions_2025_outre_mer.geojson` contains the current region boundaries described in its separate README.

Regenerate the 2022 files with `npm run build-map-fallbacks`. The script downloads the official gzipped GeoJSON files from Etalab and filters the commune file before writing it to `static`.
