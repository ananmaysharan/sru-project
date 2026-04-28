<script lang="ts">
	import { onMount } from 'svelte';
	import { socialHousingByRegion2022 } from '$lib/data/charts/region-supply-summary';
	import { departmentSupply2022 } from '$lib/data/charts/department-supply-summary';

	let chartEl: HTMLDivElement;
	let drillLabel: string | null = $state(null);
	let chartInstance: ReturnType<typeof import('echarts')['init']> | null = null;

	const OUTRE_MER_CODES = ['01', '02', '03', '04', '06'];

	const metro = socialHousingByRegion2022
		.filter((d) => !OUTRE_MER_CODES.includes(d.regionCode))
		.sort((a, b) => b.social - a.social);

	const outreMer = socialHousingByRegion2022
		.filter((d) => OUTRE_MER_CODES.includes(d.regionCode))
		.sort((a, b) => b.social - a.social);

	const outreMerTotal = outreMer.reduce((s, d) => s + d.social, 0);
	const outreMerTotalUnits = outreMer.reduce((s, d) => s + d.total, 0);
	const outreMerRate = Math.round((outreMerTotal / outreMerTotalUnits) * 1000) / 10;

	function getMainData() {
		const data = metro.map((d) => ({
			name: d.region,
			value: d.social,
			rate: d.rate,
			regionCode: d.regionCode
		}));
		data.push({
			name: 'Outre-mer',
			value: outreMerTotal,
			rate: outreMerRate,
			regionCode: 'outre-mer'
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

	function getDepartmentData(regionCode: string) {
		return departmentSupply2022
			.filter((d) => d.regionCode === regionCode && d.social > 0)
			.sort((a, b) => b.social - a.social)
			.map((d) => ({
				name: d.department,
				value: d.social,
				rate: d.rate
			}));
	}

	const PALETTE = [
		'#4a596b', // deep slate
		'#c9a96e', // honey gold
		'#6b8e7a', // muted teal-green
		'#b8675f', // dusty terracotta
		'#8f9bb3', // powder blue
		'#d8c891', // warm beige
		'#4d7c70', // forest sage
		'#d4a988', // peach tan
		'#5e7a8a', // steel blue
		'#a87655', // clay
		'#9da283', // sage
		'#7d6e8c', // dusty mauve
		'#b5b08e', // khaki
		'#3e5a5a', // deep teal
		'#8a8074'  // warm gray
	];

	function buildOption(data: { name: string; value: number; rate: number }[]) {
		return {
			color: PALETTE,
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
		drillLabel = null;
		chartInstance?.setOption(buildOption(getMainData()), true);
	}

	function drillInto(name: string, data: { name: string; value: number; rate: number }[]) {
		if (data.length === 0) return;
		drillLabel = name;
		chartInstance?.setOption(buildOption(data), true);
	}

	onMount(() => {
		let ro: ResizeObserver;

		import('echarts').then((echarts) => {
			chartInstance = echarts.init(chartEl);
			chartInstance.setOption(buildOption(getMainData()));

			chartInstance.on('click', (params: any) => {
				if (!drillLabel) {
					const regionCode = params.data.regionCode;
					if (regionCode === 'outre-mer') {
						drillInto('Outre-mer', getOutreMerData());
					} else if (regionCode) {
						drillInto(params.name, getDepartmentData(regionCode));
					}
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
	{#if drillLabel}
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
