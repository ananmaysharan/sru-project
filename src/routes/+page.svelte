<script lang="ts">
    import { onMount } from "svelte";
    import { asset } from "$app/paths";
    import SocialHousingStockChart from "$lib/components/charts/SocialHousingStockChart.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import Acknowledgements from "$lib/components/sections/Acknowledgements.svelte";
    import Logos from "$lib/components/elements/Logos.svelte";
    import { STORY_PHASES, phaseProgress } from "$lib/data/charts/scroll-story";
    import editorialContent from "$lib/data/editorial-content.md?raw";

    let storyEl = $state<HTMLElement>();
    let navHeight = $state(56);
    let scrollY = $state(0);
    let innerHeight = $state(0);

    // Normalized scroll progress (0 → 1) through the pinned story section. The
    // sticky frame is pinned at top: navHeight, so progress is 0 the moment the
    // section's top reaches the nav's bottom edge and 1 once it has fully
    // scrolled through. Both the chart and the caption below read from this.
    const progress = $derived.by(() => {
        // Touch scroll + viewport so this recomputes as the user scrolls.
        scrollY;
        innerHeight;
        if (!storyEl) return 0;
        const top = storyEl.getBoundingClientRect().top;
        const total = Math.max(
            1,
            navHeight + storyEl.offsetHeight - innerHeight,
        );
        return Math.max(0, Math.min(1, (navHeight - top) / total));
    });

    // The caption crossfades in step with the chart's zoom beat.
    const swapProgress = $derived(phaseProgress(progress, STORY_PHASES.zoom));

    function measureNav() {
        const nav = document.querySelector(
            'nav[aria-label="Table of contents"]',
        ) as HTMLElement | null;
        navHeight = nav?.offsetHeight ?? 56;
    }

    onMount(measureNav);
</script>

<svelte:window bind:scrollY bind:innerHeight onresize={measureNav} />

<section class="relative w-full min-h-screen">
    <img
        src={asset("/intro-hero.webp")}
        alt="View from a Parisian balcony"
        width="5244"
        height="3870"
        fetchpriority="high"
        class="absolute inset-0 w-full h-full object-cover"
    />
    <div
        class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"
    ></div>

    <div
        class="relative min-h-screen max-w-5xl mx-auto px-6 flex flex-col justify-end items-center pt-24 pb-16 text-white text-center"
    >
        <h1
            class="text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight"
        >
            The Loi SRU, 25 years later
        </h1>
        <p class="mt-4 text-lg md:text-xl text-white/80">Magda Maaoui</p>

        <div
            class="mt-6 max-w-2xl flex flex-col gap-3 text-sm md:text-base leading-relaxed text-white/90"
        >
            <p>
                Twenty-five years ago, in December 2000, the SRU Law (Loi
                Solidarité et Renouvellement Urbain) was passed in France,
                requiring selected municipalities to devote 25% of their local
                stock to social housing, in order to curb growing trends of
                segregation.
            </p>

            <p>
                In this project, I ask what impact this law has had on the
                rebalancing of social housing stocks for municipalities across
                the country, particularly those not complying with set quotas.
                Building on previous research, this paper is part exclusionary
                politics analysis, part supply analysis, and part neighborhood
                outcomes analysis, particularly when it comes to health
                outcomes.
            </p>

            <p>
                I use GIS and regression models to underscore how much of the
                mission set twenty-five years ago, of "moving people to
                opportunity", and unlocking resources to offer them a better
                quality of life, has been achieved. I hypothesize that the
                reality is that we are faced with a patchwork of outcomes
                depending strongly on local land use regimes and political
                willingness to comply with a state-mandated law.
            </p>

            <p>
                I also hypothesize that while a lot of rebalancing still needs
                to happen, particularly in the most exclusionary municipalities,
                the mission of rebalancing social housing stocks, and hence
                unlocking access to better amenities and resources, has indeed
                overall been met.
            </p>

            <p>
                This project dashboard translates that empirical work into an
                exploratory tool. It lets users map where social housing stocks
                have grown, compare trajectories across communes, and link SRU
                implementation to income, poverty, age structure, politics,
                energy performance, and exposure to heat. By making these
                patterns visible at a glance, the aim is not only to assess
                whether legal targets were numerically met, but also to question
                how and where rebalancing has occurred, and with what
                implications for health and environmental justice.
            </p>

            <p>
                At the same time, I deliberately focus on the “moving to
                opportunity” side of the story—how the SRU law has opened up
                higher‑opportunity geographies to social housing residents over
                the past twenty‑five years. I do so without minimizing the
                crucial research and policy work that continues to document
                lower‑income neighborhoods where social housing remains highly
                concentrated. For more detailed analyses of these territories and
                their persistent inequalities, readers can turn to national data
                portals and dashboards such as
                <a
                    href="https://sig.ville.gouv.fr/"
                    target="_blank"
                    rel="noreferrer"
                    class="underline underline-offset-2 hover:text-white"
                    >SIG Ville</a
                >, the
                <a
                    href="https://www.onpv.fr/donnees"
                    target="_blank"
                    rel="noreferrer"
                    class="underline underline-offset-2 hover:text-white"
                    >Observatoire national de la politique de la ville (ONPV)</a
                >, and
                <a
                    href="https://www.insee.fr/fr/statistiques/2500477"
                    target="_blank"
                    rel="noreferrer"
                    class="underline underline-offset-2 hover:text-white"
                    >INSEE’s datasets on quartiers prioritaires</a
                >.
            </p>
        </div>
    </div>
</section>

<section class="support-section">
    <div class="max-w-6xl mx-auto px-6 pb-4">
        <h2 class="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">Supported by</h2>
    </div>
    <Logos />
</section>

<section
    bind:this={storyEl}
    id="story-scroll"
    class="relative"
    style="height: 400vh;"
>
    <div
        class="sticky flex flex-col"
        style="top: {navHeight}px; height: calc(100vh - {navHeight}px);"
    >
        <!-- Crossfading caption — the heading swaps from the data story to the
             news story in step with the chart's zoom beat. -->
        <div
            class="story-copy-frame relative max-w-3xl mx-auto px-6 pt-6 w-full"
        >
            <div
                class="absolute inset-x-6"
                style="opacity: {1 - swapProgress};"
            >
                <h2 class="text-3xl font-bold">
                    25 years of fair-share housing provision
                </h2>
                <p class="mt-4 text-gray-700">
                    France's social housing has grown steadily between 2000-2025
                    with delivery of new units reaching a historic peak of over
                    80,000 per year for the first time since the 1970s. Projects
                    built across France's regions have proven to be diverse in
                    design, size, and location.
                </p>
            </div>
            <div class="absolute inset-x-6" style="opacity: {swapProgress};">
                <h2 class="text-3xl font-bold">In the news</h2>
                <p class="mt-4 text-gray-700">
                    Together, these media headlines trace how, over the years,
                    the SRU law has been formally upheld as an instrument
                    against territorial and social apartheid, even as local and
                    national actors repeatedly seek to weaken or bypass its
                    social-housing obligations, through budget cuts, legal
                    challenges, strategic avoidance by mayors, and mobilized
                    resident opposition to new social housing construction,
                    particularly in wealthier communities.
                </p>
            </div>
        </div>

        <!-- Chart fills the remaining viewport -->
        <div class="flex-1 w-full min-h-0">
            <SocialHousingStockChart {progress} />
        </div>
    </div>
</section>

<EditorialMarkdown source={editorialContent} section="introduction" render="content" />
<EditorialMarkdown source={editorialContent} section="dashboard-guide" render="content" compact />
<Acknowledgements />
<EditorialMarkdown source={editorialContent} section="introduction" render="notes" compact />
