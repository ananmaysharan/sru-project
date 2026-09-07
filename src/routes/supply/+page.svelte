<script lang="ts">
    import Map from "$lib/components/maps/main-map/Map.svelte";
    import ResidencesStackedChart from "$lib/components/charts/ResidencesStackedChart.svelte";
    import SupplyPieChart from "$lib/components/charts/SupplyPieChart.svelte";
    import SupplyRegionalChart from "$lib/components/charts/SupplyRegionalChart.svelte";
    import DromComAtlas from "$lib/components/charts/DromComAtlas.svelte";
    import EuropeanAtlas from "$lib/components/charts/EuropeanAtlas.svelte";
    import NationalHousingStockChart from "$lib/components/charts/NationalHousingStockChart.svelte";
    import NonComplianceChart from "$lib/components/charts/NonComplianceChart.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import { language } from "$lib/i18n";
    import type {PageData} from './$types';

    let {data}: {data: PageData} = $props();
    const text = $derived(data.content.text[$language]);
</script>

<section id="supply" class="page-shell" lang={$language}>
    <div class="prose-column">
        <h1 class="page-title">{text.title}</h1>
        <p class="page-deck">{text.deck}</p>
        <p class="page-intro-body">{text.intro}</p>
    </div>

    <div class="wide-column visual-grid">
        <article class="visual-card">
            <h3 class="visual-title">{text.nationalTitle}</h3>
            <p class="visual-caption">{text.source}</p>
            <div class="chart-frame">{#key $language}<NationalHousingStockChart />{/key}</div>
        </article>
        <article class="visual-card">
            <h3 class="visual-title">{text.tenureTitle}</h3>
            <p class="visual-caption">{text.tenureCaption}</p>
            <div class="chart-frame">{#key $language}<ResidencesStackedChart />{/key}</div>
        </article>
    </div>

    <div class="prose-column section-copy">
        <h2 class="section-title">{text.regionalTitle}</h2>
        <p class="section-body">{text.regionalBody}</p>
    </div>
    <div class="wide-column visual-grid">
        <article class="visual-card">
            <h3 class="visual-title">{text.distributionTitle}</h3>
            <p class="visual-caption">{text.distributionCaption}</p>
            <div class="chart-frame">{#key $language}<SupplyPieChart />{/key}</div>
        </article>
        <article class="visual-card">
            <h3 class="visual-title">{text.rateTitle}</h3>
            <p class="visual-caption">{text.rateCaption}</p>
            <div class="chart-frame">{#key $language}<SupplyRegionalChart />{/key}</div>
        </article>
    </div>

    <div class="prose-column section-copy">
        <h2 class="section-title">{text.mapTitle}</h2>
        <p class="section-body">{text.mapBody}</p>
    </div>
    <div class="wide-column visual-block"><div class="map-frame">{#key $language}<Map />{/key}</div></div>

    <div class="prose-column section-copy">
        <h2 class="section-title">{text.noncomplianceTitle}</h2>
        <p class="section-deck">{text.noncomplianceDeck}</p>
        <p class="section-body">{text.noncomplianceBody}</p>
    </div>
    <NonComplianceChart />

    <div class="prose-column section-copy">
        <h2 class="section-title">{text.overseasTitle}</h2>
        <p class="section-body">{text.overseasBody}</p>
    </div>
    <div class="wide-column atlas-block"><DromComAtlas /></div>

    <div class="prose-column section-copy">
        <h2 class="section-title">{text.europeTitle}</h2>
        <p class="section-body">{text.europeBody}</p>
    </div>
    <div class="wide-column atlas-block"><EuropeanAtlas /></div>

    <EditorialMarkdown content={data.content.methods[$language]} section="supply" />
</section>
