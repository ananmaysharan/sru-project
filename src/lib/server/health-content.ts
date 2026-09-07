import {env} from '$env/dynamic/private';
import editorialContent from '$lib/data/editorial-content.md?raw';
import editorialContentFr from '$lib/data/editorial-content.fr.md?raw';
import {
    localHealthMetricDefinitions,
    localHealthText,
    type HealthMetricDefinition,
    type HealthPageText,
} from '$lib/data/health-content';
import {parseEditorialStory, type EditorialStory} from '$lib/utils/editorial-markdown';
import {portableTextToEditorialStory} from './editorial-portable-text';
import {sanityClient} from './sanity';

type Language = 'en' | 'fr';

export type HealthPageContent = {
    text: Record<Language, HealthPageText>;
    metricDefinitions: Record<Language, HealthMetricDefinition[]>;
    methods: Record<Language, EditorialStory>;
};

const localMethods: Record<Language, EditorialStory> = {
    en: parseEditorialStory(editorialContent, 'health-method'),
    fr: parseEditorialStory(editorialContentFr, 'health-method'),
};

const localContent: HealthPageContent = {
    text: localHealthText,
    metricDefinitions: localHealthMetricDefinitions,
    methods: localMethods,
};

const healthQuery = `*[_id == "healthOutcomesPage"][0]{
  "text": {
    "en": {
      "title": titleEn,
      "deck": deckEn,
      "intro": introductionEn,
      "cornerTitle": cornerTitleEn,
      "chartTitle": chartTitleEn,
      "chartBody": chartBodyEn,
      "definitions": definitionsTitleEn
    },
    "fr": {
      "title": titleFr,
      "deck": deckFr,
      "intro": introductionFr,
      "cornerTitle": cornerTitleFr,
      "chartTitle": chartTitleFr,
      "chartBody": chartBodyFr,
      "definitions": definitionsTitleFr
    }
  },
  "metricDefinitions": {
    "en": metricDefinitionsEn[]{"id": metricId, label, description},
    "fr": metricDefinitionsFr[]{"id": metricId, label, description}
  },
  "methods": {"en": methodsEn, "fr": methodsFr},
  "endnotes": {
    "en": endnotesEn[]{noteId, number, body},
    "fr": endnotesFr[]{noteId, number, body}
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required health content at ${path}.`);
    }
}

function validateAndConvert(value: unknown): HealthPageContent {
    if (!value || typeof value !== 'object') throw new Error('The health outcomes document is missing.');
    const document = value as {
        text?: Partial<Record<Language, Partial<Record<keyof HealthPageText, unknown>>>>;
        metricDefinitions?: Partial<Record<Language, unknown>>;
        methods?: Partial<Record<Language, unknown>>;
        endnotes?: Partial<Record<Language, unknown>>;
    };
    const result: HealthPageContent = {
        text: {en: {} as HealthPageText, fr: {} as HealthPageText},
        metricDefinitions: {en: [], fr: []},
        methods: {en: {} as EditorialStory, fr: {} as EditorialStory},
    };
    const textFields = Object.keys(localHealthText.en) as (keyof HealthPageText)[];

    for (const language of ['en', 'fr'] as const) {
        for (const field of textFields) {
            const text = document.text?.[language]?.[field];
            requireText(text, `text.${language}.${field}`);
            result.text[language][field] = text;
        }

        const definitions = document.metricDefinitions?.[language];
        if (!Array.isArray(definitions) || definitions.length !== localHealthMetricDefinitions[language].length) {
            throw new Error(`Expected nine ${language} health metric definitions.`);
        }
        result.metricDefinitions[language] = definitions.map((value, index) => {
            const definition = value as Partial<HealthMetricDefinition>;
            const expected = localHealthMetricDefinitions[language][index];
            if (definition.id !== expected.id) {
                throw new Error(`Unexpected ${language} health metric ID at position ${index + 1}.`);
            }
            requireText(definition.label, `metricDefinitions.${language}.${expected.id}.label`);
            requireText(definition.description, `metricDefinitions.${language}.${expected.id}.description`);
            return {id: expected.id, label: definition.label, description: definition.description};
        });

        result.methods[language] = portableTextToEditorialStory(
            document.methods?.[language],
            document.endnotes?.[language],
            localMethods[language],
            'editorial-health-method',
        );
    }
    return result;
}

export async function getHealthPageContent(): Promise<HealthPageContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localContent;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(healthQuery);
    return validateAndConvert(content);
}
