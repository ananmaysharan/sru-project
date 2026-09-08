<script lang="ts">
    import { onMount } from "svelte";
    import { asset } from "$app/paths";
    import SocialHousingStockChart from "$lib/components/charts/SocialHousingStockChart.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import Acknowledgements from "$lib/components/sections/Acknowledgements.svelte";
    import Logos from "$lib/components/elements/Logos.svelte";
    import { STORY_PHASES, phaseProgress } from "$lib/data/charts/scroll-story";
    import { language } from "$lib/i18n";
    import type {PageData} from './$types';

    let {data}: {data: PageData} = $props();
    const text = $derived(data.content.text[$language]);

    let storyEl = $state<HTMLElement>();
    let navHeight = $state(56);
    let scrollY = $state(0);
    let innerHeight = $state(0);
    let compactStory = $state(false);

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
    const chartProgress = $derived(compactStory ? STORY_PHASES.policies[1] : progress);

    function heroHtml(value: string) {
        return value.replaceAll(
            'rel="noreferrer">',
            'rel="noreferrer" class="underline underline-offset-2 hover:text-white">',
        );
    }

    function measureNav() {
        const nav = document.querySelector(
            'nav[aria-label="Table of contents"]',
        ) as HTMLElement | null;
        navHeight = nav?.offsetHeight ?? 56;
    }

    onMount(() => {
        measureNav();
        const query = window.matchMedia('(max-width: 767.98px)');
        const update = () => (compactStory = query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    });
</script>

<svelte:window bind:scrollY bind:innerHeight onresize={measureNav} />

<svelte:head>
    <link
        rel="preload"
        as="image"
        href={asset('/intro-hero-mobile.webp')}
        type="image/webp"
        media="(max-width: 767px)"
        fetchpriority="high"
    />
    <link
        rel="preload"
        as="image"
        href={asset('/intro-hero-desktop.webp')}
        type="image/webp"
        media="(min-width: 768px)"
        fetchpriority="high"
    />
</svelte:head>

<section class="intro-hero relative isolate w-full min-h-screen">
    <div class="intro-hero__media">
        <div class="intro-hero__media-frame">
            <picture>
                <source media="(max-width: 767px)" srcset={asset('/intro-hero-mobile.webp')} />
                <img
                    src={asset('/intro-hero-desktop.webp')}
                    alt="View from a Parisian balcony"
                    width="2200"
                    height="1623"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    class="absolute inset-0 h-full w-full object-cover"
                />
            </picture>
            <div
                class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70"
            ></div>
        </div>
    </div>

    <div
        class="relative z-10 min-h-screen max-w-5xl mx-auto px-6 flex flex-col justify-end items-center pt-24 pb-16 text-white text-center"
    >
        <h1
            class:intro-title--fr={$language === 'fr'}
            class:intro-title--en={$language === 'en'}
            class="intro-title font-medium tracking-tight"
        >
            {text.heroTitle}
        </h1>
        <p class="mt-4 text-lg md:text-xl text-white/80">{text.byline}</p>

        <div
            class="mt-6 max-w-2xl flex flex-col gap-3 text-sm md:text-base leading-relaxed text-white/90"
        >
            {#each data.content.heroIntroduction[$language].blocks as block}
                {#if block.type === 'paragraph'}
                    <p>{@html heroHtml(block.html)}</p>
                {/if}
            {/each}
        </div>
    </div>
</section>

<style>
    .intro-hero__media {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: clip;
        pointer-events: none;
    }

    .intro-hero__media-frame {
        position: sticky;
        top: 0;
        width: 100%;
        height: 100svh;
    }

    .intro-title {
        display: grid;
        width: 100%;
        min-height: clamp(6.3rem, 14vw, 12rem);
        margin-inline: auto;
        place-items: center;
        line-height: 1.05;
        text-wrap: balance;
    }

    .intro-title--fr {
        max-width: 18ch;
        font-size: clamp(2.25rem, 7vw, 6rem);
    }

    .intro-title--en {
        max-width: 30ch;
        font-size: clamp(1.75rem, 5.6vw, 4.5rem);
    }

    @media (max-width: 767.98px) {
        .story-section.story-mobile {
            height: auto !important;
            padding-block: 2.5rem 1rem;
        }

        .story-mobile .story-stage {
            position: relative;
            top: auto !important;
            height: auto !important;
            overflow: visible;
        }

        .story-mobile .story-copy-frame {
            height: auto;
            padding-top: 0;
            padding-bottom: 1.25rem;
        }

        .story-mobile .story-copy-primary {
            position: relative;
            inset: auto;
        }

        .story-mobile .story-copy-secondary {
            display: none;
        }

        .story-mobile :global([data-policy-cards]) {
            scroll-snap-type: x mandatory;
        }

        .story-mobile :global([data-policy-card]) {
            scroll-snap-align: start;
        }
    }
</style>

<section class="support-section">
    <div class="max-w-6xl mx-auto px-6 pb-4">
        <h2 class="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
            {text.supportersTitle}
        </h2>
    </div>
    <Logos />
</section>

<section
    bind:this={storyEl}
    id="story-scroll"
    class:story-mobile={compactStory}
    class="story-section relative"
    style="height: {compactStory ? 'auto' : '400vh'};"
>
    <div
        class="story-stage sticky flex flex-col overflow-y-auto"
        style="top: {navHeight}px; height: calc(100vh - {navHeight}px);"
    >
        <!-- Crossfading caption — the heading swaps from the data story to the
             news story in step with the chart's zoom beat. -->
        <div
            class="story-copy-frame relative shrink-0 max-w-3xl mx-auto px-6 pt-6 w-full"
        >
            <div
                class:story-copy-primary={true}
                class="absolute inset-x-6"
                style="opacity: {compactStory ? 1 : 1 - swapProgress};"
            >
                <h2 class="text-3xl font-bold">
                    {text.storyHousingTitle}
                </h2>
                <p class="mt-4 text-gray-700">
                    {text.storyHousingBody}
                </p>
            </div>
            <div class="story-copy-secondary absolute inset-x-6" style="opacity: {swapProgress};">
                <h2 class="text-3xl font-bold">{text.storyNewsTitle}</h2>
                <p class="mt-4 text-gray-700">
                    {text.storyNewsBody}
                </p>
            </div>
        </div>

        <!-- Fill the viewport, allowing the frame to scroll in short embeds. -->
        <div class="flex flex-col flex-1 w-full">
            <SocialHousingStockChart progress={chartProgress} />
        </div>
    </div>
</section>

<EditorialMarkdown content={data.content.introduction[$language]} section="introduction" render="content" />
<EditorialMarkdown content={data.content.dashboardGuide[$language]} section="dashboard-guide" render="content" compact />
<Acknowledgements content={data.content.acknowledgements[$language]} />
<EditorialMarkdown content={data.content.introduction[$language]} section="introduction" render="notes" compact />
