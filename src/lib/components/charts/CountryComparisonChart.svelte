<script lang="ts">
	import { onMount } from 'svelte';
	import { socialRentalByCountry } from '$lib/data/charts/european-social-rental-summary';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';

	let { countryCode = '' }: { countryCode?: string } = $props();
	let chartEl: HTMLDivElement;
	let chart: ReturnType<typeof import('echarts')['init']> | null = null;
	let chartReady = $state(false);

	let countryData = $derived(
		socialRentalByCountry.find((d) => d.iso3 === countryCode) ?? null
	);

	let hasData = $derived(
		countryData !== null &&
			(countryData.socialRentalSharePctStart !== null ||
				countryData.socialRentalSharePctEnd !== null)
	);


	function updateChart() {
		if (!chart) return;

		if (!hasData || !countryData) {
			chart.clear();
			return;
		}

		const rows = [
			countryData.socialRentalSharePctStart !== null
				? {
						year: String(countryData.startYear),
						value: countryData.socialRentalSharePctStart,
						color: GRAPHICS_COLORS.contextStrong
					}
				: null,
			countryData.socialRentalSharePctEnd !== null
				? {
						year: String(countryData.endYear),
						value: countryData.socialRentalSharePctEnd,
						color: GRAPHICS_COLORS.primaryDark
					}
				: null
		].filter((row): row is NonNullable<typeof row> => row !== null);

		chart.setOption(
			{
				title: {
					text: 'SOCIAL RENTAL SHARE (%)',
					left: 0,
					top: 0,
					textStyle: {
						fontSize: 10,
						fontWeight: 500,
						color: GRAPHICS_COLORS.secondaryText
					}
				},
				tooltip: {
					trigger: 'item',
					formatter: (params: any) =>
						`<strong>${params.name}</strong><br/>${Number(params.value).toFixed(1)}% social rental housing`
				},
				grid: { left: 38, right: 42, top: 30, bottom: 22 },
				xAxis: {
					type: 'value',
					min: 0,
					max: 40,
					interval: 10,
					axisLine: { lineStyle: { color: GRAPHICS_COLORS.grid } },
					axisTick: { show: false },
					axisLabel: {
						fontSize: 10,
						color: GRAPHICS_COLORS.secondaryText,
						formatter: '{value}%'
					},
					splitLine: {
						lineStyle: { color: GRAPHICS_COLORS.grid, width: 0.5, type: 'dashed' }
					}
				},
				yAxis: {
					type: 'category',
					inverse: true,
					data: rows.map((row) => row.year),
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: { fontSize: 10, color: GRAPHICS_COLORS.secondaryText }
				},
				series: [
					{
						type: 'bar',
						barWidth: 22,
						data: rows.map((row) => ({
							value: row.value,
							itemStyle: { color: row.color }
						})),
						label: {
							show: true,
							position: 'right',
							distance: 6,
							fontSize: 10,
							fontWeight: 600,
							color: GRAPHICS_COLORS.secondaryText,
							formatter: (params: any) => `${Number(params.value).toFixed(1)}%`
						},
						emphasis: { disabled: true }
					}
				],
				animationDurationUpdate: 220,
				animationEasingUpdate: 'cubicOut'
			},
			true
		);
	}

	onMount(() => {
		let observer: ResizeObserver | null = null;
		let disposed = false;

		import('echarts').then((echarts) => {
			if (disposed) return;
			chart = echarts.init(chartEl);
			chartReady = true;
			observer = new ResizeObserver(() => chart?.resize());
			observer.observe(chartEl);
		});

		return () => {
			disposed = true;
			observer?.disconnect();
			chart?.dispose();
			chart = null;
		};
	});

	$effect(() => {
		if (!chartReady) return;
		countryCode;
		countryData;
		updateChart();
	});
</script>

<div class="country-comparison-chart">
	<div
		bind:this={chartEl}
		class="chart-canvas"
		class:chart-canvas--hidden={!hasData}
		aria-hidden={!hasData}
	></div>

	{#if !countryCode}
		<p>Select a country on the map</p>
	{:else if !hasData}
		<p>No data available for this country.</p>
	{/if}
</div>

<style>
	.country-comparison-chart {
		position: relative;
		height: 8.25rem;
		width: 100%;
	}

	.chart-canvas {
		height: 100%;
		width: 100%;
	}

	.chart-canvas--hidden {
		visibility: hidden;
	}

	p {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		margin: 0;
		transform: translateY(-50%);
		color: #9ca3af;
		font-size: 0.875rem;
		font-style: italic;
	}
</style>
