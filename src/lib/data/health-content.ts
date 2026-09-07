import type {Language} from '$lib/i18n';

export type HealthPageText = {
    title: string;
    deck: string;
    intro: string;
    cornerTitle: string;
    chartTitle: string;
    chartBody: string;
    definitions: string;
};

export type HealthMetricDefinition = {
    id: string;
    label: string;
    description: string;
};

export const localHealthText: Record<Language, HealthPageText> = {
    fr: {
        title: 'Indicateurs de santé',
        deck: 'Une analyse intra-urbaine de la mixité sociale et de l’amélioration de la qualité de vie',
        intro: 'Au cours des vingt-cinq dernières années, les politiques favorisant l’« accès aux opportunités » et la déconcentration de la pauvreté se sont accompagnées d’améliorations mesurables en matière de santé. Selon la littérature, à mesure que les ménages à faibles revenus accèderaient à des quartiers plus mixtes, bénéficiant d’une meilleure qualité de l’air, de rues plus sûres, de davantage d’espaces verts et de services locaux plus performants, les taux de maladies chroniques, de troubles liés au stress et de mortalité prématurée auraient tendance à diminuer. Ces tendances suggèrent que les efforts de mixité sociale ne constituent pas seulement un outil en matière de logement ou d’aménagement urbain, mais aussi une intervention de santé publique susceptible de réduire progressivement de profondes inégalités de santé.',
        cornerTitle: 'Où le logement social s’est-il développé depuis le début des années 2000 : dans les territoires bien équipés ou sous-équipés ?',
        chartTitle: 'Croissance du logement social et indicateurs de santé',
        chartBody: 'Ce graphique montre dans quelle mesure chaque commune a développé son parc de logements sociaux, au regard des conditions de vie qu’elle offre à ses habitants. Chaque point représente une commune. L’axe horizontal indique l’évolution cumulée de la part de logements sociaux entre 2005 et 2022, tandis que l’axe vertical représente soit l’indice pondéré de santé et d’aménités, soit l’un des indicateurs sélectionnés. Utilisez le menu pour sélectionner un indicateur, la barre de recherche pour trouver une commune donnée et la légende des régions pour filtrer le nuage de points.',
        definitions: 'Interprétation des principaux indicateurs de santé',
    },
    en: {
        title: 'Health Outcomes',
        deck: 'An intra-urban analysis of desegregation and improved quality of life',
        intro: 'Over the past 25 years, policies that promote “moving to opportunity” and the de-concentration of poverty have been accompanied by measurable improvements in health. As low-income households gain access to less segregated neighborhoods, with better air quality, safer streets, more green space, and stronger local services, rates of chronic illness, stress-related conditions, and premature mortality tend to decline. These trends suggest that spatial desegregation is not only a housing or urban-planning achievement, but a public-health intervention that can gradually narrow long-standing health inequalities.',
        cornerTitle: 'Where did social housing grow since the early 2000s—amenity-rich vs. amenity-poor areas?',
        chartTitle: 'Social housing growth and health outcomes',
        chartBody: 'This chart shows how much each commune expanded its social housing stock in relation to the living conditions it offers residents. Each point represents a commune. Use the menu to select an outcome, the search field to find a commune, and the regional legend to filter the cloud.',
        definitions: 'Explanation of key health outcomes',
    },
};

export const localHealthMetricDefinitions: Record<Language, HealthMetricDefinition[]> = {
    en: [
        {
            id: 'social-housing-change',
            label: 'Change in social housing share',
            description: 'Change in the share of social housing at the commune (municipality) level over the study period, measured in percentage points. We group communes into three equal categories (“terciles”): 1 = lowest growth in social housing, 3 = highest growth. This captures how actively each commune expanded its social housing stock.',
        },
        {
            id: 'income',
            label: 'Median household income',
            description: 'Median annual household income (€/year) in each commune, taken from INSEE’s FiloSoFi tax records. This provides a snapshot of the typical economic resources available to residents.',
        },
        {
            id: 'poverty',
            label: 'Share of residents in poverty',
            description: 'Share of the population living on less than 60% of the national median income—Europe’s standard threshold for monetary poverty. Higher values indicate communes where a larger proportion of residents are in income poverty.',
        },
        {
            id: 'elders',
            label: 'Older adult share (65+)',
            description: 'Share of the population aged 65 and over at the commune level. This indicator helps identify places with more residents who are generally more vulnerable to housing conditions, energy insecurity, and extreme temperatures.',
        },
        {
            id: 'left',
            label: 'Municipal political leadership',
            description: 'Political orientation of the winning party or coalition in the most recent municipal election, coded as Left, Center, or Right. This gives a rough proxy for local political priorities that may shape housing policy and implementation of the SRU law.',
        },
        {
            id: 'dpe',
            label: 'DPE energy-efficient building share (A-C)',
            description: 'Share of residential buildings in each commune rated A, B, or C in France’s DPE (Diagnostic de performance énergétique) energy‑performance database. Higher values indicate a larger proportion of relatively energy‑efficient housing, with implications for both emissions and indoor comfort.',
        },
        {
            id: 'heat',
            label: 'Urban heat island exposure',
            description: 'Share of the commune’s surface area classified as an urban heat island in the MAPUCE 2017 dataset. We define heat‑island zones as areas where the temperature anomaly is more than 1 K (≈1°C) above the surrounding rural baseline—an indicator of residents’ exposure to urban overheating.',
        },
        {
            id: 'green',
            label: 'Proximity to green spaces',
            description: 'Measures the average distance or travel time from social housing to nearby public green areas (parks, gardens, forests, and other green spaces).',
        },
        {
            id: 'health',
            label: 'Proximity to healthcare and hospital infrastructure',
            description: 'Measures the average distance or travel time from social housing to nearby healthcare services, including clinics, hospitals, and emergency care facilities.',
        },
    ],
    fr: [
        {
            id: 'social-housing-change',
            label: 'Évolution de la part de logements sociaux',
            description: 'Évolution de la part de logements sociaux à l’échelle de la commune au cours de la période étudiée, mesurée en points de pourcentage. Nous répartissons les communes en trois catégories de taille égale (« terciles ») : 1 = plus faible croissance du parc social, 3 = plus forte croissance. Cet indicateur mesure l’intensité avec laquelle chaque commune a développé son parc de logements sociaux.',
        },
        {
            id: 'income',
            label: 'Revenu médian des ménages',
            description: 'Revenu annuel médian des ménages (€/an) dans chaque commune, établi à partir des données fiscales Filosofi de l’INSEE. Cet indicateur fournit une estimation des ressources économiques typiquement disponibles pour les habitants.',
        },
        {
            id: 'poverty',
            label: 'Part des habitants vivant sous le seuil de pauvreté',
            description: 'Part de la population vivant avec moins de 60 % du revenu médian national, le seuil de pauvreté de référence en Europe. Des valeurs élevées indiquent les communes où une plus grande proportion d’habitants se trouve en situation de pauvreté.',
        },
        {
            id: 'elders',
            label: 'Part des personnes âgées de 65 ans ou plus',
            description: 'Part de la population âgée de 65 ans ou plus à l’échelle de la commune. Cet indicateur permet d’identifier les territoires comptant davantage d’habitants généralement plus vulnérables aux conditions de logement, à la précarité énergétique et aux températures extrêmes.',
        },
        {
            id: 'left',
            label: 'Orientation politique de l’exécutif municipal',
            description: 'Orientation politique du parti ou de la coalition arrivé en tête lors des dernières élections municipales, classée selon trois catégories : gauche, centre ou droite. Cet indicateur fournit une approximation des priorités politiques locales susceptibles d’influencer la politique du logement et la mise en œuvre de la loi SRU.',
        },
        {
            id: 'dpe',
            label: 'Part des bâtiments énergétiquement performants selon le DPE (A–C)',
            description: 'Part des bâtiments résidentiels de chaque commune classés A, B ou C dans la base de données française sur la performance énergétique des logements, fondée sur le DPE, ou diagnostic de performance énergétique. Des valeurs élevées indiquent une proportion plus importante de logements relativement performants sur le plan énergétique, avec des conséquences à la fois sur les émissions et sur le confort intérieur.',
        },
        {
            id: 'heat',
            label: 'Exposition aux îlots de chaleur urbains',
            description: 'Part de la superficie de la commune classée comme îlot de chaleur urbain dans le jeu de données MAPUCE 2017. Nous définissons les zones d’îlot de chaleur comme les secteurs où l’anomalie de température dépasse de 1 K, soit environ 1 °C, la référence rurale environnante, ce qui constitue un indicateur de l’exposition des habitants au stress thermique urbain.',
        },
        {
            id: 'green',
            label: 'Proximité des espaces verts',
            description: 'Mesure la distance moyenne ou le temps de trajet moyen entre les logements sociaux et les espaces verts publics à proximité (parcs, jardins, forêts et autres espaces végétalisés).',
        },
        {
            id: 'health',
            label: 'Proximité des services de santé et des établissements hospitaliers',
            description: 'Mesure la distance moyenne ou le temps de trajet moyen entre les logements sociaux et les services de santé à proximité, notamment les centres de santé, les hôpitaux et les centres de soins d’urgence.',
        },
    ],
};
