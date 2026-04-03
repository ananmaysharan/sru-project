<script lang="ts">
	import Map from '$lib/components/maps/main-map/Map.svelte';
	import EuropeanMap from '$lib/components/maps/european-map/EuropeanMap.svelte';
	import SupplyLineChart from '$lib/components/charts/SupplyLineChart.svelte';
	import SupplyPieChart from '$lib/components/charts/SupplyPieChart.svelte';
	import SupplyRegionalChart from '$lib/components/charts/SupplyRegionalChart.svelte';
</script>

<section id="supply" class="py-12">
	<div class="max-w-3xl mx-auto ">
		<h2 class="text-3xl font-bold">The Numbers</h2>
		<p class="mt-2 text-lg text-gray-600">An increase in production, a geographic redistribution</p>
	</div>

	<!-- <div class="max-w-3xl mx-auto  mt-8">
		<div class="border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">Total Social Housing Units (2004–2022)</h4>
			<div class="h-56">
				<SupplyLineChart />
			</div>
		</div>
	</div> -->

	<!-- <div class="max-w-3xl mx-auto ">
		<h3 class="mt-12 text-2xl font-semibold">Regional Breakdown</h3>
	</div> -->
	<div class="w-full  mt-8 flex flex-col md:flex-row gap-4">
		<div class="flex-1 min-w-0 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700">Social Housing Unit Distribution (2022)</h4>
			<p class="text-xs text-gray-400 mb-2">Click on a region to see its departments</p>
			<div class="h-100">
				<SupplyPieChart />
			</div>
		</div>
		<div class="flex-1 min-w-0 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">Social Housing Units per 10,000 Inhabitants (2023)</h4>
			<div class="h-100">
				<SupplyRegionalChart />
			</div>
		</div>
	</div>

	<div class="max-w-3xl mx-auto ">
		<h3 class="mt-12 text-2xl font-semibold">Map</h3>
		<div class="mt-3 flex flex-col gap-1 text-sm text-gray-600">
			<p><span class="font-medium text-gray-800">SRU Rate (%)</span> — Share of social housing units relative to the commune's total housing stock, as defined by Article 55 of the SRU law.</p>
			<p><span class="font-medium text-gray-800">Total Supply</span> — Absolute number of social housing units (logements sociaux) counted in the commune.</p>
		</div>
	</div>
	<div class="mt-4">
		<div class="w-full h-175">
			<Map />
		</div>
	</div>

	<div class="max-w-3xl mx-auto ">
		<h3 class="mt-12 text-2xl font-semibold">Noncompliance</h3>
		<p class="mt-2 text-lg text-gray-600">Communes who did not meet their objective (2005–2022)</p>
	</div>
	<div class="w-full mt-4 flex flex-row gap-4">
		<img src="/noncompliance-1.png" alt="Noncompliant communes page 1 (2005–2022)" class="flex-1 min-w-0 object-contain" />
		<img src="/noncompliance-2.png" alt="Noncompliant communes page 2 (2005–2022)" class="flex-1 min-w-0 object-contain" />
	</div>

	<div class="max-w-3xl mx-auto ">
		<h3 class="mt-12 text-2xl font-semibold">European Context</h3>
	</div>
	<div class="mt-4">
		<div class="w-full h-175">
			<EuropeanMap />
		</div>
	</div>
</section>
