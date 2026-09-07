<script lang="ts">
	import type { GlossaryContent } from '$lib/data/site-content';
	import { language } from '$lib/i18n';

	let { content }: { content: GlossaryContent } = $props();
</script>

<div lang={$language}>
	<h2 class="text-xl font-bold text-gray-900">{content.title}</h2>

	<div class="mt-4 space-y-4 text-gray-700">
		<p><strong>{content.socialStockTerm}</strong> {content.socialStockDefinition}</p>

		<p><strong>{content.qpvTerm}</strong> {content.qpvDefinition}</p>

		<div>
			<p class="font-semibold text-gray-900">{content.financingTitle}</p>
			<ul class="mt-2 list-disc space-y-1 pl-5">
				<li><strong>PLAI</strong> = {content.plai};</li>
				<li><strong>PLUS</strong> = {content.plus};</li>
				<li><strong>PLS</strong> = {content.pls};</li>
				<li><strong>PLI</strong> = {content.pli}.</li>
			</ul>
		</div>

		<div>
			<p class="font-semibold text-gray-900">{content.providersTitle}</p>
			<ul class="mt-2 list-disc space-y-1 pl-5">
				<li><strong>OPH</strong> = {content.oph};</li>
				<li><strong>ESH</strong> = {content.esh};</li>
				<li><strong>SEM</strong> = {content.sem}.</li>
			</ul>
		</div>
	</div>
</div>
