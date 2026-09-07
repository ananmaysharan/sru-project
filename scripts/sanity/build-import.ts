import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
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

const documents = [resourcesDocument];
const errors = compareResourceLanguages();
const englishItemCount = localizedResourceSections.en.reduce(
    (total, section) => total + section.items.length,
    0,
);
const frenchItemCount = localizedResourceSections.fr.reduce(
    (total, section) => total + section.items.length,
    0,
);

console.log('Sanity content import report');
console.log(`Documents ready: ${documents.length}`);
console.log(`Resource sections: ${localizedResourceSections.en.length} English, ${localizedResourceSections.fr.length} French`);
console.log(`Resource entries: ${englishItemCount} English, ${frenchItemCount} French`);
console.log(`Relationship errors: ${errors.length}`);

if (errors.length > 0) {
    errors.forEach((error) => console.error(`ERROR: ${error}`));
    process.exitCode = 1;
} else {
    console.log('All resource IDs, counts, and links match across languages.');
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
