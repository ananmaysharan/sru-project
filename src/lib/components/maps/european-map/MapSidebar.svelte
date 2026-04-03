<script lang="ts">
	import CountryComparisonChart from '$lib/components/charts/CountryComparisonChart.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { socialRentalByCountry } from '$lib/data/charts/european-social-rental-summary';
	import { socialMixPolicies } from '$lib/data/charts/european-social-mix-policies';

	let { countryName = '', countryCode = '' }: { countryName?: string; countryCode?: string } =
		$props();

	let countryData = $derived(
		socialRentalByCountry.find((d) => d.iso3 === countryCode) ?? null
	);

	let policy = $derived(
		socialMixPolicies.find((d) => d.iso3 === countryCode) ?? null
	);
</script>

<div class="w-full md:w-84 shrink-0 border border-gray-200 bg-white p-4 flex flex-col gap-4">
	{#if countryName}
		<div class="flex flex-col gap-2">
			<h3 class="text-lg font-semibold text-gray-900">{countryName}</h3>
			{#if countryData?.euMember || countryData?.oecdMember}
				<div class="flex flex-wrap gap-1.5">
					{#if countryData.euMember}
						<Badge variant="secondary">EU Member</Badge>
					{/if}
					{#if countryData.oecdMember}
						<Badge variant="secondary">OECD Member</Badge>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<CountryComparisonChart {countryCode} />

	{#if policy}
		<div class="flex flex-col gap-2 border-t border-gray-200 pt-4">
			<h4 class="text-sm font-semibold text-gray-900">Policy: {policy.policyName}</h4>
			{#if policy.years}
				<p class="text-xs text-gray-500">Year Established: {policy.years}</p>
			{/if}
			{#if policy.category}
				<Badge variant="outline">{policy.category}</Badge>
			{/if}
			<h5 class="text-xs font-semibold text-gray-700 mt-1">Description</h5>
			<p class="text-xs leading-relaxed text-gray-700">{policy.description}</p>
			<h5 class="text-xs font-semibold text-gray-700 mt-1">Comparison to SRU</h5>
			<p class="text-xs leading-relaxed text-gray-500">{policy.differenceFromSru}</p>
		</div>
	{/if}
</div>
