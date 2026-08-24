<script lang="ts">
	import { onMount } from 'svelte';
	import { geoMercator, geoPath } from 'd3';
	import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from 'geojson';
	import CountryComparisonChart from '$lib/components/charts/CountryComparisonChart.svelte';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { socialRentalByCountry } from '$lib/data/charts/european-social-rental-summary';
	import { socialMixPolicies } from '$lib/data/charts/european-social-mix-policies';

	type CountryProperties = {
		ISO_A3?: string;
		ISO_A3_EH?: string;
		ADM0_A3?: string;
		NAME?: string;
		NAME_EN?: string;
		ADMIN?: string;
		CONTINENT?: string;
	};

	type AtlasCountry = {
		code: string;
		name: string;
		path: string;
		interactive: boolean;
	};

	const countriesUrl =
		'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';
	const countryCodes = new Set(socialRentalByCountry.map((country) => country.iso3));
	const europeanContextCodes = new Set(['ARM', 'AZE', 'GEO', 'TUR']);
	const viewWidth = 1000;
	const viewHeight = 610;

	let selectedCode = $state('FRA');
	let atlasCountries = $state<AtlasCountry[]>([]);
	let loadFailed = $state(false);
	let mapViewBox = $state(`0 0 ${viewWidth} ${viewHeight}`);

	let selectedCountry = $derived(
		socialRentalByCountry.find((country) => country.iso3 === selectedCode) ??
			socialRentalByCountry.find((country) => country.iso3 === 'FRA')!
	);
	let selectedPolicy = $derived(
		socialMixPolicies.find((policy) => policy.iso3 === selectedCode) ?? null
	);

	function countryCode(properties: CountryProperties | null | undefined) {
		return properties?.ISO_A3_EH || properties?.ADM0_A3 || properties?.ISO_A3 || '';
	}

	function countryName(code: string, properties: CountryProperties | null | undefined) {
		return (
			socialRentalByCountry.find((country) => country.iso3 === code)?.country ||
			properties?.NAME_EN ||
			properties?.NAME ||
			properties?.ADMIN ||
			code
		);
	}

	function polygonIsInEurope(polygon: Position[][]) {
		return polygon[0]?.some(
			([longitude, latitude]) =>
				longitude >= -32 && longitude <= 46 && latitude >= 27 && latitude <= 75
		);
	}

	function europeanGeometry(geometry: Geometry): Polygon | MultiPolygon | null {
		if (geometry.type === 'Polygon') {
			return polygonIsInEurope(geometry.coordinates) ? geometry : null;
		}

		if (geometry.type === 'MultiPolygon') {
			const coordinates = geometry.coordinates.filter(polygonIsInEurope);
			return coordinates.length ? { ...geometry, coordinates } : null;
		}

		return null;
	}

	function isEuropeanContext(code: string, properties: CountryProperties | null | undefined) {
		if (code === 'RUS') return false;

		return (
			countryCodes.has(code) ||
			properties?.CONTINENT === 'Europe' ||
			europeanContextCodes.has(code)
		);
	}

	function selectCountry(code: string) {
		selectedCode = code;
	}

	function handleCountryKeydown(event: KeyboardEvent, code: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		selectCountry(code);
	}

	onMount(async () => {
		try {
			const response = await fetch(countriesUrl);
			if (!response.ok) throw new Error('Unable to load European boundaries');

			const source = (await response.json()) as FeatureCollection<Geometry, CountryProperties>;
			const features = source.features.flatMap((feature) => {
				const code = countryCode(feature.properties);
				if (!isEuropeanContext(code, feature.properties)) return [];
				const geometry = europeanGeometry(feature.geometry);
				if (!geometry) return [];
				return [{ ...feature, geometry } as Feature<Polygon | MultiPolygon, CountryProperties>];
			});

			const interactiveCollection: FeatureCollection<Polygon | MultiPolygon, CountryProperties> = {
				type: 'FeatureCollection',
				features: features.filter((feature) => countryCodes.has(countryCode(feature.properties)))
			};
			const projection = geoMercator().fitExtent(
				[[16, 26], [viewWidth - 16, viewHeight - 26]],
				interactiveCollection
			);
			const path = geoPath(projection);
			const [[minX, minY], [maxX, maxY]] = path.bounds(interactiveCollection);
			const boundsPadding = 6;
			mapViewBox = `${minX - boundsPadding} ${minY - boundsPadding} ${
				maxX - minX + boundsPadding * 2
			} ${maxY - minY + boundsPadding * 2}`;

			atlasCountries = features
				.map((feature) => {
					const code = countryCode(feature.properties);
					return {
						code,
						name: countryName(code, feature.properties),
						path: path(feature) ?? '',
						interactive: countryCodes.has(code)
					};
				})
				.filter((country) => country.path)
				.sort((a, b) => Number(a.interactive) - Number(b.interactive));
		} catch {
			loadFailed = true;
		}
	});
</script>

<div class="europe-atlas" data-visual="europe-infographic">
	<div class="europe-layout">
		<aside class="europe-sidebar">
			<h4>{selectedCountry.country}</h4>
			<p class="europe-instruction">Select a country to compare its housing profile.</p>

			<div class="europe-chart-card">
				<CountryComparisonChart countryCode={selectedCode} />
			</div>

			<div class="europe-membership-card">
				<div>
					<span>European Union</span>
					<strong>{selectedCountry.euMember ? 'Member' : 'Non-member'}</strong>
				</div>
				<div>
					<span>OECD</span>
					<strong>{selectedCountry.oecdMember ? 'Member' : 'Non-member'}</strong>
				</div>
			</div>

			{#if selectedPolicy}
				<div class="europe-policy-card">
					<span>{selectedPolicy.years ? `Established ${selectedPolicy.years}` : 'Policy'}</span>
					<strong>{selectedPolicy.policyName}</strong>
					<p>{selectedPolicy.description}</p>
					<div class="europe-policy-comparison">
						<span>Comparison to SRU</span>
						<p>{selectedPolicy.differenceFromSru}</p>
					</div>
				</div>
			{/if}
		</aside>

		<div class="europe-map-panel">
			{#if loadFailed}
				<p>European boundaries could not be loaded.</p>
			{:else}
				<svg viewBox={mapViewBox} role="img" aria-label="Selectable map of Europe">
					{#each atlasCountries as country (country.code)}
						{#if country.interactive}
							<path
								d={country.path}
								fill={country.code === selectedCode ? GRAPHICS_COLORS.primary : GRAPHICS_COLORS.context}
								stroke={country.code === selectedCode ? GRAPHICS_COLORS.primaryDark : GRAPHICS_COLORS.secondaryText}
								class="interactive-country"
								class:selected={country.code === selectedCode}
								role="button"
								tabindex="0"
								aria-label={country.name}
								aria-pressed={country.code === selectedCode}
								onclick={() => selectCountry(country.code)}
								onkeydown={(event) => handleCountryKeydown(event, country.code)}
							>
								<title>{country.name}</title>
							</path>
						{:else}
							<path
								d={country.path}
								fill="#fff"
								stroke="#a8a8a5"
								class="context-country"
								aria-hidden="true"
							></path>
						{/if}
					{/each}
				</svg>
			{/if}
		</div>
	</div>
</div>

<style>
	.europe-atlas {
		--atlas-gap: 0.75rem;
		--panel-gap: 0.25rem;

		padding: clamp(0.75rem, 1.6vw, 1.25rem);
		border: 1px solid #dadad7;
		background: #fff;
		color: #121212;
	}

	.europe-layout {
		display: grid;
		grid-template-columns: minmax(16rem, 19rem) minmax(0, 1fr);
		gap: var(--panel-gap);
		align-items: start;
	}

	.europe-sidebar {
		display: grid;
		min-width: 0;
		gap: var(--atlas-gap);
		align-content: start;
	}

	.europe-sidebar > h4 {
		margin: 0;
		font-size: clamp(1.15rem, 1.8vw, 1.5rem);
		font-weight: 700;
		line-height: 1.05;
	}

	.europe-instruction {
		margin: -0.2rem 0 0;
		color: #747474;
		font-size: 0.76rem;
		line-height: 1.35;
	}

	.europe-chart-card,
	.europe-membership-card,
	.europe-policy-card {
		min-width: 0;
		border: 1px solid #dadad7;
		background: #fff;
	}

	.europe-chart-card {
		padding: 0.7rem 0.9rem;
	}

	.europe-membership-card {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		line-height: 1.2;
	}

	.europe-membership-card > div {
		display: flex;
		min-width: 0;
		flex-direction: column;
		justify-content: center;
		padding: 0.7rem 0.9rem;
	}

	.europe-membership-card > div + div {
		border-left: 1px solid #dadad7;
	}

	.europe-membership-card span,
	.europe-policy-card span {
		color: #5f5f5f;
		font-size: 0.72rem;
	}

	.europe-membership-card strong {
		margin-top: 0.3rem;
		font-size: 0.88rem;
		font-weight: 700;
	}

	.europe-map-panel {
		position: relative;
		display: flex;
		width: 100%;
		height: clamp(42rem, 58vw, 46rem);
		min-height: 42rem;
		background: #fff;
	}

	.europe-map-panel > p {
		margin: 0;
		padding: 2rem;
		color: #747474;
		font-size: 0.82rem;
		text-align: center;
	}

	.europe-map-panel svg {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.europe-map-panel path {
		stroke-width: 0.8px;
		vector-effect: non-scaling-stroke;
		transition:
			fill 140ms ease,
			stroke 140ms ease,
			opacity 140ms ease;
	}

	.europe-map-panel path.interactive-country {
		cursor: pointer;
	}

	.europe-map-panel path.interactive-country:hover {
		fill: #8faab2;
	}

	.europe-map-panel path.context-country {
		pointer-events: none;
	}

	.europe-map-panel path.selected {
		stroke-width: 2px;
	}

	.europe-map-panel path:focus {
		outline: none;
	}

	.europe-map-panel path:focus-visible {
		outline: none;
		stroke: #d97f18;
		stroke-width: 3px;
	}

	.europe-policy-card {
		padding: 0.85rem 0.95rem;
	}

	.europe-policy-card strong {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.86rem;
		line-height: 1.25;
	}

	.europe-policy-card p {
		margin: 0.35rem 0 0;
		color: #3f3f3f;
		font-size: 0.75rem;
		line-height: 1.45;
	}

	.europe-policy-comparison {
		margin-top: 0.85rem;
	}

	@media (min-width: 761px) {
		.europe-atlas {
			box-sizing: border-box;
			height: calc(100svh - 5.5rem);
		}

		.europe-layout {
			height: 100%;
		}

		.europe-sidebar {
			max-height: 100%;
			overflow-y: auto;
			padding-right: 0.2rem;
			scrollbar-width: thin;
			scrollbar-color: #c4c4c0 transparent;
		}

		.europe-map-panel,
		.europe-map-panel svg {
			height: 100%;
			min-height: 0;
		}
	}

	@media (max-width: 760px) {
		.europe-layout {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.europe-map-panel {
			height: 23rem;
			min-height: 20rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.europe-map-panel path {
			transition-duration: 1ms;
		}
	}
</style>
