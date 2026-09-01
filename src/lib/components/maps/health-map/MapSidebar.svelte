<script lang="ts">
	import { Combobox } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import * as Select from '$lib/components/ui/select';
	import { language } from '$lib/i18n';
	import {
		mapState as DEFAULT_MAP_STATE,
		MapState,
		communeLookup,
		REGION_LOOKUP,
		MAINLAND_CENTER,
		MAINLAND_ZOOM,
		METRIC_CONFIG,
		BIVARIATE_COLORS,
		CORNER_COLORS,
		type MetricType
	} from './map-state.svelte.js';

	let {
		onflyto,
		mapState = DEFAULT_MAP_STATE
	}: { onflyto: (center: [number, number], zoom: number) => void; mapState?: MapState } = $props();

	let searchInputEl: HTMLDivElement;
	const metricLabelsFr: Record<MetricType, string> = {
		income: 'Revenu médian des ménages', poverty: 'Part des habitants sous le seuil de pauvreté',
		elders: 'Part des personnes âgées de 65 ans ou plus', left: 'Orientation politique municipale',
		dpe: 'Part de bâtiments performants selon le DPE (A–C)', heat: 'Exposition aux îlots de chaleur urbains',
		green: 'Proximité des espaces verts', health: 'Proximité des services de santé'
	};
	function metricLabel(metric: MetricType) {
		return $language === 'fr' ? metricLabelsFr[metric] : METRIC_CONFIG[metric].label;
	}
	const metricExtremesFr: Record<MetricType, [string, string]> = {
		income: ['Revenus faibles', 'Revenus élevés'], poverty: ['Faible pauvreté', 'Forte pauvreté'],
		elders: ['Peu de personnes âgées', 'Beaucoup de personnes âgées'], left: ['Gauche', 'Droite'],
		dpe: ['Faible performance', 'Forte performance'], heat: ['Faible exposition', 'Forte exposition'],
		green: ['Faible proximité', 'Forte proximité'], health: ['Faible proximité', 'Forte proximité']
	};
	const cornerLabelsFr = {
		A1: ['Valeur faible, croissance faible', 'Faible croissance du logement social.'],
		A3: ['Valeur faible, croissance forte', 'Forte croissance du logement social.'],
		C1: ['Valeur élevée, croissance faible', 'Faible croissance du logement social.'],
		C3: ['Valeur élevée, croissance forte', 'Forte croissance du logement social.']
	} as const;
	const incomeCornersFr = {
		A1: ['Rural / en difficulté', 'Revenus faibles + faible croissance — politique de sous-investissement.'],
		A3: ['Rééquilibrant', 'Revenus faibles + forte croissance — investissement malgré une faible base fiscale.'],
		C1: ['Socialement sélectif', 'Revenus élevés + faible croissance — territoire aisé, mais contraint par une offre limitée.'],
		C3: ['Croissance inclusive', 'Revenus élevés + forte croissance — territoires riches développant l’offre de logements sociaux.']
	} as const;
	function cornerLabel(cell: keyof typeof cornerLabelsFr, part: 0 | 1) {
		return (mapState.activeMetric === 'income' ? incomeCornersFr[cell] : cornerLabelsFr[cell])[part];
	}

	function handleSearchSelect(v: string | undefined) {
		if (!v) return;
		if (v.startsWith('region:')) {
			const region = REGION_LOOKUP.find((r) => r.name === v.slice(7));
			if (region) onflyto(region.center, region.zoom);
		} else if (v.startsWith('commune:')) {
			const commune = communeLookup.find((c: { code: string }) => c.code === v.slice(8));
			if (commune) onflyto(commune.center as [number, number], 12);
		}
		mapState.searchQuery = '';
		mapState.searchOpen = false;
	}

	function handleMetricChange(v: string | undefined) {
		if (!v) return;
		mapState.switchMetric(v as MetricType);
	}

	function handleYearChange(v: string | undefined) {
		if (!v) return;
		mapState.setActiveYear(Number(v) as 2012 | 2014 | 2017 | 2018 | 2020 | 2021);
	}

	function clearSearch() {
		mapState.searchQuery = '';
		mapState.searchValue = undefined;
		mapState.searchOpen = false;
		const input = searchInputEl?.querySelector('input');
		if (input) input.value = '';
		onflyto(MAINLAND_CENTER, MAINLAND_ZOOM);
	}
</script>

<div class="flex min-h-0 w-full shrink-0 flex-col gap-5 overflow-y-auto border border-gray-200 bg-white p-5 md:w-84">
	<div>
		<p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-gray-500">{$language === 'fr' ? 'Recherche' : 'Search'}</p>
		<Combobox.Root
			type="single"
			bind:open={mapState.searchOpen}
			bind:value={mapState.searchValue}
			onValueChange={handleSearchSelect}
		>
			<div class="relative" bind:this={searchInputEl}>
				<SearchIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
				<Combobox.Input
					aria-label={$language === 'fr' ? 'Rechercher sur la carte de santé' : 'Search the health map'}
					placeholder={$language === 'fr' ? 'Rechercher un lieu…' : 'Search for a place…'}
					class="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-8 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					oninput={(e: Event) => { mapState.searchQuery = (e.target as HTMLInputElement).value; mapState.searchOpen = true; }}
				/>
				{#if mapState.searchQuery.length > 0 || mapState.searchValue}
					<button
						type="button"
						aria-label={$language === 'fr' ? 'Effacer la recherche' : 'Clear map search'}
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						onclick={clearSearch}
					>
						<XIcon class="size-4" />
					</button>
				{/if}
			</div>
			<Combobox.Content class="w-(--bits-combobox-anchor-width)! max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-md z-50" sideOffset={4}>
				{#if mapState.filteredRegions.length === 0 && mapState.filteredCommunes.length === 0}
					<div class="px-2 py-1.5 text-sm text-muted-foreground">{$language === 'fr' ? 'Aucun résultat.' : 'No results found.'}</div>
				{/if}
				{#if mapState.filteredRegions.length > 0}
					<Combobox.Group>
						<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{$language === 'fr' ? 'Régions' : 'Regions'}</Combobox.GroupHeading>
							{#each mapState.filteredRegions as region (region.name)}
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
				{#if mapState.filteredRegions.length > 0 && mapState.filteredCommunes.length > 0}
					<div role="separator" class="-mx-1 my-1 h-px bg-border"></div>
				{/if}
				{#if mapState.filteredCommunes.length > 0}
					<Combobox.Group>
						<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Communes</Combobox.GroupHeading>
							{#each mapState.filteredCommunes as commune (commune.code)}
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

	<div>
		<p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-gray-500">Variable</p>
		<Select.Root type="single" value={mapState.activeMetric} onValueChange={handleMetricChange}>
			<Select.Trigger class="w-full" aria-label={$language === 'fr' ? 'Variable de la carte de santé' : 'Health map variable'}>
				{metricLabel(mapState.activeMetric)}
			</Select.Trigger>
			<Select.Content>
				{#each mapState.metricsForTab as metric (metric)}
					<Select.Item value={metric} label={metricLabel(metric)} />
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div>
		<p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-gray-500">{$language === 'fr' ? 'Année' : 'Year'}</p>
		<Select.Root type="single" value={String(mapState.activeYear)} onValueChange={handleYearChange}>
			<Select.Trigger class="w-full" aria-label={$language === 'fr' ? 'Année de la carte de santé' : 'Health map year'}>
				{mapState.activeYear}
			</Select.Trigger>
			<Select.Content>
				{#each mapState.availableYears as year (year)}
					<Select.Item value={String(year)} label={String(year)} />
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="mt-auto border-t border-gray-200 pt-4">
		<p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-gray-500">{$language === 'fr' ? 'Légende' : 'Legend'}</p>

		{#if mapState.cornerMode}
			<div class="space-y-2.5">
				<div class="flex gap-2">
					<span
						class="shrink-0 h-4 w-5 border border-gray-300"
						style="background-color: {CORNER_COLORS.C3};"
					></span>
					<p class="text-[11px] leading-tight text-gray-700">
						<span class="font-medium text-gray-900">{$language === 'fr' ? 'Forte croissance du logement social dans les territoires bien équipés' : 'High social-housing growth in amenity-rich areas'}</span>
					</p>
				</div>
				<div class="flex gap-2">
					<span
						class="shrink-0 h-4 w-5 border border-gray-300"
						style="background-color: {CORNER_COLORS.A3};"
					></span>
					<p class="text-[11px] leading-tight text-gray-700">
						<span class="font-medium text-gray-900">{$language === 'fr' ? 'Forte croissance du logement social dans les territoires sous-équipés' : 'High social-housing growth in amenity-poor areas'}</span>
					</p>
				</div>
			</div>
		{:else}
			<div class="flex items-stretch gap-2 w-fit">
				<span class="self-center text-[10px] text-gray-500 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
					{$language === 'fr' ? 'Logements sociaux →' : 'Social housing →'}
				</span>
				<div class="flex flex-col gap-1 w-fit">
					<div class="flex flex-col">
						{#each ['3', '2', '1'] as yLabel (yLabel)}
							<div class="flex">
								{#each ['A', 'B', 'C'] as xLabel (xLabel)}
									{@const cell = `${xLabel}${yLabel}` as keyof typeof BIVARIATE_COLORS}
									<div class="h-8 w-8" style="background-color: {BIVARIATE_COLORS[cell]};"></div>
								{/each}
							</div>
						{/each}
					</div>
					<div class="flex items-center justify-between text-[10px] text-gray-500" style="width: 96px;">
						<span>{$language === 'fr' ? metricExtremesFr[mapState.activeMetric][0] : mapState.currentConfig.xLow}</span>
						<span>{$language === 'fr' ? metricExtremesFr[mapState.activeMetric][1] : mapState.currentConfig.xHigh}</span>
					</div>
				</div>
			</div>

			<div class="mt-4 space-y-2">
				<p class="text-[10px] font-medium uppercase tracking-wide text-gray-500">{$language === 'fr' ? 'Principaux profils' : 'Key patterns'}</p>
				{#each (['A1', 'A3', 'C1', 'C3'] as const) as cell (cell)}
					{@const insight = mapState.currentConfig.insights[cell]}
					<div class="flex gap-2">
							<span
								class="shrink-0 h-4 w-5 border border-gray-300"
								style="background-color: {BIVARIATE_COLORS[cell]};"
							></span>
						<div class="text-[11px] leading-tight">
							<p class="font-medium text-gray-900">{$language === 'fr' ? cornerLabel(cell, 0) : insight.title}</p>
							<p class="text-gray-600">{$language === 'fr' ? cornerLabel(cell, 1) : insight.body}</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}

	</div>
</div>
