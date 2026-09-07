import {getResourcesPageContent} from '$lib/server/resources-content';

export async function load() {
    return {content: await getResourcesPageContent()};
}
