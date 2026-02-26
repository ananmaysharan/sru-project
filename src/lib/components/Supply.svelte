<script lang="ts">
	import Map from './Map.svelte';
	import SupplyBarChart from './SupplyBarChart.svelte';
	import SupplyPieChart from './SupplyPieChart.svelte';

	let selectedName = $state<string | null>(null);
	let selectedType = $state<'region' | 'commune' | null>(null);

	function handleSelect(name: string, type: 'region' | 'commune') {
		selectedName = name;
		selectedType = type;
	}
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
	<div class="mt-4 relative">
		<div class="w-full h-[700px]">
			<Map onSelect={handleSelect} />
		</div>
		{#if selectedName}
			<div class="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-6 min-w-[200px]">
				<button
					class="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-lg leading-none"
					onclick={() => { selectedName = null; selectedType = null; }}
				>&times;</button>
				<p class="text-xs font-medium uppercase tracking-wide text-gray-400">
					{selectedType === 'region' ? 'Region' : 'Commune'}
				</p>
				<h4 class="mt-1 text-2xl font-bold text-gray-900">{selectedName}</h4>
			</div>
		{/if}
	</div>
</section>
