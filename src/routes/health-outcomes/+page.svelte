<script lang="ts">
    import HealthMap from "$lib/components/maps/health-map/HealthMap.svelte";
    import CommuneHealthIndexScatter from "$lib/components/charts/CommuneHealthIndexScatter.svelte";
    import HealthHousingMatrix from "$lib/components/charts/HealthHousingMatrix.svelte";
    import EditorialMarkdown from "$lib/components/sections/EditorialMarkdown.svelte";
    import editorialContent from "$lib/data/editorial-content.md?raw";
    import editorialContentFr from "$lib/data/editorial-content.fr.md?raw";
    import { METRIC_CONFIG, MapState } from "$lib/components/maps/health-map/map-state.svelte.js";
    import { language } from "$lib/i18n";

    const cornerMapState = new MapState({ cornerMode: true });

    const metricDefinitionsEn = [
        {
            label: "Change in social housing share",
            description: "Change in the share of social housing at the commune (municipality) level over the study period, measured in percentage points. We group communes into three equal categories (“terciles”): 1 = lowest growth in social housing, 3 = highest growth. This captures how actively each commune expanded its social housing stock.",
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

    const metricDefinitionsFr = [
        { label: "Évolution de la part de logements sociaux", description: "Évolution de la part de logements sociaux à l’échelle de la commune au cours de la période étudiée, mesurée en points de pourcentage. Nous répartissons les communes en trois catégories de taille égale (« terciles ») : 1 = plus faible croissance du parc social, 3 = plus forte croissance. Cet indicateur mesure l’intensité avec laquelle chaque commune a développé son parc de logements sociaux." },
        { label: "Revenu médian des ménages", description: "Revenu annuel médian des ménages (€/an) dans chaque commune, établi à partir des données fiscales Filosofi de l’INSEE. Cet indicateur fournit une estimation des ressources économiques typiquement disponibles pour les habitants." },
        { label: "Part des habitants vivant sous le seuil de pauvreté", description: "Part de la population vivant avec moins de 60 % du revenu médian national, le seuil de pauvreté de référence en Europe. Des valeurs élevées indiquent les communes où une plus grande proportion d’habitants se trouve en situation de pauvreté." },
        { label: "Part des personnes âgées de 65 ans ou plus", description: "Part de la population âgée de 65 ans ou plus à l’échelle de la commune. Cet indicateur permet d’identifier les territoires comptant davantage d’habitants généralement plus vulnérables aux conditions de logement, à la précarité énergétique et aux températures extrêmes." },
        { label: "Orientation politique de l’exécutif municipal", description: "Orientation politique du parti ou de la coalition arrivé en tête lors des dernières élections municipales, classée selon trois catégories : gauche, centre ou droite. Cet indicateur fournit une approximation des priorités politiques locales susceptibles d’influencer la politique du logement et la mise en œuvre de la loi SRU." },
        { label: "Part des bâtiments énergétiquement performants selon le DPE (A–C)", description: "Part des bâtiments résidentiels de chaque commune classés A, B ou C dans la base de données française sur la performance énergétique des logements, fondée sur le DPE, ou diagnostic de performance énergétique. Des valeurs élevées indiquent une proportion plus importante de logements relativement performants sur le plan énergétique, avec des conséquences à la fois sur les émissions et sur le confort intérieur." },
        { label: "Exposition aux îlots de chaleur urbains", description: "Part de la superficie de la commune classée comme îlot de chaleur urbain dans le jeu de données MAPUCE 2017. Nous définissons les zones d’îlot de chaleur comme les secteurs où l’anomalie de température dépasse de 1 K, soit environ 1 °C, la référence rurale environnante, ce qui constitue un indicateur de l’exposition des habitants au stress thermique urbain." },
        { label: "Proximité des espaces verts", description: "Mesure la distance moyenne ou le temps de trajet moyen entre les logements sociaux et les espaces verts publics à proximité (parcs, jardins, forêts et autres espaces végétalisés)." },
        { label: "Proximité des services de santé et des établissements hospitaliers", description: "Mesure la distance moyenne ou le temps de trajet moyen entre les logements sociaux et les services de santé à proximité, notamment les centres de santé, les hôpitaux et les centres de soins d’urgence." },
    ];

    const copy = {
        fr: {
            title: "Indicateurs de santé",
            deck: "Une analyse intra-urbaine de la mixité sociale et de l’amélioration de la qualité de vie",
            intro: "Au cours des vingt-cinq dernières années, les politiques favorisant l’« accès aux opportunités » et la déconcentration de la pauvreté se sont accompagnées d’améliorations mesurables en matière de santé. Selon la littérature, à mesure que les ménages à faibles revenus accèderaient à des quartiers plus mixtes, bénéficiant d’une meilleure qualité de l’air, de rues plus sûres, de davantage d’espaces verts et de services locaux plus performants, les taux de maladies chroniques, de troubles liés au stress et de mortalité prématurée auraient tendance à diminuer. Ces tendances suggèrent que les efforts de mixité sociale ne constituent pas seulement un outil en matière de logement ou d’aménagement urbain, mais aussi une intervention de santé publique susceptible de réduire progressivement de profondes inégalités de santé.",
            cornerTitle: "Où le logement social s’est-il développé depuis le début des années 2000 : dans les territoires bien équipés ou sous-équipés ?",
            chartTitle: "Croissance du logement social et indicateurs de santé",
            chartBody: "Ce graphique montre dans quelle mesure chaque commune a développé son parc de logements sociaux, au regard des conditions de vie qu’elle offre à ses habitants. Chaque point représente une commune. L’axe horizontal indique l’évolution cumulée de la part de logements sociaux entre 2005 et 2022, tandis que l’axe vertical représente soit l’indice pondéré de santé et d’aménités, soit l’un des indicateurs sélectionnés. Utilisez le menu pour sélectionner un indicateur, la barre de recherche pour trouver une commune donnée et la légende des régions pour filtrer le nuage de points.",
            definitions: "Interprétation des principaux indicateurs de santé",
        },
        en: {
            title: "Health Outcomes",
            deck: "An intra-urban analysis of desegregation and improved quality of life",
            intro: "Over the past 25 years, policies that promote “moving to opportunity” and the de-concentration of poverty have been accompanied by measurable improvements in health. As low-income households gain access to less segregated neighborhoods, with better air quality, safer streets, more green space, and stronger local services, rates of chronic illness, stress-related conditions, and premature mortality tend to decline. These trends suggest that spatial desegregation is not only a housing or urban-planning achievement, but a public-health intervention that can gradually narrow long-standing health inequalities.",
            cornerTitle: "Where did social housing grow since the early 2000s—amenity-rich vs. amenity-poor areas?",
            chartTitle: "Social housing growth and health outcomes",
            chartBody: "This chart shows how much each commune expanded its social housing stock in relation to the living conditions it offers residents. Each point represents a commune. Use the menu to select an outcome, the search field to find a commune, and the regional legend to filter the cloud.",
            definitions: "Explanation of key health outcomes",
        },
    };

    const text = $derived(copy[$language]);
    const metricDefinitions = $derived($language === 'fr' ? metricDefinitionsFr : metricDefinitionsEn);
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
            {#each metricDefinitions as metric (metric.label)}
                <div class="bg-white p-5 md:p-6">
                    <dt class="text-base font-bold leading-6 text-[#121212]">{metric.label}</dt>
                    <dd class="mt-2 text-sm leading-6">{metric.description}</dd>
                </div>
            {/each}
        </dl>
    </div>

    <div class="wide-column section-copy"><HealthHousingMatrix /></div>

    <EditorialMarkdown
        source={$language === 'fr' ? editorialContentFr : editorialContent}
        section="health-method"
        compact
    />
</section>
