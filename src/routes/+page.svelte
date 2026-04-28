<script lang="ts">
	import { asset } from '$app/paths';
	import HeroChart from '$lib/components/charts/HeroChart.svelte';
	import NewsHeadlines from '$lib/components/charts/NewsHeadlines.svelte';
	import Logos from '$lib/components/elements/Logos.svelte';
</script>

<section class="py-12 relative w-full">
	<div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
		<div class="flex flex-col">
			<img
				src={asset('/intro-hero.jpeg')}
				alt="View from a Parisian balcony"
				class="w-full h-auto object-cover"
			/>
			<h1 class="mt-6 text-2xl md:text-3xl font-medium text-gray-900 leading-tight">
				The Loi SRU, 25 years later
			</h1>
			<p class="mt-2 text-base md:text-lg text-gray-600">Magda Maaoui</p>
		</div>

		<div class="text-gray-700 flex flex-col gap-4 text-lg leading-relaxed">
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
	</div>

	<div class="max-w-6xl mx-auto px-6 pt-12 pb-4">
		<h3 class="text-sm font-medium text-gray-500">Supported By:</h3>
	</div>
	<Logos />
</section>

<section id="introduction" class="py-12">
	<div class="max-w-3xl mx-auto">
		<h2 class="text-3xl font-bold">Introduction</h2>
		<p class="mt-2 text-lg text-gray-600">25 years of fair-share housing provision</p>

		<p class="mt-4 text-gray-700">
			France's social housing has grown steadily between 2000-2025 with delivery
			of new units reaching a historic peak of over 80,000 per year for the first
			time since the 1970s. Projects built across France's regions have proven to be
			diverse in design, size, and location.
		</p>
	</div>

	<div class="w-full mt-8">
		<HeroChart />
	</div>
</section>

<section id="in-the-news" class="py-12">
	<div class="max-w-3xl mx-auto">
		<p class="mt-2 text-lg text-gray-600">
		Together, these media headlines trace how, over the years, the SRU law has been formally upheld as an instrument against territorial and social apartheid, even as local and national actors repeatedly seek to weaken or bypass its social-housing obligations, through budget cuts, legal challenges, strategic avoidance by mayors, and mobilized resident opposition to new social housing construction, particularly in wealthier communities.
		</p>
	</div>

	<div class="max-w-7xl mx-auto mt-12">
		<NewsHeadlines />
	</div>
</section>
