import { expect, test } from '@playwright/test';
import { bibliographySectionsFr } from '../src/lib/data/bibliography-fr';

test('French bibliography retains document text, inline links, and emphasis', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/bibliography?lang=fr`);
    const bibliography = page.locator('#bibliography');
    await expect(bibliography.getByRole('heading', { level: 1 })).toHaveText('Bibliographie');
    const groups = bibliography.locator('.index-group');
    await expect(groups).toHaveCount(7);
    await expect(bibliography.locator('li')).toHaveCount(40);
    await expect(bibliography.getByRole('link', { name: 'Source', exact: true })).toHaveCount(0);
    await expect(bibliography.locator('li a')).toHaveCount(31);
    for (const [sectionIndex, section] of bibliographySectionsFr.entries()) {
        const group = groups.nth(sectionIndex);
        await expect(group.getByRole('heading')).toHaveText(section.title);
        for (const [itemIndex, item] of section.items.entries()) {
            const entry = group.locator('li').nth(itemIndex);
            expect((await entry.textContent())!.trim()).toBe(item.segments.map(s => s.text).join('').trim());
            const links = item.segments.filter(s => s.href);
            await expect(entry.locator('a')).toHaveCount(links.length);
            for (const [linkIndex, segment] of links.entries()) {
                const link = entry.locator('a').nth(linkIndex);
                expect(await link.textContent()).toBe(segment.text);
                await expect(link).toHaveAttribute('href', segment.href!);
            }
            expect(await entry.locator('em').allTextContents()).toEqual(item.segments.filter(s => s.italic).map(s => s.text));
        }
    }
    const reports = groups.nth(2);
    expect(await reports.innerText()).not.toMatch(/\(,|" , Paris|Clément Boisseuil|Emilie Moreau/);
    await expect(groups.first().locator('li').nth(2)).toContainText('Lance Freeman et Magda Maaoui');
    // Existing source typography is intentional, not silently normalized.
    await expect(groups.first().locator('li').first()).toContainText('Octobre 2025');
    await expect(groups.nth(6).locator('li').nth(5)).toContainText('Libération(publié');
    await page.screenshot({ path: 'test-results/bibliography-fr-top.png' });
    await reports.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/bibliography-fr-reports.png' });
});

test('English bibliography keeps its existing links and requested deletions', async ({ page }) => {
    await page.goto(`${process.env.PLAYWRIGHT_SITE_PATH ?? '/sru-project'}/bibliography?lang=en`);
    const bibliography = page.locator('#bibliography');
    await expect(bibliography.getByRole('heading', { level: 1 })).toHaveText('Bibliography');
    await expect(bibliography.locator('li')).toHaveCount(40);
    await expect(bibliography.getByRole('link', { name: 'Source', exact: true })).toHaveCount(0);
    await expect(bibliography.getByRole('link', { name: 'Actions en santé publique : sensibilisation, promotion et prévention', exact: true })).toBeVisible();
    expect(await bibliography.textContent()).not.toMatch(/Freeman, and|Clément Boisseuil|with contributions by Jerold/);
    await expect(bibliography.getByRole('heading', { name: 'Media mentions of my work' })).toHaveCount(1);
});
