<script lang="ts">
	import { asset } from '$app/paths';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';

	type GalleryImage = { id: string; thumb: string; full: string; caption: string };

	let {
		open = $bindable(false),
		startIndex = 0,
		images = []
	}: {
		open: boolean;
		startIndex: number;
		images: GalleryImage[];
	} = $props();

	let api = $state<CarouselAPI>();
	let current = $state(0);

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap();
			api.on('select', () => {
				current = api!.selectedScrollSnap();
			});
		}
	});

	$effect(() => {
		if (api && open) {
			api.scrollTo(startIndex, true);
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		class="max-w-[95vw] sm:max-w-[90vw] max-h-[95vh] p-2 sm:p-4 gap-2 rounded-none"
		showCloseButton={true}
	>
		<Dialog.Header class="sr-only">
			<Dialog.Title>Photo Gallery</Dialog.Title>
		</Dialog.Header>

		<Carousel.Root
			opts={{ loop: true, startIndex }}
			setApi={(emblaApi) => (api = emblaApi)}
			class="w-full"
		>
			<Carousel.Content>
				{#each images as image, i (image.id)}
					<Carousel.Item>
						<div class="flex flex-col items-center justify-center">
							<img
								src={asset(image.full)}
								alt={image.caption || image.id}
								class="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
								loading={Math.abs(i - startIndex) <= 1 ? 'eager' : 'lazy'}
							/>
							{#if image.caption}
								<p class="text-black/80 text-sm mt-2 text-center">{image.caption}</p>
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous class="!-translate-y-1/2 !left-2" />
			<Carousel.Next class="!-translate-y-1/2 !right-2" />
		</Carousel.Root>

		<div class="text-black/60 text-xs text-center">
			{current + 1} / {images.length}
		</div>
	</Dialog.Content>
</Dialog.Root>
