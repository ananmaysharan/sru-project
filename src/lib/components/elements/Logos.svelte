<script lang="ts">
	import { createLogoSoup } from '@sanity-labs/logo-soup/svelte';
	import { getVisualCenterTransform } from '@sanity-labs/logo-soup';

	const logos: { src: string; alt: string }[] = [
		{ src: '/logos/gsd.svg', alt: 'Harvard GSD' },
		{ src: '/logos/harvard_university.svg', alt: 'Harvard University' },
		{ src: '/logos/hdsi.png', alt: 'Harvard Data Science Initiative' },
		{ src: '/logos/mellon_urban_initiative.png', alt: 'Harvard Mellon Urban Initiative' },
		{ src: '/logos/hcjs.svg', alt: 'Harvard Joint Center for Housing Studies' },
		{ src: '/logos/mtel.jpg', alt: 'French Ministry of Housing' }
	];

	const soup = createLogoSoup();

	$effect(() => {
		soup.process({ logos, baseSize: 60, scaleFactor: 0.5 });
	});

	$effect(() => {
		return () => soup.destroy();
	});
</script>

{#if soup.isReady}
	<div class="mt-3 grid w-full max-w-3xl mx-auto  grid-cols-2 place-items-center gap-x-2 gap-y-1 md:grid-cols-3">
		{#each soup.normalizedLogos as logo, i (logo.src + i)}
			<span
				class="inline-block align-middle"
				style:padding="4px"
				style:opacity={soup.isLoading ? 0 : 1}
				style:transition="opacity 0.2s ease-in-out"
			>
				<img
					src={logo.croppedSrc || logo.src}
					alt={logo.alt}
					width={logo.normalizedWidth}
					height={logo.normalizedHeight}
					style:display="block"
					style:object-fit="contain"
					style:width="{logo.normalizedWidth}px"
					style:height="{logo.normalizedHeight}px"
					style:transform={getVisualCenterTransform(logo, 'visual-center-y')}
				/>
			</span>
		{/each}
	</div>
{/if}
