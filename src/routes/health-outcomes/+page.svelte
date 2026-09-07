<script lang="ts">
    import HealthMap from "$lib/components/maps/health-map/HealthMap.svelte";
    import CommuneHealthIndexScatter from "$lib/components/charts/CommuneHealthIndexScatter.svelte";
    import HealthHousingMatrix from "$lib/components/charts/HealthHousingMatrix.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import { MapState } from "$lib/components/maps/health-map/map-state.svelte.js";
    import { language } from "$lib/i18n";
    import type {PageData} from './$types';

    let {data}: {data: PageData} = $props();
    const cornerMapState = new MapState({ cornerMode: true });
    const text = $derived(data.content.text[$language]);
    const metricDefinitions = $derived(data.content.metricDefinitions[$language]);
</script>

<section id="demographics" class="page-shell" lang={$language}>
    <div class="prose-column">
        <h1 class="page-title">{text.title}</h1>
        <p class="page-deck">{text.deck}</p>
        <p class="page-intro-body">{text.intro}</p>
    </div>

    <div class="wide-column visual-block map-frame">{#key $language}<HealthMap />{/key}</div>

    <div class="prose-column section-copy"><h2 class="section-title">{text.cornerTitle}</h2></div>
    <div class="wide-column visual-block map-frame">{#key $language}<HealthMap mapState={cornerMapState} />{/key}</div>

    <div class="prose-column section-copy">
        <h2 class="section-title">{text.chartTitle}</h2>
        <p class="section-body">{text.chartBody}</p>
    </div>
    <div class="wide-column visual-block"><CommuneHealthIndexScatter /></div>

    <div id="health-metric-definitions" class="wide-column section-copy scroll-mt-20 text-gray-700">
        <h2 class="section-title">{text.definitions}</h2>
        <dl class="mt-6 grid gap-px overflow-hidden border border-[#dadad7] bg-[#dadad7] md:grid-cols-2 lg:grid-cols-3">
            {#each metricDefinitions as metric (metric.id)}
                <div class="bg-white p-5 md:p-6">
                    <dt class="text-base font-bold leading-6 text-[#121212]">{metric.label}</dt>
                    <dd class="mt-2 text-sm leading-6">{metric.description}</dd>
                </div>
            {/each}
        </dl>
    </div>

    <div class="wide-column section-copy"><HealthHousingMatrix /></div>

    <EditorialMarkdown content={data.content.methods[$language]} section="health-method" compact />
</section>
