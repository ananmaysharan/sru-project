<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import {
        socialHousingStock,
        type SocialHousingStockYear,
    } from "$lib/data/charts/social-housing-stock";
    import { legislations } from "$lib/data/charts/hero-timeline";
    import { headlines } from "$lib/data/charts/news-headlines";
    import { asset } from "$app/paths";
    import { STORY_PHASES, phaseProgress } from "$lib/data/charts/scroll-story";

    interface Props {
        /** Normalized scroll progress through the story section, 0 → 1. */
        progress?: number;
    }
    let { progress = 0 }: Props = $props();

    // --- Scroll choreography ------------------------------------------------
    // Each beat reads its own 0 → 1 slice of the overall scroll progress.
    const lineProgress = $derived(phaseProgress(progress, STORY_PHASES.line));
    const policiesProgress = $derived(
        phaseProgress(progress, STORY_PHASES.policies),
    );
    const zoomProgress = $derived(phaseProgress(progress, STORY_PHASES.zoom));
    const newsProgress = $derived(phaseProgress(progress, STORY_PHASES.news));

    // Policies fade out as the zoom begins (the cards belong to the 2000–2014
    // span that scrolls off-screen). `cardsVisible` gates their staggered entry.
    const cardsVisible = $derived(policiesProgress > 0);
    const policiesOpacity = $derived(1 - zoomProgress);
    const newsVisible = $derived(newsProgress > 0);

    const BLUE = "#06738b";

    const BOX_OFFSET = 50;
    const CARD_GAP = 16;
    const CARD_INSET = 12;
    const CARDS_STAGGER_MS = 80;
    const CARDS_DUR_MS = 450;

    const HL_BOX_W = 140;
    const HL_OFFSET = 16;
    const HL_STAGGER_MS = 40;

    const SHOW_GRIDLINES = false;

    const margin = { top: 40, right: 100, left: 100 };

    const milestoneYears = new Set([2000, 2005, 2010, 2015, 2020]);
    const milestones = socialHousingStock.filter((d) =>
        milestoneYears.has(d.year),
    );

    const straightYears = new Set([2000, 2007, 2014, 2017]);

    const ZOOM_START_YEAR = 2000;
    const ZOOM_END_LEFT = 2015;
    const ZOOM_RIGHT = 2025;

    function fractionalYear(dateStr: string): number {
        const d = new Date(dateStr);
        const y = d.getFullYear();
        const start = new Date(y, 0, 1).getTime();
        const end = new Date(y + 1, 0, 1).getTime();
        return y + (d.getTime() - start) / (end - start);
    }

    function unitsAt(frac: number): number {
        const idx = Math.floor(frac);
        const a =
            socialHousingStock.find((d) => d.year === idx) ??
            socialHousingStock[socialHousingStock.length - 1];
        const b = socialHousingStock.find((d) => d.year === idx + 1) ?? a;
        const t = frac - idx;
        return a && b ? a.units + (b.units - a.units) * t : (a?.units ?? 0);
    }

    const decoratedLegislations = legislations.map((l) => {
        const frac = fractionalYear(l.date);
        return { ...l, frac, units: unitsAt(frac) };
    });

    const decoratedHeadlines = headlines.map((h) => ({
        ...h,
        units: unitsAt(h.frac),
    }));

    function cardCenterX(i: number, w: number): number {
        const N = decoratedLegislations.length;
        const containerW = Math.max(0, w - 2 * CARD_INSET);
        const cardW = (containerW - (N - 1) * CARD_GAP) / N;
        return CARD_INSET + i * (cardW + CARD_GAP) + cardW / 2;
    }

    // -- Headline grid ------------------------------------------------------
    // Headlines flow into a 9-column × 3-row grid below the chart. Each
    // entry's column corresponds to its rough year cluster; rows go
    // top-to-bottom by date within the column.
    type HeadlineGridPos = { col: number; row: number };

    const HEADLINE_GRID: Record<string, HeadlineGridPos> = {
        "March 2015": { col: 1, row: 1 },
        "September 2015": { col: 1, row: 2 },
        "October 2015": { col: 2, row: 1 },
        "April 2016": { col: 2, row: 2 },
        "April 2016 2": { col: 3, row: 1 },
        "July 2016": { col: 3, row: 2 },
        "September 2018": { col: 3, row: 3 },
        "April 2018": { col: 4, row: 1 },
        "December 2018": { col: 4, row: 2 },
        "January 2019": { col: 4, row: 3 },
        "September 2019": { col: 5, row: 1 },
        "November 2019": { col: 5, row: 2 },
        "December 2020 2": { col: 5, row: 3 },
        "December 2020": { col: 6, row: 1 },
        "November 2022 2": { col: 6, row: 2 },
        "November 2022": { col: 7, row: 1 },
        "March 2023": { col: 7, row: 2 },
        "January 2024": { col: 8, row: 1 },
        "February 2024": { col: 8, row: 2 },
        "April 2024 2": { col: 8, row: 3 },
        "April 2024": { col: 9, row: 1 },
        "June 2024": { col: 9, row: 2 },
        "October 2024": { col: 9, row: 3 },
    };

    // Vertical gap from the x-axis baseline down to the first row of the news
    // grid, keeping the headline boxes clear of the year labels.
    const GRID_OFFSET = 44;
    const HL_BOX_H = 40;
    const COL_GAP = 12;
    const ROW_GAP = 8;
    const GRID_COLS = 9;
    const GRID_WIDTH = GRID_COLS * HL_BOX_W + (GRID_COLS - 1) * COL_GAP;
    const HL_HOVER_SCALE = 2.5;

    let hoveredId = $state<string | null>(null);

    // Extend the data with a synthetic 2025 point that holds the 2024 value, so
    // the line carries flat from 2024 → 2025 and labels can travel into 2025.
    const extendedStock: SocialHousingStockYear[] = [
        ...socialHousingStock,
        {
            year: 2025,
            units: socialHousingStock[socialHousingStock.length - 1].units,
        },
    ];

    let containerEl: HTMLDivElement;
    let pathEl: SVGPathElement | null = $state(null);

    let width = $state(0);
    let height = $state(0);

    let tipX = $state(0);
    let tipY = $state(0);
    let tipYear = $state(socialHousingStock[0].year);
    let tipValue = $state(socialHousingStock[0].units);

    // Leading edge of the reveal clip. Tracks the draw all the way to 2025,
    // while the tip dot/label above park at 2024 (the last real data point).
    let revealX = $state(0);

    // Measured height of the legislation-card row. The row sizes to its content
    // (see bind:clientHeight below) so the chart area is never padded with the
    // dead space a fixed card height would leave.
    let cardsHeight = $state(0);

    // Below-axis budget: the year labels plus whichever block — the policy cards
    // or the 3-row news grid — is taller (they share the same band at different
    // scroll beats). Deriving it means trimming the cards grows the plot
    // automatically, with no hardcoded chart height.
    const newsBlock = GRID_OFFSET + 3 * HL_BOX_H + 2 * ROW_GAP;
    const marginBottom = $derived(
        Math.max(BOX_OFFSET + cardsHeight, newsBlock) + 8,
    );

    const domainLeft = $derived(
        ZOOM_START_YEAR + (ZOOM_END_LEFT - ZOOM_START_YEAR) * zoomProgress,
    );

    const xScale = $derived(
        d3
            .scaleLinear()
            .domain([domainLeft, ZOOM_RIGHT])
            .range([margin.left, Math.max(margin.left, width - margin.right)])
            .clamp(true),
    );

    // Gap reserved between the bottom of the plotted line and the x-axis year
    // labels, so the milestone value labels (which hang below their dots) and
    // the floating tip label always clear the years.
    const AXIS_GAP = 56;

    // Y-domain hugs the data extent (~3.99M → 5.37M) with only a sliver of
    // padding, so the rises and the 2014 / 2021 dips read as steep peaks and
    // troughs. Axis-label clearance is handled separately by AXIS_GAP below,
    // which frees the floor to sit right under the data minimum.
    const yScale = $derived(
        d3
            .scaleLinear()
            .domain([3_950_000, 5_400_000])
            .range([
                Math.max(margin.top, height - marginBottom - AXIS_GAP),
                margin.top,
            ]),
    );

    function getHeadlinePos(h: { id: string; frac: number }): {
        x: number;
        y: number;
    } {
        const g = HEADLINE_GRID[h.id];
        if (g) {
            // Center the grid within the chart's drawable area so the news
            // block sits centered under the data line.
            const gLeft =
                margin.left +
                (Math.max(0, width - margin.left - margin.right) - GRID_WIDTH) /
                    2;
            return {
                x: gLeft + (g.col - 1) * (HL_BOX_W + COL_GAP) + HL_BOX_W / 2,
                y:
                    height -
                    marginBottom +
                    GRID_OFFSET +
                    (g.row - 1) * (HL_BOX_H + ROW_GAP),
            };
        }
        return {
            x: xScale(h.frac),
            y: height - marginBottom + HL_OFFSET,
        };
    }

    // The animated line runs 2000 → 2025. The flat 2024 → 2025 carry is part of
    // the same path, so it gets drawn as a continuation of the scroll-driven
    // reveal rather than appearing all at once.
    const linePath = $derived(
        width === 0
            ? ""
            : (d3
                  .line<SocialHousingStockYear>()
                  .x((d) => xScale(d.year))
                  .y((d) => yScale(d.units))
                  .curve(d3.curveLinear)
                  .defined((d) => d.year >= domainLeft - 0.001)(
                  extendedStock,
              ) ?? ""),
    );

    const ready = $derived(!!pathEl && width > 0 && linePath !== "");

    const bisectYear = d3.bisector<SocialHousingStockYear, number>(
        (d) => d.year,
    ).left;

    function updateTipFromProgress(p: number) {
        if (!pathEl) return;
        const total = pathEl.getTotalLength();
        const pt = pathEl.getPointAtLength(total * p);
        revealX = pt.x;

        // Park the tip dot + label at the last real data point (2024); the flat
        // 2024 → 2025 carry keeps drawing past them via revealX.
        const last = socialHousingStock[socialHousingStock.length - 1];
        const lastX = xScale(last.year);
        if (pt.x >= lastX) {
            tipX = lastX;
            tipY = yScale(last.units);
        } else {
            tipX = pt.x;
            tipY = pt.y;
        }

        const yearF = xScale.invert(Math.min(pt.x, lastX));
        const idx = bisectYear(socialHousingStock, yearF);
        const a = socialHousingStock[Math.max(0, idx - 1)];
        const b =
            socialHousingStock[Math.min(socialHousingStock.length - 1, idx)];
        if (a === b || b.year === a.year) {
            tipYear = a.year;
            tipValue = a.units;
        } else {
            const r = Math.max(
                0,
                Math.min(1, (yearF - a.year) / (b.year - a.year)),
            );
            tipYear = Math.round(a.year + (b.year - a.year) * r);
            tipValue = Math.round(a.units + (b.units - a.units) * r);
        }
    }

    onMount(() => {
        const ro = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            width = rect.width;
            height = rect.height;
        });
        ro.observe(containerEl);
        return () => ro.disconnect();
    });

    // Re-anchor the tip whenever the draw progress or the scale changes. The
    // moving tip + reveal clip are both driven by scroll, so there is no RAF
    // loop — the line is drawn exactly as far as the reader has scrolled.
    $effect(() => {
        lineProgress;
        linePath;
        width;
        if (!pathEl || width === 0 || linePath === "") return;
        updateTipFromProgress(lineProgress);
    });

    const formatValue = (v: number) => `${(v / 1_000_000).toFixed(2)}M`;
</script>

<div
    bind:this={containerEl}
    class="relative m-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] bg-white"
>
    {#if width > 0 && height > 0}
        {@const axisY = height - marginBottom}
        <svg {width} {height} class="block" style="overflow: visible;">
            <defs>
                <clipPath id="shs-reveal">
                    <rect x="0" y="0" width={revealX} {height} />
                </clipPath>
            </defs>

            {#if SHOW_GRIDLINES}
                <g>
                    {#each extendedStock as d (d.year)}
                        {@const x = xScale(d.year)}
                        <line
                            x1={x}
                            y1={margin.top}
                            x2={x}
                            y2={axisY}
                            stroke="#d1d5db"
                            stroke-width="1"
                            stroke-dasharray="3 4"
                        />
                    {/each}
                </g>
            {/if}

            <!-- Connectors from each card up to its date on the data line.
                 Outer group carries scroll-driven policiesOpacity; inner
                 groups stagger in once cardsVisible flips true. -->
            <g style="opacity: {policiesOpacity};">
                {#each decoratedLegislations as law, i (law.date)}
                    {@const cardX = cardCenterX(i, width)}
                    {@const dateX = xScale(law.frac)}
                    {@const cardTopY = axisY + BOX_OFFSET}
                    {@const dataLineY = yScale(law.units) + 3}
                    {@const railY =
                        axisY +
                        22 +
                        (i / Math.max(1, decoratedLegislations.length - 1)) *
                            (BOX_OFFSET - 28)}
                    <g
                        style="opacity: {cardsVisible
                            ? 1
                            : 0}; transition: opacity {CARDS_DUR_MS}ms ease-out {cardsVisible
                            ? i * CARDS_STAGGER_MS
                            : 0}ms;"
                    >
                        {#if straightYears.has(law.year)}
                            <line
                                x1={dateX}
                                y1={cardTopY}
                                x2={dateX}
                                y2={dataLineY}
                                stroke="#9ca3af"
                                stroke-width="1"
                            />
                        {:else}
                            <polyline
                                points="{cardX},{cardTopY} {cardX},{railY} {dateX},{railY} {dateX},{dataLineY}"
                                fill="none"
                                stroke="#9ca3af"
                                stroke-width="1"
                            />
                        {/if}
                    </g>
                {/each}
            </g>

            <g clip-path="url(#shs-reveal)">
                <path
                    bind:this={pathEl}
                    d={linePath}
                    fill="none"
                    stroke={BLUE}
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>

            <!-- 5-year milestone dots (drop-behind, fixed once passed) -->
            <g>
                {#each milestones as m (m.year)}
                    {@const mx = xScale(m.year)}
                    {@const my = yScale(m.units)}
                    {#if tipX >= mx - 0.5 && m.year >= domainLeft - 0.001}
                        <circle cx={mx} cy={my} r="3.5" fill={BLUE} />
                    {/if}
                {/each}
            </g>

            {#if ready && lineProgress < 1}
                <circle
                    cx={tipX}
                    cy={tipY}
                    r="10"
                    fill={BLUE}
                    fill-opacity="0.18"
                />
            {/if}
            {#if ready}
                <circle cx={tipX} cy={tipY} r="4.5" fill={BLUE} />
            {/if}

            <!-- Year labels — white stroke + paint-order trick halos the
                 glyphs so gridlines break around the text shape only. -->
            <g
                paint-order="stroke"
                stroke="white"
                stroke-width="3"
                stroke-linejoin="round"
            >
                {#each extendedStock as d (d.year)}
                    {@const x = xScale(d.year)}
                    {#if d.year >= domainLeft - 0.001}
                        <text
                            {x}
                            y={axisY + 18}
                            text-anchor="middle"
                            font-size="10"
                            fill="#6b7280"
                        >
                            {d.year}
                        </text>
                    {/if}
                {/each}
            </g>

            <!-- Headline connector line: only drawn for the currently
                 hovered headline. -->
            <g style="opacity: {newsVisible ? 1 : 0};">
                {#each decoratedHeadlines as h (h.id)}
                    {#if h.frac >= domainLeft - 0.001 && hoveredId === h.id}
                        {@const pos = getHeadlinePos(h)}
                        {@const lineX = xScale(h.frac)}
                        {@const lineY = yScale(h.units)}
                        {@const below = pos.y > lineY}
                        {@const startY = below ? lineY + 3 : lineY - 3}
                        {#if Math.abs(lineX - pos.x) < 12}
                            <line
                                x1={pos.x}
                                y1={startY}
                                x2={pos.x}
                                y2={pos.y}
                                stroke="#9ca3af"
                                stroke-width="1"
                            />
                        {:else}
                            {@const midY = (startY + pos.y) / 2}
                            <polyline
                                points="{lineX},{startY} {lineX},{midY} {pos.x},{midY} {pos.x},{pos.y}"
                                fill="none"
                                stroke="#9ca3af"
                                stroke-width="1"
                            />
                        {/if}
                    {/if}
                {/each}
            </g>
        </svg>

        {#each milestones as m (m.year)}
            {@const mx = xScale(m.year)}
            {@const my = yScale(m.units)}
            {#if tipX >= mx - 0.5 && m.year >= domainLeft - 0.001}
                <div
                    class="absolute pointer-events-none select-none -translate-x-1/2 whitespace-nowrap text-center bg-white px-1.5 py-1"
                    style="left: {mx}px; top: {my + 12}px; color: {BLUE};"
                >
                    <div class="text-sm font-semibold leading-none">
                        {formatValue(m.units)}
                    </div>
                    <div class="text-[10px] opacity-70 leading-none mt-0.5">
                        total units
                    </div>
                </div>
            {/if}
        {/each}

        <!-- Floating current-value label. Hidden on milestone years so it
             never doubles up with the permanent milestone label sitting at the
             same point (including the 2000 start). -->
        {#if ready && !milestoneYears.has(tipYear)}
            <div
                class="absolute pointer-events-none select-none -translate-x-1/2 whitespace-nowrap text-center"
                style="left: {tipX}px; top: {tipY + 14}px; color: {BLUE};"
            >
                <div class="text-sm font-semibold leading-none">
                    {formatValue(tipValue)}
                </div>
                <div class="text-[10px] opacity-70 leading-none mt-0.5">
                    total units
                </div>
            </div>
        {/if}

        <!-- Legislation cards: fade in (staggered) during the policies beat and
             fade out as the zoom begins. The outer container carries
             scroll-driven policiesOpacity. -->
        <div
            bind:clientHeight={cardsHeight}
            class="absolute pointer-events-none select-none flex"
            style="left: {CARD_INSET}px; right: {CARD_INSET}px; top: {axisY +
                BOX_OFFSET}px; gap: {CARD_GAP}px; opacity: {policiesOpacity};"
        >
            {#each decoratedLegislations as law, i (law.date)}
                <div
                    class="flex-1 min-w-0 border border-gray-300 bg-white"
                    style="opacity: {cardsVisible
                        ? 1
                        : 0}; transition: opacity {CARDS_DUR_MS}ms ease-out {cardsVisible
                        ? i * CARDS_STAGGER_MS
                        : 0}ms;"
                >
                    <div class="flex flex-col overflow-hidden p-2">
                        <div
                            class="text-xs font-bold leading-tight text-gray-900"
                        >
                            {law.name}
                        </div>
                        <div
                            class="text-[8px] italic text-gray-600 leading-tight mt-0.5"
                        >
                            {law.fullName}
                        </div>
                        <div class="text-[8px] text-gray-400 mt-0.5">
                            {law.date}
                        </div>
                        <div class="mt-1.5">
                            <div class="text-[9px] font-semibold text-gray-800">
                                Key Objectives
                            </div>
                            <div
                                class="text-[8px] text-gray-600 leading-snug mt-0.5"
                            >
                                {law.objectives}
                            </div>
                        </div>
                        {#if law.sanctions}
                            <div class="mt-1.5">
                                <div
                                    class="text-[9px] font-semibold text-gray-800"
                                >
                                    Key Sanctions
                                </div>
                                <div
                                    class="text-[8px] text-gray-600 leading-snug mt-0.5"
                                >
                                    {law.sanctions}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>

        <!-- News headline screenshots: reveal during the news beat; hover
             scales the box and draws a connector to its date on the line. -->
        {#each decoratedHeadlines as h, i (h.id)}
            {#if h.frac >= domainLeft - 0.001}
                {@const pos = getHeadlinePos(h)}
                {@const isHovered = hoveredId === h.id}
                {@const col = HEADLINE_GRID[h.id]?.col}
                {@const xOrigin =
                    col === 1 ? "0%" : col === GRID_COLS ? "100%" : "50%"}
                <div
                    role="presentation"
                    class="absolute border border-gray-300 bg-white select-none cursor-pointer"
                    style="left: {pos.x}px; top: {pos.y}px; width: {HL_BOX_W}px; height: {HL_BOX_H}px; transform: translateX(-50%) scale({isHovered
                        ? HL_HOVER_SCALE
                        : 1}); transform-origin: {xOrigin} 0; transition: transform 180ms ease-out, opacity {CARDS_DUR_MS}ms ease-out {newsVisible
                        ? i * HL_STAGGER_MS
                        : 0}ms; z-index: {isHovered
                        ? 20
                        : 1}; opacity: {newsVisible
                        ? 1
                        : 0}; pointer-events: {newsVisible ? 'auto' : 'none'};"
                    onmouseenter={() => (hoveredId = h.id)}
                    onmouseleave={() => (hoveredId = null)}
                >
                    <img
                        src={asset(h.full)}
                        alt={h.caption}
                        loading="lazy"
                        draggable="false"
                        class="block h-full w-full object-contain pointer-events-none"
                    />
                </div>
            {/if}
        {/each}
    {/if}
</div>
