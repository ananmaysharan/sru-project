<script lang="ts">
	import Logos from '../elements/Logos.svelte';
</script>


<section class="pb-12 relative w-full">
	<!-- Hero image with title overlay -->
	<div class="relative w-full flex flex-col items-center justify-start overflow-hidden">
		<img
			src="/intro-hero.jpeg"
			alt="View from a Parisian balcony"
			class="w-full h-auto object-contain mask-b-from-30% mask-b-to-100%"
		/>
		<div class="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-transparent mask-b-from-70% mask-b-to-100%"></div>

		<div class="absolute inset-0 z-10 flex items-start justify-center pt-[15vh] md:pt-[33vh]">
			<div class="text-center  max-w-3xl">
			<h1 class="text-4xl md:text-6xl font-medium text-white leading-tight">
				The Loi SRU, 25 years later
			</h1>
			<p class="mt-4 text-lg md:text-xl text-white/80">Magda Maaoui</p>
			</div>
		</div>
	</div>

	<!-- Body text -->
<div
  class="relative z-20 max-w-3xl mx-auto  text-gray-700 flex flex-col gap-4 text-lg leading-relaxed"
>		
		<p>
			Twenty-five years ago, in December 2000, the SRU Law (Loi Solidarité et Renouvellement
			Urbain) was passed in France, requiring selected municipalities to devote 25% of their
			local stock to social housing, in order to curb growing trends of segregation.
		</p>

		<p>
			In this project, I ask what impact this law has had on the rebalancing of social housing
			stocks for municipalities across the country, particularly those not complying with set
			quotas. Building on previous research, this paper is part exclusionary politics analysis,
			part supply analysis, and part neighborhood outcomes analysis, particularly when it comes
			to health outcomes.
		</p>

		<p>
			I use GIS and regression models to underscore how much of the mission set twenty-five
			years ago, of "moving people to opportunity", and unlocking resources to offer them a
			better quality of life, has been achieved. I hypothesize that the reality is that we are
			faced with a patchwork of outcomes depending strongly on local land use regimes and
			political willingness to comply with a state-mandated law.
		</p>

		<p>
			I also hypothesize that while a lot of rebalancing still needs to happen, particularly in
			the most exclusionary municipalities, the mission of rebalancing social housing stocks,
			and hence unlocking access to better amenities and resources, has indeed overall been met.
		</p>
	</div>

	<div class="max-w-3xl mx-auto  pt-8 pb-4">
		<h3 class="text-sm font-medium text-gray-500">Supported By:</h3>
	</div>
	<Logos />
</section>
