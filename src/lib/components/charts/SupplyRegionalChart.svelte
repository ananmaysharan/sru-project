<script lang="ts">
	import { onMount } from 'svelte';
	import { colorForRegionName } from '$lib/data/charts/chart-colors';
	import { regionalHousing } from '$lib/data/charts/regional-housing-summary';

	let chartEl: HTMLDivElement;

	const data = [...regionalHousing].reverse();

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			chart.setOption({
				tooltip: {
					trigger: 'axis',
					axisPointer: { type: 'line' },
					formatter: (params: any) => {
						const d = params.find((p: any) => p.value != null);
						if (!d) return '';
						const item = data[d.dataIndex];
						return `<strong>${item.region}</strong><br/>${item.per10k.toLocaleString()} per 10,000 people<br/>Avg rent: ${item.rentPerSqm.toFixed(2)} €/m²`;
					}
				},
				xAxis: {
					type: 'value',
					name: 'Units per 10,000 inhabitants',
					nameLocation: 'middle',
					nameGap: 30,
					axisLabel: { fontSize: 11 }
				},
				yAxis: {
					type: 'category',
					data: data.map((d) => d.region),
					axisLabel: { fontSize: 10 }
				},
				series: [
					{
						name: 'Regions',
						type: 'bar',
						data: data.map((d) => ({
							value: d.per10k,
							itemStyle: { color: colorForRegionName(d.region) }
						}))
					}
				],
				grid: { left: 160, right: 24, top: 16, bottom: 48 }
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
