import {expect, test} from '@playwright/test';
import {HEALTH_HOUSING_ROWS} from '../src/lib/data/charts/health-housing-matrix';

const studyCount = HEALTH_HOUSING_ROWS.flatMap(row => row.studies).filter(Boolean).length;
for (const language of ['en', 'fr']) {
    test(`health evidence matrix stays readable through responsive layouts (${language})`, async ({page}) => {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/health-outcomes?lang=${language}`);
        const figure = page.locator('figure.diagram');
        for (const width of [1600, 1280, 1262, 1024, 800, 640, 390, 320, 1600]) {
            await page.setViewportSize({width, height: 900});
            await figure.scrollIntoViewIfNeeded();
            const bounds = (await figure.boundingBox())!;
            expect(bounds.x).toBeGreaterThanOrEqual(0);
            expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
            const compact = bounds.width < 1232;
            const content = figure.locator(compact ? '.mobile-diagram' : '.diagram-scroll');
            await expect(content).toBeVisible();
            await expect(figure.locator(compact ? '.diagram-scroll' : '.mobile-diagram')).toBeHidden();
            expect(await content.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
            if (compact) {
                await expect(content.locator('details')).toHaveCount(studyCount);
                const details = content.locator('details').first();
                await details.locator('summary').click();
                await expect(details.locator('a')).toBeVisible();
                await expect(details.locator('a')).toHaveAttribute('href', HEALTH_HOUSING_ROWS.flatMap(row => row.studies).find(Boolean)!.url);
                await details.locator('summary').click();
            } else {
                await expect(content.locator('.study-link')).toHaveCount(studyCount);
                const overflow = await content.locator('.outcome-label, .factor-label, .subcategory-label').evaluateAll(items =>
                    items.filter(el => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1).map(el => el.textContent));
                expect(overflow).toEqual([]);
                const link = content.locator('.study-link').first();
                await link.evaluate(el => (el as HTMLElement).blur());
                await link.scrollIntoViewIfNeeded();
                await link.focus();
                const tooltip = page.getByRole('tooltip');
                await expect(tooltip).toBeVisible();
                const box = (await tooltip.boundingBox())!;
                expect(box.x).toBeGreaterThanOrEqual(0);
                expect(box.y).toBeGreaterThanOrEqual(0);
                expect(box.x + box.width).toBeLessThanOrEqual(width);
                expect(box.y + box.height).toBeLessThanOrEqual(900);
                await page.keyboard.press('Escape');
                await expect(tooltip).toHaveCount(0);
            }
            if ([1600, 1024, 390].includes(width)) {
                await figure.screenshot({path: `test-results/health-matrix-${language}-${width}.png`});
            }
        }
    });
}
