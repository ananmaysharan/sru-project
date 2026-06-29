<script lang="ts">
    import AutoCarousel from "$lib/components/gallery/AutoCarousel.svelte";

    let activeRegion = $state("Paris");
    let activeLabel = $state("Samaritaine");
    let activeDark = $state(true);
    let panelEls = $state<HTMLElement[]>([]);

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

    function slug(s: string) {
        return s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

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
</script>

<section id="socio-econometrics" class="py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl font-bold">
            A call for more post occupancy evaluations
        </h2>
        <p class="mt-2 text-gray-600">
            This call proposes to shift attention from how many social housing
            units are delivered to how they are actually lived in. Under
            frameworks such as the Loi SRU, we now have twenty‑plus years of
            built projects, yet very few systematic post‑occupancy evaluations
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
            studies, and collaborations around post‑occupancy evaluations in
            social housing, and to invite others to join this agenda.
        </p>
        <p class="mt-2 text-gray-700">
            This call is grounded in four post‑occupancy case studies (from
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
        <!-- Floating section label: stays pinned below the nav across all
             regions and updates to the section currently in view. -->
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
