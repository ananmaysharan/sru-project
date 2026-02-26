<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol, PMTiles } from 'pmtiles';
	import sruData from '$lib/data/sru-communes.json';

	interface Props {
		onSelect?: (name: string, type: 'region' | 'commune') => void;
	}

	let { onSelect }: Props = $props();

	let mapContainer: HTMLDivElement;
	let activeLayer: 'regions' | 'communes' = $state('regions');
	let activeMetric: 'rate' | 'units' = $state('rate');
	let mapInstance: maplibregl.Map | null = $state(null);
	let tooltip: { x: number; y: number; name: string; rate: string; units: string } | null =
		$state(null);

	const COMMUNES_PMTILES_URL =
		'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/16395d00-80e7-47d4-9a56-68718a2c1682.pmtiles';
	const REGIONS_PMTILES_URL =
		'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/36a02713-e1cf-45bc-8124-a43588c50443.pmtiles';

	const YEAR = '2022';

	// Color scale breakpoints
	const RATE_BREAKS = [0, 5, 10, 15, 20, 25, 30];
	const RATE_COLORS = ['#f7fbff', '#c6dbef', '#6baed6', '#3182bd', '#1d6aaf', '#08519c', '#08306b'];
	const UNITS_BREAKS = [0, 50, 200, 500, 1000, 3000, 5000];
	const UNITS_COLORS = ['#f7fbff', '#c6dbef', '#6baed6', '#3182bd', '#1d6aaf', '#08519c', '#08306b'];

	// Track hovered feature IDs for feature-state approach
	let hoveredRegionId: string | number | null = null;
	let hoveredCommuneId: string | number | null = null;
	let communesSourceLayer = '';
	let regionsSourceLayer = '';
	let usePmtiles = false;

	function buildChoroplethExpression(metric: 'rate' | 'units'): maplibregl.ExpressionSpecification {
		const data = sruData as Record<string, { category: string; years: Record<string, { social: number; total: number }> }>;

		// Build a match that returns a numeric value, then wrap in step for color
		const valueExpr: any[] = ['match', ['get', 'code']];
		for (const [code, info] of Object.entries(data)) {
			const yearData = info.years[YEAR];
			if (!yearData) continue;
			const value = metric === 'rate'
				? (yearData.total > 0 ? (yearData.social / yearData.total) * 100 : 0)
				: yearData.social;
			valueExpr.push(code, value);
		}
		valueExpr.push(0); // fallback value

		const breaks = metric === 'rate' ? RATE_BREAKS : UNITS_BREAKS;
		const colors = metric === 'rate' ? RATE_COLORS : UNITS_COLORS;

		// Use step expression — more efficient than match returning color strings
		const stepExpr: any[] = ['step', valueExpr, colors[0]];
		for (let i = 1; i < breaks.length; i++) {
			stepExpr.push(breaks[i], colors[i]);
		}

		return stepExpr as maplibregl.ExpressionSpecification;
	}

	function setLayerVisibility(map: maplibregl.Map, layer: 'regions' | 'communes') {
		const regionLayers = ['regions-fill', 'regions-border'];
		const communeLayers = ['communes-fill', 'communes-border'];

		for (const id of regionLayers) {
			if (map.getLayer(id)) {
				map.setLayoutProperty(id, 'visibility', layer === 'regions' ? 'visible' : 'none');
			}
		}
		for (const id of communeLayers) {
			if (map.getLayer(id)) {
				map.setLayoutProperty(id, 'visibility', layer === 'communes' ? 'visible' : 'none');
			}
		}
	}

	function switchLayer(layer: 'regions' | 'communes') {
		activeLayer = layer;
		if (!mapInstance) return;
		setLayerVisibility(mapInstance, layer);
		if (layer === 'communes') {
			applyChoropleth(mapInstance, activeMetric);
		}
	}

	function switchMetric(metric: 'rate' | 'units') {
		activeMetric = metric;
		if (!mapInstance || activeLayer !== 'communes') return;
		applyChoropleth(mapInstance, metric);
	}

	function applyChoropleth(map: maplibregl.Map, metric: 'rate' | 'units') {
		if (map.getLayer('communes-fill')) {
			map.setPaintProperty('communes-fill', 'fill-color', buildChoroplethExpression(metric));
		}
	}

	function getSruInfo(code: string): { rate: string; units: string } | null {
		const data = sruData as Record<string, { category: string; years: Record<string, { social: number; total: number }> }>;
		const info = data[code];
		if (!info) return null;
		const yearData = info.years[YEAR];
		if (!yearData) return null;
		const rate = yearData.total > 0 ? ((yearData.social / yearData.total) * 100).toFixed(1) : '0.0';
		return { rate: `${rate}%`, units: yearData.social.toLocaleString() };
	}

	function featureStateSource(source: string, sourceLayer: string, id: string | number) {
		const obj: any = { source, id };
		if (usePmtiles) obj.sourceLayer = sourceLayer;
		return obj;
	}

	function fitBoundsToFeature(map: maplibregl.Map, feature: maplibregl.MapGeoJSONFeature) {
		const geojson = feature.geometry as GeoJSON.Geometry;
		const bounds = new maplibregl.LngLatBounds();
		const addCoords = (coords: number[][]) => {
			for (const c of coords) bounds.extend(c as [number, number]);
		};
		if (geojson.type === 'Polygon') {
			for (const ring of geojson.coordinates) addCoords(ring);
		} else if (geojson.type === 'MultiPolygon') {
			for (const poly of geojson.coordinates)
				for (const ring of poly) addCoords(ring);
		}
		map.fitBounds(bounds, { padding: 40, duration: 800 });
	}

	onMount(() => {
		// Share PMTiles instances between metadata fetching and protocol tile serving
		const protocol = new Protocol();
		const regionsPmt = new PMTiles(REGIONS_PMTILES_URL);
		const communesPmt = new PMTiles(COMMUNES_PMTILES_URL);
		protocol.add(regionsPmt);
		protocol.add(communesPmt);
		maplibregl.addProtocol('pmtiles', protocol.tile);

		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC',
			center: [2.2, 46.6],
			zoom: 5
		});

		mapInstance = map;

		map.addControl(new maplibregl.NavigationControl());

		map.on('load', async () => {
			try {
				const [regionsMeta, communesMeta] = await Promise.all([
					regionsPmt.getMetadata(),
					communesPmt.getMetadata()
				]);

				regionsSourceLayer = (regionsMeta as any).vector_layers[0].id;
				communesSourceLayer = (communesMeta as any).vector_layers[0].id;

				map.addSource('regions', {
					type: 'vector',
					url: `pmtiles://${REGIONS_PMTILES_URL}`,
					promoteId: 'code'
				});

				map.addSource('communes', {
					type: 'vector',
					url: `pmtiles://${COMMUNES_PMTILES_URL}`,
					promoteId: 'code'
				});

				usePmtiles = true;
			} catch (e) {
				console.warn('PMTiles failed to load, falling back to GeoJSON', e);
				map.addSource('regions', {
					type: 'geojson',
					data: '/regions_2025_outre_mer.geojson',
					promoteId: 'code'
				});

				map.addSource('communes', {
					type: 'geojson',
					data: '/communes_2022_outre_mer.geojson',
					promoteId: 'code'
				});
			}

			const sl = (layer: string) => (usePmtiles ? { 'source-layer': layer } : {});

			// --- Regions layers (no separate hover layer — use feature-state) ---
			map.addLayer({
				id: 'regions-fill',
				type: 'fill',
				source: 'regions',
				...sl(regionsSourceLayer),
				paint: {
					'fill-color': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						'#3b82f6',
						'#3b82f6'
					],
					'fill-opacity': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						0.35,
						0.15
					]
				}
			});

			map.addLayer({
				id: 'regions-border',
				type: 'line',
				source: 'regions',
				...sl(regionsSourceLayer),
				paint: {
					'line-color': '#3b82f6',
					'line-width': 1
				}
			});

			// --- Communes layers (no separate hover layer — use feature-state for opacity) ---
			map.addLayer({
				id: 'communes-fill',
				type: 'fill',
				source: 'communes',
				...sl(communesSourceLayer),
				layout: { visibility: 'none' },
				paint: {
					'fill-color': '#8b5cf6',
					'fill-opacity': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						0.9,
						0.7
					]
				}
			});

			map.addLayer({
				id: 'communes-border',
				type: 'line',
				source: 'communes',
				...sl(communesSourceLayer),
				layout: { visibility: 'none' },
				paint: {
					'line-color': '#d1d5db',
					'line-width': 0.2,
					'line-opacity': 0.3
				}
			});

			// --- Hover for regions using feature-state ---
			map.on('mouseenter', 'regions-fill', () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', 'regions-fill', () => {
				map.getCanvas().style.cursor = '';
				if (hoveredRegionId !== null) {
					map.setFeatureState(
						featureStateSource('regions', regionsSourceLayer, hoveredRegionId),
						{ hover: false }
					);
					hoveredRegionId = null;
				}
			});
			map.on('mousemove', 'regions-fill', (e) => {
				if (!e.features?.length) return;
				const feat = e.features[0];
				const id = feat.id;
				if (id === undefined || id === hoveredRegionId) return; // same feature guard
				// Clear previous
				if (hoveredRegionId !== null) {
					map.setFeatureState(
						featureStateSource('regions', regionsSourceLayer, hoveredRegionId),
						{ hover: false }
					);
				}
				hoveredRegionId = id;
				map.setFeatureState(
					featureStateSource('regions', regionsSourceLayer, id),
					{ hover: true }
				);
			});

			// --- Hover for communes using feature-state ---
			map.on('mouseenter', 'communes-fill', () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			map.on('mouseleave', 'communes-fill', () => {
				map.getCanvas().style.cursor = '';
				if (hoveredCommuneId !== null) {
					map.setFeatureState(
						featureStateSource('communes', communesSourceLayer, hoveredCommuneId),
						{ hover: false }
					);
					hoveredCommuneId = null;
				}
				tooltip = null;
			});
			map.on('mousemove', 'communes-fill', (e) => {
				if (!e.features?.length) return;
				const feat = e.features[0];
				const id = feat.id;
				if (id === undefined) return;

				// Same-feature guard: skip if still on same commune
				if (id === hoveredCommuneId) {
					// Still update tooltip position
					tooltip = tooltip ? { ...tooltip, x: e.point.x, y: e.point.y } : null;
					return;
				}

				// Clear previous hover
				if (hoveredCommuneId !== null) {
					map.setFeatureState(
						featureStateSource('communes', communesSourceLayer, hoveredCommuneId),
						{ hover: false }
					);
				}
				hoveredCommuneId = id;
				map.setFeatureState(
					featureStateSource('communes', communesSourceLayer, id),
					{ hover: true }
				);

				// Update tooltip
				const code = feat.properties.code;
				const sru = getSruInfo(code);
				if (sru) {
					tooltip = {
						x: e.point.x,
						y: e.point.y,
						name: feat.properties.nom,
						rate: sru.rate,
						units: sru.units
					};
				} else {
					tooltip = null;
				}
			});

			// --- Click: zoom into region ---
			map.on('click', 'regions-fill', (e) => {
				if (!e.features || e.features.length === 0) return;
				const feature = e.features[0];
				onSelect?.(feature.properties.nom, 'region');
				fitBoundsToFeature(map, feature);
			});

			// --- Click: zoom into commune ---
			map.on('click', 'communes-fill', (e) => {
				if (!e.features || e.features.length === 0) return;
				const feature = e.features[0];
				onSelect?.(feature.properties.nom, 'commune');
				fitBoundsToFeature(map, feature);
			});
		});

		return () => {
			map.remove();
			maplibregl.removeProtocol('pmtiles');
		};
	});
</script>

<div class="relative h-full w-full min-h-[400px]">
	<div bind:this={mapContainer} class="h-full w-full"></div>

	<!-- Toggle: Regions / Communes -->
	<div class="absolute top-3 left-3 z-10 flex flex-col items-start gap-2">
		<div class="bg-white rounded-lg shadow-md inline-flex text-sm font-medium">
			<button
				class="px-3 py-1.5 transition-colors rounded-l-lg {activeLayer === 'regions'
					? 'bg-black text-white'
					: 'text-gray-500 hover:bg-gray-100'}"
				onclick={() => switchLayer('regions')}
			>
				Regions
			</button>
			<button
				class="px-3 py-1.5 transition-colors rounded-r-lg {activeLayer === 'communes'
					? 'bg-black text-white'
					: 'text-gray-500 hover:bg-gray-100'}"
				onclick={() => switchLayer('communes')}
			>
				Communes
			</button>
		</div>

		<!-- Metric switch (only in commune mode) -->
		{#if activeLayer === 'communes'}
			<div class="bg-white rounded-lg shadow-md inline-flex text-xs font-medium">
				<button
					class="px-2.5 py-1 transition-colors rounded-l-lg {activeMetric === 'rate'
						? 'bg-black text-white'
						: 'text-gray-500 hover:bg-gray-100'}"
					onclick={() => switchMetric('rate')}
				>
					SRU Rate (%)
				</button>
				<button
					class="px-2.5 py-1 transition-colors rounded-r-lg {activeMetric === 'units'
						? 'bg-black text-white'
						: 'text-gray-500 hover:bg-gray-100'}"
					onclick={() => switchMetric('units')}
				>
					Social Units
				</button>
			</div>
		{/if}
	</div>

	<!-- Legend (only in commune mode) -->
	{#if activeLayer === 'communes'}
		<div class="absolute bottom-6 left-3 z-10 bg-white/95 rounded-lg shadow-md p-3 text-xs">
			<p class="font-semibold text-gray-700 mb-1.5">
				{activeMetric === 'rate' ? 'SRU Rate (%)' : 'Social Units'}
			</p>
			<div class="flex flex-col gap-0.5">
				{#each activeMetric === 'rate' ? RATE_BREAKS : UNITS_BREAKS as breakpoint, i (breakpoint)}
					{@const colors = activeMetric === 'rate' ? RATE_COLORS : UNITS_COLORS}
					{@const breaks = activeMetric === 'rate' ? RATE_BREAKS : UNITS_BREAKS}
					<div class="flex items-center gap-1.5">
						<span
							class="w-4 h-3 rounded-sm inline-block border border-gray-200"
							style="background:{colors[i]}"
						></span>
						<span class="text-gray-600">
							{#if i === breaks.length - 1}
								≥ {breakpoint}{activeMetric === 'rate' ? '%' : ''}
							{:else}
								{breakpoint}{activeMetric === 'rate' ? '%' : ''} – {breaks[i + 1]}{activeMetric === 'rate' ? '%' : ''}
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Hover tooltip (commune mode only) -->
	{#if tooltip && activeLayer === 'communes'}
		<div
			class="absolute z-20 bg-gray-900 text-white rounded-md px-3 py-2 text-xs pointer-events-none shadow-lg"
			style="left:{tooltip.x + 12}px;top:{tooltip.y - 10}px"
		>
			<p class="font-semibold">{tooltip.name}</p>
			<p class="text-gray-300">Rate: {tooltip.rate}</p>
			<p class="text-gray-300">Units: {tooltip.units}</p>
		</div>
	{/if}
</div>
