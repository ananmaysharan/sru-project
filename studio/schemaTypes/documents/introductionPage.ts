import {defineArrayMember, defineField, defineType} from 'sanity'
import {bilingualRichText, bilingualString, languageGroups} from '../helpers'

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
    }),
  ],
  preview: {prepare: () => ({title: 'Introduction page'})},
})
