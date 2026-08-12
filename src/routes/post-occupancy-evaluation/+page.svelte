<script lang="ts">
    import { asset } from "$app/paths";
    import AutoCarousel from "$lib/components/gallery/AutoCarousel.svelte";

    // Keep the previous carousel presentation available while the new
    // scrollytelling direction is being evaluated.
    const useLegacyCarousel = false;

    let activeRegion = $state("Paris");
    let activeLabel = $state("Samaritaine");
    let activeDark = $state(true);
    let panelEls = $state<HTMLElement[]>([]);

    let activeFrame = $state(0);
    let storyCardEls = $state<HTMLElement[]>([]);
    let storyCardsEl = $state<HTMLDivElement | null>(null);
    let projectButtonEls = $state<HTMLButtonElement[]>([]);
    let projectTabsEl = $state<HTMLDivElement | null>(null);
    let indicatorLeft = $state(4);
    let indicatorWidth = $state(0);
    let scrollFrame = 0;

    function slug(s: string) {
        return s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    const landscapeImageIds = new Set([
        "000016390005",
        "000016390009",
        "000016390013",
        "000064690014",
        "000064700002",
        "000064700003",
        "000086750006",
        "000086750011",
        "000086760009",
        "DSC02107",
        "a6a4358f-d0c0-48d5-9c19-bb3ff977df70",
        "DSC01780",
        "DSC01794",
        "DSC01798",
        "7685ce4e-bef7-419c-8d9e-68536a49e292",
        "cd3ed7fa-1ded-4c80-b2a8-21da3751b6d1",
        "laguiole-280",
        "laguiole-291",
        "laguiole-297",
    ]);

    const parisProjects = [
        {
            label: "Samaritaine",
            images: [
                "000016390005",
                "000016390007-2",
                "000016390009",
                "000016390013",
                "000064690007",
                "000064690014",
                "000064700002",
                "000064700003",
                "000086750006",
                "000086750011",
                "000086760003",
                "000086760007",
                "000086760009",
                "7918512c-eab2-42ea-8d28-5f22f76dc604",
                "DSC02107",
                "a6a4358f-d0c0-48d5-9c19-bb3ff977df70",
            ].map((id, i) => ({
                src: `/images/optimized/project-1/${id}-full.webp`,
                alt: "Samaritaine",
                landscape: landscapeImageIds.has(id),
                caption: [
                    "The Samaritaine block on Place de l’École, where the redevelopment combines luxury retail with new social housing in the historic heart of Paris.",
                    "Behind the Samaritaine façade, a back‑of‑house workspace reveals the everyday, unseen life that coexists with the project’s polished public image.",
                    "A discreet, glowing entrance on a side street leads residents into the Samaritaine’s social housing, tucked behind the department store façade.",
                    "Behind Samaritaine’s restored Art Nouveau façade, new social housing apartments light up the former department store’s display windows.",
                    "A Samaritaine social housing resident waits at the bus stop outside her building, her daily commute shortened by now living just a few stops from her workplace in central Paris.",
                    "As she walks out her Samaritaine apartment, a resident checks her route on a transit app, illustrating how central social housing can radically shrink daily commute times.",
                    "Above the historic Samaritaine sign on Rue Baillet, everyday objects in the windows hint at the social housing now inhabiting this former department store.",
                    "A resident enters the Samaritaine’s discreet social housing entrance, framed by restored Art Nouveau details in the heart of Paris.",
                    "A resident’s art‑history notebook from classes at the École du Louvre, which she was able to attend because the Samaritaine is next door to this world‑class museum.",
                    "Portrait of a Samaritaine resident on the steps of the Louvre, where she was able to take art‑history classes just a few minutes’ walk from home.",
                    "A dog hurries toward the Samaritaine’s residential doorway, underscoring how this former department store now hosts ordinary domestic life.",
                    "Number 20 now opens onto a bright lobby for Samaritaine’s residents, seamlessly woven into the restored historic façade.",
                    "Former “MÉNAGE,” “OUTILS,” and “CHAUFFAGE” display bands now frame the windows of social housing apartments, where residents’ plants and objects replace merchandise.",
                    "A resident swipes her badge at the Samaritaine intercom, a small everyday gesture that now anchors social housing in one of Paris’s most exclusive blocks.",
                    "Inside a Samaritaine social housing apartment, a resident reads among books and potted plants on the balcony, with everyday views onto world‑class, historically preserved monuments like the Tour Saint‑Jacques and the Eiffel Tower.",
                    "From the bus stop across the street, a Samaritaine resident looks toward her new building, claiming a central Paris address as home.",
                ][i],
            })),
        },
        {
            label: "Maréchal Fayolle",
            images: [
                "DSC01776",
                "DSC01779",
                "DSC01780",
                "DSC01794",
                "DSC01796",
                "DSC01797",
                "DSC01798",
                "DSC01799",
            ].map((id, i) => ({
                src: `/images/optimized/project-2/${id}-full.webp`,
                alt: "Maréchal Fayolle",
                landscape: landscapeImageIds.has(id),
                caption: [
                    "The pale, curved façade of Maréchal Fayolle’s social housing, with its tall windows and Juliet balconies, introduces a modern presence into Paris’s bourgeois 16th arrondissement—a quiet victory over the NIMBY abutters who tried to block the project.",
                    "Light and shadow slide across the curved courtyard façades, offering residents generous windows and privacy in a building many neighbors once tried to prevent.",
                    "The circular volumes of Maréchal Fayolle enclose a quiet, sunlit courtyard, giving social housing residents shared outdoor space set back from the busy boulevards.",
                    "Under the building’s raised circular volume, a sheltered bike cage and lawn offer children secure play and storage space.",
                    "A teenager strolls under the pilotis of Maréchal Fayolle, where the open ground floor forms a covered passage between the bike storage, shared courtyard, and surrounding streets.",
                    "From their windows at Maréchal Fayolle, residents look straight into a tall tree canopy, a pocket of greenery carved out amid the 16th arrondissement’s dense, high‑end buildings.",
                    "At Maréchal Fayolle, three circular social housing buildings on pilotis open onto a shared garden, creating a generous interior landscape in a part of the 16th arrondissement long resistant to such collective spaces.",
                    "Designed by Kazuyo Sejima and Ryue Nishizawa of SANAA, Maréchal Fayolle’s white, undulating volume is lifted on thin, round pilotis, freeing the ground for a planted garden that materializes the right to the commons for social housing residents in an otherwise very exclusionary arrondissement of Paris.",
                ][i],
            })),
        },
        {
            label: "Rue Jean-Bart",
            images: ["paris-01", "DSC01781", "DSC01783"].map((id, i) => ({
                src: `/images/optimized/project-3/${id}-full.webp`,
                alt: "Rue Jean-Bart",
                landscape: landscapeImageIds.has(id),
                caption: [
                    "Plans and section of the Rue Jean‑Bart project show how a former narrow police station, just off the Luxembourg Garden, has been reconfigured into stacked social housing units organized around the existing stair core.",
                    "The rue Jean‑Bart façade now offers social housing residents stepped balconies and light‑filled apartments behind stonework that quietly aligns with the surrounding Haussmannian streetfront.",
                    "A carved stone niche softens the corner of the former police station, marking a new social‑housing entrance on rue Jean‑Bart.",
                ][i],
            })),
        },
        {
            label: "Tour Bois-le-Prêtre",
            images: [
                "7685ce4e-bef7-419c-8d9e-68536a49e292",
                "cd3ed7fa-1ded-4c80-b2a8-21da3751b6d1",
                "laguiole-280",
                "laguiole-291",
                "laguiole-297",
            ].map((id, i) => ({
                src: `/images/optimized/project-4/${id}-full.webp`,
                alt: "Tour Bois-le-Prêtre",
                landscape: landscapeImageIds.has(id),
                caption: [
                    "In her bright, expanded kitchen at Tour Bois‑le‑Prêtre, a resident enjoys the extra space and light created by the tower’s renovation, which wrapped formerly cramped units with new winter‑garden additions.",
                    "Behind the polycarbonate winter garden that now wraps every renovated unit, a resident’s painting studio shares the balcony with panoramic views of Paris, including the Eiffel Tower.",
                    "In the generous winter‑garden extension added to every flat, a resident has turned her extra square meters into a light‑filled art studio, yoga studio, and dining space overlooking the city.",
                    "In a space that once made residents dizzy during construction, when the old façade was removed and the new surface suddenly projected high above the ground, a tenant now calmly uses her expanded winter‑garden living room, enjoying a new lease on everyday life and doing far more from the comfort of her building.",
                    "From her renovated flat, a resident draws back a specially designed curtain whose dense, pleated fabric improves thermal comfort while revealing a panoramic view over the périphérique and La Défense.",
                ][i],
            })),
        },
    ];

    const brittanyImages = ["brittany-01", "brittany-02", "brittany-04"].map(
        (id) => ({
            src: `/images/optimized/brittany/${id}-full.webp`,
            alt: "Brittany",
        }),
    );

    const regions = [
        "Paris",
        // Temporarily hidden:
        // "Brittany",
        // "French Riviera",
        // "Overseas Territories",
    ];

    const galleryAspect = "h-[95vh]";

    const storyFrames = parisProjects.flatMap((project, projectIndex) =>
        project.images.map((image, imageIndex) => ({
            image,
            imageIndex,
            projectIndex,
            projectLabel: project.label,
        })),
    );

    const activeProjectIndex = $derived(
        storyFrames[activeFrame]?.projectIndex ?? 0,
    );

    function setActiveFrame(nextFrame: number) {
        if (nextFrame === activeFrame) return;
        activeFrame = nextFrame;
    }

    function syncActiveFrame() {
        const focusLine = window.innerHeight * 0.52;
        let nextFrame = 0;
        for (let i = 0; i < storyCardEls.length; i += 1) {
            const card = storyCardEls[i];
            if (card && card.getBoundingClientRect().top <= focusLine) {
                nextFrame = i;
            } else {
                break;
            }
        }
        setActiveFrame(nextFrame);
    }

    function handleStoryScroll() {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;
            syncActiveFrame();
        });
    }

    function handleResize() {
        syncProjectIndicator();
        syncActiveFrame();
    }

    function syncProjectIndicator() {
        const button = projectButtonEls[activeProjectIndex];
        if (!button) return;
        indicatorLeft = button.offsetLeft;
        indicatorWidth = button.offsetWidth;
        projectTabsEl?.scrollTo({
            left:
                button.offsetLeft +
                button.offsetWidth / 2 -
                projectTabsEl.clientWidth / 2,
            behavior: "smooth",
        });
    }

    function scrollToProject(projectIndex: number) {
        const firstFrame = storyFrames.findIndex(
            (frame) => frame.projectIndex === projectIndex,
        );
        const target = storyCardEls[firstFrame];
        if (!target || !storyCardsEl) return;
        setActiveFrame(firstFrame);
        const storyTop =
            storyCardsEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: storyTop + firstFrame * target.offsetHeight - 65,
            behavior: "smooth",
        });
    }

    $effect(() => {
        activeProjectIndex;
        requestAnimationFrame(syncProjectIndicator);
    });

    $effect(() => {
        for (const frameIndex of [activeFrame + 1, activeFrame + 2]) {
            const nextFrame = storyFrames[frameIndex];
            if (!nextFrame) continue;
            const image = new Image();
            image.src = asset(nextFrame.image.src);
        }
    });

    $effect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        activeRegion = el.dataset.region ?? "";
                        activeLabel = el.dataset.label ?? "";
                        activeDark = el.dataset.dark === "true";
                    }
                }
            },
            { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
        );
        for (const el of panelEls) {
            if (el) observer.observe(el);
        }
        return () => observer.disconnect();
    });
</script>

<svelte:window onscroll={handleStoryScroll} onresize={handleResize} />

<section id="socio-econometrics" class="py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl font-bold">
            A call for more post-occupancy evaluations
        </h2>
        <p class="mt-2 text-gray-600">
            This call proposes to shift attention from how many social housing
            units are delivered to how they are actually lived in. Under
            frameworks such as the Loi SRU, we now have twenty‑plus years of
            built projects, yet very few systematic post-occupancy evaluations
            that center residents’ experiences, building performance, and
            neighborhood effects. I am calling for planners, architects, housing
            providers, researchers, and resident organizations to develop
            shared, rigorous, and repeatable ways of assessing life in these
            developments—combining quantitative indicators (comfort, health,
            maintenance, environmental performance) with qualitative insights on
            dignity, everyday use, and social relations.
        </p>
        <p class="mt-2 text-gray-600">
            The goal is to move beyond compliance metrics and architectural
            intentions, and to build an evidence base that allows us to identify
            what actually works, what fails, and how future projects and
            policies should be revised. This page will serve as a living
            platform to gather tools, case
            studies, and collaborations around post-occupancy evaluations in
            social housing, and to invite others to join this agenda.
        </p>
        <p class="mt-2 text-gray-700">
            This call is grounded in four post-occupancy case studies (from
            Paris to Brittany, the French Riviera to the overseas territories)
            that anchor these questions in concrete places and lived
            experiences.
        </p>
    </div>

    <!-- Temporarily hidden region nav:
    <div class="max-w-3xl mx-auto mt-8 px-4 sm:px-6">
        <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {#each regions as region (region)}
                <a
                    href="#{slug(region)}"
                    class="text-gray-700 underline-offset-4 hover:underline"
                >
                    {region}
                </a>
            {/each}
        </nav>
    </div>
    -->

    <div class="relative mt-12">
        {#if useLegacyCarousel}
            <!-- Legacy carousel: intentionally retained so this direction can
                 be restored without rebuilding the galleries. -->
            <div class="pointer-events-none sticky top-16 z-30 h-0">
                <div
                    class="px-4 py-4 sm:px-6 transition-colors duration-300 {activeDark
                        ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]'
                        : 'text-gray-900'}"
                >
                    <h1 class="text-4xl font-bold leading-tight">
                        {activeRegion}{#if activeLabel}<br /><span
                                class="font-normal">{activeLabel}</span
                            >{/if}
                    </h1>
                </div>
            </div>

            <div id={slug("Paris")} class="scroll-mt-24">
                {#each parisProjects as project, i (project.label)}
                    <section
                        bind:this={panelEls[i]}
                        data-region="Paris"
                        data-label={project.label}
                        data-dark="true"
                        class="relative"
                    >
                        <AutoCarousel
                            images={project.images}
                            aspect={galleryAspect}
                            interval={6000}
                        />
                    </section>
                {/each}
            </div>
        {:else}
            <div id={slug("Paris")} class="story scroll-mt-24">
                <div class="story-project-nav">
                    <div
                        bind:this={projectTabsEl}
                        class="story-project-tabs"
                        role="group"
                        aria-label="Projects"
                    >
                        <span class="story-region-inline">Paris</span>
                        <span
                            class="story-project-indicator"
                            style:left="{indicatorLeft}px"
                            style:width="{indicatorWidth}px"
                        ></span>
                        {#each parisProjects as project, projectIndex (project.label)}
                            <button
                                bind:this={projectButtonEls[projectIndex]}
                                type="button"
                                class:story-project-button--active={projectIndex === activeProjectIndex}
                                class="story-project-button"
                                aria-current={projectIndex === activeProjectIndex ? "true" : undefined}
                                onclick={() => scrollToProject(projectIndex)}
                            >
                                {project.label}
                            </button>
                        {/each}
                    </div>
                </div>

                <div bind:this={storyCardsEl} class="story-cards">
                    {#each storyFrames as frame, frameIndex (frame.image.src)}
                        <article
                            bind:this={storyCardEls[frameIndex]}
                            data-frame={frameIndex}
                            data-project={frame.projectLabel}
                            class:story-card--landscape={frame.image.landscape}
                            class:story-card--retired={frameIndex < activeFrame - 2}
                            class="story-card"
                            style:z-index={frameIndex + 1}
                            aria-label="{frame.projectLabel}, photograph {frame.imageIndex + 1} of {parisProjects[frame.projectIndex].images.length}"
                        >
                            <img
                                src={asset(frame.image.src)}
                                alt={frame.image.alt}
                                class="story-image"
                                loading={frameIndex < 2 ? "eager" : "lazy"}
                            />
                            {#if frame.image.caption}
                                <p class="story-caption">
                                    {frame.image.caption}
                                </p>
                            {/if}
                        </article>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Temporarily hidden: Brittany, French Riviera, Overseas Territories
        <div
            id={slug("Brittany")}
            bind:this={panelEls[4]}
            data-region="Brittany"
            data-label=""
            data-dark="true"
            class="relative mt-16 min-h-screen scroll-mt-24 py-8"
        >
            <AutoCarousel images={brittanyImages} aspect={galleryAspect} />
        </div>

        <div
            id={slug("French Riviera")}
            bind:this={panelEls[5]}
            data-region="French Riviera"
            data-label=""
            data-dark="false"
            class="mt-16 min-h-screen scroll-mt-24"
        ></div>

        <div
            id={slug("Overseas Territories")}
            bind:this={panelEls[6]}
            data-region="Overseas Territories"
            data-label=""
            data-dark="false"
            class="mt-16 min-h-screen scroll-mt-24"
        ></div>
        -->
    </div>
</section>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    .story {
        position: relative;
        background: #111;
    }

    .story-project-nav {
        position: sticky;
        top: 4.0625rem;
        z-index: 100;
        height: 0;
        width: min(58rem, calc(100% - 2rem));
        margin-inline: auto;
        transform: translateY(1.25rem);
        text-align: center;
        pointer-events: auto;
    }

    .story-project-tabs {
        position: relative;
        display: flex;
        width: max-content;
        max-width: 100%;
        margin: 0 auto;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .story-project-tabs::-webkit-scrollbar {
        display: none;
    }

    .story-region-inline {
        position: relative;
        z-index: 1;
        flex: 0 0 auto;
        padding: 0.52rem 0.9rem;
        color: #fff;
        font: inherit;
        font-size: clamp(0.68rem, 1.25vw, 0.875rem);
        font-weight: 700;
        line-height: 1;
        text-shadow: 0 1px 3px rgb(0 0 0 / 45%);
        white-space: nowrap;
    }

    .story-project-indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 0;
        border: 1px solid #fff;
        border-radius: 9999px;
        background: transparent;
        transition:
            left 420ms cubic-bezier(0.22, 1, 0.36, 1),
            width 420ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .story-project-button {
        position: relative;
        z-index: 1;
        flex: 0 0 auto;
        border: 0;
        border-radius: 9999px;
        padding: 0.52rem 0.9rem;
        background: transparent;
        color: #fff;
        font: inherit;
        font-size: clamp(0.68rem, 1.25vw, 0.875rem);
        line-height: 1;
        text-shadow: 0 1px 3px rgb(0 0 0 / 45%);
        white-space: nowrap;
        cursor: pointer;
        transition: opacity 220ms ease;
    }

    .story-project-button:hover {
        text-decoration: underline;
        text-underline-offset: 0.2em;
    }

    .story-project-button:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 3px;
    }

    .story-project-button--active {
        color: #fff;
    }

    .story-project-button--active:focus-visible {
        outline: none;
    }

    .story-cards {
        position: relative;
    }

    .story-cards::after {
        display: block;
        height: calc(100svh - 4.0625rem);
        background: #000;
        content: "";
    }

    .story-card {
        position: sticky;
        top: 4.0625rem;
        display: flex;
        height: calc(100svh - 4.0625rem);
        scroll-margin-top: 4.0625rem;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #000;
    }

    /* Once a card is fully covered, remove it from the browser's paint stack.
       Keeping every full-screen sticky image composited caused the final cards
       to paint stale/cropped layers before snapping to the correct image. */
    .story-card--retired {
        visibility: hidden;
    }

    .story-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .story-card--landscape .story-image {
        object-fit: cover;
    }

    .story-caption {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        width: min(28rem, calc(100% - 2rem));
        margin: 0;
        padding: clamp(0.9rem, 1.6vw, 1.25rem)
            clamp(1rem, 1.9vw, 1.5rem);
        transform: translate(-50%, -50%);
        background: rgb(255 255 255 / 88%);
        color: #0a0a0a;
        font-size: clamp(0.875rem, 1.15vw, 1.075rem);
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 1.4;
    }

    @media (max-width: 640px) {
        .story-project-nav {
            top: 4.0625rem;
            width: calc(100% - 1rem);
            transform: translateY(1rem);
        }

        .story-project-tabs {
            margin-inline: 0;
        }

        .story-project-button {
            padding-inline: 0.72rem;
        }

        .story-region-inline {
            padding-inline: 0.72rem;
        }

        .story-caption {
            width: calc(100% - 1.5rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(html) {
            scroll-behavior: auto;
        }

        .story-project-indicator,
        .story-card {
            transition-duration: 1ms;
        }
    }
</style>
