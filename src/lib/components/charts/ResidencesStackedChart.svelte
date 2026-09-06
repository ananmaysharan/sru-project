<script lang="ts">
	import { onMount } from 'svelte';
	import { COMPARISON_PALETTE, GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { residencesByYear } from '$lib/data/charts/residences-summary';
	import { language } from '$lib/i18n';

	let chartEl: HTMLDivElement;

	const series = $derived([
		{
			name: $language === 'fr' ? 'Locataires du parc social' : 'Social Rental Tenants',
			key: 'socialRental',
			color: COMPARISON_PALETTE[0],
			labelColor: GRAPHICS_COLORS.canvas
		},
		{
			name: $language === 'fr' ? 'Locataires du parc privé' : 'Private Rental Tenants',
			key: 'privateRental',
			color: COMPARISON_PALETTE[1],
			labelColor: GRAPHICS_COLORS.ink
		},
		{
			name: $language === 'fr' ? 'Propriétaires accédants' : 'Owner-Occupied (Mortgaged)',
			key: 'ownerMortgaged',
			color: COMPARISON_PALETTE[2],
			labelColor: GRAPHICS_COLORS.canvas
		},
		{
			name: $language === 'fr' ? 'Propriétaires sans emprunt' : 'Owner-Occupied (Mortgage-Free)',
			key: 'ownerMortgageFree',
			color: COMPARISON_PALETTE[3],
			labelColor: GRAPHICS_COLORS.canvas
		}
	] as const);

	function optionFor(width: number) {
		const compact = width < 520;
		return {
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'line', lineStyle: { color: GRAPHICS_COLORS.secondaryText, width: 1 } },
				valueFormatter: (v: number) => `${v.toLocaleString($language === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`
			},
			legend: {
				bottom: 0, left: 'center', icon: 'rect', itemWidth: 9, itemHeight: 9, itemGap: compact ? 5 : 8,
				textStyle: { fontSize: compact ? 8 : 10, color: GRAPHICS_COLORS.secondaryText },
				type: compact ? 'scroll' : 'plain', width: '100%'
			},
			xAxis: {
				type: 'category', data: residencesByYear.map((d) => d.year),
				axisLine: { lineStyle: { color: GRAPHICS_COLORS.grid } }, axisTick: { show: false },
				axisLabel: { fontSize: compact ? 9 : 11, color: GRAPHICS_COLORS.secondaryText, interval: compact ? 1 : 0 }
			},
			yAxis: {
				type: 'value', max: 35, axisLine: { show: false }, axisTick: { show: false },
				splitLine: { lineStyle: { color: GRAPHICS_COLORS.grid, width: 0.5 } },
				axisLabel: { formatter: (v: number) => `${v}`, fontSize: compact ? 9 : 11, color: GRAPHICS_COLORS.secondaryText }
			},
			series: series.map((s) => ({
				name: s.name, type: 'bar', stack: 'total',
				itemStyle: { color: s.color, borderColor: GRAPHICS_COLORS.canvas, borderWidth: 0.5 },
				emphasis: { itemStyle: { borderColor: GRAPHICS_COLORS.canvas, borderWidth: 0.5 } },
				data: residencesByYear.map((d) => d[s.key]), barWidth: compact ? '66%' : '55%',
				label: {
					show: !compact, position: 'inside',
					formatter: (p: any) => Number(p.value).toLocaleString($language === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
					fontSize: 11, color: s.labelColor
				}
			})),
			grid: { left: compact ? 34 : 40, right: 10, top: 12, bottom: compact ? 64 : 80 }
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
