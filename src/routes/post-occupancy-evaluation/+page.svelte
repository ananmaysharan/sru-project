<script lang="ts">
    import AutoCarousel from "$lib/components/gallery/AutoCarousel.svelte";

    const LOREM =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

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
            ].map((id) => ({
                src: `/images/optimized/project-1/${id}-full.webp`,
                alt: "Samaritaine",
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
            ].map((id) => ({
                src: `/images/optimized/project-2/${id}-full.webp`,
                alt: "Maréchal Fayolle",
            })),
        },
        {
            label: "Rue Jean-Bart",
            images: ["paris-01", "DSC01781", "DSC01783"].map((id) => ({
                src: `/images/optimized/project-3/${id}-full.webp`,
                alt: "Rue Jean-Bart",
            })),
        },
        {
            label: "Tour BLP",
            images: [
                "7685ce4e-bef7-419c-8d9e-68536a49e292",
                "cd3ed7fa-1ded-4c80-b2a8-21da3751b6d1",
                "laguiole-280",
                "laguiole-291",
                "laguiole-297",
            ].map((id) => ({
                src: `/images/optimized/project-4/${id}-full.webp`,
                alt: "Tour BLP",
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
        "Brittany",
        "French Riviera",
        "Overseas Territories",
    ];
</script>

<section id="socio-econometrics" class="py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl font-bold">Post Occupancy Evaluation</h2>
        <p class="mt-2 text-lg text-gray-600">
            A zoom on four case studies, from Paris to Brittany, the French
            Riviera to the overseas territories
        </p>
    </div>

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

    <div
        id={slug("Paris")}
        class="max-w-3xl mx-auto mt-12 px-4 sm:px-6 scroll-mt-24"
    >
        <h1 class="text-4xl font-bold">Paris</h1>
    </div>
    <div class="mt-6 space-y-12">
        {#each parisProjects as project (project.label)}
            <div class="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 class="text-2xl font-bold mb-4">{project.label}</h2>
                <AutoCarousel images={project.images} />
                <p class="mt-4 text-gray-700">{LOREM}</p>
            </div>
        {/each}
    </div>

    <div
        id={slug("Brittany")}
        class="max-w-3xl mx-auto mt-16 px-4 sm:px-6 scroll-mt-24"
    >
        <h1 class="text-4xl font-bold">Brittany</h1>
        <div class="mt-6">
            <AutoCarousel images={brittanyImages} />
        </div>
        <p class="mt-4 text-gray-700">{LOREM}</p>
    </div>

    <div
        id={slug("French Riviera")}
        class="max-w-3xl mx-auto mt-16 px-4 sm:px-6 scroll-mt-24"
    >
        <h1 class="text-4xl font-bold">French Riviera</h1>
        <p class="mt-4 text-gray-700">{LOREM}</p>
    </div>

    <div
        id={slug("Overseas Territories")}
        class="max-w-3xl mx-auto mt-16 px-4 sm:px-6 scroll-mt-24"
    >
        <h1 class="text-4xl font-bold">Overseas Territories</h1>
        <p class="mt-4 text-gray-700">{LOREM}</p>
    </div>
</section>
