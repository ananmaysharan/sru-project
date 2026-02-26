<script lang="ts">
	import { onMount } from 'svelte';
	import { socialHousingByRegion2022 } from '$lib/data/region-supply-summary';

	let chartEl: HTMLDivElement;
	let showingOutreMer = $state(false);
	let chartInstance: ReturnType<typeof import('echarts')['init']> | null = null;

	const OUTRE_MER = ['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'];

	const metro = socialHousingByRegion2022
		.filter((d) => !OUTRE_MER.includes(d.region))
		.sort((a, b) => b.social - a.social);

	const outreMer = socialHousingByRegion2022
		.filter((d) => OUTRE_MER.includes(d.region))
		.sort((a, b) => b.social - a.social);

	const outreMerTotal = outreMer.reduce((s, d) => s + d.social, 0);
	const outreMerTotalUnits = outreMer.reduce((s, d) => s + d.total, 0);
	const outreMerRate = Math.round((outreMerTotal / outreMerTotalUnits) * 1000) / 10;

	function getMainData() {
		const data = metro.map((d) => ({
			name: d.region,
			value: d.social,
			rate: d.rate
		}));
		data.push({
			name: 'Outre-mer',
			value: outreMerTotal,
			rate: outreMerRate
		});
		return data;
	}

	function getOutreMerData() {
		return outreMer.map((d) => ({
			name: d.region,
			value: d.social,
			rate: d.rate
		}));
	}

	function buildOption(data: { name: string; value: number; rate: number }[]) {
		return {
			tooltip: {
				trigger: 'item',
				formatter: (params: any) => {
					const d = params.data;
					return `<strong>${params.name}</strong><br/>${d.value.toLocaleString()} social units<br/>${d.rate}% SRU rate`;
				}
			},
			series: [
				{
					type: 'pie',
					radius: ['35%', '70%'],
					center: ['50%', '50%'],
					avoidLabelOverlap: true,
					itemStyle: {
						borderRadius: 0,
						borderColor: '#fff',
						borderWidth: 2
					},
					label: {
						show: true,
						formatter: '{b}',
						fontSize: 10
					},
					labelLine: {
						length: 10,
						length2: 8
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 12,
							fontWeight: 'bold'
						}
					},
					animationType: 'scale',
					animationEasing: 'elasticOut',
					data
				}
			]
		};
	}

	function showMain() {
		showingOutreMer = false;
		chartInstance?.setOption(buildOption(getMainData()), true);
	}

	function showOutreMer() {
		showingOutreMer = true;
		chartInstance?.setOption(buildOption(getOutreMerData()), true);
	}

	onMount(() => {
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chartInstance = echarts.init(chartEl);
			chartInstance.setOption(buildOption(getMainData()));

			chartInstance.on('click', (params: any) => {
				if (params.name === 'Outre-mer' && !showingOutreMer) {
					showOutreMer();
				}
			});

			ro = new ResizeObserver(() => chartInstance?.resize());
			ro.observe(chartEl);
		});

		return () => {
			ro?.disconnect();
			chartInstance?.dispose();
		};
	});
</script>

<div class="relative h-full w-full">
	{#if showingOutreMer}
		<button
			class="absolute top-0 left-0 z-10 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
			onclick={showMain}
		>
			<svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
			</svg>
			Back to all regions
		</button>
	{/if}
	<div bind:this={chartEl} class="h-full w-full"></div>
</div>
