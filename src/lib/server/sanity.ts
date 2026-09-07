import {createClient} from '@sanity/client';

export const sanityClient = createClient({
    projectId: 'c5o3dddy',
    dataset: 'production',
    apiVersion: '2026-09-07',
    useCdn: false,
    perspective: 'published',
});
