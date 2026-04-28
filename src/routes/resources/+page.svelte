<script lang="ts">
	import { resourceDate, resourceSections } from '$lib/data/resources/sru-news-index';
</script>

<section id="resources" class="py-12">
	<div class="max-w-3xl mx-auto px-4 sm:px-6">
		<h2 class="text-3xl font-bold">Resources</h2>
		
		<div class="mt-6 space-y-8 text-base text-gray-700">
			{#each resourceSections as section (section.title)}
				<div>
					<h3 class="text-lg font-semibold text-gray-900">{section.title}</h3>
					<ul class="mt-2 space-y-3 list-none">
						{#each section.items as item}
							<li>
								{item.text}
								{#if item.url}
									<a
										href={item.url}
										target="_blank"
										rel="noreferrer"
										class="ml-1 text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900"
									>
										Source
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
