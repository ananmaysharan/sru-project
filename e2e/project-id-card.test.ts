import { expect, test, type Page } from '@playwright/test';
import { positionProjectCard } from '../src/lib/components/sections/project-card-position';

test('positioning stays beside the cursor and clamps the full card to the viewport', () => {
    const viewport = { width: 1440, height: 900 };
    const size = { width: 512, height: 550 };
    expect(positionProjectCard({ x: 200, y: 100 }, viewport, size)).toEqual({ left: 212, top: 112 });
    for (const y of [70, 300, 880]) {
        const position = positionProjectCard({ x: 1420, y }, viewport, size);
        expect(position.left).toBe(1420 - size.width - 12);
        expect(position.top).toBeGreaterThanOrEqual(12);
        expect(position.top + size.height).toBeLessThanOrEqual(viewport.height - 12);
    }
});

async function openProjectBand(page: Page, language = 'en') {
    await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/post-occupancy-evaluation?lang=${language}`);
    await page.evaluate(() => document.fonts.ready);
    const band = page.locator('.case-study-index');
    await band.scrollIntoViewIfNeeded();
    // Allow the page's scroll/resize observers to settle before hovering.
    await page.evaluate(() => new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await page.waitForTimeout(350);
    return band;
}

test.use({ viewport: { width: 1440, height: 900 } });

for (const language of ['en', 'fr']) {
    test(`project profiles open immediately and track the pointer (${language})`, async ({ page }) => {
        const band = await openProjectBand(page, language);
        const first = band.getByRole('button', { name: 'Paris: Samaritaine', exact: true });
        const trigger = (await first.boundingBox())!;
        const card = page.getByRole('tooltip');
        await page.mouse.move(trigger.x + 20, trigger.y + 25);
        await expect(card).toBeVisible({ timeout: 500 });
        await expect(card.getByRole('heading')).toHaveText('La Samaritaine');
        const before = (await card.boundingBox())!;
        await page.mouse.move(trigger.x + 60, trigger.y + 25, { steps: 10 });
        await expect.poll(async () => (await card.boundingBox())!.x).toBeCloseTo(before.x + 40, 0);

        const bounds = (await card.boundingBox())!;
        expect(bounds.x).toBeCloseTo(trigger.x + 60 + 12, 0);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(889);
        expect(await card.evaluate(el => el.scrollHeight <= el.clientHeight)).toBe(true);
        expect(await card.evaluate(el => el.parentElement === document.body)).toBe(true);
        expect(await card.evaluate(el => {
            const bounds = el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(bounds.x + 20, bounds.y + 20));
        })).toBe(true);

        for (const [name, title] of [
            ['Tour Bois-le-Prêtre', 'Tour Bois-le-Prêtre'],
            ['Rue Jean-Bart', language === 'fr' ? '12, rue Jean-Bart' : '12 Rue Jean-Bart'],
            ['Talgen', 'Talgen'],
            ['Les Jasmins · La Réunion', language === 'fr' ? 'Les Jasmins, écoquartier Cœur de Ville' : 'Les Jasmins, Cœur de Ville Eco-District'],
        ]) {
            await page.mouse.move(5, 5);
            await expect(card).toHaveCount(0);
            await band.getByRole('button', { name: new RegExp(name) }).hover();
            await expect(card.getByRole('heading')).toHaveText(title, { timeout: 500 });
            expect(await card.evaluate(el => el.scrollHeight <= el.clientHeight)).toBe(true);
        }
        await page.screenshot({ path: `test-results/project-profile-${language}.png` });
        await page.mouse.move(5, 5);
        await expect(card).toHaveCount(0);
        await band.getByRole('button', { name: /Maréchal Fayolle/ }).hover();
        await expect(card).toHaveCount(0, { timeout: 500 });
    });
}

test('profile stays open and stops tracking while reading, then dismisses on exit', async ({ page }) => {
    const band = await openProjectBand(page);
    await band.getByRole('button', { name: 'Paris: Samaritaine', exact: true }).hover();
    const card = page.getByRole('tooltip');
    await expect(card).toBeVisible({ timeout: 500 });
    const bounds = (await card.boundingBox())!;
    await page.mouse.move(bounds.x + 30, bounds.y + 30);
    await page.waitForTimeout(400);
    await expect(card).toBeVisible();
    await page.mouse.move(bounds.x + 120, bounds.y + 80, { steps: 5 });
    await page.waitForTimeout(400);
    await expect(card).toBeVisible();
    expect((await card.boundingBox())!.x).toBe(bounds.x);
    expect((await card.boundingBox())!.y).toBe(bounds.y);
    await page.mouse.move(5, 5);
    await expect(card).toHaveCount(0, { timeout: 700 });
});

test('Escape stays dismissed until a new hover, and keyboard focus opens a profile', async ({ page }) => {
    const band = await openProjectBand(page);
    const first = band.getByRole('button', { name: 'Paris: Samaritaine', exact: true });
    await first.hover();
    const card = page.getByRole('tooltip');
    await expect(card).toBeVisible({ timeout: 500 });
    await page.keyboard.press('Escape');
    const bounds = (await first.boundingBox())!;
    await page.mouse.move(bounds.x + 20, bounds.y + 20);
    await expect(card).toHaveCount(0);
    await page.mouse.move(5, 5);
    await first.hover();
    await expect(card).toBeVisible({ timeout: 500 });
    await page.keyboard.press('Escape');
    await page.mouse.move(5, 5);
    await page.keyboard.press('Tab');
    await first.focus();
    await expect(card).toBeVisible({ timeout: 500 });
    await expect(first).toHaveAttribute('aria-describedby', 'case-study-project-profile');
});

for (const viewport of [{ width: 390, height: 667 }, { width: 844, height: 390 }]) {
    for (const language of ['fr', 'en']) {
        test(`all profile content fits without scrolling at ${viewport.width}x${viewport.height} (${language})`, async ({ page }) => {
            await page.setViewportSize(viewport);
            const band = await openProjectBand(page, language);
            const card = page.getByRole('tooltip');
            await page.keyboard.press('Tab');
            for (const name of ['Samaritaine', 'Tour Bois-le-Prêtre', 'Rue Jean-Bart', 'Talgen', 'Les Jasmins · La Réunion']) {
                await page.keyboard.press('Escape');
                await page.mouse.move(5, 5);
                await expect(card).toHaveCount(0);
                const trigger = band.getByRole('button', { name: new RegExp(name) });
                await trigger.scrollIntoViewIfNeeded();
                await page.evaluate(() => new Promise<void>(resolve =>
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
                await trigger.evaluate(el => el.focus({ preventScroll: true }));
                await expect(card).toBeVisible({ timeout: 500 });
                // Let the measured height update after switching profiles.
                await page.evaluate(() => new Promise<void>(resolve =>
                    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
                const bounds = (await card.boundingBox())!;
                expect(bounds.x).toBeGreaterThanOrEqual(11);
                expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width - 11);
                expect(bounds.y).toBeGreaterThanOrEqual(11);
                expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height - 11);
                expect(await card.evaluate(el => el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth)).toBe(true);
                await expect(card.locator('dl > div')).toHaveCount(8);
            }
            await page.screenshot({ path: `test-results/project-profile-${viewport.width}-${language}.png` });
        });
    }
}
