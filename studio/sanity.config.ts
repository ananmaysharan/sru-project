import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {singletonTypes, structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Loi SRU 25',

  projectId: 'c5o3dddy',
  dataset: 'production',

  plugins: [structureTool({structure})],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },

  document: {
    actions: (actions, context) => {
      if (!singletonTypes.has(context.schemaType)) return actions
      return actions.filter(({action}) => action !== 'duplicate' && action !== 'delete')
    },
  },
})
