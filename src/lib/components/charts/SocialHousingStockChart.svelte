<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import PlayIcon from "@lucide/svelte/icons/play";
    import PauseIcon from "@lucide/svelte/icons/pause";
    import FastForwardIcon from "@lucide/svelte/icons/fast-forward";
    import {
        socialHousingStock,
        type SocialHousingStockYear,
    } from "$lib/data/charts/social-housing-stock";
    import { legislations } from "$lib/data/charts/hero-timeline";
    import { headlines } from "$lib/data/charts/news-headlines";
    import { asset } from "$app/paths";

    const BLUE = "#06738b";
    const ANIM_MS = 7000;

    const BOX_HEIGHT = 220;
    const BOX_OFFSET = 50;
    const CARD_GAP = 16;
    const CARD_INSET = 12;
    const CARDS_DELAY_MS = 1000;
    const CARDS_STAGGER_MS = 80;
    const CARDS_DUR_MS = 450;

    const HL_BOX_W = 140;
    const HL_OFFSET = 16;
    const HL_STAGGER_MS = 40;

    const SHOW_GRIDLINES = false;

    const margin = { top: 40, right: 100, bottom: 290, left: 100 };

    const milestoneYears = new Set([2000, 2005, 2010, 2015, 2020]);
    const milestones = socialHousingStock.filter((d) =>
        milestoneYears.has(d.year),
    );

    const straightYears = new Set([2000, 2007, 2014, 2017]);

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

    // -- Headline drag/edit mode --------------------------------------------
    // Hand-authored positions for each headline (top-left in chart-container
    // pixels, with `-translate-x-1/2` applied so x is the box's center).
    // dragMode lets you nudge these in the browser and copy the new
    // positions back over this map.
    // Headlines flow into a 9-column × 3-row grid below the chart. Each
    // entry's column corresponds to its rough year cluster; rows go
    // top-to-bottom by date within the column. Column counts (left → right)
    // are 2 / 2 / 3 / 3 / 3 / 2 / 2 / 3 / 3.
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

    const GRID_TOP = 182;
    const HL_BOX_H = 40;
    const COL_GAP = 12;
    const ROW_GAP = 8;
    const GRID_COLS = 9;
    const GRID_WIDTH = GRID_COLS * HL_BOX_W + (GRID_COLS - 1) * COL_GAP;
    const HL_HOVER_SCALE = 2.5;

    let hoveredId = $state<string | null>(null);

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
                y: GRID_TOP + (g.row - 1) * (HL_BOX_H + ROW_GAP),
            };
        }
        return {
            x: xScale(h.frac),
            y: height - margin.bottom + HL_OFFSET,
        };
    }

    interface Props {
        policiesOpacity?: number;
        zoomProgress?: number;
        autoStart?: boolean;
        newsVisible?: boolean;
        oncomplete?: () => void;
    }
    let {
        policiesOpacity = 1,
        zoomProgress = 0,
        autoStart = true,
        newsVisible = false,
        oncomplete,
    }: Props = $props();

    const ZOOM_START_YEAR = 2000;
    const ZOOM_END_LEFT = 2015;
    const ZOOM_RIGHT = 2025;

    // Extend the data with a synthetic 2025 point that holds the 2024
    // value, so the chart line carries flat from 2024 → 2025 and the
    // tip / year labels can travel into 2025.
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

    let progress = $state(0);
    let tipX = $state(0);
    let tipY = $state(0);
    let tipYear = $state(socialHousingStock[0].year);
    let tipValue = $state(socialHousingStock[0].units);
    let playing = $state(false);
    let ready = $state(false);
    let cardsVisible = $state(false);

    let elapsed = 0;
    let runStart = 0;
    let raf = 0;
    let cardsTimer: ReturnType<typeof setTimeout> | null = null;

    function clearCardsTimer() {
        if (cardsTimer !== null) {
            clearTimeout(cardsTimer);
            cardsTimer = null;
        }
    }

    function scheduleCards(delay: number) {
        clearCardsTimer();
        if (delay <= 0) {
            cardsVisible = true;
            oncomplete?.();
        } else {
            cardsTimer = setTimeout(() => {
                cardsVisible = true;
                oncomplete?.();
                cardsTimer = null;
            }, delay);
        }
    }

    onMount(() => {
        const ro = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            width = rect.width;
            height = rect.height;
        });
        ro.observe(containerEl);
        return () => {
            ro.disconnect();
            cancelAnimationFrame(raf);
            clearCardsTimer();
        };
    });

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

    const yScale = $derived(
        d3
            .scaleLinear()
            .domain([1_000_000, 5_500_000])
            .range([Math.max(margin.top, height - margin.bottom), margin.top]),
    );

    // Animation path stops at 2024 — the moving tip + label never enter
    // the synthetic 2025 segment.
    const linePath = $derived(
        width === 0
            ? ""
            : (d3
                  .line<SocialHousingStockYear>()
                  .x((d) => xScale(d.year))
                  .y((d) => yScale(d.units))
                  .curve(d3.curveLinear)
                  .defined((d) => d.year >= domainLeft - 0.001)(
                  socialHousingStock,
              ) ?? ""),
    );

    // Static extension from 2024 → 2025, drawn after the animation finishes.
    const extensionPath = $derived.by(() => {
        if (width === 0) return "";
        const a = socialHousingStock[socialHousingStock.length - 1];
        const b = extendedStock[extendedStock.length - 1];
        if (a.year < domainLeft - 0.001) return "";
        return `M ${xScale(a.year)},${yScale(a.units)} L ${xScale(b.year)},${yScale(b.units)}`;
    });

    const bisectYear = d3.bisector<SocialHousingStockYear, number>(
        (d) => d.year,
    ).left;

    function updateTipFromProgress(p: number) {
        if (!pathEl) return;
        const total = pathEl.getTotalLength();
        const pt = pathEl.getPointAtLength(total * p);
        tipX = pt.x;
        tipY = pt.y;

        const yearF = xScale.invert(pt.x);
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

    function tick(now: number) {
        const t = Math.min(1, (elapsed + (now - runStart)) / ANIM_MS);
        progress = t;
        updateTipFromProgress(t);

        if (t < 1 && playing) {
            raf = requestAnimationFrame(tick);
        } else if (t >= 1) {
            elapsed = ANIM_MS;
            playing = false;
            scheduleCards(CARDS_DELAY_MS);
        }
    }

    function play() {
        if (!pathEl || playing) return;
        if (elapsed >= ANIM_MS) elapsed = 0;
        playing = true;
        runStart = performance.now();
        raf = requestAnimationFrame(tick);
    }

    function pause() {
        if (!playing) return;
        elapsed = Math.min(ANIM_MS, elapsed + (performance.now() - runStart));
        playing = false;
        cancelAnimationFrame(raf);
    }

    function replay() {
        cancelAnimationFrame(raf);
        clearCardsTimer();
        cardsVisible = false;
        elapsed = 0;
        progress = 0;
        playing = true;
        runStart = performance.now();
        raf = requestAnimationFrame(tick);
    }

    function skipToEnd() {
        cancelAnimationFrame(raf);
        elapsed = ANIM_MS;
        playing = false;
        progress = 1;
        updateTipFromProgress(1);
        scheduleCards(0);
    }

    // Auto-start once the path is mounted, sized, and autoStart is true.
    $effect(() => {
        if (!pathEl || !linePath || width === 0 || ready || !autoStart) return;
        ready = true;
        const startPt = pathEl.getPointAtLength(0);
        tipX = startPt.x;
        tipY = startPt.y;
        play();
    });

    // Re-anchor the tip whenever the path / scale changes (e.g. scroll-
    // driven zoom). Without this, tipX / tipY stay frozen at the pixel
    // values from the last animation frame and the dot drifts to whatever
    // data year happens to sit under that old pixel in the new scale,
    // while the extension line repositions correctly — producing a
    // disconnected line + dot pair.
    $effect(() => {
        // Touch the reactive inputs so this effect tracks them.
        linePath;
        width;
        if (!pathEl || !ready || playing) return;
        updateTipFromProgress(progress);
    });

    const formatValue = (v: number) => `${(v / 1_000_000).toFixed(2)}M`;
</script>

<div
    bind:this={containerEl}
    class="relative m-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] bg-white"
>
    {#if width > 0 && height > 0}
        {@const axisY = height - margin.bottom}
        <svg {width} {height} class="block" style="overflow: visible;">
            <defs>
                <clipPath id="shs-reveal">
                    <rect x="0" y="0" width={tipX} {height} />
                </clipPath>
            </defs>

            {#if SHOW_GRIDLINES}
                <g>
                    {#each extendedStock as d}
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
                 Right-angled with a per-card rail Y so horizontal segments
                 don't share lines. Fade in (staggered) when cards appear.
                 Outer group carries scroll-driven policiesOpacity. -->
            <g style="opacity: {policiesOpacity};">
                {#each decoratedLegislations as law, i}
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

            <!-- 2024 → 2025 extension. Drawn outside the reveal clip so it
                 fades in only once the animation has reached the end. -->
            <path
                d={extensionPath}
                fill="none"
                stroke={BLUE}
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="opacity: {progress >= 1
                    ? 1
                    : 0}; transition: opacity 300ms ease-out;"
            />

            <!-- 5-year milestone dots (drop-behind, fixed once passed) -->
            <g>
                {#each milestones as m}
                    {@const mx = xScale(m.year)}
                    {@const my = yScale(m.units)}
                    {#if tipX >= mx - 0.5 && m.year >= domainLeft - 0.001}
                        <circle cx={mx} cy={my} r="3.5" fill={BLUE} />
                    {/if}
                {/each}
            </g>

            {#if ready && progress < 1}
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
                 glyphs, so gridlines break around the text shape only. -->
            <g
                paint-order="stroke"
                stroke="white"
                stroke-width="3"
                stroke-linejoin="round"
            >
                {#each extendedStock as d}
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
                 hovered headline. Right-angled elbow with a straight bias
                 when the box's x is near the headline's date. -->
            <g style="opacity: {newsVisible ? 1 : 0};">
                {#each decoratedHeadlines as h}
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

        {#each milestones as m}
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

        {#if ready}
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

        <!-- Legislation cards: appear after a brief pause once the animation
             ends, arranged in a flex row spanning the container edges. The
             outer container carries scroll-driven policiesOpacity. -->
        <div
            class="absolute pointer-events-none select-none flex"
            style="left: {CARD_INSET}px; right: {CARD_INSET}px; top: {axisY +
                BOX_OFFSET}px; height: {BOX_HEIGHT}px; gap: {CARD_GAP}px; opacity: {policiesOpacity};"
        >
            {#each decoratedLegislations as law, i}
                <div
                    class="flex-1 min-w-0 border border-gray-300 bg-white"
                    style="opacity: {cardsVisible
                        ? 1
                        : 0}; transition: opacity {CARDS_DUR_MS}ms ease-out {cardsVisible
                        ? i * CARDS_STAGGER_MS
                        : 0}ms;"
                >
                    <div class="flex h-full flex-col overflow-hidden p-2">
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

        <!-- News headline screenshots: hover scales the box and reveals a
             connector line to the headline's date on the data line. The
             leftmost / rightmost columns anchor scaling at their inner
             edge so the zoomed-up box never goes off the chart. -->
        {#each decoratedHeadlines as h, i}
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

        <div class="absolute top-2 right-2 flex items-center gap-1.5">
            <button
                type="button"
                onclick={() => (playing ? pause() : play())}
                aria-label={playing ? "Pause" : "Play"}
                class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
            >
                {#if playing}
                    <PauseIcon class="h-4 w-4" />
                {:else}
                    <PlayIcon class="h-4 w-4" />
                {/if}
            </button>
            <button
                type="button"
                onclick={skipToEnd}
                aria-label="Skip to end"
                class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
            >
                <FastForwardIcon class="h-4 w-4" />
            </button>
        </div>
    {/if}
</div>
