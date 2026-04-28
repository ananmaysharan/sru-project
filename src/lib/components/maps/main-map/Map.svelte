<script lang="ts">
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol, PMTiles } from 'pmtiles';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from 'bits-ui';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import MapSidebar from './MapSidebar.svelte';
	import {
		mapState,
		COMMUNES_PMTILES_URL,
		REGIONS_PMTILES_URL,
		DEPARTEMENTS_PMTILES_URL,
		OVERSEAS_REGIONS,
		MAINLAND_CENTER,
		MAINLAND_ZOOM,
		YEAR_MIN,
		YEAR_MAX,
		YEARS
	} from './map-state.svelte.js';

	let mapContainer: HTMLDivElement;
	let mapInstance: maplibregl.Map | null = $state(null);

	let hoveredCommuneId: string | number | null = null;
	let hoveredDeptId: string | number | null = null;
	let communesSourceLayer = '';
	let regionsSourceLayer = '';
	let departementsSourceLayer = '';
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

		if (mapState.activeTab === 'communes') {
			if (map.getLayer('communes-fill')) {
				map.setPaintProperty('communes-fill', 'fill-color', expr);
			}
		} else {
			if (map.getLayer('departements-fill')) {
				map.setPaintProperty('departements-fill', 'fill-color', expr);
			}
		}
	}

	function updateLayerVisibility() {
		const map = mapInstance;
		if (!map) return;

		const communesVisible = mapState.activeTab === 'communes';

		if (map.getLayer('communes-fill')) {
			map.setLayoutProperty('communes-fill', 'visibility', communesVisible ? 'visible' : 'none');
		}
		if (map.getLayer('communes-border')) {
			map.setLayoutProperty('communes-border', 'visibility', communesVisible ? 'visible' : 'none');
		}
		if (map.getLayer('departements-fill')) {
			map.setLayoutProperty('departements-fill', 'visibility', communesVisible ? 'none' : 'visible');
		}
		if (map.getLayer('departements-border')) {
			map.setLayoutProperty('departements-border', 'visibility', communesVisible ? 'none' : 'visible');
		}

		// Clear hover state on hidden layer
		if (communesVisible && hoveredDeptId !== null) {
			map.setFeatureState(
				featureStateSource('departements', departementsSourceLayer, hoveredDeptId),
				{ hover: false }
			);
			hoveredDeptId = null;
		} else if (!communesVisible && hoveredCommuneId !== null) {
			map.setFeatureState(
				featureStateSource('communes', communesSourceLayer, hoveredCommuneId),
				{ hover: false }
			);
			hoveredCommuneId = null;
		}
		mapState.tooltip = null;
	}

	function handleSidebarUpdate() {
		updateLayerVisibility();
		applyChoropleth();
	}

	onMount(() => {
		const protocol = new Protocol();
		const regionsPmt = new PMTiles(REGIONS_PMTILES_URL);
		const communesPmt = new PMTiles(COMMUNES_PMTILES_URL);
		const departementsPmt = new PMTiles(DEPARTEMENTS_PMTILES_URL);
		protocol.add(regionsPmt);
		protocol.add(communesPmt);
		protocol.add(departementsPmt);
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
				const [regionsMeta, communesMeta, departementsMeta] = await Promise.all([
					regionsPmt.getMetadata(),
					communesPmt.getMetadata(),
					departementsPmt.getMetadata()
				]);

				regionsSourceLayer = (regionsMeta as any).vector_layers[0].id;
				communesSourceLayer = (communesMeta as any).vector_layers[0].id;
				departementsSourceLayer = (departementsMeta as any).vector_layers[0].id;

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
				map.addSource('departements', {
					type: 'vector',
					url: `pmtiles://${DEPARTEMENTS_PMTILES_URL}`,
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
				map.addSource('departements', {
					type: 'geojson',
					data: asset('/departments_2022_outre_mer_100m.geojson'),
					promoteId: 'code'
				});
			}

			const sl = (layer: string) => (usePmtiles ? { 'source-layer': layer } : {});

			map.setProjection({ type: 'globe' });

			// --- Communes layers (visible by default) ---
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

			// --- Departements layers (hidden by default) ---
			map.addLayer({
				id: 'departements-fill',
				type: 'fill',
				source: 'departements',
				...sl(departementsSourceLayer),
				layout: { visibility: 'none' },
				paint: {
					'fill-color': 'transparent',
					'fill-opacity': [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						0.9,
						0.7
					]
				}
			});

			map.addLayer({
				id: 'departements-border',
				type: 'line',
				source: 'departements',
				...sl(departementsSourceLayer),
				layout: { visibility: 'none' },
				paint: {
					'line-color': '#9ca3af',
					'line-width': 0.5,
					'line-opacity': 0.6
				}
			});

			// --- Regions border overlay ---
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

			// --- Hover for communes ---
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
						value: info.value,
						label: info.label
					};
				} else {
					mapState.tooltip = null;
				}
			});

			// --- Hover for departements ---
			map.on('mouseleave', 'departements-fill', () => {
				map.getCanvas().style.cursor = '';
				if (hoveredDeptId !== null) {
					map.setFeatureState(
						featureStateSource('departements', departementsSourceLayer, hoveredDeptId),
						{ hover: false }
					);
					hoveredDeptId = null;
				}
				mapState.tooltip = null;
			});

			map.on('mousemove', 'departements-fill', (e) => {
				if (!e.features?.length) return;
				const feat = e.features[0];
				const id = feat.id;
				if (id === undefined) return;

				if (id === hoveredDeptId) {
					if (mapState.tooltip) {
						mapState.tooltip = { ...mapState.tooltip, x: e.point.x, y: e.point.y };
					}
					return;
				}

				if (hoveredDeptId !== null) {
					map.setFeatureState(
						featureStateSource('departements', departementsSourceLayer, hoveredDeptId),
						{ hover: false }
					);
				}
				hoveredDeptId = id;
				map.setFeatureState(
					featureStateSource('departements', departementsSourceLayer, id),
					{ hover: true }
				);

				const code = feat.properties.code;
				const info = mapState.getDeptTooltip(code);
				if (info) {
					mapState.tooltip = {
						x: e.point.x,
						y: e.point.y,
						name: info.name || feat.properties.nom,
						value: info.value,
						label: info.label
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
	<MapSidebar onflyto={flyTo} onupdate={handleSidebarUpdate} />

	<!-- Map + Navigation -->
	<div class="flex-1 flex flex-col border-t border-r border-b border-gray-200 relative min-h-100">
		<!-- Territory navigation bar -->
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

		<!-- Year slider bar -->
		<div class="border-t border-gray-200 bg-white px-4 py-2 shrink-0" class:opacity-40={mapState.yearSliderDisabled}>
			<Slider.Root
				type="single"
				min={YEAR_MIN}
				max={YEAR_MAX}
				step={1}
				bind:value={mapState.activeYear}
				onValueCommit={handleSidebarUpdate}
				disabled={mapState.yearSliderDisabled}
				class="relative flex w-full touch-none items-center select-none py-1"
			>
				{#snippet children({ thumbs })}
					<span class="bg-gray-200 relative h-1.5 w-full grow overflow-hidden rounded-full">
						<Slider.Range class="bg-[#8fa6aa] absolute h-full" />
					</span>
					{#each thumbs as thumb (thumb)}
						<Slider.Thumb
							index={thumb}
							class="border-[#8fa6aa] ring-[#8fa6aa]/30 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden"
						/>
					{/each}
				{/snippet}
			</Slider.Root>
			<div class="flex justify-between mt-0.5">
				{#each YEARS as year}
					<span class="text-[10px] text-gray-400" class:font-semibold={year === mapState.activeYear} class:text-gray-700={year === mapState.activeYear}>{year}</span>
				{/each}
			</div>
		</div>

		<!-- Hover tooltip -->
		{#if mapState.tooltip}
			<div
				class="absolute z-20 bg-gray-900 text-white rounded-md px-3 py-2 text-xs pointer-events-none shadow-lg"
				style="left:{mapState.tooltip.x + 12}px;top:{mapState.tooltip.y - 10}px"
			>
				<p class="font-semibold">{mapState.tooltip.name}</p>
				<p class="text-gray-300">{mapState.tooltip.value}</p>
			</div>
		{/if}
	</div>
</div>
