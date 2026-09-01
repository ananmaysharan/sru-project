<script lang="ts">
	import { resourceSections } from '$lib/data/resources/sru-news-index';
	import { resourceSectionsFr } from '$lib/data/resources-fr';
	import { language } from '$lib/i18n';

	const sections = $derived($language === 'fr' ? resourceSectionsFr : resourceSections);
</script>


<section id="resources" class="page-shell">
	<div class="prose-column">
		<h1 class="page-title">{$language === 'fr' ? 'Revue de presse' : 'News Sources'}</h1>
		
		<div class="index-groups text-gray-700">
			{#each sections as section (section.title)}
				<section class="index-group">
					<h2>{section.title}</h2>
					<ul>
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
									{$language === 'fr' ? 'Source' : 'Source'}
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	</div>
</section>
