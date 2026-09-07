import {env} from '$env/dynamic/private';
import {
    localizedBibliographySections,
    type BibliographyContentSection,
} from '$lib/data/bibliography-content';
import type {BibliographySegment} from '$lib/data/bibliography-fr';
import {sanityClient} from './sanity';

type Language = 'en' | 'fr';

export type BibliographyPageContent = {
    title: Record<Language, string>;
    sections: Record<Language, BibliographyContentSection[]>;
};

type PortableTextSpan = {
    _type: 'span';
    text: string;
    marks?: string[];
};

type PortableTextLink = {
    _key: string;
    _type: 'externalLink';
    href: string;
};

type PortableTextBlock = {
    _type: 'block';
    style?: string;
    children?: PortableTextSpan[];
    markDefs?: PortableTextLink[];
};

type SanityBibliographySection = {
    id: string;
    title: string;
    items: {id: string; content: PortableTextBlock[]}[];
};

type SanityBibliographyDocument = {
    title?: Partial<Record<Language, unknown>>;
    sections?: Partial<Record<Language, SanityBibliographySection[]>>;
};

const localContent: BibliographyPageContent = {
    title: {en: 'Bibliography', fr: 'Bibliographie'},
    sections: localizedBibliographySections,
};

const bibliographyQuery = `*[_id == "bibliographyPage"][0]{
  "title": {"en": titleEn, "fr": titleFr},
  "sections": {
    "en": sectionsEn[]{"id": sectionId, title, "items": entries[]{"id": entryId, content}},
    "fr": sectionsFr[]{"id": sectionId, title, "items": entries[]{"id": entryId, content}}
  }
}`;

function requireText(value: unknown, path: string): asserts value is string {
    if (typeof value !== 'string' || value === '') {
        throw new Error(`Missing required bibliography content at ${path}.`);
    }
}

function portableTextToSegments(content: PortableTextBlock[], path: string): BibliographySegment[] {
    if (!Array.isArray(content) || content.length !== 1) {
        throw new Error(`Bibliography entry ${path} must contain exactly one paragraph.`);
    }
    const block = content[0];
    if (block?._type !== 'block' || (block.style ?? 'normal') !== 'normal' || !Array.isArray(block.children)) {
        throw new Error(`Bibliography entry ${path} contains an unsupported block.`);
    }

    const links = new Map<string, string>();
    for (const mark of block.markDefs ?? []) {
        if (mark._type !== 'externalLink') {
            throw new Error(`Bibliography entry ${path} contains an unsupported annotation.`);
        }
        const parsed = new URL(mark.href);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error(`Bibliography entry ${path} contains an unsupported link protocol.`);
        }
        links.set(mark._key, mark.href);
    }

    return block.children.map((child, spanIndex) => {
        if (child._type !== 'span') {
            throw new Error(`Bibliography entry ${path}, span ${spanIndex + 1}, is not text.`);
        }
        requireText(child.text, `${path}.span${spanIndex + 1}`);
        const segment: BibliographySegment = {text: child.text};
        for (const mark of child.marks ?? []) {
            if (mark === 'strong') segment.bold = true;
            else if (mark === 'em') segment.italic = true;
            else if (links.has(mark)) segment.href = links.get(mark);
            else throw new Error(`Bibliography entry ${path} contains unsupported mark ${mark}.`);
        }
        return segment;
    });
}

function validateAndConvert(value: unknown): BibliographyPageContent {
    if (!value || typeof value !== 'object') throw new Error('The bibliography document is missing.');
    const document = value as SanityBibliographyDocument;
    const result: BibliographyPageContent = {title: {en: '', fr: ''}, sections: {en: [], fr: []}};

    for (const language of ['en', 'fr'] as const) {
        const title = document.title?.[language];
        requireText(title, `title.${language}`);
        result.title[language] = title;

        const sections = document.sections?.[language];
        if (!Array.isArray(sections)) throw new Error(`Missing bibliography sections for ${language}.`);
        const expectedSections = localContent.sections[language];
        if (sections.length !== expectedSections.length) {
            throw new Error(`Expected ${expectedSections.length} ${language} bibliography sections, received ${sections.length}.`);
        }

        result.sections[language] = sections.map((section, sectionIndex) => {
            const expectedSection = expectedSections[sectionIndex];
            if (section.id !== expectedSection.id) {
                throw new Error(`Unexpected ${language} bibliography section ID at position ${sectionIndex + 1}.`);
            }
            requireText(section.title, `sections.${language}.${section.id}.title`);
            if (!Array.isArray(section.items) || section.items.length !== expectedSection.items.length) {
                throw new Error(`Expected ${expectedSection.items.length} entries in ${language} section ${section.id}.`);
            }
            return {
                id: section.id as BibliographyContentSection['id'],
                title: section.title,
                items: section.items.map((item, itemIndex) => {
                    const expectedItem = expectedSection.items[itemIndex];
                    if (item.id !== expectedItem.id) {
                        throw new Error(`Unexpected ${language} bibliography entry ID at ${section.id}, position ${itemIndex + 1}.`);
                    }
                    return {
                        id: item.id,
                        segments: portableTextToSegments(item.content, `${language}.${item.id}`),
                    };
                }),
            };
        });
    }

    return result;
}

export async function getBibliographyPageContent(): Promise<BibliographyPageContent> {
    const source = env.CONTENT_SOURCE ?? 'local';
    if (source === 'local') return localContent;
    if (source !== 'sanity') {
        throw new Error(`CONTENT_SOURCE must be "local" or "sanity", received "${source}".`);
    }

    const content: unknown = await sanityClient.fetch(bibliographyQuery);
    return validateAndConvert(content);
}
