<script lang="ts">
	import { asset } from '$app/paths';
	import * as Tabs from '$lib/components/ui/tabs';

	const regions = [
		{
			value: 'paris',
			label: 'Paris',
			images: ['/plans/paris-01.jpg']
		},
		{
			value: 'brittany',
			label: 'Brittany',
			images: ['/plans/brittany-01.jpg', '/plans/brittany-02.jpg', '/plans/brittany-04.jpg']
		},
		{
			value: 'riviera',
			label: 'French Riviera',
			images: []
		},
		{
			value: 'overseas',
			label: 'Overseas Territories',
			images: []
		}
	];
</script>

<section id="socio-econometrics" class="py-12">
	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-bold">The Lived Experiences</h2>
		<p class="mt-2 text-lg text-gray-600">
			A zoom on four case studies, from Paris to Brittany, the French Riviera to the overseas
			territories
		</p>
	</div>

	<div class="w-full  mt-8">
		<Tabs.Root value="paris">
			<Tabs.List
				variant="line"
				class="flex w-full max-w-3xl mx-auto overflow-x-auto whitespace-nowrap px-4 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{#each regions as region (region.value)}
					<Tabs.Trigger value={region.value} class="shrink-0">{region.label}</Tabs.Trigger>
				{/each}
			</Tabs.List>

			{#each regions as region (region.value)}
				<Tabs.Content value={region.value} class="max-w-3xl mx-auto px-4 sm:px-6">
					{#if region.images.length > 0}
						<div class="flex flex-col md:flex-row gap-4 mt-4">
							{#each region.images as src}
								<img
									src={asset(src)}
									alt="{region.label} plan"
									class="w-full rounded border border-gray-200 {region.images.length === 1 ? '' : 'md:flex-1 md:min-w-0'}"
								/>
							{/each}
						</div>
					{:else}
						<p class="mt-4 text-sm text-gray-400 italic">No images yet.</p>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</div>
</section>
