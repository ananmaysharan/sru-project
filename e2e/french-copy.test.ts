import {expect, test} from '@playwright/test';
import {resourceSectionsFr} from '../src/lib/data/resources-fr';

const base = process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project';
test('French press citations retain every corrected entry and source URL', async ({page}) => {
    await page.goto(`${base}/resources?lang=fr`);
    const items = page.locator('main .index-group li');
    const expected = resourceSectionsFr.flatMap(section => section.items);
    await expect(items).toHaveCount(expected.length);
    for (const [i, item] of expected.entries()) {
        await expect(items.nth(i)).toContainText(item.text);
        if (item.url) await expect(items.nth(i).locator('a')).toHaveAttribute('href', item.url);
        else await expect(items.nth(i).locator('a')).toHaveCount(0);
    }
});

test('French percentages and lexicon punctuation are localized', async ({page}) => {
    await page.goto(`${base}/supply?lang=fr`);
    await expect(page.locator('.overseas-atlas')).toContainText('23,5 %');
    await page.getByRole('button', {name: 'Lexique', exact: true}).click();
    const dialog = page.locator('div[lang="fr"]').filter({has: page.getByRole('heading', {name: 'Lexique du tableau de bord'})});
    await expect(dialog).toBeVisible();
    expect(await dialog.textContent()).toContain('intégration\u00a0;');
    expect(await dialog.textContent()).toContain('office public de l’habitat\u00a0;');
});

test('resident quotations keep the original spelling and punctuation', async ({page}) => {
    await page.goto(`${base}/post-occupancy-evaluation?lang=fr`);
    const main = page.locator('main');
    for (const text of ['LidL', 'tout—à l’exception', 'là ou j’habitais', 'en terme d’accès']) {
        await expect(main).toContainText(text);
    }
});
