<script lang="ts">
	import { Combobox } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import * as Select from '$lib/components/ui/select';
	import {
		mapState,
		communeLookup,
		REGION_LOOKUP,
		MAINLAND_CENTER,
		MAINLAND_ZOOM,
		METRIC_CONFIG,
		BIVARIATE_COLORS,
		type MetricType
	} from './map-state.svelte.js';

	let { onflyto }: { onflyto: (center: [number, number], zoom: number) => void } = $props();

	let searchInputEl: HTMLDivElement;

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

<div class="w-full md:w-84 shrink-0 border border-gray-200 bg-white p-4 flex flex-col gap-4">
	<div>
		<p class="text-xs font-medium text-gray-500 mb-1.5">Search</p>
		<Combobox.Root
			type="single"
			bind:open={mapState.searchOpen}
			bind:value={mapState.searchValue}
			onValueChange={handleSearchSelect}
		>
			<div class="relative" bind:this={searchInputEl}>
				<SearchIcon class="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
				<Combobox.Input
					placeholder="Search for a place..."
					class="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-8 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					oninput={(e: Event) => { mapState.searchQuery = (e.target as HTMLInputElement).value; mapState.searchOpen = true; }}
				/>
				{#if mapState.searchQuery.length > 0 || mapState.searchValue}
					<button
						type="button"
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						onclick={clearSearch}
					>
						<XIcon class="size-4" />
					</button>
				{/if}
			</div>
			<Combobox.Content class="w-(--bits-combobox-anchor-width)! max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-md z-50" sideOffset={4}>
				{#if mapState.filteredRegions.length === 0 && mapState.filteredCommunes.length === 0}
					<div class="px-2 py-1.5 text-sm text-muted-foreground">No results found.</div>
				{/if}
				{#if mapState.filteredRegions.length > 0}
					<Combobox.Group>
						<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Regions</Combobox.GroupHeading>
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
				{#if mapState.filteredRegions.length > 0 && mapState.filteredCommunes.length > 0}
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

	<div>
		<p class="text-xs font-medium text-gray-500 mb-1.5">Select Variable</p>
		<Select.Root type="single" value={mapState.activeMetric} onValueChange={handleMetricChange}>
			<Select.Trigger class="w-full">
				{mapState.currentConfig.label}
			</Select.Trigger>
			<Select.Content>
				{#each mapState.metricsForTab as metric (metric)}
					<Select.Item value={metric} label={METRIC_CONFIG[metric].label} />
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div>
		<p class="text-xs font-medium text-gray-500 mb-1.5">Year</p>
		<Select.Root type="single" value={String(mapState.activeYear)} onValueChange={handleYearChange}>
			<Select.Trigger class="w-full">
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
		<p class="text-xs font-medium text-gray-500 mb-2">Legend</p>

		<div class="flex items-stretch gap-2 w-fit">
			<span class="self-center text-[10px] text-gray-500 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
				Social housing →
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
					<span>{mapState.currentConfig.xLow}</span>
					<span>{mapState.currentConfig.xHigh}</span>
				</div>
			</div>
		</div>

		<div class="mt-4 space-y-2">
			<p class="text-[10px] font-medium uppercase tracking-wide text-gray-500">Key patterns</p>
			{#each (['A1', 'A3', 'C1', 'C3'] as const) as cell (cell)}
				{@const insight = mapState.currentConfig.insights[cell]}
				<div class="flex gap-2">
					<span
						class="shrink-0 inline-flex h-4 w-5 items-center justify-center text-[9px] font-mono font-semibold text-gray-900 border border-gray-300"
						style="background-color: {BIVARIATE_COLORS[cell]};"
					>
						{cell}
					</span>
					<div class="text-[11px] leading-tight">
						<p class="font-medium text-gray-900">{insight.title}</p>
						<p class="text-gray-600">{insight.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
