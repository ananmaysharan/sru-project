<script lang="ts">
	import { onMount } from 'svelte';
	import { GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { supplyByYear } from '$lib/data/charts/supply-summary';

	let chartEl: HTMLDivElement;

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			chart.setOption({
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
						lineStyle: { color: GRAPHICS_COLORS.secondaryText, width: 1 }
					},
					formatter: (params: any) => {
						const d = params[0];
						return `${d.name}<br/>${d.value.toLocaleString()} units`;
					}
				},
				xAxis: {
					type: 'category',
					data: supplyByYear.map((d) => d.year),
					axisLine: { lineStyle: { color: GRAPHICS_COLORS.grid } },
					axisTick: { show: false },
					axisLabel: {
						fontSize: 11,
						interval: 0,
						rotate: 45,
						color: GRAPHICS_COLORS.secondaryText
					}
				},
				yAxis: {
					type: 'value',
					min: 3000000,
					axisLine: { show: false },
					axisTick: { show: false },
					splitLine: { lineStyle: { color: GRAPHICS_COLORS.grid, width: 0.5 } },
					axisLabel: {
						color: GRAPHICS_COLORS.secondaryText,
						formatter: (v: number) => `${(v / 1_000_000).toFixed(1)}M`
					}
				},
				series: [
					{
						type: 'line',
						data: supplyByYear.map((d) => d.total),
						smooth: true,
						lineStyle: { color: GRAPHICS_COLORS.primary, width: 2.5 },
						itemStyle: { color: GRAPHICS_COLORS.primary },
						emphasis: {
							itemStyle: { color: GRAPHICS_COLORS.focus },
							lineStyle: { color: GRAPHICS_COLORS.primary }
						}
					}
				],
				grid: { left: 60, right: 16, top: 16, bottom: 48 }
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
