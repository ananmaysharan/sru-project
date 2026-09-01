<script lang="ts">
	import { language } from '$lib/i18n';
	import { Button } from '$lib/components/ui/button';
	import rawCommuneData from '$lib/data/charts/commune-health-index-scatter.json';
	import { GRAPHICS_COLORS, RISK_SEQUENTIAL_SCALE } from '$lib/data/charts/chart-colors';

	type Period = '2005' | '2008' | '2014' | '2017' | '2020';

	type Row = {
		name: string;
		periods: Period[];
	};

	type RegionRow = Row & {
		region: string;
	};

	type CommuneRegion = {
		name: string;
		region: string;
	};

	const columnX: Record<Period, number> = {
		'2005': 915,
		'2008': 1182,
		'2014': 1440,
		'2017': 1715,
		'2020': 1985
	};

	const periodLabels: { key: Period; label: string }[] = [
		{ key: '2005', label: '2005-2007' },
		{ key: '2008', label: '2008-2010' },
		{ key: '2014', label: '2014-2016' },
		{ key: '2017', label: '2017-2019' },
		{ key: '2020', label: '2020-2022' }
	];
	const frequencyColors = {
		4: RISK_SEQUENTIAL_SCALE[4],
		3: RISK_SEQUENTIAL_SCALE[3],
		2: RISK_SEQUENTIAL_SCALE[2],
		1: RISK_SEQUENTIAL_SCALE[1]
	} as const;
	const frequencyLegend = $derived([
		{ count: 1, label: $language === 'fr' ? '1 période' : '1 period', color: frequencyColors[1] },
		{ count: 2, label: $language === 'fr' ? '2 périodes' : '2 periods', color: frequencyColors[2] },
		{ count: 3, label: $language === 'fr' ? '3 périodes' : '3 periods', color: frequencyColors[3] },
		{ count: 4, label: $language === 'fr' ? '4 périodes ou plus' : '4+ periods', color: frequencyColors[4] }
	]);
	const pageOneRows: Row[] = [
		{ name: "Chazay-d'Azergues", periods: ['2005', '2008', '2014', '2017'] },
		{ name: 'Nice', periods: ['2005', '2008', '2014', '2020'] },
		{ name: 'Neuilly sur Seine', periods: ['2005', '2008', '2014'] },
		{ name: 'Saint Jeannet', periods: ['2005', '2008', '2014'] },
		{ name: 'Saint Maur des Fossés', periods: ['2005', '2008', '2014'] },
		{ name: 'Toulon', periods: ['2005', '2008', '2020'] },
		{ name: 'Hyères', periods: ['2005', '2008'] },
		{ name: 'Saint Clément de Rivière', periods: ['2005', '2008'] },
		{ name: 'Villeneuve lès Avignon', periods: ['2005', '2008'] },
		{ name: 'La Bouilladisse', periods: ['2005', '2014', '2017'] },
		{ name: 'Marignane', periods: ['2005', '2014'] },
		{ name: 'Sanary sur Mer', periods: ['2005', '2017'] },
		{ name: 'Allauch', periods: ['2005'] },
		{ name: 'Barbentane', periods: ['2005'] },
		{ name: 'Challes les Eaux', periods: ['2005'] },
		{ name: 'Corbas', periods: ['2005'] },
		{ name: 'Habsheim', periods: ['2005'] },
		{ name: 'Le Perreux sur Marne', periods: ['2005'] },
		{ name: 'Le Pian Médoc', periods: ['2005'] },
		{ name: 'Le Plessis Bouchard', periods: ['2005'] },
		{ name: "L'Étang-la-Ville", periods: ['2005'] },
		{ name: 'Longeville lès Metz', periods: ['2005'] },
		{ name: 'Olivet', periods: ['2005'] },
		{ name: 'Saclay', periods: ['2005'] },
		{ name: 'Solliès Pont', periods: ['2005'] },
		{ name: 'Le Castellet', periods: ['2008', '2014', '2017'] },
		{ name: 'Tourrette Levens', periods: ['2008', '2014', '2017'] },
		{ name: 'Gignac la Nerthe', periods: ['2008', '2014'] },
		{ name: 'Auriol', periods: ['2008'] },
		{ name: 'Biarritz', periods: ['2008'] },
		{ name: 'Bièvres', periods: ['2008'] },
		{ name: 'Drap', periods: ['2008'] },
		{ name: 'Hallennes-lez-Haubourdin', periods: ['2008'] },
		{ name: 'Le Vésinet', periods: ['2008'] },
		{ name: 'Pernes les Fontaines', periods: ['2008'] },
		{ name: 'Plan de Cuques', periods: ['2008'] },
		{ name: 'Pornichet', periods: ['2008'] },
		{ name: 'Quéven', periods: ['2008'] },
		{ name: 'Saint Cyr sur Mer', periods: ['2008'] },
		{ name: 'Santeny', periods: ['2008'] },
		{ name: 'Varangéville', periods: ['2008'] },
		{ name: 'Tourrettes sur Loup', periods: ['2014', '2017', '2020'] },
		{ name: 'Cannes', periods: ['2014', '2017'] },
		{ name: 'Ceyreste', periods: ['2014', '2017'] },
		{ name: 'La Frette sur Seine', periods: ['2014', '2017'] },
		{ name: 'La Gaude', periods: ['2014', '2017'] },
		{ name: 'Meyreuil', periods: ['2014', '2017'] },
		{ name: 'Ormesson sur Marne', periods: ['2014', '2017'] },
		{ name: 'Boulogne-Billancourt', periods: ['2014', '2020'] },
		{ name: 'Beausoleil', periods: ['2014'] },
		{ name: 'Bois Colombes', periods: ['2014'] },
		{ name: 'Bures sur Yvette', periods: ['2014'] },
		{ name: 'Cabriès', periods: ['2014'] },
		{ name: 'Chaponnay', periods: ['2014'] },
		{ name: 'Châteaurenard', periods: ['2014'] },
		{ name: 'Fuveau', periods: ['2014'] },
		{ name: 'La Garenne Colombes', periods: ['2014'] },
		{ name: 'La Roquette sur Siagne', periods: ['2014'] },
		{ name: 'Le Cannet', periods: ['2014'] },
		{ name: 'Levens', periods: ['2014'] },
		{ name: 'Pechbonnieu', periods: ['2014'] }
	];

	const pageTwoRows: Row[] = [
		{ name: 'Peyrolles en Provence', periods: ['2014'] },
		{ name: 'Saint Pierre en Faucigny', periods: ['2014'] },
		{ name: 'Saint-Raphaël', periods: ['2014'] },
		{ name: 'Solliès Toucas', periods: ['2014'] },
		{ name: 'Thoiry', periods: ['2014'] },
		{ name: 'Vauhallan', periods: ['2014'] },
		{ name: 'Vincennes', periods: ['2014'] },
		{ name: 'Auvers sur Oise', periods: ['2017', '2020'] },
		{ name: 'Gattières', periods: ['2017', '2020'] },
		{ name: 'Mimet', periods: ['2017', '2020'] },
		{ name: 'Pégomas', periods: ['2017', '2020'] },
		{ name: 'Peypin', periods: ['2017', '2020'] },
		{ name: 'Aix en Provence', periods: ['2017'] },
		{ name: 'Antony', periods: ['2017'] },
		{ name: 'Bandol', periods: ['2017'] },
		{ name: 'Beaulieu sur Mer', periods: ['2017'] },
		{ name: 'Biguglia', periods: ['2017'] },
		{ name: 'Canohès', periods: ['2017'] },
		{ name: 'Charly', periods: ['2017'] },
		{ name: 'Contes', periods: ['2017'] },
		{ name: 'Éguilles', periods: ['2017'] },
		{ name: 'Frontignan', periods: ['2017'] },
		{ name: 'La Colle sur Loup', periods: ['2017'] },
		{ name: 'La Crau', periods: ['2017'] },
		{ name: 'La Seyne sur Mer', periods: ['2017'] },
		{ name: 'Le Beausset', periods: ['2017'] },
		{ name: 'Le Pradet', periods: ['2017'] },
		{ name: 'Levallois Perret', periods: ['2017'] },
		{ name: 'Mandres les Roses', periods: ['2017'] },
		{ name: 'Marolles en Brie', periods: ['2017'] },
		{ name: 'Montmorency', periods: ['2017'] },
		{ name: 'Pélissanne', periods: ['2017'] },
		{ name: 'Saint-Jeannet', periods: ['2017'] },
		{ name: 'Saint-Mandé', periods: ['2017'] },
		{ name: 'Soisy sur Seine', periods: ['2017'] },
		{ name: 'Solliès-Toucas', periods: ['2017'] },
		{ name: 'Villecresnes', periods: ['2017'] },
		{ name: 'Villefranche sur Mer', periods: ['2017'] },
		{ name: 'Yerres', periods: ['2017'] },
		{ name: 'Bordeaux', periods: ['2020'] },
		{ name: 'Carqueiranne', periods: ['2020'] },
		{ name: 'Carry Le Rouet', periods: ['2020'] },
		{ name: 'Coubron', periods: ['2020'] },
		{ name: 'Cuges Les Pins', periods: ['2020'] },
		{ name: 'Générac', periods: ['2020'] },
		{ name: 'Jouques', periods: ['2020'] },
		{ name: 'La Seyne-sur-Mer', periods: ['2020'] },
		{ name: 'Lésigny', periods: ['2020'] },
		{ name: 'Lyon', periods: ['2020'] },
		{ name: 'Marseille', periods: ['2020'] },
		{ name: 'Montpellier', periods: ['2020'] },
		{ name: 'Nesles-la-Vallée', periods: ['2020'] },
		{ name: 'Paris', periods: ['2020'] },
		{ name: 'Périgny', periods: ['2020'] },
		{ name: 'Perpignan', periods: ['2020'] },
		{ name: 'Prades-le-Lez', periods: ['2020'] },
		{ name: 'Roquefort-la-Bédoule', periods: ['2020'] },
		{ name: 'Saint Mitre Les Remparts', periods: ['2020'] },
		{ name: 'Saint Paul', periods: ['2020'] },
		{ name: 'Saint-Rémy-lès-Chevreuse', periods: ['2020'] },
		{ name: 'Vaucresson', periods: ['2020'] },
		{ name: 'Villeneuve De La Raho', periods: ['2020'] }
	];

	const regionOverrides = new Map<string, string>(
		[
			['Chaponnay', 'Auvergne-Rhone-Alpes'],
			['Levens', "Provence-Alpes-Cote d'Azur"],
			['Peyrolles en Provence', "Provence-Alpes-Cote d'Azur"],
			['Vauhallan', 'Ile-de-France'],
			['Carry Le Rouet', "Provence-Alpes-Cote d'Azur"],
			['Cuges Les Pins', "Provence-Alpes-Cote d'Azur"],
			['Générac', 'Occitanie'],
			['Jouques', "Provence-Alpes-Cote d'Azur"],
			['Nesles-la-Vallée', 'Ile-de-France'],
			['Prades-le-Lez', 'Occitanie'],
			['Roquefort-la-Bédoule', "Provence-Alpes-Cote d'Azur"],
			['Saint Mitre Les Remparts', "Provence-Alpes-Cote d'Azur"],
			['Saint Paul', 'La Reunion'],
			['Villeneuve De La Raho', 'Occitanie']
		].map(([name, region]) => [normalizeName(name), region])
	);
	const regionDisplayNames: Record<string, string> = {
		'Auvergne-Rhone-Alpes': 'Auvergne-Rhône-Alpes',
		'Ile-de-France': 'Île-de-France',
		'La Reunion': 'La Réunion',
		"Provence-Alpes-Cote d'Azur": "Provence-Alpes-Côte d'Azur"
	};
	const collator = new Intl.Collator('fr', { sensitivity: 'base' });
	const communeRegionByName = new Map(
		(rawCommuneData as CommuneRegion[]).map((commune) => [normalizeName(commune.name), commune])
	);
	const occurrenceCountByName = new Map<string, number>();
	for (const row of [...pageOneRows, ...pageTwoRows]) {
		const key = normalizeName(row.name);
		occurrenceCountByName.set(key, (occurrenceCountByName.get(key) ?? 0) + row.periods.length);
	}
	const communeRows: RegionRow[] = [...pageOneRows, ...pageTwoRows]
		.map((row) => {
			const key = normalizeName(row.name);
			return {
				...row,
				region: regionOverrides.get(key) ?? communeRegionByName.get(key)?.region ?? 'Other'
			};
		})
		.sort(
			(a, b) =>
				collator.compare(displayRegion(a.region), displayRegion(b.region)) ||
				collator.compare(a.name, b.name)
		);
	const regions = Array.from(new Set(communeRows.map((row) => row.region))).sort((a, b) =>
		collator.compare(displayRegion(a), displayRegion(b))
	);
	const pageWidth = 2200;
	const firstRowY = 154;
	const rowGap = 50;
	const lineStartX = 755;
	const lineEndX = 2135;
	let viewportWidth = $state(1280);
	let selectedRegions = $state<string[]>([]);
	let layoutColumnCount = $derived(viewportWidth >= 1024 ? 3 : viewportWidth >= 640 ? 2 : 1);
	let visibleRows = $derived.by(() => {
		const selected = new Set(selectedRegions);
		return communeRows.filter((row) => selected.size === 0 || selected.has(row.region));
	});
	let rowColumns = $derived.by(() => {
		const columnSize = Math.ceil(visibleRows.length / layoutColumnCount);

		return Array.from({ length: layoutColumnCount }, (_, index) =>
			visibleRows.slice(index * columnSize, (index + 1) * columnSize)
		).filter((column) => column.length > 0);
	});
	const rowY = (index: number) => firstRowY + index * rowGap;
	const heightForRows = (rowCount: number) => Math.max(220, firstRowY + rowCount * rowGap + 45);

	function normalizeName(value: string) {
		return value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '');
	}

	function displayRegion(region: string) {
		return regionDisplayNames[region] ?? region;
	}

	function markerColor(row: Row) {
		const count = occurrenceCountByName.get(normalizeName(row.name)) ?? row.periods.length;
		if (count >= 4) return frequencyColors[4];
		if (count === 3) return frequencyColors[3];
		if (count === 2) return frequencyColors[2];
		return frequencyColors[1];
	}

	function toggleRegion(region: string) {
		selectedRegions = selectedRegions.includes(region)
			? selectedRegions.filter((selected) => selected !== region)
			: [...selectedRegions, region];
	}
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div class="noncompliance-chart-shell mx-4 mt-4 md:mx-12">
	<div class="mx-auto max-w-3xl px-4 sm:px-6">
		<div class="filter-pills" aria-label={$language === 'fr' ? 'Filtres par région' : 'Region filters'}>
			<Button
				variant={selectedRegions.length === 0 ? 'default' : 'outline'}
				size="sm"
				class="rounded-full"
				aria-pressed={selectedRegions.length === 0}
				aria-controls="noncompliance-list"
				onclick={() => (selectedRegions = [])}
			>
				{$language === 'fr' ? 'Toutes les régions' : 'All regions'}
			</Button>
			{#each regions as region (region)}
				<Button
					variant={selectedRegions.includes(region) ? 'default' : 'outline'}
					size="sm"
					class="rounded-full"
					aria-pressed={selectedRegions.includes(region)}
					aria-controls="noncompliance-list"
					onclick={() => toggleRegion(region)}
				>
					{displayRegion(region)}
				</Button>
			{/each}
		</div>
	</div>
	<div class="list-columns-wrap">
		<div
			id="noncompliance-list"
			class="list-columns"
			class:single-column={rowColumns.length === 1}
			style={`--column-count:${layoutColumnCount};--single-column-width:calc((100% - ${(layoutColumnCount - 1) * 16}px) / ${layoutColumnCount})`}
		>
			{#each rowColumns as column, columnIndex (columnIndex)}
				{@const columnHeight = heightForRows(column.length)}
				<svg
					class="list-column"
					viewBox={`0 0 ${pageWidth} ${columnHeight}`}
					role="img"
					aria-label={$language === 'fr' ? `Communes carencées, colonne ${columnIndex + 1} sur ${rowColumns.length}` : `Noncompliant communes, column ${columnIndex + 1} of ${rowColumns.length}`}
				>
					<title>{$language === 'fr' ? 'Communes carencées' : 'Noncompliant communes'} (2005–2022), {$language === 'fr' ? 'colonne' : 'column'} {columnIndex + 1}</title>
					<rect width={pageWidth} height={columnHeight} fill={GRAPHICS_COLORS.canvas} />

					<g class="noncompliance-text">
						<text x="106" y="65" class="header-label">Commune</text>
						{#each periodLabels as period (period.key)}
							<text x={columnX[period.key]} y="65" class="header-label" text-anchor="middle">
								{period.label}
							</text>
						{/each}

						{#each column as row, index (`${row.name}-${row.periods.join('-')}`)}
							{@const y = rowY(index)}
							<line x1={lineStartX} x2={lineEndX} y1={y} y2={y} class="row-rule" />
							<text x="106" y={y} class="commune-label">{row.name}</text>

							{#each row.periods as period (period)}
								<circle
									cx={columnX[period]}
									cy={y}
									r="18.5"
									class="marker"
									style={`fill:${markerColor(row)}`}
								/>
							{/each}
						{/each}
					</g>
				</svg>
			{/each}
		</div>
	</div>
	<div class="frequency-legend" aria-label={$language === 'fr' ? 'Les couleurs indiquent les carences répétées' : 'Marker colors show repeated noncompliance'}>
		<span class="frequency-legend-title">{$language === 'fr' ? 'Carences répétées' : 'Repeated noncompliance'}</span>
		{#each frequencyLegend as item (item.count)}
			<span class="frequency-legend-item">
				<span class="frequency-swatch" style={`background:${item.color}`}></span>
				{item.label}
			</span>
		{/each}
	</div>
</div>

<style>
	.noncompliance-chart-shell {
		border: 1px solid var(--editorial-rule, #dadad7);
		padding: clamp(1rem, 1.7vw, 1.5rem);
		background: #fff;
	}

	.filter-pills {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-bottom: 16px;
	}

	.frequency-legend {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px 14px;
		margin: 18px 0 0;
		color: #5f5f5f;
		font-family: 'Open Sans', Arial, ui-sans-serif, system-ui, sans-serif;
		font-size: 12px;
	}

	.frequency-legend-title {
		font-weight: 600;
		color: #121212;
	}

	.frequency-legend-item {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.frequency-swatch {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 999px;
	}

	.list-columns-wrap {
		padding-bottom: 8px;
	}

	.list-columns {
		display: grid;
		grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
		align-items: start;
		gap: 16px;
	}

	.list-columns.single-column .list-column {
		grid-column: 1 / -1;
		width: var(--single-column-width);
		justify-self: center;
	}

	.list-column {
		display: block;
		width: 100%;
		height: auto;
	}

	.noncompliance-text {
		font-family: 'Open Sans', Arial, ui-sans-serif, system-ui, sans-serif;
		font-stretch: normal;
		fill: #121212;
	}

	.header-label {
		font-size: 43px;
		font-weight: 700;
		dominant-baseline: middle;
	}

	.commune-label {
		font-size: 42px;
		font-weight: 400;
		dominant-baseline: middle;
	}

	.row-rule {
		stroke: #dadad7;
		stroke-width: 1.6;
	}

</style>
