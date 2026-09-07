import {defineArrayMember, defineField, defineType} from 'sanity'
import {bilingualString, languageGroups} from '../helpers'

export const bibliographyPage = defineType({
  name: 'bibliographyPage',
  title: 'Bibliography page',
  type: 'document',
  groups: languageGroups,
  fields: [
    ...bilingualString('title', 'Page title'),
    defineField({
      name: 'sectionsEn',
      title: 'Bibliography sections (English)',
      type: 'array',
      group: 'english',
      description: 'Section and entry order are fixed. Sorting is disabled.',
      options: {sortable: false},
      of: [defineArrayMember({type: 'bibliographySection'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'sectionsFr',
      title: 'Bibliography sections (French)',
      type: 'array',
      group: 'french',
      description: 'Section and entry order are fixed. Sorting is disabled.',
      options: {sortable: false},
      of: [defineArrayMember({type: 'bibliographySection'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {prepare: () => ({title: 'Bibliography page'})},
})
