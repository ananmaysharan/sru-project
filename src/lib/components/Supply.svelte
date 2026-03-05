<script lang="ts">
	import Map from './Map.svelte';
	import SupplyBarChart from './SupplyBarChart.svelte';
	import SupplyPieChart from './SupplyPieChart.svelte';
</script>

<section id="supply" class="px-8 py-12">
	<h2 class="text-3xl font-bold">Supply</h2>
	<p class="mt-2 text-lg text-gray-600">Subtitle for the supply section</p>

	<div class="mt-8 flex flex-col md:flex-row gap-4">
		<div class="flex-1 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">Total Social Housing Units (2004–2022)</h4>
			<div class="h-56">
				<SupplyBarChart />
			</div>
		</div>
		<div class="flex-1 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">Social Housing by Region (2022)</h4>
			<div class="h-56">
				<SupplyPieChart />
			</div>
		</div>
	</div>

	<div class="mt-8">
		<p class="text-gray-700">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
		</p>
	</div>

	<h3 class="mt-12 text-2xl font-semibold">Map</h3>
	<div class="mt-3 flex flex-col gap-1 text-sm text-gray-600">
		<p><span class="font-medium text-gray-800">SRU Rate (%)</span> — Share of social housing units relative to the commune's total housing stock, as defined by Article 55 of the SRU law.</p>
		<p><span class="font-medium text-gray-800">Total Supply</span> — Absolute number of social housing units (logements sociaux) counted in the commune.</p>
	</div>
	<div class="mt-4">
		<div class="w-full h-[700px]">
			<Map />
		</div>
	</div>
</section>
