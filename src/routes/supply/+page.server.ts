import {getSupplyPageContent} from '$lib/server/supply-content';

export async function load() {
    return {content: await getSupplyPageContent()};
}
