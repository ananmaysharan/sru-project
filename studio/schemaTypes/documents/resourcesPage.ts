import {defineArrayMember, defineField, defineType} from 'sanity'
import {bilingualString, languageGroups} from '../helpers'

export const resourcesPage = defineType({
  name: 'resourcesPage',
  title: 'News sources page',
  type: 'document',
  groups: languageGroups,
  fields: [
    ...bilingualString('title', 'Page title'),
    ...bilingualString('sourceLinkLabel', 'Source link label'),
    defineField({
      name: 'sectionsEn',
      title: 'News source sections (English)',
      type: 'array',
      group: 'english',
      description: 'Section and entry order are fixed. Sorting is disabled.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'resourceSection'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'sectionsFr',
      title: 'News source sections (French)',
      type: 'array',
      group: 'french',
      description: 'Section and entry order are fixed. Sorting is disabled.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'resourceSection'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {prepare: () => ({title: 'News sources page'})},
})
