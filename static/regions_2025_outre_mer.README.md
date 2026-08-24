# Overseas territory outlines

`regions_2025_outre_mer.geojson` contains one dissolved outline for each of the
eleven French overseas territories used by the site.

## Source

- Dataset: [Contours administratifs](https://www.data.gouv.fr/datasets/contours-administratifs)
- Publisher: data.gouv.fr
- Download: [communes-5m.geojson.gz](https://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/communes-5m.geojson.gz)
- Downloaded: 2026-08-20
- Source SHA-256: `0a315fa7707bd66c779e703a2de2d5ab88e53303df02e1aabde5071f7230a362`
- License: ODbL

The national dataset combines IGN Admin Express for metropolitan France and
the DROMs with OpenStreetMap for most COMs. French Polynesia comes from the
territory's administrative-geography dataset, and New Caledonia comes from its
official GeoRep data.

## Processing

The 5 m commune layer was filtered to commune-code prefixes `971`, `972`,
`973`, `974`, `975`, `976`, `977`, `978`, `986`, `987`, and `988`. Communes
were dissolved by prefix into territory outlines. The result was simplified to
5% with Mapshaper's weighted method and `keep-shapes`, then exported in WGS84
with six-decimal coordinate precision. `keep-shapes` prevents small islands
from disappearing during simplification.

Generated asset SHA-256:
`d68899d78c1bd27a9075a21c04e25a91a57e5a3e2bb33c2cfa472a848ddf00b0`

The resulting feature properties are limited to `code` and `nom`, preserving
the interface expected by the map and small-multiple components.
