import { expect, test } from '@playwright/test';

const editorialPages = [
    '/',
    '/supply',
    '/health-outcomes',
    '/post-occupancy-evaluation',
];

for (const language of ['en', 'fr']) {
    test(`editorial Markdown renders without visible formatting markers (${language})`, async ({ page }) => {
        for (const path of editorialPages) {
            await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}${path}?lang=${language}`);
            const editorial = page.locator('.editorial-article');
            const text = (await editorial.allTextContents()).join('\n');
            expect(text).not.toContain('*');
            expect(text).not.toContain('__');
            expect(text).not.toContain('<u>');
        }
    });
}

test('French Typologie 1 heading matches the document and renders as one heading', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/post-occupancy-evaluation?lang=fr`);
    const heading = page.getByRole('heading', {
        name: '1. Typologie 1 — Les régimes sélectifs de la Provence',
        exact: true,
    });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('1. Typologie 1 — Les régimes sélectifs de la Provence');
});
