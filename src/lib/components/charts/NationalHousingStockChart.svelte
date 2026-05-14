<script lang="ts">
	import { onMount } from 'svelte';
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
					axisPointer: { type: 'line' }
				},
				grid: { left: 56, right: 16, top: 16, bottom: 80 },
				xAxis: {
					type: 'category',
					data: years,
					axisLine: { show: true },
					axisTick: { show: false },
					axisLabel: {
						fontSize: 11,
						color: '#000',
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
						lineStyle: { color: '#B6B3B3', type: 'dashed', width: 0.5 }
					},
					axisLabel: {
						fontSize: 11,
						color: '#000',
						formatter: (v: number) => v.toLocaleString()
					}
				},
				series: [
					{
						type: 'bar',
						data: values,
						barWidth: '60%',
						itemStyle: { color: '#9CAEAE' },
						emphasis: { disabled: true }
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
