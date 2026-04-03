<script lang="ts">
	import { socialRentalByCountry } from '$lib/data/charts/european-social-rental-summary';

	let { countryCode = '' }: { countryCode?: string } = $props();

	const MAX_PCT = 40;

	let countryData = $derived(
		socialRentalByCountry.find((d) => d.iso3 === countryCode) ?? null
	);

	let hasData = $derived(
		countryData !== null &&
			(countryData.socialRentalSharePctStart !== null ||
				countryData.socialRentalSharePctEnd !== null)
	);

	let startPct = $derived(countryData?.socialRentalSharePctStart ?? 0);
	let endPct = $derived(countryData?.socialRentalSharePctEnd ?? 0);
	let startYear = $derived(countryData?.startYear ?? '—');
	let endYear = $derived(countryData?.endYear ?? '—');
</script>

{#if !countryCode}
	<p class="text-sm text-gray-400 italic">Select a country on the map</p>
{:else if !hasData}
	<p class="text-sm text-gray-400 italic">No data available for this country.</p>
{:else}
	<div class="flex flex-col gap-3">
		<p class="text-xs font-medium text-gray-500 uppercase tracking-wide">
			Social Rental Share (%)
		</p>

		<div class="flex flex-col gap-2">
			{#if countryData?.socialRentalSharePctStart !== null && countryData?.socialRentalSharePctStart !== undefined}
				<div class="flex flex-col gap-1">
					<div class="flex items-center justify-between text-xs text-gray-600">
						<span>{startYear}</span>
						<span class="font-semibold text-gray-800">{startPct.toFixed(1)}%</span>
					</div>
					<div class="h-5 w-full rounded bg-gray-100 overflow-hidden">
						<div
							class="h-full rounded bg-gray-400 bar-fill"
							style="width: {(startPct / MAX_PCT) * 100}%"
						></div>
					</div>
				</div>
			{/if}

			{#if countryData?.socialRentalSharePctEnd !== null && countryData?.socialRentalSharePctEnd !== undefined}
				<div class="flex flex-col gap-1">
					<div class="flex items-center justify-between text-xs text-gray-600">
						<span>{endYear}</span>
						<span class="font-semibold text-gray-800">{endPct.toFixed(1)}%</span>
					</div>
					<div class="h-5 w-full rounded bg-gray-100 overflow-hidden">
						<div
							class="h-full rounded bg-gray-800 bar-fill"
							style="width: {(endPct / MAX_PCT) * 100}%"
						></div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.bar-fill {
		transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
