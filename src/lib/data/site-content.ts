import type {Language} from '$lib/i18n';
import type {SiteRoute} from './routes';

export type GlossaryContent = {
    title: string;
    socialStockTerm: string;
    socialStockDefinition: string;
    qpvTerm: string;
    qpvDefinition: string;
    financingTitle: string;
    plai: string;
    plus: string;
    pls: string;
    pli: string;
    providersTitle: string;
    oph: string;
    esh: string;
    sem: string;
};

export type SiteSettingsContent = {
    siteTitle: Record<Language, string>;
    skipLink: Record<Language, string>;
    navigation: Record<Language, Record<SiteRoute, string>>;
    previousPage: Record<Language, string>;
    nextPage: Record<Language, string>;
    glossary: Record<Language, GlossaryContent>;
};

export const localSiteSettings: SiteSettingsContent = {
    siteTitle: {
        fr: 'La Loi SRU : bilan après 25 ans',
        en: 'The Loi SRU French social housing program, 25 years later',
    },
    skipLink: {fr: 'Aller au contenu principal', en: 'Skip to main content'},
    navigation: {
        fr: {
            '/': 'Introduction',
            '/supply': 'Chiffres',
            '/health-outcomes': 'Indicateurs de santé',
            '/post-occupancy-evaluation': 'Évaluation de l’usage des bâtiments',
            '/resources': 'Revue de presse',
            '/bibliography': 'Bibliographie',
        },
        en: {
            '/': 'Introduction',
            '/supply': 'The Numbers',
            '/health-outcomes': 'Health Outcomes',
            '/post-occupancy-evaluation': 'Post-Occupancy Evaluation',
            '/resources': 'News Sources',
            '/bibliography': 'Bibliography',
        },
    },
    previousPage: {fr: 'Page précédente', en: 'Previous page'},
    nextPage: {fr: 'Page suivante', en: 'Next page'},
    glossary: {
        fr: {
            title: 'Lexique du tableau de bord',
            socialStockTerm: 'Parc locatif social :',
            socialStockDefinition: 'le répertoire du parc locatif des bailleurs sociaux (RPLS) recense l’ensemble des logements appartenant aux organismes de logement social. Le parc locatif social comprend tous les logements, qu’ils soient ou non conventionnés avec l’État, dont le statut juridique du propriétaire encadre l’activité (offices publics de l’habitat, entreprises sociales pour l’habitat et associations agréées) ainsi que les logements conventionnés appartenant à d’autres bailleurs (sociétés d’économie mixte, notamment). En revanche, les logements non conventionnés appartenant à une société d’économie mixte (SEM) en France métropolitaine, dont les caractéristiques sont proches de celles du parc locatif privé, sont exclus.',
            qpvTerm: 'Quartier prioritaire de la politique de la ville (QPV) :',
            qpvDefinition: 'la loi de programmation pour la ville et la cohésion urbaine, dite loi Lamy, a modifié la géographie des quartiers prioritaires de la politique de la ville. Les QPV ont remplacé les zones urbaines sensibles (ZUS) et les quartiers couverts par un contrat urbain de cohésion sociale (CUCS) en janvier 2015. Ainsi, dans le répertoire, l’appartenance à un QPV a remplacé l’appartenance à une ZUS à compter du 1er janvier 2016.',
            financingTitle: 'Dispositifs de financement',
            plai: 'prêt locatif aidé d’intégration',
            plus: 'prêt locatif à usage social. Les logements financés au moyen d’un prêt locatif aidé ordinaire (PLA) sont également inclus dans cette catégorie',
            pls: 'prêt locatif social',
            pli: 'prêt locatif intermédiaire',
            providersTitle: 'Types de bailleurs sociaux',
            oph: 'office public de l’habitat',
            esh: 'entreprise sociale pour l’habitat',
            sem: 'société d’économie mixte',
        },
        en: {
            title: 'Dashboard lexicon',
            socialStockTerm: 'Social rental housing stock:',
            socialStockDefinition: "the register of the rental stock of social housing providers lists all dwellings owned by social landlords. The social rental housing stock refers to all dwellings, whether or not they are under a convention with the state, for which the landlord's legal status constrains its activity (public housing offices, social housing enterprises, accredited associations), plus conventioned dwellings owned by other providers (semi‑public companies, etc.). Non‑conventioned dwellings owned by a semi‑public company (SEM) in metropolitan France whose characteristics are close to the private rental sector are therefore excluded.",
            qpvTerm: 'Priority urban policy neighborhood (QPV):',
            qpvDefinition: 'the Framework Law on Urban Policy and Social Cohesion changed the geography of priority areas for urban policy. The priority neighborhoods of urban policy (QPV) replaced the zones urbaines sensibles (ZUS, sensitive urban zones) and the neighborhoods under an Urban Social Cohesion Contract (CUCS) in January 2015. Thus, belonging to a QPV replaced belonging to a ZUS in the register as of January 1, 2016.',
            financingTitle: 'Financing instruments:',
            plai: "Prêt locatif aidé d'intégration (integrative assisted rental loan)",
            plus: 'Prêt locatif à usage social (social use rental loan). Dwellings financed with an ordinary assisted rental loan (Prêt locatif aidé ordinaire, PLA) are also included in this category',
            pls: 'Prêt locatif social (social rental loan)',
            pli: 'Prêt locatif intermédiaire (intermediate rental loan)',
            providersTitle: 'Types of social housing providers:',
            oph: "Organisme public de l'habitat (public housing agency)",
            esh: "Entreprise sociale pour l'habitat (social housing enterprise)",
            sem: "Société d'économie mixte (semi‑public/municipally controlled company)",
        },
    },
};
