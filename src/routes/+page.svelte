<script lang="ts">
    import { onMount } from "svelte";
    import { asset } from "$app/paths";
    import SocialHousingStockChart from "$lib/components/charts/SocialHousingStockChart.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import Acknowledgements from "$lib/components/sections/Acknowledgements.svelte";
    import Logos from "$lib/components/elements/Logos.svelte";
    import { STORY_PHASES, phaseProgress } from "$lib/data/charts/scroll-story";
    import editorialContent from "$lib/data/editorial-content.md?raw";
    import editorialContentFr from "$lib/data/editorial-content.fr.md?raw";
    import { language } from "$lib/i18n";

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

<section class="intro-hero relative isolate w-full min-h-screen">
    <div class="intro-hero__media">
        <div class="intro-hero__media-frame">
            <img
                src={asset("/intro-hero.webp")}
                alt="View from a Parisian balcony"
                width="5244"
                height="3870"
                fetchpriority="high"
                class="absolute inset-0 h-full w-full object-cover"
            />
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
            {$language === 'fr'
                ? 'La Loi SRU : bilan après 25 ans'
                : 'The Loi SRU French social housing program, 25 years later'}
        </h1>
        <p class="mt-4 text-lg md:text-xl text-white/80">Magda Maaoui</p>

        <div
            class="mt-6 max-w-2xl flex flex-col gap-3 text-sm md:text-base leading-relaxed text-white/90"
        >
            {#if $language === 'fr'}
                <p>
                    Il y a vingt-cinq ans, en décembre 2000, la loi SRU (Loi relative à la
                    solidarité et au renouvellement urbains) était adoptée en France. Elle
                    imposait à certaines communes d’atteindre un taux de 25 % de logements
                    sociaux dans leur parc résidentiel, afin de mettre un frein aux dynamiques
                    croissantes de ségrégation.
                </p>
                <p>
                    Ce projet analyse les effets de cette loi sur le rééquilibrage du parc de
                    logements sociaux dans les communes de l’ensemble du pays, en particulier
                    dans celles qui ne respectent pas les quotas fixés. S’appuyant sur des travaux
                    de recherche antérieurs, cette étude conjugue analyse des politiques
                    d’exclusion, analyse de l’offre de logement, et analyse des effets de quartier,
                    notamment en ce qui concerne les indicateurs de santé.
                </p>
                <p>
                    J’utilise des outils cartographiques et statistiques afin d’évaluer comment la
                    mission définie il y a vingt-cinq ans, celle de rapprocher habitants et
                    aménités, pour offrir à ces derniers une meilleure qualité de vie, a été
                    accomplie. L’hypothèse qui guide cette analyse, tirée d’observations de terrain
                    en tant que chercheuse et urbaniste, est que ce bilan se caractérise par une
                    mosaïque de résultats. Ceux-ci dépendent fortement des politiques locales
                    d’usage du foncier et de logement, et de la volonté politique d’élus locaux de
                    se conformer à une loi imposée par l’État.
                </p>
                <p>
                    Je formule également l’hypothèse que, si un travail important de rééquilibrage
                    territorial reste nécessaire, notamment dans les communes les plus
                    récalcitrantes, la mission de rééquilibrage du parc de logements sociaux — et,
                    par conséquent, d’ouverture de l’accès à de meilleurs équipements et à
                    davantage de ressources — a néanmoins été globalement remplie.
                </p>
                <p>
                    Le tableau de bord suivant transpose cette analyse empirique en un outil
                    exploratoire. Il permet aux utilisateurs de découvrir une cartographie des
                    territoires où le parc de logements sociaux s’est développé, de comparer les
                    trajectoires des différentes communes et de mettre en relation la mise en œuvre
                    de la loi SRU avec plusieurs indicateurs tels que le revenu médian, le taux de
                    pauvreté, la structure démographique par âge, les nuances politiques, la
                    performance énergétique des logements et l’exposition aux îlots de chaleur. En
                    rendant ces évolutions visibles et faciles d’accès, l’objectif n’est pas
                    seulement d’évaluer si les objectifs de la loi ont été atteints sur le plan
                    quantitatif, mais aussi d’interroger les modalités et les territoires du
                    rééquilibrage, ainsi que ses implications en matière de santé et de justice
                    environnementale.
                </p>
                <p>
                    <a
                        href="https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790"
                        target="_blank"
                        rel="noreferrer"
                        class="underline underline-offset-2 hover:text-white"
                    >Si mes travaux ont déjà permis d’évaluer l’évolution quantitative du parc social</a>,
                    je me concentre délibérément ici sur la dimension de l’« accès aux opportunités »
                    — c’est-à-dire sur la manière dont la Loi SRU a permis aux habitants du parc
                    social d’accéder, au cours des vingt-cinq dernières années, à des territoires
                    leur offrant davantage de possibilités. Cette approche ne vise aucunement à
                    minimiser l’importance des travaux de recherche et des politiques publiques qui
                    continuent de documenter la géographie des quartiers prioritaires de la Politique
                    de la Ville (QPV), où les logements sociaux restent fortement concentrés. Pour
                    des analyses plus détaillées de ces territoires et des inégalités persistantes
                    qui les caractérisent, les lecteurs peuvent consulter des portails et tableaux
                    de bord nationaux existants tels que <a href="https://sig.ville.gouv.fr/" target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-white">SIG Ville</a>,
                    l’<a href="https://www.onpv.fr/donnees" target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-white">Observatoire national de la politique de la ville (ONPV)</a>
                    et les <a href="https://www.insee.fr/fr/statistiques/2500477" target="_blank" rel="noreferrer" class="underline underline-offset-2 hover:text-white">jeux de données de l’INSEE consacrés aux quartiers prioritaires</a>.
                </p>
            {:else}
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
                <a
                    href="https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790"
                    target="_blank"
                    rel="noreferrer"
                    class="underline underline-offset-2 hover:text-white"
                >While my research has already assessed the quantitative evolution of the social housing stock</a>,
                I deliberately focus here on the “moving to
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
            {/if}
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
</style>

<section class="support-section">
    <div class="max-w-6xl mx-auto px-6 pb-4">
        <h2 class="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
            {$language === 'fr' ? 'Avec le soutien de' : 'Supported by'}
        </h2>
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
                    {$language === 'fr'
                        ? '25 ans de rééquilibrage de l’offre de logements sociaux'
                        : '25 years of fair-share housing provision'}
                </h2>
                <p class="mt-4 text-gray-700">
                    {$language === 'fr'
                        ? 'L’offre de logements sociaux en France a connu une croissance régulière entre 2000 et 2025, la production de nouveaux logements ayant atteint un niveau historiquement élevé (plus de 80 000 logements par an) pour la première fois depuis les années 1970. Les projets réalisés dans les différentes régions françaises se sont révélés variés par leur architecture, leur taille et leur localisation.'
                        : "France's social housing has grown steadily between 2000-2025 with delivery of new units reaching a historic peak of over 80,000 per year for the first time since the 1970s. Projects built across France's regions have proven to be diverse in design, size, and location."}
                </p>
            </div>
            <div class="absolute inset-x-6" style="opacity: {swapProgress};">
                <h2 class="text-3xl font-bold">{$language === 'fr' ? 'À la une' : 'In the news'}</h2>
                <p class="mt-4 text-gray-700">
                    {#if $language === 'fr'}
                        Ensemble, ces titres de presse retracent la manière dont, au fil des années,
                        la loi SRU a poursuivi sa mission en tant qu’instrument de lutte contre
                        l’apartheid territorial et social. En parallèle, nombreux sont les acteurs
                        locaux et nationaux qui cherchent régulièrement à affaiblir ou à contourner
                        ses obligations en matière de logements sociaux, au moyen de réductions
                        budgétaires, de recours juridiques, de stratégies de contournement mises en
                        œuvre par les maires et de mobilisations de riverains opposés à la
                        construction de nouveaux logements sociaux, en particulier dans les communes
                        et quartiers les plus aisés.
                    {:else}
                    Together, these media headlines trace how, over the years,
                    the SRU law has been formally upheld as an instrument
                    against territorial and social apartheid, even as local and
                    national actors repeatedly seek to weaken or bypass its
                    social-housing obligations, through budget cuts, legal
                    challenges, strategic avoidance by mayors, and mobilized
                    resident opposition to new social housing construction,
                    particularly in wealthier communities.
                    {/if}
                </p>
            </div>
        </div>

        <!-- Chart fills the remaining viewport -->
        <div class="flex-1 w-full min-h-0">
            <SocialHousingStockChart {progress} />
        </div>
    </div>
</section>

<EditorialMarkdown source={$language === 'fr' ? editorialContentFr : editorialContent} section="introduction" render="content" />
<EditorialMarkdown source={$language === 'fr' ? editorialContentFr : editorialContent} section="dashboard-guide" render="content" compact />
<Acknowledgements />
<EditorialMarkdown source={$language === 'fr' ? editorialContentFr : editorialContent} section="introduction" render="notes" compact />
