<script lang="ts">
	import { asset } from "$app/paths";
	import Map from "$lib/components/maps/main-map/Map.svelte";
	import EuropeanMap from "$lib/components/maps/european-map/EuropeanMap.svelte";
	import SupplyLineChart from "$lib/components/charts/SupplyLineChart.svelte";
	import ResidencesStackedChart from "$lib/components/charts/ResidencesStackedChart.svelte";
	import SupplyPieChart from "$lib/components/charts/SupplyPieChart.svelte";
	import SupplyRegionalChart from "$lib/components/charts/SupplyRegionalChart.svelte";
	import DromComCard from "$lib/components/charts/DromComCard.svelte";
</script>

<section id="supply" class="py-12">
	<div class="max-w-3xl mx-auto">
		<h2 class="text-3xl font-bold">The Numbers</h2>
		<p class="mt-2 text-lg text-gray-600">
			An increase in production, a geographic redistribution
		</p>
		<p class="mt-4 text-gray-700">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
			eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
			ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
			aliquip ex ea commodo consequat. Duis aute irure dolor in
			reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
			pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
			culpa qui officia deserunt mollit anim id est laborum.
		</p>
	</div>

	<div class="max-w-3xl mx-auto mt-8">
		<img
			src={asset("/supply-infographic.png")}
			alt="Supply infographic"
			class="w-full h-auto border border-gray-200"
		/>
	</div>

	<div class="max-w-3xl mx-auto mt-8">
		<div class="border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700">
				France: Main Type of Residences Occupied (1984–2023)
			</h4>
			<p class="text-xs text-gray-400 mb-2">
				Millions of housing units (lodgements) per household
			</p>
			<div class="h-96">
				<ResidencesStackedChart />
			</div>
		</div>
	</div>

	<div class="max-w-3xl mx-auto mt-8">
		<div class="border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">
				Total Social Housing Units (2004–2022)
			</h4>
			<div class="h-56">
				<SupplyLineChart />
			</div>
		</div>
	</div>

	<div class="max-w-3xl mx-auto">
		<h3 class="mt-12 text-2xl font-semibold">Regional Breakdown</h3>
		<p class="mt-4 text-gray-700">
			Sed quis nisl accumsan enim porttitor dignissim eget nec felis. Cras
			tempor sagittis ullamcorper. Nulla facilisi. Phasellus gravida
			rhoncus viverra. Aenean ipsum nisl, volutpat in erat a, malesuada
			lobortis ante. Nam egestas massa vitae ultrices fermentum. Nulla
			facilisi. Integer ut gravida augue. Aenean in iaculis nunc, id
			tincidunt justo. Phasellus sem erat, maximus a ullamcorper eu,
			rhoncus at nulla. Nullam dui urna, tempus non mattis vel, tincidunt
			quis massa. Nam placerat ex interdum ullamcorper lacinia. Vestibulum
			mauris enim, ultricies ut posuere ut, venenatis quis quam. Class
			aptent taciti sociosqu ad litora torquent per conubia nostra, per
			inceptos himenaeos. Mauris ut erat lectus.
		</p>
	</div>
	<div class="mx-12 mt-8 flex flex-col md:flex-row gap-4">
		<div class="flex-1 min-w-0 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700">
				Social Housing Unit Distribution (2022)
			</h4>
			<p class="text-xs text-gray-400 mb-2">
				Click on a region to see its departments
			</p>
			<div class="h-100">
				<SupplyPieChart />
			</div>
		</div>
		<div class="flex-1 min-w-0 border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">
				Social Housing Units per 10,000 Inhabitants (2023)
			</h4>
			<div class="h-100">
				<SupplyRegionalChart />
			</div>
		</div>
	</div>

	<div class="max-w-3xl mx-auto">
		<h3 class="mt-12 text-2xl font-semibold">Supply Map</h3>
		<p class="mt-4 text-gray-700">
			Curabitur nisi dolor, sagittis eget consectetur eu, rutrum at ex.
			Proin venenatis eu est nec ornare. Maecenas luctus accumsan
			placerat. Nullam metus libero, pharetra vel felis in, vestibulum
			condimentum erat. Aenean sapien orci, molestie eu mi vel, pretium
			fringilla nisl. Proin vitae leo turpis. Vestibulum nec dolor
			blandit, gravida mauris id, dignissim dolor. Phasellus gravida,
			velit ut rhoncus accumsan, eros turpis suscipit urna, a iaculis mi
			odio eget nibh.
		</p>
		<!-- <div class="mt-3 flex flex-col gap-1 text-sm text-gray-600">
			<p><span class="font-medium text-gray-800">SRU Rate (%)</span> — Share of social housing units relative to the commune's total housing stock, as defined by Article 55 of the SRU law.</p>
			<p><span class="font-medium text-gray-800">Total Supply</span> — Absolute number of social housing units (logements sociaux) counted in the commune.</p>
		</div> -->
	</div>
	<div class="mt-4">
		<div class="mx-12 h-175">
			<Map />
		</div>
	</div>

	<div class="max-w-3xl mx-auto">
		<h3 class="mt-12 text-2xl font-semibold">Non-Compliance</h3>
		<p class="mt-2 text-lg text-gray-600">
			Which communes did not meet their objectives?
		</p>
		<p class="mt-4 text-gray-700">
			Proin blandit euismod nisi, sit amet varius nunc luctus id. Nullam
			sit amet diam feugiat sapien varius placerat eu sed leo. Vivamus
			magna erat, ullamcorper volutpat metus eu, congue auctor est. Morbi
			ut dui non quam porta auctor. In tristique maximus felis in finibus.
			Ut sit amet porta libero. Vivamus vitae fermentum eros, eu lacinia
			turpis. Praesent erat mi, laoreet laoreet massa sit amet,
			pellentesque venenatis tellus. Maecenas magna nisl, elementum sed
			maximus venenatis, sollicitudin nec nulla. Vivamus ut urna magna.
		</p>
	</div>
	<div class="mx-12 mt-4 flex flex-row gap-4">
		<img
			src={asset("/noncompliance-1.png")}
			alt="Noncompliant communes page 1 (2005–2022)"
			class="flex-1 min-w-0 object-contain"
		/>
		<img
			src={asset("/noncompliance-2.png")}
			alt="Noncompliant communes page 2 (2005–2022)"
			class="flex-1 min-w-0 object-contain"
		/>
	</div>


	<div class="max-w-3xl mx-auto">
		<h3 class="mt-12 text-2xl font-semibold">Overseas Terrories</h3>
		<p class="mt-4 text-gray-700">
		Mauris a interdum sapien, lacinia imperdiet nulla. Etiam aliquet accumsan aliquam. Donec sodales sodales ante in fringilla. Nunc placerat lectus sed arcu fringilla sodales. Vestibulum volutpat maximus rhoncus. Sed varius nisi turpis, sed mollis risus blandit eleifend. Curabitur eleifend est pharetra arcu aliquet, vehicula scelerisque ante sollicitudin. Donec bibendum purus vel felis luctus efficitur. Ut et dolor faucibus, varius nisl sed, vestibulum metus. Duis dapibus diam non lorem rutrum, non feugiat lacus feugiat. Ut malesuada dictum lectus, ac euismod orci maximus in. Curabitur id pharetra justo, et sollicitudin nulla. Nullam iaculis velit id diam elementum, sit amet egestas ex pharetra.
		</p>
			<div class="mx-auto mt-6">
		<DromComCard />
	</div>
	</div>



	<div class="max-w-3xl mx-auto">
		<h3 class="mt-12 text-2xl font-semibold">European Context</h3>
		<p class="mt-4 text-gray-700">
			Nunc sagittis cursus quam, ut pharetra justo egestas nec.
			Suspendisse potenti. Nunc id leo sit amet augue dictum pharetra.
			Praesent in lectus ut tortor sollicitudin scelerisque a vitae lorem.
			Nulla viverra turpis non tellus porta, nec lobortis ante blandit.
			Vivamus vehicula, ante et cursus convallis, nulla eros porttitor
			diam, in tempor nunc felis sed augue. Aenean volutpat ac lectus non
			lobortis. Maecenas ultrices tincidunt finibus. Nulla at lobortis
			mauris. Nunc ut hendrerit mi, quis tempor lorem. Suspendisse
			vulputate eu turpis eu tincidunt. In venenatis libero volutpat
			mauris eleifend, porttitor maximus magna aliquet. Cras volutpat
			magna ac elit laoreet pellentesque. Aliquam augue lectus, finibus
			blandit fermentum nec, consectetur a arcu. Duis pellentesque massa
			quis justo iaculis, vel posuere dui vulputate. Pellentesque interdum
			nunc sed metus varius, id auctor est ultrices.
		</p>
	</div>
	<div class="mt-4">
		<div class="mx-12 h-175">
			<EuropeanMap />
		</div>
	</div>
</section>
