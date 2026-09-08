import {defineArrayMember, defineField, defineType} from 'sanity'
import {bilingualRichText, bilingualString, bilingualText, languageGroups} from '../helpers'

export const introductionPage = defineType({
  name: 'introductionPage',
  title: 'Introduction page',
  type: 'document',
  groups: languageGroups,
  fields: [
    ...bilingualString('heroTitle', 'Hero title'),
    ...bilingualString('byline', 'Byline'),
    ...bilingualRichText(
      'heroIntroduction',
      'Hero introduction',
      'The paragraphs and links shown over the hero image.',
    ),
    ...bilingualString('supportersTitle', 'Supporters heading'),
    ...bilingualString('storyHousingTitle', 'Housing story heading'),
    ...bilingualText('storyHousingBody', 'Housing story description'),
    ...bilingualString('storyNewsTitle', 'News story heading'),
    ...bilingualText('storyNewsBody', 'News story description'),
    ...bilingualRichText(
      'pageContent',
      'Introduction and dashboard guide',
      'Keep the existing heading levels and paragraph order.',
    ),
    ...bilingualRichText('acknowledgements', 'Acknowledgements'),
    defineField({
      name: 'endnotesEn',
      title: 'Introduction notes (English)',
      type: 'array',
      group: 'english',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'endnote'})],
      validation: (rule) => rule.required().length(8),
    }),
    defineField({
      name: 'endnotesFr',
      title: 'Introduction notes (French)',
      type: 'array',
      group: 'french',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'endnote'})],
      validation: (rule) => rule.required().length(8),
    }),
  ],
  preview: {prepare: () => ({title: 'Introduction page'})},
})
