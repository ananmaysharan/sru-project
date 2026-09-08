import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {
    localizedBibliographySections,
    type BibliographyContentItem,
    type BibliographyContentSection,
} from '../../src/lib/data/bibliography-content';
import {localizedResourceSections, type ResourceContentSection} from '../../src/lib/data/resource-content';
import {localSiteSettings} from '../../src/lib/data/site-content';
import {localSupplyText} from '../../src/lib/data/supply-content';
import {localHealthMetricDefinitions, localHealthText} from '../../src/lib/data/health-content';
import {
    localAcknowledgements,
    localHeroIntroduction,
    localIntroductionText,
} from '../../src/lib/data/introduction-content';
import {CASE_STUDY_IMAGE_IDS} from '../../src/lib/data/case-study-ids';
import {
    localPostOccupancyCaptions,
    localPostOccupancyIntroduction,
    localPostOccupancyText,
    localResidentTopics,
} from '../../src/lib/data/post-occupancy-content';
import {
    PROJECT_CARD_FIELD_IDS,
    PROJECT_CARD_IDS,
    projectIdCards,
} from '../../src/lib/data/project-id-cards';
import {parseEditorialStory} from '../../src/lib/utils/editorial-markdown';
import {editorialStoryToPortableText} from './editorial-portable-text';

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

const siteSettingsDocument = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitleEn: localSiteSettings.siteTitle.en,
    siteTitleFr: localSiteSettings.siteTitle.fr,
    skipLinkEn: localSiteSettings.skipLink.en,
    skipLinkFr: localSiteSettings.skipLink.fr,
    introductionNavEn: localSiteSettings.navigation.en['/'],
    introductionNavFr: localSiteSettings.navigation.fr['/'],
    supplyNavEn: localSiteSettings.navigation.en['/supply'],
    supplyNavFr: localSiteSettings.navigation.fr['/supply'],
    healthNavEn: localSiteSettings.navigation.en['/health-outcomes'],
    healthNavFr: localSiteSettings.navigation.fr['/health-outcomes'],
    postOccupancyNavEn: localSiteSettings.navigation.en['/post-occupancy-evaluation'],
    postOccupancyNavFr: localSiteSettings.navigation.fr['/post-occupancy-evaluation'],
    resourcesNavEn: localSiteSettings.navigation.en['/resources'],
    resourcesNavFr: localSiteSettings.navigation.fr['/resources'],
    bibliographyNavEn: localSiteSettings.navigation.en['/bibliography'],
    bibliographyNavFr: localSiteSettings.navigation.fr['/bibliography'],
    previousPageEn: localSiteSettings.previousPage.en,
    previousPageFr: localSiteSettings.previousPage.fr,
    nextPageEn: localSiteSettings.nextPage.en,
    nextPageFr: localSiteSettings.nextPage.fr,
    glossaryTitleEn: localSiteSettings.glossary.en.title,
    glossaryTitleFr: localSiteSettings.glossary.fr.title,
    glossarySocialStockTermEn: localSiteSettings.glossary.en.socialStockTerm,
    glossarySocialStockTermFr: localSiteSettings.glossary.fr.socialStockTerm,
    glossarySocialStockDefinitionEn: localSiteSettings.glossary.en.socialStockDefinition,
    glossarySocialStockDefinitionFr: localSiteSettings.glossary.fr.socialStockDefinition,
    glossaryQpvTermEn: localSiteSettings.glossary.en.qpvTerm,
    glossaryQpvTermFr: localSiteSettings.glossary.fr.qpvTerm,
    glossaryQpvDefinitionEn: localSiteSettings.glossary.en.qpvDefinition,
    glossaryQpvDefinitionFr: localSiteSettings.glossary.fr.qpvDefinition,
    glossaryFinancingTitleEn: localSiteSettings.glossary.en.financingTitle,
    glossaryFinancingTitleFr: localSiteSettings.glossary.fr.financingTitle,
    glossaryPlaiEn: localSiteSettings.glossary.en.plai,
    glossaryPlaiFr: localSiteSettings.glossary.fr.plai,
    glossaryPlusEn: localSiteSettings.glossary.en.plus,
    glossaryPlusFr: localSiteSettings.glossary.fr.plus,
    glossaryPlsEn: localSiteSettings.glossary.en.pls,
    glossaryPlsFr: localSiteSettings.glossary.fr.pls,
    glossaryPliEn: localSiteSettings.glossary.en.pli,
    glossaryPliFr: localSiteSettings.glossary.fr.pli,
    glossaryProvidersTitleEn: localSiteSettings.glossary.en.providersTitle,
    glossaryProvidersTitleFr: localSiteSettings.glossary.fr.providersTitle,
    glossaryOphEn: localSiteSettings.glossary.en.oph,
    glossaryOphFr: localSiteSettings.glossary.fr.oph,
    glossaryEshEn: localSiteSettings.glossary.en.esh,
    glossaryEshFr: localSiteSettings.glossary.fr.esh,
    glossarySemEn: localSiteSettings.glossary.en.sem,
    glossarySemFr: localSiteSettings.glossary.fr.sem,
};

const englishEditorialSource = await readFile(
    new URL('../../src/lib/data/editorial-content.md', import.meta.url),
    'utf8',
);
const frenchEditorialSource = await readFile(
    new URL('../../src/lib/data/editorial-content.fr.md', import.meta.url),
    'utf8',
);
const supplyMethods = {
    en: editorialStoryToPortableText(
        parseEditorialStory(englishEditorialSource, 'supply'),
        'en',
        'supply',
    ),
    fr: editorialStoryToPortableText(
        parseEditorialStory(frenchEditorialSource, 'supply'),
        'fr',
        'supply',
    ),
};

const supplyDocument = {
    _id: 'supplyPage',
    _type: 'supplyPage',
    titleEn: localSupplyText.en.title,
    titleFr: localSupplyText.fr.title,
    deckEn: localSupplyText.en.deck,
    deckFr: localSupplyText.fr.deck,
    introductionEn: localSupplyText.en.intro,
    introductionFr: localSupplyText.fr.intro,
    nationalTitleEn: localSupplyText.en.nationalTitle,
    nationalTitleFr: localSupplyText.fr.nationalTitle,
    nationalSourceEn: localSupplyText.en.source,
    nationalSourceFr: localSupplyText.fr.source,
    tenureTitleEn: localSupplyText.en.tenureTitle,
    tenureTitleFr: localSupplyText.fr.tenureTitle,
    tenureCaptionEn: localSupplyText.en.tenureCaption,
    tenureCaptionFr: localSupplyText.fr.tenureCaption,
    regionalTitleEn: localSupplyText.en.regionalTitle,
    regionalTitleFr: localSupplyText.fr.regionalTitle,
    regionalBodyEn: localSupplyText.en.regionalBody,
    regionalBodyFr: localSupplyText.fr.regionalBody,
    distributionTitleEn: localSupplyText.en.distributionTitle,
    distributionTitleFr: localSupplyText.fr.distributionTitle,
    distributionCaptionEn: localSupplyText.en.distributionCaption,
    distributionCaptionFr: localSupplyText.fr.distributionCaption,
    rateTitleEn: localSupplyText.en.rateTitle,
    rateTitleFr: localSupplyText.fr.rateTitle,
    rateCaptionEn: localSupplyText.en.rateCaption,
    rateCaptionFr: localSupplyText.fr.rateCaption,
    mapTitleEn: localSupplyText.en.mapTitle,
    mapTitleFr: localSupplyText.fr.mapTitle,
    mapBodyEn: localSupplyText.en.mapBody,
    mapBodyFr: localSupplyText.fr.mapBody,
    noncomplianceTitleEn: localSupplyText.en.noncomplianceTitle,
    noncomplianceTitleFr: localSupplyText.fr.noncomplianceTitle,
    noncomplianceDeckEn: localSupplyText.en.noncomplianceDeck,
    noncomplianceDeckFr: localSupplyText.fr.noncomplianceDeck,
    noncomplianceBodyEn: localSupplyText.en.noncomplianceBody,
    noncomplianceBodyFr: localSupplyText.fr.noncomplianceBody,
    overseasTitleEn: localSupplyText.en.overseasTitle,
    overseasTitleFr: localSupplyText.fr.overseasTitle,
    overseasBodyEn: localSupplyText.en.overseasBody,
    overseasBodyFr: localSupplyText.fr.overseasBody,
    europeTitleEn: localSupplyText.en.europeTitle,
    europeTitleFr: localSupplyText.fr.europeTitle,
    europeBodyEn: localSupplyText.en.europeBody,
    europeBodyFr: localSupplyText.fr.europeBody,
    methodsEn: supplyMethods.en.blocks,
    methodsFr: supplyMethods.fr.blocks,
    endnotesEn: supplyMethods.en.endnotes,
    endnotesFr: supplyMethods.fr.endnotes,
};

const healthMethods = {
    en: editorialStoryToPortableText(
        parseEditorialStory(englishEditorialSource, 'health-method'),
        'en',
        'health-method',
    ),
    fr: editorialStoryToPortableText(
        parseEditorialStory(frenchEditorialSource, 'health-method'),
        'fr',
        'health-method',
    ),
};

function toSanityMetricDefinitions(language: 'en' | 'fr') {
    return localHealthMetricDefinitions[language].map((definition) => ({
        _key: definition.id,
        _type: 'metricDefinition',
        metricId: definition.id,
        label: definition.label,
        description: definition.description,
    }));
}

const healthDocument = {
    _id: 'healthOutcomesPage',
    _type: 'healthOutcomesPage',
    titleEn: localHealthText.en.title,
    titleFr: localHealthText.fr.title,
    deckEn: localHealthText.en.deck,
    deckFr: localHealthText.fr.deck,
    introductionEn: localHealthText.en.intro,
    introductionFr: localHealthText.fr.intro,
    cornerTitleEn: localHealthText.en.cornerTitle,
    cornerTitleFr: localHealthText.fr.cornerTitle,
    chartTitleEn: localHealthText.en.chartTitle,
    chartTitleFr: localHealthText.fr.chartTitle,
    chartBodyEn: localHealthText.en.chartBody,
    chartBodyFr: localHealthText.fr.chartBody,
    definitionsTitleEn: localHealthText.en.definitions,
    definitionsTitleFr: localHealthText.fr.definitions,
    metricDefinitionsEn: toSanityMetricDefinitions('en'),
    metricDefinitionsFr: toSanityMetricDefinitions('fr'),
    methodsEn: healthMethods.en.blocks,
    methodsFr: healthMethods.fr.blocks,
    endnotesEn: healthMethods.en.endnotes,
    endnotesFr: healthMethods.fr.endnotes,
};

const introductionStories = {
    en: {
        hero: editorialStoryToPortableText(localHeroIntroduction.en, 'en', 'introduction-hero'),
        introduction: editorialStoryToPortableText(
            parseEditorialStory(englishEditorialSource, 'introduction'),
            'en',
            'introduction',
        ),
        dashboardGuide: editorialStoryToPortableText(
            parseEditorialStory(englishEditorialSource, 'dashboard-guide'),
            'en',
            'dashboard-guide',
        ),
        acknowledgements: editorialStoryToPortableText(localAcknowledgements.en, 'en', 'acknowledgements'),
    },
    fr: {
        hero: editorialStoryToPortableText(localHeroIntroduction.fr, 'fr', 'introduction-hero'),
        introduction: editorialStoryToPortableText(
            parseEditorialStory(frenchEditorialSource, 'introduction'),
            'fr',
            'introduction',
        ),
        dashboardGuide: editorialStoryToPortableText(
            parseEditorialStory(frenchEditorialSource, 'dashboard-guide'),
            'fr',
            'dashboard-guide',
        ),
        acknowledgements: editorialStoryToPortableText(localAcknowledgements.fr, 'fr', 'acknowledgements'),
    },
};

const introductionDocument = {
    _id: 'introductionPage',
    _type: 'introductionPage',
    heroTitleEn: localIntroductionText.en.heroTitle,
    heroTitleFr: localIntroductionText.fr.heroTitle,
    bylineEn: localIntroductionText.en.byline,
    bylineFr: localIntroductionText.fr.byline,
    heroIntroductionEn: introductionStories.en.hero.blocks,
    heroIntroductionFr: introductionStories.fr.hero.blocks,
    supportersTitleEn: localIntroductionText.en.supportersTitle,
    supportersTitleFr: localIntroductionText.fr.supportersTitle,
    storyHousingTitleEn: localIntroductionText.en.storyHousingTitle,
    storyHousingTitleFr: localIntroductionText.fr.storyHousingTitle,
    storyHousingBodyEn: localIntroductionText.en.storyHousingBody,
    storyHousingBodyFr: localIntroductionText.fr.storyHousingBody,
    storyNewsTitleEn: localIntroductionText.en.storyNewsTitle,
    storyNewsTitleFr: localIntroductionText.fr.storyNewsTitle,
    storyNewsBodyEn: localIntroductionText.en.storyNewsBody,
    storyNewsBodyFr: localIntroductionText.fr.storyNewsBody,
    pageContentEn: [
        ...introductionStories.en.introduction.blocks,
        ...introductionStories.en.dashboardGuide.blocks,
    ],
    pageContentFr: [
        ...introductionStories.fr.introduction.blocks,
        ...introductionStories.fr.dashboardGuide.blocks,
    ],
    acknowledgementsEn: introductionStories.en.acknowledgements.blocks,
    acknowledgementsFr: introductionStories.fr.acknowledgements.blocks,
    endnotesEn: introductionStories.en.introduction.endnotes,
    endnotesFr: introductionStories.fr.introduction.endnotes,
};

const postOccupancyStories = {
    en: {
        introduction: editorialStoryToPortableText(
            localPostOccupancyIntroduction.en,
            'en',
            'post-occupancy-introduction',
        ),
        conclusion: editorialStoryToPortableText(
            parseEditorialStory(englishEditorialSource, 'post-occupancy'),
            'en',
            'post-occupancy',
        ),
    },
    fr: {
        introduction: editorialStoryToPortableText(
            localPostOccupancyIntroduction.fr,
            'fr',
            'post-occupancy-introduction',
        ),
        conclusion: editorialStoryToPortableText(
            parseEditorialStory(frenchEditorialSource, 'post-occupancy'),
            'fr',
            'post-occupancy',
        ),
    },
};

function toSanityImageCaptions(language: 'en' | 'fr') {
    return CASE_STUDY_IMAGE_IDS.map((imageId) => ({
        _key: imageId,
        _type: 'imageCaption',
        imageId,
        caption: localPostOccupancyCaptions[language][imageId],
    }));
}

function toSanityProjectCards(language: 'en' | 'fr') {
    return PROJECT_CARD_IDS.map((projectId) => {
        const card = projectIdCards[projectId];
        if (!card) throw new Error(`Missing local project information card ${projectId}.`);
        if (card.fields.length !== PROJECT_CARD_FIELD_IDS.length) {
            throw new Error(`Unexpected local project information field count for ${projectId}.`);
        }
        return {
            _key: projectId,
            _type: 'projectCard',
            projectId,
            title: card.title[language],
            fields: card.fields.map((field, fieldIndex) => ({
                _key: PROJECT_CARD_FIELD_IDS[fieldIndex],
                _type: 'projectCardField',
                fieldId: PROJECT_CARD_FIELD_IDS[fieldIndex],
                label: field.label[language],
                value: field.value[language],
                ...(field.href ? {url: field.href} : {}),
            })),
        };
    });
}

function toSanityResidentTopics(language: 'en' | 'fr') {
    return localResidentTopics[language].map((topic) => ({
        _key: topic.id,
        _type: 'residentTopic',
        topicId: topic.id,
        label: topic.label,
        quotes: topic.quotes.map((text, quoteIndex) => {
            const quoteId = `${topic.id}-${quoteIndex + 1}`;
            return {_key: quoteId, _type: 'residentQuote', quoteId, text};
        }),
    }));
}

const postOccupancyDocument = {
    _id: 'postOccupancyPage',
    _type: 'postOccupancyPage',
    titleEn: localPostOccupancyText.en.title,
    titleFr: localPostOccupancyText.fr.title,
    introductionEn: postOccupancyStories.en.introduction.blocks,
    introductionFr: postOccupancyStories.fr.introduction.blocks,
    residentVoicesTitleEn: localPostOccupancyText.en.residentVoicesTitle,
    residentVoicesTitleFr: localPostOccupancyText.fr.residentVoicesTitle,
    imageCaptionsEn: toSanityImageCaptions('en'),
    imageCaptionsFr: toSanityImageCaptions('fr'),
    projectCardsEn: toSanityProjectCards('en'),
    projectCardsFr: toSanityProjectCards('fr'),
    residentTopicsEn: toSanityResidentTopics('en'),
    residentTopicsFr: toSanityResidentTopics('fr'),
    conclusionEn: postOccupancyStories.en.conclusion.blocks,
    conclusionFr: postOccupancyStories.fr.conclusion.blocks,
    endnotesEn: postOccupancyStories.en.conclusion.endnotes,
    endnotesFr: postOccupancyStories.fr.conclusion.endnotes,
};

const documents = [
    siteSettingsDocument,
    introductionDocument,
    supplyDocument,
    healthDocument,
    postOccupancyDocument,
    resourcesDocument,
    bibliographyDocument,
];
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
console.log(`Supply methods: ${supplyMethods.en.blocks.length} English blocks, ${supplyMethods.fr.blocks.length} French blocks`);
console.log(`Supply endnotes: ${supplyMethods.en.endnotes.length} English, ${supplyMethods.fr.endnotes.length} French`);
console.log(`Health metric definitions: ${localHealthMetricDefinitions.en.length} English, ${localHealthMetricDefinitions.fr.length} French`);
console.log(`Health methods: ${healthMethods.en.blocks.length} English blocks, ${healthMethods.fr.blocks.length} French blocks`);
console.log(`Health endnotes: ${healthMethods.en.endnotes.length} English, ${healthMethods.fr.endnotes.length} French`);
console.log(`Introduction hero: ${introductionStories.en.hero.blocks.length} English blocks, ${introductionStories.fr.hero.blocks.length} French blocks`);
console.log(`Introduction essay: ${introductionStories.en.introduction.blocks.length} English blocks, ${introductionStories.fr.introduction.blocks.length} French blocks`);
console.log(`Dashboard guide: ${introductionStories.en.dashboardGuide.blocks.length} English blocks, ${introductionStories.fr.dashboardGuide.blocks.length} French blocks`);
console.log(`Introduction endnotes: ${introductionStories.en.introduction.endnotes.length} English, ${introductionStories.fr.introduction.endnotes.length} French`);
console.log(`Acknowledgements: ${introductionStories.en.acknowledgements.blocks.length} English blocks, ${introductionStories.fr.acknowledgements.blocks.length} French blocks`);
console.log(`Post-occupancy introduction: ${postOccupancyStories.en.introduction.blocks.length} English blocks, ${postOccupancyStories.fr.introduction.blocks.length} French blocks`);
console.log(`Post-occupancy image captions: ${CASE_STUDY_IMAGE_IDS.length} English, ${CASE_STUDY_IMAGE_IDS.length} French`);
console.log(`Post-occupancy project cards: ${PROJECT_CARD_IDS.length} English, ${PROJECT_CARD_IDS.length} French`);
console.log(`Post-occupancy resident topics: ${localResidentTopics.en.length} English, ${localResidentTopics.fr.length} French`);
console.log(`Post-occupancy resident quotes: ${localResidentTopics.en.reduce((total, topic) => total + topic.quotes.length, 0)} English, ${localResidentTopics.fr.reduce((total, topic) => total + topic.quotes.length, 0)} French`);
console.log(`Post-occupancy conclusion: ${postOccupancyStories.en.conclusion.blocks.length} English blocks, ${postOccupancyStories.fr.conclusion.blocks.length} French blocks`);
console.log(`Post-occupancy endnotes: ${postOccupancyStories.en.conclusion.endnotes.length} English, ${postOccupancyStories.fr.conclusion.endnotes.length} French`);
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
