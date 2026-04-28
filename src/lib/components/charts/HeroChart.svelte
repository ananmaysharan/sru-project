<script lang="ts">
	import { asset } from '$app/paths';
	import { onMount } from 'svelte';
	import { timelineYears, legislations } from '$lib/data/charts/hero-timeline';

	let containerEl: HTMLDivElement;
	let containerWidth = $state(0);
	const showAllLabels = $derived(containerWidth > 640);

	const pad = 50;
	const innerWidth = 1000;
	const totalWidth = innerWidth + pad * 2;

	function yearToX(year: number): number {
		return pad + ((year - 2000) / 25) * innerWidth;
	}

	onMount(() => {
		const observer = new ResizeObserver((entries) => {
			containerWidth = entries[0].contentRect.width;
		});
		observer.observe(containerEl);
		return () => observer.disconnect();
	});
</script>

<div class="w-full" bind:this={containerEl}>
	<div style="padding-left: {pad / totalWidth * 100}%; padding-right: {pad / totalWidth * 100}%;">
		<img
			src={asset('/buildings.png')}
			alt="French social housing buildings growing from 2000 to 2025"
			class="w-full h-auto block"
		/>
	</div>

	<svg class="w-full h-auto" viewBox="0 0 {totalWidth} 60">
		<line x1={pad} y1={25} x2={pad + innerWidth} y2={25} stroke="#4b5563" stroke-width="1" />

		{#each timelineYears as { year, highlighted }}
			{@const cx = yearToX(year)}
			<g>
				{#if highlighted}
					<circle {cx} cy={25} r={15} fill="#C4A882" opacity={0.2} />
				{/if}
				<circle {cx} cy={25} r={3} fill={highlighted ? '#4b5563' : '#6b7280'} />
				{#if highlighted || showAllLabels}
					<text
						x={cx}
						y={48}
						text-anchor="middle"
						font-size="10"
						font-weight={highlighted ? 'medium' : 'normal'}
						fill={highlighted ? '#374151' : '#6b7280'}
					>
						{year}
					</text>
				{/if}
			</g>
		{/each}
	</svg>

	<!-- Legislation table — single grid so columns align vertically.
	     Below sm, allow horizontal scrolling so the 9-column comparative table
	     doesn't push the page past the viewport. -->
	<div class="mt-6 overflow-x-auto sm:overflow-visible">
		<div
			class="grid grid-cols-[auto_repeat(8,minmax(80px,1fr))] gap-x-4 gap-y-3 items-start px-6 min-w-[640px] sm:min-w-0 sm:grid-cols-[auto_repeat(8,1fr)]"
		>
			<!-- Row 1: Law names/dates -->
			<div></div>
			{#each legislations as law}
				<div>
					<h3 class="text-xs sm:text-sm font-bold text-red-800">{law.name}</h3>
					<p class="text-[8px] sm:text-[10px] italic text-gray-600 leading-tight mt-0.5">{law.fullName}</p>
					<p class="text-[7px] sm:text-[9px] text-gray-400 mt-1">{law.date}</p>
				</div>
			{/each}

			<!-- Row 2: Key Objectives -->
			<div class="pr-2">
				<p class="text-[8px] sm:text-[10px] font-semibold text-gray-800">Key</p>
				<p class="text-[8px] sm:text-[10px] font-semibold text-gray-800">Objectives</p>
			</div>
			{#each legislations as law}
				<p class="text-[6px] sm:text-[8px] text-gray-600 leading-tight">{law.objectives}</p>
			{/each}

			<!-- Row 3: Key Sanctions -->
			<div class="pr-2">
				<p class="text-[8px] sm:text-[10px] font-semibold text-gray-800">Key</p>
				<p class="text-[8px] sm:text-[10px] font-semibold text-gray-800">Sanctions</p>
			</div>
			{#each legislations as law}
				<p class="text-[6px] sm:text-[8px] text-gray-600 leading-tight">{law.sanctions || '—'}</p>
			{/each}
		</div>
	</div>
</div>
