import {getIntroductionPageContent} from '$lib/server/introduction-content';

export async function load() {
    return {content: await getIntroductionPageContent()};
}
