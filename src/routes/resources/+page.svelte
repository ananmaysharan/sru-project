<script lang="ts">
	import { language } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const text = $derived({
		title: data.content.title[$language],
		sourceLinkLabel: data.content.sourceLinkLabel[$language],
		sections: data.content.sections[$language],
	});
</script>


<section id="resources" class="page-shell">
	<div class="prose-column">
		<h1 class="page-title">{text.title}</h1>
		
		<div class="index-groups text-gray-700">
			{#each text.sections as section (section.id)}
				<section class="index-group">
					<h2>{section.title}</h2>
					<ul>
					{#each section.items as item (item.id)}
							<li>
								{item.text}
								{#if item.url}
									<a
										href={item.url}
										target="_blank"
										rel="noreferrer"
										class="ml-1 text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900"
									>
					{text.sourceLinkLabel}
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
