<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol, PMTiles } from 'pmtiles';
	import sruData from '$lib/data/sru-communes.json';
	import { Button } from '$lib/components/ui/button';
	import { Combobox, Slider } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import * as Select from '$lib/components/ui/select';
	import communeLookup from '$lib/data/commune-lookup.json';
	const OVERSEAS_REGIONS = [
		{ name: 'Guadeloupe', center: [-61.40, 16.18] as [number, number], zoom: 8 },
		{ name: 'Martinique', center: [-61.03, 14.64] as [number, number], zoom: 10 },
		{ name: 'Guyane', center: [-53.11, 3.93] as [number, number], zoom: 7},
		{ name: 'La Réunion', center: [55.53, -21.13] as [number, number], zoom: 8 },
		{ name: 'Mayotte', center: [45.17, -12.84] as [number, number], zoom: 10 },
	];
	const MAINLAND_CENTER: [number, number] = [2.2, 46.6];
	const MAINLAND_ZOOM = 5;

	const REGION_LOOKUP: { name: string; center: [number, number]; zoom: number }[] = [
		{ name: 'Auvergne-Rhône-Alpes', center: [4.5, 45.5], zoom: 7 },
		{ name: 'Bourgogne-Franche-Comté', center: [5.0, 47.0], zoom: 7 },
		{ name: 'Bretagne', center: [-3.0, 48.2], zoom: 7 },
		{ name: 'Centre-Val de Loire', center: [1.7, 47.5], zoom: 7 },
		{ name: 'Corse', center: [9.1, 42.1], zoom: 8 },
		{ name: 'Grand Est', center: [5.7, 48.6], zoom: 7 },
		{ name: 'Hauts-de-France', center: [2.8, 49.9], zoom: 7 },
		{ name: 'Île-de-France', center: [2.5, 48.8], zoom: 9 },
		{ name: 'Normandie', center: [-0.4, 49.0], zoom: 7 },
		{ name: 'Nouvelle-Aquitaine', center: [0.5, 45.5], zoom: 7 },
		{ name: 'Occitanie', center: [2.5, 43.7], zoom: 7 },
		{ name: 'Pays de la Loire', center: [-1.0, 47.5], zoom: 7 },
		{ name: "Provence-Alpes-Côte d'Azur", center: [5.8, 43.9], zoom: 7 },
		...OVERSEAS_REGIONS.map(r => ({ name: r.name, center: r.center, zoom: r.zoom })),
	];

	let searchQuery = $state('');
	let searchOpen = $state(false);
	let searchValue = $state<string | undefined>(undefined);

	let filteredRegions = $derived(
		searchQuery.length >= 2
			? REGION_LOOKUP.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
			: []
	);
	let filteredCommunes = $derived(
		searchQuery.length >= 2
			? communeLookup.filter((c: { name: string; code: string }) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.includes(searchQuery)).slice(0, 20)
			: []
	);

	let mapContainer: HTMLDivElement;
	let activeMetric: 'rate' | 'units' = $state('rate');
	let activeTerritory: 'mainland' | 'overseas' | null = $state(null);
	let activeRegion: string | null = $state(null);
	let mapInstance: maplibregl.Map | null = $state(null);
	let tooltip: { x: number; y: number; name: string; rate: string; units: string } | null =
		$state(null);

	const COMMUNES_PMTILES_URL =
		'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/16395d00-80e7-47d4-9a56-68718a2c1682.pmtiles';
	const REGIONS_PMTILES_URL =
		'https://object.files.data.gouv.fr/hydra-pmtiles/hydra-pmtiles/36a02713-e1cf-45bc-8124-a43588c50443.pmtiles';

	let activeYear = $state(2022);
	const YEAR_MIN = 2004;
	const YEAR_MAX = 2022;
	const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i);

	// Color scale breakpoints
	const RATE_BREAKS = [0, 5, 10, 15, 20, 25, 30];
	const RATE_COLORS = ['#f7fbff', '#c6dbef', '#6baed6', '#3182bd', '#1d6aaf', '#08519c', '#08306b'];
	const UNITS_BREAKS = [0, 50, 200, 500, 1000, 3000, 5000];
	const UNITS_COLORS = ['#f7fbff', '#c6dbef', '#6baed6', '#3182bd', '#1d6aaf', '#08519c', '#08306b'];

	// Track hovered feature ID for feature-state approach
	let hoveredCommuneId: string | number | null = null;
	let communesSourceLayer = '';
	let regionsSourceLayer = '';
	let usePmtiles = false;

	function buildChoroplethExpression(metric: 'rate' | 'units'): maplibregl.ExpressionSpecification {
		const data = sruData as Record<string, { category: string; years: Record<string, { social: number; total: number }> }>;
		const breaks = metric === 'rate' ? RATE_BREAKS : UNITS_BREAKS;
		const colors = metric === 'rate' ? RATE_COLORS : UNITS_COLORS;

		function valueToColor(value: number): string {
			for (let i = breaks.length - 1; i >= 1; i--) {
				if (value >= breaks[i]) return colors[i];
			}
			return colors[0];
		}

		// Match on commune code, return color directly; unmatched communes get transparent
		const expr: any[] = ['match', ['get', 'code']];
		for (const [code, info] of Object.entries(data)) {
			const yearData = info.years[String(activeYear)];
			if (!yearData) continue;
			const value = metric === 'rate'
				? (yearData.total > 0 ? (yearData.social / yearData.total) * 100 : 0)
				: yearData.social;
			expr.push(code, valueToColor(value));
		}
		expr.push('transparent'); // fallback for communes not in the dataset

		return expr as maplibregl.ExpressionSpecification;
	}

	function flyTo(center: [number, number], zoom: number) {
		mapInstance?.flyTo({ center, zoom, duration: 1500 });
	}

	function switchMetric(metric: 'rate' | 'units') {
		activeMetric = metric;
		if (!mapInstance) return;
		applyChoropleth(mapInstance, metric);
	}

	function applyChoropleth(map: maplibregl.Map, metric: 'rate' | 'units') {
		if (map.getLayer('communes-fill')) {
			map.setPaintProperty('communes-fill', 'fill-color', buildChoroplethExpression(metric));
		}
	}

	function updateChoropleth() {
		if (mapInstance && mapInstance.getLayer('communes-fill')) {
			applyChoropleth(mapInstance, activeMetric);
		}
	}

	function getSruInfo(code: string): { rate: string; units: string } | null {
		const data = sruData as Record<string, { category: string; years: Record<string, { social: number; total: number }> }>;
		const info = data[code];
		if (!info) return null;
		const yearData = info.years[String(activeYear)];
		if (!yearData) return null;
		const rate = yearData.total > 0 ? ((yearData.social / yearData.total) * 100).toFixed(1) : '0.0';
		return { rate: `${rate}%`, units: yearData.social.toLocaleString() };
	}

	function featureStateSource(source: string, sourceLayer: string, id: string | number) {
		const obj: any = { source, id };
		if (usePmtiles) obj.sourceLayer = sourceLayer;
		return obj;
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
			zoom: 5,
			attributionControl: false,
		});
		map.addControl(new maplibregl.AttributionControl({ compact: true }));

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

			map.setProjection({
            type: 'globe', // Set projection to globe
        });

			// --- Communes layers (visible by default) ---
			map.addLayer({
				id: 'communes-fill',
				type: 'fill',
				source: 'communes',
				...sl(communesSourceLayer),
				paint: {
					'fill-color': buildChoroplethExpression(activeMetric),
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

			// --- Regions border overlay (gray outline only, no fill) ---
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
				tooltip = null;
			});
			map.on('mousemove', 'communes-fill', (e) => {
				if (!e.features?.length) return;
				const feat = e.features[0];
				const id = feat.id;
				if (id === undefined) return;

				// Same-feature guard: skip if still on same commune
				if (id === hoveredCommuneId) {
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
		});

		return () => {
			map.remove();
			maplibregl.removeProtocol('pmtiles');
		};
	});
</script>

<div class="flex flex-col md:flex-row h-full w-full min-h-100">
	<!-- Sidebar -->
	<div class="w-full md:w-96 shrink-0 border border-gray-200 bg-white p-4 flex flex-col gap-4">


		<!-- Search -->
		<div>
			<p class="text-xs font-medium text-gray-500 mb-1.5">Search</p>
			<Combobox.Root
				type="single"
				bind:open={searchOpen}
				bind:value={searchValue}
				onValueChange={(v) => {
					if (!v) return;
					if (v.startsWith('region:')) {
						const region = REGION_LOOKUP.find(r => r.name === v.slice(7));
						if (region) flyTo(region.center, region.zoom);
					} else if (v.startsWith('commune:')) {
						const commune = communeLookup.find((c: { code: string }) => c.code === v.slice(8));
						if (commune) flyTo(commune.center as [number, number], 12);
					}
					searchQuery = '';
					searchOpen = false;
				}}
			>
				<div class="relative">
					<SearchIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
					<Combobox.Input
						placeholder="Search for a place..."
						class="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-8 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						oninput={(e: Event) => { searchQuery = (e.target as HTMLInputElement).value; searchOpen = true; }}
					/>
					{#if searchQuery.length > 0 || searchValue}
						<button
							type="button"
							class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							onclick={() => { searchQuery = ''; searchValue = undefined; searchOpen = false; flyTo(MAINLAND_CENTER, MAINLAND_ZOOM); }}
						>
							<XIcon class="size-4" />
						</button>
					{/if}
				</div>
				<Combobox.Content class="!w-(--bits-combobox-anchor-width) max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-md" sideOffset={4}>
					{#if filteredRegions.length === 0 && filteredCommunes.length === 0}
						<div class="px-2 py-1.5 text-sm text-muted-foreground">No results found.</div>
					{/if}
					{#if filteredRegions.length > 0}
						<Combobox.Group>
							<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Regions</Combobox.GroupHeading>
							{#each filteredRegions as region}
								<Combobox.Item
									value="region:{region.name}"
									label={region.name}
									class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
								>
									{region.name}
								</Combobox.Item>
							{/each}
						</Combobox.Group>
					{/if}
					{#if filteredRegions.length > 0 && filteredCommunes.length > 0}
						<div role="separator" class="-mx-1 my-1 h-px bg-border"></div>
					{/if}
					{#if filteredCommunes.length > 0}
						<Combobox.Group>
							<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Communes</Combobox.GroupHeading>
							{#each filteredCommunes as commune}
								<Combobox.Item
									value="commune:{commune.code}"
									label={commune.name}
									class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
								>
									{commune.name} <span class="text-muted-foreground ml-1">({commune.code})</span>
								</Combobox.Item>
							{/each}
						</Combobox.Group>
					{/if}
				</Combobox.Content>
			</Combobox.Root>
		</div>
		


		<!-- Metric select -->
		<div>
			<p class="text-xs font-medium text-gray-500 mb-1.5">Select Variable</p>
			<Select.Root type="single" value={activeMetric} onValueChange={(v) => { if (v) switchMetric(v as 'rate' | 'units'); }}>
				<Select.Trigger class="w-full">
					{activeMetric === 'rate' ? 'SRU Rate (%)' : 'Social Units'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="rate" label="SRU Rate (%)" />
					<Select.Item value="units" label="Social Units" />
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Year slider -->
		<div>
			<p class="text-xs font-medium text-gray-500 mb-1.5">Year: <span class="text-gray-900 font-semibold">{activeYear}</span></p>
			<Slider.Root
				type="single"
				min={YEAR_MIN}
				max={YEAR_MAX}
				step={1}
				bind:value={activeYear}
				onValueCommit={() => updateChoropleth()}
				class="relative flex w-full touch-none items-center select-none py-2"
			>
				{#snippet children({ thumbs })}
					<span class="bg-gray-200 relative h-1.5 w-full grow overflow-hidden rounded-full">
						<Slider.Range class="bg-primary absolute h-full" />
					</span>
					{#each thumbs as thumb (thumb)}
						<Slider.Thumb
							index={thumb}
							class="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden"
						/>
					{/each}
				{/snippet}
			</Slider.Root>
			<div class="flex justify-between mt-0.5">
				{#each YEARS as year}
					<span class="text-[9px] text-gray-400" class:font-semibold={year === activeYear} class:text-gray-700={year === activeYear}>{String(year).slice(2)}</span>
				{/each}
			</div>
		</div>

		<!-- Territory navigation -->
		<div>
			<p class="text-xs font-medium text-gray-500 mb-1.5">Navigate</p>
			<div class="flex gap-1">
				<Button
					variant={activeTerritory === 'mainland' ? 'default' : 'outline'}
					size="sm"
					class="flex-1"
					onclick={() => { activeTerritory = 'mainland'; activeRegion = null; flyTo(MAINLAND_CENTER, MAINLAND_ZOOM); }}
				>
					Mainland
				</Button>
				<Button
					variant={activeTerritory === 'overseas' ? 'default' : 'outline'}
					size="sm"
					class="flex-1"
					onclick={() => { activeTerritory = 'overseas'; activeRegion = null; }}
				>
					Overseas
				</Button>
			</div>
			{#if activeTerritory === 'overseas'}
				<div class="flex flex-col gap-1 mt-1.5">
					{#each OVERSEAS_REGIONS as region}
						<Button
							variant={activeRegion === region.name ? 'default' : 'outline'}
							size="sm"
							class="w-full justify-start"
							onclick={() => { activeRegion = region.name; flyTo(region.center, region.zoom); }}
						>
							{region.name}
						</Button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Map -->
	<div class="flex-1 border-t border-r border-b border-gray-200 relative min-h-[400px]">
		<div bind:this={mapContainer} class="h-full w-full"></div>

		<!-- Legend -->
		<div class="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-md border border-gray-200 px-3 py-2 text-xs shadow-sm">
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

		<!-- Hover tooltip -->
		{#if tooltip}
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
</div>
