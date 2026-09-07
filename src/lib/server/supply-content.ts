import {env} from '$env/dynamic/private';
import editorialContent from '$lib/data/editorial-content.md?raw';
import editorialContentFr from '$lib/data/editorial-content.fr.md?raw';
import {localSupplyText, type SupplyPageText} from '$lib/data/supply-content';
import {parseEditorialStory, type EditorialStory} from '$lib/utils/editorial-markdown';
import {portableTextToEditorialStory} from './editorial-portable-text';
import {sanityClient} from './sanity';

type Language = 'en' | 'fr';

export type SupplyPageContent = {
    text: Record<Language, SupplyPageText>;
    methods: Record<Language, EditorialStory>;
};

const localMethods: Record<Language, EditorialStory> = {
    en: parseEditorialStory(editorialContent, 'supply'),
    fr: parseEditorialStory(editorialContentFr, 'supply'),
};

const localContent: SupplyPageContent = {text: localSupplyText, methods: localMethods};

const supplyQuery = `*[_id == "supplyPage"][0]{
  "text": {
    "en": {
      "title": titleEn,
      "deck": deckEn,
      "intro": introductionEn,
      "nationalTitle": nationalTitleEn,
      "source": nationalSourceEn,
      "tenureTitle": tenureTitleEn,
      "tenureCaption": tenureCaptionEn,
      "regionalTitle": regionalTitleEn,
      "regionalBody": regionalBodyEn,
      "distributionTitle": distributionTitleEn,
      "distributionCaption": distributionCaptionEn,
      "rateTitle": rateTitleEn,
      "rateCaption": rateCaptionEn,
      "mapTitle": mapTitleEn,
      "mapBody": mapBodyEn,
      "noncomplianceTitle": noncomplianceTitleEn,
      "noncomplianceDeck": noncomplianceDeckEn,
      "noncomplianceBody": noncomplianceBodyEn,
      "overseasTitle": overseasTitleEn,
      "overseasBody": overseasBodyEn,
      "europeTitle": europeTitleEn,
      "europeBody": europeBodyEn
    },
    "fr": {
      "title": titleFr,
      "deck": deckFr,
      "intro": introductionFr,
      "nationalTitle": nationalTitleFr,
      "source": nationalSourceFr,
      "tenureTitle": tenureTitleFr,
      "tenureCaption": tenureCaptionFr,
      "regionalTitle": regionalTitleFr,
      "regionalBody": regionalBodyFr,
      "distributionTitle": distributionTitleFr,
      "distributionCaption": distributionCaptionFr,
      "rateTitle": rateTitleFr,
      "rateCaption": rateCaptionFr,
      "mapTitle": mapTitleFr,
      "mapBody": mapBodyFr,
      "noncomplianceTitle": noncomplianceTitleFr,
      "noncomplianceDeck": noncomplianceDeckFr,
      "noncomplianceBody": noncomplianceBodyFr,
      "overseasTitle": overseasTitleFr,
      "overseasBody": overseasBodyFr,
      "europeTitle": europeTitleFr,
      "europeBody": europeBodyFr
    }
  },
  "methods": {"en": methodsEn, "fr": methodsFr},
  "endnotes": {
    "en": endnotesEn[]{noteId, number, body},
    "fr": endnotesFr[]{noteId, number, body}
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required supply content at ${path}.`);
    }
}

function validateAndConvert(value: unknown): SupplyPageContent {
    if (!value || typeof value !== 'object') throw new Error('The supply page document is missing.');
    const document = value as {
        text?: Partial<Record<Language, Partial<Record<keyof SupplyPageText, unknown>>>>;
        methods?: Partial<Record<Language, unknown>>;
        endnotes?: Partial<Record<Language, unknown>>;
    };
    const result = {
        text: {en: {} as SupplyPageText, fr: {} as SupplyPageText},
        methods: {en: {} as EditorialStory, fr: {} as EditorialStory},
    };
    const textFields = Object.keys(localSupplyText.en) as (keyof SupplyPageText)[];

    for (const language of ['en', 'fr'] as const) {
        for (const field of textFields) {
            const text = document.text?.[language]?.[field];
            requireText(text, `text.${language}.${field}`);
            result.text[language][field] = text;
        }
        result.methods[language] = portableTextToEditorialStory(
            document.methods?.[language],
            document.endnotes?.[language],
            localMethods[language],
            'editorial-supply',
        );
    }
    return result;
}

export async function getSupplyPageContent(): Promise<SupplyPageContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localContent;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(supplyQuery);
    return validateAndConvert(content);
}
