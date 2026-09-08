import {getPostOccupancyPageContent} from '$lib/server/post-occupancy-content';

export async function load() {
    return {content: await getPostOccupancyPageContent()};
}
