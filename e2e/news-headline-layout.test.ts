import {expect, test} from '@playwright/test';
import {headlines} from '../src/lib/data/charts/news-headlines';

for (const language of ['en', 'fr']) {
    test(`newspaper cards stack inside the chart and keep date connectors (${language})`, async ({page}) => {
        await page.setViewportSize({width: 1600, height: 900});
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/?lang=${language}`);
        const story = page.locator('#story-scroll');
        const chart = story.locator('[data-housing-chart]');
        const cards = chart.locator('[data-headline]');
        await story.evaluate(() => document.fonts.ready);
        let previousRows = 0;

        for (const width of [1600, 1340, 1024, 800, 768]) {
            await page.mouse.move(0, 0);
            // Measure the resting grid only after the previous hover has shrunk.
            await expect.poll(() => cards.evaluateAll(items =>
                items.every(el => Math.abs(el.getBoundingClientRect().width - 140) < 0.01),
            )).toBe(true);
            await page.setViewportSize({width, height: 900});
            await expect.poll(() => chart.evaluate(el => el.clientWidth)).toBe(width - 32);
            await expect(async () => {
                await story.evaluate(el => {
                    const pinned = el.firstElementChild as HTMLElement;
                    const top = parseFloat(getComputedStyle(pinned).top);
                    pinned.scrollTop = 0;
                    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - top
                        + 0.99 * (top + (el as HTMLElement).offsetHeight - innerHeight));
                });
                await expect(cards).toHaveCount(23);
                await expect(cards.last()).toHaveCSS('opacity', '1', {timeout: 2000});
            }).toPass({timeout: 10000});
            await cards.evaluateAll(items => Promise.all(items.flatMap(el =>
                el.getAnimations().map(animation => animation.finished),
            )));
            const geometry = await chart.evaluate(el => {
                const bounds = el.getBoundingClientRect();
                const boxes = Array.from(el.querySelectorAll('[data-headline]'), item => {
                    const r = item.getBoundingClientRect();
                    return {id: item.getAttribute('data-headline'), left: r.left - bounds.left, top: r.top - bounds.top,
                        right: r.right - bounds.left, bottom: r.bottom - bounds.top};
                });
                return {width: bounds.width, height: bounds.height, boxes};
            });
            for (const [i, box] of geometry.boxes.entries()) {
                expect(box.left).toBeGreaterThanOrEqual(11);
                expect(box.right).toBeLessThanOrEqual(geometry.width - 11);
                expect(box.bottom).toBeLessThanOrEqual(geometry.height);
                for (const other of geometry.boxes.slice(i + 1)) {
                    expect(box.right <= other.left || other.right <= box.left
                        || box.bottom <= other.top || other.bottom <= box.top,
                    `${width}: ${JSON.stringify(box)} overlaps ${JSON.stringify(other)}`).toBe(true);
                }
            }
            const rows = new Set(geometry.boxes.map(box => Math.round(box.top))).size;
            expect(rows).toBeGreaterThanOrEqual(previousRows);
            if (width === 1600) expect(rows).toBe(3);
            if (width === 768) expect(rows).toBeGreaterThan(3);
            previousRows = rows;

            for (const id of ['March 2015', 'December 2020', 'October 2024']) {
                await page.mouse.move(0, 0);
                const card = chart.locator(`[data-headline="${id}"]`);
                await card.hover();
                await expect.poll(() => card.evaluate(el => el.getBoundingClientRect().width)).toBeCloseTo(350, 0);
                const connector = chart.locator(`[data-headline-connector="${id}"]`);
                await expect(connector).toHaveCount(1);
                const points = await connector.evaluate(el => {
                    if (el.tagName === 'line') return [
                        {x: Number(el.getAttribute('x1')), y: Number(el.getAttribute('y1'))},
                        {x: Number(el.getAttribute('x2')), y: Number(el.getAttribute('y2'))},
                    ];
                    return Array.from((el as SVGPolylineElement).points, p => ({x: p.x, y: p.y}));
                });
                const expectedX = 100 + (geometry.width - 200) * (headlines.find(h => h.id === id)!.frac - 2015) / 10;
                expect(points[0].x).toBeCloseTo(expectedX, 1);
                const lineY = await chart.locator('svg path').evaluate((el, x) => {
                    const path = el as SVGPathElement;
                    let low = 0, high = path.getTotalLength();
                    for (let i = 0; i < 40; i++) {
                        const mid = (low + high) / 2;
                        if (path.getPointAtLength(mid).x < x) low = mid;
                        else high = mid;
                    }
                    return path.getPointAtLength((low + high) / 2).y;
                }, expectedX);
                expect(points[0].y).toBeCloseTo(lineY + 3, 1);
                const chartBounds = (await chart.boundingBox())!;
                const cardBounds = (await card.boundingBox())!;
                expect(cardBounds.x).toBeGreaterThanOrEqual(chartBounds.x + 11);
                expect(cardBounds.x + cardBounds.width).toBeLessThanOrEqual(chartBounds.x + chartBounds.width - 11);
                expect(cardBounds.y + cardBounds.height).toBeLessThanOrEqual(chartBounds.y + chartBounds.height);
                expect(points.at(-1)!.x).toBeCloseTo(cardBounds.x + cardBounds.width / 2 - chartBounds.x, 1);
                expect(points.at(-1)!.y).toBeCloseTo(cardBounds.y - chartBounds.y, 1);
            }
            if (width === 1024) await page.screenshot({path: `test-results/news-headlines-${language}-1024.png`});
        }
        for (const width of [767, 680, 640, 390]) {
            await page.setViewportSize({width, height: 900});
            await expect(cards).toHaveCount(0);
            await expect(page.locator('[data-mobile-headlines]')).toBeVisible();
        }
    });
}
