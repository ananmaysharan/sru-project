import type {StructureResolver} from 'sanity/structure'

const singletonItems = [
  {schemaType: 'siteSettings', documentId: 'siteSettings', title: 'Site settings'},
  {schemaType: 'introductionPage', documentId: 'introductionPage', title: 'Introduction'},
  {schemaType: 'supplyPage', documentId: 'supplyPage', title: 'Supply'},
  {
    schemaType: 'healthOutcomesPage',
    documentId: 'healthOutcomesPage',
    title: 'Health outcomes',
  },
  {
    schemaType: 'postOccupancyPage',
    documentId: 'postOccupancyPage',
    title: 'Post occupancy evaluation',
  },
  {schemaType: 'resourcesPage', documentId: 'resourcesPage', title: 'News sources'},
  {schemaType: 'bibliographyPage', documentId: 'bibliographyPage', title: 'Bibliography'},
] as const

export const singletonTypes = new Set(singletonItems.map((item) => item.schemaType))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items(
      singletonItems.map(({schemaType, documentId, title}) =>
        S.listItem()
          .id(documentId)
          .title(title)
          .schemaType(schemaType)
          .child(S.document().schemaType(schemaType).documentId(documentId).title(title)),
      ),
    )
