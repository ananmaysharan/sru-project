<script lang="ts">
    import Map from "$lib/components/maps/main-map/Map.svelte";
    import EuropeanMap from "$lib/components/maps/european-map/EuropeanMap.svelte";
    import ResidencesStackedChart from "$lib/components/charts/ResidencesStackedChart.svelte";
    import SupplyPieChart from "$lib/components/charts/SupplyPieChart.svelte";
    import SupplyRegionalChart from "$lib/components/charts/SupplyRegionalChart.svelte";
    import DromComAtlas from "$lib/components/charts/DromComAtlas.svelte";
    import EuropeanAtlas from "$lib/components/charts/EuropeanAtlas.svelte";
    import NationalHousingStockChart from "$lib/components/charts/NationalHousingStockChart.svelte";
    import NonComplianceChart from "$lib/components/charts/NonComplianceChart.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import editorialContent from "$lib/data/editorial-content.md?raw";
    import editorialContentFr from "$lib/data/editorial-content.fr.md?raw";
    import { language } from "$lib/i18n";

    const showOriginalEuropeanMap = false;

    const copy = {
        fr: {
            title: "Chiffres",
            deck: "Une hausse de la production, un rééquilibrage territorial",
            intro: "Au cours des deux dernières décennies, la France a régulièrement augmenté son parc de logements sociaux, mais cette croissance n’a pas été répartie de manière homogène sur l’ensemble du territoire. Les nouveaux logements se sont concentrés dans certaines régions et grandes agglomérations, tandis que de nombreuses communes aisées continuent de produire moins de logements sociaux qu’elles ne le devraient. Ces graphiques montrent à la fois l’augmentation globale de l’offre et la manière dont le territoire continue de déterminer qui peut accéder au parc HLM.",
            nationalTitle: "Évolution du parc national français de logements sociaux (1920–2022)",
            source: "Source : RPLS 2023",
            tenureTitle: "France : principaux statuts d’occupation des résidences principales (1984–2023)",
            tenureCaption: "Millions de résidences principales, selon le mode d’occupation",
            regionalTitle: "Répartition régionale",
            regionalBody: "L’analyse des données par région révèle de forts contrastes dans l’offre de logements sociaux. Certaines régions, souvent caractérisées par une longue tradition de logement social ou par de fortes difficultés d’accès au logement, concentrent une part importante du parc national. D’autres restent nettement en dessous des moyennes nationales, illustrant la manière dont les choix historiques d’aménagement, les politiques locales et les marchés fonciers déterminent les territoires où les ménages modestes peuvent concrètement se loger.",
            distributionTitle: "Répartition des logements sociaux (2022)",
            distributionCaption: "Cliquez sur une région pour afficher ses départements",
            rateTitle: "Logements sociaux pour 10 000 habitants (2023)",
            rateCaption: "Comparaison des taux régionaux",
            mapTitle: "Carte de l’offre",
            mapBody: "Cette carte interactive permet de zoomer progressivement, des régions aux départements puis aux communes, afin d’observer comment les objectifs de la loi SRU se traduisent concrètement sur le terrain. En activant ou en désactivant des variables telles que le taux SRU, les utilisateurs peuvent repérer les territoires qui dépassent les objectifs fixés par la loi, les atteignent ou en sont très éloignés. La carte permet de visualiser les inégalités territoriales d’accès au logement social à différentes échelles et au fil du temps.",
            noncomplianceTitle: "Non-respect des obligations (2005–2022)",
            noncomplianceDeck: "Quelles communes n’ont pas atteint leurs objectifs ?",
            noncomplianceBody: "Malgré l’augmentation globale du nombre de logements sociaux, beaucoup de communes persistent à rester en deçà des quotas de logements sociaux prévus par la loi SRU. Cette section suit, année après année, les communes officiellement déclarées carencées et donc soumises à des pénalités financières ou à un transfert temporaire à l’État du pouvoir de délivrer les permis de construire. Elle met en évidence la persistance des résistances locales et les limites des mécanismes de contrôle et de sanction.",
            overseasTitle: "Territoires ultramarins",
            overseasBody: "Dans les territoires ultramarins français (DROM), les dynamiques du logement social sont façonnées par une croissance démographique rapide, les héritages coloniaux et des niveaux élevés de pauvreté. Bien que certains territoires affichent des taux SRU officiellement élevés, les indicateurs quantitatifs masquent souvent une forte suroccupation des logements, la présence d’habitats informels et l’insuffisance des infrastructures. L’exemple des territoires ultramarins montre combien la question du logement recoupe des enjeux plus larges liés à l’accès au foncier, à l’environnement et aux services publics.",
            europeTitle: "Contexte européen",
            europeBody: "Comparer la France à ses voisins européens montre que les écosystèmes de production de logement social peuvent être structurés de manière très différente. Certains pays conçoivent le logement social comme un parc diversifié et accessible à tous, tandis que d’autres le réservent aux ménages les plus pauvres ou ont considérablement réduit leur parc social. La comparaison de ces modèles permet de replacer la loi SRU dans un débat plus large sur la manière dont les États utilisent les politiques du logement pour lutter contre les inégalités et la ségrégation socio-spatiale.",
        },
        en: {
            title: "The Numbers",
            deck: "An increase in production, a territorial rebalancing",
            intro: "Over the past two decades, France has steadily expanded its stock of social housing, but this growth has not been evenly shared across the country. New units have been concentrated in certain regions and large urban areas, while many affluent communes continue to under-produce. These charts show both the overall rise in supply and the ways in which territory still structures who gets access to HLM.",
            nationalTitle: "Evolution of national French social housing stock (1920–2022)",
            source: "Source: RPLS 2023",
            tenureTitle: "France: Main Type of Residences Occupied (1984–2023)",
            tenureCaption: "Millions of occupied residences, by tenure",
            regionalTitle: "Regional Breakdown",
            regionalBody: "Looking at the data by region reveals stark contrasts in social-housing provision. Some regions, often those with long-standing public-housing traditions or acute affordability pressures, host a large share of the national stock. Others remain well below national averages, illustrating how historical planning choices, local politics, and land markets shape where low-income households can realistically live.",
            distributionTitle: "Social Housing Unit Distribution (2022)",
            distributionCaption: "Click on a region to see its departments",
            rateTitle: "Social Housing Units per 10,000 Inhabitants (2023)",
            rateCaption: "Regional rate comparison",
            mapTitle: "Supply Map",
            mapBody: "This interactive map makes it possible to zoom in from regions to departments and communes to see how the SRU objectives translate on the ground. By toggling variables such as the SRU rate, users can identify territories that exceed, meet, or fall far short of the law’s targets. The map is a tool for visualizing spatial inequalities in access to social housing at multiple scales and over time.",
            noncomplianceTitle: "Non-Compliance (2005–2022)",
            noncomplianceDeck: "Which communes did not meet their objectives?",
            noncomplianceBody: "Despite the overall increase in social-housing units, many communes repeatedly fail to meet their legally required SRU quotas. This section tracks, year by year, which municipalities were officially declared non-compliant and thus subject to financial penalties or a temporary loss of control over building permits. It highlights the persistence of local resistance and the limits of enforcement mechanisms.",
            overseasTitle: "Overseas Territories",
            overseasBody: "In France’s overseas territories, the dynamics of social housing are shaped by rapid demographic growth, colonial legacies, and high levels of poverty. Although some territories display relatively high formal SRU rates, the quantitative indicators often mask severe overcrowding, informal settlements, and inadequate infrastructure. Focusing on the overseas territories shows how the housing question intersects with broader struggles over land, environment, and basic services.",
            europeTitle: "European Context",
            europeBody: "Placing France alongside its European neighbors underscores that social housing systems can be organized in very different ways. Some countries treat social housing as a large, universal sector, while others reserve it for the poorest households or have dramatically reduced their stock. Comparing these models helps situate the SRU law within a wider debate about how states use housing policy to regulate inequality and segregation.",
        },
    };

    const text = $derived(copy[$language]);
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
    {#if showOriginalEuropeanMap}
        <div class="wide-column visual-block"><div class="map-frame"><EuropeanMap /></div></div>
    {/if}
    <div class="wide-column atlas-block"><EuropeanAtlas /></div>

    <EditorialMarkdown source={$language === 'fr' ? editorialContentFr : editorialContent} section="supply" />
</section>
