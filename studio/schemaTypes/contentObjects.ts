import {defineArrayMember, defineField, defineType} from 'sanity'

export const endnote = defineType({
  name: 'endnote',
  title: 'Endnote',
  type: 'object',
  fields: [
    defineField({
      name: 'noteId',
      title: 'Permanent note ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'number',
      title: 'Displayed note number',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'body',
      title: 'Note text',
      type: 'restrictedRichText',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {select: {title: 'noteId'}},
})

export const metricDefinition = defineType({
  name: 'metricDefinition',
  title: 'Metric definition',
  type: 'object',
  fields: [
    defineField({
      name: 'metricId',
      title: 'Permanent metric ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'metricId'}},
})

export const imageCaption = defineType({
  name: 'imageCaption',
  title: 'Image caption',
  type: 'object',
  fields: [
    defineField({
      name: 'imageId',
      title: 'Permanent image ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'imageId', subtitle: 'caption'}},
})

export const projectCardField = defineType({
  name: 'projectCardField',
  title: 'Project information field',
  type: 'object',
  fields: [
    defineField({
      name: 'fieldId',
      title: 'Permanent field ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Optional web address',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'value'}},
})

export const projectCard = defineType({
  name: 'projectCard',
  title: 'Project information card',
  type: 'object',
  fields: [
    defineField({
      name: 'projectId',
      title: 'Permanent project ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fields',
      title: 'Information fields',
      type: 'array',
      description: 'The field order is fixed by the website.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'projectCardField'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'projectId'}},
})

export const residentQuote = defineType({
  name: 'residentQuote',
  title: 'Resident quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quoteId',
      title: 'Permanent quote ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {select: {title: 'quoteId', subtitle: 'text'}},
})

export const residentTopic = defineType({
  name: 'residentTopic',
  title: 'Resident topic',
  type: 'object',
  fields: [
    defineField({
      name: 'topicId',
      title: 'Permanent topic ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Topic heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      description: 'Quote order and count are fixed by the website.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'residentQuote'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'topicId'}},
})

export const resourceItem = defineType({
  name: 'resourceItem',
  title: 'News source',
  type: 'object',
  fields: [
    defineField({
      name: 'itemId',
      title: 'Permanent item ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Optional source web address',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {select: {title: 'itemId', subtitle: 'text'}},
})

export const resourceSection = defineType({
  name: 'resourceSection',
  title: 'News source section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Permanent section ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Entries',
      type: 'array',
      description: 'Entry order and count are fixed by the website.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'resourceItem'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'sectionId'}},
})

export const bibliographyEntry = defineType({
  name: 'bibliographyEntry',
  title: 'Bibliography entry',
  type: 'object',
  fields: [
    defineField({
      name: 'entryId',
      title: 'Permanent entry ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Entry text',
      type: 'restrictedRichText',
      validation: (rule) => rule.required().min(1).max(1),
    }),
  ],
  preview: {select: {title: 'entryId'}},
})

export const bibliographySection = defineType({
  name: 'bibliographySection',
  title: 'Bibliography section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Permanent section ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'entries',
      title: 'Entries',
      type: 'array',
      description: 'Entry order and count are fixed by the website.',
      options: {
        sortable: false,
        disableActions: ['add', 'addBefore', 'addAfter', 'remove', 'duplicate', 'copy'],
      },
      of: [defineArrayMember({type: 'bibliographyEntry'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'sectionId'}},
})
