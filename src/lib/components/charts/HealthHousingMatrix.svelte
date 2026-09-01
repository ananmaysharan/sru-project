<script lang="ts">
	import { asset } from '$app/paths';
	import {
		HEALTH_HOUSING_CITATIONS,
		HEALTH_HOUSING_ROWS,
		HEALTH_OUTCOMES,
		type HealthHousingStudy
	} from '$lib/data/charts/health-housing-matrix';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { language } from '$lib/i18n';

	type Tooltip = {
		key: string;
		study: HealthHousingStudy;
		color: string;
		x: number;
		y: number;
	};

	const groupColors = {
		location: GRAPHICS_COLORS.alert,
		proximity: GRAPHICS_COLORS.alert,
		indoor: GRAPHICS_COLORS.primary,
		outdoor: GRAPHICS_COLORS.primaryDark
	} as const;

	const translations: Record<string, string> = {
		'How Housing Impacts Health': 'Le logement, un déterminant de la santé',
		'Physical Health': 'Santé physique', 'Mental Health': 'Santé mentale',
		'Housing': 'Logement', 'Environment': 'Environnement',
		'Location + Conditions': 'Localisation et conditions', 'Location': 'Localisation',
		'Housing Quality': 'Qualité du logement', 'Proximities + Accessibility': 'Proximité et accessibilité',
		'Proximity to Services': 'Proximité des services', 'Proximity to Green Spaces': 'Proximité des espaces verts',
		'Proximity to Industrial Sites': 'Proximité des sites industriels', 'Transit Accessibility': 'Accessibilité des transports',
		'Indoor Environmental Quality': 'Qualité de l’environnement intérieur', 'Thermal Comfort': 'Confort thermique',
		'Indoor Air Quality': 'Qualité de l’air intérieur', 'Chemical Exposure': 'Exposition aux substances chimiques',
		'Outdoor Environmental Quality': 'Qualité de l’environnement extérieur', 'Prevalence of Air Pollution': 'Prévalence de la pollution atmosphérique',
		'Significant Extreme Heat / UHI': 'Fortes chaleurs extrêmes / îlots de chaleur urbains', 'Noise Pollution': 'Pollution sonore',
		'Prevalence of Respiratory Illness': 'Prévalence des maladies respiratoires',
		'Prevalence of Non-Communicable Disease (diabetes, obesity, cardiovascular)': 'Prévalence des maladies non transmissibles (diabète, obésité, maladies cardiovasculaires)',
		'Prevalence of Thermal Discomforts + Disease (heatstroke, hypothermia)': 'Prévalence de l’inconfort thermique et des maladies associées (coup de chaleur, hypothermie)',
		'Prevalence of Communicable Disease or Toxic Poisoning (water-borne, Pb, aesbestos)': 'Prévalence des maladies transmissibles ou des intoxications toxiques (maladies hydriques, plomb, amiante)',
		'Stress and Anxiety': 'Stress et anxiété', 'Depression and Social Isolation': 'Dépression et isolement social',
		'Cognitive and Behavioral Issues': 'Troubles cognitifs et comportementaux'
	};
	function label(value: string) { return $language === 'fr' ? translations[value] ?? value : value; }

	const subcategories = [
		{ key: 'location', label: 'Location + Conditions', gridRow: 3 },
		{ key: 'proximity', label: 'Proximities + Accessibility', gridRow: 6 },
		{ key: 'indoor', label: 'Indoor Environmental Quality', gridRow: 11 },
		{ key: 'outdoor', label: 'Outdoor Environmental Quality', gridRow: 15 }
	] as const;

	const parentCategories = [
		{
			label: 'Housing',
			className: 'parent-housing',
			gridStart: 3,
			gridEnd: 11,
			color: GRAPHICS_COLORS.alert
		},
		{
			label: 'Environment',
			className: 'parent-environmental',
			gridStart: 11,
			gridEnd: 19,
			color: GRAPHICS_COLORS.primaryDark
		}
	] as const;

	const dataGridRows = new Map([
		[0, 4],
		[1, 5],
		[2, 7],
		[3, 8],
		[4, 9],
		[5, 10],
		[6, 12],
		[7, 13],
		[8, 14],
		[9, 16],
		[10, 17],
		[11, 18]
	]);

	let tooltip = $state<Tooltip | null>(null);

	function tooltipPosition(x: number, y: number) {
		const width = 330;
		const maxX = Math.max(12, window.innerWidth - width - 12);
		const nextX = Math.min(Math.max(12, x + 16), maxX);
		const nextY = y > 170 ? y - 20 : y + 26;
		return { x: nextX, y: nextY };
	}

	function showPointerTooltip(
		event: PointerEvent,
		key: string,
		study: HealthHousingStudy,
		color: string
	) {
		tooltip = { key, study, color, ...tooltipPosition(event.clientX, event.clientY) };
	}

	function showFocusTooltip(
		event: FocusEvent,
		key: string,
		study: HealthHousingStudy,
		color: string
	) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		tooltip = {
			key,
			study,
			color,
			...tooltipPosition(rect.left + rect.width / 2, rect.top + rect.height / 2)
		};
	}

	function clearTooltip(key: string) {
		if (tooltip?.key === key) tooltip = null;
	}
</script>

<figure class="diagram" aria-labelledby="health-housing-title">
	<div class="diagram-scroll">
		<div class="diagram-board">
			<header class="skyline-header">
				<img
					src={asset('/health-housing-skyline.webp')}
					alt=""
					aria-hidden="true"
					width="2800"
					height="406"
				/>
				<h2 id="health-housing-title">{#if $language === 'fr'}Le logement,<br /> un déterminant de la santé{:else}How Housing<br /> Impacts Health{/if}</h2>
			</header>

			<div class="matrix-grid">
				<div class="domain-frame physical-frame" aria-hidden="true"></div>
				<div class="domain-frame mental-frame" aria-hidden="true"></div>
				<div class="domain-divider" aria-hidden="true"></div>
				<div class="health-domain physical-domain">{label('Physical Health')}</div>
				<div class="health-domain mental-domain">{label('Mental Health')}</div>

				<div class="outcome-spacer" aria-hidden="true"></div>
				{#each HEALTH_OUTCOMES as outcome, outcomeIndex (outcome)}
					<div
						class="outcome-label"
						class:before-domain-divider={outcomeIndex === 3}
						class:last-outcome={outcomeIndex === HEALTH_OUTCOMES.length - 1}
						style={`grid-column:${outcomeIndex + 3};grid-row:2;`}
					>
						{label(outcome)}
					</div>
				{/each}

				{#each parentCategories as parent (parent.label)}
					<div
						class={`parent-category ${parent.className}`}
						style={`grid-column:1;grid-row:${parent.gridStart}/${parent.gridEnd};--parent-color:${parent.color};`}
					>
						<span>{label(parent.label)}</span>
					</div>
				{/each}

				{#each subcategories as subcategory (subcategory.key)}
					<div
						class="subcategory-label"
						style={`grid-column:2;grid-row:${subcategory.gridRow};--group-color:${groupColors[subcategory.key]};`}
					>
						{label(subcategory.label)}
					</div>
					<div
						class="subcategory-rule"
						style={`grid-column:3/10;grid-row:${subcategory.gridRow};--group-color:${groupColors[subcategory.key]};`}
						aria-hidden="true"
					></div>
				{/each}

				{#each HEALTH_HOUSING_ROWS as row, rowIndex (`${row.group}-${row.label}`)}
					{@const gridRow = dataGridRows.get(rowIndex) ?? rowIndex + 3}

					<div
						class={`factor-label group-${row.group}`}
						class:last-row={rowIndex === HEALTH_HOUSING_ROWS.length - 1}
						style={`grid-column:2;grid-row:${gridRow};--group-color:${groupColors[row.group]};`}
					>
						{label(row.label)}
					</div>

					{#each row.studies as study, outcomeIndex (`${row.label}-${outcomeIndex}`)}
						{@const key = `${rowIndex}-${outcomeIndex}`}
						<div
							class="matrix-cell"
							class:last-outcome={outcomeIndex === HEALTH_OUTCOMES.length - 1}
							class:last-row={rowIndex === HEALTH_HOUSING_ROWS.length - 1}
							style={`grid-column:${outcomeIndex + 3};grid-row:${gridRow};`}
						>
							{#if study}
								<a
									class="study-link"
									href={study.url}
									target="_blank"
									rel="noreferrer"
									style={`--dot-color:${groupColors[row.group]};`}
									aria-label={`${label(row.label)} et ${label(HEALTH_OUTCOMES[outcomeIndex])} : ${study.title}`}
									aria-describedby={tooltip?.key === key ? 'health-housing-study-tooltip' : undefined}
									onpointerenter={(event) =>
										showPointerTooltip(event, key, study, groupColors[row.group])}
									onpointermove={(event) =>
										showPointerTooltip(event, key, study, groupColors[row.group])}
									onpointerleave={() => clearTooltip(key)}
									onfocus={(event) =>
										showFocusTooltip(event, key, study, groupColors[row.group])}
									onblur={() => clearTooltip(key)}
								>
									<span class="study-dot" aria-hidden="true"></span>
								</a>
							{/if}
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>

	{#if tooltip}
		<div
			id="health-housing-study-tooltip"
			class="study-tooltip"
			role="tooltip"
			style={`left:${tooltip.x}px;top:${tooltip.y}px;--tooltip-color:${tooltip.color};`}
		>
			<div class="study-tooltip-title">{tooltip.study.title}</div>
			<div class="study-tooltip-citation">
				{HEALTH_HOUSING_CITATIONS[tooltip.study.url]}
			</div>
		</div>
	{/if}
</figure>

<style>
	.diagram {
		margin: 0;
		font-family: 'Open Sans', Arial, ui-sans-serif, system-ui, sans-serif;
		font-stretch: normal;
		color: #121212;
	}

	.diagram-scroll {
		overflow-x: auto;
		overscroll-behavior-inline: contain;
		border: 1px solid #dadad7;
		scrollbar-color: #a8a8a5 transparent;
	}

	.diagram-board {
		min-width: 1230px;
		background: #fff;
	}

	.skyline-header {
		position: relative;
		height: 90px;
		overflow: hidden;
		border-bottom: 1px solid #dadad7;
		background: #fff;
	}

	.skyline-header img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: fill;
	}

	.skyline-header h2 {
		position: relative;
		z-index: 1;
		scroll-margin-top: 80px;
		width: 210px;
		margin: 0;
		padding: 22px 0 0 20px;
		font-size: 21px;
		font-weight: 700;
		line-height: 1.04;
		letter-spacing: -0.035em;
	}

	.matrix-grid {
		display: grid;
		grid-template-columns: 56px 208px repeat(7, minmax(138px, 1fr));
		grid-template-rows:
			30px 64px
			20px repeat(2, 30px)
			20px repeat(4, 30px)
			20px repeat(3, 30px)
			20px repeat(3, 30px);
		min-width: 1230px;
	}

	.health-domain {
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid #dadad7;
		font-size: 12.5px;
		font-weight: 700;
		line-height: 1.1;
	}

	.physical-domain {
		grid-column: 3 / 7;
		grid-row: 1;
	}

	.mental-domain {
		grid-column: 7 / 10;
		grid-row: 1;
	}

	.domain-frame,
	.domain-divider {
		z-index: 5;
		pointer-events: none;
	}

	.domain-frame {
		grid-row: 1 / 3;
	}

	.physical-frame {
		grid-column: 3 / 7;
		border-left: 1px solid #dadad7;
	}

	.mental-frame {
		grid-column: 7 / 10;
	}

	.domain-divider {
		grid-column: 7;
		grid-row: 1 / -1;
		justify-self: start;
		width: 0;
		border-left: 1px dashed #dadad7;
	}

	.outcome-spacer {
		grid-column: 1 / 3;
		grid-row: 1 / 3;
		position: sticky;
		left: 0;
		z-index: 4;
		border-bottom: 1px solid #dadad7;
		background: #fff;
	}

	.outcome-label {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px 7px;
		border-right: 1px solid #dadad7;
		border-bottom: 1px solid #dadad7;
		font-size: 9px;
		font-weight: 600;
		line-height: 1.15;
		text-align: center;
	}

	.outcome-label.before-domain-divider,
	.outcome-label.last-outcome {
		border-right: 0;
	}

	.parent-category {
		position: sticky;
		left: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid var(--parent-color);
		border-bottom: 1px solid #dadad7;
		background: color-mix(in srgb, var(--parent-color) 10%, white);
		color: var(--parent-color);
		overflow: hidden;
	}

	.parent-category span {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1.05;
		text-align: center;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}

	.subcategory-label {
		position: sticky;
		left: 56px;
		z-index: 3;
		display: flex;
		align-items: center;
		padding: 0 10px;
		border-right: 1px solid #dadad7;
		border-bottom: 1px solid var(--group-color);
		background: color-mix(in srgb, var(--group-color) 7%, white);
		color: var(--group-color);
		font-size: 8.5px;
		font-weight: 700;
		line-height: 1.05;
	}

	.subcategory-rule {
		border-bottom: 1px solid var(--group-color);
		background: color-mix(in srgb, var(--group-color) 7%, white);
	}

	.factor-label {
		position: sticky;
		left: 56px;
		z-index: 2;
		display: flex;
		align-items: center;
		padding: 0 10px;
		border-right: 1px solid #dadad7;
		border-bottom: 1px solid #dadad7;
		background: #fff;
		font-size: 10px;
		font-weight: 500;
		line-height: 1.1;
	}

	.matrix-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid #dadad7;
		border-bottom: 1px solid #dadad7;
	}

	.matrix-cell.last-outcome {
		border-right: 0;
	}

	.factor-label.last-row,
	.matrix-cell.last-row {
		border-bottom: 0;
	}

	.study-link {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		background: transparent;
		color: inherit;
		text-decoration: none;
		transition: background-color 120ms ease;
	}

	.study-dot {
		display: block;
		width: 9px;
		height: 9px;
		border: 0;
		border-radius: 999px;
		background: var(--dot-color);
		box-shadow: none;
		transition: transform 120ms ease;
	}

	.study-link:hover .study-dot,
	.study-link:focus-visible .study-dot {
		transform: scale(1.4);
		box-shadow: none;
	}

	.study-link:hover,
	.study-link:focus-visible {
		background: color-mix(in srgb, var(--dot-color) 6%, white);
	}

	.study-link:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 2px var(--dot-color);
	}

	.study-tooltip {
		position: fixed;
		z-index: 100;
		width: min(330px, calc(100vw - 24px));
		transform: translateY(-100%);
		border: 1px solid #dadad7;
		background: #fff;
		box-shadow: 0 12px 28px rgb(18 18 18 / 0.16);
		color: #121212;
		padding: 11px 13px;
		font-size: 12px;
		line-height: 1.35;
		pointer-events: none;
	}

	.study-tooltip-title {
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--tooltip-color);
		text-underline-offset: 3px;
	}

	.study-tooltip-citation {
		margin-top: 7px;
		color: #555;
		font-size: 10.75px;
		font-weight: 400;
		line-height: 1.4;
	}

	@media (max-width: 767px) {
		.skyline-header h2 {
			padding-left: 20px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.study-link,
		.study-dot {
			transition: none;
		}
	}
</style>
