<script lang="ts">
	import { onMount } from 'svelte';
	import { geoMercator, geoPath } from 'd3';
	import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from 'geojson';
	import CountryComparisonChart from '$lib/components/charts/CountryComparisonChart.svelte';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { socialRentalByCountry } from '$lib/data/charts/european-social-rental-summary';
	import { socialMixPolicies } from '$lib/data/charts/european-social-mix-policies';
	import { language } from '$lib/i18n';

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

	const countryNamesFr: Record<string, string> = {
		FRA: 'France', ESP: 'Espagne', GBR: 'Royaume-Uni', IRL: 'Irlande',
		DNK: 'Danemark', NLD: 'Pays-Bas', BEL: 'Belgique'
	};
	const policiesFr: Record<string, { adopted: string; name: string; description: string; comparison: string }> = {
		ESP: { adopted: 'Adoptée en 2023', name: 'Loi espagnole sur le logement (Loi 12/2023)', description: 'La loi sur le logement augmente les pourcentages minimaux de terrains à réserver au logement social : de 30 % à 40 % pour les nouvelles opérations d’aménagement en zone rurale, et de 10 % à 20 % pour les opérations de renouvellement ou de rénovation en zone urbaine. Le classement d’un terrain en tant que terrain réservé au logement social ne peut être modifié, sauf dans des cas exceptionnels. Les régions sont tenues de fixer le pourcentage de terrains réservés destinés à la location, qui ne doit généralement pas être inférieur à 50 %.', comparison: 'La loi impose de réserver des pourcentages minimaux de terrains à un zonage exclusivement destiné au logement social ; elle n’impose pas directement la construction d’un nombre déterminé de logements sociaux ni la réalisation de logements sociaux.' },
		GBR: { adopted: 'Adoptés en 1990', name: 'Section 106 (S106) Agreements / Town and Country Planning Act 1990', description: 'En vertu de l’article 106 de la loi de 1990 sur l’aménagement du territoire et l’urbanisme, les autorités chargées de l’urbanisme peuvent imposer aux promoteurs de prévoir une proportion de logements abordables ou de verser des contributions compensatoires. De nombreux plans locaux fixent des objectifs explicites concernant la part de logements abordables à intégrer dans les nouvelles opérations de construction. Les contributions au titre de l’article 106 permettent également d’autres modalités, telles que la réalisation de logements abordables sur un autre site, le versement d’une contribution financière compensatoire ou la cession de terrains destinés à la construction future de logements abordables.', comparison: 'Le dispositif est moins comparable à la loi SRU, car sa dimension territoriale peut être contournée. De plus, il porte principalement sur l’accession à la propriété plutôt que sur le logement social.' },
		IRL: { adopted: 'Adoptée en 2000, puis modifiée à plusieurs reprises', name: 'Part V of the Planning and Development Act / 2000', description: 'La partie V de la loi de 2000 sur l’aménagement et le développement permet aux autorités locales d’acquérir jusqu’à 10 % des terrains classés pour la construction de logements à leur « valeur d’usage existante », plutôt qu’à leur « valeur de développement ». Elle s’applique à toute opération résidentielle comprenant au moins 9 logements ou réalisée sur un terrain de plus de 0,1 hectare. Son objectif est de favoriser la mixité sociale et d’éviter un retour au modèle traditionnel des « cités de logements sociaux ».', comparison: 'L’application des exigences prévues par la partie V relève des collectivités locales. Il n’existe pas d’obligation nationale imposant aux communes d’atteindre ou de respecter des quotas de logements sociaux.' },
		DNK: { adopted: 'Adoptées en 2018 et 2021', name: 'Lois anti-ghetto (Ét Danmark uden parallelsamfund) / 2018, 2021', description: 'La problématique législation danoise anti-ghetto vise à faire disparaître, d’ici 2030, les quartiers comptant plus de 50 % de résidents issus de pays non-occidentaux, présentant un taux de chômage élevé ou un niveau élevé de criminalité. Elle prévoit notamment des déplacements forcés de résidents, des démolitions et une réduction de la part de logements sociaux à 40 %. La législation distingue trois types de territoires : les zones défavorisées, les « ghettos » et les « ghettos durs », renommés en 2021 « sociétés parallèles » et « zones de restructuration ».', comparison: 'Plutôt que de chercher à introduire une offre de logements abordables dans des enclaves aisées et exclusives, les lois anti-ghetto poursuivent l’objectif inverse : faire venir des Danois issus des classes moyennes et supérieures dans des quartiers majoritairement immigrés afin d’y favoriser la mixité sociale et de « préserver la culture danoise ». Cette législation a fait l’objet de nombreuses critiques et sa conformité au droit européen est actuellement examinée par la Cour de justice de l’Union européenne.' },
		NLD: { adopted: 'Adoptée en 2026', name: 'Projet de loi visant à renforcer le pilotage du logement public (Wet Versterking Regie Volkshuisvesting) / 2026', description: 'En vertu de ce projet de loi, les deux tiers de l’ensemble des logements neufs construits dans une région devraient respecter les normes nationales d’accessibilité financière, dont 30 % seraient réservés au logement social, avec un loyer mensuel maximal d’environ 900 €. Ces objectifs nationaux s’appuient sur des accords locaux existants. À Amsterdam, par exemple, la règle dite « 40-40-20 » est appliquée depuis 2017. L’objectif commun est de maintenir un marché du logement accessible aux ménages à revenus modestes et intermédiaires.', comparison: 'Ce dispositif est comparable à la loi SRU dans la mesure où il fixe des objectifs nationaux en matière de pourcentages, mais il est axé sur la construction neuve plutôt que sur l’ensemble du parc de logements. Aucune pénalité financière n’est prévue en cas de non-atteinte des objectifs fixés, même si les communes sont chargées de définir leurs propres objectifs en matière d’accessibilité financière.' },
		BEL: { adopted: 'Adoptée en 2009 (renouvelée en 2025)', name: 'Objectif social contraignant (Bindend sociaal objectief) / 2009, 2025', description: 'Le gouvernement flamand a fixé l’objectif de produire 54 000 logements sociaux d’ici 2042, en l’imposant aux communes au moyen d’un objectif social contraignant. Tout promoteur réalisant au moins 10 logements individuels ou 50 appartements est soumis à une obligation de production de logements sociaux, généralement fixée à 20 %, et pouvant atteindre 40 %, pour obtenir un permis de construire. Les logements doivent être cédés à des prix plafonnés aux bailleurs sociaux. Le gouvernement vise à porter la part du logement social à 15 % dans chaque commune.', comparison: 'Il s’agit globalement d’un modèle comparable à celui de la loi SRU, mais moins complet, et qui combine des objectifs contraignants avec une forme de zonage incitatif, puisque les obligations s’appliquent directement aux promoteurs immobiliers. Les communes ne disposent pas d’objectifs clairement définis en matière de logements sociaux, et les sanctions financières ne sont pas clairement établies.' }
	};
	let selectedPolicyFr = $derived(policiesFr[selectedCode] ?? null);
	function displayedCountry(code: string, fallback: string) {
		return $language === 'fr' ? countryNamesFr[code] ?? fallback : fallback;
	}
	function policyStatus() {
		if ($language === 'fr' && selectedPolicyFr) return selectedPolicyFr.adopted;
		if (selectedCode === 'GBR') return 'Adopted in 1990';
		if (selectedCode === 'NLD') return 'Established in 2026';
		return selectedPolicy?.years ? `Established ${selectedPolicy.years}` : 'Policy';
	}

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
			<h4>{displayedCountry(selectedCode, selectedCountry.country)}</h4>
			<p class="europe-instruction">{$language === 'fr' ? 'Sélectionnez un pays pour comparer son parc de logement social.' : 'Select a country to compare its housing profile.'}</p>

			<div class="europe-chart-card">
				<CountryComparisonChart countryCode={selectedCode} />
			</div>

			<div class="europe-membership-card">
				<div>
					<span>{$language === 'fr' ? 'Union européenne' : 'European Union'}</span>
					<strong>{$language === 'fr' ? (selectedCountry.euMember ? 'Membre' : 'Non-membre') : (selectedCountry.euMember ? 'Member' : 'Non-member')}</strong>
				</div>
				<div>
					<span>{$language === 'fr' ? 'OCDE' : 'OECD'}</span>
					<strong>{$language === 'fr' ? (selectedCountry.oecdMember ? 'Membre' : 'Non-membre') : (selectedCountry.oecdMember ? 'Member' : 'Non-member')}</strong>
				</div>
			</div>

			{#if selectedPolicy}
				<div class="europe-policy-card">
					<span>{policyStatus()}</span>
					<strong>{$language === 'fr' && selectedPolicyFr ? selectedPolicyFr.name : selectedPolicy.policyName}</strong>
					<p>{$language === 'fr' && selectedPolicyFr ? selectedPolicyFr.description : selectedPolicy.description}</p>
					<div class="europe-policy-comparison">
						<span>{$language === 'fr' ? 'Comparaison avec la loi SRU' : 'Comparison to SRU'}</span>
						<p>{$language === 'fr' && selectedPolicyFr ? selectedPolicyFr.comparison : selectedPolicy.differenceFromSru}</p>
					</div>
				</div>
			{/if}
		</aside>

		<div class="europe-map-panel">
			{#if loadFailed}
				<p>{$language === 'fr' ? 'Les limites européennes n’ont pas pu être chargées.' : 'European boundaries could not be loaded.'}</p>
			{:else}
				<svg viewBox={mapViewBox} role="img" aria-label={$language === 'fr' ? 'Carte interactive de l’Europe' : 'Selectable map of Europe'}>
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
								aria-label={displayedCountry(country.code, country.name)}
								aria-pressed={country.code === selectedCode}
								onclick={() => selectCountry(country.code)}
								onkeydown={(event) => handleCountryKeydown(event, country.code)}
							>
								<title>{displayedCountry(country.code, country.name)}</title>
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
