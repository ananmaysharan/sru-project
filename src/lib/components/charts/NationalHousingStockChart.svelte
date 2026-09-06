<script lang="ts">
	import { onMount } from 'svelte';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { nationalHousingStock } from '$lib/data/charts/national-housing-stock';
	import { language } from '$lib/i18n';

	let chartEl: HTMLDivElement;

	function optionFor(width: number) {
		const compact = width < 520;
		const shownYears = new Set(['1920', '1940', '1960', '1980', '2000', '2022']);
		const years = nationalHousingStock.map((d) => String(d.year));
		const values = nationalHousingStock.map((d) => d.units);

		return {
			tooltip: {
				trigger: 'axis',
				showContent: true,
				axisPointer: { type: 'line', lineStyle: { color: GRAPHICS_COLORS.secondaryText, width: 1 } },
				valueFormatter: (v: number) => v.toLocaleString($language === 'fr' ? 'fr-FR' : 'en-US')
			},
			grid: { left: compact ? 48 : 56, right: 12, top: 16, bottom: compact ? 42 : 80 },
			xAxis: {
				type: 'category', data: years,
				axisLine: { show: true, lineStyle: { color: GRAPHICS_COLORS.grid } },
				axisTick: { show: false },
				axisLabel: {
					fontSize: compact ? 9 : 11,
					color: GRAPHICS_COLORS.secondaryText,
					interval: 0,
					rotate: compact ? 0 : 90,
					formatter: compact ? (value: string) => shownYears.has(value) ? value : '' : undefined
				}
			},
			yAxis: {
				type: 'value', min: 0, max: 140000, interval: compact ? 40000 : 20000,
				axisLine: { show: false }, axisTick: { show: false },
				splitLine: { show: true, lineStyle: { color: GRAPHICS_COLORS.grid, type: 'dashed', width: 0.5 } },
				axisLabel: { fontSize: compact ? 9 : 11, color: GRAPHICS_COLORS.secondaryText, formatter: (v: number) => v.toLocaleString($language === 'fr' ? 'fr-FR' : 'en-US') }
			},
			series: [{ type: 'bar', data: values, barWidth: compact ? '72%' : '60%', itemStyle: { color: GRAPHICS_COLORS.primary }, emphasis: { itemStyle: { color: GRAPHICS_COLORS.focus } } }]
		};
	}

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			chart.setOption(optionFor(chartEl.clientWidth));

			ro = new ResizeObserver(() => {
				chart.setOption(optionFor(chartEl.clientWidth), true);
				chart.resize();
			});
			ro.observe(chartEl);
		});

		return () => {
			ro?.disconnect();
			chart?.dispose();
		};
	});
</script>

<div bind:this={chartEl} class="h-full w-full"></div>
