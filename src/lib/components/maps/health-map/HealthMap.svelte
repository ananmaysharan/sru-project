<script lang="ts">
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol, PMTiles } from 'pmtiles';
	import { Button } from '$lib/components/ui/button';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { language } from '$lib/i18n';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import MapSidebar from './MapSidebar.svelte';
	import {
		mapState as DEFAULT_MAP_STATE,
		MapState,
		COMMUNES_PMTILES_URL,
		REGIONS_PMTILES_URL,
		OVERSEAS_REGIONS,
		MAINLAND_CENTER,
		MAINLAND_ZOOM
	} from './map-state.svelte.js';

	let { mapState = DEFAULT_MAP_STATE }: { mapState?: MapState } = $props();

	let mapContainer: HTMLDivElement;
	let mapInstance: maplibregl.Map | null = $state(null);

	let hoveredCommuneId: string | number | null = null;
	let communesSourceLayer = '';
	let regionsSourceLayer = '';
	let usePmtiles = false;
	const metricLabelsFr: Record<string, string> = {
		'Median household income': 'Revenu médian des ménages',
		'Share of residents in poverty': 'Part des habitants vivant sous le seuil de pauvreté',
		'Older adult share (65+)': 'Part des personnes âgées de 65 ans ou plus',
		'Municipal political leadership': 'Orientation politique de l’exécutif municipal',
		'DPE energy-efficient building share (A-C)': 'Part des bâtiments énergétiquement performants selon le DPE (A–C)',
		'Urban heat island exposure': 'Exposition aux îlots de chaleur urbains',
		'Proximity to green spaces': 'Proximité des espaces verts',
		'Proximity to healthcare and hospital infrastructure': 'Proximité des services de santé et des établissements hospitaliers',
		'Social housing change': 'Évolution de la part de logement social'
	};
	function localizedLabel(value: string) { return $language === 'fr' ? metricLabelsFr[value] ?? value : value; }
	function localizedValue(value: string) { return $language === 'fr' ? value.replace(/(\d)\.(\d)/g, '$1,$2').replace(/%/g, ' %') : value; }

	function flyTo(center: [number, number], zoom: number) {
		mapInstance?.flyTo({ center, zoom, duration: 1500 });
	}

	function featureStateSource(source: string, sourceLayer: string, id: string | number) {
		const obj: any = { source, id };
		if (usePmtiles) obj.sourceLayer = sourceLayer;
		return obj;
	}

	function applyChoropleth() {
		const map = mapInstance;
		if (!map) return;
		const expr = mapState.buildChoroplethExpression() as maplibregl.ExpressionSpecification;

		if (map.getLayer('communes-fill')) {
			map.setPaintProperty('communes-fill', 'fill-color', expr);
		}
	}

	$effect(() => {
		applyChoropleth();
	});

	onMount(() => {
		const protocol = new Protocol();
		const regionsPmt = new PMTiles(REGIONS_PMTILES_URL);
		const communesPmt = new PMTiles(COMMUNES_PMTILES_URL);
		protocol.add(regionsPmt);
		protocol.add(communesPmt);
		maplibregl.addProtocol('pmtiles', protocol.tile);

		const map = new maplibregl.Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC&language=${$language}`,
			center: [2.2, 46.6],
			zoom: 5,
			attributionControl: false
		});
		map.addControl(new maplibregl.AttributionControl({ compact: true }));
		map.addControl(new maplibregl.NavigationControl());
		mapInstance = map;

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
					data: asset('/regions_2025_outre_mer.geojson'),
					promoteId: 'code'
				});
				map.addSource('communes', {
					type: 'geojson',
					data: asset('/communes_2022_outre_mer.geojson'),
					promoteId: 'code'
				});
			}

			const sl = (layer: string) => (usePmtiles ? { 'source-layer': layer } : {});

			map.setProjection({ type: 'globe' });

			// Insert all data layers below the first basemap symbol layer so
			// toponyms render on top — the canonical MapLibre pattern.
			const firstSymbolId = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;

			map.addLayer(
				{
					id: 'communes-fill',
					type: 'fill',
					source: 'communes',
					...sl(communesSourceLayer),
					paint: {
						'fill-color': mapState.buildChoroplethExpression() as maplibregl.ExpressionSpecification,
						'fill-opacity': [
							'case',
							['boolean', ['feature-state', 'hover'], false],
							0.95,
							0.78
						]
					}
				},
				firstSymbolId
			);

			map.addLayer(
				{
					id: 'communes-border',
					type: 'line',
					source: 'communes',
					...sl(communesSourceLayer),
					paint: {
						'line-color': [
							'case',
							['boolean', ['feature-state', 'hover'], false],
							GRAPHICS_COLORS.ink,
							GRAPHICS_COLORS.grid
						],
						'line-width': [
							'case',
							['boolean', ['feature-state', 'hover'], false],
							1.1,
							0.2
						],
						'line-opacity': [
							'case',
							['boolean', ['feature-state', 'hover'], false],
							0.9,
							0.3
						]
					}
				},
				firstSymbolId
			);

			map.addLayer(
				{
					id: 'regions-border',
					type: 'line',
					source: 'regions',
					...sl(regionsSourceLayer),
					paint: {
						'line-color': GRAPHICS_COLORS.grid,
						'line-width': 1
					}
				},
				firstSymbolId
			);

			map.on('mouseleave', 'communes-fill', () => {
				map.getCanvas().style.cursor = '';
				if (hoveredCommuneId !== null) {
					map.setFeatureState(
						featureStateSource('communes', communesSourceLayer, hoveredCommuneId),
						{ hover: false }
					);
					hoveredCommuneId = null;
				}
				mapState.tooltip = null;
			});

			map.on('mousemove', 'communes-fill', (e) => {
				if (!e.features?.length) return;
				const feat = e.features[0];
				const id = feat.id;
				if (id === undefined) return;

				const code = feat.properties.code;
				const info = mapState.getCommuneTooltip(code);
				const nextTooltip = info
					? {
							x: e.point.x,
							y: e.point.y,
							name: feat.properties.nom,
							metricLabel: info.metricLabel,
							metricValue: info.metricValue,
							socialHousingLabel: info.socialHousingLabel,
							socialHousingValue: info.socialHousingValue
						}
					: null;

				if (id === hoveredCommuneId) {
					mapState.tooltip = nextTooltip;
					return;
				}

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

				mapState.tooltip = nextTooltip;
			});
		});

		return () => {
			map.remove();
			maplibregl.removeProtocol('pmtiles');
		};
	});
</script>

<div class="flex flex-col md:flex-row h-full w-full min-h-100">
	<MapSidebar {mapState} onflyto={flyTo} />

	<div class="flex-1 flex flex-col border-t border-r border-b border-gray-200 relative min-h-100">
		<div class="border-b border-gray-200 bg-white flex items-center gap-1 p-1.5 shrink-0">
			{#if mapState.activeTerritory === 'overseas'}
				<Button
					variant="outline"
					size="sm"
					aria-label={$language === 'fr' ? 'Revenir à la vue d’ensemble du territoire' : 'Return to the territory overview'}
					onclick={() => { mapState.activeTerritory = null; mapState.activeRegion = null; }}
				>
					<ArrowLeftIcon class="size-4" />
				</Button>
				{#each OVERSEAS_REGIONS as region (region.name)}
					<Button
						variant="outline"
						size="sm"
						class="flex-1"
						onclick={() => { mapState.activeRegion = region.name; flyTo(region.center, region.zoom); }}
					>
						{region.name}
					</Button>
				{/each}
			{:else}
				<Button
					variant="outline"
					size="sm"
					class="flex-1"
					onclick={() => { mapState.activeTerritory = null; mapState.activeRegion = null; flyTo(MAINLAND_CENTER, MAINLAND_ZOOM); }}
				>
					{$language === 'fr' ? 'France métropolitaine' : 'Mainland'}
				</Button>
				<Button
					variant="outline"
					size="sm"
					class="flex-1"
					onclick={() => { mapState.activeTerritory = 'overseas'; mapState.activeRegion = null; }}
				>
					{$language === 'fr' ? 'Outre-mer' : 'Overseas'}
				</Button>
			{/if}
		</div>
		<div bind:this={mapContainer} class="flex-1 w-full"></div>

		{#if mapState.tooltip}
			<div
				class="absolute z-20 bg-gray-900 text-white rounded-md px-3 py-2 text-xs pointer-events-none shadow-lg"
				style="left:{mapState.tooltip.x + 12}px;top:{mapState.tooltip.y - 10}px"
			>
				<p class="font-semibold">{mapState.tooltip.name}</p>
				{#if mapState.tooltip.metricValue}
					<p class="mt-1 text-gray-200">
						{localizedLabel(mapState.tooltip.metricLabel)} : {localizedValue(mapState.tooltip.metricValue)}
					</p>
				{/if}
				{#if mapState.tooltip.socialHousingValue}
					<p class="text-gray-200">
						{localizedLabel(mapState.tooltip.socialHousingLabel)} : {localizedValue(mapState.tooltip.socialHousingValue)}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
