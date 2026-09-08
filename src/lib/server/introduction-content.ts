import {env} from '$env/dynamic/private';
import editorialContent from '$lib/data/editorial-content.md?raw';
import editorialContentFr from '$lib/data/editorial-content.fr.md?raw';
import {
    localAcknowledgements,
    localHeroIntroduction,
    localIntroductionText,
    type IntroductionPageText,
} from '$lib/data/introduction-content';
import type {Language} from '$lib/i18n';
import {parseEditorialStory, type EditorialStory} from '$lib/utils/editorial-markdown';
import {portableTextToEditorialStory, type PortableTextBlock} from './editorial-portable-text';
import {sanityClient} from './sanity';

export type IntroductionPageContent = {
    text: Record<Language, IntroductionPageText>;
    heroIntroduction: Record<Language, EditorialStory>;
    introduction: Record<Language, EditorialStory>;
    dashboardGuide: Record<Language, EditorialStory>;
    acknowledgements: Record<Language, EditorialStory>;
};

const localIntroduction: Record<Language, EditorialStory> = {
    en: parseEditorialStory(editorialContent, 'introduction'),
    fr: parseEditorialStory(editorialContentFr, 'introduction'),
};

const localDashboardGuide: Record<Language, EditorialStory> = {
    en: parseEditorialStory(editorialContent, 'dashboard-guide'),
    fr: parseEditorialStory(editorialContentFr, 'dashboard-guide'),
};

const localContent: IntroductionPageContent = {
    text: localIntroductionText,
    heroIntroduction: localHeroIntroduction,
    introduction: localIntroduction,
    dashboardGuide: localDashboardGuide,
    acknowledgements: localAcknowledgements,
};

const introductionQuery = `*[_id == "introductionPage"][0]{
  "text": {
    "en": {
      "heroTitle": heroTitleEn,
      "byline": bylineEn,
      "supportersTitle": supportersTitleEn,
      "storyHousingTitle": storyHousingTitleEn,
      "storyHousingBody": storyHousingBodyEn,
      "storyNewsTitle": storyNewsTitleEn,
      "storyNewsBody": storyNewsBodyEn
    },
    "fr": {
      "heroTitle": heroTitleFr,
      "byline": bylineFr,
      "supportersTitle": supportersTitleFr,
      "storyHousingTitle": storyHousingTitleFr,
      "storyHousingBody": storyHousingBodyFr,
      "storyNewsTitle": storyNewsTitleFr,
      "storyNewsBody": storyNewsBodyFr
    }
  },
  "heroIntroduction": {"en": heroIntroductionEn, "fr": heroIntroductionFr},
  "pageContent": {"en": pageContentEn, "fr": pageContentFr},
  "acknowledgements": {"en": acknowledgementsEn, "fr": acknowledgementsFr},
  "endnotes": {
    "en": endnotesEn[]{noteId, number, body},
    "fr": endnotesFr[]{noteId, number, body}
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required introduction content at ${path}.`);
    }
}

function splitPageContent(value: unknown, language: Language) {
    if (!Array.isArray(value)) throw new Error(`Missing ${language} introduction and dashboard content.`);
    const introduction: PortableTextBlock[] = [];
    const dashboardGuide: PortableTextBlock[] = [];

    for (const candidate of value) {
        const block = candidate as PortableTextBlock;
        if (typeof block?._key !== 'string') {
            throw new Error(`The ${language} introduction contains a block without a stable key.`);
        }
        if (block._key.startsWith('editorial-dashboard-guide-')) dashboardGuide.push(block);
        else if (block._key.startsWith('editorial-introduction-')) introduction.push(block);
        else throw new Error(`Unexpected ${language} introduction block key: ${block._key}.`);
    }

    return {introduction, dashboardGuide};
}

function validateAndConvert(value: unknown): IntroductionPageContent {
    if (!value || typeof value !== 'object') throw new Error('The introduction document is missing.');
    const document = value as {
        text?: Partial<Record<Language, Partial<Record<keyof IntroductionPageText, unknown>>>>;
        heroIntroduction?: Partial<Record<Language, unknown>>;
        pageContent?: Partial<Record<Language, unknown>>;
        acknowledgements?: Partial<Record<Language, unknown>>;
        endnotes?: Partial<Record<Language, unknown>>;
    };
    const result: IntroductionPageContent = {
        text: {en: {} as IntroductionPageText, fr: {} as IntroductionPageText},
        heroIntroduction: {en: {} as EditorialStory, fr: {} as EditorialStory},
        introduction: {en: {} as EditorialStory, fr: {} as EditorialStory},
        dashboardGuide: {en: {} as EditorialStory, fr: {} as EditorialStory},
        acknowledgements: {en: {} as EditorialStory, fr: {} as EditorialStory},
    };
    const textFields = Object.keys(localIntroductionText.en) as (keyof IntroductionPageText)[];

    for (const language of ['en', 'fr'] as const) {
        for (const field of textFields) {
            const text = document.text?.[language]?.[field];
            requireText(text, `text.${language}.${field}`);
            result.text[language][field] = text;
        }

        const pageContent = splitPageContent(document.pageContent?.[language], language);
        result.heroIntroduction[language] = portableTextToEditorialStory(
            document.heroIntroduction?.[language],
            [],
            localHeroIntroduction[language],
            'editorial-introduction-hero',
        );
        result.introduction[language] = portableTextToEditorialStory(
            pageContent.introduction,
            document.endnotes?.[language],
            localIntroduction[language],
            'editorial-introduction',
        );
        result.dashboardGuide[language] = portableTextToEditorialStory(
            pageContent.dashboardGuide,
            [],
            localDashboardGuide[language],
            'editorial-dashboard-guide',
        );
        result.acknowledgements[language] = portableTextToEditorialStory(
            document.acknowledgements?.[language],
            [],
            localAcknowledgements[language],
            'acknowledgements',
        );
    }

    return result;
}

export async function getIntroductionPageContent(): Promise<IntroductionPageContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localContent;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(introductionQuery);
    return validateAndConvert(content);
}
