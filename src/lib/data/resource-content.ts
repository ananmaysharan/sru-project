import {resourceSections} from './resources/sru-news-index';
import {resourceSectionsFr} from './resources-fr';

const sectionIds = ['direct-sru-news', 'indirect-sru-news'] as const;

export type ResourceContentItem = {
    id: string;
    text: string;
    url: string | null;
};

export type ResourceContentSection = {
    id: (typeof sectionIds)[number];
    title: string;
    items: ResourceContentItem[];
};

function addPermanentIds(
    sections: typeof resourceSections,
    language: 'en' | 'fr',
): ResourceContentSection[] {
    if (sections.length !== sectionIds.length) {
        throw new Error(`Expected ${sectionIds.length} ${language} resource sections, received ${sections.length}.`);
    }

    return sections.map((section, sectionIndex) => ({
        id: sectionIds[sectionIndex],
        title: section.title,
        items: section.items.map((item, itemIndex) => ({
            id: `${sectionIds[sectionIndex]}-${String(itemIndex + 1).padStart(3, '0')}`,
            ...item,
        })),
    }));
}

export const localizedResourceSections = {
    en: addPermanentIds(resourceSections, 'en'),
    fr: addPermanentIds(resourceSectionsFr, 'fr'),
};

for (let sectionIndex = 0; sectionIndex < sectionIds.length; sectionIndex += 1) {
    const englishCount = localizedResourceSections.en[sectionIndex].items.length;
    const frenchCount = localizedResourceSections.fr[sectionIndex].items.length;
    if (englishCount !== frenchCount) {
        throw new Error(
            `Resource section ${sectionIds[sectionIndex]} has ${englishCount} English entries and ${frenchCount} French entries.`,
        );
    }
}
