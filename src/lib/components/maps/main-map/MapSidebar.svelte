<script lang="ts">
	import { Combobox } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import { language, formatNumber } from '$lib/i18n';
	import {
		mapState,
		communeLookup,
		departementLookup,
		REGION_LOOKUP,
		MAINLAND_CENTER,
		MAINLAND_ZOOM,
		METRIC_CONFIG,
		type MetricType,
		type TabType
	} from './map-state.svelte.js';

	let { onflyto, onupdate }: { onflyto: (center: [number, number], zoom: number) => void; onupdate: () => void } = $props();

	let searchInputEl: HTMLDivElement;

	const metricLabels: Record<MetricType, { fr: string; en: string }> = {
		rate: { fr: 'Taux SRU (%)', en: 'SRU Rate (%)' },
		units: { fr: 'Logements sociaux', en: 'Social Units' },
		social_per_10k: { fr: 'Logements sociaux pour 10 000 habitants', en: 'Social housing units per 10,000 residents' },
		single_family_pct: { fr: 'Part de logements sociaux individuels (%)', en: 'Share of single-family social housing (%)' },
		multi_family_pct: { fr: 'Part de logements sociaux collectifs (%)', en: 'Share of multi-family social housing (%)' },
		avg_rent_per_sqm: { fr: 'Loyer moyen au mètre carré (€)', en: 'Average rent per square meter (€)' }
	};

	function metricLabel(metric: MetricType) {
		return metricLabels[metric][$language];
	}

	function breakpointLabel(value: number) {
		const number = formatNumber(value, $language);
		if (mapState.activeMetric === 'avg_rent_per_sqm') return `€${number}`;
		return `${number}${mapState.currentConfig.suffix}`;
	}

	function handleSearchSelect(v: string | undefined) {
		if (!v) return;
		if (v.startsWith('region:')) {
			const region = REGION_LOOKUP.find((r) => r.name === v.slice(7));
			if (region) onflyto(region.center, region.zoom);
		} else if (v.startsWith('dept:')) {
			const dept = departementLookup.find((d: { code: string }) => d.code === v.slice(5));
			if (dept) onflyto(dept.center as [number, number], 9);
		} else if (v.startsWith('commune:')) {
			const commune = communeLookup.find((c: { code: string }) => c.code === v.slice(8));
			if (commune) onflyto(commune.center as [number, number], 12);
		}
		mapState.searchQuery = '';
		mapState.searchOpen = false;
	}

	function handleTabChange(v: string) {
		mapState.switchTab(v as TabType);
		onupdate();
	}

	function handleMetricChange(v: string | undefined) {
		if (!v) return;
		mapState.switchMetric(v as MetricType);
		onupdate();
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

<div class="flex w-full shrink-0 flex-col gap-5 border border-gray-200 bg-white p-5 md:w-84">
	<!-- <h3 class="text-2xl font-semibold">Supply Map</h3> -->
	<!-- Tabs -->
	<Tabs.Root bind:value={mapState.activeTab} onValueChange={handleTabChange}>
		<Tabs.List class="w-full">
			<Tabs.Trigger value="communes">Communes</Tabs.Trigger>
			<Tabs.Trigger value="departments">{$language === 'fr' ? 'Départements' : 'Departments'}</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<!-- Search -->
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
					aria-label={$language === 'fr' ? 'Rechercher sur la carte de l’offre' : 'Search the supply map'}
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
				{#if mapState.filteredRegions.length === 0 && mapState.filteredDepartements.length === 0 && mapState.filteredCommunes.length === 0}
					<div class="px-2 py-1.5 text-sm text-muted-foreground">{$language === 'fr' ? 'Aucun résultat.' : 'No results found.'}</div>
				{/if}
				{#if mapState.filteredRegions.length > 0}
					<Combobox.Group>
						<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{$language === 'fr' ? 'Régions' : 'Regions'}</Combobox.GroupHeading>
						{#each mapState.filteredRegions as region}
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
				{#if mapState.filteredRegions.length > 0 && (mapState.filteredDepartements.length > 0 || mapState.filteredCommunes.length > 0)}
					<div role="separator" class="-mx-1 my-1 h-px bg-border"></div>
				{/if}
				{#if mapState.filteredDepartements.length > 0}
					<Combobox.Group>
						<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{$language === 'fr' ? 'Départements' : 'Departments'}</Combobox.GroupHeading>
						{#each mapState.filteredDepartements as dept}
							<Combobox.Item
								value="dept:{dept.code}"
								label={dept.name}
								class="relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
							>
								{dept.name} <span class="text-muted-foreground ml-1">({dept.code})</span>
							</Combobox.Item>
						{/each}
					</Combobox.Group>
				{/if}
				{#if mapState.filteredDepartements.length > 0 && mapState.filteredCommunes.length > 0}
					<div role="separator" class="-mx-1 my-1 h-px bg-border"></div>
				{/if}
				{#if mapState.filteredCommunes.length > 0}
					<Combobox.Group>
						<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Communes</Combobox.GroupHeading>
						{#each mapState.filteredCommunes as commune}
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
		<p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-gray-500">Variable</p>
		<Select.Root type="single" value={mapState.activeMetric} onValueChange={handleMetricChange}>
			<Select.Trigger class="w-full" aria-label={$language === 'fr' ? 'Variable de la carte de l’offre' : 'Supply map variable'}>
				{metricLabel(mapState.activeMetric)}
			</Select.Trigger>
			<Select.Content>
				{#each mapState.metricsForTab as metric (metric)}
					<Select.Item value={metric} label={metricLabel(metric)} />
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<!-- Legend -->
	<div class="mt-auto">
		<p class="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-gray-500">
			{metricLabel(mapState.activeMetric)}
		</p>
		<div class="flex flex-col gap-0.5">
			{#each mapState.currentConfig.breaks as breakpoint, i (breakpoint)}
				{@const config = mapState.currentConfig}
				<div class="flex items-center gap-1.5">
					<span
						class="w-4 h-3 rounded-sm inline-block border border-gray-200"
						style="background:{config.colors[i]}"
					></span>
					<span class="text-xs text-gray-600">
						{#if i === config.breaks.length - 1}
							≥ {breakpointLabel(breakpoint)}
						{:else}
							{breakpointLabel(breakpoint)} – {breakpointLabel(config.breaks[i + 1])}
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
