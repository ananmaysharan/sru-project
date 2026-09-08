import type {Language} from '$lib/i18n';
import type {EditorialStory} from '$lib/utils/editorial-markdown';

export type IntroductionPageText = {
    heroTitle: string;
    byline: string;
    supportersTitle: string;
    storyHousingTitle: string;
    storyHousingBody: string;
    storyNewsTitle: string;
    storyNewsBody: string;
};

export const localIntroductionText: Record<Language, IntroductionPageText> = {
    fr: {
        heroTitle: 'La Loi SRU : bilan après 25 ans',
        byline: 'Magda Maaoui',
        supportersTitle: 'Avec le soutien de',
        storyHousingTitle: '25 ans de rééquilibrage de l’offre de logements sociaux',
        storyHousingBody: 'L’offre de logements sociaux en France a connu une croissance régulière entre 2000 et 2025, la production de nouveaux logements ayant atteint un niveau historiquement élevé (plus de 80 000 logements par an) pour la première fois depuis les années 1970. Les projets réalisés dans les différentes régions françaises se sont révélés variés par leur architecture, leur taille et leur localisation.',
        storyNewsTitle: 'À la une',
        storyNewsBody: 'Ensemble, ces titres de presse retracent la manière dont, au fil des années, la loi SRU a poursuivi sa mission en tant qu’instrument de lutte contre l’apartheid territorial et social. En parallèle, nombreux sont les acteurs locaux et nationaux qui cherchent régulièrement à affaiblir ou à contourner ses obligations en matière de logements sociaux, au moyen de réductions budgétaires, de recours juridiques, de stratégies de contournement mises en œuvre par les maires et de mobilisations de riverains opposés à la construction de nouveaux logements sociaux, en particulier dans les communes et quartiers les plus aisés.',
    },
    en: {
        heroTitle: 'The Loi SRU French social housing program, 25 years later',
        byline: 'Magda Maaoui',
        supportersTitle: 'Supported by',
        storyHousingTitle: '25 years of fair-share housing provision',
        storyHousingBody: "France's social housing has grown steadily between 2000-2025 with delivery of new units reaching a historic peak of over 80,000 per year for the first time since the 1970s. Projects built across France's regions have proven to be diverse in design, size, and location.",
        storyNewsTitle: 'In the news',
        storyNewsBody: 'Together, these media headlines trace how, over the years, the SRU law has been formally upheld as an instrument against territorial and social apartheid, even as local and national actors repeatedly seek to weaken or bypass its social-housing obligations, through budget cuts, legal challenges, strategic avoidance by mayors, and mobilized resident opposition to new social housing construction, particularly in wealthier communities.',
    },
};

export const localHeroIntroduction: Record<Language, EditorialStory> = {
    fr: {
        blocks: [
            {type: 'paragraph', html: 'Il y a vingt-cinq ans, en décembre 2000, la loi SRU (Loi relative à la solidarité et au renouvellement urbains) était adoptée en France. Elle imposait à certaines communes d’atteindre un taux de 25 % de logements sociaux dans leur parc résidentiel, afin de mettre un frein aux dynamiques croissantes de ségrégation.'},
            {type: 'paragraph', html: 'Ce projet analyse les effets de cette loi sur le rééquilibrage du parc de logements sociaux dans les communes de l’ensemble du pays, en particulier dans celles qui ne respectent pas les quotas fixés. S’appuyant sur des travaux de recherche antérieurs, cette étude conjugue analyse des politiques d’exclusion, analyse de l’offre de logement, et analyse des effets de quartier, notamment en ce qui concerne les indicateurs de santé.'},
            {type: 'paragraph', html: 'J’utilise des outils cartographiques et statistiques afin d’évaluer comment la mission définie il y a vingt-cinq ans, celle de rapprocher habitants et aménités, pour offrir à ces derniers une meilleure qualité de vie, a été accomplie. L’hypothèse qui guide cette analyse, tirée d’observations de terrain en tant que chercheuse et urbaniste, est que ce bilan se caractérise par une mosaïque de résultats. Ceux-ci dépendent fortement des politiques locales d’usage du foncier et de logement, et de la volonté politique d’élus locaux de se conformer à une loi imposée par l’État.'},
            {type: 'paragraph', html: 'Je formule également l’hypothèse que, si un travail important de rééquilibrage territorial reste nécessaire, notamment dans les communes les plus récalcitrantes, la mission de rééquilibrage du parc de logements sociaux — et, par conséquent, d’ouverture de l’accès à de meilleurs équipements et à davantage de ressources — a néanmoins été globalement remplie.'},
            {type: 'paragraph', html: 'Le tableau de bord suivant transpose cette analyse empirique en un outil exploratoire. Il permet aux utilisateurs de découvrir une cartographie des territoires où le parc de logements sociaux s’est développé, de comparer les trajectoires des différentes communes et de mettre en relation la mise en œuvre de la loi SRU avec plusieurs indicateurs tels que le revenu médian, le taux de pauvreté, la structure démographique par âge, les nuances politiques, la performance énergétique des logements et l’exposition aux îlots de chaleur. En rendant ces évolutions visibles et faciles d’accès, l’objectif n’est pas seulement d’évaluer si les objectifs de la loi ont été atteints sur le plan quantitatif, mais aussi d’interroger les modalités et les territoires du rééquilibrage, ainsi que ses implications en matière de santé et de justice environnementale.'},
            {type: 'paragraph', html: '<a href="https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790" target="_blank" rel="noreferrer">Si mes travaux ont déjà permis d’évaluer l’évolution quantitative du parc social</a>, je me concentre délibérément ici sur la dimension de l’« accès aux opportunités » — c’est-à-dire sur la manière dont la Loi SRU a permis aux habitants du parc social d’accéder, au cours des vingt-cinq dernières années, à des territoires leur offrant davantage de possibilités. Cette approche ne vise aucunement à minimiser l’importance des travaux de recherche et des politiques publiques qui continuent de documenter la géographie des quartiers prioritaires de la Politique de la Ville (QPV), où les logements sociaux restent fortement concentrés. Pour des analyses plus détaillées de ces territoires et des inégalités persistantes qui les caractérisent, les lecteurs peuvent consulter des portails et tableaux de bord nationaux existants tels que <a href="https://sig.ville.gouv.fr/" target="_blank" rel="noreferrer">SIG Ville</a>, l’<a href="https://www.onpv.fr/donnees" target="_blank" rel="noreferrer">Observatoire national de la politique de la ville (ONPV)</a> et les <a href="https://www.insee.fr/fr/statistiques/2500477" target="_blank" rel="noreferrer">jeux de données de l’INSEE consacrés aux quartiers prioritaires</a>.'},
        ],
        notes: [],
    },
    en: {
        blocks: [
            {type: 'paragraph', html: 'Twenty-five years ago, in December 2000, the SRU Law (Loi Solidarité et Renouvellement Urbain) was passed in France, requiring selected municipalities to devote 25% of their local stock to social housing, in order to curb growing trends of segregation.'},
            {type: 'paragraph', html: 'In this project, I ask what impact this law has had on the rebalancing of social housing stocks for municipalities across the country, particularly those not complying with set quotas. Building on previous research, this paper is part exclusionary politics analysis, part supply analysis, and part neighborhood outcomes analysis, particularly when it comes to health outcomes.'},
            {type: 'paragraph', html: 'I use GIS and regression models to underscore how much of the mission set twenty-five years ago, of "moving people to opportunity", and unlocking resources to offer them a better quality of life, has been achieved. I hypothesize that the reality is that we are faced with a patchwork of outcomes depending strongly on local land use regimes and political willingness to comply with a state-mandated law.'},
            {type: 'paragraph', html: 'I also hypothesize that while a lot of rebalancing still needs to happen, particularly in the most exclusionary municipalities, the mission of rebalancing social housing stocks, and hence unlocking access to better amenities and resources, has indeed overall been met.'},
            {type: 'paragraph', html: 'This project dashboard translates that empirical work into an exploratory tool. It lets users map where social housing stocks have grown, compare trajectories across communes, and link SRU implementation to income, poverty, age structure, politics, energy performance, and exposure to heat. By making these patterns visible at a glance, the aim is not only to assess whether legal targets were numerically met, but also to question how and where rebalancing has occurred, and with what implications for health and environmental justice.'},
            {type: 'paragraph', html: '<a href="https://www.tandfonline.com/doi/abs/10.1080/02673037.2021.1941790" target="_blank" rel="noreferrer">While my research has already assessed the quantitative evolution of the social housing stock</a>, I deliberately focus here on the “moving to opportunity” side of the story—how the SRU law has opened up higher‑opportunity geographies to social housing residents over the past twenty‑five years. I do so without minimizing the crucial research and policy work that continues to document lower‑income neighborhoods where social housing remains highly concentrated. For more detailed analyses of these territories and their persistent inequalities, readers can turn to national data portals and dashboards such as <a href="https://sig.ville.gouv.fr/" target="_blank" rel="noreferrer">SIG Ville</a>, the <a href="https://www.onpv.fr/donnees" target="_blank" rel="noreferrer">Observatoire national de la politique de la ville (ONPV)</a>, and <a href="https://www.insee.fr/fr/statistiques/2500477" target="_blank" rel="noreferrer">INSEE’s datasets on quartiers prioritaires</a>.'},
        ],
        notes: [],
    },
};

export const localAcknowledgements: Record<Language, EditorialStory> = {
    fr: {
        blocks: [
            {type: 'heading', level: 2, id: 'acknowledgements-title-fr', html: 'Remerciements'},
            {type: 'heading', level: 3, id: 'acknowledgements-data-fr', html: 'Accès aux données'},
            {type: 'paragraph', html: 'Julie Bergeot et Clément Petitimbert, de la Mission SRU au ministère chargé du Logement'},
            {type: 'heading', level: 3, id: 'acknowledgements-conversations-fr', html: 'Échanges et contributions à la réflexion'},
            {type: 'paragraph', html: 'Dr Julie Vallée, directrice de recherche au CNRS et responsable de Mobiliscope ; Jacques Baudrier, Adjoint au maire de Paris chargé du logement, de la rénovation thermique, de l’encadrement des loyers et de la défense des locataires ; Stéphanie Jankel, Atelier parisien d’urbanisme ; Dr Lance Freeman, University of Pennsylvania ; Dr Ann Forsyth, Harvard GSD – Healthy Places Design Lab ; Dr Rachel Weber, Harvard GSD ; Dr Paavo Monkkonen, UCLA ; Dr Arthur Acolin, University of Washington ; Dr Patrick Le Galès, CNRS – Sciences Po Paris ; Dr Rolf Pendall, AICP, University of New Mexico.'},
            {type: 'heading', level: 3, id: 'acknowledgements-photography-fr', html: 'Photographies'},
            {type: 'paragraph', html: '<strong>Paris :</strong> toutes les images ont été réalisées en partenariat avec docar films (Rocío Calzado Lopez + Jasper Meurer).'},
            {type: 'paragraph', html: '<strong>Bretagne :</strong> Pierre Ewald, pour Palast.'},
            {type: 'paragraph', html: '<strong>Provence :</strong> Florence Vesval, pour Atelier Régis Roudil Architectes, 2021.'},
            {type: 'paragraph', html: '<strong>DROM :</strong> Images 1 à 3: L’Atelier Architectes &amp; Ingénieurs, 2018. Image 4: La Possession, SEMADER, AERIS/A.DISS, 2025.'},
            {type: 'heading', level: 3, id: 'acknowledgements-team-fr', html: 'Équipe d’assistants de recherche'},
            {type: 'paragraph', html: 'Ananmay Sharan, Sebastian Rodriguez, Matt Thibodeau, Yihan Zhang, Anishta Khan'},
        ],
        notes: [],
    },
    en: {
        blocks: [
            {type: 'heading', level: 2, id: 'acknowledgements-title-en', html: 'Acknowledgements'},
            {type: 'heading', level: 3, id: 'acknowledgements-data-en', html: 'Data Access'},
            {type: 'paragraph', html: 'Julie Bergeot and Clément Petitimbert, Mission SRU at the Ministry of Housing'},
            {type: 'heading', level: 3, id: 'acknowledgements-conversations-en', html: 'Conversations that Informed this Project'},
            {type: 'paragraph', html: 'Dr Julie Vallée, CNRS Research Director and Head of Mobiliscope; Jacques Baudrier, Deputy Mayor of Paris responsible for housing, energy-efficiency renovations, rent regulation, and tenants’ rights; Stéphanie Jankel, Atelier parisien d’urbanisme; Dr Lance Freeman, University of Pennsylvania; Dr Ann Forsyth, Harvard GSD – Healthy Places Design Lab; Dr Rachel Weber, Harvard GSD; Dr Paavo Monkkonen, UCLA; Dr Arthur Acolin, University of Washington; Dr Patrick Le Galès, CNRS – Sciences Po Paris; Dr Rolf Pendall, AICP, University of New Mexico.'},
            {type: 'heading', level: 3, id: 'acknowledgements-photography-en', html: 'Photography'},
            {type: 'paragraph', html: '<strong>Paris :</strong> All images developed in partnership with docar films (Rocío Calzado Lopez + Jasper Meurer).'},
            {type: 'paragraph', html: '<strong>Brittany:</strong> Pierre Ewald, for Palast.'},
            {type: 'paragraph', html: '<strong>Provence :</strong> Florence Vesval, for Atelier Régis Roudil Architectes, 2021.'},
            {type: 'paragraph', html: '<strong>Overseas Territories:</strong> Images 1–3: L’Atelier Architectes &amp; Ingénieurs, 2018. Image 4: La Possession, SEMADER, AERIS/A.DISS, 2025.'},
            {type: 'heading', level: 3, id: 'acknowledgements-team-en', html: 'Research Assistantship Team'},
            {type: 'paragraph', html: 'Ananmay Sharan, Sebastian Rodriguez, Matt Thibodeau, Yihan Zhang, Anishta Khan'},
        ],
        notes: [],
    },
};
