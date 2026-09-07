import {getBibliographyPageContent} from '$lib/server/bibliography-content';

export async function load() {
    return {content: await getBibliographyPageContent()};
}
