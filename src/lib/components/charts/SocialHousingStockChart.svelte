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

    // The building skyline fades out fast right after the policies beat ends,
    // so it disappears the moment the reader scrolls past it (rather than
    // lingering through the whole zoom like the policy cards).
    const skylineFade = $derived(
        phaseProgress(progress, [STORY_PHASES.policies[1], STORY_PHASES.policies[1] + 0.03]),
    );
    const skylineOpacity = $derived(1 - skylineFade);

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

    // --- Building skyline ---------------------------------------------------
    // 17 cutout images that rise from the data line during the policies beat,
    // recreating the printed "SRU at 25" infographic. Natural width/height ratio
    // per source file, numbered by visual order from left → right.
    const SKY_ASPECT: Record<number, number> = {
        0: 637 / 462, 1: 519 / 388, 2: 665 / 428, 3: 382 / 295,
        4: 803 / 960, 5: 281 / 407, 6: 876 / 585, 7: 693 / 1000,
        8: 716 / 553, 9: 693 / 377, 10: 694 / 574, 11: 592 / 382,
        12: 528 / 408, 13: 1037 / 752, 14: 521 / 359, 15: 527 / 960,
        16: 446 / 323,
    };
    // Placement hand-arranged in /skyline-editor, normalized to the line ends:
    //   x    — center position along the line span (0 = 2000 end, 1 = 2025 end)
    //   w    — width as a fraction of the line span
    //   lift — base offset from the line (0 = on the line, + = lifted above)
    // Listed back → front so SVG paint order reproduces the chosen z-order.
    const SKYLINE: { file: number; x: number; w: number; lift: number }[] = [
        { file: 1, x: 0.1104, w: 0.1219, lift: -0.0304 },
        { file: 4, x: 0.2349, w: 0.1166, lift: -0.0134 },
        { file: 9, x: 0.4857, w: 0.1227, lift: 0.0002 },
        { file: 7, x: 0.419, w: 0.1004, lift: -0.0277 },
        { file: 6, x: 0.3702, w: 0.1714, lift: -0.028 },
        { file: 5, x: 0.2903, w: 0.0833, lift: -0.019 },
        { file: 15, x: 0.8841, w: 0.103, lift: -0.039 },
        { file: 16, x: 0.9609, w: 0.1236, lift: -0.0197 },
        { file: 2, x: 0.1517, w: 0.1483, lift: -0.0186 },
        { file: 3, x: 0.2313, w: 0.0803, lift: -0.0122 },
        { file: 0, x: 0.0448, w: 0.1331, lift: -0.0127 },
        { file: 8, x: 0.4507, w: 0.1197, lift: -0.0297 },
        { file: 11, x: 0.6343, w: 0.1305, lift: -0.0061 },
        { file: 10, x: 0.5589, w: 0.1288, lift: -0.0269 },
        { file: 14, x: 0.8535, w: 0.1359, lift: -0.0301 },
        { file: 13, x: 0.8263, w: 0.2019, lift: -0.043 },
        { file: 12, x: 0.7265, w: 0.1558, lift: -0.0503 },
    ];
    const SKY_HOVER_SCALE = 1.09;

    // Project name + caption per source file, numbered left → right.
    const BUILDING_INFO: Record<number, { name: string; detail: string }> = {
        0: { name: "Tower Flower", detail: "30 social units · €4m · 2004 · Paris (17)" },
        1: { name: "149 Rue des Suisses", detail: "social housing · 2000 · Paris (14)" },
        2: { name: "Urban Collage", detail: "114 social units · €14.3m · 2012 · Champigny-sur-Marne" },
        3: { name: "6 Social Housing Units", detail: "6 social units · €552k · 2019 · Rennes (Brittany)" },
        4: { name: "Bois-le-Prêtre", detail: "96 social units · €11.25m · 2011 · Paris (17)" },
        5: { name: "55 – Blache", detail: "6 social units · €940k · 2023 · Paris (10)" },
        6: { name: "Les Artistes de Batignolles", detail: "46 social + 86 private · 2015 · Paris (17)" },
        7: { name: "Home", detail: "92 social + 96 market · 2015 · Paris (13)" },
        8: { name: "Arty Social Housing", detail: "40 social units · 2021 · Cesson-Sévigné (Brittany)" },
        9: { name: "Rue Jean Bart", detail: "8 units · €1.9m · 2021 · Paris (6)" },
        10: { name: "The Porous Block", detail: "76 social units · 2024 · Bagneux" },
        11: { name: "Les Jasmins", detail: "38 social units · €4m · 2018 · La Réunion (DROM)" },
        12: { name: "ES3 Collective Housing", detail: "48 social units · 2025 · Rennes (Brittany)" },
        13: { name: "Olympic Village", detail: "83 social units · 2024 · Saint-Ouen-sur-Seine" },
        14: { name: "8 Logements", detail: "8 social units · €1.1m · 2021 · Gignac-la-Nerthe (French Riviera)" },
        15: { name: "START Ivry", detail: "98 social + 190 market · €43.3m · 2025 · Ivry-sur-Seine" },
        16: { name: "Rue Fraizier", detail: "44 social units · 2025 · Saint-Denis" },
    };

    let hoveredFile = $state<number | null>(null);
    let skyTipX = $state(0);
    let skyTipY = $state(0);
    function moveSkyTip(e: MouseEvent) {
        const r = containerEl.getBoundingClientRect();
        skyTipX = e.clientX - r.left;
        skyTipY = e.clientY - r.top;
    }
    function enterSkyline(file: number, e: MouseEvent) {
        hoveredFile = file;
        moveSkyTip(e);
    }

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
    const AXIS_GAP = 40;

    // Y-domain floor sits right at the data minimum (2000 ≈ 4.00M) with the
    // ceiling held at 5.40M, so the climb and the 2014 / 2021 dips read as
    // steep peaks and troughs. The ceiling is deliberately NOT lowered to the
    // data max: that would raise the 2024 peak and eat into the headroom the
    // façade cutouts rise into. Extra drama instead comes from the smaller
    // AXIS_GAP, which stretches the line downward (peak fixed → buildings stay
    // anchored to the line and keep their top clearance).
    const yScale = $derived(
        d3
            .scaleLinear()
            .domain([4_000_000, 5_400_000])
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

    // Y of the data line at an arbitrary x pixel (line is piecewise-linear).
    function lineYAtX(px: number): number {
        return yScale(unitsAt(xScale.invert(px)));
    }

    // Clip polygon = everything ABOVE the line (only the BELOW-line area is
    // masked, so imperfect bottom crops never show). The ceiling sits far above
    // the chart (-4000) so tall buildings are never cut at the top.
    const skylineClip = $derived.by(() => {
        if (width === 0) return "";
        const leftEdge = xScale(extendedStock[0].year);
        const rightEdge = xScale(extendedStock[extendedStock.length - 1].year);
        const linePts = extendedStock
            .slice()
            .reverse()
            .map((d) => `${xScale(d.year)},${yScale(d.units)}`)
            .join(" ");
        return `${leftEdge},-4000 ${rightEdge},-4000 ${linePts}`;
    });
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
                <clipPath id="shs-skyline">
                    <polygon points={skylineClip} />
                </clipPath>
            </defs>

            <!-- Building skyline: cutouts rising from the data line during the
                 policies beat. Clipped to the area above the line; fades with
                 the policy cards (policiesOpacity) and zooms away on zoom. -->
            {#if skylineOpacity > 0.001}
                {@const leftEdge = xScale(extendedStock[0].year)}
                {@const rightEdge = xScale(
                    extendedStock[extendedStock.length - 1].year,
                )}
                {@const span = rightEdge - leftEdge}
                <g
                    clip-path="url(#shs-skyline)"
                    style="opacity: {skylineOpacity}; pointer-events: {cardsVisible &&
                    skylineFade < 0.99
                        ? 'auto'
                        : 'none'};"
                >
                    {#each SKYLINE as b, i (b.file)}
                        {@const cx = leftEdge + b.x * span}
                        {@const w = b.w * span}
                        {@const h = w / SKY_ASPECT[b.file]}
                        {@const skyScale =
                            hoveredFile === b.file ? SKY_HOVER_SCALE : 1}
                        {@const baseY = lineYAtX(cx) - b.lift * span}
                        <image
                            href={asset(`/images/timeline/${b.file}.webp`)}
                            x={cx - w / 2}
                            y={baseY - h}
                            width={w}
                            height={h}
                            preserveAspectRatio="none"
                            role="img"
                            aria-label={BUILDING_INFO[b.file]?.name}
                            onmouseenter={(e) => enterSkyline(b.file, e)}
                            onmousemove={moveSkyTip}
                            onmouseleave={() => (hoveredFile = null)}
                            style="cursor: pointer; opacity: {cardsVisible
                                ? 1
                                : 0}; transition: opacity {CARDS_DUR_MS}ms ease-out {cardsVisible
                                ? i * 40
                                : 0}ms, transform 180ms ease-out; transform-box: fill-box; transform-origin: center bottom; transform: scale({skyScale});"
                        />
                    {/each}
                </g>
            {/if}

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

        <!-- Building hover tooltip: name + caption, follows the cursor. -->
        {#if hoveredFile !== null && BUILDING_INFO[hoveredFile]}
            <div
                class="absolute z-30 pointer-events-none select-none -translate-x-1/2 -translate-y-full whitespace-nowrap border border-gray-300 bg-white px-2.5 py-1.5"
                style="left: {skyTipX}px; top: {skyTipY - 14}px;"
            >
                <div class="text-xs font-semibold leading-tight text-gray-900">
                    {BUILDING_INFO[hoveredFile].name}
                </div>
                <div class="text-[10px] leading-tight text-gray-600">
                    {BUILDING_INFO[hoveredFile].detail}
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
