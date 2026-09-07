import {bibliographyPage} from './documents/bibliographyPage'
import {healthOutcomesPage} from './documents/healthOutcomesPage'
import {introductionPage} from './documents/introductionPage'
import {postOccupancyPage} from './documents/postOccupancyPage'
import {resourcesPage} from './documents/resourcesPage'
import {siteSettings} from './documents/siteSettings'
import {supplyPage} from './documents/supplyPage'
import {
  bibliographyEntry,
  bibliographySection,
  endnote,
  imageCaption,
  metricDefinition,
  projectCard,
  projectCardField,
  residentQuote,
  residentTopic,
  resourceItem,
  resourceSection,
} from './contentObjects'
import {restrictedRichText} from './restrictedRichText'

export const schemaTypes = [
  restrictedRichText,
  endnote,
  metricDefinition,
  imageCaption,
  projectCardField,
  projectCard,
  residentQuote,
  residentTopic,
  resourceItem,
  resourceSection,
  bibliographyEntry,
  bibliographySection,
  siteSettings,
  introductionPage,
  supplyPage,
  healthOutcomesPage,
  postOccupancyPage,
  resourcesPage,
  bibliographyPage,
]
