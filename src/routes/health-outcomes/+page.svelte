<script lang="ts">
	import Gallery from '$lib/components/gallery/Gallery.svelte';
	import HealthMap from '$lib/components/maps/health-map/HealthMap.svelte';
	import { METRIC_CONFIG } from '$lib/components/maps/health-map/map-state.svelte.js';
</script>

<section id="demographics" class="py-12">
	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-bold">The Health Outcomes</h2>
		<p class="mt-2 text-lg text-gray-600">An intra-urban analysis of desegregation and improved quality of life</p>
			<p class="mt-4 text-gray-700">
			Over the past 25 years, policies that promote “moving to opportunity” and the de-concentration of poverty have been accompanied by measurable improvements in health. As low‑income households gain access to less segregated neighborhoods, with better air quality, safer streets, more green space, and stronger local services, rates of chronic illness, stress‑related conditions, and premature mortality tend to decline. These trends suggest that spatial desegregation is not only a housing or urban‑planning achievement, but a public‑health intervention that can gradually narrow long‑standing health inequalities.
		</p>
	</div>
	<div class="max-w-7xl mx-auto h-[70vh] min-h-96 md:h-175 mt-8 px-4 sm:px-6">
		<HealthMap />
	</div>
	<div class="max-w-3xl mx-auto mt-10 px-4 sm:px-6 space-y-4 text-gray-700">
				<h3 class="text-xl font-bold">Definitions</h3>


		<p>
			<strong>Social housing</strong> Change in
			share of social housing at the commune level, measured in percentage points, split into
			terciles (1 = lowest growth, 3 = highest growth).
		</p>

		<p>
			<strong>Income</strong> {METRIC_CONFIG.income.description}
		</p>
		<p>
			<strong>Poverty</strong> {METRIC_CONFIG.poverty.description}
		</p>
		<p>
			<strong>Elders</strong> {METRIC_CONFIG.elders.description}
		</p>
		<p>
			<strong>Election winner</strong> {METRIC_CONFIG.left.description}
		</p>
		<p>
			<strong>DPE energy efficiency</strong> {METRIC_CONFIG.dpe.description}
		</p>
		<p>
			<strong>Heat islands (MAPUCE)</strong> {METRIC_CONFIG.heat.description}
		</p>
	</div>
	<div class="max-w-3xl mx-auto mt-8 px-4 sm:px-6">
			<h3 class="text-xl font-bold">Gallery</h3>

		<Gallery />
	</div>
</section>
