<script lang="ts">
    import HealthMap from "$lib/components/maps/health-map/HealthMap.svelte";
    import CommuneHealthIndexScatter from "$lib/components/charts/CommuneHealthIndexScatter.svelte";
    import HealthHousingMatrix from "$lib/components/charts/HealthHousingMatrix.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import editorialContent from "$lib/data/editorial-content.md?raw";
    import {
        METRIC_CONFIG,
        MapState,
    } from "$lib/components/maps/health-map/map-state.svelte.js";

    // Second map: same indicators, but only the two contrasting corner cells are
    // shown — C3 (high social-housing growth + amenity-rich) in dark blue and
    // A3 (high social-housing growth + amenity-poor) in red.
    const cornerMapState = new MapState({ cornerMode: true });

    const metricDefinitions = [
        {
            label: "Change in social housing share",
            description:
                "Change in the share of social housing at the commune (municipality) level over the study period, measured in percentage points. We group communes into three equal categories (“terciles”): 1 = lowest growth in social housing, 3 = highest growth. This captures how actively each commune expanded its social housing stock.",
        },
        METRIC_CONFIG.income,
        METRIC_CONFIG.poverty,
        METRIC_CONFIG.elders,
        METRIC_CONFIG.left,
        METRIC_CONFIG.dpe,
        METRIC_CONFIG.heat,
        METRIC_CONFIG.green,
        METRIC_CONFIG.health,
    ];
</script>

<section id="demographics" class="page-shell">
    <div class="prose-column">
        <h1 class="page-title">The Health Outcomes</h1>
        <p class="page-deck">
            An intra-urban analysis of desegregation and improved quality of
            life
        </p>
        <p class="page-intro-body">
            Over the past 25 years, policies that promote “moving to
            opportunity” and the de-concentration of poverty have been
            accompanied by measurable improvements in health. As low‑income
            households gain access to less segregated neighborhoods, with better
            air quality, safer streets, more green space, and stronger local
            services, rates of chronic illness, stress‑related conditions, and
            premature mortality tend to decline. These trends suggest that
            spatial desegregation is not only a housing or urban‑planning
            achievement, but a public‑health intervention that can gradually
            narrow long‑standing health inequalities.
        </p>
    </div>

    <div class="wide-column visual-block map-frame">
        <HealthMap />
    </div>

    <div class="prose-column section-copy">
        <h2 class="section-title">
			Where did social housing grow since the early 2000s—amenity-rich
            vs. amenity-poor areas?
        </h2>
    </div>
    <div class="wide-column visual-block map-frame">
        <HealthMap mapState={cornerMapState} />
    </div>

    <div class="prose-column section-copy">
        <h2 class="section-title">
            Social housing growth and health outcomes
        </h2>
    </div>
    <EditorialMarkdown
        source={editorialContent}
        section="health-chart"
        compact
    />
    <div class="wide-column visual-block">
        <CommuneHealthIndexScatter />
    </div>

    <div
        id="health-metric-definitions"
        class="wide-column section-copy scroll-mt-20 text-gray-700"
    >
        <h2 class="section-title">Explanation of key health outcome metrics</h2>

        <dl
            class="mt-6 grid gap-px overflow-hidden border border-[#dadad7] bg-[#dadad7] md:grid-cols-2 lg:grid-cols-3"
        >
            {#each metricDefinitions as metric (metric.label)}
                <div class="bg-white p-5 md:p-6">
                    <dt class="text-base font-bold leading-6 text-[#121212]">
                        {metric.label}
                    </dt>
                    <dd class="mt-2 text-sm leading-6">
                        {metric.description}
                    </dd>
                </div>
            {/each}
        </dl>
    </div>

    <div class="wide-column section-copy">
        <HealthHousingMatrix />
    </div>

    <div class="prose-column section-copy">
        <h2 class="section-title">
            Looking at the SRU Law as a way to move to opportunity
        </h2>
    </div>

    <EditorialMarkdown
        source={editorialContent}
        section="health-method"
        compact
    />
</section>
