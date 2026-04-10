<script lang="ts">
	import Gallery from '$lib/components/gallery/Gallery.svelte';
	import HealthMap from '$lib/components/maps/health-map/HealthMap.svelte';
</script>

<section id="demographics" class="py-12">
	<div class="max-w-3xl mx-auto ">
		<h2 class="text-3xl font-bold">The Health Outcomes</h2>
		<p class="mt-2 text-lg text-gray-600">An intra-urban analysis of desegregation and improved quality of life</p>
	</div>
	<div class="max-w-7xl mx-auto h-175 mt-8 px-4">
		<HealthMap />
	</div>
	<div class="max-w-3xl mx-auto mt-8">
		<p class="mt-4 text-gray-700">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
			veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
			occaecat cupidatat non proident, sunt in culpa qui officia deserunt
			mollit anim id est laborum.
		</p>
	</div>
	<div class="max-w-3xl mx-auto mt-8">
		<Gallery />
	</div>
</section>
