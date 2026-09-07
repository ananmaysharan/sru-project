import {env} from '$env/dynamic/private';
import {localSiteSettings, type GlossaryContent, type SiteSettingsContent} from '$lib/data/site-content';
import {siteRoutes} from '$lib/data/routes';
import {sanityClient} from './sanity';

type Language = 'en' | 'fr';

type SanitySiteSettings = {
    siteTitle?: Partial<Record<Language, unknown>>;
    skipLink?: Partial<Record<Language, unknown>>;
    navigation?: Partial<Record<Language, Partial<Record<string, unknown>>>>;
    previousPage?: Partial<Record<Language, unknown>>;
    nextPage?: Partial<Record<Language, unknown>>;
    glossary?: Partial<Record<Language, Partial<Record<keyof GlossaryContent, unknown>>>>;
};

const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  "siteTitle": {"en": siteTitleEn, "fr": siteTitleFr},
  "skipLink": {"en": skipLinkEn, "fr": skipLinkFr},
  "navigation": {
    "en": {
      "/": introductionNavEn,
      "/supply": supplyNavEn,
      "/health-outcomes": healthNavEn,
      "/post-occupancy-evaluation": postOccupancyNavEn,
      "/resources": resourcesNavEn,
      "/bibliography": bibliographyNavEn
    },
    "fr": {
      "/": introductionNavFr,
      "/supply": supplyNavFr,
      "/health-outcomes": healthNavFr,
      "/post-occupancy-evaluation": postOccupancyNavFr,
      "/resources": resourcesNavFr,
      "/bibliography": bibliographyNavFr
    }
  },
  "previousPage": {"en": previousPageEn, "fr": previousPageFr},
  "nextPage": {"en": nextPageEn, "fr": nextPageFr},
  "glossary": {
    "en": {
      "title": glossaryTitleEn,
      "socialStockTerm": glossarySocialStockTermEn,
      "socialStockDefinition": glossarySocialStockDefinitionEn,
      "qpvTerm": glossaryQpvTermEn,
      "qpvDefinition": glossaryQpvDefinitionEn,
      "financingTitle": glossaryFinancingTitleEn,
      "plai": glossaryPlaiEn,
      "plus": glossaryPlusEn,
      "pls": glossaryPlsEn,
      "pli": glossaryPliEn,
      "providersTitle": glossaryProvidersTitleEn,
      "oph": glossaryOphEn,
      "esh": glossaryEshEn,
      "sem": glossarySemEn
    },
    "fr": {
      "title": glossaryTitleFr,
      "socialStockTerm": glossarySocialStockTermFr,
      "socialStockDefinition": glossarySocialStockDefinitionFr,
      "qpvTerm": glossaryQpvTermFr,
      "qpvDefinition": glossaryQpvDefinitionFr,
      "financingTitle": glossaryFinancingTitleFr,
      "plai": glossaryPlaiFr,
      "plus": glossaryPlusFr,
      "pls": glossaryPlsFr,
      "pli": glossaryPliFr,
      "providersTitle": glossaryProvidersTitleFr,
      "oph": glossaryOphFr,
      "esh": glossaryEshFr,
      "sem": glossarySemFr
    }
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required site settings content at ${path}.`);
    }
}

function validateContent(value: unknown): asserts value is SiteSettingsContent {
    if (!value || typeof value !== 'object') throw new Error('The site settings document is missing.');
    const content = value as SanitySiteSettings;
    const glossaryFields = Object.keys(localSiteSettings.glossary.en) as (keyof GlossaryContent)[];

    for (const language of ['en', 'fr'] as const) {
        requireText(content.siteTitle?.[language], `siteTitle.${language}`);
        requireText(content.skipLink?.[language], `skipLink.${language}`);
        requireText(content.previousPage?.[language], `previousPage.${language}`);
        requireText(content.nextPage?.[language], `nextPage.${language}`);

        for (const route of siteRoutes) {
            requireText(content.navigation?.[language]?.[route.href], `navigation.${language}.${route.href}`);
        }
        for (const field of glossaryFields) {
            requireText(content.glossary?.[language]?.[field], `glossary.${language}.${field}`);
        }
    }
}

export async function getSiteSettingsContent(): Promise<SiteSettingsContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localSiteSettings;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(siteSettingsQuery);
    validateContent(content);
    return content;
}
