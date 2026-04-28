<script lang="ts">
	import { asset } from '$app/paths';
	import GalleryLightbox from '$lib/components/gallery/GalleryLightbox.svelte';

	type Headline = {
		id: string;
		thumb: string;
		full: string;
		caption: string;
	};

	const headlineFiles: { file: string; caption: string }[] = [
		{ file: 'March 2015', caption: 'March 2015' },
		{ file: 'September 2015', caption: 'September 2015' },
		{ file: 'October 2015', caption: 'October 2015' },
		{ file: 'April 2016', caption: 'April 2016' },
		{ file: 'April 2016 2', caption: 'April 2016' },
		{ file: 'July 2016', caption: 'July 2016' },
		{ file: 'April 2018', caption: 'April 2018' },
		{ file: 'September 2018', caption: 'September 2018' },
		{ file: 'December 2018', caption: 'December 2018' },
		{ file: 'January 2019', caption: 'January 2019' },
		{ file: 'September 2019', caption: 'September 2019' },
		{ file: 'November 2019', caption: 'November 2019' },
		{ file: 'December 2020', caption: 'December 2020' },
		{ file: 'December 2020 2', caption: 'December 2020' },
		{ file: 'November 2022', caption: 'November 2022' },
		{ file: 'November 2022 2', caption: 'November 2022' },
		{ file: 'March 2023', caption: 'March 2023' },
		{ file: 'January 2024', caption: 'January 2024' },
		{ file: 'February 2024', caption: 'February 2024' },
		{ file: 'April 2024', caption: 'April 2024' },
		{ file: 'April 2024 2', caption: 'April 2024' },
		{ file: 'June 2024', caption: 'June 2024' },
		{ file: 'October 2024', caption: 'October 2024' }
	];

	const headlines: Headline[] = headlineFiles.map(({ file, caption }) => ({
		id: file,
		thumb: `/headlines/optimized/${file}-thumb.webp`,
		full: `/headlines/optimized/${file}-full.webp`,
		caption
	}));

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
