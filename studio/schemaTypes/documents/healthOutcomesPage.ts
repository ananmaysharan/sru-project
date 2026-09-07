import {defineArrayMember, defineField, defineType} from 'sanity'
import {bilingualRichText, bilingualString, bilingualText, languageGroups} from '../helpers'

export const healthOutcomesPage = defineType({
  name: 'healthOutcomesPage',
  title: 'Health outcomes page',
  type: 'document',
  groups: languageGroups,
  fields: [
    ...bilingualString('title', 'Page title'),
    ...bilingualString('deck', 'Page subtitle'),
    ...bilingualText('introduction', 'Introduction'),
    ...bilingualString('cornerTitle', 'Opportunity map heading'),
    ...bilingualString('chartTitle', 'Commune chart heading'),
    ...bilingualText('chartBody', 'Commune chart description'),
    ...bilingualString('definitionsTitle', 'Metric definitions heading'),
    defineField({
      name: 'metricDefinitionsEn',
      title: 'Metric definitions (English)',
      type: 'array',
      group: 'english',
      description: 'Metric order and IDs are fixed by the chart.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'metricDefinition'})],
      validation: (rule) => rule.required().length(9),
    }),
    defineField({
      name: 'metricDefinitionsFr',
      title: 'Metric definitions (French)',
      type: 'array',
      group: 'french',
      description: 'Metric order and IDs are fixed by the chart.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'metricDefinition'})],
      validation: (rule) => rule.required().length(9),
    }),
    ...bilingualRichText('methods', 'Methods text'),
  ],
  preview: {prepare: () => ({title: 'Health outcomes page'})},
})
