import {expect, test} from '@playwright/test';
import {siteRoutes} from '../src/lib/data/routes';

for (const language of ['en', 'fr']) {
    test(`page navigation has equal widths and correct end-page alignment (${language})`, async ({page}) => {
        for (const {href} of siteRoutes) {
            await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}${href}?lang=${language}`);
            const nav = page.getByRole('navigation', {name: language === 'fr' ? 'Navigation entre les pages' : 'Page navigation', exact: true});
            for (const width of [1280, 800, 390]) {
                await page.setViewportSize({width, height: 900});
                const geometry = await nav.evaluate(el => {
                    const style = getComputedStyle(el);
                    const bounds = el.getBoundingClientRect();
                    return {
                        left: bounds.left + parseFloat(style.paddingLeft),
                        right: bounds.right - parseFloat(style.paddingRight),
                        gap: parseFloat(style.columnGap),
                        links: Array.from(el.querySelectorAll('a'), a => {
                            const r = a.getBoundingClientRect();
                            return {left: r.left, right: r.right, width: r.width};
                        }),
                    };
                });
                const expectedWidth = width >= 640
                    ? (geometry.right - geometry.left - geometry.gap) / 2
                    : geometry.right - geometry.left;
                for (const link of geometry.links) expect(link.width).toBeCloseTo(expectedWidth, 1);
                if (href === '/') {
                    expect(geometry.links).toHaveLength(1);
                    expect(geometry.links[0].right).toBeCloseTo(geometry.right, 1);
                } else if (href === '/bibliography') {
                    expect(geometry.links).toHaveLength(1);
                    expect(geometry.links[0].left).toBeCloseTo(geometry.left, 1);
                } else {
                    expect(geometry.links).toHaveLength(2);
                }
            }
        }
    });
}
