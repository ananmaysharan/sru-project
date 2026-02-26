<script lang="ts">
	import { onMount } from 'svelte';
	import { supplyByYear } from '$lib/data/supply-summary';

	let chartEl: HTMLDivElement;

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			chart.setOption({
				tooltip: {
					trigger: 'axis',
					formatter: (params: any) => {
						const d = params[0];
						return `${d.name}<br/>${d.value.toLocaleString()} units`;
					}
				},
				xAxis: {
					type: 'category',
					data: supplyByYear.map((d) => d.year),
					axisLabel: { fontSize: 11, interval: 0, rotate: 45 }
				},
				yAxis: {
					type: 'value',
					min: 2900000,
					axisLabel: {
						formatter: (v: number) => `${(v / 1_000_000).toFixed(1)}M`
					}
				},
				series: [
					{
						type: 'bar',
						data: supplyByYear.map((d) => d.total),
						itemStyle: { color: '#3b82f6' }
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
