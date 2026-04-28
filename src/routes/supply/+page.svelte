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
	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-bold">The Numbers</h2>
		<p class="mt-2 text-lg text-gray-600">
			An increase in production, a geographic redistribution
		</p>
		<p class="mt-4 text-gray-700">
			Over the past two decades, France has steadily expanded its stock of social housing, but this growth has not been evenly shared across the country. New units have been concentrated in certain regions and large urban areas, while many affluent communes continue to under‑produce. These charts show both the overall rise in supply and the ways in which territory still structures who gets access to HLM.
		</p>
	</div>

	<div class="max-w-3xl mx-auto mt-8 px-4 sm:px-6">
		<img
			src={asset("/supply-infographic.png")}
			alt="Supply infographic"
			class="w-full h-auto border border-gray-200"
		/>
	</div>

	<div class="max-w-3xl mx-auto mt-8 px-4 sm:px-6">
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

	<!-- <div class="max-w-3xl mx-auto mt-8 px-4 sm:px-6">
		<div class="border border-gray-200 rounded-none p-4">
			<h4 class="text-sm font-semibold text-gray-700 mb-2">
				Total Social Housing Units (2004–2022)
			</h4>
			<div class="h-56">
				<SupplyLineChart />
			</div>
		</div>
	</div> -->

	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h3 class="mt-12 text-2xl font-semibold">Regional Breakdown</h3>
		<p class="mt-4 text-gray-700">
			Looking at the data by region reveals stark contrasts in social‑housing provision. Some regions, often those with long‑standing public‑housing traditions or acute affordability pressures, host a large share of the national stock. Others remain well below national averages, illustrating how historical planning choices, local politics, and land markets shape where low‑income households can realistically live.
		</p>
	</div>
	<div class="mx-4 mt-8 flex flex-col gap-4 md:mx-12 md:flex-row">
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

	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h3 class="mt-12 text-2xl font-semibold">Supply Map</h3>
		<p class="mt-4 text-gray-700">
			This interactive map makes it possible to zoom in from regions to departments and communes to see how the SRU objectives translate on the ground. By toggling variables such as the SRU rate, users can identify territories that exceed, meet, or fall far short of the law’s targets. The map is a tool for visualizing spatial inequalities in access to social housing at multiple scales and over time.
		</p>
		<!-- <div class="mt-3 flex flex-col gap-1 text-sm text-gray-600">
			<p><span class="font-medium text-gray-800">SRU Rate (%)</span> — Share of social housing units relative to the commune's total housing stock, as defined by Article 55 of the SRU law.</p>
			<p><span class="font-medium text-gray-800">Total Supply</span> — Absolute number of social housing units (logements sociaux) counted in the commune.</p>
		</div> -->
	</div>
	<div class="mt-4">
		<div class="mx-4 h-[60vh] min-h-80 md:mx-12 md:h-175">
			<Map />
		</div>
	</div>

	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h3 class="mt-12 text-2xl font-semibold">Non-Compliance</h3>
		<p class="mt-2 text-lg text-gray-600">
			Which communes did not meet their objectives?
		</p>
		<p class="mt-4 text-gray-700">
			Despite the overall increase in social‑housing units, many communes repeatedly fail to meet their legally required SRU quotas. This section tracks, year by year, which municipalities were officially declared non‑compliant and thus subject to financial penalties or a temporary loss of control over building permits. It highlights the persistence of local resistance and the limits of enforcement mechanisms.
		</p>
	</div>
	<div class="mx-4 mt-4 flex flex-col gap-4 md:mx-12 md:flex-row">
		<img
			src={asset("/noncompliance-1.png")}
			alt="Noncompliant communes page 1 (2005–2022)"
			class="w-full min-w-0 object-contain md:flex-1"
		/>
		<img
			src={asset("/noncompliance-2.png")}
			alt="Noncompliant communes page 2 (2005–2022)"
			class="w-full min-w-0 object-contain md:flex-1"
		/>
	</div>


	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h3 class="mt-12 text-2xl font-semibold">Overseas Terrories</h3>
		<p class="mt-4 text-gray-700">
In France’s overseas territories, the dynamics of social housing are shaped by rapid demographic growth, colonial legacies, and high levels of poverty. Although some territories display relatively high formal SRU rates, the quantitative indicators often mask severe overcrowding, informal settlements, and inadequate infrastructure. Focusing on places like French Guiana shows how the housing question intersects with broader struggles over land, environment, and basic services.		</p>
			<div class="mx-auto mt-6">
		<DromComCard />
	</div>
	</div>



	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h3 class="mt-12 text-2xl font-semibold">European Context</h3>
		<p class="mt-4 text-gray-700">
			Placing France alongside its European neighbors underscores that social housing systems can be organized in very different ways. Some countries treat social housing as a large, universal sector, while others reserve it for the poorest households or have dramatically reduced their stock. Comparing these models helps situate the SRU law within a wider debate about how states use housing policy to regulate inequality and segregation.
		</p>
	</div>
	<div class="mt-4">
		<div class="mx-4 h-[60vh] min-h-80 md:mx-12 md:h-175">
			<EuropeanMap />
		</div>
	</div>
</section>
