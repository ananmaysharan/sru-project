import {mkdir, writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
import {getCliClient} from '../../studio/node_modules/sanity/lib/cli.js';
import {correctFrenchCopy} from './french-copy-corrections';

// Run from studio: npm exec sanity exec -- ../scripts/sanity/fix-french-copy.ts --with-user-token -- --apply
// Dry run unless --apply is provided. Patch only existing French text, with revision guards.
const client = getCliClient({apiVersion: '2026-09-07'}).withConfig({useCdn: false, perspective: 'raw'});
const scopes = {
    bibliographyPage: {kind: 'bibliography', field: 'sectionsFr'},
    resourcesPage: {kind: 'resources', field: 'sectionsFr'},
    introductionPage: {kind: 'introduction', field: 'acknowledgementsFr'},
} as const;
const ids = Object.keys(scopes).flatMap(id => [id, `drafts.${id}`]);
const docs = await client.fetch('*[_id in $ids]', {ids});
for (const id of Object.keys(scopes)) if (!docs.some((d: any) => d._id === id)) throw new Error(`Missing ${id}`);
let transaction = client.transaction();
const expected: any[] = [];
for (const doc of docs) {
    const scope = scopes[doc._id.replace(/^drafts\./, '') as keyof typeof scopes];
    if (!Array.isArray(doc[scope.field])) throw new Error(`Missing ${doc._id}.${scope.field}`);
    let count = 0;
    function walk(value: any): any {
        if (Array.isArray(value)) return value.map(walk);
        if (!value || typeof value !== 'object') return value;
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
            if (key === 'text' && typeof entry === 'string') {
                const next = correctFrenchCopy(entry, scope.kind);
                if (next !== entry) count++;
                return [key, next];
            }
            return [key, walk(entry)];
        }));
    }
    const next = walk(doc[scope.field]);
    console.log(`${doc._id}: ${count} corrected text fields; all other fields preserved`);
    if (count) {
        transaction = transaction.patch(client.patch(doc._id).ifRevisionId(doc._rev).set({[scope.field]: next}));
        expected.push({...doc, [scope.field]: next});
    }
}
if (process.argv.includes('--apply') && expected.length) {
    await mkdir('../.sanity-import', {recursive: true});
    const backup = `../.sanity-import/before-french-copy-${Date.now()}.json`;
    await writeFile(backup, JSON.stringify(docs, null, 2), {flag: 'wx', mode: 0o600});
    console.log(`Backup: ${backup}`);
    await transaction.commit();
    for (const doc of expected) {
        const actual = await client.getDocument(doc._id);
        const content = (value: any) => Object.fromEntries(Object.entries(value).filter(([key]) => !['_rev', '_updatedAt'].includes(key)));
        if (!actual || !isDeepStrictEqual(content(doc), content(actual))) throw new Error(`Verification failed: ${doc._id}`);
        console.log(`Verified ${doc._id}, including unchanged English content and links.`);
    }
} else console.log(expected.length ? 'Dry run only; pass --apply to save.' : 'No changes needed.');
