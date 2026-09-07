import {defineArrayMember, defineField, defineType} from 'sanity'

export const restrictedRichText = defineType({
  name: 'restrictedRichText',
  title: 'Formatted text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
      ],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineField({
            name: 'externalLink',
            title: 'External link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Web address',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['http', 'https', 'mailto']}),
              }),
            ],
          }),
          defineField({
            name: 'noteReference',
            title: 'Note reference',
            type: 'object',
            fields: [
              defineField({
                name: 'noteId',
                title: 'Permanent note ID',
                type: 'string',
                description: 'This ID controls the note link. Do not change it.',
                readOnly: true,
                validation: (rule) => rule.required(),
              }),
              defineField({
                name: 'number',
                title: 'Displayed note number',
                type: 'number',
                validation: (rule) => rule.required().integer().positive(),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
