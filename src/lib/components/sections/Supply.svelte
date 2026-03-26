<script lang="ts">
	import Map from '$lib/components/map/Map.svelte';
	import SupplyLineChart from '$lib/components/charts/SupplyLineChart.svelte';
	import SupplyPieChart from '$lib/components/charts/SupplyPieChart.svelte';
	import SupplyRegionalChart from '$lib/components/charts/SupplyRegionalChart.svelte';
</script>

<section id="supply" class="px-8 py-12">
	<h2 class="text-3xl font-bold">The Numbers</h2>
	<p class="mt-2 text-lg text-gray-600">An increase in production, a geographic redistribution</p>

	<div class="mt-8 border border-gray-200 rounded-none p-4">
		<h4 class="text-sm font-semibold text-gray-700 mb-2">Total Social Housing Units (2004–2022)</h4>
		<div class="h-56">
			<SupplyLineChart />
		</div>
	</div>

	<h3 class="mt-12 text-2xl font-semibold">Regional Breakdown</h3>
	<div class="mt-8 flex flex-col md:flex-row gap-4">
		<div class="flex-1 min-w-0 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700">Social Housing Unit Distribution (2022)</h4>
			<p class="text-xs text-gray-400 mb-2">Click on a region to see its departments</p>
			<div class="h-125">
				<SupplyPieChart />
			</div>
		</div>
		<div class="flex-1 min-w-0 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">Social Housing Units per 10,000 Inhabitants (2023)</h4>
			<div class="h-125">
				<SupplyRegionalChart />
			</div>
		</div>
	</div>

	<h3 class="mt-12 text-2xl font-semibold">Map</h3>
	<div class="mt-3 flex flex-col gap-1 text-sm text-gray-600">
		<p><span class="font-medium text-gray-800">SRU Rate (%)</span> — Share of social housing units relative to the commune's total housing stock, as defined by Article 55 of the SRU law.</p>
		<p><span class="font-medium text-gray-800">Total Supply</span> — Absolute number of social housing units (logements sociaux) counted in the commune.</p>
	</div>
	<div class="mt-4">
		<div class="w-full h-175">
			<Map />
		</div>
	</div>
</section>
