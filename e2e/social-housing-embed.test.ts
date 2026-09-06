import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1500, height: 1000 } });

for (const language of ['en', 'fr']) {
    test(`housing growth stays visible when an iframe becomes shorter (${language})`, async ({ page }) => {
        const site = process.env.PLAYWRIGHT_SITE_URL ?? 'http://localhost:4173/sru-project';
        await page.setContent(`<iframe title="Housing story" src="${site}/?lang=${language}" style="width:1440px;height:900px;border:0"></iframe>`);
        const iframe = page.locator('iframe');
        const frame = page.frameLocator('iframe');
        const story = frame.locator('#story-scroll');
        const path = story.locator('svg path');
        await expect(path).toHaveCount(1);
        await story.evaluate(() => document.fonts.ready);

        for (const height of [900, 700, 500, 350, 900]) {
            await iframe.evaluate((el, h) => { el.style.height = `${h}px`; }, height);
            await story.evaluate((el) => {
                const pinned = el.firstElementChild as HTMLElement;
                const navHeight = parseFloat(getComputedStyle(pinned).top);
                pinned.scrollTop = 0;
                window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - navHeight
                    + 0.48 * (navHeight + (el as HTMLElement).offsetHeight - window.innerHeight));
            });

            // Check the rendered geometry, including after shrinking and growing
            // the actual iframe. The data's last point must stay above its first.
            await expect.poll(() => path.evaluate(el => el.getBBox().height)).toBeGreaterThan(110);
            expect(await path.evaluate(el =>
                el.getPointAtLength(0).y - el.getPointAtLength(el.getTotalLength()).y,
            )).toBeGreaterThan(110);

            const pinned = story.locator(':scope > div');
            if (height < 900) {
                await expect.poll(() => pinned.evaluate(el => el.scrollHeight - el.clientHeight)).toBeGreaterThan(0);
                await pinned.evaluate(el => { el.scrollTop = el.scrollHeight; });
                // The law cards remain reachable inside the short viewport.
                const cards = story.locator('[data-policy-cards]');
                expect(await cards.evaluate(el => {
                    const frame = document.querySelector('#story-scroll')!.firstElementChild!;
                    return el.getBoundingClientRect().bottom <= frame.getBoundingClientRect().bottom + 1;
                })).toBe(true);
            } else {
                await expect.poll(() => pinned.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
            }
            if (height === 500) {
                await expect(story.locator('div.absolute.pointer-events-none.select-none.flex > div').last()).toHaveCSS('opacity', '1');
                await page.screenshot({ path: `test-results/housing-embed-${language}.png` });
            }
        }
    });
}

for (const embedWidth of [320, 280]) {
    test(`housing chart uses its full width in a ${embedWidth}px mobile embed`, async ({ page }) => {
        const site = process.env.PLAYWRIGHT_SITE_URL ?? 'http://localhost:4173/sru-project';
        await page.setContent(`<iframe title="Housing story" src="${site}/?lang=en" style="width:${embedWidth}px;height:600px;border:0"></iframe>`);
        const frame = page.frameLocator('iframe');
        const story = frame.locator('#story-scroll');
        const path = story.locator('svg path');
        await expect(path).toHaveCount(1);
        await story.evaluate(() => document.fonts.ready);

        await story.evaluate((el) => {
            const pinned = el.firstElementChild as HTMLElement;
            const navHeight = parseFloat(getComputedStyle(pinned).top);
            window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - navHeight
                + 0.48 * (navHeight + (el as HTMLElement).offsetHeight - window.innerHeight));
            pinned.scrollTop = pinned.scrollHeight;
        });

        await expect.poll(() => path.evaluate(el => el.getBBox().width)).toBeGreaterThan(embedWidth - 80);
        await expect.poll(() => path.evaluate(el => el.getBBox().height)).toBeGreaterThan(110);
        expect(await path.evaluate(el =>
            el.getPointAtLength(0).y - el.getPointAtLength(el.getTotalLength()).y,
        )).toBeGreaterThan(110);

        const cards = story.locator('[data-policy-cards]');
        await expect(cards.locator('[data-policy-card]').first()).toHaveCSS('width', '210px');
        expect(await cards.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
        expect(await story.locator('svg text').allTextContents()).toEqual([
            '2000', '2005', '2010', '2015', '2020', '2025',
        ]);

        await page.screenshot({ path: `test-results/housing-embed-${embedWidth}px.png` });
    });
}
