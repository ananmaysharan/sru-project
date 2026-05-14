<script lang="ts">
    import { onMount } from "svelte";
    import { asset } from "$app/paths";
    import HeroChart from "$lib/components/charts/HeroChart.svelte";
    import SocialHousingStockChart from "$lib/components/charts/SocialHousingStockChart.svelte";
    import Logos from "$lib/components/elements/Logos.svelte";

    let storyEl: HTMLElement;
    let scrollProgress = $state(0);
    let autoStart = $state(false);
    let chartReady = $state(false);
    let navHeight = $state(56);
    let scrollLocked = false;

    function lockScroll() {
        if (scrollLocked) return;
        scrollLocked = true;
        document.body.style.overflow = "hidden";
    }

    function unlockScroll() {
        if (!scrollLocked) return;
        scrollLocked = false;
        document.body.style.overflow = "";
    }

    function handleChartComplete() {
        chartReady = true;
        unlockScroll();
    }

    onMount(() => {
        const measureNav = () => {
            const nav = document.querySelector(
                'nav[aria-label="Table of contents"]',
            ) as HTMLElement | null;
            navHeight = nav?.offsetHeight ?? 56;
        };
        measureNav();

        // Track scroll progress through the sticky story section. The h2
        // anchor sits at the top of the sticky frame, which itself is pinned
        // at top: navHeight, so scrollProgress = 0 the moment the section's
        // top reaches the nav bar's bottom edge.
        const handler = () => {
            if (!storyEl) return;
            const sectionRect = storyEl.getBoundingClientRect();
            if (sectionRect.top <= navHeight && !autoStart) {
                autoStart = true;
                if (!chartReady) lockScroll();
            }
            const total = Math.max(
                1,
                navHeight +
                    storyEl.offsetHeight -
                    window.innerHeight,
            );
            const scrolled = navHeight - sectionRect.top;
            scrollProgress = Math.max(0, Math.min(1, scrolled / total));
        };
        window.addEventListener("scroll", handler, { passive: true });
        window.addEventListener("resize", () => {
            measureNav();
            handler();
        });
        handler();
        return () => {
            window.removeEventListener("scroll", handler);
            unlockScroll();
        };
    });

    // Scroll phases within the sticky scroll container:
    //   0.00–0.45  policies wipe out (opacity 1 → 0)
    //   0.55–0.85  paragraph crossfade + chart zoom to 2015–2024
    //   ≥0.95      news headline thumbnails animate in
    const policiesOpacity = $derived(
        Math.max(0, Math.min(1, 1 - scrollProgress / 0.45)),
    );
    const swapProgress = $derived(
        Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.3)),
    );
    const newsVisible = $derived(swapProgress >= 0.95);
</script>

<section class="relative w-full h-screen">
    <img
        src={asset("/intro-hero.webp")}
        alt="View from a Parisian balcony"
        class="absolute inset-0 w-full h-full object-cover"
    />
    <div
        class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"
    ></div>

    <div
        class="relative h-full max-w-5xl mx-auto px-6 flex flex-col justify-end items-center pb-16 text-white text-center"
    >
        <h1
            class="text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight"
        >
            The Loi SRU, 25 years later
        </h1>
        <p class="mt-4 text-lg md:text-xl text-white/80">Magda Maaoui</p>

        <div
            class="mt-8 max-w-2xl flex flex-col gap-4 text-base md:text-lg leading-relaxed text-white/90"
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
        </div>
    </div>
</section>

<section class="py-12">
    <div class="max-w-6xl mx-auto px-6 pb-4">
        <h3 class="text-sm font-medium text-gray-500">Supported By:</h3>
    </div>
    <Logos />
</section>

<section
    bind:this={storyEl}
    id="story-scroll"
    class="relative"
    style="height: 250vh;"
>
    <div
        class="sticky overflow-hidden flex flex-col"
        style="top: {navHeight}px; height: calc(100vh - {navHeight}px);"
    >
        <!-- Crossfading paragraph block — the h2 acts as the scroll anchor -->
        <div
            class="relative max-w-3xl mx-auto px-6 pt-6 w-full"
            style="height: 240px;"
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
            <SocialHousingStockChart
                {policiesOpacity}
                zoomProgress={swapProgress}
                {autoStart}
                {newsVisible}
                oncomplete={handleChartComplete}
            />
        </div>
    </div>
</section>
