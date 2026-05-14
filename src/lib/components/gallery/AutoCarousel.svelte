<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import PlayIcon from '@lucide/svelte/icons/play';
	import PauseIcon from '@lucide/svelte/icons/pause';

	type Image = { src: string; alt?: string };

	let {
		images,
		interval = 4000,
		aspect = 'aspect-[4/3]'
	}: { images: Image[]; interval?: number; aspect?: string } = $props();

	let index = $state(0);
	let paused = $state(false);

	onMount(() => {
		if (images.length <= 1) return;
		const id = setInterval(() => {
			if (paused) return;
			index = (index + 1) % images.length;
		}, interval);
		return () => clearInterval(id);
	});
</script>

<div class="w-full">
	<div
		class="relative w-full {aspect} overflow-hidden bg-gray-100 border border-gray-200"
		role="group"
		aria-roledescription="carousel"
	>
		{#each images as image, i (image.src)}
			<img
				src={asset(image.src)}
				alt={image.alt ?? ''}
				class="absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out"
				style:opacity={i === index ? 1 : 0}
				loading={i === 0 ? 'eager' : 'lazy'}
			/>
		{/each}
	</div>

	{#if images.length > 1}
		<div class="mt-3 flex items-center justify-between gap-3">
			<div class="flex gap-1.5">
				{#each images as _, i}
					<button
						type="button"
						aria-label="Go to slide {i + 1}"
						class="w-2 h-2 rounded-full transition-colors {i === index ? 'bg-gray-800' : 'bg-gray-300'}"
						onclick={() => (index = i)}
					></button>
				{/each}
			</div>
			<button
				type="button"
				aria-label={paused ? 'Play' : 'Pause'}
				class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
				onclick={() => (paused = !paused)}
			>
				{#if paused}
					<PlayIcon class="h-4 w-4" />
				{:else}
					<PauseIcon class="h-4 w-4" />
				{/if}
			</button>
		</div>
	{/if}
</div>
