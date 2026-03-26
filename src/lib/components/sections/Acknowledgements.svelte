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

<section id="acknowledgements" class="px-8 py-12">
	<h2 class="text-3xl font-bold">Acknowledgements</h2>
	<div class="mt-6 space-y-6 text-base text-gray-700">
		<div>
			<h3 class="text-lg font-semibold text-gray-900">Grant Sponsors</h3>
			{#if soup.isReady}
				<div class="mt-3 flex items-center justify-center flex-nowrap">
					{#each soup.normalizedLogos as logo, i (logo.src + i)}
						<span
							class="inline-block align-middle"
							style:padding="8px"
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
		</div>
		<div>
			<h3 class="text-lg font-semibold text-gray-900">Research Assistantship Team</h3>
			<p class="mt-1">Ananmay Sharan, Sebastian Rodriguez, Matt Thibodeau, Yihan Zhang, Anishta Khan</p>
		</div>
		<div>
			<h3 class="text-lg font-semibold text-gray-900">Data Access and Policy Context</h3>
			<p class="mt-1">Julie Bergeot, Cl&eacute;ment Petitimbert</p>
		</div>
	</div>
</section>
