import {defineType} from 'sanity'
import {bilingualString, languageGroups} from '../helpers'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: languageGroups,
  fields: [
    ...bilingualString('siteTitle', 'Browser title'),
    ...bilingualString('skipLink', 'Skip to main content link'),
    ...bilingualString('introductionNav', 'Introduction navigation label'),
    ...bilingualString('supplyNav', 'Supply navigation label'),
    ...bilingualString('healthNav', 'Health outcomes navigation label'),
    ...bilingualString('postOccupancyNav', 'Post occupancy navigation label'),
    ...bilingualString('resourcesNav', 'News sources navigation label'),
    ...bilingualString('bibliographyNav', 'Bibliography navigation label'),
    ...bilingualString('previousPage', 'Previous page label'),
    ...bilingualString('nextPage', 'Next page label'),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
