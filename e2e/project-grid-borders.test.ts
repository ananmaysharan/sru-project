import {expect, test} from '@playwright/test';

test('mobile project grid has single outer borders and one-pixel dividers', async ({page}) => {
    for (const width of [390, 640]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/post-occupancy-evaluation?lang=fr`);
        const index = page.locator('.case-study-mobile-index');
        await expect(index).toBeVisible();
        const layout = await index.evaluate(el => {
            const outer = el.getBoundingClientRect();
            return Array.from(el.querySelectorAll('.case-study-mobile-projects'), grid => {
                const bounds = grid.getBoundingClientRect();
                const cards = Array.from(grid.children, child => child.getBoundingClientRect());
                return {
                    leftInset: bounds.left - outer.left,
                    rightInset: outer.right - bounds.right,
                    topInset: cards[0].top - bounds.top,
                    bottomInset: bounds.bottom - cards.at(-1)!.bottom,
                    gap: cards.length > 1 ? cards[1].left - cards[0].right : 1,
                };
            });
        });
        for (const grid of layout) {
            expect(grid.leftInset).toBeCloseTo(1, 1);
            expect(grid.rightInset).toBeCloseTo(1, 1);
            expect(grid.topInset).toBeCloseTo(1, 1);
            expect(grid.bottomInset).toBeCloseTo(0, 1);
            expect(grid.gap).toBeCloseTo(1, 1);
        }
    }
});
