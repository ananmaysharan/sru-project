// Scroll-driven choreography for the intro "social housing stock" story.
//
// The story section pins the chart while the page scrolls past it. That scroll
// is normalized to a single `progress` value in [0, 1] (measured in
// +page.svelte) and each visual beat below claims a sub-range of it. Call
// `phaseProgress(progress, STORY_PHASES.<name>)` to get a local 0 → 1 value for
// a beat regardless of where its boundaries sit.
//
// Beats run in order and leave small gaps between them, so each stage settles
// before the next begins. Tune the pacing by editing the ranges here — both
// the chart and the page caption read from this single source of truth.

export type StoryPhase = readonly [start: number, end: number];

export const STORY_PHASES = {
	/** The data line draws itself left → right (2000 → 2024). */
	line: [0.0, 0.32],
	/** Legislation cards + connectors fade in beneath the line. */
	policies: [0.36, 0.54],
	/** X-axis zooms to 2015–2025 and the caption crossfades to "In the news". */
	zoom: [0.58, 0.84],
	/** News headline screenshots reveal in their grid. */
	news: [0.88, 1.0]
} as const satisfies Record<string, StoryPhase>;

/** Map global scroll `progress` to a 0 → 1 value local to a single phase. */
export function phaseProgress(progress: number, [start, end]: StoryPhase): number {
	if (end <= start) return progress >= end ? 1 : 0;
	return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}
