import {mkdir, writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import {isDeepStrictEqual} from 'node:util'
import {getCliClient} from '../../studio/node_modules/sanity/lib/cli.js'
import {PROJECT_CARD_FIELD_IDS, PROJECT_CARD_IDS, projectIdCards} from '../../src/lib/data/project-id-cards'

// Run from studio with: npm exec sanity exec -- ../scripts/sanity/add-missing-project-cards.ts --with-user-token -- --apply
// Without --apply, this only reports the proposed additions. Never replace existing editorial content.
const client = getCliClient({apiVersion: '2026-09-07'}).withConfig({useCdn: false, perspective: 'raw'})
const additions = ['gignac-la-nerthe', 'marechal-fayolle'] as const
const baseIds = PROJECT_CARD_IDS.filter((id) => !additions.some((addition) => addition === id))
type Card = {projectId: string; [key: string]: unknown}
type Document = {_id: string; _rev: string; projectCardsEn: Card[]; projectCardsFr: Card[]; [key: string]: unknown}
const documents = await client.fetch<Document[]>(
  '*[_id in ["postOccupancyPage", "drafts.postOccupancyPage"]]',
)
if (!documents.some((document) => document._id === 'postOccupancyPage')) throw new Error('Published document missing.')

let transaction = client.transaction()
const expectedDocuments: Document[] = []
for (const document of documents) {
  const expected = structuredClone(document)
  let changed = false
  for (const [language, field] of [['en', 'projectCardsEn'], ['fr', 'projectCardsFr']] as const) {
    const cards = document[field]
    if (!Array.isArray(cards)) throw new Error(`Missing ${field} in ${document._id}`)
    const ids = cards.map((card) => card.projectId)
    if (ids.length !== new Set(ids).size || !isDeepStrictEqual(ids.slice(0, baseIds.length), baseIds) || ids.some((id) => !PROJECT_CARD_IDS.some((allowed) => id === allowed))) {
      throw new Error(`Unexpected project IDs in ${document._id}.${field}`)
    }
    const missing = additions.filter((id) => !ids.includes(id)).map((id) => {
      const card = projectIdCards[id]!
      return {
        _key: id, _type: 'projectCard', projectId: id, title: card.title[language],
        fields: card.fields.map((entry, index) => ({
          _key: PROJECT_CARD_FIELD_IDS[index], _type: 'projectCardField', fieldId: PROJECT_CARD_FIELD_IDS[index],
          label: entry.label[language], value: entry.value[language], ...(entry.href ? {url: entry.href} : {}),
        })),
      }
    })
    if (!isDeepStrictEqual([...ids, ...missing.map((card) => card.projectId)], PROJECT_CARD_IDS)) {
      throw new Error(`Cannot append cards in the expected order at ${document._id}.${field}`)
    }
    console.log(`${document._id}.${field}: preserving ${cards.length} cards; adding ${missing.map((card) => card.projectId).join(', ') || 'none'}`)
    if (missing.length) {
      expected[field] = [...cards, ...missing]
      changed = true
    }
  }
  if (changed) {
    transaction = transaction.patch(client.patch(document._id).ifRevisionId(document._rev).set({
      projectCardsEn: expected.projectCardsEn,
      projectCardsFr: expected.projectCardsFr,
    }))
    expectedDocuments.push(expected)
  }
}

if (process.argv.includes('--apply') && expectedDocuments.length) {
  const directory = resolve('../.sanity-import')
  await mkdir(directory, {recursive: true})
  const backup = resolve(directory, `before-missing-project-cards-${Date.now()}.json`)
  await writeFile(backup, JSON.stringify(documents, null, 2), {flag: 'wx', mode: 0o600})
  console.log(`Backup saved to ${backup}`)
  await transaction.commit()
  for (const expected of expectedDocuments) {
    const actual = await client.getDocument<Document>(expected._id)
    if (!actual) throw new Error(`Document disappeared: ${expected._id}`)
    const content = (document: Document) => Object.fromEntries(Object.entries(document).filter(([key]) => !['_rev', '_updatedAt'].includes(key)))
    if (!isDeepStrictEqual(content(expected), content(actual))) throw new Error(`Post-migration verification failed: ${expected._id}`)
    console.log(`Verified ${expected._id}: only the missing cards were added; all other content is unchanged.`)
  }
} else {
  console.log(expectedDocuments.length ? 'Dry run: no content changed. Pass --apply to append the cards.' : 'All cards already exist; no changes needed.')
}
