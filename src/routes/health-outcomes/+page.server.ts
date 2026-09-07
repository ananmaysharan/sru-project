import {getHealthPageContent} from '$lib/server/health-content';

export async function load() {
    return {content: await getHealthPageContent()};
}
