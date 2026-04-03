<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import MapSidebar from './MapSidebar.svelte';

	const COUNTRIES_SOURCE_ID = 'europe-countries';
	const COUNTRIES_FILL_LAYER_ID = 'europe-countries-fill';
	const COUNTRIES_BORDER_LAYER_ID = 'europe-countries-border';
	const COUNTRIES_GEOJSON_URL =
		'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';

	// EU-27 + UK + EFTA (32-country set).
	const EUROPE_COUNTRY_CODES = [
		'AUT',
		'BEL',
		'BGR',
		'HRV',
		'CYP',
		'CZE',
		'DNK',
		'EST',
		'FIN',
		'FRA',
		'DEU',
		'GRC',
		'HUN',
		'IRL',
		'ITA',
		'LVA',
		'LTU',
		'LUX',
		'MLT',
		'NLD',
		'POL',
		'PRT',
		'ROU',
		'SVK',
		'SVN',
		'ESP',
		'SWE',
		'GBR',
		'NOR',
		'ISL',
		'CHE',
		'LIE'
	] as const;

	let mapContainer: HTMLDivElement;
	let mapInstance: maplibregl.Map | null = $state(null);
	let hoveredCountryId: string | number | null = $state(null);
	let selectedCountryId: string | number | null = $state(null);
	let selectedCountryCode = $state('');
	let selectedCountryName = $state('');
	let tooltip: { x: number; y: number; name: string } | null = $state(null);

	$effect(() => {
		if (!selectedCountryCode) return;
		console.log('[EuropeanMap] selection state', {
			selectedCountryCode,
			selectedCountryName
		});
	});

	onMount(() => {
		mapInstance = new maplibregl.Map({
			container: mapContainer,
			style: 'https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC',
			center: [10, 52],
			zoom: 2.8,
			attributionControl: false
		});

		// mapInstance.setMaxBounds([
		// 	[-30, 30],
		// 	[45, 73]
		// ]);

		mapInstance.on('load', () => {
			const map = mapInstance;
			if (!map) return;

			map.addSource(COUNTRIES_SOURCE_ID, {
				type: 'geojson',
				data: COUNTRIES_GEOJSON_URL,
				promoteId: 'ISO_A3'
			});

			const countriesFilter = ['in', ['get', 'ISO_A3'], ['literal', EUROPE_COUNTRY_CODES]] as any;

			map.addLayer({
				id: COUNTRIES_FILL_LAYER_ID,
				type: 'fill',
				source: COUNTRIES_SOURCE_ID,
				filter: countriesFilter,
				paint: {
					'fill-color': [
						'case',
						['boolean', ['feature-state', 'selected'], false],
						'#111827',
						['boolean', ['feature-state', 'hover'], false],
						'#374151',
						'#6b7280'
					],
					'fill-opacity': [
						'case',
						['boolean', ['feature-state', 'selected'], false],
						0.75,
						['boolean', ['feature-state', 'hover'], false],
						0.55,
						0.35
					]
				}
			});

			map.addLayer({
				id: COUNTRIES_BORDER_LAYER_ID,
				type: 'line',
				source: COUNTRIES_SOURCE_ID,
				filter: countriesFilter,
				paint: {
					'line-color': '#f9fafb',
					'line-width': 0.6,
					'line-opacity': 0.75
				}
			});

			map.on('mouseenter', COUNTRIES_FILL_LAYER_ID, () => {
				map.getCanvas().style.cursor = 'pointer';
			});

			map.on('mouseleave', COUNTRIES_FILL_LAYER_ID, () => {
				map.getCanvas().style.cursor = '';
				if (hoveredCountryId !== null) {
					map.setFeatureState({ source: COUNTRIES_SOURCE_ID, id: hoveredCountryId }, { hover: false });
					hoveredCountryId = null;
				}
				tooltip = null;
			});

			map.on('mousemove', COUNTRIES_FILL_LAYER_ID, (e) => {
				if (!e.features?.length) return;
				const feature = e.features[0];
				if (feature.id === undefined) return;

				if (hoveredCountryId !== null && hoveredCountryId !== feature.id) {
					map.setFeatureState({ source: COUNTRIES_SOURCE_ID, id: hoveredCountryId }, { hover: false });
				}

				hoveredCountryId = feature.id;
				map.setFeatureState({ source: COUNTRIES_SOURCE_ID, id: hoveredCountryId }, { hover: true });

				tooltip = {
					x: e.point.x,
					y: e.point.y,
					name: feature.properties?.NAME_EN || feature.properties?.NAME || feature.properties?.ADMIN
				};
			});

			map.on('click', COUNTRIES_FILL_LAYER_ID, (e) => {
				if (!e.features?.length) return;
				const feature = e.features[0];
				if (feature.id === undefined) return;
				console.log('[EuropeanMap] country click', {
					id: feature.id,
					iso3: feature.properties?.ISO_A3,
					name: feature.properties?.NAME_EN || feature.properties?.NAME || feature.properties?.ADMIN
				});

				if (selectedCountryId !== null) {
					map.setFeatureState(
						{ source: COUNTRIES_SOURCE_ID, id: selectedCountryId },
						{ selected: false }
					);
				}

				selectedCountryId = feature.id;
				selectedCountryCode = feature.properties?.ISO_A3 || String(feature.id);
				selectedCountryName =
					feature.properties?.NAME_EN || feature.properties?.NAME || feature.properties?.ADMIN || '';
				map.setFeatureState({ source: COUNTRIES_SOURCE_ID, id: selectedCountryId }, { selected: true });
			});
		});

		return () => {
			mapInstance?.remove();
			mapInstance = null;
			hoveredCountryId = null;
			selectedCountryId = null;
			selectedCountryCode = '';
			selectedCountryName = '';
			tooltip = null;
		};
	});
</script>

<div class="flex flex-col md:flex-row h-full w-full min-h-100">
	<MapSidebar countryName={selectedCountryName} countryCode={selectedCountryCode} />

	<div class="flex-1 border-t border-r border-b border-gray-200 relative min-h-100">
		<div bind:this={mapContainer} class="h-full w-full"></div>

		{#if tooltip}
			<div
				class="absolute z-20 bg-gray-900 text-white rounded-md px-3 py-2 text-xs pointer-events-none shadow-lg"
				style="left:{tooltip.x + 12}px;top:{tooltip.y - 10}px"
			>
				<p class="font-semibold">{tooltip.name}</p>
			</div>
		{/if}
	</div>
</div>
