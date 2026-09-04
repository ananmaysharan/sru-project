import { expect, test, type Page } from '@playwright/test';
import { positionProjectCard } from '../src/lib/components/sections/project-card-position';

test('positioning avoids the band, clamps to the viewport, and does not flip when content resizes', () => {
    const viewport = { width: 1440, height: 900 };
    for (const bandTop of [70, 300, 600]) {
        const anchor = { x: 1420, y: bandTop + 40, bandTop, bandBottom: bandTop + 180 };
        const large = positionProjectCard(anchor, viewport, { width: 512, height: 800 });
        const small = positionProjectCard(anchor, viewport, { width: 512, height: 100 });
        expect(large.left).toBeGreaterThanOrEqual(12);
        expect(large.left + 512).toBeLessThanOrEqual(viewport.width - 12);
        expect(large.top).toBeGreaterThanOrEqual(12);
        expect(large.top + large.maxHeight).toBeLessThanOrEqual(viewport.height - 12);
        expect(large.top >= anchor.bandBottom).toBe(small.top >= anchor.bandBottom);
        expect(large.top >= anchor.bandBottom || large.top + large.maxHeight <= anchor.bandTop).toBe(true);
    }
});

async function openProjectBand(page: Page, language = 'en') {
    await page.goto(`/sru-project/post-occupancy-evaluation?lang=${language}`);
    const band = page.locator('.case-study-index');
    await band.scrollIntoViewIfNeeded();
    // Allow the page's scroll/resize observers to settle before hovering.
    await page.evaluate(() => new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
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
        await page.mouse.move(trigger.x + 60, trigger.y + 25);
        await expect.poll(async () => (await card.boundingBox())!.x).toBeCloseTo(before.x + 40, 0);

        const bounds = (await card.boundingBox())!;
        const bandBounds = (await band.boundingBox())!;
        expect(bounds.y + bounds.height <= bandBounds.y || bounds.y >= bandBounds.y + bandBounds.height).toBe(true);
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
            await band.getByRole('button', { name: new RegExp(name) }).hover();
            await expect(card.getByRole('heading')).toHaveText(title, { timeout: 500 });
        }
        await page.screenshot({ path: `test-results/project-profile-${language}.png` });
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
    await page.mouse.move(bounds.x + 30, bounds.y + 30, { steps: 5 });
    await page.waitForTimeout(400);
    await expect(card).toBeVisible();
    await page.mouse.move(bounds.x + 120, bounds.y + 80, { steps: 5 });
    await page.mouse.wheel(0, 200);
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

test('narrow viewport contains the whole card and permits internal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const band = await openProjectBand(page, 'fr');
    await band.getByRole('button', { name: 'Paris: Samaritaine', exact: true }).hover();
    const card = page.getByRole('tooltip');
    await expect(card).toBeVisible({ timeout: 500 });
    const bounds = (await card.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(11);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(379);
    expect(bounds.y).toBeGreaterThanOrEqual(11);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(833);
    await page.mouse.move(bounds.x + 40, bounds.y + 40);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => card.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
    await page.waitForTimeout(400);
    await expect(card).toBeVisible();
    await page.screenshot({ path: 'test-results/project-profile-narrow.png' });
});
