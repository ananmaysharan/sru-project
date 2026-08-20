<script lang="ts">
	import * as d3 from 'd3';
	import { Combobox } from 'bits-ui';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { colorForRegionName, GRAPHICS_COLORS } from '$lib/data/charts/chart-colors';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import rawData from '$lib/data/charts/commune-health-index-scatter.json';

	type IndicatorKey = 'income' | 'poverty' | 'ageing' | 'heat' | 'energy' | 'green' | 'health';
	type MetricKey = 'weighted' | IndicatorKey;
	type IndicatorScores = Record<IndicatorKey, number | null>;

	type CommuneScatterPoint = {
		code: string;
		name: string;
		region: string;
		population: number;
		weightedIndex: number;
		nVarsUsed: number;
		rankGroup?: RankingFilter;
		rank?: number;
		socialHousingShare2022: number;
		socialUnits2022: number;
		totalUnits2022: number;
		indicatorScores: IndicatorScores;
	};

	type RankingFilter = 'Top 20' | 'Bottom 20';
	type LabelPlacement = {
		point: CommuneScatterPoint;
		centerX: number;
		centerY: number;
		labelX: number;
		labelY: number;
		lineEndX: number;
		lineEndY: number;
		textWidth: number;
		textHeight: number;
		textAnchor: 'start' | 'end';
	};
	type LabelPosition = {
		x: number;
		y: number;
	};
	type LabelRectangle = {
		centerX: number;
		centerY: number;
		left: number;
		right: number;
		top: number;
		bottom: number;
	};
	const metricConfig: Record<
		MetricKey,
		{ label: string; shortLabel: string; axisLabel: string; domain: [number, number] }
	> = {
		weighted: {
			label: 'Weighted average of all indicators',
			shortLabel: 'Weighted average',
			axisLabel: 'Weighted average of indicators for well-being and access to amenities',
			domain: [0, 100]
		},
		income: {
			label: 'Median household income',
			shortLabel: 'Income',
			axisLabel: 'Income score (0–10; higher is better)',
			domain: [0, 10]
		},
		poverty: {
			label: 'Share of residents in poverty',
			shortLabel: 'Poverty',
			axisLabel: 'Poverty score (0–10; higher is better)',
			domain: [0, 10]
		},
		ageing: {
			label: 'Older adult share (65+)',
			shortLabel: 'Older adults',
			axisLabel: 'Older adult share score (0–10; higher is better)',
			domain: [0, 10]
		},
		heat: {
			label: 'Urban heat island exposure',
			shortLabel: 'Heat exposure',
			axisLabel: 'Heat exposure score (0–10; higher is better)',
			domain: [0, 10]
		},
		energy: {
			label: 'DPE energy-efficient building share (A-C)',
			shortLabel: 'Energy efficiency',
			axisLabel: 'Energy efficiency score (0–10; higher is better)',
			domain: [0, 10]
		},
		green: {
			label: 'Proximity to green spaces',
			shortLabel: 'Green spaces',
			axisLabel: 'Green space proximity score (0–10; higher is better)',
			domain: [0, 10]
		},
		health: {
			label: 'Proximity to healthcare and hospital infrastructure',
			shortLabel: 'Healthcare',
			axisLabel: 'Healthcare proximity score (0–10; higher is better)',
			domain: [0, 10]
		}
	};
	const metrics = Object.keys(metricConfig) as MetricKey[];

	const curatedLabelPositions: Record<string, LabelPosition> = {
		'Top 20:13005': { x: 253.9, y: 173.4 },
		'Top 20:64249': { x: 118.4, y: 204 },
		'Top 20:30169': { x: 208, y: 216.9 },
		'Top 20:24335': { x: 157.1, y: 234.4 },
		'Top 20:37151': { x: 196.3, y: 258.9 },
		'Top 20:45068': { x: 860.1, y: 247.7 },
		'Top 20:66021': { x: 231.1, y: 248.5 },
		'Top 20:21223': { x: 128.4, y: 282.4 },
		'Top 20:30305': { x: 214.1, y: 276 },
		'Top 20:31161': { x: 159.6, y: 271.1 },
		'Top 20:33496': { x: 110.7, y: 231 },
		'Top 20:34148': { x: 124.6, y: 303.6 },
		'Top 20:42092': { x: 207.1, y: 308.5 },
		'Top 20:65100': { x: 292, y: 276.1 },
		'Top 20:69125': { x: 139, y: 370.4 },
		'Top 20:30333': { x: 183.6, y: 334.6 },
		'Bottom 20:59632': { x: 186.9, y: 457.5 },
		'Bottom 20:64373': { x: 319.6, y: 474.8 },
		'Bottom 20:24145': { x: 326.8, y: 431.5 },
		'Bottom 20:30027': { x: 134.9, y: 470.5 },
		'Bottom 20:59291': { x: 180.9, y: 471.2 },
		'Bottom 20:60277': { x: 150.7, y: 444.1 },
		'Bottom 20:64137': { x: 108.1, y: 485.2 },
		'Bottom 20:10081': { x: 847.6, y: 413.7 },
		'Bottom 20:30036': { x: 121.2, y: 403.8 },
		'Bottom 20:59589': { x: 120.5, y: 419.1 },
		'Bottom 20:06039': { x: 234, y: 273.6 },
		'Bottom 20:16271': { x: 183, y: 359.9 },
		'Bottom 20:24487': { x: 275, y: 344.9 },
		'Bottom 20:25133': { x: 135.3, y: 274.1 },
		'Bottom 20:25381': { x: 277.5, y: 292 },
		'Bottom 20:25560': { x: 195.7, y: 383.3 }
	};

	const points = rawData as CommuneScatterPoint[];
	const width = 960;
	const height = 560;
	const margin = { top: 24, right: 28, bottom: 56, left: 64 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const targetShare = 0.25;
	const xLabelMin = 0;
	const xLabelMax = 1;
	const xDomainMin = 0;

	const xDomainMax = 1;
	const xScale = d3.scaleLinear().domain([xDomainMin, xDomainMax]).range([margin.left, width - margin.right]);
	const yScale = d3.scaleLinear().domain(metricConfig.weighted.domain).range([height - margin.bottom, margin.top]);
	const populationValues = points.map((point) => point.population).sort((a, b) => a - b);
	const populationRadiusMax = d3.quantileSorted(populationValues, 0.98) ?? d3.max(populationValues) ?? 1;
	const populationRadiusScale = d3
		.scaleSqrt()
		.domain([0, populationRadiusMax])
		.range([2, 9])
		.clamp(true);
	const formatPercent = d3.format('.0%');
	const formatNumber = d3.format(',');
	const formatMetric = d3.format('.1f');
	const regions = Array.from(new Set(points.map((point) => point.region))).sort();

	let brushElement: SVGGElement;
	let chartPanelEl: HTMLDivElement;
	let animationFrame: number | null = null;
	let domainAnimating = $state(false);
	let searchInputEl: HTMLDivElement;
	let hovered = $state<CommuneScatterPoint | null>(null);
	let selectedPoint = $state<CommuneScatterPoint | null>(null);
	const hiddenRegions = new SvelteSet<string>();
	let searchOpen = $state(false);
	let searchValue = $state<string | undefined>(undefined);
	let searchQuery = $state('');
	let activeMetric = $state<MetricKey>('weighted');
	let activeRanking = $state<RankingFilter | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let xDomain = $state<[number, number]>([xDomainMin, xDomainMax]);
	let yDomain = $state<[number, number]>(metricConfig.weighted.domain);
	let brushZoomed = $state(false);
	let yBounds = $derived(metricConfig[activeMetric].domain);
	let transformedXScale = $derived(xScale.copy().domain(xDomain));
	let transformedYScale = $derived(yScale.copy().domain(yDomain));
	let xTicks = $derived(transformedXScale.ticks(10).filter((tick) => tick >= xLabelMin && tick <= xLabelMax));
	let metricPoints = $derived(points.filter((point) => metricValueOrNull(point) !== null));
	let rankedPoints = $derived(
		activeRanking ? metricPoints.filter((point) => point.rankGroup === activeRanking) : metricPoints
	);
	let representedRegions = $derived(
		activeRanking ? new Set(rankedPoints.map((point) => point.region)) : new Set(regions)
	);
	let yTicks = $derived(
		transformedYScale.ticks(10).filter((tick) => tick >= yBounds[0] && tick <= yBounds[1])
	);
	let activePoint = $derived.by(() => {
		const point = hovered ?? selectedPoint;
		return point &&
			!hiddenRegions.has(point.region) &&
			(!activeRanking || point.rankGroup === activeRanking)
			? point
			: null;
	});
	let visiblePoints = $derived(rankedPoints.filter((point) => !hiddenRegions.has(point.region)));
	let labelPlacements = $derived(
		activeMetric === 'weighted' && activeRanking ? buildLabelPlacements(visiblePoints) : []
	);
	let clippedToPlot = $derived(brushZoomed);
	let searchMatches = $derived.by(() => {
		const query = normalizeSearch(searchQuery);

		if (query.length < 2) {
			return [];
		}

		return rankedPoints
			.filter((point) => {
				const name = normalizeSearch(point.name);
				const code = normalizeSearch(point.code);
				return name.includes(query) || code.includes(query);
			})
			.slice(0, 8);
	});

	onMount(() => {
		const brush = d3
			.brush()
			.extent([
				[margin.left, margin.top],
				[width - margin.right, height - margin.bottom]
			])
			.on('end', (event) => {
				const selection = event.selection;

				if (!isBrushArea(selection)) {
					return;
				}

				const [[x0, y0], [x1, y1]] = selection;

				if (Math.abs(x1 - x0) < 6 || Math.abs(y1 - y0) < 6) {
					d3.select(brushElement).call(brush.move, null);
					return;
				}

				brushZoomed = true;
				animateDomains([
					clamp(transformedXScale.invert(x0), xDomainMin, xDomainMax),
					clamp(transformedXScale.invert(x1), xDomainMin, xDomainMax)
				], [
					clamp(transformedYScale.invert(y1), yBounds[0], yBounds[1]),
					clamp(transformedYScale.invert(y0), yBounds[0], yBounds[1])
				]);
				hovered = null;
				d3.select(brushElement).call(brush.move, null);
			});

		const selection = d3.select(brushElement).call(brush);

		return () => {
			cancelDomainAnimation();
			selection.on('.brush', null);
		};
	});

	function resetZoom() {
		brushZoomed = false;
		animateDomains([xDomainMin, xDomainMax], yBounds);
		hovered = null;
		selectedPoint = null;
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
	}

	function isBrushArea(selection: d3.BrushSelection | null): selection is [[number, number], [number, number]] {
		return Array.isArray(selection?.[0]);
	}

	function xPosition(point: CommuneScatterPoint) {
		return transformedXScale(point.socialHousingShare2022);
	}

	function yPosition(point: CommuneScatterPoint) {
		return transformedYScale(metricValue(point));
	}

	function metricValueOrNull(point: CommuneScatterPoint) {
		return activeMetric === 'weighted' ? point.weightedIndex : point.indicatorScores[activeMetric];
	}

	function metricValue(point: CommuneScatterPoint) {
		return metricValueOrNull(point) ?? 0;
	}

	function formatMetricValue(point: CommuneScatterPoint) {
		return formatMetric(metricValue(point));
	}

	function handleMetricChange(value: string | undefined) {
		if (!value || !metrics.includes(value as MetricKey)) {
			return;
		}

		activeMetric = value as MetricKey;
		activeRanking = null;
		hovered = null;
		brushZoomed = false;
		clearSearch();
		animateDomains([xDomainMin, xDomainMax], metricConfig[activeMetric].domain);
	}

	function fillForPoint(point: CommuneScatterPoint) {
		if (hovered?.code === point.code) {
			return GRAPHICS_COLORS.focus;
		}

		return colorForRegionName(point.region);
	}

	function opacityForPoint(point: CommuneScatterPoint) {
		if (selectedPoint && selectedPoint.code !== point.code) {
			return 0.36;
		}

		return activePoint?.code === point.code ? 1 : 0.72;
	}

	function radiusForPoint(point: CommuneScatterPoint) {
		const radius = baseRadiusForPoint(point);
		return activePoint?.code === point.code ? radius + 2.5 : radius;
	}

	function baseRadiusForPoint(point: CommuneScatterPoint) {
		return populationRadiusScale(point.population);
	}

	function focusPoint(point: CommuneScatterPoint) {
		if (hiddenRegions.has(point.region)) {
			hiddenRegions.delete(point.region);
		}

		selectedPoint = point;
		hovered = null;
		brushZoomed = false;
		searchQuery = point.name;
		searchValue = `commune:${point.code}`;
		setSearchInputValue(point.name);
		searchOpen = false;
		animateDomains(
			centeredDomain(point.socialHousingShare2022, 0.06, xDomainMin, xDomainMax),
			centeredDomain(
				metricValue(point),
				activeMetric === 'weighted' ? 15 : 1.5,
				yBounds[0],
				yBounds[1]
			)
		);
	}

	function handleSearchInput(event: Event) {
		searchQuery = (event.target as HTMLInputElement).value;
		searchOpen = true;
		searchValue = undefined;
		selectedPoint = null;
	}

	function handleSearchSelect(value: string | undefined) {
		if (!value?.startsWith('commune:')) {
			return;
		}

		const point = rankedPoints.find((item) => item.code === value.slice(8));

		if (point) {
			focusPoint(point);
		}
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && searchMatches[0]) {
			event.preventDefault();
			focusPoint(searchMatches[0]);
		}

		if (event.key === 'Escape') {
			searchOpen = false;
			searchQuery = '';
			searchValue = undefined;
			selectedPoint = null;
			setSearchInputValue('');
		}
	}

	function clearSearch() {
		searchOpen = false;
		searchQuery = '';
		searchValue = undefined;
		selectedPoint = null;
		setSearchInputValue('');
	}

	function setSearchInputValue(value: string) {
		const input = searchInputEl?.querySelector('input');

		if (input) {
			input.value = value;
		}
	}

	function setRankingFilter(nextRanking: RankingFilter) {
		activeMetric = 'weighted';
		activeRanking = nextRanking;
		hovered = null;
		selectedPoint = null;
		brushZoomed = false;
		clearSearch();
		const targetPoints = points.filter((point) => point.rankGroup === nextRanking);
		animateDomains(
			extentDomain(targetPoints.map((point) => point.socialHousingShare2022), 0.04, xDomainMin, xDomainMax),
			extentDomain(targetPoints.map((point) => point.weightedIndex), 8, 0, 100)
		);
	}

	function resetChart() {
		activeRanking = null;
		hiddenRegions.clear();
		hovered = null;
		brushZoomed = false;
		clearSearch();
		animateDomains([xDomainMin, xDomainMax], yBounds);
	}

	function buildLabelPlacements(labelPoints: CommuneScatterPoint[]) {
		const labelHeight = 14;
		const collisionPadding = 6;
		const bounds = labelBounds(collisionPadding);
		const pointObstacles = labelPoints.map((point) => ({
			x: xPosition(point),
			y: yPosition(point),
			radius: baseRadiusForPoint(point) + collisionPadding
		}));
		const placedRectangles: LabelRectangle[] = [];
		const placements: LabelPlacement[] = [];
		const orderedPoints = [...labelPoints].sort((a, b) => {
			const aNeighbours = nearbyPointCount(a, labelPoints);
			const bNeighbours = nearbyPointCount(b, labelPoints);
			return bNeighbours - aNeighbours || (a.rank ?? 0) - (b.rank ?? 0);
		});

		for (const point of orderedPoints) {
			const textWidth = approximateLabelWidth(`${point.rank}. ${point.name}`);
			const candidates = labelCandidates(point, textWidth, labelHeight, bounds);
			const rectangle = candidates.find(
				(candidate) =>
					!placedRectangles.some((placed) => rectanglesOverlap(candidate, placed, collisionPadding)) &&
					!pointObstacles.some((obstacle) => rectangleOverlapsCircle(candidate, obstacle))
			);

			if (!rectangle) {
				continue;
			}

			placedRectangles.push(rectangle);
			placements.push(labelPlacementFromRectangle(point, rectangle, textWidth, labelHeight));
		}

		return placements
			.map((placement) => {
				const key = labelKey(placement.point);
				const curatedPosition = curatedLabelPositions[key];

				if (!curatedPosition) {
					return placement;
				}

				const center = clampLabelCenter(
					curatedPosition.x,
					curatedPosition.y,
					placement.textWidth,
					placement.textHeight,
					bounds
				);
				const rectangle = labelRectangle(
					center.x,
					center.y,
					placement.textWidth,
					placement.textHeight
				);
				return labelPlacementFromRectangle(
					placement.point,
					rectangle,
					placement.textWidth,
					placement.textHeight
				);
			})
			.sort((a, b) => (a.point.rank ?? 0) - (b.point.rank ?? 0));
	}

	function labelBounds(padding: number) {
		return {
			left: margin.left + padding,
			right: width - margin.right - padding,
			top: margin.top + padding,
			bottom: height - margin.bottom - padding
		};
	}

	function labelPlacementFromRectangle(
		point: CommuneScatterPoint,
		rectangle: LabelRectangle,
		textWidth: number,
		textHeight: number
	): LabelPlacement {
		const pointX = xPosition(point);
		const pointY = yPosition(point);
		const textAnchor: 'start' | 'end' = rectangle.centerX >= pointX ? 'start' : 'end';
		const lineEnd = rectangleEdgeTowardPoint(rectangle, pointX, pointY);

		return {
			point,
			centerX: rectangle.centerX,
			centerY: rectangle.centerY,
			labelX: textAnchor === 'start' ? rectangle.left : rectangle.right,
			labelY: rectangle.centerY + textHeight / 3,
			lineEndX: lineEnd.x,
			lineEndY: lineEnd.y,
			textWidth,
			textHeight,
			textAnchor
		};
	}

	function approximateLabelWidth(label: string) {
		// Deliberately conservative for the chart's 10px sans-serif label font.
		return Array.from(label).reduce((width, character) => {
			if (/[MWmw]/.test(character)) return width + 8;
			if (/[A-ZÀ-Þ0-9]/.test(character)) return width + 6.5;
			if (/\s/.test(character)) return width + 3.5;
			if (/[.,'’-]/.test(character)) return width + 4;
			return width + 5.8;
		}, 8);
	}

	function nearbyPointCount(point: CommuneScatterPoint, allPoints: CommuneScatterPoint[]) {
		const pointX = xPosition(point);
		const pointY = yPosition(point);

		return allPoints.filter(
			(other) =>
				other.code !== point.code &&
				Math.abs(xPosition(other) - pointX) < 150 &&
				Math.abs(yPosition(other) - pointY) < 34
		).length;
	}

	function labelCandidates(
		point: CommuneScatterPoint,
		textWidth: number,
		textHeight: number,
		bounds: { left: number; right: number; top: number; bottom: number }
	) {
		const pointX = xPosition(point);
		const pointY = yPosition(point);
		const pointRadius = baseRadiusForPoint(point);
		const halfWidth = textWidth / 2;
		const halfHeight = textHeight / 2;
		const minX = bounds.left + halfWidth;
		const maxX = bounds.right - halfWidth;
		const minY = bounds.top + halfHeight;
		const maxY = bounds.bottom - halfHeight;
		const candidates: LabelRectangle[] = [];
		const seen = new Set<string>();
		const addCandidate = (centerX: number, centerY: number) => {
			const clampedX = clamp(centerX, minX, maxX);
			const clampedY = clamp(centerY, minY, maxY);
			const key = `${Math.round(clampedX * 10)},${Math.round(clampedY * 10)}`;

			if (seen.has(key)) return;
			seen.add(key);
			candidates.push(labelRectangle(clampedX, clampedY, textWidth, textHeight));
		};
		const horizontalOffset = pointRadius + 10 + halfWidth;
		const verticalOffset = pointRadius + 10 + halfHeight;

		// Prefer a short, nearly horizontal leader line, then progressively fan out.
		for (let distance = 0; distance <= 180; distance += 12) {
			const verticalOffsets = distance === 0 ? [0] : [-distance, distance];
			for (const vertical of verticalOffsets) {
				addCandidate(pointX + horizontalOffset, pointY + vertical);
				addCandidate(pointX - horizontalOffset, pointY + vertical);
			}
		}

		for (let distance = 0; distance <= 220; distance += 16) {
			const horizontalOffsets = distance === 0 ? [0] : [-distance, distance];
			for (const horizontal of horizontalOffsets) {
				addCandidate(pointX + horizontal, pointY - verticalOffset);
				addCandidate(pointX + horizontal, pointY + verticalOffset);
			}
		}

		// Dense deterministic fallback. This guarantees a placement whenever the
		// remaining plot area can physically accommodate the label.
		for (let centerY = minY; centerY <= maxY; centerY += textHeight + 12) {
			for (let centerX = minX; centerX <= maxX; centerX += 12) {
				addCandidate(centerX, centerY);
			}
		}

		return candidates;
	}

	function labelRectangle(centerX: number, centerY: number, textWidth: number, textHeight: number) {
		return {
			centerX,
			centerY,
			left: centerX - textWidth / 2,
			right: centerX + textWidth / 2,
			top: centerY - textHeight / 2,
			bottom: centerY + textHeight / 2
		};
	}

	function rectanglesOverlap(a: LabelRectangle, b: LabelRectangle, padding: number) {
		return !(
			a.right + padding <= b.left ||
			b.right + padding <= a.left ||
			a.bottom + padding <= b.top ||
			b.bottom + padding <= a.top
		);
	}

	function rectangleOverlapsCircle(
		rectangle: LabelRectangle,
		circle: { x: number; y: number; radius: number }
	) {
		const nearestX = clamp(circle.x, rectangle.left, rectangle.right);
		const nearestY = clamp(circle.y, rectangle.top, rectangle.bottom);
		return Math.hypot(circle.x - nearestX, circle.y - nearestY) < circle.radius;
	}

	function rectangleEdgeTowardPoint(rectangle: LabelRectangle, pointX: number, pointY: number) {
		const dx = pointX - rectangle.centerX;
		const dy = pointY - rectangle.centerY;
		const halfWidth = (rectangle.right - rectangle.left) / 2;
		const halfHeight = (rectangle.bottom - rectangle.top) / 2;
		const xScaleToEdge = Math.abs(dx) > 0.001 ? halfWidth / Math.abs(dx) : Number.POSITIVE_INFINITY;
		const yScaleToEdge = Math.abs(dy) > 0.001 ? halfHeight / Math.abs(dy) : Number.POSITIVE_INFINITY;
		const scaleToEdge = Math.min(xScaleToEdge, yScaleToEdge);

		return {
			x: rectangle.centerX + dx * scaleToEdge,
			y: rectangle.centerY + dy * scaleToEdge
		};
	}

	function labelKey(point: CommuneScatterPoint) {
		return `${point.rankGroup ?? activeRanking ?? 'Unranked'}:${point.code}`;
	}

	function clampLabelCenter(
		x: number,
		y: number,
		textWidth: number,
		textHeight: number,
		bounds = labelBounds(6)
	) {
		return {
			x: clamp(x, bounds.left + textWidth / 2, bounds.right - textWidth / 2),
			y: clamp(y, bounds.top + textHeight / 2, bounds.bottom - textHeight / 2)
		};
	}

	function extentDomain(values: number[], padding: number, min: number, max: number): [number, number] {
		const extent = d3.extent(values);

		if (extent[0] === undefined || extent[1] === undefined) {
			return [min, max];
		}

		const low = clamp(extent[0] - padding, min, max);
		const high = clamp(extent[1] + padding, min, max);

		if (high - low < padding * 2) {
			return centeredDomain((low + high) / 2, padding, min, max);
		}

		return [low, high];
	}

	function moveTooltip(event: PointerEvent) {
		const rect = chartPanelEl.getBoundingClientRect();
		tooltipX = event.clientX - rect.left;
		tooltipY = event.clientY - rect.top;
	}

	function toggleRegion(region: string) {
		if (hiddenRegions.has(region)) {
			hiddenRegions.delete(region);
		} else {
			hiddenRegions.add(region);
		}

		if (activePoint?.region === region && hiddenRegions.has(region)) {
			hovered = null;
			selectedPoint = null;
		}
	}

	function centeredDomain(value: number, halfSpan: number, min: number, max: number): [number, number] {
		if (halfSpan * 2 >= max - min) {
			return [min, max];
		}

		const low = clamp(value - halfSpan, min, max - halfSpan * 2);
		return [low, low + halfSpan * 2];
	}

	function animateDomains(nextXDomain: [number, number], nextYDomain: [number, number]) {
		cancelDomainAnimation();
		domainAnimating = true;

		const startXDomain = xDomain;
		const startYDomain = yDomain;
		const interpolateX0 = d3.interpolateNumber(startXDomain[0], nextXDomain[0]);
		const interpolateX1 = d3.interpolateNumber(startXDomain[1], nextXDomain[1]);
		const interpolateY0 = d3.interpolateNumber(startYDomain[0], nextYDomain[0]);
		const interpolateY1 = d3.interpolateNumber(startYDomain[1], nextYDomain[1]);
		const startedAt = performance.now();
		const duration = 500;

		function step(now: number) {
			const progress = clamp((now - startedAt) / duration, 0, 1);
			const eased = d3.easeCubicOut(progress);

			xDomain = [interpolateX0(eased), interpolateX1(eased)];
			yDomain = [interpolateY0(eased), interpolateY1(eased)];

			if (progress < 1) {
				animationFrame = requestAnimationFrame(step);
			} else {
				animationFrame = null;
				domainAnimating = false;
			}
		}

		animationFrame = requestAnimationFrame(step);
	}

	function cancelDomainAnimation() {
		if (animationFrame === null) {
			return;
		}

		cancelAnimationFrame(animationFrame);
		animationFrame = null;
		domainAnimating = false;
	}

	function normalizeSearch(value: string) {
		return value
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.trim();
	}
</script>

<div class="chart-shell">
	<aside class="chart-sidebar">
		<div>
			<p class="control-label">Outcome measure</p>
			<Select.Root type="single" value={activeMetric} onValueChange={handleMetricChange}>
				<Select.Trigger class="w-full">
					{metricConfig[activeMetric].shortLabel}
				</Select.Trigger>
				<Select.Content>
					{#each metrics as metric (metric)}
						<Select.Item value={metric} label={metricConfig[metric].label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<p class="control-label">Search</p>
			<Combobox.Root
				type="single"
				bind:open={searchOpen}
				bind:value={searchValue}
				onValueChange={handleSearchSelect}
			>
				<div class="search-wrap" bind:this={searchInputEl}>
					<SearchIcon class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
					<Combobox.Input
						placeholder="Search commune"
						class="flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-8 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						oninput={handleSearchInput}
						onkeydown={handleSearchKeydown}
					/>
					{#if searchQuery.length > 0 || searchValue}
						<button
							type="button"
							class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							onclick={clearSearch}
							aria-label="Clear search"
						>
							<XIcon class="size-4" />
						</button>
					{/if}
				</div>

				<Combobox.Content class="w-(--bits-combobox-anchor-width)! max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-md z-50" sideOffset={4}>
					{#if searchQuery.length >= 2 && searchMatches.length === 0}
						<div class="px-2 py-1.5 text-sm text-muted-foreground">No results found.</div>
					{/if}
					{#if searchMatches.length > 0}
						<Combobox.Group>
							<Combobox.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">Communes</Combobox.GroupHeading>
							{#each searchMatches as point (point.code)}
								<Combobox.Item
									value="commune:{point.code}"
									label={point.name}
									class="relative flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
								>
									<span>{point.name}</span>
									<span class="text-xs text-muted-foreground">{point.region}</span>
								</Combobox.Item>
							{/each}
						</Combobox.Group>
					{/if}
				</Combobox.Content>
			</Combobox.Root>
		</div>

		{#if activeMetric === 'weighted'}
			<div>
				<p class="control-label">Rank</p>
				<div class="rank-buttons">
					<Button
						variant={activeRanking === 'Top 20' ? 'default' : 'outline'}
						size="sm"
						class="flex-1"
						onclick={() => setRankingFilter('Top 20')}
					>
						Top 20
					</Button>
					<Button
						variant={activeRanking === 'Bottom 20' ? 'default' : 'outline'}
						size="sm"
						class="flex-1"
						onclick={() => setRankingFilter('Bottom 20')}
					>
						Worst 20
					</Button>
				</div>
			</div>
		{/if}

		<div class="region-legend" aria-label="Region legend">
			<p class="control-label">Regions</p>
			{#each regions as region (region)}
				<button
					type="button"
					class="legend-item"
					class:legend-off={hiddenRegions.has(region)}
					class:legend-unrepresented={!representedRegions.has(region)}
					aria-pressed={!hiddenRegions.has(region)}
					onclick={() => toggleRegion(region)}
				>
					<span class="legend-swatch" style={`background:${colorForRegionName(region)}`}></span>
					<span>{region}</span>
				</button>
			{/each}
			<Button variant="outline" size="sm" class="mt-2 w-full" onclick={resetChart}>
				Reset
			</Button>
		</div>
	</aside>

	<div class="chart-panel" bind:this={chartPanelEl}>
		<p class="quota-label-above">mandatory 25% municipal social housing quota</p>
		<svg
			viewBox={`0 0 ${width} ${height}`}
			role="img"
			aria-label={`Commune cumulative social housing share evolution by ${metricConfig[activeMetric].label}`}
			class="chart"
			ondblclick={resetZoom}
		>
	<defs>
		<clipPath id="commune-scatter-plot-area">
			<rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} />
		</clipPath>
	</defs>

	{#each xTicks as tick (tick)}
		<line
			x1={transformedXScale(tick)}
			x2={transformedXScale(tick)}
			y1={margin.top}
			y2={height - margin.bottom}
			stroke={GRAPHICS_COLORS.grid}
			stroke-dasharray="2 2"
			stroke-width="0.5"
		/>
		<text x={transformedXScale(tick)} y={height - margin.bottom + 24} text-anchor="middle" class="axis-label">
			{formatPercent(tick)}
		</text>
	{/each}

	{#each yTicks as tick (tick)}
		<line
			x1={margin.left}
			x2={width - margin.right}
			y1={transformedYScale(tick)}
			y2={transformedYScale(tick)}
			stroke={GRAPHICS_COLORS.grid}
			stroke-dasharray="2 2"
			stroke-width="0.5"
		/>
		<text x={margin.left - 12} y={transformedYScale(tick) + 4} text-anchor="end" class="axis-label">{tick}</text>
	{/each}

	<line
		x1={transformedXScale(targetShare)}
		x2={transformedXScale(targetShare)}
		y1={margin.top}
		y2={height - margin.bottom}
		stroke={GRAPHICS_COLORS.secondaryText}
		stroke-dasharray="6 6"
		stroke-width="1"
		clip-path="url(#commune-scatter-plot-area)"
	/>
	<line
		x1={margin.left}
		x2={width - margin.right}
		y1={height - margin.bottom}
		y2={height - margin.bottom}
		stroke={GRAPHICS_COLORS.ink}
		stroke-width="0.75"
	/>
	<line
		x1={margin.left}
		x2={margin.left}
		y1={margin.top}
		y2={height - margin.bottom}
		stroke={GRAPHICS_COLORS.ink}
		stroke-width="0.75"
	/>

	<text x={width / 2} y={height - 14} text-anchor="middle" class="axis-title">
		Cumulative evolution of the social housing share, 2005–2022
	</text>
	<text
		x={-height / 2}
		y={18}
		text-anchor="middle"
		transform="rotate(-90)"
		class="axis-title"
	>
		{metricConfig[activeMetric].axisLabel}
	</text>

	<g bind:this={brushElement} class="brush-layer"></g>

	<g clip-path={clippedToPlot ? 'url(#commune-scatter-plot-area)' : undefined}>
		{#each visiblePoints as point (point.code)}
			<circle
				cx={xPosition(point)}
				cy={yPosition(point)}
				r={radiusForPoint(point)}
				fill={fillForPoint(point)}
				fill-opacity={opacityForPoint(point)}
				stroke={activePoint?.code === point.code ? GRAPHICS_COLORS.canvas : 'none'}
				role="img"
				aria-label={`${point.name}: population ${formatNumber(point.population)}`}
				onpointerenter={(event) => {
					hovered = point;
					moveTooltip(event);
				}}
				onpointermove={moveTooltip}
				onpointerleave={() => (hovered = null)}
			>
				<title>
					{point.name}: {metricConfig[activeMetric].shortLabel} {formatMetricValue(point)}; population {formatNumber(point.population)}
				</title>
			</circle>
		{/each}
	</g>

	{#if activeRanking && !domainAnimating}
		<g clip-path={clippedToPlot ? 'url(#commune-scatter-plot-area)' : undefined}>
			{#each labelPlacements as label (label.point.code)}
				<line
					x1={xPosition(label.point)}
					y1={yPosition(label.point)}
					x2={label.lineEndX}
					y2={label.lineEndY}
					class="leader-line"
				/>
				<text
					x={label.labelX}
					y={label.labelY}
					text-anchor={label.textAnchor}
					class="point-label"
				>
					{label.point.rank}. {label.point.name}
				</text>
			{/each}
		</g>
	{/if}
		</svg>

		{#if hovered && activePoint}
			<div
				class="absolute z-20 bg-gray-900 text-white rounded-md px-3 py-2 text-xs pointer-events-none shadow-lg"
				style="left:{tooltipX + 12}px;top:{tooltipY - 10}px"
			>
				<p class="font-semibold">{activePoint.name}</p>
				<p class="mt-1 text-gray-200">
					{metricConfig[activeMetric].shortLabel}: {formatMetricValue(activePoint)}
				</p>
				{#if activeMetric === 'weighted' && activePoint.rank}
					<p class="text-gray-200">
						{activePoint.rankGroup === 'Top 20' ? 'Top' : 'Worst'} rank: {activePoint.rank}
					</p>
				{/if}
				<p class="text-gray-200">Population: {formatNumber(activePoint.population)}</p>
				<p class="text-gray-200">
					Social housing: {formatPercent(activePoint.socialHousingShare2022)}
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.chart {
		display: block;
		width: 100%;
		height: auto;
		color: #121212;
		font-size: 11px;
		user-select: none;
	}

	.chart-shell {
		display: flex;
		flex-direction: column;
		border: 1px solid #dadad7;
		background: white;
	}

	.chart-sidebar {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 16px;
		border-bottom: 1px solid #dadad7;
		background: white;
		padding: 16px;
	}

	.chart-panel {
		position: relative;
		min-width: 0;
		flex: 1;
		padding: 16px;
	}

	.control-label {
		margin-bottom: 6px;
		color: #5f5f5f;
		font-size: 12px;
		font-weight: 500;
	}

	.search-wrap {
		position: relative;
	}

	.rank-buttons {
		display: flex;
		gap: 8px;
	}

	.axis-label,
	.axis-title {
		fill: #121212;
		font-size: 11px;
	}

	.quota-label-above {
		margin: 0 0 4px;
		color: #5f5f5f;
		font-size: 10px;
		font-weight: 500;
		text-align: center;
	}

	.point-label {
		fill: #121212;
		font-size: 10px;
		font-weight: 500;
		paint-order: stroke;
		stroke: white;
		stroke-width: 3px;
		stroke-linejoin: round;
		pointer-events: none;
	}

	.leader-line {
		stroke: #5f5f5f;
		stroke-width: 0.75;
		stroke-opacity: 0.65;
		pointer-events: none;
	}

	.region-legend {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		border: 0;
		background: transparent;
		color: #5f5f5f;
		padding: 2px 0;
		font-size: 12px;
		text-align: left;
	}

	.legend-item:hover {
		color: #121212;
	}

	.legend-off {
		opacity: 0.35;
	}

	.legend-unrepresented {
		opacity: 0.3;
	}

	.legend-swatch {
		display: block;
		flex: 0 0 auto;
		width: 10px;
		height: 10px;
		border: 1px solid #dadad7;
	}

	.brush-layer {
		touch-action: none;
	}

	:global(.brush-layer .overlay) {
		cursor: crosshair;
	}

	:global(.brush-layer .selection) {
		fill: #bfd2d5;
		fill-opacity: 0.45;
		stroke: #497380;
	}

	@media (min-width: 768px) {
		.chart-shell {
			flex-direction: row;
		}

		.chart-sidebar {
			border-right: 1px solid #dadad7;
			border-bottom: 0;
			width: 240px;
			flex: 0 0 240px;
		}
	}
</style>
