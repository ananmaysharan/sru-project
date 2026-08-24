<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import * as Select from '$lib/components/ui/select';
	import { Badge } from '$lib/components/ui/badge';
	import { dromComTerritories } from '$lib/data/charts/drom-com-summary';

	let selectedName = $state(dromComTerritories[0].name);
	let selected = $derived(dromComTerritories.find((territory) => territory.name === selectedName)!);
	let mapContainer: HTMLDivElement;
	let mapInstance: maplibregl.Map | null = null;
	const territoryPadding = 32;

	function formatNumber(value: number): string {
		return value.toLocaleString('en-US');
	}

	function fitTerritory(territory: (typeof dromComTerritories)[number], duration = 0) {
		if (!mapInstance) return;
		mapInstance.resize();
		mapInstance.fitBounds(territory.bounds, {
			padding: territoryPadding,
			maxZoom: 13,
			duration
		});
	}

	function handleSelect(value: string | undefined) {
		if (!value) return;
		selectedName = value;
		const territory = dromComTerritories.find((item) => item.name === value);
		if (territory) fitTerritory(territory, 900);
	}

	onMount(() => {
		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC',
			bounds: selected.bounds,
			fitBoundsOptions: {
				padding: territoryPadding,
				maxZoom: 13
			},
			attributionControl: false
		});
		map.addControl(new maplibregl.AttributionControl({ compact: true }));
		map.addControl(new maplibregl.NavigationControl(), 'top-right');
		mapInstance = map;

		let resizeFrame = 0;
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(resizeFrame);
			resizeFrame = requestAnimationFrame(() => fitTerritory(selected));
		});
		resizeObserver.observe(mapContainer);

		return () => {
			resizeObserver.disconnect();
			cancelAnimationFrame(resizeFrame);
			map.remove();
		};
	});
</script>

<div class="border border-gray-200 bg-white flex flex-col gap-0">
	<div class="p-5 flex flex-col gap-4">
		<Select.Root type="single" value={selectedName} onValueChange={handleSelect}>
			<Select.Trigger class="w-full">
				{selectedName}
			</Select.Trigger>
			<Select.Content>
				{#each dromComTerritories as territory}
					<Select.Item value={territory.name} label={territory.name} />
				{/each}
			</Select.Content>
		</Select.Root>

		<div class="flex flex-wrap gap-1.5">
			<Badge variant="secondary">{selected.location}</Badge>
			<Badge variant="outline">{selected.status}</Badge>
		</div>

		<div class="flex gap-3">
			<div class="flex-1 border border-gray-200 rounded-md p-3 text-center">
				<p class="text-lg font-semibold text-gray-900">{formatNumber(selected.population)}</p>
				<p class="text-xs text-gray-500">Population ({selected.popYear})</p>
			</div>
			<div class="flex-1 border border-gray-200 rounded-md p-3 text-center">
				{#if selected.socialHousingRate !== null}
					<p class="text-lg font-semibold text-gray-900">{selected.socialHousingRate}%</p>
				{:else}
					<p class="text-lg font-semibold text-gray-400">N/A</p>
				{/if}
				<p class="text-xs text-gray-500">Social Housing Rate ({selected.socialHousingYear})</p>
			</div>
		</div>

		<div bind:this={mapContainer} class="locator-map w-full h-96"></div>
	</div>
</div>

<style>
	.locator-map :global(canvas.maplibregl-canvas) {
		filter: grayscale(1) saturate(0) contrast(0.92);
	}
</style>
