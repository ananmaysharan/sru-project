import {expect, test} from '@playwright/test';

for (const language of ['en', 'fr']) {
    test(`health chart controls, hover colors and first map height (${language})`, async ({page}) => {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/health-outcomes?lang=${language}`);
        for (const width of [1280, 800]) {
            await page.setViewportSize({width, height: 900});
            const sidebar = page.locator('[data-health-sidebar]').first();
            await expect.poll(() => sidebar.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
            const legendGap = await sidebar.evaluate(el => {
                const sections = Array.from(el.children);
                return sections.at(-1)!.getBoundingClientRect().top - sections.at(-2)!.getBoundingClientRect().bottom;
            });
            expect(legendGap).toBeLessThanOrEqual(64);
            const bottomGap = await sidebar.evaluate(el => el.getBoundingClientRect().bottom - el.lastElementChild!.getBoundingClientRect().bottom);
            expect(bottomGap).toBeCloseTo(20, 0);
            const firstMap = page.locator('.health-map').first();
            expect((await firstMap.boundingBox())!.height).toBeGreaterThanOrEqual(640);
        }
        await page.setViewportSize({width: 1280, height: 900});
        const legend = page.locator('.region-legend');
        const reset = page.locator('.chart-sidebar').getByRole('button', {name: language === 'fr' ? 'Réinitialiser' : 'Reset', exact: true});
        await expect(reset).toBeDisabled();
        const resetBox = (await reset.boundingBox())!;
        const legendBox = (await legend.boundingBox())!;
        expect(resetBox.y + resetBox.height).toBeLessThanOrEqual(legendBox.y);
        const dot = page.locator('circle[role="img"]').first();
        await expect(dot).toHaveAttribute('fill-opacity', '0.72');
        const color = await dot.getAttribute('fill');
        await dot.dispatchEvent('pointerenter', {clientX: 500, clientY: 400});
        await expect(dot).toHaveAttribute('fill', color!);
        await expect(dot).toHaveAttribute('fill-opacity', '1');
        await expect(dot).toHaveAttribute('stroke', '#ffffff');
        await expect(reset).toBeDisabled();
        await dot.dispatchEvent('pointerleave');
        await expect(dot).toHaveAttribute('fill-opacity', '0.72');
        await expect(dot).toHaveAttribute('stroke', 'none');
        await expect(legend.locator('button').first()).toHaveCSS('opacity', '1');
        await legend.locator('button').first().click();
        await expect(legend.locator('button').first()).toHaveCSS('opacity', '0.35');
        await expect(reset).toBeEnabled();
        await expect(legend.locator('button').first()).toHaveAttribute('aria-pressed', 'false');
        await reset.click();
        await expect(legend.locator('button').first()).toHaveAttribute('aria-pressed', 'true');
        await expect(legend.locator('button').first()).toHaveCSS('opacity', '1');
        await expect(reset).toBeDisabled();
        const ranking = page.locator('.chart-sidebar').getByRole('button', {name: 'Top 20', exact: true});
        await ranking.scrollIntoViewIfNeeded();
        const beforePress = (await ranking.boundingBox())!;
        await page.mouse.move(beforePress.x + beforePress.width / 2, beforePress.y + beforePress.height / 2);
        await page.mouse.down();
        expect((await ranking.boundingBox())!.y).toBeCloseTo(beforePress.y, 2);
        await page.mouse.up();
        await expect(reset).toBeEnabled();
        await reset.click();
        await expect(reset).toBeDisabled();
        const metric = page.locator('.chart-sidebar [data-slot="select-trigger"]');
        const defaultMetric = await metric.textContent();
        await metric.click();
        await page.getByRole('option').nth(1).click();
        await expect(reset).toBeEnabled();
        await reset.click();
        await expect(reset).toBeDisabled();
        await expect(metric).toHaveText(defaultMetric!);
        const search = page.locator('.chart-sidebar input');
        await search.fill('Paris');
        await expect(reset).toBeEnabled();
        await page.getByRole('option').first().click();
        await expect(reset).toBeEnabled();
        await reset.click();
        await expect(search).toHaveValue('');
        await expect(reset).toBeDisabled();
        for (const width of [1280, 800, 390]) {
            await page.setViewportSize({width, height: 900});
            const chartBox = (await page.locator('.chart-panel').boundingBox())!;
            const regionBox = (await legend.boundingBox())!;
            expect(regionBox.y).toBeGreaterThanOrEqual(chartBox.y + chartBox.height - 1);
            expect(regionBox.x).toBeCloseTo(chartBox.x, 0);
            expect(regionBox.width).toBeCloseTo(chartBox.width, 0);
            expect(await page.locator('.chart-sidebar .legend-item').count()).toBe(0);
            expect(await legend.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
            const [first, second] = await legend.locator('button').evaluateAll(buttons => buttons.slice(0, 2).map(button => {
                const box = button.getBoundingClientRect();
                return {x: box.x, y: box.y};
            }));
            if (width === 1280) {
                expect(second.y).toBeCloseTo(first.y, 0);
                expect(second.x).toBeGreaterThan(first.x);
            }
        }
    });
}

test('region pills keep their position when pressed in both charts', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 900});
    for (const [route, selector] of [
        ['/supply', '.noncompliance-chart-shell .filter-pills button'],
        ['/health-outcomes', '.region-options button'],
    ]) {
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}${route}?lang=en`);
        const pill = page.locator(selector).nth(1);
        await page.evaluate(() => document.fonts.ready);
        await pill.scrollIntoViewIfNeeded();
        await pill.hover();
        const before = (await pill.boundingBox())!;
        const pressed = await pill.getAttribute('aria-pressed');
        await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
        await page.mouse.down();
        expect((await pill.boundingBox())!.y).toBeCloseTo(before.y, 2);
        expect(await pill.evaluate(el => parseFloat(getComputedStyle(el).borderRadius))).toBeGreaterThanOrEqual(before.height / 2);
        await page.mouse.up();
        await expect(pill).toHaveAttribute('aria-pressed', pressed === 'true' ? 'false' : 'true');
        if (route === '/health-outcomes') {
            await expect(pill.locator('.legend-swatch')).toHaveCount(1);
            await expect(pill.locator('.legend-swatch')).toHaveCSS('border-radius', '50%');
        }
    }
});
