<script lang="ts">
	import { onMount } from 'svelte';
	import { regionalHousing } from '$lib/data/charts/regional-housing-summary';

	let chartEl: HTMLDivElement;

	const OUTRE_MER = ['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'];
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
				legend: {
					data: ['Mainland', 'Overseas'],
					top: 0,
					right: 24
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
						name: 'Mainland',
						type: 'bar',
						stack: 'total',
						itemStyle: { color: '#8fa6aa' },
						data: data.map((d) => (OUTRE_MER.includes(d.region) ? null : d.per10k))
					},
					{
						name: 'Overseas',
						type: 'bar',
						stack: 'total',
						itemStyle: { color: '#d8c891' },
						data: data.map((d) => (OUTRE_MER.includes(d.region) ? d.per10k : null))
					}
				],
				grid: { left: 160, right: 24, top: 32, bottom: 48 }
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
