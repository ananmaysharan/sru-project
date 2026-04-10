<script lang="ts">
	import { asset } from '$app/paths';
	import galleryData from '$lib/data/charts/gallery-manifest.json';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';

	let lightboxOpen = $state(false);
	let startIndex = $state(0);

	function openLightbox(index: number) {
		startIndex = index;
		lightboxOpen = true;
	}
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
	{#each galleryData as image, i (image.id)}
		<button
			type="button"
			class="overflow-hidden cursor-pointer group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
			onclick={() => openLightbox(i)}
		>
			<img
				src={asset(image.thumb)}
				alt={image.caption || image.id}
				loading="lazy"
				class="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</button>
	{/each}
</div>

<GalleryLightbox bind:open={lightboxOpen} {startIndex} images={galleryData} />
