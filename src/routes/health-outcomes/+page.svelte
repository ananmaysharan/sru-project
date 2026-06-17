<script lang="ts">
    import HealthMap from "$lib/components/maps/health-map/HealthMap.svelte";
    import {
        METRIC_CONFIG,
        MapState,
    } from "$lib/components/maps/health-map/map-state.svelte.js";

    // Second map: same indicators, but only the two contrasting corner cells are
    // shown — C3 (high social-housing growth + amenity-rich) in dark blue and
    // A3 (high social-housing growth + lower-amenity) in red.
    const cornerMapState = new MapState({ cornerMode: true });
</script>

<section id="demographics" class="py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl font-bold">The Health Outcomes</h2>
        <p class="mt-2 text-lg text-gray-600">
            An intra-urban analysis of desegregation and improved quality of
            life
        </p>
        <p class="mt-4 text-gray-700">
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
    <div class="max-w-7xl mx-auto h-[70vh] min-h-96 md:h-175 mt-8 px-4 sm:px-6">
        <HealthMap />
    </div>

    <div class="max-w-3xl mx-auto mt-16 px-4 sm:px-6">
        <h3 class="text-2xl font-bold">
            Where did social housing grow — amenity-rich vs. lower-amenity
            areas?
        </h3>
    </div>
    <div class="max-w-7xl mx-auto h-[70vh] min-h-96 md:h-175 mt-8 px-4 sm:px-6">
        <HealthMap mapState={cornerMapState} />
    </div>

    <div class="max-w-3xl mx-auto mt-10 px-4 sm:px-6 space-y-4 text-gray-700">
        <h3 class="text-xl font-bold">
            Explanation of key health outcome metrics:
        </h3>

        <p>
            <strong>Change in social housing share</strong> Change in the share of
            social housing at the commune (municipality) level over the study period,
            measured in percentage points. We group communes into three equal categories
            (“terciles”): 1 = lowest growth in social housing, 3 = highest growth.
            This captures how actively each commune expanded its social housing stock.
        </p>

        <p>
            <strong>{METRIC_CONFIG.income.label}</strong>
            {METRIC_CONFIG.income.description}
        </p>
        <p>
            <strong>{METRIC_CONFIG.poverty.label}</strong>
            {METRIC_CONFIG.poverty.description}
        </p>
        <p>
            <strong>{METRIC_CONFIG.elders.label}</strong>
            {METRIC_CONFIG.elders.description}
        </p>
        <p>
            <strong>{METRIC_CONFIG.left.label}</strong>
            {METRIC_CONFIG.left.description}
        </p>
        <p>
            <strong>{METRIC_CONFIG.dpe.label}</strong>
            {METRIC_CONFIG.dpe.description}
        </p>
        <p>
            <strong>{METRIC_CONFIG.heat.label}</strong>
            {METRIC_CONFIG.heat.description}
        </p>
    </div>
</section>
