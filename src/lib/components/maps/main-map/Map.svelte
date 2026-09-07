<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { asset } from '$app/paths';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol, PMTiles } from 'pmtiles';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from 'bits-ui';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { language } from '$lib/i18n';
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
	let filtersOpen = $state(false);

	let hoveredCommuneId: string | number | null = null;
	let hoveredDeptId: string | number | null = null;
	let communesSourceLayer = '';
	let regionsSourceLayer = '';
	let departementsSourceLayer = '';
	let usePmtiles = false;
	function localizedValue(value: string) {
		if (value.endsWith('€')) {
			const number = value.slice(0, -1);
			return $language === 'fr' ? `${number.replace(/(\d)\.(\d)/g, '$1,$2')} €` : `€${number}`;
		}
		return $language === 'fr' ? value.replace(/(\d)\.(\d)/g, '$1,$2').replace(/%/g, ' %') : value;
	}
	const timelineAccent = GRAPHICS_COLORS.primary;

	function choroplethWithHover() {
		return [
			'case',
			['boolean', ['feature-state', 'hover'], false],
			GRAPHICS_COLORS.focus,
			mapState.buildChoroplethExpression()
		] as unknown as maplibregl.ExpressionSpecification;
	}

	function flyTo(center: [number, number], zoom: number) {
		const compactOffset = mapContainer?.clientWidth < 640 ? 1.2 : 0;
		mapInstance?.flyTo({
			center,
			zoom: Math.max(3.4, zoom - compactOffset),
			duration: 1500
		});
	}

	async function toggleFilters() {
		filtersOpen = !filtersOpen;
		await tick();
		mapInstance?.resize();
	}

	function showMainland() {
		mapState.activeTerritory = 'mainland';
		mapState.activeRegion = null;
		flyTo(MAINLAND_CENTER, MAINLAND_ZOOM);
	}

	function showOverseas() {
		const firstRegion = OVERSEAS_REGIONS[0];
		mapState.activeTerritory = 'overseas';
		mapState.activeRegion = firstRegion.name;
		flyTo(firstRegion.center, firstRegion.zoom);
	}

	function featureStateSource(source: string, sourceLayer: string, id: string | number) {
		const obj: any = { source, id };
		if (usePmtiles) obj.sourceLayer = sourceLayer;
		return obj;
	}

	function applyChoropleth() {
		const map = mapInstance;
		if (!map) return;
		const expr = choroplethWithHover();

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

		const compactMap = mapContainer.clientWidth < 640;
		const map = new maplibregl.Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC&language=${$language}`,
			center: MAINLAND_CENTER,
			zoom: compactMap ? 3.8 : MAINLAND_ZOOM,
			attributionControl: false
		});
		map.addControl(new maplibregl.AttributionControl({ compact: true }));
		map.addControl(new maplibregl.NavigationControl());
		mapInstance = map;
		const resizeObserver = new ResizeObserver(() => map.resize());
		resizeObserver.observe(mapContainer);

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

			// Insert all data layers below the first basemap symbol layer so
			// toponyms render on top — the canonical MapLibre pattern.
			const firstSymbolId = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;

			// --- Communes layers (visible by default) ---
			map.addLayer(
				{
					id: 'communes-fill',
					type: 'fill',
					source: 'communes',
					...sl(communesSourceLayer),
					paint: {
						'fill-color': choroplethWithHover(),
						'fill-opacity': [
							'case',
							['boolean', ['feature-state', 'hover'], false],
							0.9,
							0.7
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
						'line-color': GRAPHICS_COLORS.grid,
						'line-width': 0.2,
						'line-opacity': 0.3
					}
				},
				firstSymbolId
			);

			// --- Departements layers (hidden by default) ---
			map.addLayer(
				{
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
				},
				firstSymbolId
			);

			map.addLayer(
				{
					id: 'departements-border',
					type: 'line',
					source: 'departements',
					...sl(departementsSourceLayer),
					layout: { visibility: 'none' },
					paint: {
						'line-color': GRAPHICS_COLORS.contextStrong,
						'line-width': 0.5,
						'line-opacity': 0.6
					}
				},
				firstSymbolId
			);

			// --- Regions border overlay ---
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
			resizeObserver.disconnect();
			map.remove();
			maplibregl.removeProtocol('pmtiles');
		};
	});
</script>

<div class="supply-map flex h-full min-h-100 w-full min-w-0 flex-col overflow-hidden border border-gray-200 md:flex-row">
	<button
		type="button"
		class="flex items-center justify-between border-0 border-b border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold md:hidden"
		aria-expanded={filtersOpen}
		onclick={toggleFilters}
	>
		<span class="flex items-center gap-2"><SlidersHorizontalIcon class="size-4" />{$language === 'fr' ? 'Filtres de la carte' : 'Map filters'}</span>
		<span class="text-xs font-normal text-gray-500">{filtersOpen ? ($language === 'fr' ? 'Masquer' : 'Hide') : ($language === 'fr' ? 'Afficher' : 'Show')}</span>
	</button>
	<div class={filtersOpen ? 'block min-w-0 md:contents' : 'hidden md:contents'}>
		<MapSidebar onflyto={flyTo} onupdate={handleSidebarUpdate} />
	</div>

	<!-- Map + Navigation -->
	<div class="relative flex min-h-100 min-w-0 flex-1 flex-col">
		<!-- Territory navigation bar -->
		<div class="territory-nav grid shrink-0 grid-cols-2 gap-1 border-b border-gray-200 bg-white p-1.5">
			{#if mapState.activeTerritory === 'overseas'}
				<Button
					variant="outline"
					size="sm"
					class="min-w-0"
					aria-label={$language === 'fr' ? 'Revenir à la vue d’ensemble du territoire' : 'Return to the territory overview'}
					onclick={showMainland}
				>
					<ArrowLeftIcon class="size-4" />
				</Button>
				{#each OVERSEAS_REGIONS as region (region.name)}
					<Button
						variant="outline"
						size="sm"
						class="min-w-0 whitespace-normal text-center"
						onclick={() => { mapState.activeRegion = region.name; flyTo(region.center, region.zoom); }}
					>
						{region.name}
					</Button>
				{/each}
			{:else}
				<Button
					variant="outline"
					size="sm"
					class="min-w-0 whitespace-normal text-center"
					onclick={showMainland}
				>
					{$language === 'fr' ? 'France métropolitaine' : 'Mainland'}
				</Button>
				<Button
					variant="outline"
					size="sm"
					class="min-w-0 whitespace-normal text-center"
					onclick={showOverseas}
				>
					{$language === 'fr' ? 'Outre-mer' : 'Overseas'}
				</Button>
			{/if}
		</div>
		<div bind:this={mapContainer} class="min-h-80 w-full min-w-0 flex-1"></div>

		<!-- Year slider bar -->
		<div class="border-t border-gray-200 bg-white px-4 py-2 shrink-0" class:opacity-40={mapState.yearSliderDisabled}>
			<Slider.Root
				aria-label={$language === 'fr' ? 'Année de la carte de l’offre' : 'Supply map year'}
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
						<Slider.Range class="absolute h-full" style={`background-color: ${timelineAccent};`} />
					</span>
					{#each thumbs as thumb (thumb)}
						<Slider.Thumb
							index={thumb}
							class="block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden"
							style={`border-color: ${timelineAccent}; --tw-ring-color: ${timelineAccent}4d;`}
						/>
					{/each}
				{/snippet}
			</Slider.Root>
			<div class="mt-1 flex justify-between sm:hidden">
				<span class="text-[10px] text-gray-400">{YEAR_MIN}</span>
				<span class="text-[10px] font-semibold" style:color={timelineAccent}>
					{mapState.activeYear}
				</span>
				<span class="text-[10px] text-gray-400">{YEAR_MAX}</span>
			</div>
			<div class="mt-0.5 hidden justify-between sm:flex">
				{#each YEARS as year (year)}
					<span
						class="text-[10px] text-gray-400"
						class:font-semibold={year === mapState.activeYear}
						style:color={year === mapState.activeYear ? timelineAccent : undefined}
					>
						{year}
					</span>
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
				<p class="text-gray-300">{localizedValue(mapState.tooltip.value)}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@media (max-width: 767.98px) {
		.supply-map {
			height: auto;
			min-height: 36rem;
		}

		.territory-nav :global(button) {
			min-height: 2.5rem;
			height: auto;
			line-height: 1.15;
		}
	}
</style>
