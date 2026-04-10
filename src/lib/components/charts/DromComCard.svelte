<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import * as Select from '$lib/components/ui/select';
	import { Badge } from '$lib/components/ui/badge';
	import { dromComTerritories } from '$lib/data/charts/drom-com-summary';

	let selectedName = $state(dromComTerritories[0].name);
	let selected = $derived(dromComTerritories.find((t) => t.name === selectedName)!);

	let mapContainer: HTMLDivElement;
	let mapInstance: maplibregl.Map | null = null;

	function formatNumber(n: number): string {
		return n.toLocaleString('en-US');
	}

	function handleSelect(v: string | undefined) {
		if (!v) return;
		selectedName = v;
		const territory = dromComTerritories.find((t) => t.name === v);
		if (territory && mapInstance) {
			mapInstance.flyTo({ center: territory.center, zoom: territory.zoom, duration: 1500 });
		}
	}

	onMount(() => {
		const map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://api.maptiler.com/maps/019c9bab-38a8-7ebc-bf4f-b90831ca3b2c/style.json?key=m3VGXFgqJJ3wGAftMEUC',
			center: selected.center,
			zoom: selected.zoom,
			attributionControl: false
		});
		map.addControl(new maplibregl.AttributionControl({ compact: true }));
		map.addControl(new maplibregl.NavigationControl(), 'top-right');
		mapInstance = map;

		return () => map.remove();
	});
</script>

<div class="border border-gray-200 bg-white flex flex-col gap-0">
	<!-- Map -->

	<div class="p-5 flex flex-col gap-4">
		<!-- Territory selector -->
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

		<!-- Location & classification pills -->
		<div class="flex flex-wrap gap-1.5">
			<Badge variant="secondary">{selected.location}</Badge>
			<Badge variant="outline">{selected.status}</Badge>
		</div>

		<!-- Stats boxes -->
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

			<div bind:this={mapContainer} class="w-full h-48"></div>

	</div>
</div>
