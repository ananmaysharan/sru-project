<script lang="ts">
	import { onMount } from 'svelte';
	import { residencesByYear } from '$lib/data/charts/residences-summary';

	let chartEl: HTMLDivElement;

	const series = [
		{ name: 'Social Rental Tenants', key: 'socialRental', color: '#4a596b' },
		{ name: 'Private Rental Tenants', key: 'privateRental', color: '#b1b9bc' },
		{ name: 'Owner-Occupied (Mortgaged)', key: 'ownerMortgaged', color: '#9da283' },
		{ name: 'Owner-Occupied (Mortgage-Free)', key: 'ownerMortgageFree', color: '#d8c891' }
	] as const;

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			chart.setOption({
				tooltip: {
					trigger: 'axis',
					axisPointer: { type: 'line' },
					valueFormatter: (v: number) => `${v.toFixed(1)}M`
				},
				legend: {
					bottom: 0,
					left: 'center',
					icon: 'rect',
					itemWidth: 14,
					itemHeight: 14,
					textStyle: { fontSize: 12 }
				},
				xAxis: {
					type: 'category',
					data: residencesByYear.map((d) => d.year),
					axisLabel: { fontSize: 11 }
				},
				yAxis: {
					type: 'value',
					max: 35,
					axisLabel: { formatter: (v: number) => `${v}` }
				},
				series: series.map((s) => ({
					name: s.name,
					type: 'bar',
					stack: 'total',
					itemStyle: { color: s.color },
					data: residencesByYear.map((d) => d[s.key]),
					barWidth: '55%',
					label: {
						show: true,
						position: 'inside',
						formatter: (p: any) => p.value.toFixed(1),
						fontSize: 11
					}
				})),
				grid: { left: 40, right: 16, top: 16, bottom: 80 }
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
