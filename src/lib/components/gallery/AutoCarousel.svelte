<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import PlayIcon from '@lucide/svelte/icons/play';
	import PauseIcon from '@lucide/svelte/icons/pause';

	type Image = { src: string; alt?: string; caption?: string };

	let {
		images,
		interval = 4000,
		aspect = 'aspect-[4/3]',
		overlayTitle
	}: { images: Image[]; interval?: number; aspect?: string; overlayTitle?: string } = $props();

	let index = $state(0);
	let paused = $state(false);
	let landscape = $state<boolean[]>([]);
	const hasCaptions = $derived(images.some((img) => img.caption));
	const portraitActive = $derived(landscape[index] === false);

	function onImageLoad(event: Event, i: number) {
		const img = event.currentTarget as HTMLImageElement;
		landscape[i] = img.naturalWidth > img.naturalHeight;
	}

	onMount(() => {
		if (images.length <= 1) return;
		const id = setInterval(() => {
			if (paused) return;
			index = (index + 1) % images.length;
		}, interval);
		return () => clearInterval(id);
	});
</script>

<div class="relative w-full">
	<div
		class="relative block w-full {aspect} overflow-hidden {portraitActive ? 'bg-black' : 'bg-gray-100'}"
		role="group"
		aria-roledescription="carousel"
	>
		{#each images as image, i (image.src)}
			<img
				src={asset(image.src)}
				alt={image.alt ?? ''}
				class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out {landscape[i] ? 'object-cover' : 'object-contain'}"
				style:opacity={i === index ? 1 : 0}
				loading={i === 0 ? 'eager' : 'lazy'}
				onload={(e) => onImageLoad(e, i)}
			/>
		{/each}

		{#if overlayTitle}
			<div class="absolute left-0 top-0 z-10 px-4 py-4 text-white">
				<h2 class="text-4xl font-bold leading-tight">
					{#each overlayTitle.split('\n') as line, i (i)}
						{#if i > 0}<br />{/if}{line}
					{/each}
				</h2>
			</div>
		{/if}

		{#if hasCaptions && images[index]?.caption}
			<div class="pointer-events-none absolute bottom-0 left-0 z-10 p-4">
				<p
					class="max-w-xs text-sm leading-relaxed text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)] sm:max-w-sm sm:text-base"
				>
					{images[index]?.caption}
				</p>
			</div>
		{/if}

		{#if images.length > 1}
			<div class="absolute right-0 top-0 z-10 flex gap-1.5 p-3">
				{#each images as _, i (i)}
					<button
						type="button"
						aria-label="Go to slide {i + 1}"
						class="w-2 h-2 rounded-full transition-colors {i === index ? 'bg-white' : 'bg-white/50'}"
						onclick={() => (index = i)}
					></button>
				{/each}
			</div>
			<button
				type="button"
				aria-label={paused ? 'Play' : 'Pause'}
				class="absolute right-0 bottom-0 z-10 m-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
				onclick={() => (paused = !paused)}
			>
				{#if paused}
					<PlayIcon class="h-4 w-4" />
				{:else}
					<PauseIcon class="h-4 w-4" />
				{/if}
			</button>
		{/if}
	</div>
</div>
