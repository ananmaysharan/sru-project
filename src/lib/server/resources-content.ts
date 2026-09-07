import {env} from '$env/dynamic/private';
import {localizedResourceSections, type ResourceContentSection} from '$lib/data/resource-content';
import {sanityClient} from './sanity';

type Language = 'en' | 'fr';

export type ResourcesPageContent = {
    title: Record<Language, string>;
    sourceLinkLabel: Record<Language, string>;
    sections: Record<Language, ResourceContentSection[]>;
};

const localContent: ResourcesPageContent = {
    title: {en: 'News Sources', fr: 'Revue de presse'},
    sourceLinkLabel: {en: 'Source', fr: 'Source'},
    sections: localizedResourceSections,
};

const resourcesQuery = `*[_id == "resourcesPage"][0]{
  "title": {"en": titleEn, "fr": titleFr},
  "sourceLinkLabel": {"en": sourceLinkLabelEn, "fr": sourceLinkLabelFr},
  "sections": {
    "en": sectionsEn[]{"id": sectionId, title, "items": items[]{"id": itemId, text, "url": coalesce(url, null)}},
    "fr": sectionsFr[]{"id": sectionId, title, "items": items[]{"id": itemId, text, "url": coalesce(url, null)}}
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`Missing required resources content at ${path}.`);
    }
}

function validateUrl(value: unknown, path: string): asserts value is string | null {
    if (value === null) return;
    if (typeof value !== 'string') throw new Error(`Invalid resources link at ${path}.`);
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error(`Unsupported resources link protocol at ${path}.`);
    }
}

function validateContent(value: unknown): asserts value is ResourcesPageContent {
    if (!value || typeof value !== 'object') throw new Error('The resources document is missing.');
    const content = value as Partial<ResourcesPageContent>;

    for (const language of ['en', 'fr'] as const) {
        requireText(content.title?.[language], `title.${language}`);
        requireText(content.sourceLinkLabel?.[language], `sourceLinkLabel.${language}`);

        const sections = content.sections?.[language];
        if (!Array.isArray(sections)) throw new Error(`Missing resources sections for ${language}.`);
        const expectedSections = localContent.sections[language];
        if (sections.length !== expectedSections.length) {
            throw new Error(`Expected ${expectedSections.length} ${language} resource sections, received ${sections.length}.`);
        }

        sections.forEach((section, sectionIndex) => {
            const expectedSection = expectedSections[sectionIndex];
            if (section.id !== expectedSection.id) {
                throw new Error(`Unexpected ${language} resource section ID at position ${sectionIndex + 1}.`);
            }
            requireText(section.title, `sections.${language}.${section.id}.title`);
            if (!Array.isArray(section.items) || section.items.length !== expectedSection.items.length) {
                throw new Error(
                    `Expected ${expectedSection.items.length} items in ${language} section ${section.id}.`,
                );
            }
            section.items.forEach((item, itemIndex) => {
                const expectedItem = expectedSection.items[itemIndex];
                if (item.id !== expectedItem.id) {
                    throw new Error(`Unexpected ${language} resource item ID at ${section.id}, position ${itemIndex + 1}.`);
                }
                requireText(item.text, `sections.${language}.${section.id}.${item.id}.text`);
                validateUrl(item.url, `sections.${language}.${section.id}.${item.id}.url`);
            });
        });
    }
}

export async function getResourcesPageContent(): Promise<ResourcesPageContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localContent;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(resourcesQuery);
    validateContent(content);
    return content;
}
