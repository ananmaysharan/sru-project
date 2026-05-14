<script lang="ts">
	import { asset } from '$app/paths';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';
	import { headlines } from '$lib/data/charts/news-headlines';

	let lightboxOpen = $state(false);
	let startIndex = $state(0);

	function openLightbox(index: number) {
		startIndex = index;
		lightboxOpen = true;
	}
</script>

<div class="max-w-3xl mx-auto px-4">
	<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
		{#each headlines as headline, i (headline.id)}
			<button
				type="button"
				class="group flex aspect-4/3 items-center justify-center overflow-hidden border border-gray-200 bg-white p-3 transition-transform duration-200 ease-out hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				onclick={() => openLightbox(i)}
			>
				<img
					src={asset(headline.thumb)}
					alt={headline.caption || headline.id}
					loading="lazy"
					draggable="false"
					class="max-h-full max-w-full object-contain"
				/>
			</button>
		{/each}
	</div>
</div>

<GalleryLightbox bind:open={lightboxOpen} {startIndex} images={headlines} />
