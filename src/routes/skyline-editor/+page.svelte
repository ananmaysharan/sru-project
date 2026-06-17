<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { asset } from "$app/paths";
    import {
        socialHousingStock,
        type SocialHousingStockYear,
    } from "$lib/data/charts/social-housing-stock";

    // Natural width/height ratio for each source file (0..16).
    const ASPECT: Record<number, number> = {
        0: 527 / 960, 1: 519 / 388, 2: 281 / 407, 3: 876 / 585, 4: 716 / 553,
        5: 521 / 359, 6: 446 / 323, 7: 665 / 428, 8: 382 / 295, 9: 637 / 462,
        10: 1037 / 752, 11: 528 / 408, 12: 592 / 382, 13: 694 / 574,
        14: 803 / 960, 15: 693 / 377, 16: 693 / 1000,
    };

    // Current best-guess left → right order (file indices).
    const INITIAL_ORDER = [9, 1, 2, 5, 14, 15, 4, 16, 6, 3, 7, 8, 11, 12, 10, 0, 13];

    type Building = {
        id: number; file: number; aspect: number;
        x: number; y: number; w: number; h: number; z: number;
    };

    let buildings = $state<Building[]>([]);
    let selected = $state<number | null>(null);
    let seeded = false;

    let mode: "drag" | "resize" | null = null;
    let startMX = 0, startMY = 0;
    let startB = { x: 0, y: 0, w: 0, h: 0 };

    let containerEl: HTMLDivElement;
    let width = $state(0);
    let height = $state(0);

    // --- Geometry matched to the production hero chart ---------------------
    const margin = { top: 40, right: 100, left: 100 };
    const AXIS_GAP = 56;
    const marginBottom = 188; // production's below-axis band (cards / news)

    const extended: SocialHousingStockYear[] = [
        ...socialHousingStock,
        { year: 2025, units: socialHousingStock[socialHousingStock.length - 1].units },
    ];

    const xScale = $derived(
        d3.scaleLinear().domain([2000, 2025]).range([margin.left, Math.max(margin.left, width - margin.right)]),
    );
    const yScale = $derived(
        d3.scaleLinear().domain([3_950_000, 5_400_000]).range([Math.max(margin.top, height - marginBottom - AXIS_GAP), margin.top]),
    );

    function unitsAt(frac: number): number {
        const idx = Math.floor(frac);
        const a = socialHousingStock.find((d) => d.year === idx) ?? socialHousingStock[socialHousingStock.length - 1];
        const b = socialHousingStock.find((d) => d.year === idx + 1) ?? a;
        const t = frac - idx;
        return a && b ? a.units + (b.units - a.units) * t : (a?.units ?? 0);
    }
    function lineYAtX(px: number): number {
        return yScale(unitsAt(xScale.invert(px)));
    }

    const linePath = $derived(
        width === 0 ? "" : (d3.line<SocialHousingStockYear>().x((d) => xScale(d.year)).y((d) => yScale(d.units)).curve(d3.curveLinear)(extended) ?? ""),
    );

    function seed() {
        if (seeded || width === 0 || height === 0) return;
        const leftX = xScale(2000), rightX = xScale(2025);
        const span = rightX - leftX;
        const slot = span / INITIAL_ORDER.length;
        // Start small so buildings are individually grabbable.
        const h0 = 78;
        buildings = INITIAL_ORDER.map((file, i) => {
            const aspect = ASPECT[file];
            const h = h0;
            const w = h * aspect;
            const cx = leftX + (i + 0.5) * slot;
            const baseY = lineYAtX(cx);
            return { id: i, file, aspect, x: cx - w / 2, y: baseY - h, w, h, z: i };
        });
        seeded = true;
    }
    $effect(() => { if (!seeded) seed(); });

    function onPointerDown(e: PointerEvent, b: Building, kind: "drag" | "resize") {
        e.stopPropagation();
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        selected = b.id; mode = kind;
        startMX = e.clientX; startMY = e.clientY;
        startB = { x: b.x, y: b.y, w: b.w, h: b.h };
    }
    function onPointerMove(e: PointerEvent) {
        if (!mode || selected === null) return;
        const b = buildings.find((x) => x.id === selected);
        if (!b) return;
        const dx = e.clientX - startMX, dy = e.clientY - startMY;
        if (mode === "drag") { b.x = startB.x + dx; b.y = startB.y + dy; }
        else { const nw = Math.max(16, startB.w + dx); b.w = nw; b.h = nw / b.aspect; }
    }
    function onPointerUp() { mode = null; }

    function selectFile(file: number) {
        const b = buildings.find((x) => x.file === file);
        if (!b) return;
        selected = b.id;
        b.z = Math.max(...buildings.map((x) => x.z)) + 1; // surface it so it's grabbable
    }
    function bringForward() { const b = buildings.find((x) => x.id === selected); if (b) b.z = Math.max(...buildings.map((x) => x.z)) + 1; }
    function sendBackward() { const b = buildings.find((x) => x.id === selected); if (b) b.z = Math.min(...buildings.map((x) => x.z)) - 1; }
    function snapToLine() { const b = buildings.find((x) => x.id === selected); if (b) b.y = lineYAtX(b.x + b.w / 2) - b.h; }

    let coordsOut = $state("");
    let copied = $state(false);
    function copyCoords() {
        const leftX = xScale(2000), rightX = xScale(2025);
        const span = rightX - leftX;
        const r = (n: number) => Math.round(n * 1e4) / 1e4;
        const rows = buildings.slice().sort((a, b) => a.x + a.w / 2 - (b.x + b.w / 2)).map((b) => {
            const cx = b.x + b.w / 2, baseY = b.y + b.h;
            return { file: b.file, x: r((cx - leftX) / span), w: r(b.w / span), lift: r((lineYAtX(cx) - baseY) / span), z: b.z };
        });
        coordsOut = JSON.stringify(rows, null, 2);
        navigator.clipboard?.writeText(coordsOut).then(() => { copied = true; setTimeout(() => (copied = false), 1500); });
    }

    onMount(() => {
        const ro = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            width = rect.width; height = rect.height;
        });
        ro.observe(containerEl);
        return () => ro.disconnect();
    });

    const fmt = (v: number) => `${(v / 1_000_000).toFixed(2)}M`;
    const milestoneYears = [2000, 2005, 2010, 2015, 2020];
    const selectedFile = $derived(buildings.find((b) => b.id === selected)?.file ?? null);
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<div class="flex flex-col h-screen w-full bg-white">
    <!-- Toolbar -->
    <div class="flex items-center gap-3 border-b border-gray-200 px-4 py-2 text-sm">
        <span class="font-semibold">Skyline editor</span>
        <span class="text-gray-500">Pick a building below or click it · drag to move · drag ◢ to resize</span>
        <div class="ml-auto flex items-center gap-2">
            <button class="border border-gray-300 px-2 py-1 hover:bg-gray-50 disabled:opacity-40" disabled={selected === null} onclick={sendBackward}>Send back</button>
            <button class="border border-gray-300 px-2 py-1 hover:bg-gray-50 disabled:opacity-40" disabled={selected === null} onclick={bringForward}>Bring forward</button>
            <button class="border border-gray-300 px-2 py-1 hover:bg-gray-50 disabled:opacity-40" disabled={selected === null} onclick={snapToLine}>Snap to line</button>
            <button class="border border-gray-900 bg-gray-900 px-3 py-1 text-white hover:bg-gray-700" onclick={copyCoords}>{copied ? "Copied!" : "Copy coordinates"}</button>
        </div>
    </div>

    <!-- Canvas -->
    <div bind:this={containerEl} role="presentation" class="relative flex-1 min-h-0 overflow-hidden" onpointerdown={() => (selected = null)}>
        {#if width > 0 && height > 0}
            {#each buildings as b (b.id)}
                <div
                    role="presentation"
                    class="absolute select-none {selected === b.id ? 'outline outline-2 outline-blue-500' : 'hover:outline hover:outline-1 hover:outline-blue-300'}"
                    style="left:{b.x}px; top:{b.y}px; width:{b.w}px; height:{b.h}px; z-index:{b.z};"
                    onpointerdown={(e) => onPointerDown(e, b, "drag")}
                >
                    <img src={asset(`/images/timeline/${b.file}.webp`)} alt="building {b.file}" draggable="false" class="block h-full w-full object-fill pointer-events-none" />
                    {#if selected === b.id}
                        <div class="absolute -top-5 left-0 bg-blue-500 px-1 text-[10px] text-white">#{b.file}</div>
                        <div role="presentation" class="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-nwse-resize bg-blue-500" onpointerdown={(e) => onPointerDown(e, b, "resize")}></div>
                    {/if}
                </div>
            {/each}

            <!-- Line only (no fill), drawn on top so it stays visible -->
            <svg {width} {height} class="absolute inset-0 pointer-events-none" style="z-index:500;">
                <path d={linePath} fill="none" stroke="#06738b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
                {#each milestoneYears as y}
                    <circle cx={xScale(y)} cy={yScale(unitsAt(y))} r="3.5" fill="#06738b" />
                    <text x={xScale(y)} y={yScale(unitsAt(y)) + 16} text-anchor="middle" font-size="11" font-weight="600" fill="#06738b">{fmt(unitsAt(y))}</text>
                {/each}
                {#each extended as d (d.year)}
                    <text x={xScale(d.year)} y={height - marginBottom + 18} text-anchor="middle" font-size="9" fill="#9ca3af">{d.year}</text>
                {/each}
                <circle cx={xScale(2000)} cy={yScale(unitsAt(2000))} r="4" fill="none" stroke="#ef4444" stroke-width="1.5" />
                <circle cx={xScale(2025)} cy={yScale(unitsAt(2025))} r="4" fill="none" stroke="#ef4444" stroke-width="1.5" />
            </svg>
        {/if}
    </div>

    <!-- Selector panel: one thumbnail per source file; click to grab it -->
    <div class="flex items-end gap-1 overflow-x-auto border-t border-gray-200 bg-gray-50 px-3 py-2">
        {#each Object.keys(ASPECT).map(Number) as file (file)}
            <button
                class="relative shrink-0 border bg-white p-0.5 {selectedFile === file ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-500'}"
                onclick={() => selectFile(file)}
                title="Select building {file}"
            >
                <img src={asset(`/images/timeline/${file}.webp`)} alt="file {file}" class="h-12 w-auto object-contain" />
                <span class="absolute bottom-0 left-0 bg-black/60 px-1 text-[9px] text-white">{file}</span>
            </button>
        {/each}
    </div>

    {#if coordsOut}
        <div class="border-t border-gray-200 p-3">
            <p class="mb-1 text-xs text-gray-500">Coordinates (normalized to the line ends) — copied to clipboard. Paste these back to me:</p>
            <textarea readonly class="h-32 w-full resize-none border border-gray-300 p-2 font-mono text-xs" value={coordsOut}></textarea>
        </div>
    {/if}
</div>
