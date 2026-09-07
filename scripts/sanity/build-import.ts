import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {
    localizedBibliographySections,
    type BibliographyContentItem,
    type BibliographyContentSection,
} from '../../src/lib/data/bibliography-content';
import {localizedResourceSections, type ResourceContentSection} from '../../src/lib/data/resource-content';

type SanityResourceItem = {
    _key: string;
    _type: 'resourceItem';
    itemId: string;
    text: string;
    url?: string;
};

type SanityResourceSection = {
    _key: string;
    _type: 'resourceSection';
    sectionId: string;
    title: string;
    items: SanityResourceItem[];
};

function bibliographyBlock(item: BibliographyContentItem) {
    let linkIndex = 0;
    const markDefs: {_key: string; _type: 'externalLink'; href: string}[] = [];
    const children = item.segments.map((segment, segmentIndex) => {
        const marks: string[] = [];
        if (segment.bold) marks.push('strong');
        if (segment.italic) marks.push('em');
        if (segment.href) {
            linkIndex += 1;
            const linkKey = `${item.id}-link-${linkIndex}`;
            markDefs.push({_key: linkKey, _type: 'externalLink', href: segment.href});
            marks.push(linkKey);
        }
        return {
            _key: `${item.id}-span-${segmentIndex + 1}`,
            _type: 'span',
            marks,
            text: segment.text,
        };
    });

    return [{_key: `${item.id}-block`, _type: 'block', style: 'normal', markDefs, children}];
}

function toSanityBibliographySections(sections: BibliographyContentSection[]) {
    return sections.map((section) => ({
        _key: section.id,
        _type: 'bibliographySection',
        sectionId: section.id,
        title: section.title,
        entries: section.items.map((item) => ({
            _key: item.id,
            _type: 'bibliographyEntry',
            entryId: item.id,
            content: bibliographyBlock(item),
        })),
    }));
}

function toSanitySections(sections: ResourceContentSection[]): SanityResourceSection[] {
    return sections.map((section) => ({
        _key: section.id,
        _type: 'resourceSection',
        sectionId: section.id,
        title: section.title,
        items: section.items.map((item) => ({
            _key: item.id,
            _type: 'resourceItem',
            itemId: item.id,
            text: item.text,
            ...(item.url ? {url: item.url} : {}),
        })),
    }));
}

function compareResourceLanguages() {
    const errors: string[] = [];

    localizedResourceSections.en.forEach((englishSection, sectionIndex) => {
        const frenchSection = localizedResourceSections.fr[sectionIndex];
        if (!frenchSection || frenchSection.id !== englishSection.id) {
            errors.push(`Resource section ${englishSection.id} does not have a matching French section.`);
            return;
        }

        englishSection.items.forEach((englishItem, itemIndex) => {
            const frenchItem = frenchSection.items[itemIndex];
            if (!frenchItem || frenchItem.id !== englishItem.id) {
                errors.push(`Resource item ${englishItem.id} does not have a matching French item.`);
                return;
            }
            if (frenchItem.url !== englishItem.url) {
                errors.push(`Resource item ${englishItem.id} has different English and French links.`);
            }
        });
    });

    return errors;
}

const resourcesDocument = {
    _id: 'resourcesPage',
    _type: 'resourcesPage',
    titleEn: 'News Sources',
    titleFr: 'Revue de presse',
    sourceLinkLabelEn: 'Source',
    sourceLinkLabelFr: 'Source',
    sectionsEn: toSanitySections(localizedResourceSections.en),
    sectionsFr: toSanitySections(localizedResourceSections.fr),
};

const bibliographyDocument = {
    _id: 'bibliographyPage',
    _type: 'bibliographyPage',
    titleEn: 'Bibliography',
    titleFr: 'Bibliographie',
    sectionsEn: toSanityBibliographySections(localizedBibliographySections.en),
    sectionsFr: toSanityBibliographySections(localizedBibliographySections.fr),
};

const documents = [resourcesDocument, bibliographyDocument];
const errors = compareResourceLanguages();
const englishItemCount = localizedResourceSections.en.reduce(
    (total, section) => total + section.items.length,
    0,
);
const frenchItemCount = localizedResourceSections.fr.reduce(
    (total, section) => total + section.items.length,
    0,
);
const englishBibliographyCount = localizedBibliographySections.en.reduce(
    (total, section) => total + section.items.length,
    0,
);
const frenchBibliographyCount = localizedBibliographySections.fr.reduce(
    (total, section) => total + section.items.length,
    0,
);

console.log('Sanity content import report');
console.log(`Documents ready: ${documents.length}`);
console.log(`Resource sections: ${localizedResourceSections.en.length} English, ${localizedResourceSections.fr.length} French`);
console.log(`Resource entries: ${englishItemCount} English, ${frenchItemCount} French`);
console.log(`Bibliography sections: ${localizedBibliographySections.en.length} English, ${localizedBibliographySections.fr.length} French`);
console.log(`Bibliography entries: ${englishBibliographyCount} English, ${frenchBibliographyCount} French`);
console.log(`Relationship errors: ${errors.length}`);

if (errors.length > 0) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    process.exitCode = 1;
} else {
    console.log('All fixed content IDs, counts, formatting spans, and links match across languages.');
}

const outputFlagIndex = process.argv.indexOf('--output');
if (outputFlagIndex !== -1 && process.exitCode !== 1) {
    const requestedPath = process.argv[outputFlagIndex + 1];
    if (!requestedPath) throw new Error('The --output option requires a file path.');
    const outputPath = resolve(requestedPath);
    await mkdir(dirname(outputPath), {recursive: true});
    await writeFile(outputPath, `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`, 'utf8');
    console.log(`Wrote ${documents.length} document to ${outputPath}`);
}
