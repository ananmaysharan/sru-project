import type { Language } from '$lib/i18n';

type Localized = Record<Language, string>;
export type ProjectIdCard = {
    title: Localized;
    fields: { label: Localized; value: Localized; href?: string }[];
};

const labels = {
    place: { fr: 'Quartier, ville, région', en: 'Neighborhood, City, Region' },
    year: { fr: 'Année d’achèvement', en: 'Year Completed' },
    units: { fr: 'Nombre de logements sociaux', en: 'Social Tenure Units' },
    architect: { fr: 'Architecte', en: 'Architect' },
    cost: { fr: 'Coût', en: 'Cost' },
    period: { fr: 'Durée de la période de construction', en: 'Construction Period Length' },
    finance: { fr: 'Dispositifs de financement', en: 'Financial Mechanisms' },
    notes: { fr: 'Remarques', en: 'Notes' },
} satisfies Record<string, Localized>;

export const projectIdCards: Record<string, ProjectIdCard> = {
    Samaritaine: {
        title: { fr: 'La Samaritaine', en: 'La Samaritaine' },
        fields: [
            { label: labels.place, value: { fr: '1er arrondissement, Paris, Île-de-France', en: '1st arrondissement, Paris, Île-de-France' } },
            { label: labels.year, value: { fr: '2021', en: '2021' } },
            { label: labels.units, value: { fr: '96 (24 PLAI, 48 PLUS, 24 PLS) — la Ville de Paris (45 logements, dont 5 ULS), la préfecture de Paris (28 logements), Action Logement Services (20 logements) et la Région (3 logements)', en: '96 (24 PLAI, 48 PLUS, 24 PLS) — City of Paris (45 units, including 5 ULS), Paris Prefecture (28 units), Action Logement Services (20 units), and the Region (3 units)' } },
            { label: labels.architect, value: { fr: 'FBAA (François Brugel Architectes Associés)', en: 'FBAA (François Brugel Architectes Associés)' } },
            { label: labels.cost, value: { fr: '23,7 millions d’euros', en: '€23.7 million' } },
            { label: labels.period, value: { fr: '16 ans (2005–2021)', en: '16 years (2005–2021)' } },
            { label: labels.finance, value: { fr: 'PLAI, PLUS, PLS', en: 'PLAI, PLUS, PLS' } },
            { label: labels.notes, value: { fr: 'Logements sociaux intégrés à une opération de réaménagement mixte comprenant des activités de luxe.', en: 'Social housing within a luxury mixed-use redevelopment.' } },
        ],
    },
    'Tour Bois-le-Prêtre': {
        title: { fr: 'Tour Bois-le-Prêtre', en: 'Tour Bois-le-Prêtre' },
        fields: [
            { label: labels.place, value: { fr: '17e arrondissement, Paris, Île-de-France', en: '17th arrondissement, Paris, Île-de-France' } },
            { label: labels.year, value: { fr: '2011', en: '2011' } },
            { label: labels.units, value: { fr: '96', en: '96' } },
            { label: labels.architect, value: { fr: 'Lacaton & Vassal', en: 'Lacaton & Vassal' }, href: 'https://www.lacatonvassal.com/?idp=56' },
            { label: labels.cost, value: { fr: '11,25 millions d’euros', en: '€11.25 million' } },
            { label: labels.period, value: { fr: '6 ans (2005–2011)', en: '6 years (2005–2011)' } },
            { label: labels.finance, value: { fr: 'Ville de Paris, Région Île-de-France et ANRU 1', en: 'City of Paris, Île-de-France Region, and ANRU 1' }, href: 'https://www.bfmtv.com/immobilier/rehabilitation-d-une-tour-dans-le-nord-de-paris_AN-201111220174.html' },
            { label: labels.notes, value: { fr: 'Réhabilitation fondée sur la transformation de l’existant.', en: 'Adaptive reuse rehabilitation.' } },
        ],
    },
    'Rue Jean-Bart': {
        title: { fr: '12, rue Jean-Bart', en: '12 Rue Jean-Bart' },
        fields: [
            { label: labels.place, value: { fr: '6e arrondissement, Paris, Île-de-France', en: '6th arrondissement, Paris, Île-de-France' } },
            { label: labels.year, value: { fr: '2021', en: '2021' } },
            { label: labels.units, value: { fr: '8 (4 PLAI, 4 PLUS)', en: '8 (4 PLAI, 4 PLUS)' } },
            { label: labels.architect, value: { fr: 'Jean-Christophe Quinton architecte', en: 'Jean-Christophe Quinton architecte' } },
            { label: labels.cost, value: { fr: '1,9 million d’euros', en: '€1.9 million' } },
            { label: labels.period, value: { fr: '4 ans (2016–2020)', en: '4 years (2016–2020)' } },
            { label: labels.finance, value: { fr: 'PLAI, PLUS et bail emphytéotique', en: 'PLAI, PLUS, emphyteutic lease' }, href: 'https://a06-v7.apps.paris.fr/a06/jsp/site/plugins/odjcp/DoDownload.jsp?id_entite=40970&id_type_entite=6' },
            { label: labels.notes, value: { fr: 'Le rez-de-chaussée comprend une structure d’accueil pour jeunes enfants.', en: 'Includes ground-floor childcare center.' } },
        ],
    },
    Talgen: {
        title: { fr: 'Talgen', en: 'Talgen' },
        fields: [
            { label: labels.place, value: { fr: 'Cesson-Sévigné, Bretagne', en: 'Cesson-Sévigné, Brittany' } },
            { label: labels.year, value: { fr: '2024', en: '2024' } },
            { label: labels.units, value: { fr: '24', en: '24' } },
            { label: labels.architect, value: { fr: 'palast', en: 'palast' } },
            { label: labels.cost, value: { fr: '2,2 millions d’euros hors taxes', en: '€2.2 million (before tax)' } },
            { label: labels.period, value: { fr: 'environ 3 ans (2021–2024)', en: 'approx. 3 years (2021–2024)' } },
            { label: labels.finance, value: { fr: 'PLUS, PLAI', en: 'PLUS, PLAI' } },
            { label: labels.notes, value: { fr: 'Situé au sein de la ZAC des Pierrins.', en: 'Within ZAC des Pierrins.' } },
        ],
    },
    'Les Jasmins · La Réunion': {
        title: { fr: 'Les Jasmins, écoquartier Cœur de Ville', en: 'Les Jasmins, Cœur de Ville Eco-District' },
        fields: [
            { label: labels.place, value: { fr: 'La Possession, La Réunion, DROM', en: 'La Possession, La Réunion, DROM' } },
            { label: labels.year, value: { fr: '2018', en: '2018' } },
            { label: labels.units, value: { fr: '38 logements à revenus intermédiaires en accession sociale à la propriété, financés par un PSLA — location-accession', en: '38 moderate-income PSLA units (social ownership/rent-to-buy)' }, href: 'https://imazpress.com/actus-reunion/38-futurs-proprietaires-ont-emmenage' },
            { label: labels.architect, value: { fr: 'L’ATELIER architectes & ingénieurs', en: 'L’ATELIER architectes & ingénieurs' }, href: 'https://www.latelier-archi.fr/ecoquartier-possession-reunion' },
            { label: labels.cost, value: { fr: '4,08 millions d’euros', en: '€4.08 million' } },
            { label: labels.period, value: { fr: 'environ 2 ans (2017–2018)', en: 'approx. 2 years (2017–2018)' } },
            { label: labels.finance, value: { fr: 'PSLA', en: 'PSLA' } },
            { label: labels.notes, value: { fr: 'Situé au sein d’un écoquartier plus vaste de 1 828 logements, comprenant 745 logements sociaux destinés aux ménages à faibles revenus et 385 logements sociaux destinés aux ménages à revenus intermédiaires, dont les logements en PSLA.', en: 'Within a larger 1,828-unit mixed-tenure eco-district containing 745 low-income social units and 385 moderate-income social units, including PSLA.' }, href: 'https://files.appli-intramuros.com/website/uploads/20606/2025/ar-affaire_n.04-annexe_crac_2023_zac_coeur_de_ville.pdf' },
        ],
    },
};
