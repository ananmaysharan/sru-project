import {env} from '$env/dynamic/private';
import editorialContent from '$lib/data/editorial-content.md?raw';
import editorialContentFr from '$lib/data/editorial-content.fr.md?raw';
import {CASE_STUDY_IMAGE_IDS, type CaseStudyImageId, type CaseStudyProjectId} from '$lib/data/case-study-ids';
import {
    localPostOccupancyCaptions,
    localPostOccupancyIntroduction,
    localPostOccupancyText,
    localResidentTopics,
    type PostOccupancyPageText,
    type ResidentTopic,
} from '$lib/data/post-occupancy-content';
import {
    PROJECT_CARD_FIELD_IDS,
    PROJECT_CARD_IDS,
    projectIdCards,
    type ProjectIdCard,
} from '$lib/data/project-id-cards';
import type {Language} from '$lib/i18n';
import {parseEditorialStory, type EditorialStory} from '$lib/utils/editorial-markdown';
import {portableTextToEditorialStory} from './editorial-portable-text';
import {sanityClient} from './sanity';

export type PostOccupancyPageContent = {
    text: Record<Language, PostOccupancyPageText>;
    introduction: Record<Language, EditorialStory>;
    imageCaptions: Record<Language, Record<CaseStudyImageId, string>>;
    projectIdCards: Partial<Record<CaseStudyProjectId, ProjectIdCard>>;
    residentTopics: Record<Language, ResidentTopic[]>;
    conclusion: Record<Language, EditorialStory>;
};

const localConclusion: Record<Language, EditorialStory> = {
    en: parseEditorialStory(editorialContent, 'post-occupancy'),
    fr: parseEditorialStory(editorialContentFr, 'post-occupancy'),
};

const localContent: PostOccupancyPageContent = {
    text: localPostOccupancyText,
    introduction: localPostOccupancyIntroduction,
    imageCaptions: localPostOccupancyCaptions,
    projectIdCards,
    residentTopics: {
        en: localResidentTopics.en.map((topic) => ({...topic, quotes: [...topic.quotes]})),
        fr: localResidentTopics.fr.map((topic) => ({...topic, quotes: [...topic.quotes]})),
    },
    conclusion: localConclusion,
};

const postOccupancyQuery = `*[_id == "postOccupancyPage"][0]{
  "text": {
    "en": {"title": titleEn, "residentVoicesTitle": residentVoicesTitleEn},
    "fr": {"title": titleFr, "residentVoicesTitle": residentVoicesTitleFr}
  },
  "introduction": {"en": introductionEn, "fr": introductionFr},
  "imageCaptions": {
    "en": imageCaptionsEn[]{"id": imageId, caption},
    "fr": imageCaptionsFr[]{"id": imageId, caption}
  },
  "projectCards": {
    "en": projectCardsEn[]{
      "id": projectId,
      title,
      fields[]{"id": fieldId, label, value, "href": url}
    },
    "fr": projectCardsFr[]{
      "id": projectId,
      title,
      fields[]{"id": fieldId, label, value, "href": url}
    }
  },
  "residentTopics": {
    "en": residentTopicsEn[]{
      "id": topicId,
      label,
      quotes[]{"id": quoteId, "text": text}
    },
    "fr": residentTopicsFr[]{
      "id": topicId,
      label,
      quotes[]{"id": quoteId, "text": text}
    }
  },
  "conclusion": {"en": conclusionEn, "fr": conclusionFr},
  "endnotes": {
    "en": endnotesEn[]{noteId, number, body},
    "fr": endnotesFr[]{noteId, number, body}
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required post-occupancy content at ${path}.`);
    }
}

function optionalLink(value: unknown, path: string) {
    if (value === undefined || value === null || value === '') return undefined;
    requireText(value, path);
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error(`Unsupported project card link protocol at ${path}.`);
    }
    return value;
}

type SanityProjectCard = {
    id?: unknown;
    title?: unknown;
    fields?: {id?: unknown; label?: unknown; value?: unknown; href?: unknown}[];
};

type SanityResidentTopic = {
    id?: unknown;
    label?: unknown;
    quotes?: {id?: unknown; text?: unknown}[];
};

function validateAndConvert(value: unknown): PostOccupancyPageContent {
    if (!value || typeof value !== 'object') throw new Error('The post-occupancy document is missing.');
    const document = value as {
        text?: Partial<Record<Language, Partial<Record<keyof PostOccupancyPageText, unknown>>>>;
        introduction?: Partial<Record<Language, unknown>>;
        imageCaptions?: Partial<Record<Language, unknown>>;
        projectCards?: Partial<Record<Language, unknown>>;
        residentTopics?: Partial<Record<Language, unknown>>;
        conclusion?: Partial<Record<Language, unknown>>;
        endnotes?: Partial<Record<Language, unknown>>;
    };
    const result: PostOccupancyPageContent = {
        text: {en: {} as PostOccupancyPageText, fr: {} as PostOccupancyPageText},
        introduction: {en: {} as EditorialStory, fr: {} as EditorialStory},
        imageCaptions: {
            en: {} as Record<CaseStudyImageId, string>,
            fr: {} as Record<CaseStudyImageId, string>,
        },
        projectIdCards: {},
        residentTopics: {en: [], fr: []},
        conclusion: {en: {} as EditorialStory, fr: {} as EditorialStory},
    };
    const textFields = Object.keys(localPostOccupancyText.en) as (keyof PostOccupancyPageText)[];
    const localizedCards: Partial<Record<Language, SanityProjectCard[]>> = {};

    for (const language of ['en', 'fr'] as const) {
        for (const field of textFields) {
            const text = document.text?.[language]?.[field];
            requireText(text, `text.${language}.${field}`);
            result.text[language][field] = text;
        }

        result.introduction[language] = portableTextToEditorialStory(
            document.introduction?.[language],
            [],
            localPostOccupancyIntroduction[language],
            'editorial-post-occupancy-introduction',
        );

        const captions = document.imageCaptions?.[language];
        if (!Array.isArray(captions) || captions.length !== CASE_STUDY_IMAGE_IDS.length) {
            throw new Error(`Expected 44 ${language} post-occupancy image captions.`);
        }
        captions.forEach((candidate, index) => {
            const caption = candidate as {id?: unknown; caption?: unknown};
            const expectedId = CASE_STUDY_IMAGE_IDS[index];
            if (caption.id !== expectedId) {
                throw new Error(`Unexpected ${language} image ID at position ${index + 1}.`);
            }
            requireText(caption.caption, `imageCaptions.${language}.${expectedId}`);
            result.imageCaptions[language][expectedId] = caption.caption;
        });

        const cards = document.projectCards?.[language];
        if (!Array.isArray(cards) || cards.length !== PROJECT_CARD_IDS.length) {
            throw new Error(`Expected five ${language} project information cards.`);
        }
        localizedCards[language] = cards as SanityProjectCard[];

        const topics = document.residentTopics?.[language];
        if (!Array.isArray(topics) || topics.length !== localResidentTopics[language].length) {
            throw new Error(`Expected six ${language} resident topics.`);
        }
        result.residentTopics[language] = (topics as SanityResidentTopic[]).map((topic, topicIndex) => {
            const expected = localResidentTopics[language][topicIndex];
            if (topic.id !== expected.id) {
                throw new Error(`Unexpected ${language} resident topic ID at position ${topicIndex + 1}.`);
            }
            requireText(topic.label, `residentTopics.${language}.${expected.id}.label`);
            if (!Array.isArray(topic.quotes) || topic.quotes.length !== expected.quotes.length) {
                throw new Error(`Unexpected ${language} quote count for resident topic ${expected.id}.`);
            }
            const quotes = topic.quotes.map((quote, quoteIndex) => {
                const expectedId = `${expected.id}-${quoteIndex + 1}`;
                if (quote.id !== expectedId) {
                    throw new Error(`Unexpected ${language} quote ID at ${expectedId}.`);
                }
                requireText(quote.text, `residentTopics.${language}.${expectedId}.text`);
                return quote.text;
            });
            return {id: expected.id, label: topic.label, quotes};
        });

        result.conclusion[language] = portableTextToEditorialStory(
            document.conclusion?.[language],
            document.endnotes?.[language],
            localConclusion[language],
            'editorial-post-occupancy',
        );
    }

    for (const [projectIndex, projectId] of PROJECT_CARD_IDS.entries()) {
        const english = localizedCards.en?.[projectIndex];
        const french = localizedCards.fr?.[projectIndex];
        if (english?.id !== projectId || french?.id !== projectId) {
            throw new Error(`Unexpected project information card ID at position ${projectIndex + 1}.`);
        }
        requireText(english.title, `projectCards.en.${projectId}.title`);
        requireText(french.title, `projectCards.fr.${projectId}.title`);
        if (english.fields?.length !== PROJECT_CARD_FIELD_IDS.length || french.fields?.length !== PROJECT_CARD_FIELD_IDS.length) {
            throw new Error(`Expected eight information fields for project ${projectId}.`);
        }
        const fields = PROJECT_CARD_FIELD_IDS.map((fieldId, fieldIndex) => {
            const englishField = english.fields?.[fieldIndex];
            const frenchField = french.fields?.[fieldIndex];
            if (englishField?.id !== fieldId || frenchField?.id !== fieldId) {
                throw new Error(`Unexpected field ID at ${projectId}.${fieldId}.`);
            }
            requireText(englishField.label, `projectCards.en.${projectId}.${fieldId}.label`);
            requireText(frenchField.label, `projectCards.fr.${projectId}.${fieldId}.label`);
            requireText(englishField.value, `projectCards.en.${projectId}.${fieldId}.value`);
            requireText(frenchField.value, `projectCards.fr.${projectId}.${fieldId}.value`);
            const englishHref = optionalLink(englishField.href, `projectCards.en.${projectId}.${fieldId}.href`);
            const frenchHref = optionalLink(frenchField.href, `projectCards.fr.${projectId}.${fieldId}.href`);
            if (englishHref !== frenchHref) {
                throw new Error(`English and French links differ at projectCards.${projectId}.${fieldId}.`);
            }
            return {
                label: {en: englishField.label, fr: frenchField.label},
                value: {en: englishField.value, fr: frenchField.value},
                ...(englishHref ? {href: englishHref} : {}),
            };
        });
        result.projectIdCards[projectId] = {
            title: {en: english.title, fr: french.title},
            fields,
        };
    }

    return result;
}

export async function getPostOccupancyPageContent(): Promise<PostOccupancyPageContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localContent;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(postOccupancyQuery);
    return validateAndConvert(content);
}
