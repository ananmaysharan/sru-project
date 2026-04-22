<script lang="ts">
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol, PMTiles } from 'pmtiles';
	import { Button } from '$lib/components/ui/button';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import MapSidebar from './MapSidebar.svelte';
	import {
		mapState,
		COMMUNES_PMTILES_URL,
		REGIONS_PMTILES_URL,
		OVERSEAS_REGIONS,
		MAINLAND_CENTER,
		MAINLAND_ZOOM
	} from './map-state.svelte.js';

	let mapContainer: HTMLDivElement;
	let mapInstance: maplibregl.Map | null = $state(null);

	let hoveredCommuneId: string | number | null = null;
	let communesSourceLayer = '';
	let regionsSourceLayer = '';
	let usePmtiles = false;

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
			style: 'https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC',
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

			map.addLayer({
				id: 'communes-fill',
				type: 'fill',
				source: 'communes',
				...sl(communesSourceLayer),
				paint: {
					'fill-color': mapState.buildChoroplethExpression() as maplibregl.ExpressionSpecification,
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
				paint: {
					'line-color': '#d1d5db',
					'line-width': 0.2,
					'line-opacity': 0.3
				}
			});

			map.addLayer({
				id: 'regions-border',
				type: 'line',
				source: 'regions',
				...sl(regionsSourceLayer),
				paint: {
					'line-color': '#ddd',
					'line-width': 1
				}
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
				mapState.tooltip = null;
			});

			map.on('mousemove', 'communes-fill', (e) => {
				if (!e.features?.length) return;
				const feat = e.features[0];
				const id = feat.id;
				if (id === undefined) return;

				if (id === hoveredCommuneId) {
					if (mapState.tooltip) {
						mapState.tooltip = { ...mapState.tooltip, x: e.point.x, y: e.point.y };
					}
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

				const code = feat.properties.code;
				const info = mapState.getCommuneTooltip(code);
				if (info) {
					mapState.tooltip = {
						x: e.point.x,
						y: e.point.y,
						name: feat.properties.nom,
						value: '',
						label: ''
					};
				} else {
					mapState.tooltip = null;
				}
			});
		});

		return () => {
			map.remove();
			maplibregl.removeProtocol('pmtiles');
		};
	});
</script>

<div class="flex flex-col md:flex-row h-full w-full min-h-100">
	<MapSidebar onflyto={flyTo} />

	<div class="flex-1 flex flex-col border-t border-r border-b border-gray-200 relative min-h-100">
		<div class="border-b border-gray-200 bg-white flex items-center gap-1 p-1.5 shrink-0">
			{#if mapState.activeTerritory === 'overseas'}
				<Button
					variant="outline"
					size="sm"
					onclick={() => { mapState.activeTerritory = null; mapState.activeRegion = null; }}
				>
					<ArrowLeftIcon class="size-4" />
				</Button>
				{#each OVERSEAS_REGIONS as region}
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
					Mainland
				</Button>
				<Button
					variant="outline"
					size="sm"
					class="flex-1"
					onclick={() => { mapState.activeTerritory = 'overseas'; mapState.activeRegion = null; }}
				>
					Overseas
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
			</div>
		{/if}
	</div>
</div>
