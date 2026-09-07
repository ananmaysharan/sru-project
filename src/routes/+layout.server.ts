import {getSiteSettingsContent} from '$lib/server/site-content';

export async function load() {
    return {siteSettings: await getSiteSettingsContent()};
}
