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
		mapState.setActiveYear(Number(v) as 2012 | 2014 | 2018 | 2020);
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

	<div class="mt-auto">
		<svg viewBox="0 0 80 72" class="w-full max-w-[120px]" aria-label="Bivariate legend">
			<g transform="translate(20 4)">
				{#each ['3', '2', '1'] as yLabel, rowIndex (yLabel)}
					{#each ['A', 'B', 'C'] as xLabel, colIndex (xLabel)}
						{@const cell = `${xLabel}${yLabel}` as keyof typeof BIVARIATE_COLORS}
						<rect
							x={colIndex * 18}
							y={rowIndex * 18}
							width="18"
							height="18"
							fill={BIVARIATE_COLORS[cell]}
							stroke="#ffffff"
						/>
					{/each}
				{/each}
			</g>
			<text x="47" y="68" text-anchor="middle" font-size="6" fill="#6b7280">
				{mapState.currentConfig.label} →
			</text>
			<text
				x="10"
				y="31"
				text-anchor="middle"
				font-size="6"
				fill="#6b7280"
				transform="rotate(-90 10 31)"
			>
				SRU Rate →
			</text>
		</svg>
	</div>
</div>
