<script lang="ts">
	import { onMount } from 'svelte';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { nationalHousingStock } from '$lib/data/charts/national-housing-stock';

	let chartEl: HTMLDivElement;

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			const years = nationalHousingStock.map((d) => String(d.year));
			const values = nationalHousingStock.map((d) => d.units);

			chart.setOption({
				tooltip: {
					trigger: 'axis',
					showContent: false,
					axisPointer: {
						type: 'line',
						lineStyle: { color: GRAPHICS_COLORS.secondaryText, width: 1 }
					}
				},
				grid: { left: 56, right: 16, top: 16, bottom: 80 },
				xAxis: {
					type: 'category',
					data: years,
					axisLine: { show: true, lineStyle: { color: GRAPHICS_COLORS.grid } },
					axisTick: { show: false },
					axisLabel: {
						fontSize: 11,
						color: GRAPHICS_COLORS.secondaryText,
						interval: 0,
						rotate: 90
					}
				},
				yAxis: {
					type: 'value',
					min: 0,
					max: 140000,
					interval: 20000,
					axisLine: { show: false },
					axisTick: { show: false },
					splitLine: {
						show: true,
						lineStyle: { color: GRAPHICS_COLORS.grid, type: 'dashed', width: 0.5 }
					},
					axisLabel: {
						fontSize: 11,
						color: GRAPHICS_COLORS.secondaryText,
						formatter: (v: number) => v.toLocaleString()
					}
				},
				series: [
					{
						type: 'bar',
						data: values,
						barWidth: '60%',
						itemStyle: { color: GRAPHICS_COLORS.primary },
						emphasis: { itemStyle: { color: GRAPHICS_COLORS.focus } }
					}
				]
			});

			ro = new ResizeObserver(() => chart.resize());
			ro.observe(chartEl);
		});

		return () => {
			ro?.disconnect();
			chart?.dispose();
		};
	});
</script>

<div bind:this={chartEl} class="h-full w-full"></div>
