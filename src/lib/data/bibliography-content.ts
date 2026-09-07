import bibliographySectionsEn from './bibliography-en.generated.json';
import {
    bibliographySectionsFr,
    type BibliographySection,
    type BibliographySegment,
} from './bibliography-fr';

const sectionIds = [
    'peer-reviewed-papers',
    'book-chapters',
    'planning-reports',
    'media-articles',
    'podcasts',
    'exhibitions',
    'media-mentions',
] as const;

export type BibliographyContentItem = {
    id: string;
    segments: BibliographySegment[];
};

export type BibliographyContentSection = {
    id: (typeof sectionIds)[number];
    title: string;
    items: BibliographyContentItem[];
};

function addPermanentIds(
    sections: BibliographySection[],
    language: 'en' | 'fr',
): BibliographyContentSection[] {
    if (sections.length !== sectionIds.length) {
        throw new Error(`Expected ${sectionIds.length} ${language} bibliography sections, received ${sections.length}.`);
    }

    return sections.map((section, sectionIndex) => ({
        id: sectionIds[sectionIndex],
        title: section.title,
        items: section.items.map((item, itemIndex) => ({
            id: `${sectionIds[sectionIndex]}-${String(itemIndex + 1).padStart(2, '0')}`,
            segments: item.segments,
        })),
    }));
}

export const localizedBibliographySections = {
    en: addPermanentIds(bibliographySectionsEn, 'en'),
    fr: addPermanentIds(bibliographySectionsFr, 'fr'),
};

for (let sectionIndex = 0; sectionIndex < sectionIds.length; sectionIndex += 1) {
    const englishSection = localizedBibliographySections.en[sectionIndex];
    const frenchSection = localizedBibliographySections.fr[sectionIndex];
    if (englishSection.items.length !== frenchSection.items.length) {
        throw new Error(
            `Bibliography section ${sectionIds[sectionIndex]} has ${englishSection.items.length} English entries and ${frenchSection.items.length} French entries.`,
        );
    }

    englishSection.items.forEach((englishItem, itemIndex) => {
        const frenchItem = frenchSection.items[itemIndex];
        const englishLinks = englishItem.segments.flatMap((segment) => segment.href ?? []);
        const frenchLinks = frenchItem.segments.flatMap((segment) => segment.href ?? []);
        if (JSON.stringify(englishLinks) !== JSON.stringify(frenchLinks)) {
            throw new Error(`Bibliography entry ${englishItem.id} has different English and French links.`);
        }
    });
}
