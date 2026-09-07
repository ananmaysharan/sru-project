import {defineField} from 'sanity'

const languages = [
  {group: 'english', label: 'English', suffix: 'En'},
  {group: 'french', label: 'French', suffix: 'Fr'},
] as const

function fieldName(name: string, suffix: string) {
  return `${name}${suffix}`
}

export function bilingualString(name: string, title: string, description?: string) {
  return languages.map(({group, label, suffix}) =>
    defineField({
      name: fieldName(name, suffix),
      title: `${title} (${label})`,
      type: 'string',
      group,
      description,
      validation: (rule) => rule.required(),
    }),
  )
}

export function bilingualText(name: string, title: string, description?: string) {
  return languages.map(({group, label, suffix}) =>
    defineField({
      name: fieldName(name, suffix),
      title: `${title} (${label})`,
      type: 'text',
      rows: 5,
      group,
      description,
      validation: (rule) => rule.required(),
    }),
  )
}

export function bilingualRichText(name: string, title: string, description?: string) {
  return languages.map(({group, label, suffix}) =>
    defineField({
      name: fieldName(name, suffix),
      title: `${title} (${label})`,
      type: 'restrictedRichText',
      group,
      description,
      validation: (rule) => rule.required().min(1),
    }),
  )
}

export const languageGroups = [
  {name: 'english', title: 'English', default: true},
  {name: 'french', title: 'French'},
]
