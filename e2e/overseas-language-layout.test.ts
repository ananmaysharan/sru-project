import {expect, test} from '@playwright/test';

test('overseas atlas keeps its internal layout and selection when switching languages', async ({page}) => {
    await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/supply?lang=en`);
    await page.evaluate(() => document.fonts.ready);
    const atlas = page.locator('.overseas-atlas');
    const measure = () => atlas.evaluate(el => {
        const origin = el.getBoundingClientRect();
        return [el, ...el.querySelectorAll('h4, .overseas-summary, .overseas-grid, .territory-tile, .territory-tile svg')].map(item => {
            const b = item.getBoundingClientRect();
            return [b.x - origin.x, b.y - origin.y, b.width, b.height];
        });
    });
    for (const width of [1280, 900, 740, 640, 390, 320]) {
        await page.setViewportSize({width, height: 900});
        for (const index of [0, 4, 8, 10]) {
            await atlas.locator('button').nth(index).click();
            await page.getByRole('button', {name: 'English', exact: true}).click();
            await expect(page.locator('html')).toHaveAttribute('lang', 'en');
            const english = await measure();
            await page.getByRole('button', {name: 'Français', exact: true}).click();
            await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
            const french = await measure();
            expect(french.length).toBe(english.length);
            for (let i = 0; i < english.length; i++) for (let axis = 0; axis < 4; axis++) {
                expect(french[i][axis], `${width}px, territory ${index}, element ${i}, axis ${axis}`).toBeCloseTo(english[i][axis], 0);
            }
            await expect(atlas.locator('button').nth(index)).toHaveAttribute('aria-pressed', 'true');
            expect(await atlas.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
        }
    }
});
