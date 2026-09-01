<script lang="ts">
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import { geoMercator, geoPath } from 'd3';
	import type { Feature, FeatureCollection, Geometry, Position } from 'geojson';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { dromComTerritories } from '$lib/data/charts/drom-com-summary';
	import { language } from '$lib/i18n';

	type RegionProperties = {
		code: string;
		nom: string;
	};

	const tileWidth = 220;
	const tileHeight = 132;
	const geographyNames: Record<string, string> = {
		'Guyane (French Guiana)': 'Guyane',
		Guadeloupe: 'Guadeloupe',
		Martinique: 'Martinique',
		Mayotte: 'Mayotte',
		'La Réunion': 'La Réunion',
		'Polynésie française': 'Polynésie française',
		'Wallis-et-Futuna': 'Wallis et Futuna',
		'Saint-Martin': 'Saint-Martin',
		'Saint-Barthélemy': 'Saint-Barthélemy',
		'Saint Pierre-et-Miquelon': 'Saint-Pierre-et-Miquelon',
		'Nouvelle-Calédonie': 'Nouvelle-Calédonie'
	};

	let selectedName = $state(dromComTerritories[0].name);
	let selected = $derived(dromComTerritories.find((territory) => territory.name === selectedName)!);
	let territoryPaths = $state<Record<string, string>>({});

	function formatNumber(value: number): string {
		return value.toLocaleString($language === 'fr' ? 'fr-FR' : 'en-US');
	}

	function territoryName(name: string) {
		return $language === 'fr' && name === 'Guyane (French Guiana)' ? 'Guyane' : name;
	}

	function translateMeta(value: string) {
		if ($language === 'en') return value;
		return ({
			'South America': 'Amérique du Sud',
			'Atlantic Ocean': 'Océan Atlantique',
			'Indian Ocean': 'Océan Indien',
			'Pacific Ocean': 'Océan Pacifique',
			'Overseas department and region': 'Département et région d’outre-mer',
			'Overseas collectivity': 'Collectivité d’outre-mer',
			'Sui generis collectivity': 'Collectivité sui generis'
		} as Record<string, string>)[value] ?? value;
	}

	function signedArea(ring: Position[]): number {
		let area = 0;
		for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
			area += ring[previous][0] * ring[index][1] - ring[index][0] * ring[previous][1];
		}
		return area / 2;
	}

	function rewindRing(ring: Position[], clockwise: boolean): Position[] {
		const isClockwise = signedArea(ring) < 0;
		return isClockwise === clockwise ? ring : [...ring].reverse();
	}

	function rewindForD3(geometry: Geometry): Geometry {
		if (geometry.type === 'Polygon') {
			return {
				...geometry,
				coordinates: geometry.coordinates.map((ring, index) => rewindRing(ring, index === 0))
			};
		}

		if (geometry.type === 'MultiPolygon') {
			return {
				...geometry,
				coordinates: geometry.coordinates.map((polygon) =>
					polygon.map((ring, index) => rewindRing(ring, index === 0))
				)
			};
		}

		return geometry;
	}

	function pathForFeature(feature: Feature<Geometry, RegionProperties>) {
		const displayFeature: Feature<Geometry, RegionProperties> = {
			...feature,
			geometry: rewindForD3(feature.geometry)
		};
		const projection = geoMercator().fitExtent(
			[[14, 12], [tileWidth - 14, tileHeight - 30]],
			displayFeature
		);
		return geoPath(projection)(displayFeature) ?? '';
	}

	onMount(async () => {
		const response = await fetch(asset('/regions_2025_outre_mer.geojson'));
		if (!response.ok) return;

		const regions = (await response.json()) as FeatureCollection<Geometry, RegionProperties>;
		const nextPaths: Record<string, string> = {};

		for (const territory of dromComTerritories) {
			const geographyName = geographyNames[territory.name];
			const feature = regions.features.find((item) => item.properties?.nom === geographyName);
			if (feature) nextPaths[territory.name] = pathForFeature(feature);
		}

		territoryPaths = nextPaths;
	});
</script>

<div class="overseas-atlas" data-visual="small-multiples">
	<h4>{territoryName(selected.name)}</h4>
	<div class="overseas-summary">
		<div class="overseas-stat">
			<p class="overseas-stat-value">{formatNumber(selected.population)}</p>
			<p class="overseas-stat-label">Population ({selected.popYear})</p>
		</div>
		<div class="overseas-stat">
			{#if selected.socialHousingRate !== null}
				<p class="overseas-stat-value">{selected.socialHousingRate}%</p>
			{:else}
				<p class="overseas-stat-value overseas-stat-value--missing">{$language === 'fr' ? 'N/D' : 'N/A'}</p>
			{/if}
			<p class="overseas-stat-label">{$language === 'fr' ? 'Taux de logements sociaux' : 'Social Housing Rate'} ({selected.socialHousingYear})</p>
		</div>
		<div class="overseas-meta-card">
			{translateMeta(selected.location)}
		</div>
		<div class="overseas-meta-card">
			{translateMeta(selected.status)}
		</div>
	</div>

	<div class="overseas-grid">
		{#each dromComTerritories as territory (territory.name)}
			<button
				type="button"
				class="territory-tile"
				class:territory-tile--selected={selectedName === territory.name}
				aria-pressed={selectedName === territory.name}
				onclick={() => (selectedName = territory.name)}
			>
				<svg
					viewBox={`0 0 ${tileWidth} ${tileHeight}`}
					role="img"
					aria-label={$language === 'fr' ? `Carte de ${territoryName(territory.name)}` : `Map of ${territory.name}`}
				>
					<path
						d={territoryPaths[territory.name] ?? ''}
						fill={selectedName === territory.name ? GRAPHICS_COLORS.primary : GRAPHICS_COLORS.context}
						stroke={selectedName === territory.name ? GRAPHICS_COLORS.primaryDark : GRAPHICS_COLORS.secondaryText}
						vector-effect="non-scaling-stroke"
					/>
				</svg>
				<span>{territoryName(territory.name)}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.overseas-atlas {
		--atlas-gap: 0.75rem;

		display: grid;
		gap: var(--atlas-gap);
		padding: clamp(0.75rem, 1.6vw, 1.25rem);
		border: 1px solid #dadad7;
		background: #fff;
		color: #121212;
	}

	.overseas-atlas > h4 {
		margin: 0;
		font-size: clamp(1.15rem, 1.8vw, 1.5rem);
		font-weight: 700;
		line-height: 1.05;
	}

	.overseas-summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--atlas-gap);
		align-items: stretch;
	}

	.overseas-meta-card {
		display: flex;
		min-width: 0;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 0.9rem;
		border: 1px solid #dadad7;
		color: #5f5f5f;
		font-size: 0.78rem;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
	}

	.overseas-stat {
		min-width: 0;
		height: 100%;
		padding: 0.7rem 0.9rem;
		border: 1px solid #dadad7;
		text-align: left;
	}

	.overseas-stat p {
		margin: 0;
	}

	.overseas-stat-value {
		font-size: clamp(1.1rem, 1.8vw, 1.45rem);
		font-weight: 700;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.overseas-stat-value--missing {
		color: #a8a8a5;
	}

	.overseas-stat-label {
		margin-top: 0.3rem !important;
		color: #5f5f5f;
		font-size: 0.72rem;
		line-height: 1.2;
	}

	.overseas-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--atlas-gap);
	}

	.territory-tile {
		display: grid;
		min-width: 0;
		grid-template-rows: minmax(5.75rem, 1fr) auto;
		border: 1px solid #dadad7;
		border-radius: 0;
		padding: 0.25rem 0.45rem 0.55rem;
		background: #fff;
		color: #5f5f5f;
		font: inherit;
		font-size: clamp(0.66rem, 0.85vw, 0.78rem);
		font-weight: 600;
		line-height: 1.15;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 140ms ease,
			background-color 140ms ease,
			color 140ms ease;
	}

	.territory-tile svg {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.territory-tile path {
		stroke-width: 1px;
		transition:
			fill 140ms ease,
			stroke 140ms ease;
	}

	.territory-tile:hover {
		border-color: #5f5f5f;
		color: #121212;
	}

	.territory-tile--selected {
		border-color: #315a67;
		background: #f7f6f2;
		color: #121212;
	}

	.territory-tile:focus-visible {
		outline: 2px solid #d97f18;
		outline-offset: 2px;
	}

	@media (min-width: 721px) {
		.overseas-atlas {
			box-sizing: border-box;
			height: calc(100svh - 5.5rem);
			grid-template-rows: auto auto minmax(0, 1fr);
		}

		.overseas-grid {
			min-height: 0;
			grid-auto-rows: minmax(0, 1fr);
		}

		.territory-tile {
			min-height: 0;
			grid-template-rows: minmax(0, 1fr) auto;
		}
	}

	@media (max-width: 980px) {
		.overseas-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 720px) {
		.overseas-summary {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.overseas-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 420px) {
		.overseas-summary {
			grid-template-columns: 1fr;
		}

		.territory-tile {
			grid-template-rows: minmax(4.75rem, 1fr) auto;
			font-size: 0.64rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.territory-tile,
		.territory-tile path {
			transition-duration: 1ms;
		}
	}
</style>
