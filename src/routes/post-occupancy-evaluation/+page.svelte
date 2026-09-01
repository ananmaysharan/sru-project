<script lang="ts">
    import { asset } from "$app/paths";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import editorialContent from "$lib/data/editorial-content.md?raw";
    import editorialContentFr from "$lib/data/editorial-content.fr.md?raw";
    import ProjectIdCard from "$lib/components/sections/ProjectIdCard.svelte";
    import { projectIdCards } from "$lib/data/project-id-cards";
    import { postOccupancyCaptionsFr, residentTopicsFr } from "$lib/data/post-occupancy.fr";
    import { language } from "$lib/i18n";
    import AutoCarousel from "$lib/components/gallery/AutoCarousel.svelte";
    import * as Select from "$lib/components/ui/select";
    import { onMount } from "svelte";
    import {
        COMPARISON_PALETTE,
        GRAPHICS_COLORS,
    } from "$lib/data/charts/chart-colors";

    type CaptionGridPosition =
        | "top-left"
        | "top-center"
        | "top-right"
        | "center-left"
        | "center-center"
        | "center-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";

    const permanentCaptionPositions: Partial<
        Record<string, CaptionGridPosition>
    > = {
        "/images/optimized/brittany/talgen-01-full.webp": "top-center",
        "/images/optimized/brittany/talgen-02-full.webp": "top-left",
        "/images/optimized/brittany/talgen-03-full.webp": "top-left",
        "/images/optimized/brittany/talgen-04-full.webp": "top-right",
        "/images/optimized/french-riviera/gignac-la-nerthe-01-full.webp": "top-center",
        "/images/optimized/french-riviera/gignac-la-nerthe-02-full.webp": "top-right",
        "/images/optimized/french-riviera/gignac-la-nerthe-03-full.webp": "top-center",
        "/images/optimized/french-riviera/gignac-la-nerthe-04-full.webp": "top-left",
        "/images/optimized/overseas-territories/les-jasmins-01-full.webp": "top-right",
        "/images/optimized/overseas-territories/les-jasmins-02-full.webp": "top-left",
        "/images/optimized/overseas-territories/les-jasmins-03-full.webp": "top-left",
        "/images/optimized/overseas-territories/les-jasmins-04-full.webp": "top-left",
        "/images/optimized/project-1/000016390005-full.webp": "top-right",
        "/images/optimized/project-1/000016390007-2-full.webp": "top-center",
        "/images/optimized/project-1/000016390009-full.webp": "top-right",
        "/images/optimized/project-1/000016390013-full.webp": "top-left",
        "/images/optimized/project-1/000064690007-full.webp": "top-center",
        "/images/optimized/project-1/000064690014-full.webp": "top-right",
        "/images/optimized/project-1/000064700002-full.webp": "top-right",
        "/images/optimized/project-1/000064700003-full.webp": "top-center",
        "/images/optimized/project-1/000086750006-full.webp": "top-left",
        "/images/optimized/project-1/000086750011-full.webp": "top-center",
        "/images/optimized/project-1/000086760003-full.webp": "top-center",
        "/images/optimized/project-1/000086760007-full.webp": "top-center",
        "/images/optimized/project-1/000086760009-full.webp": "top-center",
        "/images/optimized/project-1/7918512c-eab2-42ea-8d28-5f22f76dc604-full.webp": "top-left",
        "/images/optimized/project-1/a6a4358f-d0c0-48d5-9c19-bb3ff977df70-full.webp": "top-center",
        "/images/optimized/project-1/DSC02107-full.webp": "top-center",
        "/images/optimized/project-2/DSC01776-full.webp": "top-left",
        "/images/optimized/project-2/DSC01779-full.webp": "top-left",
        "/images/optimized/project-2/DSC01780-full.webp": "top-right",
        "/images/optimized/project-2/DSC01794-full.webp": "top-right",
        "/images/optimized/project-2/DSC01796-full.webp": "top-center",
        "/images/optimized/project-2/DSC01797-full.webp": "top-right",
        "/images/optimized/project-2/DSC01798-full.webp": "top-left",
        "/images/optimized/project-2/DSC01799-full.webp": "top-center",
        "/images/optimized/project-3/DSC01781-full.webp": "top-center",
        "/images/optimized/project-3/DSC01783-full.webp": "top-center",
        "/images/optimized/project-3/paris-01-full.webp": "top-right",
        "/images/optimized/project-4/7685ce4e-bef7-419c-8d9e-68536a49e292-full.webp": "top-left",
        "/images/optimized/project-4/cd3ed7fa-1ded-4c80-b2a8-21da3751b6d1-full.webp": "top-left",
        "/images/optimized/project-4/laguiole-280-full.webp": "top-right",
        "/images/optimized/project-4/laguiole-291-full.webp": "top-left",
        "/images/optimized/project-4/laguiole-297-full.webp": "top-center",
    };

    const captionGrid: CaptionGridPosition[] = [
        "top-left",
        "top-center",
        "top-right",
        "center-left",
        "center-center",
        "center-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
    ];

    type StoryImage = {
        src: string;
        alt: string;
        landscape: boolean;
        caption: string;
        objectPosition?: string;
    };

    type StoryProject = {
        label: string;
        images: StoryImage[];
        thumbnailIndex?: number;
    };

    type CaseStudyName =
        | "Paris"
        | "Brittany"
        | "Provence"
        | "Overseas Territories";

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
    let storyEl = $state<HTMLDivElement | null>(null);
    let caseStudyNavCompact = $state(false);
    let visibleProjectCard = $state<string | null>(null);
    let projectCardCloseTimer: ReturnType<typeof setTimeout> | null = null;
    let scrollFrame = 0;

    let captionDebugMode = $state(false);
    let captionPositionOverrides = $state<
        Partial<Record<string, CaptionGridPosition>>
    >({});
    let draggingCaption = $state<string | null>(null);
    let captionCopyState = $state("");

    const adjustedCaptionCount = $derived(
        Object.keys({
            ...permanentCaptionPositions,
            ...captionPositionOverrides,
        }).length,
    );

    let activeResidentTopic = $state<number | null>(null);
    let pinnedResidentTopic = $state<number | null>(null);
    let activeResidentQuote = $state<number | null>(null);
    let residentSankeyBody = $state<HTMLDivElement | null>(null);
    let residentTopicEls = $state<HTMLButtonElement[]>([]);
    let residentQuoteEls = $state<HTMLButtonElement[]>([]);

    function slug(s: string) {
        return s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    function cancelProjectCardClose() {
        if (projectCardCloseTimer === null) return;
        clearTimeout(projectCardCloseTimer);
        projectCardCloseTimer = null;
    }

    function showProjectCard(projectLabel: string) {
        cancelProjectCardClose();
        visibleProjectCard = projectLabel;
    }

    function scheduleProjectCardClose() {
        cancelProjectCardClose();
        projectCardCloseTimer = setTimeout(() => {
            visibleProjectCard = null;
            projectCardCloseTimer = null;
        }, 600);
    }

    function closeProjectCard() {
        cancelProjectCardClose();
        visibleProjectCard = null;
    }

    function handlePageKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") closeProjectCard();
    }

    function captionPositionFor(_image: StoryImage): CaptionGridPosition {
        return "top-right";
    }

    function setCaptionPosition(
        imageSrc: string,
        position: CaptionGridPosition,
    ) {
        captionPositionOverrides = {
            ...captionPositionOverrides,
            [imageSrc]: position,
        };
        captionCopyState = "";
    }

    function updateCaptionFromPointer(
        event: PointerEvent | MouseEvent,
        imageSrc: string,
    ) {
        if (!captionDebugMode || draggingCaption !== imageSrc) return;
        const frameIndex = storyFrames.findIndex(
            (frame) => frame.image.src === imageSrc,
        );
        const card = storyCardEls[frameIndex];
        if (!card) return;

        const bounds = card.getBoundingClientRect();
        const column = Math.min(
            2,
            Math.max(
                0,
                Math.floor(
                    ((event.clientX - bounds.left) / bounds.width) * 3,
                ),
            ),
        );
        const row = Math.min(
            2,
            Math.max(
                0,
                Math.floor(
                    ((event.clientY - bounds.top) / bounds.height) * 3,
                ),
            ),
        );
        setCaptionPosition(imageSrc, captionGrid[row * 3 + column]);
    }

    function startCaptionDrag(
        event: PointerEvent | MouseEvent,
        imageSrc: string,
    ) {
        if (!captionDebugMode) return;
        event.preventDefault();
        draggingCaption = imageSrc;
    }

    function finishCaptionDrag() {
        draggingCaption = null;
    }

    function handleCaptionPointerMove(event: PointerEvent | MouseEvent) {
        if (draggingCaption) {
            updateCaptionFromPointer(event, draggingCaption);
        }
    }

    async function copyCaptionPositions() {
        const positions = {
            ...permanentCaptionPositions,
            ...captionPositionOverrides,
        };
        await navigator.clipboard.writeText(
            JSON.stringify({ captionPositions: positions }, null, 2),
        );
        captionCopyState = "Copied";
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

    const parisProjects: StoryProject[] = [
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
            thumbnailIndex: 2,
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

    const frenchRivieraProjects: StoryProject[] = [
        {
            label: "Gignac-la-Nerthe",
            images: [
                {
                    src: "/images/optimized/french-riviera/gignac-la-nerthe-01-full.webp",
                    alt: "West façade of the Gignac-la-Nerthe housing project",
                    landscape: true,
                    objectPosition: "center bottom",
                    caption:
                        "Located in the small suburban middle-income town of Gignac-la-Nerthe, approximately 20 km northwest of Marseille, the project marks the transition between a residential neighborhood and the surrounding open landscape. West façade with a regular rhythm of Douglas-fir balconies set against solid ochre limestone walls, giving each dwelling access to a sheltered private outdoor space while helping buffer traffic noise.",
                },
                {
                    src: "/images/optimized/french-riviera/gignac-la-nerthe-02-full.webp",
                    alt: "Timber-and-steel access platforms at Gignac-la-Nerthe",
                    landscape: true,
                    caption:
                        "Open timber-and-steel access platforms connect the apartments while providing shared circulation space, private balconies, daylight and views across the surrounding landscape.",
                },
                {
                    src: "/images/optimized/french-riviera/gignac-la-nerthe-03-full.webp",
                    alt: "Limestone-clad housing ensemble at Gignac-la-Nerthe",
                    landscape: false,
                    caption:
                        "The two-volume housing ensemble clad in 32 cm-thick Vers-Pont-du-Gard limestone, with recessed loggias and landscaped outdoor areas that extend residents’ living environment beyond the apartments.",
                },
                {
                    src: "/images/optimized/french-riviera/gignac-la-nerthe-04-full.webp",
                    alt: "Ground-floor plan of the Gignac-la-Nerthe housing project",
                    landscape: true,
                    caption:
                        "Ground-floor plan showing the two-building arrangement, shared garden, storage and bicycle rooms, and the circulation spaces that organize access between the homes. Gignac-la-Nerthe is a small, middle-income suburban commune within the Marseille–Aix metropolitan area, predominantly characterized by homeowner-oriented housing.",
                },
            ],
        },
    ];

    const brittanyProjects: StoryProject[] = [
        {
            label: "Talgen",
            images: [
                {
                    src: "/images/optimized/brittany/talgen-01-full.webp",
                    alt: "The Talgen social-housing project in Cesson-Sévigné",
                    landscape: true,
                    caption:
                        "The Talgen project inserts 24 social-rental homes into ViaSilva, a mixed-use expansion of Cesson-Sévigné, mediating between detached houses and larger collective buildings. The neighborhood connects residents to the metro, the Boudebois park, local services and employment areas.",
                },
                {
                    src: "/images/optimized/brittany/talgen-02-full.webp",
                    alt: "Apartment plan for the Talgen social-housing project",
                    landscape: false,
                    caption:
                        "The plan brings together a range of apartment types around a compact shared circulation core, while terraces and balconies extend many of the homes into private outdoor space.",
                },
                {
                    src: "/images/optimized/brittany/talgen-03-full.webp",
                    alt: "Bicycle room at the Talgen social-housing project",
                    landscape: false,
                    caption:
                        "A secure, dedicated bicycle room makes cycle storage convenient and accessible, supporting car-independent connections to nearby public transport, green space and local services.",
                },
                {
                    src: "/images/optimized/brittany/talgen-04-full.webp",
                    alt: "Communal circulation space at the Talgen social-housing project",
                    landscape: false,
                    caption:
                        "The communal circulation space is treated as an amenity rather than leftover space, combining natural light, timber, tiled surfaces and green metalwork to create a welcoming and legible entrance to the homes.",
                },
            ],
        },
    ];

    const overseasTerritoriesProjects: StoryProject[] = [
        {
            label: "Les Jasmins · La Réunion",
            images: [
                {
                    src: "/images/optimized/overseas-territories/les-jasmins-01-full.webp",
                    alt: "Les Jasmins residence in La Possession, La Réunion",
                    landscape: true,
                    caption:
                        "The Les Jasmins residence provides 38 homes through a social homeownership scheme within Cœur de Ville, La Possession’s new urban centre. Shaded balconies, deep overhangs and screened openings create comfortable outdoor spaces suited to the tropical climate.",
                },
                {
                    src: "/images/optimized/overseas-territories/les-jasmins-02-full.webp",
                    alt: "Planted pedestrian paths around Les Jasmins",
                    landscape: false,
                    caption:
                        "Planted paths, palms, shared gardens and porous pedestrian spaces create a shaded setting around the housing. In Cœur de Ville, this “garden-city” approach extends access to cooling, recreation and social interaction beyond the individual dwelling.",
                },
                {
                    src: "/images/optimized/overseas-territories/les-jasmins-03-full.webp",
                    alt: "Site plan of Cœur de Ville in La Possession",
                    landscape: true,
                    caption:
                        "The site plan situates Les Jasmins within Cœur de Ville, a 34-hectare development combining housing with green spaces, schools, shops, public facilities and pedestrian routes. Conceived in response to La Possession’s rapid demographic growth, the district aims to bring everyday amenities closer to residents.",
                },
                {
                    src: "/images/optimized/overseas-territories/les-jasmins-04-full.webp",
                    alt: "Axonometric view of Cœur de Ville in La Possession",
                    landscape: false,
                    caption:
                        "The axonometric view presents Cœur de Ville as a socially mixed neighborhood combining housing, shops, offices, healthcare, schools, gardens and shared public spaces. Its planning links access to affordable housing with access to the facilities of a new town center.",
                },
            ],
        },
    ];

    const caseStudyProjects: Record<CaseStudyName, StoryProject[]> = {
        Paris: parisProjects,
        Brittany: brittanyProjects,
        "Provence": frenchRivieraProjects,
        "Overseas Territories": overseasTerritoriesProjects,
    };

    const residentTopicsEn = [
        {
            label: "Residential pride and the symbolic value of place",
            quotes: [
                "We all felt like we’d won the lottery when we were allocated housing in this neighborhood.",
                "I cried the day I saw how beautiful the apartment was and the view from my balcony. It opened up the field of possibilities.",
                "I have a large studio, with an incredible view and a small balcony. I can see the Eiffel Tower, the Louvre, the Sacré Cœur, the Montparnasse Tower, and a bit of the Seine.",
                "It nourishes the soul. I’m very proud to live here.",
                "My daughter was even able to find a job at La Samaritaine, and it made her very proud. It’s also a source of pride for my daughters to live at La Samaritaine.",
            ],
        },
        {
            label: "Everyday retail and food access",
            quotes: [
                "For my budget, it’s a bit of a food desert. There should be more supermarkets. Everything costs a fortune. I do my grocery shopping when I go to my parents’ place. My neighbors all have to take the metro to get to the nearest Lidl, which is still five metro stops away.",
                "Sometimes the crowds are a bit much, but being in the heart of the city is priceless. We’re close to everything—except large supermarkets.",
                "I’ve always done my shopping at the Aligre market. That suits me perfectly. It’s still a bit far and I have to take the metro, so we have to be two people if I’m heavily loaded with the shopping cart.",
                "There’s a market on Sunday mornings on Rue de Montmartre, but the prices are prohibitive.",
                "It’s a showcase neighborhood. So, there are a huge number of tourists. It’s really geared toward a tourist clientele.",
            ],
        },
        {
            label: "Healthcare access and affordability",
            quotes: [
                "Around here, the problem is that there are a lot of health centers that charge extra fees, and depending on our complementary insurance, we’re not covered 100%, even when we have civil-servant insurance.",
                "I’m in favor of local medicine, but it’s impossible to find a new primary care doctor in the neighborhood. So I see my doctor where I used to live before. Here, doctors all refuse to take new patients.",
                "On the other hand, for all other care, I go nearby. I found a great dentist. Same for the ophthalmologist. Same for the imaging center. There are a huge number of care centers that are not necessarily cheap, that I find very luxurious, but for now they help me out.",
            ],
        },
        {
            label: "Thermal comfort and housing design in use",
            quotes: [
                "Our homes are not energy sieves, but we die of heat in the summer. They’re real thermal kettles. I have a small AC unit, but even with that, I can barely survive. So if I can, I escape to my parents’ place outside Paris.",
                "At the Tour Bois-le-Prêtre, when the balconies were added by the architects, for a long time the neighbors were afraid to go out there to cool off and enjoy the view; it made them dizzy.",
                "They installed these nice thermal curtains for us, which require a minimum of know-how for everyday maintenance. Many of my neighbors forget to open them and air out the whole apartment for at least ten minutes a day.",
                "Here, this must have been the storage floor. So our apartment is attic-style, with a sloping ceiling. We’re right under the zinc roof. So, yes, in the summer, the whole envelope is hot, sometimes burning.",
            ],
        },
        {
            label: "Cultural capital and proximity to amenities",
            quotes: [
                "I was able to take art history classes at the Louvre museum because it’s right next door. I wouldn’t have done it if I didn’t live in the neighborhood. The Louvre is what symbolizes my experience of this home. I spent wonderful hours studying there.",
            ],
        },
        {
            label: "Governance, coordination and the “after” of flagship projects",
            quotes: [
                "These are all the questions about the post-inauguration phase that Paris Habitat and every social housing provider managing these more recent projects should be asking themselves. They honored their part of the deal. With a bit more coordination of resources at the neighborhood scale, we wouldn’t be having these problems in terms of access to services and well-being.",
            ],
        },
    ];

    const residentTopics = $derived($language === 'fr' ? residentTopicsFr : residentTopicsEn);

    const residentTopicColors = [
        GRAPHICS_COLORS.primary,
        GRAPHICS_COLORS.focus,
        GRAPHICS_COLORS.plum,
        GRAPHICS_COLORS.blue,
        GRAPHICS_COLORS.primaryMid,
        GRAPHICS_COLORS.primaryDark,
    ];

    const residentQuoteList = $derived.by(() =>
        residentTopics.flatMap((topic, topicIndex) =>
            topic.quotes.map((quote, quoteIndex) => ({
                quote,
                quoteIndex,
                topicIndex,
                topicLabel: topic.label,
                color: residentTopicColors[topicIndex] ?? COMPARISON_PALETTE[0],
            })),
        ),
    );

    let residentTopicPositions = $state(residentTopicsEn.map(
        (_, topicIndex) => ((topicIndex + 0.5) / residentTopicsEn.length) * 100,
    ));

    const residentQuoteCount = residentTopicsEn.reduce((sum, topic) => sum + topic.quotes.length, 0);
    let residentQuotePositions = $state(Array.from({ length: residentQuoteCount },
        (_, quoteIndex) =>
            ((quoteIndex + 0.5) / residentQuoteCount) * 100,
    ));

    function residentLinkPath(item: (typeof residentQuoteList)[number], quoteIndex: number) {
        const topicCenter = residentTopicPositions[item.topicIndex] * 10;
        const topicQuoteCount = residentTopics[item.topicIndex].quotes.length;
        const topicNodeHeight = Math.max(28, topicQuoteCount * 13);
        const sourceY =
            topicCenter -
            topicNodeHeight / 2 +
            ((item.quoteIndex + 0.5) / topicQuoteCount) * topicNodeHeight;
        const targetY = residentQuotePositions[quoteIndex] * 10;
        return `M 213 ${sourceY} C 320 ${sourceY}, 404 ${targetY}, 500 ${targetY}`;
    }

    function residentTopicNodeHeight(topicIndex: number) {
        return Math.max(28, residentTopics[topicIndex].quotes.length * 13);
    }

    const regions: CaseStudyName[] = [
        "Paris",
        "Brittany",
        "Provence",
        "Overseas Territories",
    ];

    const galleryAspect = "h-[95vh]";

    const caseStudyNavItems = $derived(
        regions.flatMap((region) =>
            caseStudyProjects[region].map(
                (project, projectIndex) => ({
                    region,
                    project,
                    projectIndex,
                }),
            ),
        ),
    );

    const storyFrames = $derived.by(() => {
        let captionIndex = 0;
        return caseStudyNavItems.flatMap((item) =>
            item.project.images.map((image, imageIndex) => {
                const localizedImage = {
                    ...image,
                    caption: $language === 'fr'
                        ? postOccupancyCaptionsFr[captionIndex]
                        : image.caption,
                };
                captionIndex += 1;
                return {
                    image: localizedImage,
                    imageIndex,
                    region: item.region,
                    project: item.project,
                    projectIndex: item.projectIndex,
                    projectLabel: item.project.label,
                };
            }),
        );
    });

    function regionLabel(region: CaseStudyName) {
        if ($language === 'fr') {
            if (region === 'Brittany') return 'Bretagne';
            if (region === 'Overseas Territories') return 'DROM';
        }
        return region;
    }

    const activeCaseStudy = $derived(
        storyFrames[activeFrame]?.region ?? "Paris",
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

    function syncCaseStudyNavState() {
        if (!storyEl) return;
        const bounds = storyEl.getBoundingClientRect();
        const headerHeight = 65;
        caseStudyNavCompact =
            bounds.top <= headerHeight && bounds.bottom > headerHeight + 80;
    }

    function handleStoryScroll() {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;
            syncActiveFrame();
            syncCaseStudyNavState();
        });
    }

    function handleResize() {
        syncActiveFrame();
        syncCaseStudyNavState();
    }

    function projectFrameIndex(
        region: CaseStudyName,
        projectIndex: number,
    ) {
        return storyFrames.findIndex(
            (frame) =>
                frame.region === region &&
                frame.projectIndex === projectIndex,
        );
    }

    function alignActiveFrameSmoothly() {
        const target = storyCardEls[activeFrame];
        if (!target) return;
        const correction = target.getBoundingClientRect().top - 65;
        if (Math.abs(correction) <= 1) return;
        window.scrollBy({ top: correction, behavior: "smooth" });
    }

    function jumpToProject(
        region: CaseStudyName,
        projectIndex: number,
    ) {
        const firstFrame = projectFrameIndex(region, projectIndex);
        const target = storyCardEls[firstFrame];
        if (!target || !storyCardsEl) return;
        setActiveFrame(firstFrame);
        const storyTop =
            storyCardsEl.getBoundingClientRect().top + window.scrollY;
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo({
            top: storyTop + firstFrame * target.offsetHeight - 65,
            behavior: "auto",
        });

        requestAnimationFrame(() => {
            root.style.scrollBehavior = previousScrollBehavior;
            requestAnimationFrame(alignActiveFrameSmoothly);
        });
    }

    function isAvailableCaseStudy(region: string): region is CaseStudyName {
        return (
            region === "Paris" ||
            region === "Brittany" ||
            region === "Provence" ||
            region === "Overseas Territories"
        );
    }

    function selectCaseStudy(region: string, projectIndex = 0) {
        if (!isAvailableCaseStudy(region)) return;

        if (
            activeCaseStudy === region &&
            activeProjectIndex === projectIndex
        ) {
            alignActiveFrameSmoothly();
            return;
        }

        jumpToProject(region, projectIndex);
    }

    function caseStudyValue(region: CaseStudyName, projectIndex: number) {
        return `${region}::${projectIndex}`;
    }

    const activeCaseStudyValue = $derived(
        caseStudyValue(activeCaseStudy, activeProjectIndex),
    );

    function handleCaseStudySelect(value: string | undefined) {
        if (!value) return;
        const item = caseStudyNavItems.find(
            (candidate) =>
                caseStudyValue(candidate.region, candidate.projectIndex) ===
                value,
        );
        if (item) selectCaseStudy(item.region, item.projectIndex);
    }

    function previewResidentTopic(topicIndex: number) {
        activeResidentTopic = topicIndex;
    }

    function restorePinnedResidentTopic() {
        activeResidentTopic = pinnedResidentTopic;
    }

    function toggleResidentTopic(topicIndex: number) {
        pinnedResidentTopic =
            pinnedResidentTopic === topicIndex ? null : topicIndex;
        activeResidentTopic = pinnedResidentTopic;
    }

    function clearResidentTopic() {
        pinnedResidentTopic = null;
        activeResidentTopic = null;
        activeResidentQuote = null;
    }

    function previewResidentQuote(quoteIndex: number) {
        activeResidentQuote = quoteIndex;
    }

    function clearResidentQuote() {
        activeResidentQuote = null;
    }

    function measureResidentSankey() {
        if (!residentSankeyBody) return;
        const bodyBounds = residentSankeyBody.getBoundingClientRect();
        if (!bodyBounds.height) return;

        residentTopicPositions = residentTopicEls.map((element) => {
            const bounds = element.getBoundingClientRect();
            return (
                ((bounds.top + bounds.height / 2 - bodyBounds.top) /
                    bodyBounds.height) *
                100
            );
        });

        residentQuotePositions = residentQuoteEls.map((element) => {
            const bounds = element.getBoundingClientRect();
            return (
                ((bounds.top + bounds.height / 2 - bodyBounds.top) /
                    bodyBounds.height) *
                100
            );
        });
    }

    onMount(() => {
        captionDebugMode =
            new URL(window.location.href).searchParams.get("caption-debug") ===
            "1";
        if (!captionDebugMode) return;

        window.addEventListener("pointermove", handleCaptionPointerMove);
        window.addEventListener("mousemove", handleCaptionPointerMove);
        window.addEventListener("pointerup", finishCaptionDrag);
        window.addEventListener("mouseup", finishCaptionDrag);

        return () => {
            window.removeEventListener("pointermove", handleCaptionPointerMove);
            window.removeEventListener("mousemove", handleCaptionPointerMove);
            window.removeEventListener("pointerup", finishCaptionDrag);
            window.removeEventListener("mouseup", finishCaptionDrag);
        };
    });

    onMount(() => {
        const frame = requestAnimationFrame(syncCaseStudyNavState);
        return () => {
            cancelAnimationFrame(frame);
            cancelProjectCardClose();
        };
    });

    onMount(() => {
        if (!residentSankeyBody) return;
        const scheduleMeasurement = () =>
            requestAnimationFrame(measureResidentSankey);
        const observer = new ResizeObserver(scheduleMeasurement);
        observer.observe(residentSankeyBody);
        window.addEventListener("resize", scheduleMeasurement);
        scheduleMeasurement();
        document.fonts?.ready.then(scheduleMeasurement);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", scheduleMeasurement);
        };
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

<svelte:window
    onscroll={handleStoryScroll}
    onresize={handleResize}
    onkeydown={handlePageKeydown}
/>

<section id="socio-econometrics" class="page-shell" lang={$language}>
    <div class="prose-column">
        <h1 class="page-title">
            {$language === 'fr'
                ? 'Appel à développer plus d’évaluations de l’usage des bâtiments de logements sociaux'
                : 'A call for more post‑occupancy evaluations'}
        </h1>
        <p class="page-intro-body">
            {#if $language === 'fr'}
                Cet appel propose de déplacer l’attention du nombre de logements sociaux produits
                vers la manière dont ils sont effectivement habités. Dans le cadre de dispositifs
                tels que la loi SRU, plus de vingt ans de projets ont désormais été réalisés, mais
                très peu d’évaluations post-occupationnelles systématiques ont été menées en plaçant
                au centre l’expérience des habitants, la performance des bâtiments et les effets à
                l’échelle des quartiers. Ce projet appelle les urbanistes, architectes, bailleurs
                sociaux, chercheurs et organisations de résidents à élaborer des méthodes communes,
                rigoureuses et reproductibles pour évaluer la vie dans ces opérations. Ces méthodes
                devraient combiner des indicateurs quantitatifs (confort, santé, entretien et
                performance environnementale) avec des données qualitatives portant sur la dignité,
                les usages quotidiens et le lien social.
            {:else}
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
            {/if}
        </p>
        <p class="page-intro-body mt-5">
            {#if $language === 'fr'}
                L’objectif est d’aller au-delà des quotas de logements sociaux et des intentions
                architecturales, afin de constituer une base de connaissances permettant
                d’identifier ce qui fonctionne réellement, ce qui échoue et la manière dont les
                futurs projets et politiques devraient être repensés. Cette page servira de
                plateforme évolutive pour rassembler des outils, des études de cas et des
                collaborations autour des évaluations post-occupationnelles dans le logement social,
                et pour inviter d’autres acteurs à rejoindre cette démarche.
            {:else}
            The goal is to move beyond compliance metrics and architectural
            intentions, and to build an evidence base that allows us to identify
            what actually works, what fails, and how future projects and
            policies should be revised. This page will serve as a living
            platform to gather tools, case
            studies, and collaborations around post-occupancy evaluations in
            social housing, and to invite others to join this agenda.
            {/if}
        </p>
        <p class="page-intro-body mt-5">
            {$language === 'fr'
                ? 'Cet appel s’appuie sur sept études de cas post-occupationnelles, de Paris à la Bretagne, de la Provence aux départements et territoires d’outre-mer. Les sept zooms ancrent ces questions dans des lieux concrets et des expériences vécues.'
                : 'This call is grounded in seven post-occupancy case studies, from Paris to Brittany, Provence, and the overseas territories, that anchor these questions in concrete places and lived experiences.'}
        </p>
    </div>

    <div class="case-study-index-shell">
        <nav class="case-study-index" aria-label={$language === 'fr' ? 'Études de cas par région' : 'Case studies by region'}>
            {#each regions as region (region)}
                <span
                    class:case-study-region-label--paris={region === "Paris"}
                    class="case-study-region-label"
                >
                    {regionLabel(region)}
                </span>
            {/each}
            {#each caseStudyNavItems as item (`${item.region}-${item.project.label}`)}
                <button
                    type="button"
                    class:case-study-case-button--active={item.region === activeCaseStudy && item.projectIndex === activeProjectIndex}
                    class="case-study-case-button"
                    aria-current={item.region === activeCaseStudy && item.projectIndex === activeProjectIndex ? "true" : undefined}
                    aria-label={`${regionLabel(item.region)}: ${item.project.label}`}
                    onclick={() => selectCaseStudy(item.region, item.projectIndex)}
                    onmouseenter={() => {
                        if (projectIdCards[item.project.label]) showProjectCard(item.project.label);
                    }}
                    onmouseleave={() => {
                        if (projectIdCards[item.project.label]) scheduleProjectCardClose();
                    }}
                    onfocus={() => {
                        if (projectIdCards[item.project.label]) showProjectCard(item.project.label);
                    }}
                    onblur={() => {
                        if (projectIdCards[item.project.label]) scheduleProjectCardClose();
                    }}
                >
                    <span class="case-study-thumbnail" aria-hidden="true">
                        <img
                            src={asset(item.project.images[item.project.thumbnailIndex ?? 0].src)}
                            alt=""
                            loading="eager"
                        />
                    </span>
                    <span class="case-study-case-label">
                        {item.project.label}
                    </span>
                </button>
            {/each}
        </nav>
    </div>

    {#if visibleProjectCard && projectIdCards[visibleProjectCard]}
        <ProjectIdCard
            card={projectIdCards[visibleProjectCard]}
            onmouseenter={cancelProjectCardClose}
            onmouseleave={scheduleProjectCardClose}
        />
    {/if}

    <div class="relative mt-6">
        {#if useLegacyCarousel}
            <!-- Legacy carousel: intentionally retained so this direction can
                 be restored without rebuilding the galleries. -->
            <div class="pointer-events-none sticky top-16 z-30 h-0">
                <div
                    class="px-4 py-4 sm:px-6 transition-colors duration-300 {activeDark
                        ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]'
                        : 'text-gray-900'}"
                >
                    <h2 class="text-4xl font-bold leading-tight">
                        {activeRegion}{#if activeLabel}<br /><span
                                class="font-normal">{activeLabel}</span
                            >{/if}
                    </h2>
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
            <div
                bind:this={storyEl}
                id="case-study-gallery"
                class="story scroll-mt-24"
            >
                <div class="case-study-compact-anchor">
                    {#if caseStudyNavCompact}
                        <nav
                            class="case-study-compact-index"
                            aria-label={$language === 'fr' ? 'Étude de cas actuelle' : 'Current case study'}
                        >
                            <Select.Root
                                type="single"
                                value={activeCaseStudyValue}
                                onValueChange={handleCaseStudySelect}
                            >
                                <Select.Trigger
                                    class="min-w-[13.5rem] max-w-[calc(100vw-1.5rem)] rounded-none border-0 bg-white/[0.88] px-3 text-left font-medium text-gray-900 shadow-none hover:bg-white/[0.94] focus-visible:ring-0"
                                >
                                    <span class="min-w-0 flex-1 truncate text-left">
                                        {regionLabel(activeCaseStudy)} – {storyFrames[activeFrame]?.projectLabel}
                                    </span>
                                </Select.Trigger>
                                <Select.Content
                                    align="start"
                                    sideOffset={8}
                                    class="w-(--bits-select-anchor-width) max-w-[calc(100vw-1.5rem)] rounded-none border-0 bg-white/[0.88] text-gray-900 shadow-none"
                                >
                                    {#each regions as region (`compact-group-${region}`)}
                                        <Select.Group>
                                            <Select.GroupHeading
                                                class="px-2 pb-1 pt-2 text-left text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-gray-500"
                                            >
                                                {regionLabel(region)}
                                            </Select.GroupHeading>
                                            {#each caseStudyProjects[region] as project, projectIndex (`compact-${region}-${project.label}`)}
                                                <Select.Item
                                                    class="justify-start rounded-none text-left data-[highlighted]:bg-white/55"
                                                    value={caseStudyValue(region, projectIndex)}
                                                    label={project.label}
                                                />
                                            {/each}
                                        </Select.Group>
                                    {/each}
                                </Select.Content>
                            </Select.Root>
                        </nav>
                    {/if}
                </div>

                <div bind:this={storyCardsEl} class="story-cards">
                    {#each storyFrames as frame, frameIndex (frame.image.src)}
                        <article
                            bind:this={storyCardEls[frameIndex]}
                            data-frame={frameIndex}
                            data-project={frame.projectLabel}
                            class:story-card--landscape={frame.image.landscape}
                            class:story-card--last={frameIndex === storyFrames.length - 1}
                            class:story-card--retired={frameIndex < activeFrame - 2}
                            class="story-card"
                            style:z-index={frameIndex + 1}
                            aria-label={$language === 'fr'
                                ? `${frame.projectLabel}, photographie ${frame.imageIndex + 1} sur ${frame.project.images.length}`
                                : `${frame.projectLabel}, photograph ${frame.imageIndex + 1} of ${frame.project.images.length}`}
                        >
                            <img
                                src={asset(frame.image.src)}
                                alt={frame.image.alt}
                                class="story-image"
                                loading={frameIndex < 2 ? "eager" : "lazy"}
                                style:object-position={frame.image.objectPosition}
                            />
                            {#if captionDebugMode}
                                <div class="caption-debug-grid" aria-hidden="true">
                                    {#each captionGrid as cell (cell)}
                                        <span></span>
                                    {/each}
                                </div>
                            {/if}
                            {#if frame.image.caption}
                                {#if captionDebugMode}
                                    <button
                                        type="button"
                                        draggable="true"
                                        class="story-caption story-caption--{captionPositionFor(frame.image)} story-caption--debug"
                                        class:story-caption--dragging={draggingCaption === frame.image.src}
                                        onpointerdown={(event) => startCaptionDrag(event, frame.image.src)}
                                        onpointerup={() => finishCaptionDrag()}
                                        onpointercancel={() => finishCaptionDrag()}
                                        onmousedown={(event) => startCaptionDrag(event, frame.image.src)}
                                        onmouseup={() => finishCaptionDrag()}
                                        ondragstart={(event) => startCaptionDrag(event, frame.image.src)}
                                        ondrag={(event) => updateCaptionFromPointer(event, frame.image.src)}
                                        ondragend={() => finishCaptionDrag()}
                                    >
                                        {frame.image.caption}
                                    </button>
                                {:else}
                                    <p class="story-caption story-caption--{captionPositionFor(frame.image)}">
                                        {frame.image.caption}
                                    </p>
                                {/if}
                            {/if}
                        </article>
                    {/each}
                </div>
            </div>

            {#if captionDebugMode}
                <aside class="caption-debug-toolbar">
                    <button
                        type="button"
                        onclick={copyCaptionPositions}
                        disabled={adjustedCaptionCount === 0}
                    >
                        Copy positions ({adjustedCaptionCount})
                    </button>
                    {#if captionCopyState}
                        <output aria-live="polite">{captionCopyState}</output>
                    {/if}
                </aside>
            {/if}
        {/if}

        <!-- Temporarily hidden: Brittany, Provence, Overseas Territories
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
            id={slug("Provence")}
            bind:this={panelEls[5]}
            data-region="Provence"
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

    <section
        class="resident-voices"
        aria-labelledby="resident-voices-title"
    >
        <div class="resident-voices-inner">
            <h2 id="resident-voices-title" class="text-3xl font-bold">
                {$language === 'fr'
                    ? 'Les habitants évaluent les projets de logements'
                    : 'Residents assess the housing projects'}
            </h2>
            <p id="resident-sankey-instructions" class="sr-only">
                {$language === 'fr'
                    ? 'Survolez une catégorie ou placez-y le focus pour mettre en évidence les citations associées. Sélectionnez-la pour maintenir la mise en évidence.'
                    : 'Hover or focus on a category to highlight its connected quotes. Select a category to keep it highlighted.'}
            </p>

            <div
                class="resident-sankey"
                role="group"
                aria-label={$language === 'fr' ? 'Thèmes et citations de l’évaluation des habitants' : 'Resident assessment themes and quotes'}
                aria-describedby="resident-sankey-instructions"
            >
                <div bind:this={residentSankeyBody} class="resident-sankey-body">
                    <svg
                        class="resident-sankey-links"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {#each residentTopics as topic, topicIndex (topic.label)}
                            <rect
                                class="resident-sankey-node"
                                class:resident-sankey-node--matched={activeResidentTopic === topicIndex || (activeResidentQuote !== null && residentQuoteList[activeResidentQuote]?.topicIndex === topicIndex)}
                                class:resident-sankey-node--muted={(activeResidentTopic !== null && activeResidentTopic !== topicIndex) || (activeResidentQuote !== null && residentQuoteList[activeResidentQuote]?.topicIndex !== topicIndex)}
                                x="205"
                                y={residentTopicPositions[topicIndex] * 10 - residentTopicNodeHeight(topicIndex) / 2}
                                width="8"
                                height={residentTopicNodeHeight(topicIndex)}
                                fill={residentTopicColors[topicIndex]}
                            />
                        {/each}

                        {#each residentQuoteList as item, quoteIndex (`${item.topicIndex}-${item.quoteIndex}`)}
                            <path
                                class="resident-sankey-link"
                                class:resident-sankey-link--matched={activeResidentQuote === quoteIndex || (activeResidentQuote === null && activeResidentTopic === item.topicIndex)}
                                class:resident-sankey-link--muted={(activeResidentQuote !== null && activeResidentQuote !== quoteIndex) || (activeResidentQuote === null && activeResidentTopic !== null && activeResidentTopic !== item.topicIndex)}
                                d={residentLinkPath(item, quoteIndex)}
                                stroke={item.color}
                                vector-effect="non-scaling-stroke"
                            />
                            <rect
                                class="resident-sankey-node resident-sankey-quote-node"
                                class:resident-sankey-node--matched={activeResidentQuote === quoteIndex || (activeResidentQuote === null && activeResidentTopic === item.topicIndex)}
                                class:resident-sankey-node--muted={(activeResidentQuote !== null && activeResidentQuote !== quoteIndex) || (activeResidentQuote === null && activeResidentTopic !== null && activeResidentTopic !== item.topicIndex)}
                                x="500"
                                y={residentQuotePositions[quoteIndex] * 10 - 8}
                                width="8"
                                height="16"
                                fill={item.color}
                            />
                        {/each}
                    </svg>

                    <div
                        class="resident-sankey-topics"
                        role="group"
                        aria-label={$language === 'fr' ? 'Catégories de citations des habitants' : 'Resident quote categories'}
                    >
                        {#each residentTopics as topic, topicIndex (topic.label)}
                            <button
                                bind:this={residentTopicEls[topicIndex]}
                                type="button"
                                class="resident-topic-button"
                                class:resident-topic-button--active={activeResidentTopic === topicIndex || (activeResidentQuote !== null && residentQuoteList[activeResidentQuote]?.topicIndex === topicIndex)}
                                aria-pressed={pinnedResidentTopic === topicIndex}
                                aria-controls="resident-sankey-quotes"
                                style:--topic-color={residentTopicColors[topicIndex]}
                                style:top={`${residentTopicPositions[topicIndex]}%`}
                                onmouseenter={() => previewResidentTopic(topicIndex)}
                                onmouseleave={restorePinnedResidentTopic}
                                onfocus={() => previewResidentTopic(topicIndex)}
                                onblur={restorePinnedResidentTopic}
                                onclick={() => toggleResidentTopic(topicIndex)}
                                onkeydown={(event) => {
                                    if (event.key === "Escape") {
                                        clearResidentTopic();
                                        event.currentTarget.blur();
                                    }
                                }}
                            >
                                <span>{topic.label}</span>
                                <span class="sr-only">
                                    {topic.quotes.length}
                                    {$language === 'fr'
                                        ? topic.quotes.length === 1 ? ' citation associée.' : ' citations associées.'
                                        : topic.quotes.length === 1 ? ' connected quote.' : ' connected quotes.'}
                                </span>
                            </button>
                        {/each}
                    </div>

                    <div
                        id="resident-sankey-quotes"
                        class="resident-sankey-quotes"
                    >
                        {#each residentQuoteList as item, quoteIndex (`${item.topicIndex}-${item.quoteIndex}`)}
                            <button
                                bind:this={residentQuoteEls[quoteIndex]}
                                type="button"
                                class="resident-quote-item"
                                class:resident-quote-item--matched={activeResidentQuote === quoteIndex || (activeResidentQuote === null && activeResidentTopic === item.topicIndex)}
                                class:resident-quote-item--muted={(activeResidentQuote !== null && activeResidentQuote !== quoteIndex) || (activeResidentQuote === null && activeResidentTopic !== null && activeResidentTopic !== item.topicIndex)}
                                style:--topic-color={item.color}
                                onmouseenter={() => previewResidentQuote(quoteIndex)}
                                onmouseleave={clearResidentQuote}
                                onfocus={() => previewResidentQuote(quoteIndex)}
                                onblur={clearResidentQuote}
                                onkeydown={(event) => {
                                    if (event.key === "Escape") {
                                        clearResidentQuote();
                                        event.currentTarget.blur();
                                    }
                                }}
                            >
                                <span class="sr-only">
                                    {$language === 'fr' ? 'Catégorie' : 'Category'}: {item.topicLabel}.
                                    {$language === 'fr' ? 'Citation' : 'Quote'} {quoteIndex + 1}:
                                </span>
                                <span class="resident-quote-number" aria-hidden="true">
                                    {String(quoteIndex + 1).padStart(2, "0")}
                                </span>
                                <span class="resident-quote">
                                    “{item.quote}”
                                </span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>
</section>

<EditorialMarkdown
    source={$language === 'fr' ? editorialContentFr : editorialContent}
    section="post-occupancy"
/>

<style>
    .story {
        position: relative;
        overflow: clip;
        background: #111;
    }

    .case-study-index-shell {
        width: min(100%, 80rem);
        margin: 2rem auto 0;
        padding-inline: 1.5rem;
        overflow-x: auto;
        scrollbar-width: thin;
        scrollbar-color: #aaa transparent;
    }

    .case-study-index {
        display: grid;
        min-width: 56rem;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 1px;
        padding: 1px;
        background: #d6d6d2;
    }

    .case-study-region-label {
        display: flex;
        min-height: 2.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.55rem 0.35rem;
        background: #fff;
        color: #262626;
        font-size: 0.78rem;
        font-weight: 650;
        line-height: 1.1;
        text-align: center;
    }

    .case-study-region-label--paris {
        grid-column: span 4;
    }

    .case-study-case-button {
        display: grid;
        min-width: 0;
        grid-template-rows: auto 1fr;
        border: 0;
        border-radius: 0;
        padding: 0;
        background: #fff;
        color: #3f3f3f;
        font: inherit;
        cursor: pointer;
        transition:
            background-color 140ms ease,
            box-shadow 140ms ease;
    }

    .case-study-case-button:hover {
        background: #f1f1ef;
    }

    .case-study-case-button:focus-visible {
        position: relative;
        z-index: 2;
        outline: 2px solid #d97f18;
        outline-offset: -2px;
    }

    .case-study-case-button--active {
        position: relative;
        z-index: 1;
        color: #111;
        box-shadow: inset 0 0 0 1px #6f6f6a;
    }

    .case-study-thumbnail {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 2;
        overflow: hidden;
        background: #ededeb;
    }

    .case-study-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .case-study-case-label {
        display: flex;
        min-height: 3.1rem;
        align-items: center;
        justify-content: center;
        border-top: 1px solid #d6d6d2;
        padding: 0.65rem 0.45rem 0.75rem;
        font-size: clamp(0.67rem, 0.82vw, 0.8rem);
        font-weight: 500;
        line-height: 1.15;
        text-align: center;
        text-wrap: balance;
    }

    .case-study-case-button--active .case-study-case-label {
        background: #ececea;
        font-weight: 750;
    }

    .case-study-compact-anchor {
        position: sticky;
        top: 4.0625rem;
        z-index: 100;
        height: 0;
        width: 100%;
        pointer-events: none;
    }

    .case-study-compact-index {
        position: relative;
        top: clamp(1rem, 2vw, 1.5rem);
        width: fit-content;
        margin-left: clamp(1rem, 2vw, 1.5rem);
        animation: case-study-index-enter 160ms ease-out;
        pointer-events: auto;
    }

    @keyframes case-study-index-enter {
        from {
            opacity: 0;
            transform: translateY(-0.35rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
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

    .story-card--last {
        flex-direction: column;
        background: #fff;
    }

    .story-card--last .story-image {
        order: 2;
        flex: 1 1 0;
        min-height: 0;
        box-sizing: border-box;
        padding: clamp(1rem, 2vw, 1.5rem);
        object-fit: contain;
    }

    .story-card--last .story-caption {
        position: relative;
        order: 1;
        top: auto;
        right: auto;
        align-self: flex-end;
        flex: 0 0 auto;
        margin: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2vw, 1.5rem) 0;
    }

    .story-caption {
        --caption-edge-inset: clamp(1rem, 2vw, 1.5rem);
        position: absolute;
        z-index: 2;
        width: min(28rem, calc(100% - 2rem));
        margin: 0;
        border: 0;
        border-radius: 0;
        padding: clamp(0.9rem, 1.6vw, 1.25rem)
            clamp(1rem, 1.9vw, 1.5rem);
        background: rgb(255 255 255 / 88%);
        color: #0a0a0a;
        font-family: inherit;
        font-size: clamp(0.875rem, 1.15vw, 1.075rem);
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 1.4;
        text-align: left;
        transition:
            inset 180ms ease,
            transform 180ms ease;
    }

    .story-caption--top-left {
        top: var(--caption-edge-inset);
        left: var(--caption-edge-inset);
    }

    .story-caption--top-center {
        top: var(--caption-edge-inset);
        left: 50%;
        transform: translateX(-50%);
    }

    .story-caption--top-right {
        top: var(--caption-edge-inset);
        right: var(--caption-edge-inset);
    }

    .story-caption--center-left {
        top: 50%;
        left: var(--caption-edge-inset);
        transform: translateY(-50%);
    }

    .story-caption--center-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .story-caption--center-right {
        top: 50%;
        right: var(--caption-edge-inset);
        transform: translateY(-50%);
    }

    .story-caption--bottom-left {
        bottom: var(--caption-edge-inset);
        left: var(--caption-edge-inset);
    }

    .story-caption--bottom-center {
        bottom: var(--caption-edge-inset);
        left: 50%;
        transform: translateX(-50%);
    }

    .story-caption--bottom-right {
        right: var(--caption-edge-inset);
        bottom: var(--caption-edge-inset);
    }

    .caption-debug-grid {
        position: absolute;
        z-index: 2;
        inset: 0;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: repeat(3, minmax(0, 1fr));
        pointer-events: none;
    }

    .caption-debug-grid > span {
        border: 1px dashed rgb(255 255 255 / 68%);
    }

    .story-caption--debug {
        z-index: 3;
        outline: 2px solid #f3a712;
        outline-offset: 2px;
        cursor: grab;
        touch-action: none;
        user-select: none;
    }

    .story-caption--dragging {
        cursor: grabbing;
        transition: none;
    }

    .caption-debug-toolbar {
        position: fixed;
        z-index: 10000;
        right: 1rem;
        bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border: 1px solid #111;
        padding: 0.4rem;
        background: rgb(255 255 255 / 96%);
        color: #111;
        font-size: 0.75rem;
    }

    .caption-debug-toolbar button {
        border: 1px solid #111;
        border-radius: 0;
        padding: 0.42rem 0.65rem;
        background: #111;
        color: #fff;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }

    .caption-debug-toolbar button:disabled {
        cursor: default;
        opacity: 0.38;
    }

    .caption-debug-toolbar button:focus-visible {
        outline: 2px solid #d97f18;
        outline-offset: 2px;
    }

    .caption-debug-toolbar output {
        color: #246b52;
        font-weight: 700;
    }

    .resident-voices {
        height: calc(100svh - 4.0625rem);
        overflow: hidden;
        background: #fff;
        color: #111;
    }

    .resident-voices-inner {
        width: min(86rem, calc(100% - 3rem));
        height: 100%;
        margin-inline: auto;
        padding: clamp(2rem, 4vh, 2.75rem) 0 clamp(0.75rem, 2vh, 1.25rem);
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        gap: clamp(0.55rem, 1.5vh, 0.9rem);
    }

    .resident-voices-inner > h2 {
        max-width: 48rem;
        margin: 0;
        font-size: clamp(1.55rem, 2.6vw, 2rem);
        line-height: 1.05;
    }

    .resident-sankey {
        position: relative;
        min-height: 0;
        overflow: hidden;
    }

    .resident-sankey-body {
        position: absolute;
        inset: 0;
        min-height: 0;
    }

    .resident-sankey-links {
        position: absolute;
        z-index: 1;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
    }

    .resident-sankey-link {
        fill: none;
        stroke-width: 2.25;
        opacity: 0.18;
        transition:
            opacity 160ms ease,
            stroke-width 160ms ease;
    }

    .resident-sankey-link--matched {
        stroke-width: 3.5;
        opacity: 0.78;
    }

    .resident-sankey-link--muted {
        opacity: 0.012;
    }

    .resident-sankey-node {
        opacity: 0.72;
        transition: opacity 160ms ease;
    }

    .resident-sankey-node--matched {
        opacity: 1;
    }

    .resident-sankey-node--muted {
        opacity: 0.08;
    }

    .resident-sankey-topics {
        position: absolute;
        z-index: 3;
        inset: 0 79% 0 0;
        pointer-events: none;
    }

    .resident-topic-button {
        position: absolute;
        left: 0;
        display: grid;
        width: 100%;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 0.5rem;
        align-items: center;
        transform: translateY(-50%);
        border: 0;
        border-left: 3px solid transparent;
        border-radius: 0;
        padding: 0.3rem 0.3rem 0.34rem 0.55rem;
        background: transparent;
        color: #5f5f5f;
        font: inherit;
        font-size: clamp(0.58rem, 0.9vw, 0.78rem);
        font-weight: 600;
        line-height: 1.18;
        text-align: left;
        cursor: pointer;
        pointer-events: auto;
        transition:
            background-color 180ms ease,
            border-color 180ms ease,
            color 180ms ease;
    }

    .resident-topic-button:hover,
    .resident-topic-button--active {
        border-left-color: var(--topic-color);
        background: color-mix(in srgb, var(--topic-color) 8%, white);
        color: #111;
    }

    .resident-topic-button:focus-visible {
        outline: 2px solid var(--topic-color);
        outline-offset: 2px;
    }

    .resident-quote-number {
        color: #777;
        font-size: clamp(0.48rem, 0.58vw, 0.6rem);
        font-variant-numeric: tabular-nums;
        font-weight: 600;
        letter-spacing: 0.04em;
        line-height: 1.15;
    }

    .resident-sankey-quotes {
        position: absolute;
        z-index: 3;
        inset: 0 0 0 51.5%;
        display: flex;
        min-height: 0;
        flex-direction: column;
        justify-content: space-between;
    }

    .resident-quote-item {
        display: grid;
        width: 100%;
        grid-template-columns: 1.35rem minmax(0, 1fr);
        gap: 0.35rem;
        align-items: start;
        border: 0;
        border-radius: 0;
        padding: 0.08rem 0.25rem;
        background: transparent;
        font: inherit;
        text-align: left;
        cursor: pointer;
        transition:
            background-color 180ms ease,
            opacity 180ms ease;
    }

    .resident-quote-item:hover,
    .resident-quote-item--matched {
        background: color-mix(in srgb, var(--topic-color) 9%, white);
    }

    .resident-quote-item--muted {
        opacity: 0.12;
    }

    .resident-quote-item:focus-visible {
        outline: 2px solid var(--topic-color);
        outline-offset: 1px;
    }

    .resident-quote-number {
        padding-top: 0.08rem;
        color: var(--topic-color);
    }

    .resident-quote {
        color: #202020;
        font-family: inherit;
        font-size: clamp(0.54rem, 0.78vw, 0.72rem);
        font-weight: 400;
        letter-spacing: -0.01em;
        line-height: 1.14;
        text-wrap: pretty;
    }

    @media (max-width: 720px) {
        .resident-voices-inner {
            width: calc(100% - 1.5rem);
        }

        .resident-voices-inner > h2 {
            font-size: clamp(1.2rem, 5vw, 1.55rem);
        }

        .resident-topic-button {
            font-size: clamp(0.46rem, 1.8vw, 0.6rem);
            line-height: 1.08;
        }

        .resident-quote {
            font-size: clamp(0.4rem, 1.55vw, 0.52rem);
            line-height: 1.06;
        }

        .resident-quote-item {
            grid-template-columns: 0.85rem minmax(0, 1fr);
            gap: 0.15rem;
            padding-block: 0.03rem;
        }

        .resident-quote-number {
            font-size: 0.42rem;
        }
    }

    @media (max-width: 640px) {
        .case-study-index-shell {
            padding-inline: 0.75rem;
        }

        .case-study-index {
            min-width: 49rem;
        }

        .case-study-compact-index {
            position: fixed;
            top: auto;
            bottom: max(0.75rem, env(safe-area-inset-bottom));
            left: 50%;
            margin-left: 0;
            transform: translateX(-50%);
            animation: none;
        }

        .story-caption {
            width: calc(100% - 1.5rem);
        }

        .story-caption--bottom-left,
        .story-caption--bottom-center,
        .story-caption--bottom-right {
            bottom: calc(var(--caption-edge-inset) + 3.25rem);
        }

    }

    @media (prefers-reduced-motion: reduce) {
        .case-study-compact-index,
        .story-card,
        .resident-topic-button,
        .resident-quote-item,
        .resident-sankey-link,
        .resident-sankey-node {
            transition-duration: 1ms;
        }
    }
</style>
