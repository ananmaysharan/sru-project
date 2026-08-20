<script lang="ts">
	import { onMount } from 'svelte';
	import { GRAPHICS_COLORS, normalizeRegionName } from '$lib/data/charts/chart-colors';
	import { regionalHousing } from '$lib/data/charts/regional-housing-summary';

	let chartEl: HTMLDivElement;

	const data = [...regionalHousing].reverse();
	const overseasRegions = new Set([
		'guadeloupe',
		'guyane',
		'la reunion',
		'martinique',
		'mayotte'
	]);
	const isOverseas = (region: string) => overseasRegions.has(normalizeRegionName(region));

	onMount(() => {
		let chart: ReturnType<typeof import('echarts')['init']>;
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chart = echarts.init(chartEl);

			chart.setOption({
				legend: {
					top: 0,
					left: 'center',
					icon: 'rect',
					itemWidth: 10,
					itemHeight: 10,
					textStyle: { fontSize: 10, color: GRAPHICS_COLORS.secondaryText }
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
						lineStyle: { color: GRAPHICS_COLORS.secondaryText, width: 1 }
					},
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
					nameTextStyle: { color: GRAPHICS_COLORS.secondaryText },
					axisLine: { lineStyle: { color: GRAPHICS_COLORS.grid } },
					axisTick: { show: false },
					splitLine: { lineStyle: { color: GRAPHICS_COLORS.grid, width: 0.5 } },
					axisLabel: { fontSize: 11, color: GRAPHICS_COLORS.secondaryText }
				},
				yAxis: {
					type: 'category',
					data: data.map((d) => d.region),
					axisLine: { show: false },
					axisTick: { show: false },
					axisLabel: { fontSize: 10, color: GRAPHICS_COLORS.secondaryText }
				},
				series: [
					{
						name: 'Metropolitan France',
						type: 'bar',
						barWidth: '60%',
						data: data.map((d) => (isOverseas(d.region) ? null : d.per10k)),
						itemStyle: { color: GRAPHICS_COLORS.primary },
						emphasis: { itemStyle: { color: GRAPHICS_COLORS.primary } }
					},
					{
						name: 'Overseas territories',
						type: 'bar',
						barWidth: '60%',
						barGap: '-100%',
						data: data.map((d) => (isOverseas(d.region) ? d.per10k : null)),
						itemStyle: { color: GRAPHICS_COLORS.plum },
						emphasis: { itemStyle: { color: GRAPHICS_COLORS.plum } }
					}
				],
				grid: { left: 160, right: 24, top: 36, bottom: 48 }
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
